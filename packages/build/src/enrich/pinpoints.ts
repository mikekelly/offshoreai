// Pinpoint-citation enrichment.
//
// Adds a `pinpoints` frontmatter field to each corpus file that cites a
// statute we have an anchor map for, mapping every `articles_covered`
// entry to a deep-link URL (statute base + #anchor).
//
// The registry lives at packages/build/data/citation-pinpoints.json. The
// computation here is pure (no I/O); the CLI in ./cli.ts wraps it with
// file I/O and a --dry-run / --apply flag.
//
// Re-running is idempotent — a file whose pinpoints already match the
// computed set is a no-op.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { CorpusRecord } from "../compile/loader.js";

export interface PinpointRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly source_titles_match: ReadonlyArray<string>;
  readonly base: string;
  readonly anchor_kind: "literal";
  readonly lastScraped: string;
  readonly lastScrapedNote?: string;
  readonly anchors: Readonly<Record<string, string>>;
}

export type PinpointRegistry = ReadonlyArray<PinpointRegistryEntry>;

/** A single pinpoint citation as it lives in a file's `pinpoints` frontmatter. */
export interface Pinpoint {
  readonly article: string;
  readonly url: string;
  readonly source: string; // registry id
}

export async function loadPinpointRegistry(repoRoot: string): Promise<PinpointRegistry> {
  const raw = await readFile(resolve(repoRoot, "packages/build/data/citation-pinpoints.json"), "utf8");
  return JSON.parse(raw) as PinpointRegistry;
}

/**
 * Match a corpus record's sources[] against the registry. Returns the FIRST
 * matching entry (a file typically cites one primary statute); a record can
 * be enriched against multiple statutes only if extended later. Match is by
 * substring (case-insensitive) so title variants ("Trusts (Jersey) Law 1984",
 * "Trusts (Jersey) Law 1984 — Article 9 (consolidated)") all match.
 */
export function matchRegistryEntry(
  rec: CorpusRecord,
  registry: PinpointRegistry,
): PinpointRegistryEntry | null {
  const sources = (rec.frontmatter as { sources?: unknown }).sources;
  if (!Array.isArray(sources)) return null;
  const titles = sources
    .map((s) => (s && typeof s === "object" ? (s as { title?: unknown }).title : null))
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.toLowerCase());
  if (titles.length === 0) return null;
  for (const entry of registry) {
    for (const needle of entry.source_titles_match) {
      const n = needle.toLowerCase();
      if (titles.some((t) => t.includes(n))) return entry;
    }
  }
  return null;
}

function articlesOf(rec: CorpusRecord): ReadonlyArray<string> {
  const a = (rec.frontmatter as { articles_covered?: unknown }).articles_covered;
  if (!Array.isArray(a)) return [];
  return a.filter((x): x is string => typeof x === "string").map((x) => String(x));
}

/**
 * Compute the pinpoints a record should carry given the registry. Returns
 * an empty array when no statute matches or no articles are covered.
 */
export function computePinpoints(rec: CorpusRecord, registry: PinpointRegistry): Pinpoint[] {
  const entry = matchRegistryEntry(rec, registry);
  if (!entry) return [];
  const articles = articlesOf(rec);
  if (articles.length === 0) return [];
  const out: Pinpoint[] = [];
  for (const art of articles) {
    const anchor = entry.anchors[art];
    if (!anchor) continue; // article not in the scraped anchor map; skip silently
    out.push({
      article: art,
      url: `${entry.base}#${anchor}`,
      source: entry.id,
    });
  }
  return out;
}

/**
 * Compare two pinpoint arrays for set-equality (order-independent).
 * Used by the CLI to skip files whose pinpoints already match.
 */
export function pinpointsEqual(a: ReadonlyArray<Pinpoint>, b: ReadonlyArray<Pinpoint>): boolean {
  if (a.length !== b.length) return false;
  const key = (p: Pinpoint) => `${p.article}|${p.url}|${p.source}`;
  const ak = new Set(a.map(key));
  for (const p of b) if (!ak.has(key(p))) return false;
  return true;
}

export function pinpointsOf(rec: CorpusRecord): Pinpoint[] {
  const raw = (rec.frontmatter as { pinpoints?: unknown }).pinpoints;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((x) => {
    if (!x || typeof x !== "object") return [];
    const o = x as Record<string, unknown>;
    if (typeof o["article"] !== "string" || typeof o["url"] !== "string" || typeof o["source"] !== "string") return [];
    return [{ article: o["article"], url: o["url"], source: o["source"] }];
  });
}
