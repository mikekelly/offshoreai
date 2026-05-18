// corpus.* — typed in-process tools registered with the Claude Agent SDK.
//
// 11 tools per PRD §7.1, each with a Zod input schema, a Zod output
// shape declaration, a TypeScript type alias, and the §7.0.3 five-part
// description that the SDK tool registration uses.
//
// Always-resident (in the §5.7 ~15-tool cap): getFile, getArticle,
// findByTag, getBundle, freshnessCheck, neighbours, tree, glossaryLookup.
// Load-on-demand via SDK tool-search: expandTags, semanticSearch, inventory.

import { z } from "zod";
import {
  articleId,
  filePath,
  freshnessRow,
  freshnessVerdict,
  frontmatter,
  helpBlock,
  isoDate,
  sectionSlug,
  status,
  statuteSlug,
  tag,
} from "./common.js";

// ===========================================================================
// 1. corpus.getFile
// ===========================================================================

export const getFileInput = z.object({
  path: filePath.describe("Repo-relative markdown path, e.g. jersey/trusts/article-47-set-aside.md."),
  full: z.boolean().default(false).describe("If true, return the entire file; default returns the first ~120 lines with a truncation hint."),
  fields: z.array(z.enum(["title", "tags", "sources", "articlesCovered", "seeAlso"])).optional()
    .describe("Opt-in extra frontmatter fields. Defaults to a minimal projection: path, status, lastVerified, tags."),
});

export const getFileResult = z.object({
  path: filePath,
  status,
  lastVerified: isoDate,
  ageDays: z.number().int().nonnegative(),
  frontmatter: frontmatter.partial(),
  body: z.string(),
  bodyTruncated: z.boolean(),
  totalLines: z.number().int().nonnegative(),
  totalTokensEstimate: z.number().int().nonnegative(),
  help: helpBlock,
});
export type GetFileResultType = z.infer<typeof getFileResult>;

export const getFileDescription = `
Read one corpus markdown file: returns its prose body plus the
authority-bearing frontmatter (status, last_verified, tags, sources).
This is the primary read primitive — every claim the agent ultimately
cites comes from a file it has loaded with getFile (or getArticle, or
getBundle which uses both internally).

Use when: you have a concrete path in hand from getBundle, findByTag,
neighbours, tree, semanticSearch or the bundle pre-loaded at session
start; you need the prose to ground an answer; the user has asked a
question and you've already narrowed to a specific file.

Do NOT use this when: you have a known statute Article and want its
canonical home — call getArticle instead, which dispatches by
(statute, article) and is more precise. Do NOT use it as a discovery
tool — if you don't have a path yet, reach for findByTag or
semanticSearch first; calling getFile speculatively wastes a turn.

Relationships: pairs with freshnessCheck — if the user implied
"current" or "latest", call freshnessCheck on the candidate path
before getFile. Pairs with neighbours — after reading a file, call
neighbours to discover related concepts via see_also and tag overlap.
Pairs with primarySource.fetch — when freshnessCheck reports stale,
fetch the primary source for the live text.

Returns: the file body (truncated at ~120 lines by default with a
size hint; pass full=true for the whole file) plus minimal
frontmatter. Read the body to ground your claim; cite the path in
your response; if the frontmatter status is "stub" or "draft", flag
the lower authority to the user.
`.trim();

// ===========================================================================
// 2. corpus.getArticle
// ===========================================================================

export const getArticleInput = z.object({
  statute: statuteSlug.describe('Statute slug as named in TAGS.md, e.g. "trusts-law-1984".'),
  article: articleId.describe('Article identifier as printed in the statute, e.g. "47" or "47A".'),
});

export const getArticleResult = z.object({
  statute: statuteSlug,
  article: articleId,
  canonicalPath: filePath,
  coversArticles: z.array(articleId).describe("Some files canonically cover an Article range (e.g. 47-47J in a single file)."),
  status,
  lastVerified: isoDate,
  ageDays: z.number().int().nonnegative(),
  body: z.string(),
  help: helpBlock,
});
export type GetArticleResultType = z.infer<typeof getArticleResult>;

