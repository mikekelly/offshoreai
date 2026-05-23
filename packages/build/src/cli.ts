#!/usr/bin/env node
// @offshoreai/build CLI — engineer-facing only.
//
// Per AGENT-PRINCIPLES Principle 21 (architectural restraint), we don't
// ship custom CLIs over our own functions for agents to invoke. This
// CLI is for engineers running `pnpm build:corpus` locally and in CI.
// Agents never invoke this.
//
// Verbs:
//   validate              — run convention validator against the corpus
//   validate --baseline   — write the conformance snapshot to evals/conformance-baseline.yaml
//   tree                  — (week 2) compile hier-tree.json
//   tags                  — (week 2) compile tag-index.json
//   all                   — (week 2) full pipeline

import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { stringify as yamlStringify } from "yaml";
import { compileHierTree } from "./compile/hier-tree.js";
import { compileTagIndex } from "./compile/tag-index.js";
import { enrichPinpoints } from "./enrich/cli.js";
import { validateCorpus } from "./validate/run.js";
import type { ValidationResult } from "./validate/types.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const HIER_TREE_OUT = "packages/build/dist/hier-tree.json";
const TAG_INDEX_OUT = "packages/build/dist/tag-index.json";

const args = process.argv.slice(2);
const verb = args[0];

if (!verb || verb === "--help" || verb === "-h") {
  printHelpAndExit(0);
}

switch (verb) {
  case "validate":
    await runValidate(args.slice(1));
    break;
  case "tree":
    await runTree();
    break;
  case "tags":
    await runTags();
    break;
  case "all":
    await runAll();
    break;
  case "enrich-pinpoints":
    await runEnrichPinpoints(args.slice(1));
    break;
  default:
    console.error(`Unknown verb: ${verb}`);
    printHelpAndExit(1);
}

async function runEnrichPinpoints(rest: string[]): Promise<void> {
  const apply = rest.includes("--apply");
  if (!apply && !rest.includes("--dry-run")) {
    console.error("enrich-pinpoints requires --dry-run or --apply");
    process.exit(1);
  }
  const summary = await enrichPinpoints({ repoRoot: REPO_ROOT, apply });
  console.log(`\nScanned:    ${summary.scanned} files`);
  console.log(`Matched:    ${summary.matched} files cite a known statute`);
  console.log(`Changed:    ${summary.changed} files ${apply ? "were updated" : "would be updated"}\n`);
  for (const ch of summary.changes) {
    console.log(`  ${ch.path}`);
    console.log(`    before: ${ch.before.length === 0 ? "(no pinpoints)" : ch.before.map((p) => p.article).join(", ")}`);
    console.log(`    after:  ${ch.after.map((p) => `${p.article} → ${p.url}`).join("\n            ")}`);
  }
  if (!apply && summary.changed > 0) {
    console.log("\n(dry-run — pass --apply to write the changes)");
  }
}

async function runValidate(rest: string[]): Promise<void> {
  const writeBaseline = rest.includes("--baseline");
  const failOnViolation = !writeBaseline && !rest.includes("--no-fail");

  const result = await validateCorpus({ repoRoot: REPO_ROOT });
  printSummary(result);

  if (writeBaseline) {
    const outPath = resolve(REPO_ROOT, "evals", "conformance-baseline.yaml");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, renderBaselineYaml(result), "utf8");
    console.log(`\nConformance baseline written to evals/conformance-baseline.yaml`);
  }

  if (failOnViolation && result.violations.length > 0) {
    process.exit(1);
  }
}

