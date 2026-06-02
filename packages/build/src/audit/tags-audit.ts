// Tag-taxonomy audit. Diffs the tags actually used across the corpus
// against the canonical set declared in TAGS.md, and reports the tags
// that are used but not declared ("unknown" tags) so TAGS.md can be
// amended.
//
// Composes the two functions that already own this knowledge — the
// loader the tag-index uses (compile/loader.loadCorpus) and the TAGS.md
// parser the validator uses (validate/tags.loadTagTaxonomy) — so there
// is no second copy of the "what tags are used" or "what tags are
// canonical" logic to drift.
//
// Scope note: the strict convention validator (validate/run.ts) only
// enforces the closed taxonomy against knowledge/jersey/**. This audit
// defaults to the WHOLE corpus, because amending TAGS.md is a
// corpus-wide reconciliation (e.g. `guernsey`, `cayman`, per-statute
// slugs live in non-Jersey files). Pass a narrower glob to scope it.

import { getTags, loadCorpus } from "../compile/loader.js";
import { loadTagTaxonomy } from "../validate/tags.js";

export interface UnknownTag {
  /** The tag slug used in the corpus but absent from TAGS.md. */
  readonly tag: string;
  /** Number of files that apply this tag. */
  readonly count: number;
  /** First file (path-sorted) that applies it — a jumping-off point. */
  readonly examplePath: string;
}

export interface TagAuditResult {
  /** Count of tag slugs declared in TAGS.md. */
  readonly canonicalCount: number;
  /** Count of distinct tag slugs applied anywhere in the scanned corpus. */
  readonly uniqueUsedCount: number;
  /** Total tag applications across all scanned files. */
  readonly totalApplications: number;
  /** Used-but-not-declared tags, sorted by count desc then slug asc. */
  readonly unknown: ReadonlyArray<UnknownTag>;
}

export interface AuditTagsOptions {
  readonly repoRoot: string;
  /** Defaults to the loader's whole-corpus glob (knowledge/**​/*.md). */
  readonly globs?: ReadonlyArray<string>;
}

export async function auditTags(opts: AuditTagsOptions): Promise<TagAuditResult> {
  const taxonomy = await loadTagTaxonomy(opts.repoRoot);
  // Omit `globs` entirely when unset — the package uses
  // exactOptionalPropertyTypes, so passing `undefined` is a type error
  // and we want loadCorpus to fall back to its own default glob.
  const records = await loadCorpus(
    opts.globs ? { repoRoot: opts.repoRoot, globs: opts.globs } : { repoRoot: opts.repoRoot },
  );

  const counts = new Map<string, number>();
  const example = new Map<string, string>();
  let totalApplications = 0;

  // loadCorpus returns path-sorted records, so the first time we see a
  // tag is deterministically its lowest-sorted file.
  for (const rec of records) {
    for (const tag of getTags(rec)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
      totalApplications += 1;
      if (!example.has(tag)) example.set(tag, rec.path);
    }
  }

  const unknown: UnknownTag[] = [];
  for (const [tag, count] of counts) {
    if (!taxonomy.tags.has(tag)) {
      unknown.push({ tag, count, examplePath: example.get(tag)! });
    }
  }
  unknown.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  return {
    canonicalCount: taxonomy.tags.size,
    uniqueUsedCount: counts.size,
    totalApplications,
    unknown,
  };
}
