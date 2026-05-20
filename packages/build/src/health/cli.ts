#!/usr/bin/env node
// Deterministic housekeeping report for repo health.
//
// This is deliberately non-LLM and non-networked. It checks contracts
// that should be interrogated regularly: conformance drift, tag-taxonomy
// drift, stale cold-start docs, latest eval outcome, and local hygiene.

import fastGlob from "fast-glob";
import { access, readFile, readdir, lstat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as yamlParse } from "yaml";
import { getTags, loadCorpus } from "../compile/loader.js";
import { validateCorpus } from "../validate/run.js";
import { loadTagTaxonomy } from "../validate/tags.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const BASELINE_PATH = "evals/conformance-baseline.yaml";

type HealthStatus = "pass" | "warn" | "fail";

interface HealthCheck {
  readonly name: string;
  readonly status: HealthStatus;
  readonly summary: string;
  readonly details?: ReadonlyArray<string>;
}

const args = process.argv.slice(2);
const json = args.includes("--json");
const noFail = args.includes("--no-fail");

if (args.includes("--help") || args.includes("-h")) {
  printHelpAndExit(0);
}

const checks = await runHealthChecks(REPO_ROOT);

if (json) {
  console.log(JSON.stringify({
    schemaVersion: "offshoreai_health_v1",
    ranAt: new Date().toISOString(),
    checks,
    totals: summarise(checks),
  }, null, 2));
} else {
  printReport(checks);
}

if (!noFail && checks.some((c) => c.status === "fail")) {
  process.exit(1);
}

async function runHealthChecks(repoRoot: string): Promise<ReadonlyArray<HealthCheck>> {
  return [
    await checkCorpusConformance(repoRoot),
    await checkTagTaxonomy(repoRoot),
    await checkLatestShowcaseSummary(repoRoot),
    await checkLocalClaudeWorktrees(repoRoot),
  ];
}

async function checkCorpusConformance(repoRoot: string): Promise<HealthCheck> {
  const result = await validateCorpus({ repoRoot });
  const baseline = await loadConformanceBaseline(repoRoot);
  const baselineTotal = baseline.totalViolations;
  const unknownTags = result.violationsByKind.unknown_tag ?? 0;
  const brokenLinks =
    (result.violationsByKind.broken_relative_link ?? 0) +
    (result.violationsByKind.broken_see_also ?? 0);

  if (baselineTotal !== null && result.violations.length > baselineTotal) {
    return {
      name: "corpus-conformance",
      status: "fail",
      summary: `${result.violations.length} violations; regression above baseline ${baselineTotal}`,
      details: [
        `unknown_tag: ${unknownTags}`,
        `broken links: ${brokenLinks}`,
        `baseline file: ${BASELINE_PATH}`,
      ],
    };
  }

  if (result.violations.length > 0) {
    return {
      name: "corpus-conformance",
      status: "warn",
      summary: `${result.violations.length} known violations; baseline ${baselineTotal ?? "missing"}`,
      details: [
        `files scanned: ${result.filesScanned}`,
        `unknown_tag: ${unknownTags}`,
        `broken links: ${brokenLinks}`,
      ],
    };
  }

  return {
    name: "corpus-conformance",
    status: "pass",
    summary: "validator found no corpus conformance violations",
  };
}

async function checkTagTaxonomy(repoRoot: string): Promise<HealthCheck> {
  const taxonomy = await loadTagTaxonomy(repoRoot);
  const records = await loadCorpus({ repoRoot });
  const unknown = new Map<string, number>();
  let applications = 0;

  for (const rec of records) {
    for (const tag of getTags(rec)) {
      applications += 1;
      if (!taxonomy.tags.has(tag)) {
        unknown.set(tag, (unknown.get(tag) ?? 0) + 1);
      }
    }
  }

  if (unknown.size > 0) {
    const topUnknown = Array.from(unknown.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tag, count]) => `${tag} (${count})`);

    return {
      name: "tag-taxonomy",
      status: "warn",
      summary: `${unknown.size} unknown tag(s), ${sum(unknown.values())}/${applications} tag applications outside TAGS.md`,
      details: [`top unknown tags: ${topUnknown.join(", ")}`],
    };
  }

  return {
    name: "tag-taxonomy",
    status: "pass",
    summary: `${applications} tag applications all present in TAGS.md`,
  };
}

