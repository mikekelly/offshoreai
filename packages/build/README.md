# @offshoreai/build

The **corpus build, validation, and compile pipeline**. Deterministic,
non-networked, no API key required: it walks the markdown corpus under
`knowledge/`, validates it against the conventions, compiles the agent's
navigation artefacts (the hier-tree and the tag-index), enriches frontmatter
with pinpoint deep-links, and runs a housekeeping health gate. It is the source
of truth for "is the corpus well-formed?" and produces the indexes the runtime
loads.

Design: [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) §10 (build
& compile pipeline). The file conventions it enforces are
[`CONVENTIONS.md`](../../CONVENTIONS.md) and the closed tag taxonomy
[`TAGS.md`](../../TAGS.md).

```
pnpm build:corpus all              # validate (no-fail) + tree + tags  (root alias → this package's cli)
pnpm build:corpus validate         # convention validator; exits non-zero on violation (CI default)
pnpm build:corpus enrich-pinpoints --dry-run    # show pinpoint deep-link additions; --apply to write
pnpm build:corpus audit-tags       # tags used in the corpus but absent from TAGS.md
pnpm health                        # deterministic regression gate (root alias → this package's health cli)
pnpm --filter @offshoreai/build test            # vitest
```

> The root `package.json` aliases `build:corpus` → `pnpm --filter
> @offshoreai/build run cli` and `health` → `… run health`. Use the root
> aliases day to day.

---

## Engineer/CI surface, not an agent surface

