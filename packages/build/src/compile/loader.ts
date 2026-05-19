// Shared frontmatter loader. Walks the corpus and returns a list of
// parsed frontmatter records. Used by hier-tree.ts and tag-index.ts.
//
// Differs from validate/run.ts in shape and intent: the validator
// accumulates *violations*; the loader accumulates *parsed records*.
// The loader silently skips files that fail parse — the validator is
// the surface where such failures are reported.

import fastGlob from "fast-glob";
import matter from "gray-matter";
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import {
  frontmatterSchema,
  indexFrontmatterSchema,
  type FrontmatterShape,
} from "../validate/frontmatter.js";

export type CorpusKind = "concept" | "index" | "meta" | "other";

export interface CorpusRecord {
  /** Repo-relative path, e.g. "jersey/trusts/article-47-set-aside.md". */
  readonly path: string;
  /** Absolute filesystem path. */
  readonly abs: string;
  /** What kind of corpus file this is. */
  readonly kind: CorpusKind;
  /** Parsed frontmatter — strict shape for concept files, lighter shape for index files. */
  readonly frontmatter: FrontmatterShape | Record<string, unknown>;
  /** The markdown body (frontmatter stripped). */
  readonly body: string;
}

export interface LoadOptions {
  readonly repoRoot: string;
  readonly globs?: ReadonlyArray<string>;
}

// Jurisdiction directories at the repo root. Each is internally
// self-contained and follows the same frontmatter convention. Adjacent
// jurisdictions (cayman/, bvi/, etc.) are thinner than jersey/ but
// they're real content — show-trusts-comparison style questions need
// findByTag and getFile to reach them.
const DEFAULT_GLOBS = [
  "jersey/**/*.md",
  "cayman/**/*.md",
  "bvi/**/*.md",
  "guernsey/**/*.md",
  "bermuda/**/*.md",
  "isle-of-man/**/*.md",
];

const META_BASENAMES = new Set(["README.md", "COVERAGE-AUDIT.md"]);

export async function loadCorpus(opts: LoadOptions): Promise<ReadonlyArray<CorpusRecord>> {
  const { repoRoot } = opts;
  const globs = opts.globs ?? DEFAULT_GLOBS;
  const files = await fastGlob(globs.slice(), { cwd: repoRoot, onlyFiles: true });
  files.sort();

  const out: CorpusRecord[] = [];
  for (const rel of files) {
    const abs = resolve(repoRoot, rel);
    const raw = await readFile(abs, "utf8");
    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(raw);
    } catch {
      continue;
    }

    const name = basename(rel);
    if (META_BASENAMES.has(name)) {
      out.push({ path: rel, abs, kind: "meta", frontmatter: parsed.data, body: parsed.content });
      continue;
    }
    if (Object.keys(parsed.data).length === 0) {
      out.push({ path: rel, abs, kind: "other", frontmatter: {}, body: parsed.content });
      continue;
    }

    const isIndex = name === "index.md";
    const schema = isIndex ? indexFrontmatterSchema : frontmatterSchema;
    const result = schema.safeParse(parsed.data);
    if (!result.success) {
      // Silently skip — validator surface reports schema failures.
      out.push({
        path: rel,
        abs,
        kind: isIndex ? "index" : "concept",
        frontmatter: parsed.data,
        body: parsed.content,
      });
      continue;
    }

    out.push({
      path: rel,
      abs,
      kind: isIndex ? "index" : "concept",
      frontmatter: result.data,
      body: parsed.content,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Helpers — narrowed accessors that respect both the strict and lighter shapes
// ---------------------------------------------------------------------------

export function getTags(rec: CorpusRecord): ReadonlyArray<string> {
  const tags = (rec.frontmatter as { tags?: unknown }).tags;
  if (!Array.isArray(tags)) return [];
  return tags.filter((t): t is string => typeof t === "string");
}

export function getTitle(rec: CorpusRecord): string {
  const t = (rec.frontmatter as { title?: unknown }).title;
  return typeof t === "string" ? t : rec.path;
}

export function getStatus(rec: CorpusRecord): string {
  const s = (rec.frontmatter as { status?: unknown }).status;
  return typeof s === "string" ? s : "unknown";
}

export function getLastVerified(rec: CorpusRecord): string | null {
  const lv = (rec.frontmatter as { last_verified?: unknown }).last_verified;
  if (typeof lv === "string") return lv;
  if (lv instanceof Date) {
    const y = lv.getUTCFullYear().toString().padStart(4, "0");
    const m = (lv.getUTCMonth() + 1).toString().padStart(2, "0");
    const d = lv.getUTCDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return null;
}

export function getArticlesCovered(rec: CorpusRecord): ReadonlyArray<string> {
  const a = (rec.frontmatter as { articles_covered?: unknown }).articles_covered;
  if (!Array.isArray(a)) return [];
  return a.filter((x): x is string => typeof x === "string");
}

export function getPersona(rec: CorpusRecord): string | null {
  const p = (rec.frontmatter as { persona?: unknown }).persona;
  return typeof p === "string" ? p : null;
}

export function getCategory(rec: CorpusRecord): string | null {
  const c = (rec.frontmatter as { category?: unknown }).category;
  return typeof c === "string" ? c : null;
}
