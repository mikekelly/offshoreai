// Compile tag-index.json + co-occurrence matrix.
//
// Per PRD §6.1 retrieval primitive #2:
//   - direct inverted index: { tag: [path, path, ...] }
//   - co-occurrence matrix: { tag: { neighbour_tag: count } } where
//     count is the number of files in which both tags appear
//
// The agent later uses:
//   - corpus.findByTag — direct lookup over the inverted index
//   - corpus.expandTags — nearest-neighbour expansion over the matrix
//
// Output is deterministic (sorted keys) so the JSON diffs cleanly
// across builds.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { getTags, loadCorpus } from "./loader.js";

export interface TagIndex {
  readonly schemaVersion: "tag_index_v1";
  readonly generatedAt: string;
  readonly stats: {
    readonly uniqueTags: number;
    readonly totalTagApplications: number;
    readonly filesIndexed: number;
  };
  readonly tagToFiles: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly coOccurrence: Readonly<Record<string, Readonly<Record<string, number>>>>;
}

export interface CompileTagIndexOptions {
  readonly repoRoot: string;
  readonly outPath?: string;
}

export async function compileTagIndex(opts: CompileTagIndexOptions): Promise<TagIndex> {
  const records = await loadCorpus({ repoRoot: opts.repoRoot });

  const tagToFiles: Record<string, string[]> = {};
  const coOccurrence: Record<string, Record<string, number>> = {};
  let filesIndexed = 0;
  let totalApplications = 0;

  for (const rec of records) {
    const tags = getTags(rec);
    if (tags.length === 0) continue;
    filesIndexed += 1;
    totalApplications += tags.length;

    for (const tag of tags) {
      if (!tagToFiles[tag]) tagToFiles[tag] = [];
      tagToFiles[tag].push(rec.path);

      if (!coOccurrence[tag]) coOccurrence[tag] = {};
      for (const other of tags) {
        if (other === tag) continue;
        coOccurrence[tag][other] = (coOccurrence[tag][other] ?? 0) + 1;
      }
    }
  }

  // Deterministic ordering: sort tag keys, file paths, neighbour keys.
  const sortedTagToFiles: Record<string, string[]> = {};
  for (const tag of Object.keys(tagToFiles).sort()) {
    sortedTagToFiles[tag] = tagToFiles[tag]!.slice().sort();
  }

  const sortedCoOccurrence: Record<string, Record<string, number>> = {};
  for (const tag of Object.keys(coOccurrence).sort()) {
    const neighbours = coOccurrence[tag]!;
    const sorted: Record<string, number> = {};
    for (const n of Object.keys(neighbours).sort()) {
      sorted[n] = neighbours[n]!;
    }
    sortedCoOccurrence[tag] = sorted;
  }

  const index: TagIndex = {
    schemaVersion: "tag_index_v1",
    generatedAt: new Date().toISOString(),
    stats: {
      uniqueTags: Object.keys(sortedTagToFiles).length,
      totalTagApplications: totalApplications,
      filesIndexed,
    },
    tagToFiles: sortedTagToFiles,
    coOccurrence: sortedCoOccurrence,
  };

  if (opts.outPath) {
    const abs = resolve(opts.repoRoot, opts.outPath);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, JSON.stringify(index, null, 2) + "\n", "utf8");
  }

  return index;
}
