// Top-level validator. Walks the corpus, parses frontmatter, applies
// the schema, checks tag whitelist, checks relative-link integrity,
// returns a ValidationResult with all violations.
//
// Per IMPLEMENTATION-PLAN.md week 1: this is the first build verb. On
// the first run it produces a conformance snapshot at
// evals/conformance-baseline.yaml — those violations become the
// editorial team's week-1 backlog rather than CI failures.

import fastGlob from "fast-glob";
import matter from "gray-matter";
import { readFile } from "node:fs/promises";
import { basename, relative, resolve } from "node:path";
import { z } from "zod";
import { frontmatterSchema, indexFrontmatterSchema } from "./frontmatter.js";
import { extractRelativeLinks, resolveTargetExists } from "./links.js";
import { loadTagTaxonomy } from "./tags.js";
import type {
  ValidationResult,
  ValidationViolation,
  ViolationKind,
} from "./types.js";

const TAG_MIN = 5;
const TAG_MAX = 10;

export interface ValidateOptions {
  readonly repoRoot: string;
  readonly globs?: ReadonlyArray<string>;
  readonly tagCountRange?: { readonly min: number; readonly max: number };
  readonly checkLinks?: boolean;
}

// Per the May-2026 restructure, corpus content is under
// knowledge/<jurisdiction>/. The validator scans Jersey content
// (where the TAGS.md taxonomy is grounded); adjacent jurisdictions
// are scanned by the compile pipeline but not strictly validated
// against TAGS.md (their tag conventions may diverge — editorial
// decision pending).
const DEFAULT_GLOBS = ["knowledge/jersey/**/*.md"];

export async function validateCorpus(opts: ValidateOptions): Promise<ValidationResult> {
  const { repoRoot } = opts;
  const globs = opts.globs ?? DEFAULT_GLOBS;
  const tagRange = opts.tagCountRange ?? { min: TAG_MIN, max: TAG_MAX };
  const checkLinks = opts.checkLinks ?? true;

  const taxonomy = await loadTagTaxonomy(repoRoot);
  const files = await fastGlob(globs.slice(), { cwd: repoRoot, onlyFiles: true });
  files.sort();

  const violations: ValidationViolation[] = [];
  let filesWithFrontmatter = 0;

  for (const rel of files) {
    const abs = resolve(repoRoot, rel);
    const raw = await readFile(abs, "utf8");

    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(raw);
    } catch (err) {
      violations.push({
        path: rel,
        kind: "invalid_frontmatter_shape",
        detail: `YAML parse error: ${(err as Error).message}`,
      });
      continue;
    }

    // Skip files with no frontmatter — they are likely human-facing
    // READMEs, the COVERAGE-AUDIT, and the like. CONVENTIONS.md says
    // index.md files use a lighter frontmatter, but README.md and
    // similar are out-of-scope for the validator.
    if (Object.keys(parsed.data).length === 0) {
      // Heuristic: only flag missing frontmatter on files in section
      // directories under knowledge/jersey/<section>/<anything>.md other than
      // README.md, COVERAGE-AUDIT.md, etc. (top-level meta files).
      const isMeta = isMetaFile(rel);
      if (!isMeta) {
        violations.push({
          path: rel,
          kind: "missing_frontmatter",
          detail: "no YAML frontmatter found; substantive content files require it",
        });
      }
      continue;
    }

    filesWithFrontmatter += 1;

    const isIndex = basename(rel) === "index.md";
    const schema = isIndex ? indexFrontmatterSchema : frontmatterSchema;
    const result = schema.safeParse(parsed.data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        violations.push(zodIssueToViolation(rel, issue));
      }
    } else {
      // Tag count check (only for non-index files).
      if (!isIndex) {
        const tags = (parsed.data as { tags?: string[] }).tags ?? [];
        if (tags.length < tagRange.min) {
          violations.push({
            path: rel,
            kind: "too_few_tags",
            detail: `${tags.length} tag(s); CONVENTIONS.md asks for ${tagRange.min}–${tagRange.max}`,
          });
        } else if (tags.length > tagRange.max) {
          violations.push({
            path: rel,
            kind: "too_many_tags",
            detail: `${tags.length} tag(s); CONVENTIONS.md asks for ${tagRange.min}–${tagRange.max}`,
          });
        }
        // Closed-taxonomy check.
        for (const tag of tags) {
          if (!taxonomy.tags.has(tag)) {
            violations.push({
              path: rel,
              kind: "unknown_tag",
              detail: `tag "${tag}" is not in TAGS.md`,
            });
          }
        }
      } else {
        // index.md may carry optional tags; still validate they're known if present.
        const tags = (parsed.data as { tags?: string[] }).tags ?? [];
        for (const tag of tags) {
          if (!taxonomy.tags.has(tag)) {
            violations.push({
              path: rel,
              kind: "unknown_tag",
              detail: `tag "${tag}" is not in TAGS.md`,
            });
          }
        }
      }

      // see_also link check.
      const seeAlso = (parsed.data as { see_also?: string[] }).see_also ?? [];
      if (checkLinks) {
        for (const target of seeAlso) {
          const ok = await resolveTargetExists(abs, target);
          if (!ok) {
            violations.push({
              path: rel,
              kind: "broken_see_also",
              detail: `see_also target does not exist: ${target}`,
            });
          }
        }
      }
    }

    // Body-link integrity (only when frontmatter parsed at least to top-level)
    if (checkLinks) {
      const links = extractRelativeLinks(parsed.content);
      for (const link of links) {
        const ok = await resolveTargetExists(abs, link.target);
        if (!ok) {
          violations.push({
            path: rel,
            kind: "broken_relative_link",
            detail: `inline link target does not exist: ${link.target}`,
            line: link.line,
          });
        }
      }
    }
  }

  return summarise(files.length, filesWithFrontmatter, violations);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isMetaFile(rel: string): boolean {
  const name = basename(rel);
  if (name === "README.md") return true;
  if (name === "COVERAGE-AUDIT.md") return true;
  if (name === "changelog.md") return false; // changelog has frontmatter
  if (name === "glossary.md") return false; // glossary has frontmatter
  if (name === "sources.md") return false; // sources has frontmatter
  return false;
}

