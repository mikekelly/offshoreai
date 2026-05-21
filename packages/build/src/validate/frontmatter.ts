// Frontmatter Zod schema derived from CONVENTIONS.md.
//
// Note on naming: CONVENTIONS.md uses snake_case in YAML frontmatter
// (`last_verified`, `articles_covered`, `see_also`). We parse the YAML
// as-is — Zod field names match the on-disk YAML keys. Conversion to
// camelCase happens in the consumer modules (e.g. tools-corpus) if at
// all; the validator stays close to the corpus's own naming.
//
// One quirk of YAML 1.2 + gray-matter: bare `YYYY-MM-DD` values get
// parsed into a JS `Date` rather than a string. Rather than fight the
// parser, we accept both in the schema and normalise via a transform.
// Net effect for downstream consumers: dates are always strings.

import { z } from "zod";

const tagPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
// Article identifiers: digits + optional alpha suffix. Suffix can be
// multi-char (Jersey statute numbering includes e.g. Article 127YF in
// the Companies Law 1991).
const articlePattern = /^[0-9]+[A-Z]*$/;
const jurisdictionPattern = /^[a-z]+(-[a-z]+)*$/;

// Accept either an already-string YYYY-MM-DD or a JS Date (which is
// what gray-matter hands us for bare YAML dates). Normalise to string.
export const isoDate = z
  .union([
    z.string().regex(datePattern, "must be YYYY-MM-DD"),
    z.date().transform((d) => {
      const y = d.getUTCFullYear().toString().padStart(4, "0");
      const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = d.getUTCDate().toString().padStart(2, "0");
      return `${y}-${m}-${day}`;
    }),
  ])
  .transform((v) => (typeof v === "string" ? v : v));

export const statusEnum = z.enum(["stub", "draft", "review", "stable"]);
export type Status = z.infer<typeof statusEnum>;

export const sourceKindEnum = z.enum([
  "statute",
  "regulation",
  "guidance",
  "judgment",
  "gov-page",
  "secondary",
]);
export type SourceKind = z.infer<typeof sourceKindEnum>;

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  accessed: isoDate,
  kind: sourceKindEnum.optional(), // some early corpus files omit kind; we warn rather than fail
});

// A derived node (wormhole) records the PRIMARY nodes it distils. path is
// repo-relative (e.g. knowledge/jersey/...). content_hash + last_verified
// snapshot the source state at compile time so the freshness checker can
// invalidate the wormhole when a source drifts; both are optional for
// hand-authored wormholes (the build pipeline fills them on promotion).
export const derivedFromSchema = z.object({
  path: z.string().min(1),
  content_hash: z.string().min(1).optional(),
  last_verified: isoDate.optional(),
});

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  jurisdiction: z.string().regex(jurisdictionPattern, "jurisdiction is lower-kebab-case"),
  category: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "category is lower-kebab-case"),
  status: statusEnum,
  last_verified: isoDate,
  tags: z.array(z.string().regex(tagPattern, "tags are lower-kebab-case")).min(1).max(20),
  articles_covered: z.array(z.string().regex(articlePattern, 'articles like "47" or "47A"')).optional(),
  persona: z.string().regex(/^[a-z]+(-[a-z]+)*$/).optional(),
  sources: z.array(sourceSchema).default([]),
  see_also: z.array(z.string().min(1)).default([]),
  // Derived-node (wormhole) fields. Absent on primary (hand-authored)
  // files; present on machine/editor-derived nodes. See CONVENTIONS.md.
  derived: z.boolean().optional(),
  derived_from: z.array(derivedFromSchema).optional(),
  // Set by the promotion path once the citation-verifier has passed a
  // derived node; gates a derived node reaching status: stable.
  verifier_passed: z.boolean().optional(),
});

export type FrontmatterShape = z.infer<typeof frontmatterSchema>;

// Index files (jurisdiction/<section>/index.md) carry a lighter
// frontmatter per CONVENTIONS.md ("index.md files use a lighter
// frontmatter").
export const indexFrontmatterSchema = z.object({
  title: z.string().min(1),
  jurisdiction: z.string().regex(jurisdictionPattern),
  category: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  status: statusEnum,
  last_verified: isoDate,
  tags: z.array(z.string().regex(tagPattern)).optional(),
  see_also: z.array(z.string().min(1)).optional(),
});
