// Eval trajectory — the structured record of one harness's run on
// one eval question.
//
// Promoted to packages/schemas/src/eval-trajectory.ts in week 3.
// Schema-level only; the runner (prompts/eval/runner.md) writes
// JSON files conforming to this shape under
// evals/baselines/<date>-<harness>/<question-id>.trajectory.json.
//
// Used by:
//   - the grader sub-agent (prompts/eval/grader.md), which reads
//     trajectory.json alongside the candidate answer to compute the
//     efficiency dimension and verify citation_precision against
//     actually-loaded files
//   - the runner's summary aggregator, which medians the
//     efficiency metrics across a batch
//   - the §11.3 observability layer at production, which uses the
//     same shape for in-tenant tool-event logs (the trajectory IS
//     the tool-event log, captured per-question instead of
//     per-session)

import { z } from "zod";
import { isoDate } from "./common.js";

// ---------------------------------------------------------------------------
// Tool call — one invocation of one tool inside a trajectory
// ---------------------------------------------------------------------------

export const harnessName = z.enum([
  "explore-subagent",
  "claude-p",
  "offshoreai-agent",
]);
export type HarnessName = z.infer<typeof harnessName>;

export const toolCallKind = z.enum([
  // Built-in Claude Code / Agent SDK tools
  "Read",
  "Glob",
  "Grep",
  "Bash",
  "WebFetch",
  "Edit",
  "Write",
  // Sub-agent dispatch
  "Agent",
  "Task",
  // Our typed corpus tools (offshoreai-agent only)
  "corpus.getFile",
  "corpus.getArticle",
  "corpus.glossaryLookup",
  "corpus.findByTag",
  "corpus.expandTags",
  "corpus.neighbours",
  "corpus.tree",
  "corpus.semanticSearch",
  "corpus.inventory",
  "corpus.getBundle",
  "corpus.freshnessCheck",
  // Memory / primary-source / register (offshoreai-agent only)
  "memory.add",
  "memory.search",
  "memory.link",
  "memory.evolve",
  "memory.forget",
  "memory.listByTag",
  "memory.diff",
  "primarySource.fetch",
  "register.lookupCompany",
  "register.lookupCharity",
  "register.lookupJfscPermission",
  // Catch-all so harnesses with their own tools (claude -p with
  // MCP servers, e.g.) don't fail validation
  "other",
]);
export type ToolCallKind = z.infer<typeof toolCallKind>;

export const toolCall = z.object({
  index: z.number().int().nonnegative(),
  kind: toolCallKind,
  rawName: z.string().describe("Verbatim tool name as the harness emitted it — useful when kind is 'other'."),
  inputDigest: z.string().describe("Truncated rendering of the input params for quick scan."),
  inputBytes: z.number().int().nonnegative(),
  resultBytes: z.number().int().nonnegative(),
  resultSummary: z.string().describe("First ~200 chars of the tool result, or a one-line 'returned <n> rows' summary."),
  isError: z.boolean(),
  latencyMs: z.number().int().nonnegative(),
});
export type ToolCall = z.infer<typeof toolCall>;

// ---------------------------------------------------------------------------
// Cited path — paths the candidate answer explicitly cited
// ---------------------------------------------------------------------------

export const citedPath = z.object({
  path: z.string(),
  kind: z.enum(["corpus-relative", "primary-source-url", "statute-article", "unknown"]),
  appearedInToolTrajectory: z.boolean().describe("True if the path was actually loaded by a tool call before being cited (sanity check for hallucinated citations)."),
});
export type CitedPath = z.infer<typeof citedPath>;

// ---------------------------------------------------------------------------
// Token usage
// ---------------------------------------------------------------------------

export const usage = z.object({
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  cacheReadTokens: z.number().int().nonnegative().default(0),
  cacheWriteTokens: z.number().int().nonnegative().default(0),
  totalCostUsd: z.number().nonnegative().optional(),
});
export type Usage = z.infer<typeof usage>;

// ---------------------------------------------------------------------------
// The trajectory itself
// ---------------------------------------------------------------------------

export const trajectory = z.object({
  schemaVersion: z.literal("eval_trajectory_v1"),
  questionId: z.string(),
  evalSuite: z.string().describe("evals/showcase.yaml or evals/coverage-questions.yaml"),
  harness: harnessName,
  ranAt: z.string().describe("ISO datetime"),
  wallClockSeconds: z.number().nonnegative(),
  turns: z.number().int().nonnegative().describe("Number of model turns (typically count of assistant messages)."),
  toolCalls: z.array(toolCall),
  citedPaths: z.array(citedPath),
  usage,
  answer: z.object({
    text: z.string(),
    wordCount: z.number().int().nonnegative(),
  }),
  errors: z.array(z.object({
    where: z.enum(["dispatch", "tool_call", "model", "trajectory_parse"]),
    detail: z.string(),
  })).default([]),
  // Optional per-harness metadata kept as a free-form record so we
  // don't break the schema when a new harness (or a future
  // offshoreai-agent feature) adds a field.
  meta: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
});
export type Trajectory = z.infer<typeof trajectory>;

// ---------------------------------------------------------------------------
// Aggregates — what the runner's summary.yaml carries
// ---------------------------------------------------------------------------

export const dimensionAggregates = z.object({
  citationPrecisionPassRate: z.number().min(0).max(1),
  citationRecallPassRate: z.number().min(0).max(1),
  freshnessHandlingPassRate: z.number().min(0).max(1).optional(),
  jerseySpecificPassRate: z.number().min(0).max(1),
  voicePassRate: z.number().min(0).max(1).optional(),
  medianToolCalls: z.number().nonnegative(),
  medianRedundantCalls: z.number().nonnegative(),
  medianTokensInput: z.number().nonnegative(),
  medianTokensOutput: z.number().nonnegative(),
  medianWallClockSeconds: z.number().nonnegative(),
});
export type DimensionAggregates = z.infer<typeof dimensionAggregates>;

export const batchSummary = z.object({
  schemaVersion: z.literal("eval_batch_summary_v1"),
  run: z.object({
    harness: harnessName,
    evalSuite: z.string(),
    ranAt: z.string(),
    questions: z.number().int().nonnegative(),
    baselineComparedAgainst: z.string().nullable(),
  }),
  totals: z.object({
    pass: z.number().int().nonnegative(),
    partial: z.number().int().nonnegative(),
    fail: z.number().int().nonnegative(),
  }),
  dimensionAggregates,
  regressions: z.array(z.string()),
  newPasses: z.array(z.string()),
  notes: z.string(),
});
export type BatchSummary = z.infer<typeof batchSummary>;

// ---------------------------------------------------------------------------
// Helper — a default-shaped trajectory the runner can fill in
// ---------------------------------------------------------------------------

export function emptyTrajectory(args: {
  questionId: string;
  evalSuite: string;
  harness: HarnessName;
  ranAt: string;
}): Trajectory {
  return {
    schemaVersion: "eval_trajectory_v1",
    questionId: args.questionId,
    evalSuite: args.evalSuite,
    harness: args.harness,
    ranAt: args.ranAt,
    wallClockSeconds: 0,
    turns: 0,
    toolCalls: [],
    citedPaths: [],
    usage: {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    },
    answer: { text: "", wordCount: 0 },
    errors: [],
    meta: {},
  };
}
