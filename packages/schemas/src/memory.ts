// memory.* — per-tenant A-Mem-style semantic-memory tools.
//
// Per PRD §5.3, §7.4: prompted self-control, not learned control.
// Per AGENT-PRINCIPLES Principle 3: semantic memory is never
// authoritative for high-stakes legal claims — every legal/regulatory
// assertion must still cite a corpus file. Notes influence retrieval
// and framing only.

import { z } from "zod";
import { filePath, helpBlock, isoDate, tag } from "./common.js";

// ---------------------------------------------------------------------------
// Shared note shape
// ---------------------------------------------------------------------------

export const noteId = z.string().regex(/^note_[a-z0-9]{16}$/);
export type NoteId = z.infer<typeof noteId>;

export const noteSource = z.enum(["agent", "import", "user"]);

export const note = z.object({
  id: noteId,
  tenantId: z.string(),
  content: z.string().min(1),
  context: z.string().describe("A-Mem-style descriptor of when the note was formed."),
  keywords: z.array(z.string()).max(20),
  tags: z.array(tag).max(10),
  citesCorpusPaths: z.array(filePath).default([]),
  source: noteSource,
  createdAt: isoDate,
  updatedAt: isoDate,
  version: z.number().int().nonnegative(),
});
export type Note = z.infer<typeof note>;

// ===========================================================================
// 1. memory.add — idempotent (dedupe by content hash)
// ===========================================================================

export const addInput = z.object({
  content: z.string().min(1).max(4000),
  context: z.string().min(1).max(1000),
  keywords: z.array(z.string()).max(20).default([]),
  tags: z.array(tag).max(10).default([]),
  citesCorpusPaths: z.array(filePath).default([]),
});

export const addResult = z.object({
  noteId,
  created: z.boolean().describe("False when an existing note with the same content hash was returned."),
  linkedTo: z.array(noteId).describe("Auto-generated A-Mem links to similar existing notes."),
  help: helpBlock,
});
export type AddResultType = z.infer<typeof addResult>;

export const addDescription = `
Add an atomic note to the tenant's semantic-memory store. One fact
or one observation per call. The handler dedupes by content hash so
a second add with identical text returns the existing note id
unchanged — the call is idempotent and safe to retry. New notes
are auto-linked to existing notes via embedding similarity + tag
overlap, bidirectional, A-Mem style.

Use when: you have learned something about the tenant during a
session that will be useful next time (a house view on Article 47,
a client preference, a recurring matter context); the user explicitly
asks you to remember something; a corpus citation you just made
should be linked to a tenant-specific elaboration ("we always also
do X in cases like this").

Do NOT use this to store legal/regulatory claims as if they were
canonical — semantic memory is never authoritative for legal claims;
it influences framing and retrieval, not citations. Do NOT add a
note that just restates a corpus file — link to the corpus file via
citesCorpusPaths instead. Do NOT add a note larger than ~400 words;
split it into atomic notes.

Relationships: pairs with memory.search at the start of subsequent
sessions to surface relevant tenant context. Pairs with memory.link
when you want to explicitly connect two notes the auto-linker
didn't catch. Pairs with memory.evolve when adding new information
that supersedes a previous note rather than standing alone.

Returns: the note id plus whether the note was newly created or
deduplicated, plus the list of existing notes the auto-linker
connected this one to. Surface the linkedTo list to the user only
when the connections are non-obvious; otherwise the memory layer is
ambient and quiet.
`.trim();

// ===========================================================================
// 2. memory.search
// ===========================================================================

export const searchInput = z.object({
  query: z.string().min(1),
  k: z.number().int().min(1).max(20).default(8),
  tagFilter: z.array(tag).optional(),
  traverseLinks: z.boolean().default(true).describe("Two-stage retrieval: ANN seed + graph traversal across A-Mem links."),
});

export const searchResult = z.object({
  query: z.string(),
  hits: z.array(z.object({
    noteId,
    score: z.number(),
    content: z.string(),
    context: z.string(),
    tags: z.array(tag),
    citesCorpusPaths: z.array(filePath),
    reachedVia: z.enum(["ann", "link-traversal"]),
  })),
  help: helpBlock,
});
export type SearchResultType = z.infer<typeof searchResult>;

