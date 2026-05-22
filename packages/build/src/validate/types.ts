// Validator types — small, no Zod (these are internal aggregation shapes, not tool I/O).

export type ViolationKind =
  | "missing_frontmatter"
  | "invalid_frontmatter_shape"
  | "missing_required_field"
  | "invalid_status_enum"
  | "invalid_date_shape"
  | "invalid_tag_format"
  | "unknown_tag"
  | "too_few_tags"
  | "too_many_tags"
  | "broken_relative_link"
  | "broken_see_also"
  | "invalid_source_kind"
  | "invalid_jurisdiction_slug";

export interface ValidationViolation {
  readonly path: string;
  readonly kind: ViolationKind;
  readonly detail: string;
  readonly line?: number | undefined;
}

export interface ValidationResult {
  readonly filesScanned: number;
  readonly filesWithFrontmatter: number;
  readonly violations: ReadonlyArray<ValidationViolation>;
  readonly violationsByKind: Readonly<Record<ViolationKind, number>>;
  readonly violationsByFile: Readonly<Record<string, number>>;
}
