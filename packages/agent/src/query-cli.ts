#!/usr/bin/env node
// Engineer-facing CLI: pnpm --filter @offshoreai/agent query -- --question "..."
//
// Minimal dispatch surface — kicks off the SDK custom agent, writes
// answer.md + trajectory.json (with session_id + system-prompt
// provenance + token usage) to --output-dir, returns. Does NOT grade
// or verify — those responsibilities live in the
// .claude/agents/eval-manager.md subagent invoked via /run-evals.
//
// Per AGENT-PRINCIPLES Principle 21 this is an engineer-facing dev CLI,
// not an agent-facing surface. The agent itself uses the typed
// in-process MCP tools registered by createCorpusToolsServer.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runQuery } from "./runtime.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

interface CliArgs {
  question: string;
  evalMode: boolean;
  outputDir: string | null;
  questionId: string | null;
  evalSuite: string | null;
  tagIndexPath: string | undefined;
}

function parseArgs(argv: string[]): CliArgs {
  let question = "";
  let evalMode = false;
  let outputDir: string | null = null;
  let questionId: string | null = null;
  let evalSuite: string | null = null;
  let tagIndexPath: string | undefined = "packages/build/dist/tag-index.json";

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--question" || a === "-q") question = argv[++i] ?? "";
    else if (a === "--eval") evalMode = true;
    else if (a === "--output-dir") outputDir = argv[++i] ?? null;
    else if (a === "--question-id") questionId = argv[++i] ?? null;
    else if (a === "--eval-suite") evalSuite = argv[++i] ?? null;
    else if (a === "--no-tag-index") tagIndexPath = undefined;
    else if (a === "--tag-index") tagIndexPath = argv[++i];
    else if (a === "--help" || a === "-h") printHelp(0);
    else if (!a) continue;
    else if (!question) question = a;
  }

  if (!question) {
    console.error("Missing --question.");
    printHelp(1);
  }
  return { question, evalMode, outputDir, questionId, evalSuite, tagIndexPath };
}

function printHelp(exit: number): never {
  console.log(`offshoreai-agent query — engineer-facing dev CLI

Kicks off the SDK custom agent for one question. Writes answer +
trajectory metadata when --output-dir given. Does NOT grade or
verify — that's the eval-manager subagent's job (invoked via
/run-evals).

Usage:
  pnpm --filter @offshoreai/agent query -- --question "What is voisinage?"
  pnpm --filter @offshoreai/agent query -- \\
    --question-id sd-aml-001 \\
    --eval-suite evals/coverage-questions.yaml \\
    --output-dir /tmp/eval-out/ \\
    --question "..."

Options:
  -q, --question <text>     The question to ask
      --eval                Prepend eval-mode framing to the question
      --question-id <id>    Required when --output-dir given; names the trajectory/answer files
      --eval-suite <path>   Recorded in trajectory.evalSuite for provenance
      --output-dir <path>   Persist <id>.answer.md + <id>.trajectory.json
      --tag-index <path>    Compiled tag-index.json path (default: packages/build/dist/tag-index.json)
      --no-tag-index        Run without a precompiled tag-index
  -h, --help                Show this help
`);
  process.exit(exit);
}

const args = parseArgs(process.argv.slice(2));
const t0 = Date.now();

const result = await runQuery({
  question: args.question,
  repoRoot: REPO_ROOT,
  evalMode: args.evalMode,
  ...(args.tagIndexPath ? { tagIndexPath: args.tagIndexPath } : {}),
});

const wallClockSeconds = (Date.now() - t0) / 1000;

console.log("\n========== ANSWER ==========\n");
console.log(result.answer);
console.log("\n========== USAGE ==========");
console.log(`turns:                ${result.turns}`);
console.log(`tool calls:           ${result.toolCalls.length}`);
console.log(`input tokens:         ${result.usage.inputTokens}`);
console.log(`output tokens:        ${result.usage.outputTokens}`);
console.log(`cache creation tokens: ${result.usage.cacheCreationInputTokens}`);
console.log(`cache read tokens:    ${result.usage.cacheReadInputTokens}`);
console.log(`wall clock:           ${wallClockSeconds.toFixed(2)}s`);
console.log(`cost (USD):           ${result.costUsd.toFixed(6)}`);
if (result.sessionId) {
  console.log(`session id:           ${result.sessionId}`);
}
if (result.toolCalls.length > 0) {
  console.log("\ntool call sequence:");
  result.toolCalls.forEach((c, i) => console.log(`  ${i + 1}. ${c.name}  ${c.inputDigest}`));
}

if (args.outputDir && args.questionId) {
  const abs = resolve(REPO_ROOT, args.outputDir);
  await mkdir(abs, { recursive: true });
  await writeFile(resolve(abs, `${args.questionId}.answer.md`), result.answer + "\n", "utf8");
  const traj = {
    schemaVersion: "eval_trajectory_v1",
    questionId: args.questionId,
    evalSuite: args.evalSuite ?? "(direct-invocation; no eval suite)",
    harness: "offshoreai-agent",
    ranAt: new Date().toISOString(),
    wallClockSeconds,
    turns: result.turns,
    toolCalls: result.toolCalls.map((c, i) => ({
      index: i,
      kind: c.name,
      rawName: c.name,
      inputDigest: c.inputDigest,
      inputBytes: c.inputDigest.length,
      resultBytes: 0,
      resultSummary: "",
      isError: c.isError,
      latencyMs: 0,
    })),
    citedPaths: [],
    usage: {
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      cacheReadTokens: result.usage.cacheReadInputTokens,
      cacheWriteTokens: result.usage.cacheCreationInputTokens,
      totalCostUsd: result.costUsd,
    },
    answer: {
      text: result.answer,
      wordCount: result.answer.trim().split(/\s+/).filter(Boolean).length,
    },
    errors: [],
    meta: {
      sdkVersion: "0.3.143",
      trajectoryQuality: "approximate-cited-paths-not-extracted",
      systemPrompt: result.systemPrompt,
      ...(result.sessionId ? { sessionId: result.sessionId } : {}),
    },
  };
  await writeFile(
    resolve(abs, `${args.questionId}.trajectory.json`),
    JSON.stringify(traj, null, 2) + "\n",
    "utf8",
  );
  console.log(`\nPersisted: ${args.outputDir}/${args.questionId}.{answer.md,trajectory.json}`);
}