export const getArticleDescription = `
Read the canonical statute-wiki file for a specific Article. The
build pipeline indexes every Article's canonical home from the
articlesCovered frontmatter field, so a request for "Article 47 of
the Trusts Law" dispatches deterministically to the right file even
when that file covers a range (e.g. 47-47J).

Use when: the user names an Article number; you are constructing a
citation that needs Article-level precision; the bundle in context
already references the statute but you want the article-level text
not just the cross-reference; you need to verify the exact statutory
wording before paraphrasing.

Do NOT use this when: the user's question is conceptual and the
matching content is in a topic file rather than a statute file —
use getFile via findByTag instead. Do NOT speculate Article numbers;
call inventory or the relevant articles-index file first if you're
not sure which Article governs.

Relationships: this is the precise sibling of getFile — getFile takes
a path, getArticle takes (statute, article) and resolves the path for
you. Pairs with primarySource.fetch on jerseylaw.je when the corpus
file may be behind the live statute. Pairs with neighbours on the
returned canonicalPath to surface the topic files that interpret the
Article.

Returns: the statute-file body plus its frontmatter and the list of
Articles the file canonically covers. Cite the statute + Article + the
canonicalPath in your response. If coversArticles is a range, note in
your answer which specific Article(s) within the range support the
claim.
`.trim();

// ===========================================================================
// 3. corpus.glossaryLookup
// ===========================================================================

export const glossaryLookupInput = z.object({
  term: z.string().min(1).describe("Term to look up in the jurisdiction's glossary.md, case-insensitive."),
  jurisdiction: z.string().default("jersey").describe("Jurisdiction slug; defaults to jersey."),
});

export const glossaryLookupResult = z.object({
  term: z.string(),
  jurisdiction: z.string(),
  definition: z.string().nullable(),
  citations: z.array(filePath).describe("Files that the glossary entry points at for deeper coverage."),
  help: helpBlock,
});
export type GlossaryLookupResultType = z.infer<typeof glossaryLookupResult>;

export const glossaryLookupDescription = `
Look up a defined term in the jurisdiction's glossary.md. The glossary
maps Jersey-specific vocabulary (Bailiff, Greffier, désastre,
Centeniers, …) to a definition plus pointers into the relevant
corpus files. Used both for term resolution and for term
normalisation before calling findByTag.

Use when: the user has used a term you do not immediately recognise
as canonical; you are about to call findByTag and want to confirm
the term has a single canonical tag; the user has used a casual
phrase ("the off-island shareholder rule") and you want the
formal Jersey-law label.

Do NOT use this for general English-language terms; do NOT use it
as a general fallback for "I don't know what this means" — if the
glossary returns null, reach for semanticSearch with the user's
phrasing rather than guessing. Do NOT skip this when the user's
term doesn't appear in TAGS.md — glossary normalisation is the
cheapest way to fix a "wrong parameter" mistake before it happens.

Relationships: called before findByTag when a term might map to a
non-obvious tag. Called after getFile when a file uses a defined
term whose meaning you want to confirm before paraphrasing. Pairs
with expandTags when the glossary entry suggests adjacent concepts.

Returns: definition (or null on miss) plus the list of corpus files
the glossary entry points at. On a hit, read those files via
getFile; on a miss, the no-definition signal is itself useful —
investigate via semanticSearch and consider whether the corpus
needs a new glossary entry (flag for editorial).
`.trim();

// ===========================================================================
// 4. corpus.findByTag
// ===========================================================================

export const findByTagInput = z.object({
  tags: z.array(tag).min(1).max(8).describe("Tags drawn from TAGS.md. Server rejects unknown tags with a 'did you mean' hint."),
  mode: z.enum(["and", "or"]).default("and").describe("AND intersects all tags; OR unions them."),
  section: sectionSlug.optional().describe("Restrict to a single section like 'trusts' or 'tax'."),
  status: z.array(status).optional().describe("Filter by status; omit to include all."),
  limit: z.number().int().min(1).max(100).default(20),
});

export const findByTagResult = z.object({
  count: z.number().int().nonnegative(),
  totalMatches: z.number().int().nonnegative(),
  files: z.array(z.object({
    path: filePath,
    title: z.string(),
    status,
    lastVerified: isoDate,
    tags: z.array(tag),
  })),
  help: helpBlock,
});
export type FindByTagResultType = z.infer<typeof findByTagResult>;

