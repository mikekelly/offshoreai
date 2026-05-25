# Conventions

Rules that every content file in this repo follows. The goal is to make the
corpus mechanically navigable by an LLM agent and easy to keep accurate.

## Agent-orientation principle

Every file should make sense to a reader **arriving cold** — an agent that
followed a search hit, jumped in via a tag, or was sent here by a
cross-link. Don't assume the reader has read the parent index, the parent
section, or anything else in the corpus.

In particular:

- **Index files set the scene.** A section's `index.md` is the front door
  for a cold agent. It must explain *what* the section is about, *what
  concepts* live in it, *when* an agent would be here, *where to start
  reading*, and *how* the section relates to its neighbours. A flat list
  of file links is not enough.
- **Concept files self-contextualise.** Every concept file opens with one
  or two sentences that situate the concept — what regime it sits in,
  why someone would care — before diving into detail. A reader landing
  on `article-47-set-aside.md` without prior context should immediately
  understand they are reading about Jersey trust law's mistake-based
  set-aside regime.
- **Links carry meaning.** A bare `[Article 9](./knowledge/jersey/trusts/firewall.md)` link tells an
  oriented reader where to find a known concept but tells a cold reader
  nothing. Prefer `[the firewall — Article 9 — which makes Jersey law
  govern validity of a Jersey trust and disapplies foreign forced-
  heirship rules](./knowledge/jersey/trusts/firewall.md)` even if it makes the prose longer.

## File layout

- **One concept per file.** A "concept" is something a user might reasonably
  ask a self-contained question about: *"what is Jersey's zero-ten regime?"*,
  *"how is a Jersey foundation different from a trust?"*. If a single file
  starts splitting into clearly separable concepts, split it.
- **Filenames** are lowercase, kebab-case, descriptive, no dates:
  `economic-substance.md`, not `2026-substance-rules.md`.
- **Section directories** each contain an `index.md` that:
  - opens with a **what / why / when / where-to-start** orientation
    section;
  - groups its files **conceptually** (not alphabetically by filename)
    so a cold agent can pick up the shape of the area;
  - gives each file a **substantive description** that tells the reader
    why they would click;
  - lists relevant **tags** an agent could follow for cross-cutting
    questions.
- **No README.md inside section directories.** READMEs are reserved for the
  jurisdiction root and the repo root — they are human-facing. Within a
  jurisdiction, `index.md` is the agent-facing entry point.

## Frontmatter

Every content file (not `index.md` listings, not READMEs) begins with YAML
frontmatter:

```yaml
---
title: <Human title>
jurisdiction: <jurisdiction-slug>            # e.g. jersey
category: <section-slug>                     # e.g. tax, companies
status: stub | draft | review | stable
last_verified: YYYY-MM-DD
tags:                                        # cross-cutting; see TAGS.md
  - <tag-1>
  - <tag-2>
articles_covered:                            # for statute-wiki files
  - "9"                                      # quoted: Articles can have letters
  - "9A"
sources:
  - title: <Source title>
    url: <Primary URL>
    accessed: YYYY-MM-DD
    kind: statute | regulation | guidance | judgment | gov-page | secondary
pinpoints:                                   # auto-generated; do not hand-author
  - article: "9"
    url: https://www.jerseylaw.je/laws/current/l_11_1984#_Toc224641894
    source: trusts-jersey-law-1984
see_also:
  - <relative path to related file>
---
```

- `tags` enables cross-cutting discovery — see [TAGS.md](./TAGS.md) for the
  canonical taxonomy. Tags are the **primary organisational layer** for an
  agent searching the graph; the folder structure is convenient for humans
  but tags are how concepts cluster.
- `see_also` is the explicit cross-link list — the agent uses it for
  "related concepts" expansion. Inline links in the prose are still required
  where a concept is mentioned.
- `articles_covered` (statute-wiki only) records the exact Articles the
  file is the canonical home for, so an agent looking for "Article X" can
  find the file definitively.