export const searchDescription = `
Search the tenant's semantic-memory notes by natural-language
query. Two-stage retrieval: ANN over embeddings to seed top-k, then
graph traversal across A-Mem links to surface contextually adjacent
notes. The reachedVia field on each hit tells you whether the note
was retrieved directly or expanded via the link graph.

Use when: at the start of a session, to surface tenant-specific
context relevant to the user's first query; mid-session when the
user references something that may have been discussed before; when
constructing an answer and you want to check whether the tenant has
a house view that would frame it differently from the corpus default.

Do NOT use this for canonical-knowledge questions — the corpus is
the authority. Do NOT cite memory hits as legal claims; they are
framing and context, not citations. Do NOT search memory when the
user's question is brand-new to the tenant (e.g. a first-ever query
on a topic) — the embedding pool will produce noisy near-zero hits.

Relationships: pairs with corpus.findByTag and corpus.semanticSearch
at session start — memory.search surfaces tenant context, corpus
search surfaces canonical content. Pairs with memory.diff when the
user asks "what's different about how we handle this?" — memory.diff
contrasts house-view notes against corpus baselines.

Returns: ranked notes with score, content, context, tags, the
corpus paths they cite, and how they were reached (ann vs
link-traversal). Use them as ambient context to shape your answer;
do not surface them verbatim unless the user explicitly asked
"what do we know about this firm's preferences here".
`.trim();

// ===========================================================================
// 3. memory.link
// ===========================================================================

export const linkInput = z.object({
  fromNoteId: noteId,
  toNoteId: noteId,
  relation: z.enum(["supports", "supersedes", "contradicts", "related"]).default("related"),
  rationale: z.string().min(1).max(500),
});

export const linkResult = z.object({
  fromNoteId: noteId,
  toNoteId: noteId,
  relation: z.string(),
  bidirectional: z.boolean(),
  help: helpBlock,
});
export type LinkResultType = z.infer<typeof linkResult>;

export const linkDescription = `
Explicitly create a directed link between two notes, with a
rationale string and a relation type (supports, supersedes,
contradicts, related). The A-Mem auto-linker handles obvious
similarity-based links at memory.add time; memory.link is for the
non-obvious cases the auto-linker missed — typically a semantic
relationship rather than a textual one.

Use when: you've found two notes that conceptually connect even
though their content vectors don't overlap; you want to flag a
contradiction between two notes for the tenant's memory.diff
output; you want to mark one note as superseded without forgetting
it (use memory.evolve for content updates; memory.link for
relationship-only changes).

Do NOT use this to create dense webs of speculative links — the
auto-linker is calibrated and over-linking degrades search
quality. Do NOT use it as a substitute for memory.evolve when the
relationship is "this replaces that"; evolve preserves history,
link does not.

Relationships: pairs with memory.search (links inform graph
traversal). Pairs with memory.diff (contradicts-links surface in
diffs). Pairs with memory.evolve when a relationship change should
be accompanied by a content change.

Returns: the established link with relation type and whether the
relationship was made bidirectional (default true for "related",
directional for "supersedes" and "supports"). No further action
typically needed — the link is now searchable.
`.trim();

// ===========================================================================
// 4. memory.evolve
// ===========================================================================

export const evolveInput = z.object({
  noteId,
  newContent: z.string().min(1).max(4000),
  newContext: z.string().optional(),
  newTags: z.array(tag).optional(),
  rationale: z.string().min(1).max(500),
});

export const evolveResult = z.object({
  noteId,
  newVersion: z.number().int().positive(),
  previousVersion: z.number().int().nonnegative(),
  help: helpBlock,
});
export type EvolveResultType = z.infer<typeof evolveResult>;

export const evolveDescription = `
Update a note's content with version history preserved. A-Mem
semantics: the previous version is retained so memory.diff can
contrast versions and so a regression in the new content can be
reverted. Upsert-with-history, never overwrite-and-lose.

Use when: new information arrived that refines or contradicts an
existing note (a court judgment changed the tenant's house view; a
client's preference updated after a meeting); the auto-linker
flagged a near-duplicate via memory.add and you want to merge them
into one richer note rather than living with two.

Do NOT use this to delete a note (use memory.forget). Do NOT use it
for additive notes that don't supersede the original — call
memory.add and memory.link("supersedes" or "related") instead;
evolve is for content that replaces, not content that augments.

Relationships: pairs with memory.add (which sometimes returns "this
already exists" — at which point you choose evolve or link rather
than re-adding). Pairs with memory.diff to inspect what changed
between versions. Pairs with the citation-verifier sub-agent — when
a corpus update invalidates a note, evolve the note in a sweep
after the citation-verifier flags the inconsistency.

Returns: the new version number and the previous version. Surface
the change to the user only when material; otherwise the evolution
is silent and ambient.
`.trim();

// ===========================================================================
// 5. memory.forget
// ===========================================================================

export const forgetInput = z.object({
  noteId,
  rationale: z.string().min(1).max(500),
});

export const forgetResult = z.object({
  noteId,
  forgottenAt: isoDate,
  cascadedLinks: z.number().int().nonnegative(),
  help: helpBlock,
});
export type ForgetResultType = z.infer<typeof forgetResult>;