export const findByTagDescription = `
Look up corpus files by their frontmatter tags (intersection or
union). Tags are the primary navigation layer for an agent;
folder structure is a convenience for humans. Every substantive
content file carries 5–10 tags from the closed TAGS.md taxonomy,
so direct tag intersection is the cheapest and most precise way
to find cross-cutting material.

Use when: the user's question maps to one or more known tags from
TAGS.md (firewall + forced-heirship; reserved-powers + us-grantor-trust);
you want files that span multiple sections without walking the folder
tree; you have a topic in mind and the topic has a canonical tag.

Do NOT use this when: the user's phrasing doesn't map cleanly to a
known tag — use semanticSearch instead (it's more forgiving of
non-canonical vocabulary). Do NOT use this with invented tags — the
server rejects them with a "did you mean" hint, but a known-invalid
tag is a wasted call. Do NOT use it as a substitute for getBundle
when a bundle is already loaded for the topic; the bundle already
has the relevant files in context.

Relationships: precedes getFile (call findByTag, then read top hits
with getFile). Precedes expandTags when AND-intersection returned too
few hits and you want to broaden the tag set. The cheaper and more
precise sibling of semanticSearch — reach for findByTag first when
you have canonical tags, semanticSearch only when you don't.

Returns: ranked matching files with path, title, status,
lastVerified, tags. Read the top 3 with getFile. If count is 0 with
mode="and", try mode="or" or call expandTags to widen the tag set;
the response includes a "did you mean" line when one of the input
tags is unknown.
`.trim();

// ===========================================================================
// 5. corpus.expandTags
// ===========================================================================

export const expandTagsInput = z.object({
  tags: z.array(tag).min(1).max(5),
  k: z.number().int().min(1).max(20).default(5).describe("Number of nearest-neighbour tags to return."),
});

export const expandTagsResult = z.object({
  inputTags: z.array(tag),
  neighbours: z.array(z.object({
    tag,
    coOccurrenceScore: z.number(),
    coOccurringWith: z.array(tag),
  })),
  help: helpBlock,
});
export type ExpandTagsResultType = z.infer<typeof expandTagsResult>;

export const expandTagsDescription = `
Expand a set of seed tags into nearest-neighbour tags using the
co-occurrence matrix the build pipeline computes from frontmatter.
The model uses this to broaden a tag intersection that returned
too few files, or to discover adjacent concepts the user hasn't
named explicitly.

Use when: a prior findByTag in mode="and" returned fewer than 3
hits and you want to widen the search; the user is asking a
question that's likely to span adjacent concepts and you want to
discover them rather than guessing; you're constructing a bundle
recommendation and want the tag-neighbourhood as the candidate set.

Do NOT use this as a discovery primitive when you have no seed
tags — reach for semanticSearch instead (vector retrieval over the
user's actual phrasing). Do NOT chain expandTags repeatedly; one
expansion is informative, two is drift. Do NOT use it to invent
new tags — the response is strictly from the closed TAGS.md set.

Relationships: typically called between two findByTag calls — first
findByTag returns too few hits, expandTags broadens, second
findByTag with the expanded set returns better coverage. Pairs with
inventory when the question is about the overall shape of a
tag-cluster in the corpus.

Returns: each neighbour tag plus its co-occurrence score and the
tags it most often co-occurs with. Pick the top 2-3 to widen your
findByTag; ignore neighbours whose co-occurring-with list looks
off-topic — that's a sign the score is from a single outlier file.
`.trim();

// ===========================================================================
// 6. corpus.neighbours
// ===========================================================================

export const neighboursInput = z.object({
  path: filePath,
  kinds: z.array(z.enum(["see_also", "backlinks", "tag"])).default(["see_also", "backlinks", "tag"]),
  limit: z.number().int().min(1).max(50).default(20),
});

export const neighboursResult = z.object({
  path: filePath,
  seeAlso: z.array(z.object({ path: filePath, title: z.string() })),
  backlinks: z.array(z.object({ path: filePath, title: z.string() })),
  tagNeighbours: z.array(z.object({
    path: filePath,
    title: z.string(),
    sharedTags: z.array(tag),
    sharedTagCount: z.number().int().nonnegative(),
  })),
  help: helpBlock,
});
export type NeighboursResultType = z.infer<typeof neighboursResult>;