- `pinpoints` is **derived metadata**, not hand-authored — populated by the
  corpus enrichment script (`pnpm --filter @offshoreai/build cli
  enrich-pinpoints --apply`) from
  [`packages/build/data/citation-pinpoints.json`](./packages/build/data/citation-pinpoints.json).
  Each entry maps an article in `articles_covered` to a deep-link URL on
  the primary source (e.g. the consolidated statute's per-article anchor
  on jerseylaw.je), so a downstream UI can offer per-article links rather
  than linking to the whole document. Re-run on demand; the script is
  idempotent and won't touch files whose pinpoints already match. Editors
  shouldn't add or edit this block by hand.

`index.md` files use a lighter frontmatter — they need `title`,
`jurisdiction`, `category`, `status`, `last_verified`, optional `tags` and
`see_also`. Sources go inline in the index's prose.

## Prose

- Write for an LLM consumer first, a human consumer second. That means:
  short paragraphs, lots of headings, explicit names rather than pronouns,
  numbers and dates spelled out (e.g. "the standard rate is 0%", not "the
  standard rate is nil").
- **State the rule, then the source.** A typical sentence looks like:
  *"Companies resident in Jersey are taxed at a standard rate of 0% under
  Article 123C of the [Income Tax (Jersey) Law 1961][itl]."*
- **No marketing voice.** No "Jersey is a world-leading jurisdiction for..."
  This is a reference, not a brochure.
- **Flag uncertainty.** If a point is contested or unclear, say so and link
  to the competing sources.

## Cross-linking

- Link the **first** mention of any concept that has its own file in the
  current file, every time. (Re-linking later in the same file is allowed
  but not required.)
- Prefer linking to the most specific file. Only link to a section
  `index.md` if you genuinely mean "the whole section".
- Relative paths only. Anchor links target the file's stable section
  headings.
- **Link descriptions carry context.** A cold reader should know from the
  link text — or the immediately surrounding prose — what they will find
  if they click. Avoid bare references like `(see Article 51)`; prefer
  `(see the [Article 51 directions jurisdiction][a51], the Court's
  "friendly" supervisory route)`.

## Inclusion links — the third navigation axis

The corpus has three navigation axes, and links serve two of them. The
distinction is mechanical and matters for tooling:

| Axis | What it expresses | Source of truth |
|---|---|---|
| **Folders** | *Where to edit* — physical layout for editorial work | The directory tree under `knowledge/` |
| **Tags** | *What this is about* — cross-cutting topical index | Frontmatter `tags`, governed by [TAGS.md](./TAGS.md) |
| **Inclusion links** | *What context this lives inside* — structural parent → child | Markdown links *on their own line* |

**The rule.** A markdown link on its own line declares a *structural
parent → child relationship*: the file containing the link is the parent
of the linked file. A markdown link embedded inside a sentence is a
*cross-reference* — useful for backlinks and navigation, but not
structural.

**Worked example.** In [`knowledge/jersey/index.md`](./knowledge/jersey/index.md),
the "Sections" list contains entries like:

```markdown
### [Trusts](./trusts/index.md)
The [Trusts (Jersey) Law 1984](./trusts/trusts-law-1984.md): the Jersey
trust as a wealth-structuring vehicle…
```

The heading-link `[Trusts](./trusts/index.md)` is on its own line (the
heading is the line) and declares: *the Jersey index is the structural
parent of the trusts section index*. The paragraph-link
`[Trusts (Jersey) Law 1984](./trusts/trusts-law-1984.md)` is inside
prose and is a cross-reference — backlink-discoverable, but it does
*not* make the Trusts Law a child of the Jersey index.

**Polyhierarchy is allowed and expected.** The same file can be the
child of multiple parents: `firewall.md` is a child of
`trusts/index.md` (via inclusion link in the trusts section list) *and*
of `use-cases/family-office-adviser/index.md` (via inclusion link in
the family-office relevant-concepts list). No duplication of content —
just two parents in the graph.

**What inclusion links unlock mechanically.** Given the convention,
tooling (and the agent) can compute, for any file:

- **Structural parents** — files that include it via a bare-line link.
- **Structural children** — files it includes via bare-line links.
- **Siblings** — structural children of any of its structural parents.
- **Ancestors** — transitive parents up the graph.

This is the navigation surface
[`corpus.tree`](./packages/tools-corpus/src/handlers/) walks, and the
`depth` / `parentContext` parameters on `getFile` honour. See
[PRD §3 of corpus-stewardship](./PRD-corpus-stewardship-v1.md) for the
tooling design.

### Exceptions — bare-line links that are *not* structural

Three legitimate uses of "link on its own line" that are **not**
inclusion links and should not be treated as parent → child:

1. **Bibliography / sources lists.** A `## Sources` section that lists
   bare-line links to primary sources is a citation index, not a
   structural parent claim. Inclusion-link tooling ignores files whose
   path is *external* (http/https URLs) and lists under headings named
   `Sources`, `Bibliography`, `References`, `Further reading`.
2. **Table-of-contents / "See also" lists at the end of a concept
   file.** These are conventionally cross-references, not declarations
   of parenthood — the linked files are siblings or peers, not
   children. Tooling treats lists under headings matching `See also`,
   `Related`, `Cross-references`, `Cross-refs`, or `Meta` as
   cross-references, not inclusion links.
3. **Reference-style link definitions at the end of a file.**
   `[itl]: https://www.jerseylaw.je/laws/current/l_29_1961` is a
   markdown link *definition*, not an active link, and never an
   inclusion link.

When in doubt: if you would say *"this file lives inside that file's
context"* to a colleague, it's an inclusion link. If you'd say *"this
file references that file"*, it's a cross-reference.

### Index files are the primary inclusion-link source

Every `index.md` is, by construction, the parent of the files it
introduces. Concept files rarely declare structural children themselves
— they cross-reference. So in practice:

- **Section `index.md`** lists its concept files as inclusion links.
- **Persona / use-case `index.md`** lists the concept files relevant to
  that persona as inclusion links (polyhierarchy: the same concept is
  also a child of its section index).
- **Cross-jurisdictional surfaces** like
  [`CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md)
  use inclusion links to express *"this map is the parent context for
  these comparative files"*.
- **Concept files** mostly use *inline* cross-references and avoid
  bare-line links in the body, reserving them for an optional "See
  also" tail.

## Tags

- Use **only tags listed in [TAGS.md](./TAGS.md)**. Don't invent. If a
  concept needs a tag that isn't there, add the tag to TAGS.md with a
  one-line description first.
- Aim for **5–10 tags** on a substantive content file. Three tags is too
  few (the file won't surface in cross-cutting searches); fifteen is too
  many (the tags lose discriminating power).
- Include tags from **multiple categories**: subject + concept + process +
  cross-border + persona where applicable.
- Tags are **lower-kebab-case**, no spaces, no underscores. Multi-word
  concepts become single tags: `cross-border-tax`, not `cross border tax`.

## Sources

- Inline citations point to URLs in the frontmatter `sources` list.
  Use a markdown reference-style link at the bottom of the file:
  ```markdown
  [itl]: https://www.jerseylaw.je/laws/current/l_29_1961
  ```
- For Jersey legislation, prefer the consolidated version on
  [jerseylaw.je](https://www.jerseylaw.je) over PDF snapshots.
- For regulator material, link to the JFSC's current handbook page, not a
  cached PDF.
- If a source is paywalled or login-gated, mark it `kind: secondary` and
  use it only to supplement, never as the sole basis for a claim.

## Updating

- When you change a content file in a way that affects its meaning, update
  `last_verified` and append a line to the jurisdiction's `changelog.md`.
- When a regulator publishes new guidance that supersedes something here,
  update the file in place rather than creating a "v2" — the corpus is a
  graph, not a versioned archive. Old versions live in git history.

## Stubs

A stub is a valid file. It must still have full frontmatter (including
tags) and a one-line description of what it will cover. Stubs are how we
declare intent without committing to content quality yet.

## Decision-surface content type

Most corpus files are one of two shapes:

- **Concept file** — answers *"what is the rule?"* about a
  specific concept (a statute Article, a doctrine, a vehicle
  type). One concept per file.
- **Index file** — orients on a section, persona, or cohort
  and points at sibling / child files. Sets the scene.

A third content shape, **decision surfaces**, is permitted
where a file is genuinely cross-cutting and does not fit
one-concept-per-file. Examples:

- **Trigger-event maps** — files cataloguing the regulatory
  / personal / transactional events that should prompt a
  structuring conversation, with cross-links into doctrinal
  files for each event.
- **Comparator surfaces** — files comparing options on
  multiple dimensions (e.g.
  [`knowledge/CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md)
  was an early example before this convention formalised).
