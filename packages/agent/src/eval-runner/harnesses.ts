// Harness adapters. Same input (question + repoRoot) → uniform HarnessOutput.

import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { composeSystemPrompt } from "../compose-system-prompt.js";
import { runCitationVerifier } from "../citation-verifier.js";
import { runQuery } from "../runtime.js";
import { readSessionToolCalls } from "./session-log.js";
import type { EvalQuestion, HarnessName, HarnessOutput } from "./types.js";

export interface HarnessOptions {
  readonly repoRoot: string;
  readonly tagIndexPath?: string;
  readonly maxTurns?: number;
  readonly verify?: boolean;
}

export async function runHarness(
  harness: HarnessName,
  q: EvalQuestion,
  opts: HarnessOptions,
): Promise<HarnessOutput> {
  switch (harness) {
    case "offshoreai-agent":
      return runOffshoreaiAgent(q, opts);
    case "claude-p":
      return runClaudeP(q, opts);
    case "explore-subagent":
      throw new Error("explore-subagent harness can only be driven from inside a parent Claude Code session via the Agent tool — not from a standalone TS process. Use the in-session Agent tool instead.");
  }
}

// ---------------------------------------------------------------------------
// offshoreai-agent — our typed-tools agent
// ---------------------------------------------------------------------------

async function runOffshoreaiAgent(q: EvalQuestion, opts: HarnessOptions): Promise<HarnessOutput> {
  const t0 = Date.now();
  try {
    const r = await runQuery({
      question: q.question,
      repoRoot: opts.repoRoot,
      evalMode: true,
      verify: opts.verify ?? false,
      ...(opts.tagIndexPath ? { tagIndexPath: opts.tagIndexPath } : {}),
      ...(opts.maxTurns ? { maxTurns: opts.maxTurns } : {}),
    });
    return {
      questionId: q.id,
      harness: "offshoreai-agent",
      answer: r.answer,
      turns: r.turns,
      wallClockSeconds: r.durationMs / 1000,
      toolCalls: r.toolCalls,
      usage: {
        inputTokens: r.usage.inputTokens,
        outputTokens: r.usage.outputTokens,
        cacheReadTokens: r.usage.cacheReadInputTokens,
        cacheWriteTokens: r.usage.cacheCreationInputTokens,
      },
      costUsd: r.costUsd,
      ...(r.verifierVerdict ? {
        verifierVerdict: {
          kind: r.verifierVerdict.kind,
          claimsChecked: r.verifierVerdict.claimsChecked,
          claimsWithCitation: r.verifierVerdict.claimsWithCitation,
          notes: r.verifierVerdict.notes,
          rejectCount: r.verifierVerdict.reasons.length,
          costUsd: r.verifierVerdict.costUsd,
        },
      } : {}),
      systemPrompt: r.systemPrompt,
    };
  } catch (err) {
    return errorOutput(q.id, "offshoreai-agent", t0, err);
  }
}

// ---------------------------------------------------------------------------
// claude-p — vanilla Claude Code CLI, no typed tools
//
// Loads the same system prompt as the offshoreai-agent harness
// (prompts/system.md) so the comparison is apples-to-apples — the
// difference between the harnesses is then purely tool surface + the
// citation verifier, not the discipline.
//
// --bare turns off CLAUDE.md auto-discovery, hooks, plugin sync,
// auto-memory etc. so the control is genuinely isolated.
// ---------------------------------------------------------------------------

const CLAUDE_P_USER_MESSAGE = (question: string) => `Question:
${question}

Produce an answer in your own words. End with a numbered list of cited files.`;

interface ClaudePResultEvent {
  type: "result";
  subtype: string;
  result: string;
  session_id?: string;
  num_turns?: number;
  total_cost_usd?: number;
  duration_ms?: number;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
}

