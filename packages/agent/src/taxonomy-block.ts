// Build the runtime-time tag taxonomy block that gets appended to the
// baseline system prompt.
//
// Why this exists: tags are a primary entry point to the corpus, but
// the agent has no way to discover the closed taxonomy without help.
// On evals/baselines/2026-05-19-offshoreai-agent the agent guessed
// `set-aside` and `parish-hall-enquiry` (both wrong) on 2 of 3
// questions; correct tags are `setting-aside` and `parish-hall`.
// Each wrong guess cost 1-3 wasted tool calls and pushed the agent
// toward Bash fallback.
//
// Investment: ~6K tokens of tag listings in the system prompt, paid
// once per session as a cache write. Saves multiple wasted retries
// per question, and lifts the typed-tool surface from "useless when
// you guess wrong" to "usable on the first call".

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

interface TagIndexShape {
  readonly tagToFiles: Record<string, ReadonlyArray<string>>;
  readonly stats: { readonly uniqueTags: number; readonly totalTagApplications: number; readonly filesIndexed: number };
}

export async function buildTaxonomyBlock(repoRoot: string, tagIndexPath: string): Promise<string> {
  let idx: TagIndexShape;
  try {
    const raw = await readFile(resolve(repoRoot, tagIndexPath), "utf8");
    idx = JSON.parse(raw) as TagIndexShape;
  } catch {
    return ""; // tag-index missing → no block; agent operates without taxonomy guidance
  }

  const entries: Array<[string, number]> = Object.entries(idx.tagToFiles)
    .map(([tag, files]) => [tag, files.length] as [string, number])
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  // Format as `tag(count), tag(count), ...` — agent searches its own
  // context with text search. Frequency-sorted so the most common ones
  // are first.
  const flat = entries.map(([t, n]) => `${t}(${n})`).join(", ");

  return `

# Corpus tag taxonomy

These are every tag that appears in the corpus's frontmatter, sorted by
file count. Use \`findByTag\` with these names exactly — they are the
only tags the inverted index will match. The canonical taxonomy spec
lives in TAGS.md (transcluded above via CLAUDE.md); the difference
between this list and TAGS.md is editorial drift the editorial team is
working down.

Use \`findByTag\` rather than Bash grep for tag-shaped queries. If your
first guess returns invalid_tag, scan this list (Ctrl-F mentally) for
the closest match — common variants: \`set-aside\` → \`setting-aside\`,
\`parish-hall-enquiry\` → \`parish-hall\`, \`hastings_bass\` →
\`hastings-bass\`.

${idx.stats.uniqueTags} tags across ${idx.stats.filesIndexed} files
(${idx.stats.totalTagApplications} total applications):

${flat}
`;
}