- **Decision trees** — files that walk a decision through
  branching points and direct the reader to the doctrinal
  conclusion.

### Rules for decision-surface files

Decision surfaces are valid but they trade a discipline that
concept files take for granted. The rules:

1. **`document type` tag must include `decision-surface`** —
   so an agent searching by document type can find them.
2. **No new substantive content** — a decision surface is a
   navigation aid; the underlying rules live in concept files
   and the decision surface cross-references them with
   meaningful link text. **A claim cited only on a decision-
   surface file is a corpus failure** — the underlying
   concept file must exist and must be the citation.
3. **`status: draft`** unless the decision surface has been
   reviewed against every concept file it references. Status
   `stable` only after a full pass.
4. **Authoritative-aspect-name in heading text** — when the
   decision surface lists options or branches, the heading
   text names the authoritative concept the branch leads to
   (so an agent can follow the heading link without
   reading the rest of the file).
5. **Limited proliferation** — a corpus with many decision
   surfaces and few concept files is a smell. Each decision
   surface should serve a recurring multi-concept question;
   one-off decision aids belong in persona files.

### Where decision surfaces live

By convention, decision surfaces sit in a dedicated
`decision-surfaces/` folder under the relevant jurisdiction,
or under `knowledge/` if cross-jurisdictional. Persona-
specific decision surfaces sit inside the persona folder.

