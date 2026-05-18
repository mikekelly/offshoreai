// TAGS.md parser. Reads the canonical taxonomy from the repo root and
// returns the closed set of valid tag slugs.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const TAGS_FILE = "TAGS.md";

// Tags are listed in TAGS.md as bullet-list items of the form:
//   - `tag-slug` — description
// (the backticks and em-dash are convention but not strictly required;
// we accept any backtick-wrapped lower-kebab-case token at the start of
// a bullet line).
const tagLinePattern = /^[\s]*[-*]\s+`([a-z0-9]+(?:-[a-z0-9]+)*)`/;

export interface TagTaxonomy {
  readonly tags: ReadonlySet<string>;
  readonly source: string;
}

export async function loadTagTaxonomy(repoRoot: string): Promise<TagTaxonomy> {
  const path = resolve(repoRoot, TAGS_FILE);
  const body = await readFile(path, "utf8");
  const tags = new Set<string>();
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(tagLinePattern);
    if (m && m[1]) tags.add(m[1]);
  }
  return { tags, source: path };
}
