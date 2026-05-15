# Conventions

Rules that every content file in this repo follows. The goal is to make the
corpus mechanically navigable by an LLM agent and easy to keep accurate.

## File layout

- **One concept per file.** A "concept" is something a user might reasonably
  ask a self-contained question about: *"what is Jersey's zero-ten regime?"*,
  *"how is a Jersey foundation different from a trust?"*. If a single file
  starts splitting into clearly separable concepts, split it.
- **Filenames** are lowercase, kebab-case, descriptive, no dates:
  `economic-substance.md`, not `2026-substance-rules.md`.
- **Section directories** each contain an `index.md` that lists the files in
  the section with a one-line description for each. This is the file an
  agent reads first when entering a section.
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
sources:
  - title: <Source title>
    url: <Primary URL>
    accessed: YYYY-MM-DD
    kind: statute | regulation | guidance | judgment | gov-page | secondary
see_also:
  - <relative path to related file>
---
```

`see_also` is the explicit cross-link list — the agent uses it for
"related concepts" expansion. Inline links in the prose are still required
where a concept is mentioned.

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

## Sources

- Inline citations point to URLs in the frontmatter `sources` list.
  Use a markdown reference-style link at the bottom of the file:
  ```markdown
  [itl]: https://www.jerseylaw.je/laws/current/l_61_1961
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

A stub is a valid file. It must still have full frontmatter and a one-line
description of what it will cover. Stubs are how we declare intent without
committing to content quality yet.