## Tenant neutrality

The corpus is jurisdictional truth, shared across every tenant deployment.
Tenant-specific facts never enter corpus content, eval scenarios, or worked
examples. The rule (operationalising
[Principle 19 in KNOWLEDGE-BASE-PRINCIPLES.md](./KNOWLEDGE-BASE-PRINCIPLES.md)):

**Forbidden in any file under `knowledge/` or `evals/`:**

- Names of real wealth groups, law firms, fund managers, banks, trust
  companies, or other commercial entities, **except** as primary-source
  citations (e.g. citing a JFSC public statement against a named firm is
  fine; describing a named firm's operating model is not) or as the
  established public examples in jurisdiction-orientation context (e.g.
  the existing list of major TCBs in
  [`fsl-class-tcb.md`](./knowledge/jersey/financial-regulation/fsl-class-tcb.md)
  is illustrative not endorsing, and stays under editorial review).
- Identifiable client cohorts ("our typical UAE clients are…").
- Specific real deals, transactions, tickers, or deal sizes.
- House views on contested structuring choices that vary by firm.
- Internal RM playbooks, compensation structures, or proprietary
  processes.

**Permitted and encouraged:**

- Stylised or anonymised worked examples ("ParentCo plc, AIM-listed
  Jersey-incorporated, acquires TargetCo UK wealth manager via all-share
  offer").
- Role-shaped persona files (international wealth RM, listed-wealth-
  group chair, fund counsel) without identifying any actual incumbent.
- Statute, code, or guidance coverage triggered by a real-world
  development, written generically (the statute applies to *anyone* in
  the relevant position, not to the specific case that surfaced it).
- Public-record citations of named firms in their primary-source role
  (e.g. a Royal Court judgment cites the parties; a JFSC public statement
  cites the censured firm — these are legitimate references because the
  named firm *is* part of the primary source).

**Where tenant-specifics properly live.** Per-tenant memory, custom
skills, tenant-specific evals, and any house-view content sit in the
tenant configuration layer (see PRD §9), separate from the canonical
corpus.

**PR review.** A pull-request reviewer should reject any change that
introduces a forbidden element above. If unsure whether a reference
crosses the line, the default is to anonymise.