export const neighboursDescription = `
Pre-computed-aggregate that returns three relationships for a given
file in a single call: its frontmatter see_also targets, its
backlinks (files that link to it), and its tag-neighbours (files
sharing two or more tags ranked by overlap). The AXI "combined
operations" pattern applied to corpus navigation — saves the agent
three separate round-trips per file.

Use when: you have read a file with getFile and want to find what
sits around it conceptually; you are following a citation trail and
want to know what else points at the file you just landed on; you
are about to answer a question and want to confirm you haven't
missed an adjacent concept the user might ask about next.

Do NOT use this when you don't yet have a specific path — reach for
findByTag, semanticSearch, or tree first to find candidate paths.
Do NOT use it as a substitute for findByTag when you have a known
tag — neighbours is per-file, findByTag is per-tag-set; they're
different shapes of query.

Relationships: typically called after getFile to discover adjacent
concepts. Precedes another getFile on the most promising neighbour.
Pairs with expandTags when the tag-neighbours surface a tag you
hadn't considered; pass that tag back through findByTag to broaden
the corpus you're working with.

Returns: three lists — see_also, backlinks, tagNeighbours — each
with path and title. Read the top see_also or backlink hit with
getFile if it directly supports the user's question; treat
tagNeighbours as a broader exploration signal rather than a
definitive next-read.
`.trim();

// ===========================================================================
// 7. corpus.tree
// ===========================================================================

export const treeInput = z.object({
  section: z.string().optional().describe("Subtree root; omit for the whole jurisdiction tree. Accepts 'jersey/trusts' style paths."),
  depth: z.number().int().min(1).max(5).default(2).describe("How many levels to descend."),
  includeSummaries: z.boolean().default(true).describe("Include the auto-generated 1-3 sentence summary per node."),
});

export const treeResult = z.object({
  root: z.string(),
  nodes: z.array(z.object({
    path: filePath,
    title: z.string(),
    status,
    lastVerified: isoDate,
    childCount: z.number().int().nonnegative(),
    summary: z.string().optional(),
  })),
  help: helpBlock,
});
export type TreeResultType = z.infer<typeof treeResult>;

export const treeDescription = `
Walk the corpus as a PageIndex-style tree of summaries —
jurisdiction → section index → topic file → statute article. The
build pipeline pre-computes a 1-3 sentence summary per node so the
agent can reason over node summaries rather than node contents,
choosing where to descend before loading prose.

Use when: the user's question is conceptual and you need to orient
on what the corpus has on a topic before diving into specific files;
you have landed in an unfamiliar section and want to understand its
shape; you are looking for the canonical entry point on a topic and
the summaries help you choose between candidate index.md files.

Do NOT use this when you have a specific tag or a specific Article
in hand — findByTag and getArticle are more direct. Do NOT walk the
tree at depth > 3 when you're trying to narrow — high-depth walks
return too many nodes to reason over efficiently; descend
iteratively instead.

Relationships: tree is the orientation primitive that precedes
getFile; findByTag is the lookup primitive that precedes getFile;
they're complementary entry points to the same read step. Pairs
with inventory when you want a flat filtered list rather than a
hierarchical view.

Returns: a flat list of nodes within the requested subtree, each
with a 1-3 sentence summary. Pick the most relevant 1-2 nodes and
read them with getFile; if no node looks right, descend the most
promising subtree by re-calling tree with a deeper section path.
`.trim();

// ===========================================================================
// 8. corpus.semanticSearch
// ===========================================================================

export const semanticSearchInput = z.object({
  query: z.string().min(2).describe("Natural-language phrasing. The tool embeds this and ANN-searches the per-file summary index."),
  k: z.number().int().min(1).max(50).default(10),
  section: sectionSlug.optional(),
});

export const semanticSearchResult = z.object({
  query: z.string(),
  hits: z.array(z.object({
    path: filePath,
    title: z.string(),
    score: z.number(),
    summary: z.string(),
    tags: z.array(tag),
  })),
  help: helpBlock,
});
export type SemanticSearchResultType = z.infer<typeof semanticSearchResult>;