function printSummary(result: ValidationResult): void {
  console.log(`\nFiles scanned:           ${result.filesScanned}`);
  console.log(`Files with frontmatter:  ${result.filesWithFrontmatter}`);
  console.log(`Total violations:        ${result.violations.length}\n`);

  if (Object.keys(result.violationsByKind).length === 0) {
    console.log("No violations.");
    return;
  }

  console.log("Violations by kind:");
  const sortedKinds = Object.entries(result.violationsByKind)
    .sort(([, a], [, b]) => b - a);
  for (const [kind, count] of sortedKinds) {
    console.log(`  ${kind.padEnd(36)} ${count}`);
  }

  const topFiles = Object.entries(result.violationsByFile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  if (topFiles.length > 0) {
    console.log("\nTop 10 files by violation count:");
    for (const [path, count] of topFiles) {
      console.log(`  ${String(count).padStart(4)}  ${path}`);
    }
  }
}

function renderBaselineYaml(result: ValidationResult): string {
  const ranAt = new Date().toISOString();
  const doc = {
    schema_version: "conformance_baseline_v1",
    ran_at: ranAt,
    files_scanned: result.filesScanned,
    files_with_frontmatter: result.filesWithFrontmatter,
    total_violations: result.violations.length,
    violations_by_kind: result.violationsByKind,
    top_files: Object.entries(result.violationsByFile)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 30)
      .map(([path, count]) => ({ path, count })),
    violations: result.violations.map((v) => ({
      path: v.path,
      kind: v.kind,
      detail: v.detail,
      ...(v.line !== undefined ? { line: v.line } : {}),
    })),
  };
  const header = `# Convention-validator conformance baseline
#
# Generated by \`pnpm build:corpus validate --baseline\`.
# See IMPLEMENTATION-PLAN.md week 1: the baseline is captured here as
# the editorial team's backlog target. CI does not fail on these
# violations on the week-1 branch; they get worked down via PRs.
#
# Re-generate after each editorial PR batch to track the trend.

`;
  return header + yamlStringify(doc, { lineWidth: 100 });
}

async function runTree(): Promise<void> {
  console.log(`Compiling hier-tree...`);
  const start = Date.now();
  const tree = await compileHierTree({ repoRoot: REPO_ROOT, outPath: HIER_TREE_OUT });
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`  nodes:         ${tree.stats.nodes}`);
  console.log(`  sections:      ${tree.stats.sections}`);
  console.log(`  concept files: ${tree.stats.conceptFiles}`);
  console.log(`  index files:   ${tree.stats.indexFiles}`);
  console.log(`  roots:         ${tree.roots.length}`);
  console.log(`  → ${HIER_TREE_OUT} (${elapsed}s)`);
}

async function runTags(): Promise<void> {
  console.log(`Compiling tag-index...`);
  const start = Date.now();
  const index = await compileTagIndex({ repoRoot: REPO_ROOT, outPath: TAG_INDEX_OUT });
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`  unique tags:       ${index.stats.uniqueTags}`);
  console.log(`  total applications: ${index.stats.totalTagApplications}`);
  console.log(`  files indexed:     ${index.stats.filesIndexed}`);
  // Top 10 tags by frequency
  const byFreq = Object.entries(index.tagToFiles)
    .map(([tag, files]) => [tag, files.length] as const)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  console.log(`  top 10 tags by file count:`);
  for (const [tag, count] of byFreq) {
    console.log(`    ${String(count).padStart(5)}  ${tag}`);
  }
  console.log(`  → ${TAG_INDEX_OUT} (${elapsed}s)`);
}

async function runAll(): Promise<void> {
  await runValidate(["--no-fail"]);
  console.log();
  await runTree();
  console.log();
  await runTags();
  console.log();
  console.log("All build pipeline verbs completed.");
}

function printHelpAndExit(code: number): never {
  console.log(`offshoreai-build — corpus build pipeline

Usage: pnpm build:corpus <verb> [options]

Verbs:
  validate              Run convention validator (default fails CI on violation)
  validate --baseline   Run validator AND write evals/conformance-baseline.yaml
  validate --no-fail    Run validator but exit 0 even on violations (CI-friendly snapshot mode)
  tree                  Compile packages/build/dist/hier-tree.json
  tags                  Compile packages/build/dist/tag-index.json (+ co-occurrence matrix)
  all                   Run validate (no-fail) + tree + tags in sequence
`);
  process.exit(code);
}
