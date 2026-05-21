// Agent runtime — composes the SDK query() with our typed corpus tools
// and the baseline system prompt.

import { query } from "@anthropic-ai/claude-agent-sdk";
import {
  corpusAllowedToolNames,
  createCorpusToolsServer,
} from "@offshoreai/tools-corpus";
import { baselineSystemPrompt } from "./baseline-system-prompt.js";
import { runCitationVerifier, type VerifierVerdict } from "./citation-verifier.js";
import { buildTaxonomyBlock } from "./taxonomy-block.js";
import {
  makeWormholeDraftCanUseTool,
  WORMHOLE_STAGING_SUBDIR,
} from "./wormhole-draft-guard.js";

// Appended to the system prompt only when wormhole drafting is enabled.
// The drafting step is a side artifact — it must never change the answer
// returned to the user (it is emitted via a Write tool_use, not prose).
const WORMHOLE_DRAFTING_BLOCK = `

# Wormhole drafting (enabled this session)

After you finish a substantive answer, judge whether you produced a
*generalised, reusable* insight worth compiling into a shortcut node.
Draft a wormhole candidate ONLY when ALL of these hold:
- answering required non-trivial traversal (several files, or a grep sweep);
- the sources you used are stable doctrine (not frontier / high-decay);
- the insight generalises to a task-class beyond this specific question.

If so, use \`Write\` to create a candidate at
\`${WORMHOLE_STAGING_SUBDIR}/<persona-or-section>/<task-slug>.md\` containing:
- frontmatter: title, jurisdiction, category, \`status: draft\`,
  \`last_verified\` today, 5–9 tags drawn from TAGS.md, \`derived: true\`, and
  \`derived_from\` listing the PRIMARY files you actually used (repo-relative
  paths); then
- a tight, task-general distillation with the authoritative citations
  resolved inline.

Rules: cite only primary nodes, never another derived node. Do NOT draft for
narrow single-fact questions. The draft is a side artifact — it must not
change the answer you give the user. You may only write under
\`${WORMHOLE_STAGING_SUBDIR}/\`; writes elsewhere are denied.`;

export interface RunQueryOptions {
  /** The user's question. */
  readonly question: string;
  /** Repo root containing the knowledge/jersey/ corpus. */
  readonly repoRoot: string;
  /** Optional path (relative to repoRoot) to a pre-compiled tag-index.json. */
  readonly tagIndexPath?: string;
  /** Cap on agent loop iterations. Default 20. */
  readonly maxTurns?: number;
  /** Toggle: append a one-line eval framing to the user prompt. Default false. */
  readonly evalMode?: boolean;
  /** Toggle: run the citation-verifier on the final answer. Default false. */
  readonly verify?: boolean;
  /**
   * Toggle: allow the agent to draft wormhole candidates. When true, the
   * agent gains a sandboxed Write lane (only under wormholes/candidates/)
   * and the drafting-trigger instructions. Off by default — the normal
   * answering/eval path is read-only and unchanged. Phase C2.
   */
  readonly enableWormholeDrafting?: boolean;
}

export interface RunQueryResult {
  readonly answer: string;
  readonly turns: number;
  readonly durationMs: number;
  readonly usage: {
    readonly inputTokens: number;
    readonly outputTokens: number;
    readonly cacheCreationInputTokens: number;
    readonly cacheReadInputTokens: number;
  };
  readonly costUsd: number;
  readonly toolCalls: ReadonlyArray<{
    readonly name: string;
    readonly inputDigest: string;
    readonly isError: boolean;
  }>;
  /** Citation-verifier verdict if --verify was requested. */
  readonly verifierVerdict?: VerifierVerdict;
}

