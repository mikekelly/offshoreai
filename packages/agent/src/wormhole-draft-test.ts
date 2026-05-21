#!/usr/bin/env node
// One-off manual check for the Phase C2 drafting path. NOT part of the
// eval harness. Runs a question with enableWormholeDrafting=true and
// reports: the answer (so we can see it isn't polluted by the draft) and
// any candidate files written under wormholes/candidates/.
//
//   tsx ./src/wormhole-draft-test.ts "<question>"

import { readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runQuery } from "./runtime.js";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const question = process.argv[2] ?? "Walk me through setting up a Jersey TopCo above my UK operating business and listing it on the LSE. What's the structure step by step?";

async function listCandidates(): Promise<string[]> {
  const dir = resolve(REPO_ROOT, "wormholes", "candidates");
  const out: string[] = [];
  async function walk(d: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = resolve(d, e.name);
      if (e.isDirectory()) await walk(p);
      else out.push(p.replace(REPO_ROOT + "/", ""));
    }
  }
  await walk(dir);
  return out;
}

const before = await listCandidates();
console.log(`[test] question: ${question.slice(0, 80)}…`);
console.log(`[test] candidates before: ${before.length}`);

const r = await runQuery({
  question,
  repoRoot: REPO_ROOT,
  evalMode: true,
  enableWormholeDrafting: true,
  tagIndexPath: "packages/build/dist/tag-index.json",
  maxTurns: 25,
});

const after = await listCandidates();
const created = after.filter((p) => !before.includes(p));

console.log(`\n[test] turns=${r.turns} toolCalls=${r.toolCalls.length} cost=$${r.costUsd.toFixed(4)}`);
console.log(`[test] tool sequence: ${r.toolCalls.map((c) => c.name).join(" → ")}`);
console.log(`[test] candidates created: ${created.length ? created.join(", ") : "(none)"}`);
console.log(`\n[test] ANSWER (first 600 chars — check for draft pollution):\n${r.answer.slice(0, 600)}`);
console.log(`\n[test] ANSWER (last 300 chars):\n${r.answer.slice(-300)}`);
