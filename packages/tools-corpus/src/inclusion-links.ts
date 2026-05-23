// Inclusion-link parser.
//
// Per CONVENTIONS.md "Inclusion links — the third navigation axis":
// a markdown link on its own line is a structural parent → child
// relationship. An inline link is a cross-reference. This module
// extracts the structural links from a file body so the corpus context
// can build the inclusion-link graph used by getFile (depth /
// parentContext) and the tree handler.
//
// Excluded headings (lower-case, exact match after the # markers):
//   - "sources", "bibliography", "references", "further reading"
//   - "see also", "related", "related legislation", "related instruments"
//   - "cross-references", "cross-reference", "cross-refs"
//   - "meta"
//
// Excluded-heading scope is reset at H1/H2 boundaries only; H3+
// sub-sections inherit the parent scope. This matches the corpus's
// typical "## section / ### subsection" structure, and means a
// "### [Subitem](./sub.md)" heading-as-link inside "## Cross-references"
// stays correctly classified as a cross-reference.
//
// Skipped line shapes:
//   - fenced code blocks (``` ... ```)
//   - markdown link definitions (`[label]: url`)
//   - external URLs (http/https/mailto)
//   - pure anchor links (#...)

import { posix } from "node:path";

const EXCLUDED_HEADINGS = new Set<string>([
  "sources",
  "bibliography",
  "references",
  "further reading",
  "see also",
  "related",
  "related legislation",
  "related instruments",
  "cross-references",
  "cross-reference",
  "cross-refs",
  "meta",
]);

const HEADING_RE = /^[ \t]*(#{1,6})[ \t]+(.+?)[ \t]*$/;
const LINK_DEF_RE = /^[ \t]*\[[^\]]+\]:[ \t]/;
const CODE_FENCE_RE = /^[ \t]*```/;
// Inclusion link with an explicit list-marker or heading-marker prefix.
// Allows optional emphasis (** / * / __ / _) wrapping the link, an
// optional numeric "1." / "2." prefix instead of bullet, and an
// optional trailing " — description" / " - description". The corpus
// commonly writes section-index items as `- **[file.md](./file.md)** — …`,
// so we have to accept the bold-wrap.
const INCLUSION_WITH_MARKER_RE =
  /^[ \t]*(?:[-*+][ \t]+|\d+\.[ \t]+|#{1,6}[ \t]+)(?:\*\*|\*|__|_)?\[([^\]]+)\]\(([^)]+)\)(?:\*\*|\*|__|_)?(?:[ \t]+[—–\-][ \t]+.*)?[ \t]*$/;
// Bare-line inclusion link with no marker. We require the entire line to
// be just the link (no trailing prose) — otherwise we'd false-positive
// on wrapped bullet continuations like
// `  [Article 9](./firewall.md) — though not formally dependent…`
// where the link is part of a previous bullet's prose.
const INCLUSION_BARE_RE = /^[ \t]*(?:\*\*|\*|__|_)?\[([^\]]+)\]\(([^)]+)\)(?:\*\*|\*|__|_)?[ \t]*$/;

export interface InclusionLinkTarget {
  /** The raw target as written in the markdown (relative path). */
  readonly rawTarget: string;
  /** The link text, useful for diagnostics. */
  readonly text: string;
}

/**
 * Extract the inclusion-link targets from a markdown body. The body
 * must already have frontmatter stripped (CorpusRecord.body is in this
 * shape). Returns raw target strings as written; resolve them with
 * resolveInclusionTarget before checking corpus membership.
 */
export function extractInclusionLinkTargets(body: string): ReadonlyArray<InclusionLinkTarget> {
  const out: InclusionLinkTarget[] = [];
  let inCodeBlock = false;
  let inExcluded = false;

  for (const line of body.split(/\r?\n/)) {
    if (CODE_FENCE_RE.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const heading = HEADING_RE.exec(line);
    if (heading) {
      const hashes = heading[1] ?? "";
      const headingText = (heading[2] ?? "").toLowerCase().trim();
      if (hashes.length <= 2) {
        inExcluded = EXCLUDED_HEADINGS.has(headingText);
      }
      // Fall through — a heading line may itself be an inclusion link
      // ("### [Trusts](./trusts/index.md)" is exactly this shape in
      // index.md files).
    }
    if (inExcluded) continue;
    if (LINK_DEF_RE.test(line)) continue;

    const m = INCLUSION_WITH_MARKER_RE.exec(line) ?? INCLUSION_BARE_RE.exec(line);
    if (!m) continue;
    const text = m[1] ?? "";
    let target = (m[2] ?? "").trim();
    if (
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("mailto:") ||
      target.startsWith("#")
    ) {
      continue;
    }
    // Strip any anchor fragment (./foo.md#section).
    const hashIdx = target.indexOf("#");
    if (hashIdx >= 0) target = target.slice(0, hashIdx);
    if (!target) continue;

    out.push({ rawTarget: target, text });
  }
  return out;
}

/**
 * Resolve an inclusion-link's raw target against the source file's
 * repo-relative path. Returns a normalised repo-relative path the
 * caller can check against the byPath map.
 */
export function resolveInclusionTarget(sourcePath: string, target: string): string {
  if (target.startsWith("/")) return target.replace(/^\/+/, "");
  const sourceDir = posix.dirname(sourcePath);
  // posix.normalize handles "./" and "../" — the cwd-independent path
  // join is what we want here because all corpus paths are unix-style
  // relative.
  return posix.normalize(posix.join(sourceDir, target));
}