export async function runQuery(opts: RunQueryOptions): Promise<RunQueryResult> {
  const started = Date.now();

  const corpusServer = await createCorpusToolsServer(
    opts.tagIndexPath
      ? { repoRoot: opts.repoRoot, tagIndexPath: opts.tagIndexPath }
      : { repoRoot: opts.repoRoot },
  );

  const taxonomyBlock = opts.tagIndexPath
    ? await buildTaxonomyBlock(opts.repoRoot, opts.tagIndexPath)
    : "";
  const drafting = opts.enableWormholeDrafting ?? false;
  const fullSystemPrompt =
    baselineSystemPrompt + taxonomyBlock + (drafting ? WORMHOLE_DRAFTING_BLOCK : "");

  const allowedTools = [
    ...corpusAllowedToolNames(),
    "Read",
    "Glob",
    "Grep",
    ...(drafting ? ["Write"] : []),
  ];

  const prompt = opts.evalMode
    ? `Answer the following eval question against the offshoreai Jersey corpus. Follow the citation, freshness, source-hierarchy, and refusal rules in your system prompt.\n\nQuestion:\n${opts.question}`
    : opts.question;

  const toolCalls: Array<{ name: string; inputDigest: string; isError: boolean }> = [];
  let answer = "";
  let turns = 0;
  let costUsd = 0;
  let usage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationInputTokens: 0,
    cacheReadInputTokens: 0,
  };

  // Read-only path bypasses permissions. The drafting path instead routes
  // every tool call through the sandbox guard (canUseTool), which allows
  // reads and Writes under wormholes/candidates/ only — so we must not
  // bypass permissions there.
  const permissionOptions = drafting
    ? { permissionMode: "default" as const, canUseTool: makeWormholeDraftCanUseTool(opts.repoRoot) }
    : { permissionMode: "bypassPermissions" as const };

  for await (const msg of query({
    prompt,
    options: {
      mcpServers: { corpus: corpusServer },
      allowedTools,
      systemPrompt: { type: "preset", preset: "claude_code", append: fullSystemPrompt },
      maxTurns: opts.maxTurns ?? 20,
      cwd: opts.repoRoot,
      ...permissionOptions,
    },
  })) {
    if (msg.type === "assistant") {
      const content = (msg as { message?: { content?: Array<{ type: string; text?: string; name?: string; input?: unknown }> } }).message?.content ?? [];
      for (const block of content) {
        if (block.type === "text" && block.text) {
          answer += block.text;
        } else if (block.type === "tool_use" && block.name) {
          toolCalls.push({
            name: block.name,
            inputDigest: JSON.stringify(block.input ?? {}).slice(0, 200),
            isError: false,
          });
        }
      }
    } else if (msg.type === "result") {
      const r = msg as {
        subtype?: string;
        num_turns?: number;
        total_cost_usd?: number;
        usage?: {
          input_tokens?: number;
          output_tokens?: number;
          cache_creation_input_tokens?: number;
          cache_read_input_tokens?: number;
        };
        result?: string;
      };
      turns = r.num_turns ?? 0;
      costUsd = r.total_cost_usd ?? 0;
      usage = {
        inputTokens: r.usage?.input_tokens ?? 0,
        outputTokens: r.usage?.output_tokens ?? 0,
        cacheCreationInputTokens: r.usage?.cache_creation_input_tokens ?? 0,
        cacheReadInputTokens: r.usage?.cache_read_input_tokens ?? 0,
      };
      // The final result text is also exposed on the result envelope.
      if (r.result && !answer) answer = r.result;
    }
  }

  let verifierVerdict: VerifierVerdict | undefined;
  if (opts.verify && answer.trim().length > 0) {
    verifierVerdict = await runCitationVerifier({
      repoRoot: opts.repoRoot,
      candidateAnswer: answer,
      toolCallLog: toolCalls.map((c) => ({ name: c.name, inputDigest: c.inputDigest })),
    });
  }

  return {
    answer,
    turns,
    durationMs: Date.now() - started,
    usage,
    costUsd,
    toolCalls,
    ...(verifierVerdict ? { verifierVerdict } : {}),
  };
}
