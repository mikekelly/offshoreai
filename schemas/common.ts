// Shared Zod types used across the offshoreai tool surfaces.
//
// Promoted to packages/schemas/src/common.ts in week 3
// (see ../IMPLEMENTATION-PLAN.md).

import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Relative corpus path, e.g. "jersey/trusts/article-47-set-aside.md". */
export const filePath = z
  .string()
  .min(1)
  .refine((p) => !p.startsWith("/"), "must be a repo-relative path, no leading /")
  .refine((p) => p.endsWith(".md"), "must point at a markdown file");

/** Lower-kebab-case tag from TAGS.md. Whitelist enforced server-side. */
export const tag = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "tags are lower-kebab-case");

/** Statute slug as named in TAGS.md, e.g. "trusts-law-1984". */
export const statuteSlug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "statute slug is lower-kebab-case");

/** Article identifier as printed in the statute, including letter suffixes. */
export const articleId = z.string().regex(/^[0-9]+[A-Z]?$/, 'e.g. "47", "47A", "123C"');

/** ISO date (YYYY-MM-DD), no time component. */
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Section slug under a jurisdiction, e.g. "trusts" or "tax". */
export const sectionSlug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

// ---------------------------------------------------------------------------
// Status enum
// ---------------------------------------------------------------------------

/** Editorial status per CONVENTIONS.md. */
export const status = z.enum(["stub", "draft", "review", "stable"]);
export type Status = z.infer<typeof status>;

// ---------------------------------------------------------------------------
// Freshness
// ---------------------------------------------------------------------------

/**
 * Freshness verdict against the bundle's age threshold (default 180/365
 * for warn/stale). See AGENT-BEHAVIOURS.md #3.
 */
export const freshnessVerdict = z.enum(["fresh", "warn", "stale"]);
export type FreshnessVerdict = z.infer<typeof freshnessVerdict>;

export const freshnessRow = z.object({
  path: filePath,
  lastVerified: isoDate,
  ageDays: z.number().int().nonnegative(),
  verdict: freshnessVerdict,
});
export type FreshnessRow = z.infer<typeof freshnessRow>;

// ---------------------------------------------------------------------------
// Frontmatter source descriptor
// ---------------------------------------------------------------------------

export const sourceKind = z.enum([
  "statute",
  "regulation",
  "guidance",
  "judgment",
  "gov-page",
  "secondary",
]);
export type SourceKind = z.infer<typeof sourceKind>;

export const source = z.object({
  title: z.string(),
  url: z.string().url(),
  accessed: isoDate,
  kind: sourceKind,
});
export type Source = z.infer<typeof source>;

// ---------------------------------------------------------------------------
// Help block — every successful tool result ends with 2-4 of these
// (AXI "contextual disclosure" pattern, PRD §7.0.2 row 7).
// ---------------------------------------------------------------------------

/** A suggested next-step tool call, with <placeholder> syntax — never invented values. */
export const helpLine = z.string().min(1).max(240);
export const helpBlock = z.array(helpLine).min(0).max(4);
export type HelpBlock = z.infer<typeof helpBlock>;

// ---------------------------------------------------------------------------
// Stable error envelope (PRD §7.0.2 row 6)
//
// Handlers wrap in try/catch and return this envelope in
// content[0].text with isError: true on the CallToolResult. The agent
// dispatches on error_kind.
// ---------------------------------------------------------------------------

export const errorKind = z.enum([
  "stale_corpus",                  // corpus file older than threshold
  "stub_file",                     // path resolves to a stub
  "missing_file",                  // path does not exist
  "invalid_tag",                   // tag not in TAGS.md
  "invalid_article",               // article not in the statute
  "missing_bundle",                // (persona,task) pair has no compiled bundle
  "primary_source_unreachable",    // network/cache miss
  "validation_error",              // input failed Zod parse
  "rate_limited",                  // upstream throttle
  "denied",                        // canUseTool deny
  "internal_error",                // catch-all programmer error escape
]);
export type ErrorKind = z.infer<typeof errorKind>;

export const errorEnvelope = z.object({
  errorKind,
  message: z.string(),
  context: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  help: helpBlock,
});
export type ErrorEnvelope = z.infer<typeof errorEnvelope>;

// ---------------------------------------------------------------------------
// Frontmatter shape — the canonical surface the build pipeline indexes
// and every corpus tool joins against.
// ---------------------------------------------------------------------------

export const frontmatter = z.object({
  title: z.string(),
  jurisdiction: z.string(),
  category: sectionSlug,
  status,
  lastVerified: isoDate,
  tags: z.array(tag).min(1).max(15),
  articlesCovered: z.array(articleId).optional(),
  sources: z.array(source).default([]),
  seeAlso: z.array(filePath).default([]),
  persona: z.string().optional(), // present on use-case files
});
export type Frontmatter = z.infer<typeof frontmatter>;
