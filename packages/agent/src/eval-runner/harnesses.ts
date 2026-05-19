// Harness adapters. Same input (question + repoRoot) → uniform HarnessOutput.

import { spawn } from "node:child_process";
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
    };
  } catch (err) {
    return errorOutput(q.id, "offshoreai-agent", t0, err);
  }
}

// ---------------------------------------------------------------------------
// claude-p — vanilla Claude Code CLI, no typed tools
// ---------------------------------------------------------------------------

const CLAUDE_P_PROMPT_TEMPLATE = (question: string) => `You are answering an eval question against the offshoreai corpus (Jersey-anchored, with adjacent jurisdictions under knowledge/<jurisdiction>/).

Your tools are Read, Glob, Grep, Bash — read-only filesystem access only. You may not invoke any other agent.

Constraints:
- Use ONLY corpus files under knowledge/. Do not draw on training-data knowledge of Jersey or other offshore law.
- Cite every file you read inline using its repo-relative path.
- If the corpus does not answer the question, say so explicitly: "the corpus does not answer this question" — do not confabulate.
- Where last_verified > 180 days, surface that to the reader.

Question:
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
  const prompt = CLAUDE_P_PROMPT_TEMPLATE(q.question);
  const maxTurns = String(opts.maxTurns ?? 20);

  try {
    const stdout = await new Promise<string>((resolveP, rejectP) => {
      // Note on --allowed-tools: the CLI's variadic argument is greedy
      // and will consume subsequent positionals until another flag. Pass
      // the whole tool list as one space-separated string to keep argv
      // boundaries clean. Same for --add-dir which is also variadic.
      const child = spawn(
        "claude",
        [
          "-p",
          "--allowed-tools", "Read Glob Grep Bash",
          "--output-format", "json",
          "--max-turns", maxTurns,
          "--add-dir", opts.repoRoot,
          "--", prompt,
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
