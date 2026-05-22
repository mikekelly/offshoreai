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
