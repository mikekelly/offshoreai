// Compile hier-tree.json — a PageIndex-style tree of the corpus.
//
// Per PRD §6.1 retrieval primitive #1: section index → topic file →
// statute article. The tree is the agent's primary navigation surface
// (corpus.tree exposes it as a tool).
//
// Each node carries:
//   - path, title, status, lastVerified, ageDays
//   - childCount, articlesCovered, persona, category
//   - children: nested nodes
//
// Auto-summaries (1-3 sentence Sonnet 4.6 summary per node) are a
// SEPARATE pass — they need ANTHROPIC_API_KEY and live in
// summarise.ts. The hier-tree.json this module emits sets
// `summary: null` for every node; summarise.ts upserts summaries in
// place, content-hash-cached.

import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, posix, resolve } from "node:path";
import {
  getArticlesCovered,
  getCategory,
  getLastVerified,
  getPersona,
  getStatus,
  getTags,
  getTitle,
  loadCorpus,
  type CorpusRecord,
} from "./loader.js";

export interface HierTreeNode {
  readonly path: string;
  readonly title: string;
  readonly status: string;
  readonly lastVerified: string | null;
  readonly ageDays: number | null;
  readonly category: string | null;
  readonly persona: string | null;
  readonly articlesCovered: ReadonlyArray<string>;
  readonly tags: ReadonlyArray<string>;
  readonly childCount: number;
  readonly summary: string | null;
  readonly children: ReadonlyArray<HierTreeNode>;
}

export interface HierTree {
  readonly schemaVersion: "hier_tree_v1";
  readonly generatedAt: string;
  readonly stats: {
    readonly nodes: number;
    readonly sections: number;
    readonly conceptFiles: number;
    readonly indexFiles: number;
  };
  readonly roots: ReadonlyArray<HierTreeNode>;
}

export interface CompileHierTreeOptions {
  readonly repoRoot: string;
  readonly outPath?: string;
  /** "now" for live builds; injectable for deterministic tests. */
  readonly asOf?: Date;
}

export async function compileHierTree(opts: CompileHierTreeOptions): Promise<HierTree> {
  const records = await loadCorpus({ repoRoot: opts.repoRoot });
  const asOf = opts.asOf ?? new Date();

  // Group records by their containing directory. The tree's roots are
  // the jurisdiction directories (knowledge/jersey/, knowledge/cayman/, ...);
  // each subdirectory under a jurisdiction is a section. Within a
  // section, index.md is the section node and other .md files are
  // its children.
  const recordsByDir = new Map<string, CorpusRecord[]>();
  for (const rec of records) {
    const dir = posix.dirname(rec.path);
    if (!recordsByDir.has(dir)) recordsByDir.set(dir, []);
    recordsByDir.get(dir)!.push(rec);
  }

  // Build a directory tree first, then flatten into nodes.
  const allDirs = Array.from(recordsByDir.keys()).sort();
  // Heuristic: post-May-2026 restructure, corpus content lives under
  // knowledge/<jurisdiction>/. Pre-restructure layout (used by tests
  // with fixture corpora) put <jurisdiction>/ at the top level. Detect
  // both: if a dir starts with "knowledge/", the jurisdiction is the
  // second segment; otherwise it's the first.
  const jurisdictionDirs = new Set<string>();
  for (const dir of allDirs) {
    const parts = dir.split(posix.sep);
    if (parts.length === 0 || !parts[0]) continue;
    if (parts[0] === "knowledge") {
      if (parts.length >= 2 && parts[1]) jurisdictionDirs.add(`knowledge/${parts[1]}`);
    } else {
      jurisdictionDirs.add(parts[0]);
    }
  }

  const stats = {
    nodes: 0,
    sections: 0,
    conceptFiles: 0,
    indexFiles: 0,
  };

  const buildNodeForDir = (dir: string): HierTreeNode | null => {
    const recs = recordsByDir.get(dir) ?? [];
    // Find the section index.md if present.
    const indexRec = recs.find((r) => basename(r.path) === "index.md");
    const otherRecs = recs.filter((r) => basename(r.path) !== "index.md");

    // Recurse into subdirectories.
    const subDirs = allDirs.filter((d) => posix.dirname(d) === dir && d !== dir);
    const subNodes = subDirs
      .map((sd) => buildNodeForDir(sd))
      .filter((n): n is HierTreeNode => n !== null);

    // Concept-file children directly under this dir.
    const conceptChildren = otherRecs.map((r) => buildNodeForRecord(r, []));
    conceptChildren.forEach(() => (stats.conceptFiles += 1));

    const children = [...subNodes, ...conceptChildren].sort((a, b) =>
      a.path.localeCompare(b.path),
    );

    if (indexRec) {
      stats.indexFiles += 1;
      stats.sections += 1;
      stats.nodes += 1;
      return buildNodeForRecord(indexRec, children);
    }

    // No index.md — synthesise a directory node so the tree is still
    // walkable. Only do this when the directory has children, otherwise
    // skip (avoids empty branches).
    if (children.length === 0) return null;
    stats.nodes += 1;
    return synthesiseDirectoryNode(dir, children);
  };

  const buildNodeForRecord = (
    rec: CorpusRecord,
    children: ReadonlyArray<HierTreeNode>,
  ): HierTreeNode => {
    stats.nodes += 1;
    const lastVerified = getLastVerified(rec);
    const ageDays = lastVerified ? daysBetween(lastVerified, asOf) : null;
    return {
      path: rec.path,
      title: getTitle(rec),
      status: getStatus(rec),
      lastVerified,
      ageDays,
      category: getCategory(rec),
      persona: getPersona(rec),
      articlesCovered: getArticlesCovered(rec),
      tags: getTags(rec),
      childCount: children.length,
      summary: null,
      children,
    };
  };

  const roots: HierTreeNode[] = [];
  for (const j of Array.from(jurisdictionDirs).sort()) {
    const n = buildNodeForDir(j);
    if (n) roots.push(n);
  }

  const tree: HierTree = {
    schemaVersion: "hier_tree_v1",
    generatedAt: new Date().toISOString(),
    stats,
    roots,
  };

  if (opts.outPath) {
    const abs = resolve(opts.repoRoot, opts.outPath);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, JSON.stringify(tree, null, 2) + "\n", "utf8");
  }
  return tree;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function synthesiseDirectoryNode(
  dir: string,
  children: ReadonlyArray<HierTreeNode>,
): HierTreeNode {
  return {
    path: dir + "/",
    title: basename(dir) || dir,
    status: "directory",
    lastVerified: null,
    ageDays: null,
    category: null,
    persona: null,
    articlesCovered: [],
    tags: [],
    childCount: children.length,
    summary: null,
    children,
  };
}

function daysBetween(lastVerified: string, asOf: Date): number {
  const lv = new Date(lastVerified + "T00:00:00Z").getTime();
  const now = asOf.getTime();
  const ms = now - lv;
  return Math.max(0, Math.floor(ms / 86_400_000));
}