function zodIssueToViolation(path: string, issue: z.ZodIssue): ValidationViolation {
  const field = issue.path.join(".");
  const detail = field ? `${field}: ${issue.message}` : issue.message;
  // Map common Zod issues to our coarser ViolationKind enum so the
  // editorial team can scan by class.
  if (field.startsWith("tags")) {
    if (issue.message.toLowerCase().includes("kebab")) {
      return { path, kind: "invalid_tag_format", detail };
    }
    return { path, kind: "invalid_tag_format", detail };
  }
  if (field === "last_verified" || field === "accessed" || field.includes("accessed")) {
    return { path, kind: "invalid_date_shape", detail };
  }
  if (field === "status") {
    return { path, kind: "invalid_status_enum", detail };
  }
  if (field === "jurisdiction") {
    return { path, kind: "invalid_jurisdiction_slug", detail };
  }
  if (field.includes("kind") && field.includes("sources")) {
    return { path, kind: "invalid_source_kind", detail };
  }
  if (issue.code === "invalid_type" && field.includes("required")) {
    return { path, kind: "missing_required_field", detail };
  }
  return { path, kind: "invalid_frontmatter_shape", detail };
}

function summarise(
  filesScanned: number,
  filesWithFrontmatter: number,
  violations: ReadonlyArray<ValidationViolation>,
): ValidationResult {
  const byKind: Record<string, number> = {};
  const byFile: Record<string, number> = {};
  for (const v of violations) {
    byKind[v.kind] = (byKind[v.kind] ?? 0) + 1;
    byFile[v.path] = (byFile[v.path] ?? 0) + 1;
  }
  return {
    filesScanned,
    filesWithFrontmatter,
    violations,
    violationsByKind: byKind as Readonly<Record<ViolationKind, number>>,
    violationsByFile: byFile,
  };
}

// Re-export the path helper used in tests.
export function relPathFromRoot(repoRoot: string, abs: string): string {
  return relative(repoRoot, abs);
}