async function checkLatestShowcaseSummary(repoRoot: string): Promise<HealthCheck> {
  const summaries = await fastGlob("evals/baselines/*offshoreai-agent-full/summary.yaml", {
    cwd: repoRoot,
    onlyFiles: true,
  });
  if (summaries.length === 0) {
    return {
      name: "latest-showcase",
      status: "warn",
      summary: "no offshoreai-agent-full showcase summary found",
    };
  }

  const parsed = await Promise.all(summaries.map(async (path) => {
    const body = await readFile(resolve(repoRoot, path), "utf8");
    const doc = yamlParse(body) as Record<string, unknown>;
    const run = asRecord(doc.run);
    return {
      path,
      ranAt: String(run.ranAt ?? ""),
      questions: asNumber(run.questions),
      pass: asNumber(asRecord(doc.totals).pass),
      partial: asNumber(asRecord(doc.totals).partial),
      fail: asNumber(asRecord(doc.totals).fail),
    };
  }));

  parsed.sort((a, b) => b.ranAt.localeCompare(a.ranAt));
  const latest = parsed[0]!;
  const accounted = latest.pass + latest.partial + latest.fail;

  if (accounted !== latest.questions) {
    return {
      name: "latest-showcase",
      status: "fail",
      summary: `${latest.path} totals do not add up (${accounted}/${latest.questions})`,
    };
  }

  if (latest.partial > 0 || latest.fail > 0) {
    return {
      name: "latest-showcase",
      status: "warn",
      summary: `${latest.pass}/${latest.questions} pass, ${latest.partial} partial, ${latest.fail} fail`,
      details: [`latest summary: ${latest.path}`, `ran_at: ${latest.ranAt}`],
    };
  }

  return {
    name: "latest-showcase",
    status: "pass",
    summary: `${latest.pass}/${latest.questions} pass`,
    details: [`latest summary: ${latest.path}`],
  };
}

async function checkLocalClaudeWorktrees(repoRoot: string): Promise<HealthCheck> {
  const worktreesPath = resolve(repoRoot, ".claude", "worktrees");
  try {
    await access(worktreesPath);
  } catch {
    return {
      name: "local-claude-worktrees",
      status: "pass",
      summary: "no local .claude/worktrees directory present",
    };
  }

  const bytes = await directorySizeBytes(worktreesPath);
  return {
    name: "local-claude-worktrees",
    status: "warn",
    summary: `.claude/worktrees exists locally (${formatBytes(bytes)}); should stay ignored`,
  };
}

async function loadConformanceBaseline(repoRoot: string): Promise<{ totalViolations: number | null }> {
  try {
    const body = await readFile(resolve(repoRoot, BASELINE_PATH), "utf8");
    const parsed = yamlParse(body) as Record<string, unknown>;
    return { totalViolations: asNumberOrNull(parsed.total_violations) };
  } catch {
    return { totalViolations: null };
  }
}

async function directorySizeBytes(path: string): Promise<number> {
  const entries = await readdir(path, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const child = resolve(path, entry.name);
    const stat = await lstat(child);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) total += await directorySizeBytes(child);
    else total += stat.size;
  }
  return total;
}

function printReport(checks: ReadonlyArray<HealthCheck>): void {
  const totals = summarise(checks);
  console.log("OffshoreAI deterministic health report");
  console.log(`ran_at: ${new Date().toISOString()}`);
  console.log();

  for (const check of checks) {
    console.log(`${check.status.toUpperCase().padEnd(5)} ${check.name} — ${check.summary}`);
    for (const detail of check.details ?? []) {
      console.log(`      ${detail}`);
    }
  }

  console.log();
  console.log(`summary: ${totals.pass} pass, ${totals.warn} warn, ${totals.fail} fail`);
  if (totals.fail > 0) {
    console.log("exit: fail (use --no-fail for report-only mode)");
  }
}

function summarise(checks: ReadonlyArray<HealthCheck>): Record<HealthStatus, number> {
  return checks.reduce<Record<HealthStatus, number>>((acc, check) => {
    acc[check.status] += 1;
    return acc;
  }, { pass: 0, warn: 0, fail: 0 });
}

function asRecord(v: unknown): Record<string, unknown> {
  return typeof v === "object" && v !== null ? v as Record<string, unknown> : {};
}

function asNumber(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function asNumberOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function sum(values: Iterable<number>): number {
  let total = 0;
  for (const v of values) total += v;
  return total;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const mib = bytes / (1024 * 1024);
  return `${mib.toFixed(1)} MiB`;
}

function printHelpAndExit(code: number): never {
  console.log(`offshoreai health — deterministic housekeeping report

Usage:
  pnpm health
  pnpm health -- --json
  pnpm health -- --no-fail

Checks:
  corpus-conformance       convention validator drift against baseline
  tag-taxonomy             frontmatter tags outside TAGS.md
  latest-showcase          latest committed offshoreai-agent-full eval result
  local-claude-worktrees   local worktree hygiene
`);
  process.exit(code);
}
