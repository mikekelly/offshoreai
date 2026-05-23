// `enrich-pinpoints` CLI runner.
//
// Walks the corpus, computes pinpoints for each file via the pure functions
// in ./pinpoints.ts, and writes a `pinpoints` frontmatter field on files
// where it differs from what's already there. Idempotent on re-runs.
//
// Usage:
//   pnpm --filter @offshoreai/build cli enrich-pinpoints --dry-run
//   pnpm --filter @offshoreai/build cli enrich-pinpoints --apply

import { readFile, writeFile } from "node:fs/promises";
import matter from "gray-matter";
import { stringify as yamlStringify } from "yaml";
import { loadCorpus } from "../compile/loader.js";
import { computePinpoints, loadPinpointRegistry, pinpointsEqual, pinpointsOf, type Pinpoint } from "./pinpoints.js";

export interface EnrichOptions {
  readonly repoRoot: string;
  readonly apply: boolean;
}

export interface EnrichSummary {
  readonly scanned: number;
  readonly matched: number;
  readonly changed: number;
  readonly changes: ReadonlyArray<{ readonly path: string; readonly before: Pinpoint[]; readonly after: Pinpoint[] }>;
}

export async function enrichPinpoints(opts: EnrichOptions): Promise<EnrichSummary> {
  const registry = await loadPinpointRegistry(opts.repoRoot);
  const records = await loadCorpus({ repoRoot: opts.repoRoot });

  let matched = 0;
  const changes: Array<{ path: string; before: Pinpoint[]; after: Pinpoint[] }> = [];

  for (const rec of records) {
    if (rec.kind !== "concept") continue;
    const after = computePinpoints(rec, registry);
    if (after.length === 0) continue;
    matched++;
    const before = pinpointsOf(rec);
    if (pinpointsEqual(before, after)) continue;
    changes.push({ path: rec.path, before, after });
    if (opts.apply) await writePinpoints(rec.abs, after);
  }

  return { scanned: records.length, matched, changed: changes.length, changes };
}

/**
 * Re-write a file's frontmatter with a new `pinpoints` field, preserving
 * body and every other frontmatter key. Uses gray-matter to round-trip.
 *
 * IMPORTANT: gray-matter (js-yaml) parses bare date strings like
 * `2026-05-14` into JS `Date` objects, and the `yaml` package stringifies
 * Date values as full ISO timestamps — which silently regresses the
 * corpus's YYYY-MM-DD convention on `last_verified` / `accessed`. We
 * coerce every Date back to YYYY-MM-DD before serialising so the round-
 * trip preserves the original format.
 */
async function writePinpoints(abs: string, pinpoints: Pinpoint[]): Promise<void> {
  const raw = await readFile(abs, "utf8");
  const parsed = matter(raw);
  const data: Record<string, unknown> = { ...parsed.data };
  data["pinpoints"] = pinpoints.map((p) => ({ article: p.article, url: p.url, source: p.source }));
  const normalized = normalizeDates(data) as Record<string, unknown>;
  const yaml = yamlStringify(normalized, { lineWidth: 0 }).trimEnd();
  const next = `---\n${yaml}\n---\n${parsed.content}`;
  await writeFile(abs, next, "utf8");
}

function dateToYmd(d: Date): string {
  const y = d.getUTCFullYear().toString().padStart(4, "0");
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeDates(v: unknown): unknown {
  if (v instanceof Date) return dateToYmd(v);
  if (Array.isArray(v)) return v.map(normalizeDates);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) out[k] = normalizeDates(x);
    return out;
  }
  return v;
}