export const semanticSearchDescription = `
Run a vector semantic search over per-file corpus summary
embeddings. Vector search is plumbing, not the product — it is the
fallback for fuzzy phrasing and novel terminology that the
tag-graph (findByTag, expandTags) and the hierarchical tree do not
handle gracefully. Embeds the query, ANN-searches the pgvector
index, returns ranked (path, score, summary) rows.

Use when: the user's query uses non-canonical phrasing ("tax
avoidance" rather than "economic substance"); findByTag returned
fewer than 3 hits and expandTags didn't surface a useful neighbour;
the user asks about a topic that doesn't map cleanly to one of the
closed TAGS.md tags.

Do NOT use this for known-tag queries — findByTag is cheaper and
more precise. Do NOT use it when a bundle is already loaded
covering the topic area — the bundle already has the relevant
files. Do NOT use it as a first reach; tag and tree primitives are
faster and more deterministic.

Relationships: the fallback sibling of findByTag. If the user
implies "current" or "latest", call freshnessCheck on the candidate
paths before reading them. After top hits arrive, switch back to
the deterministic primitives — read with getFile, explore adjacent
material with neighbours.

Returns: ranked (path, score, summary, tags) rows. Read the top 3
with getFile if scores > 0.7; below 0.5 the query likely needs
reformulation — try glossaryLookup to find the canonical term, or
rephrase with terminology you've seen in TAGS.md.
`.trim();

// ===========================================================================
// 9. corpus.inventory
// ===========================================================================

export const inventoryInput = z.object({
  filter: z.object({
    section: sectionSlug.optional(),
    status: z.array(status).optional(),
    tags: z.array(tag).optional(),
    lastVerifiedOlderThanDays: z.number().int().nonnegative().optional(),
    recentlyChangedDays: z.number().int().nonnegative().optional(),
  }),
  limit: z.number().int().min(1).max(500).default(50),
});

export const inventoryResult = z.object({
  count: z.number().int().nonnegative(),
  totalMatches: z.number().int().nonnegative(),
  files: z.array(z.object({
    path: filePath,
    title: z.string(),
    status,
    lastVerified: isoDate,
    ageDays: z.number().int().nonnegative(),
    tags: z.array(tag),
  })),
  help: helpBlock,
});
export type InventoryResultType = z.infer<typeof inventoryResult>;

export const inventoryDescription = `
Filtered flat listing of corpus files by status, tag, section,
age, or recent-change window. The single-purpose tool behind every
"what's stub in trusts?", "what's older than 6 months in tax?",
and "what changed in the last fortnight in financial-regulation?"
query — both for the agent's own situational awareness and for
editorial backlog assembly.

Use when: the user asks about corpus state ("what are you confident
on in this area?", "what's stale?"); you are about to answer and
want to confirm coverage breadth before promising completeness; the
agent's session-start dashboard suggested a stale-heavy section
and you want the specific paths.

Do NOT use this as a retrieval primitive for the user's actual
question — it returns metadata, not content; getFile is what reads
the prose. Do NOT use it when a known tag would surface the same
set; findByTag is the more focused tool. Do NOT use it to count
"the size of the corpus" abstractly — that's a build-pipeline
metric, not an agent-facing concern.

Relationships: pairs with tree (tree is hierarchical-by-summary,
inventory is flat-with-filter). Precedes editorial-flag responses
to the user — "I see 14 stub files in the area you're asking about;
here are the 3 most central". Pairs with freshnessCheck for
age-driven sweeps.

Returns: matching files with status, age in days, tags. If the
filter is "what's stale", surface the count to the user as a
caveat. If the filter is "what's stub", refuse to make
authoritative claims from stubs and suggest fetching the primary
source instead.
`.trim();

// ===========================================================================
// 10. corpus.getBundle
// ===========================================================================

export const getBundleInput = z.object({
  persona: z.string().describe("Persona slug, e.g. trust-officer, fund-counsel, mlro."),
  task: z.string().describe("Task slug as named in bundles/<persona>/<task>.yaml."),
});