async function runClaudeP(q: EvalQuestion, opts: HarnessOptions): Promise<HarnessOutput> {
  const t0 = Date.now();
  const userMessage = CLAUDE_P_USER_MESSAGE(q.question);
  const maxTurns = String(opts.maxTurns ?? 20);

  // Compose the same system prompt the offshoreai-agent harness uses
  // (prompts/system.md + taxonomy block + orientation surfaces), so
  // the control and the production agent receive byte-identical
  // system-prompt context. Write to a temp file because the CLI
  // takes a file path, not a string.
  const composed = await composeSystemPrompt({
    repoRoot: opts.repoRoot,
    ...(opts.tagIndexPath ? { tagIndexPath: opts.tagIndexPath } : {}),
  });
  const tmpDir = mkdtempSync(join(tmpdir(), "claude-p-prompt-"));
  const systemPromptPath = join(tmpDir, "system.md");
  writeFileSync(systemPromptPath, composed.text, "utf8");
  const systemPromptProvenance = {
    source: "prompts/system.md",
    appendBytes: composed.bytes,
    appendSha256: composed.sha256,
  };

  try {
    const stdout = await new Promise<string>((resolveP, rejectP) => {
      // Note on --allowed-tools: the CLI's variadic argument is greedy
      // and will consume subsequent positionals until another flag. Pass
      // the whole tool list as one space-separated string to keep argv
      // boundaries clean. Same for --add-dir which is also variadic.
      //
      // --bare turns off CLAUDE.md auto-discovery, hooks, plugin sync,
      // and auto-memory so the control is isolated to the explicitly-
      // provided --system-prompt-file. Without --bare, claude -p would
      // load the repo's CLAUDE.md (now dev-only) into the system prompt,
      // contaminating the control.
      const child = spawn(
        "claude",
        [
          "-p",
          "--bare",
          "--system-prompt-file", systemPromptPath,
          "--allowed-tools", "Read Glob Grep Bash",
          "--output-format", "json",
          "--max-turns", maxTurns,
          "--add-dir", opts.repoRoot,
          "--", userMessage,
        ],
        { cwd: opts.repoRoot, env: process.env, stdio: ["ignore", "pipe", "pipe"] },
      );
      let out = "";
      let err = "";
      child.stdout.on("data", (d) => { out += d.toString(); });
      child.stderr.on("data", (d) => { err += d.toString(); });
      child.on("error", rejectP);
      child.on("close", (code) => {
        if (code !== 0 && !out) rejectP(new Error(`claude -p exited ${code}: ${err}`));
        else resolveP(out);
      });
    });

    const parsed = JSON.parse(stdout) as Array<{ type: string }>;
    const resultEvt = parsed.find((e): e is ClaudePResultEvent => e.type === "result") as ClaudePResultEvent | undefined;
    if (!resultEvt) throw new Error("No result event in claude -p output");

    // claude -p's --output-format json envelope doesn't enumerate
    // individual tool calls, but Claude Code persists the full session
    // JSONL to ~/.claude/projects/<encoded-cwd>/<session_id>.jsonl.
    // Read it back to populate trajectory.toolCalls.
    const toolCalls = resultEvt.session_id
      ? await readSessionToolCalls(opts.repoRoot, resultEvt.session_id)
      : [];

    // Run the citation-verifier on the claude-p answer too if requested.
    // The verifier is harness-agnostic — it reads the answer and
    // checks citations against the corpus, regardless of how the
    // answer was produced.
    let verifierVerdict;
    if (opts.verify && resultEvt.result?.trim().length) {
      const v = await runCitationVerifier({
        repoRoot: opts.repoRoot,
        candidateAnswer: resultEvt.result,
        toolCallLog: toolCalls.map((c) => ({ name: c.name, inputDigest: c.inputDigest })),
      });
      verifierVerdict = {
        kind: v.kind,
        claimsChecked: v.claimsChecked,
        claimsWithCitation: v.claimsWithCitation,
        notes: v.notes,
        rejectCount: v.reasons.length,
        costUsd: v.costUsd,
      };
    }

    return {
      questionId: q.id,
      harness: "claude-p",
      answer: resultEvt.result,
      turns: resultEvt.num_turns ?? 0,
      wallClockSeconds: (Date.now() - t0) / 1000,
      toolCalls,
      usage: {
        inputTokens: resultEvt.usage?.input_tokens ?? 0,
        outputTokens: resultEvt.usage?.output_tokens ?? 0,
        cacheReadTokens: resultEvt.usage?.cache_read_input_tokens ?? 0,
        cacheWriteTokens: resultEvt.usage?.cache_creation_input_tokens ?? 0,
      },
      costUsd: resultEvt.total_cost_usd ?? 0,
      ...(verifierVerdict ? { verifierVerdict } : {}),
      systemPrompt: systemPromptProvenance,
    };
  } catch (err) {
    return errorOutput(q.id, "claude-p", t0, err);
  }
}

// ---------------------------------------------------------------------------

function errorOutput(questionId: string, harness: HarnessName, t0: number, err: unknown): HarnessOutput {
  return {
    questionId,
    harness,
    answer: `# DISPATCH ERROR\n\n${(err as Error).message ?? String(err)}`,
    turns: 0,
    wallClockSeconds: (Date.now() - t0) / 1000,
    toolCalls: [],
    usage: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
    costUsd: 0,
    error: (err as Error).message ?? String(err),
  };
}
