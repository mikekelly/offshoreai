// Shared corpus context. Holds the repo root and (lazily) the loaded
// corpus records + the compiled tag-index. Handlers receive a
// CorpusContext via partial application at registration time so they
// don't have to recompute the corpus on every call.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  getArticlesCovered,
  getLastVerified,
  getStatus,
  getTags,
  getTitle,
  loadCorpus,
  type CorpusRecord,
} from "@offshoreai/build";
import { extractInclusionLinkTargets, resolveInclusionTarget } from "./inclusion-links.js";

export interface TagIndexShape {
  readonly schemaVersion: "tag_index_v1";
  readonly tagToFiles: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly coOccurrence: Readonly<Record<string, Readonly<Record<string, number>>>>;
  readonly stats: { readonly uniqueTags: number; readonly totalTagApplications: number; readonly filesIndexed: number };
}

export interface CorpusContext {
  readonly repoRoot: string;
  readonly records: ReadonlyArray<CorpusRecord>;
  readonly byPath: ReadonlyMap<string, CorpusRecord>;
  readonly tagIndex: TagIndexShape | null;
  /** index keyed on `${statute}|${articleId}` for getArticle dispatch */
  readonly articleIndex: ReadonlyMap<string, CorpusRecord>;
  /** For each file path, the repo-relative paths it declares as structural
   *  children via bare-line inclusion links (per CONVENTIONS.md). Only
   *  links whose resolved target exists in byPath are included. */
  readonly inclusionChildren: ReadonlyMap<string, ReadonlyArray<string>>;
  /** Inverse of inclusionChildren: for each file path, the repo-relative
   *  paths that declare it as a structural child. */
  readonly inclusionParents: ReadonlyMap<string, ReadonlyArray<string>>;
}

export interface BuildContextOptions {
  readonly repoRoot: string;
  /** Optional pre-compiled tag-index.json path. Loaded lazily if present. */
  readonly tagIndexPath?: string;
}

export async function buildCorpusContext(opts: BuildContextOptions): Promise<CorpusContext> {
  const records = await loadCorpus({ repoRoot: opts.repoRoot });

  const byPath = new Map<string, CorpusRecord>();
  for (const rec of records) byPath.set(rec.path, rec);

  // The article index dispatches (statute, article) → file. Statute
  // slugs come from the `tags` field — every statute-wiki file carries
  // its statute slug as a tag. We pair each statute-tag with every
  // article in articles_covered to populate the dispatch map.
  const articleIndex = new Map<string, CorpusRecord>();
  for (const rec of records) {
    const articles = getArticlesCovered(rec);
    if (articles.length === 0) continue;
    const tags = getTags(rec);
    // Heuristic: identify the statute slug. Any tag that ends in
    // `-law-1984` / `-law-1991` / `-law-NNNN` is treated as a statute
    // marker. There's only one such tag per statute-wiki file in the
    // current corpus convention.
    const statuteTags = tags.filter((t: string) => /-law-\d{4}$/.test(t) || /-regs-\d{4}$/.test(t) || /-order-\d{4}$/.test(t));
    for (const statute of statuteTags) {
      for (const article of articles) {
        articleIndex.set(keyOf(statute, article), rec);
      }
    }
  }

  let tagIndex: TagIndexShape | null = null;
  if (opts.tagIndexPath) {
    try {
      const raw = await readFile(resolve(opts.repoRoot, opts.tagIndexPath), "utf8");
      tagIndex = JSON.parse(raw) as TagIndexShape;
    } catch {
      // Compiled artefact may not exist yet — handlers that need it
      // fall back to scanning records directly.
      tagIndex = null;
    }
  }

  // Inclusion-link graph. Built in one pass: parse each record's body,
  // resolve each link target against the source path, drop links whose
  // resolved target isn't a known corpus file. Then invert to get parents.
  const inclusionChildren = new Map<string, ReadonlyArray<string>>();
  const parentSets = new Map<string, Set<string>>();
  for (const rec of records) {
    const seen = new Set<string>();
    const children: string[] = [];
    for (const link of extractInclusionLinkTargets(rec.body)) {
      const resolved = resolveInclusionTarget(rec.path, link.rawTarget);
      if (!byPath.has(resolved)) continue;
      if (resolved === rec.path) continue; // ignore self-links
      if (seen.has(resolved)) continue;
      seen.add(resolved);
      children.push(resolved);
      if (!parentSets.has(resolved)) parentSets.set(resolved, new Set());
      parentSets.get(resolved)!.add(rec.path);
    }
    inclusionChildren.set(rec.path, children);
  }
  const inclusionParents = new Map<string, ReadonlyArray<string>>();
  for (const [path, parents] of parentSets) {
    inclusionParents.set(path, [...parents].sort());
  }

  return {
    repoRoot: opts.repoRoot,
    records,
    byPath,
    tagIndex,
    articleIndex,
    inclusionChildren,
    inclusionParents,
  };
}

export function keyOf(statute: string, article: string): string {
  return `${statute}|${article}`;
}

// ---------------------------------------------------------------------------
// Re-export the loader accessors so handler modules have a single import.
// ---------------------------------------------------------------------------

export { getTags, getTitle, getStatus, getLastVerified, getArticlesCovered };

export function ageDaysBetween(lastVerified: string | null, asOf: Date): number | null {
  if (!lastVerified) return null;
  const lv = new Date(lastVerified + "T00:00:00Z").getTime();
  const ms = asOf.getTime() - lv;
  return Math.max(0, Math.floor(ms / 86_400_000));
}