export const getBundleResult = z.object({
  persona: z.string(),
  task: z.string(),
  freshness: freshnessVerdict,
  requiredFiles: z.array(z.object({
    path: filePath,
    title: z.string(),
    status,
    lastVerified: isoDate,
    ageDays: z.number().int().nonnegative(),
    verdict: freshnessVerdict,
    bodyExcerpt: z.string(),
  })),
  requiredArticles: z.array(z.object({
    statute: statuteSlug,
    article: articleId,
    canonicalPath: filePath,
    verdict: freshnessVerdict,
  })),
  relatedTags: z.array(tag),
  tagNeighbours: z.array(tag),
  citationPattern: z.string(),
  refusalRules: z.object({
    refuseIfStatusIn: z.array(status),
    warnIfStatusIn: z.array(status),
    freshnessMaxAgeDays: z.number().int().positive(),
  }),
  help: helpBlock,
});
export type GetBundleResultType = z.infer<typeof getBundleResult>;

export const getBundleDescription = `
Load the pre-compiled retrieval contract for a (persona, task) pair —
the bundle YAML plus the body excerpts of every required file plus
the freshness verdict for each file plus the resolved tag-neighbours,
all in one envelope. This is the AXI pre-computed-aggregate pattern
applied to our retrieval contract: one tool call replaces what
would otherwise be ~12 separate getFile + freshnessCheck +
expandTags round-trips.

Use when: at session start (the bundle-assembler sub-agent calls
this on every session); when the user pivots to a different
persona/task mid-session and a new bundle should warm; when you
want to verify a known bundle's contents before answering a
question that should be bundle-grounded.

Do NOT use this for ad-hoc retrieval — bundles are pre-compiled
for known persona/task pairs only. If a bundle doesn't exist for
the question, fall back to findByTag + getFile rather than asking
for a bundle that won't load. Do NOT call this repeatedly mid-turn
— the bundle is the session's anchor context, not a per-query
lookup.

Relationships: the orchestrating primitive; getFile, getArticle,
findByTag, freshnessCheck all do pieces of what getBundle does in
one call. Pairs with bundle-assembler at SessionStart. Pairs with
the citation-verifier sub-agent — the verifier re-reads the
bundle's required files when checking claims.

Returns: required files (with body excerpts), required articles,
related tags + neighbours, the citation pattern the answer should
follow, and the refusal rules (refuse if any required file is
stub, warn on draft, etc.). Treat the bundle as your default
working set for the rest of the session; reach for findByTag /
semanticSearch only when the bundle doesn't cover the query.
`.trim();

// ===========================================================================
// 11. corpus.freshnessCheck
// ===========================================================================

export const freshnessCheckInput = z.object({
  paths: z.array(filePath).min(1).max(50),
  thresholdDays: z.object({
    warn: z.number().int().positive().default(180),
    stale: z.number().int().positive().default(365),
  }).default({ warn: 180, stale: 365 }),
});

export const freshnessCheckResult = z.object({
  rows: z.array(freshnessRow),
  worstVerdict: freshnessVerdict,
  help: helpBlock,
});
export type FreshnessCheckResultType = z.infer<typeof freshnessCheckResult>;

export const freshnessCheckDescription = `
Compute the freshness verdict (fresh / warn / stale) for a set of
corpus paths against an age threshold. This is the agent-side gate
against citing files whose last_verified date is older than the
bundle (or task) tolerates. The freshness-checker sub-agent uses
this as its first step before deciding whether to also fetch the
primary source via primarySource.fetch.

Use when: the user implies "current", "latest", "as of today", or
asks about an area where rules change frequently (sanctions,
substance, tax rates); you've just loaded a file with getFile and
want to confirm it's still fresh before relying on it; you're
about to commit a citation and want a final age check.

Do NOT use this when the file's age is irrelevant to the question
(historical-only questions, conceptual definitions stable for
decades). Do NOT use it as a substitute for primarySource.fetch
when the user explicitly asked for the live text — freshnessCheck
only reads the corpus's last_verified date; it does not contact
the upstream source.

Relationships: precedes getFile when the user signalled
"current". Precedes primarySource.fetch on every "stale" verdict —
when corpus is stale, go to the primary source. Pairs with
getBundle — bundles carry their own freshness window and the
bundle's load already reports the worst-verdict member.

Returns: per-path (lastVerified, ageDays, verdict) plus the worst
verdict in the set. If worstVerdict is "stale", do not cite the
file as-is — either fetch the primary source and cite that, or
caveat the answer and flag the stale corpus to the user.
`.trim();
