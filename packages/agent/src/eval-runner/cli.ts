#!/usr/bin/env node
// pnpm --filter @offshoreai/agent eval -- --harness offshoreai-agent --eval evals/showcase.yaml --ids show-voisinage,show-parish-hall --output evals/baselines/2026-05-19-offshoreai-agent

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runBatch } from "./batch.js";
import { loadEvalSuite } from "./load-eval.js";
import type { HarnessName } from "./types.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");

interface CliArgs {
  harness: HarnessName;
  evalSuite: string;
  ids: string[] | null;
  outputDir: string;
  tagIndexPath: string | undefined;
  skipGrader: boolean;
  graderModel: string | undefined;
}

function parseArgs(argv: string[]): CliArgs {
  let harness: HarnessName | undefined;
  let evalSuite = "evals/showcase.yaml";
  let outputDir = "";
  let ids: string[] | null = null;
  let tagIndexPath: string | undefined = "packages/build/dist/tag-index.json";
  let skipGrader = false;
  let graderModel: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--harness") {
      const v = argv[++i];
      if (v !== "offshoreai-agent" && v !== "claude-p" && v !== "explore-subagent") {
        throw new Error(`Unknown harness: ${v}`);
      }
      harness = v;
    } else if (a === "--eval") evalSuite = argv[++i] ?? evalSuite;
    else if (a === "--output") outputDir = argv[++i] ?? "";
    else if (a === "--ids") ids = (argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--tag-index") tagIndexPath = argv[++i];
    else if (a === "--no-tag-index") tagIndexPath = undefined;
    else if (a === "--skip-grader") skipGrader = true;
    else if (a === "--grader-model") graderModel = argv[++i];
    else if (a === "--help" || a === "-h") printHelp(0);
  }

  if (!harness) {
    console.error("Missing --harness <offshoreai-agent|claude-p>");
    printHelp(1);
  }
  if (!outputDir) {
    console.error("Missing --output <dir>");
    printHelp(1);
  }
  return { harness: harness!, evalSuite, ids, outputDir, tagIndexPath, skipGrader, graderModel };
}

function printHelp(exit: number): never {
  console.log(`offshoreai eval runner

Usage:
  pnpm --filter @offshoreai/agent eval -- \\
    --harness <offshoreai-agent|claude-p> \\
    --eval evals/showcase.yaml \\
    --output evals/baselines/<date>-<harness> \\
    [--ids id1,id2,id3] \\
    [--tag-index <path>] \\
    [--skip-grader] \\
    [--grader-model claude-opus-4-7]

The harness adapter for explore-subagent is not driveable from this
CLI — it requires invocation from inside a parent Claude Code session.
`);
  process.exit(exit);
}

const args = parseArgs(process.argv.slice(2));

const allQuestions = await loadEvalSuite(REPO_ROOT, args.evalSuite);
const selected = args.ids
  ? allQuestions.filter((q) => args.ids!.includes(q.id))
  : allQuestions;

if (args.ids && selected.length < args.ids.length) {
  const found = new Set(selected.map((q) => q.id));
  const missing = args.ids.filter((id) => !found.has(id));
  console.error(`Warning: ${missing.length} id(s) not found in ${args.evalSuite}: ${missing.join(", ")}`);
}

if (selected.length === 0) {
  console.error("No matching questions; nothing to do.");
  process.exit(1);
}

console.log(`Running ${selected.length} question(s) through ${args.harness} → ${args.outputDir}`);

const absOut = resolve(REPO_ROOT, args.outputDir);

await runBatch({
  harness: args.harness,
  questions: selected,
  outputDir: absOut,
  repoRoot: REPO_ROOT,
  evalSuite: args.evalSuite,
  ...(args.tagIndexPath ? { tagIndexPath: args.tagIndexPath } : {}),
  ...(args.graderModel ? { graderModel: args.graderModel } : {}),
  skipGrader: args.skipGrader,
});