Per [AGENT-PRINCIPLES](../../AGENT-PRINCIPLES.md) Principle 21 and the
architectural restraint principle
([PRD Appendix C](../../PRD-baseline-agent-v1.md#appendix-c--the-architectural-restraint-principle-the-indirection-question)),
this CLI is for **engineers and CI only** — agents never invoke it. The agent
reads the corpus through the typed in-process tools in
[`@offshoreai/tools-corpus`](../tools-corpus/README.md); those tools *import*
this package's loader + compiled indexes, but the CLI itself is not on the
agent's tool surface.

---

## Layout

```
packages/build/
├── README.md             ← this file
├── package.json          ← bin: offshoreai-build; scripts: cli, health, test, typecheck
├── data/
│   └── citation-pinpoints.json   ← statute → article-anchor registry (input to enrich-pinpoints)
├── dist/                 ← compiled artefacts (hier-tree.json, tag-index.json, unknown-tags.tsv)
└── src/
    ├── index.ts             ← programmatic API barrel (loader accessors, compile fns, types)
    ├── cli.ts               ← engineer/CI CLI — dispatches verbs to the functions below
    ├── validate/            ← convention validator (frontmatter, tags, links)
    ├── compile/             ← loader + hier-tree + tag-index compilers
    ├── enrich/              ← pinpoint deep-link enrichment
    ├── audit/               ← corpus-wide tag-taxonomy audit
    └── health/              ← deterministic housekeeping / regression gate
```

The programmatic API (`src/index.ts`) is what other packages depend on — most
importantly `loadCorpus` and the `CorpusRecord` accessors (`getTags`,
`getTitle`, `getStatus`, `getLastVerified`, `getArticlesCovered`, `getPersona`,
`getCategory`), which `@offshoreai/tools-corpus` and `@offshoreai/agent` both
import rather than re-parsing frontmatter.

---

## What each stage does

### `validate/` — the convention validator

Walks `knowledge/jersey/**/*.md` (the jurisdiction where the TAGS.md taxonomy is
grounded; adjacent jurisdictions are compiled but not strictly validated against
TAGS.md — an editorial decision pending), parses frontmatter with `gray-matter`,
applies a Zod schema, checks the tag whitelist + the 5–10 tag-count range, and
checks relative-link / "See also" integrity. It returns a `ValidationResult`
with every violation classified by `ViolationKind`: `missing_frontmatter`,
`invalid_frontmatter_shape`, `missing_required_field`, `invalid_status_enum`,
`invalid_date_shape`, `invalid_tag_format`, `unknown_tag`, `too_few_tags`,
`too_many_tags`, `broken_relative_link`, `broken_see_also`,
`invalid_source_kind`, `invalid_jurisdiction_slug`.

`validate --baseline` writes the snapshot to
[`evals/conformance-baseline.yaml`](../../evals/conformance-baseline.yaml) — the
editorial team's backlog target. Re-generate it after each editorial PR batch to
track the trend.

### `compile/` — the navigation artefacts

- `hier-tree.ts` → `dist/hier-tree.json` — the folder/inclusion hierarchy
  (nodes, sections, concept files, index files, roots).
- `tag-index.ts` → `dist/tag-index.json` — the inverted tag index + a
  co-occurrence matrix. This is the artefact the agent runtime turns into the
  system-prompt tag-taxonomy block (see `@offshoreai/agent`'s
  `taxonomy-block.ts`) and that `@offshoreai/tools-corpus`'s `findByTag` reads.
- `loader.ts` — `loadCorpus` + the `CorpusRecord` accessors, the shared
  frontmatter read path for the whole workspace.

### `enrich/` — pinpoint deep-links

`enrich-pinpoints` adds a `pinpoints` frontmatter field to each corpus file that
cites a statute we have an anchor map for, mapping every `articles_covered`
entry to a deep-link URL (statute base + `#anchor`). The anchor registry lives
at `data/citation-pinpoints.json`. The computation is pure; the CLI wraps it
with I/O and a mandatory `--dry-run` / `--apply` flag, and re-running is
idempotent. These `pinpoints` are what the web UI's `citation` event surfaces
as per-article deep-links (see `@offshoreai/agent`'s `web-agent.ts`).

### `audit/` — corpus-wide tag audit

`audit-tags` (alias `tags --audit`) lists tags used anywhere in the corpus but
absent from `TAGS.md`, writing the full list to `dist/unknown-tags.tsv`. Unlike
the strict validator (Jersey-only), this is corpus-wide — amending `TAGS.md` is
a corpus-wide task. `--fail` makes it a CI gate once the taxonomy is reconciled.

### `health/` — the deterministic regression gate

`pnpm health` is a deliberately non-LLM, non-networked report over contracts
that should be interrogated regularly: corpus conformance vs the committed
baseline, tag-taxonomy drift, the latest showcase eval summary's totals, and
local `.claude/worktrees` hygiene. It emits `pass` / `warn` / `fail` per check
(`--json` for machine output, `--no-fail` to never exit non-zero).

---

## Two gotchas worth internalising

These are documented in [`SETUP.md`](../../SETUP.md#first-run-commands) — the
short version:

1. **`build:corpus all` reports the conformance backlog; it does not hard-fail
   on it.** The `all` verb runs `validate --no-fail` then `tree` then `tags`, so
   the known editorial backlog is surfaced, not treated as a blocker. (The bare
   `validate` verb *does* exit non-zero on any violation — that's the CI default.)

2. **`health` fails only on deterministic *regressions*.** Corpus conformance
   is a `fail` **only when the violation count exceeds the committed baseline**
   in `evals/conformance-baseline.yaml`; an existing-backlog count is a `warn`,
   not a `fail`. Tag-taxonomy drift and a non-clean latest-showcase summary are
   `warn`s. So `health` going red means *you regressed past baseline*, which is
   the signal you actually want gated.

See `SETUP.md` for the full first-run command set, prerequisites, and the
optional `iwe` graph tooling that operates on the same corpus.

## See also

- [`SETUP.md`](../../SETUP.md) — prerequisites, first-run commands, the gotchas
  above in context.
- [`CONVENTIONS.md`](../../CONVENTIONS.md) — the frontmatter / link / tag rules
  the validator enforces.
- [`TAGS.md`](../../TAGS.md) — the closed tag taxonomy the validator and audit
  check against.
- [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) §10.
- [`packages/tools-corpus/README.md`](../tools-corpus/README.md) — the agent's
  read surface, which consumes this package's loader + compiled indexes.