export const forgetDescription = `
Mark a note as forgotten. Soft-delete: the note remains in the
audit trail for compliance but is excluded from memory.search and
from auto-linking. Required when the tenant explicitly asks the
agent to forget something (e.g. ex-client data, a superseded
preference) or when a note turns out to have been wrong from the
outset (use memory.evolve when the note was right then but is
wrong now).

Use when: the tenant says "forget that", "remove that note", "we
don't do that any more"; a note's content turns out to have been
based on a hallucination or misattribution; tenant data-retention
policy requires aging out a note class.

Do NOT use this to "tidy up" — the auto-linker handles density.
Do NOT use it as a substitute for memory.evolve when the note has
genuine historical value (a superseded view is still useful for
diff context). Do NOT cascade forgets without explicit reason; the
cascadedLinks count tells you how much you've affected.

Relationships: pairs with memory.diff when the tenant audits what
they've recently forgotten. Pairs with the audit-log layer
(AGENT-BEHAVIOURS #6) — every forget is logged with the rationale.

Returns: the forgotten-at timestamp and the count of links broken
by the soft-delete. Confirm to the user when the forget is the
result of an explicit ask; otherwise remain quiet.
`.trim();

// ===========================================================================
// 6. memory.listByTag
// ===========================================================================

export const listByTagInput = z.object({
  tags: z.array(tag).min(1).max(5),
  mode: z.enum(["and", "or"]).default("and"),
  limit: z.number().int().min(1).max(100).default(20),
});

export const listByTagResult = z.object({
  count: z.number().int().nonnegative(),
  totalMatches: z.number().int().nonnegative(),
  notes: z.array(z.object({
    noteId,
    content: z.string(),
    tags: z.array(tag),
    citesCorpusPaths: z.array(filePath),
    updatedAt: isoDate,
  })),
  help: helpBlock,
});
export type ListByTagResultType = z.infer<typeof listByTagResult>;

export const listByTagDescription = `
List tenant memory notes by tag (intersection or union). The
deterministic sibling of memory.search — uses tag overlap rather
than embedding similarity. Faster, cheaper, and more predictable
when you know exactly which tags should match.

Use when: a corpus query (corpus.findByTag) returned hits with a
specific tag set and you want to know what the tenant has
remembered about those exact tags; you are auditing memory for a
specific topic ("show me everything we've remembered about
Article 47"); the user explicitly asked for the tenant's notes on a
named topic.

Do NOT use this when the user's question is conceptual and the
relevant memory may not carry the obvious tag — memory.search will
do better via embeddings. Do NOT use it as a substitute for
memory.diff when the question is about change over time.

Relationships: pairs with corpus.findByTag — the same tag set
queried against both corpus and memory gives you the canonical-vs-
tenant view side by side. Pairs with memory.evolve when you spot
near-duplicate notes that should be merged.

Returns: notes matching the tag set with content, tags, and the
corpus paths they cite. Use as ambient framing; surface verbatim
only when the user explicitly asked for "our notes on X".
`.trim();

// ===========================================================================
// 7. memory.diff
// ===========================================================================

export const diffInput = z.object({
  scope: z.enum(["tenant-vs-corpus", "version-history", "since-date"]).describe(
    "tenant-vs-corpus: surface tenant notes that contradict canonical corpus claims; " +
    "version-history: show the evolution of a single note; " +
    "since-date: notes added/evolved since a given date.",
  ),
  noteId: noteId.optional(),
  since: isoDate.optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export const diffResult = z.object({
  scope: z.string(),
  diffs: z.array(z.object({
    kind: z.enum(["contradiction", "evolution", "addition", "forget"]),
    noteId,
    summary: z.string(),
    detail: z.string(),
    relatedCorpusPaths: z.array(filePath).default([]),
  })),
  help: helpBlock,
});
export type DiffResultType = z.infer<typeof diffResult>;

export const diffDescription = `
Surface differences within the tenant's memory: notes that
contradict canonical corpus claims, the version history of a
single evolving note, or all notes added/evolved since a given
date. Used by tenant auditors (compliance, partner review) and by
the agent itself when answering "what's different about how we
handle this?"

Use when: the tenant asks for an audit of memory state; the agent
detects (via citation-verifier verdict) that a note may contradict
the corpus and wants to surface the conflict explicitly; a tenant
operator wants to review what the agent has remembered since the
last review meeting.

Do NOT use this as a search primitive — it returns deltas, not
content matches. memory.search and memory.listByTag are the
retrieval primitives. Do NOT use diff with no scope filter on a
large memory store — the result will be unhelpfully broad; pass a
specific scope.

Relationships: pairs with the citation-verifier sub-agent — when
the verifier finds a claim a memory note supports that the corpus
contradicts, diff scope="tenant-vs-corpus" surfaces the
contradiction structurally. Pairs with memory.evolve when the diff
output suggests a note needs updating.

Returns: a list of diff entries (contradiction, evolution,
addition, forget) with summary, detail, and any related corpus
paths. For contradiction diffs, the corpus is the authority —
surface to the user and ask whether the note should be
evolved/forgotten.
`.trim();
