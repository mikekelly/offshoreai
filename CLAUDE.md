# CLAUDE.md

This file is read automatically by Claude Agent SDK hosts (Claude Code, the
`claude-agent-ui` web UI, Cowork) when they open this project as the agent's
working directory. It serves **two roles**, disambiguated up front:

- **If you are answering offshore-jurisdiction questions for a user** — you
  are the **offshoreai answering agent**. Follow the *Operating discipline*
  below. This is your system prompt.
- **If you are a developer (human or LLM) working *on* this repository** —
  the cold-start reading order and contributor conventions are in the
  *Contributor cold-start guide* further down this file.

The corpus tools are exposed as the **`corpus` MCP connector**, auto-loaded
from [`.mcp.json`](./.mcp.json) — no bespoke runtime required. Any Claude
client that opens this project gets the typed corpus tools plus the
discipline below.

---

# Operating discipline — answering from the offshoreai corpus

You answer offshore-jurisdiction questions — **Jersey-anchored**, covering
Cayman, BVI, Guernsey, Bermuda, and Isle of Man comparatively where the
question demands it — strictly from the corpus under `knowledge/`.

## Tool surface

The `corpus` connector (auto-loaded; tools appear as `mcp__corpus__*`):

- `mcp__corpus__getFile` — read one corpus markdown file by path
- `mcp__corpus__getArticle` — dispatch (statute, article) → canonical file
- `mcp__corpus__findByTag` — inverted-index lookup over the closed TAGS.md taxonomy
- `mcp__corpus__freshnessCheck` — age verdict per path (fresh / warn / stale)

You also have built-in Read, Glob, Grep. Treat the corpus as **read-only**.

## Retrieval strategy

**Issue tag lookups in parallel.** When a question has multiple facets — a
comparison, a statute + regulation question, a multi-jurisdiction query —
fire all `findByTag` calls in one turn rather than sequentially.

**Comparative questions: read the synthesis surface first.** For "Jersey vs
Cayman vs BVI" style questions, read `knowledge/CROSS-JURISDICTIONAL-MAP.md`
before per-jurisdiction tag searches; do not assemble a comparison from
tag-by-tag retrieval.

**Grep before asserting silence.** `findByTag` indexes primary-subject files;
it misses facts that appear *incidentally* in a file whose core topic is
something else. Before writing "the corpus does not cover this", run
`Grep "key term" knowledge/<jurisdiction>/ --include="*.md" -rl`. A tag miss
is a vocabulary gap, not a corpus gap.

**A grep hit is a pointer, not a citation.** A bare `grep -n` shows one line;
the fact you need is often in the lines *around* it. Before citing a file you
found by grep, read its surrounding context (`Grep -n -C 3`, or open it at
that line). Citing from the one-line snippet is how you miss the adjacent
fact and under-cite a file you correctly found.

**Read the on-topic siblings on a multi-part question.** Corpus content is
one-concept-per-file, so your landing file is usually one of a cluster. For a
multi-part / worked-example / "what do I need to know about X" question, list
the cluster (`Glob knowledge/<jurisdiction>/<section>/*.md`) and read the two
or three on-topic siblings before answering. (A narrow single-fact question
needs only the one file.)

## Citation mandate — non-negotiable

Every legal, regulatory, or tax claim must cite a corpus file — the
repo-relative path (e.g. `knowledge/jersey/trusts/firewall.md`), optionally
with an Article reference. A claim with no citation is a failure mode.

When the corpus is silent, say so explicitly: "the corpus does not cover
this; here is the nearest material we do have: …" — do **not** synthesise
from training-data knowledge of offshore law.

## Freshness handling

`freshnessCheck` returns `fresh` / `warn` / `stale`:
- **fresh** — proceed normally.
- **warn** — caveat: "the file I'm citing was last verified on YYYY-MM-DD;
  re-verify against the primary source."
- **stale** — do not cite the corpus file alone as authority; flag the
  staleness and recommend verifying upstream.

## Source-hierarchy preference

When multiple sources support a claim, prefer in order: statute / regulation
(`kind: statute`) → regulator handbooks / codes (`guidance`) → government
pages (`gov-page`) → court judgments (`judgment`) → secondary sources
(`secondary`, never as sole basis; flag explicitly).

## Status handling

- `stub` files: refuse to cite; surface the gap.
- `draft` files: warn that the content is drafted but unverified.
- `review` / `stable` files: cite normally.

## Response shape

Default: one short paragraph stating the rule, a citation, and any caveats.
For multi-part questions, structure with brief headings. End with a numbered
list of all cited files, then this disclaimer:

> This is information drawn from the offshoreai corpus, not legal, tax, or
> investment advice. Verify the cited primary sources before acting.

---

# Contributor cold-start guide

Instructions for any agent or contributor — human or LLM — arriving cold to
work *on* this repository.

## What this repository is in one paragraph

A research-grade, agent-readable knowledge base for **offshore jurisdictions**. The corpus currently covers **six jurisdictions** — Jersey (the deepest), plus Guernsey, Bermuda, BVI, Cayman, and Isle of Man — with other centres to follow. All corpus content lives under `knowledge/` (which doubles as a single Obsidian vault); meta and agent docs sit at the repo top level. On top of the corpus sits a TypeScript pnpm workspace under `packages/` with the build/validation pipeline, schemas, v1 corpus tools, and an agent/eval harness. The corpus is hand-curated, source-cited, dated, and citation-mandatory for any agent built on it. The design remains in [`PRD-baseline-agent-v1.md`](./PRD-baseline-agent-v1.md) and the principles in [`AGENT-PRINCIPLES.md`](./AGENT-PRINCIPLES.md) and [`KNOWLEDGE-BASE-PRINCIPLES.md`](./KNOWLEDGE-BASE-PRINCIPLES.md).

## The corpus has four layers

A senior practitioner or agent should understand the corpus operates with **four distinct content layers**, each with its own discipline:

1. **Doctrinal corpus** — the stable, statute-anchored substance. Files live under `knowledge/<jurisdiction>/` and follow the per-jurisdiction taxonomy (trusts, funds, tax, financial-regulation, aml-cft, foundations, companies, international, use-cases, etc.). `last_verified` is the freshness contract.
2. **Cross-jurisdictional synthesis** — [`knowledge/CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md) compares the six jurisdictions on trust regime, fund regime, cell company, captive, tax / Pillar Two, substance, life assurance, image rights, etc., with decision frameworks for "where should I put X?" questions.
3. **Frontier** — bleeding-edge developments tracked with explicit `as_of` / `expected_decay` discipline. [`knowledge/frontier/`](knowledge/frontier/) holds cross-jurisdictional frontier topics (UK carry reform, AIFMD II, continuation funds); jurisdiction-specific frontier sits under `knowledge/<jurisdiction>/frontier/` (e.g., [`knowledge/jersey/frontier/`](knowledge/jersey/frontier/) for SFDR, tokenisation, industry-state).
4. **History** — stable retrospectives organised by **sector** under each jurisdiction's `history/`. Currently only Jersey has any history built out, and only the **finance sector** has the deep narrative — see [`knowledge/jersey/history/`](./knowledge/jersey/history/) for the parent sector index and [`knowledge/jersey/history/finance/`](./knowledge/jersey/history/finance/) for the deep finance-sector history (time-horizon docs for last 2 / 5 / 10 / 25 years, a "four acts" [trajectory](./knowledge/jersey/history/finance/trajectory.md) synthesis, a [`sources.md`](./knowledge/jersey/history/finance/sources.md) bibliography of 45 high-reputation third-party sources, a [`regulatory-milestones.md`](./knowledge/jersey/history/finance/regulatory-milestones.md) reference, and a [`gaps.md`](./knowledge/jersey/history/finance/gaps.md) honesty-mechanism catalogue). Non-finance sectors (real estate, retail, construction, digital, tourism, agriculture) have **not yet been built out** historically — see the *Non-finance sector history* roadmap in [`gaps.md`](./knowledge/jersey/history/finance/gaps.md). The economy-wide context lives at [`knowledge/jersey/economy/index.md`](./knowledge/jersey/economy/index.md) with the GDP partition by sector.

The corpus is **externally measured** via evals at [`evals/`](evals/) — coverage (audit-driven), showcase (landing-page-bar), and adversarial citation checks. Coverage currently records 26/26 PASS in [`evals/coverage-questions.yaml`](evals/coverage-questions.yaml). The latest committed full `offshoreai-agent` showcase baseline records 11/14 PASS, 3 PARTIAL, 0 FAIL in [`evals/baselines/2026-05-19-offshoreai-agent-full/summary.yaml`](evals/baselines/2026-05-19-offshoreai-agent-full/summary.yaml); treat the partials as the active demonstration-quality backlog.

## Cold-start reading order

Read in this order. The order is deliberate — each document assumes the ones above it but not the ones below.

### Part 1 — what the corpus is (read these in full)

1. **[`README.md`](./README.md)** — what the repo is, the LLM Wiki approach (after Karpathy), the repository layout, the file conventions in summary, the status enum, the disclaimer. ~15 min.
2. **[`KNOWLEDGE-BASE-PRINCIPLES.md`](./KNOWLEDGE-BASE-PRINCIPLES.md)** — the strategic commitments behind the corpus (one concept per file, agent-orientation, tags as the primary navigation layer for agents, `last_verified` as the freshness contract, source hierarchy, layer separation, tenant neutrality). ~15 min.
3. **[`CONVENTIONS.md`](./CONVENTIONS.md)** — the operational rules for content files (frontmatter spec, prose style, cross-linking, sources, updating, stubs, tenant neutrality). This is *how* the principles in (2) get applied. ~10 min.
4. **[`TAGS.md`](./TAGS.md)** — the canonical closed taxonomy of tags. Skim the categories; you don't need to memorise the list, just know it's authoritative and additions go via PR. The taxonomy is also transcluded at the bottom of this file (via `@TAGS.md`) so it is ambient in any Claude session that opens this project. ~5 min.
5. **[`knowledge/jersey/index.md`](./knowledge/jersey/index.md)** — a concrete example of the agent-facing front door for one jurisdiction. Read it to see how all of (1)–(4) actually land in the corpus. ~10 min.
6. **[`knowledge/jersey/economy/index.md`](./knowledge/jersey/economy/index.md)** — Jersey's economy in shape and proportion: GDP partition by sector (~40% finance / ~60% other), short summaries of real estate, public sector, retail, construction, digital, tourism, agriculture. Frames the doctrinal corpus's finance-bias as honest sector dominance, not corpus omission. ~5 min.
7. **[`knowledge/jersey/history/finance/trajectory.md`](./knowledge/jersey/history/finance/trajectory.md)** — the strategic-narrative layer for the dominant sector: the "four acts" synthesis of how Jersey's finance industry reached its current state, with five structural through-lines. Read this so you understand the historical context behind the doctrinal substance. ~10 min.
8. **[`knowledge/CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md)** — the comparison surface across the six jurisdictions. Skim the matrices so you know what cross-jurisdictional answers the corpus supports. ~5 min.
9. **[`knowledge/frontier/`](knowledge/frontier/) and [`knowledge/jersey/frontier/`](knowledge/jersey/frontier/)** — skim the file titles to understand what's currently in motion (UK carry, AIFMD II, continuation funds, SFDR, tokenisation, Jersey industry state). The frontier discipline (decay-managed `as_of` dates) is itself worth understanding. ~5 min.
10. **[`knowledge/jersey/history/finance/gaps.md`](./knowledge/jersey/history/finance/gaps.md)** — the honesty mechanism: an explicit, priority-tiered catalogue of what the graph is missing (incl. the non-finance sector history expansion roadmap). Demonstrates the corpus's epistemic discipline. ~5 min.

### Part 2 — what the agent is (read these in full)

11. **[`AGENT-PRINCIPLES.md`](./AGENT-PRINCIPLES.md)** — region-non-specific commitments for any agent built on this corpus (memory architecture, retrieval, tool surface, output discipline, build order, architectural restraint). ~20 min.
12. **[`AGENT-BEHAVIOURS.md`](./AGENT-BEHAVIOURS.md)** — the region-non-specific design doc for each customised agent behaviour the runtime adds on top of the Claude Agent SDK's default loop (bundle pre-loading, ambient session-state dashboard, freshness checking, citation verification, tool deny-list/sandbox, audit logging, progressive skill disclosure). States the *why* (failure mode addressed) and the *broadly how* (SDK mechanism level) for each. Sits between the principles in (11) and the PRD-level specifics in (13). ~20 min.
13. **[`PRD-baseline-agent-v1.md`](./PRD-baseline-agent-v1.md)** — the Jersey v1 instantiation. Required sections, in this order:
   - **§0 TL;DR** — the bet in one page
   - **§1** the 2026 memory landscape — why the design takes this shape
   - **§4** architecture (especially **§4.2** runtime choice and **§4.3** what we deliberately don't build)
   - **§5** memory architecture (five tiers + the canonical-vs-inferential separation)
   - **§6** retrieval primitives, bundles, and **§6.4** "query-time retrieval is the agent's job" (the Monigatti agentic-search position)
   - **§7** tool surface (full read — this is the load-bearing implementation contract; pay particular attention to **§7.0** principles including Principle 5 on agent-driven query-time retrieval, **§7.0.2** output discipline, **§7.0.3** description discipline, **§7.1** corpus tools)
   - **§14** milestones (build order)
   - **Appendix C** the architectural restraint principle (why no MCP wrapping of our own logic, why no custom CLIs over our own functions — the unified rule)

   Estimated total: ~60 min for these sections; the full PRD is longer but the rest is reference.

### Part 3 — when you're about to implement

Once Parts 1 and 2 are absorbed, read the remaining PRD sections as reference:
- **§10** build & compile pipeline
- **§11** evals & KPIs
- **§12** tech stack
- **§13** v1 scope
- **§15** risks & mitigations
- **§16** open questions (six items still unresolved — at least the hosting topology and editorial throughput are implementation blockers; raise these before week 1)

## Different contributor types — what to prioritise

If you're not an implementation engineer, you can stop earlier in the reading order.

| You are… | Stop after | What to add |
|---|---|---|
| **Implementation engineer (TS, agent build-out)** | Part 3 in full | Plus a per-tool spec pass through `PRD §7.1–7.5`, and [`packages/web/README.md`](./packages/web/README.md) for the streaming web UI's architecture and security model |
| **Content writer (editorial, jurisdiction expansion)** | Part 1 items 1-5 in full + skim `KNOWLEDGE-BASE-PRINCIPLES.md` whenever a structural question arises | Plus the relevant `knowledge/<jurisdiction>/changelog.md` for context on recent work; for Jersey, also read [`knowledge/jersey/COVERAGE-AUDIT.md`](./knowledge/jersey/COVERAGE-AUDIT.md) and [`knowledge/jersey/history/finance/gaps.md`](./knowledge/jersey/history/finance/gaps.md) before adding new content |
| **Tenant onboarding / white-label deployment** | Part 1 (skim) + `PRD §9` (tenant model) + `AGENT-PRINCIPLES.md` (the restraint principles) | Plus the future `SETUP.md` when written |
| **Code reviewer / second opinion** | `AGENT-PRINCIPLES.md` + `PRD Appendix C` + the PR's diff | The principles tell you what's load-bearing and what's negotiable |
| **Strategic / external reader / demo audience** | `README.md` + Part 1 items 6-10 (economy / strategic-narrative / cross-jurisdictional / frontier / gaps) + `PRD §0` | For demo prep: [`DEMO-CHEAT-SHEET-KPMG-PE-PARTNER.md`](./DEMO-CHEAT-SHEET-KPMG-PE-PARTNER.md) is a calibrated walk-through |
| **Frontier maintainer (refreshing decay-managed content)** | Part 1 items 7-10 + read each frontier file's `as_of` and `expected_decay` frontmatter | Plus [`knowledge/jersey/history/finance/sources.md`](./knowledge/jersey/history/finance/sources.md) bibliography to know which sources to refresh against |

## Repository conventions for agents working on this repo

- **Don't edit content files casually.** Corpus files have `last_verified` dates that represent real editorial checks against primary sources. If you change a content file's meaning, bump `last_verified` and append to the jurisdiction's `changelog.md` (e.g. `knowledge/jersey/changelog.md`). If you can't actually verify against the primary source, mark the change `draft` not `stable`.
- **Don't invent tags.** [`TAGS.md`](./TAGS.md) is closed. If you need a tag that isn't there, add it to `TAGS.md` with a one-line description in the same commit as the file that uses it.
- **Understand the three navigation axes.** The corpus is navigable along three orthogonal axes: **folders** (where to edit — physical layout), **tags** (what files are about — cross-cutting topical index per [TAGS.md](./TAGS.md)), and **inclusion links** (what context a file lives inside — structural parent → child relationships expressed by markdown links on their own line). The inclusion-link convention is the youngest of the three; see the [*Inclusion links*](./CONVENTIONS.md#inclusion-links--the-third-navigation-axis) section of `CONVENTIONS.md` for the rule, the exceptions (bibliographies, "See also" lists, link definitions), and how it underwrites the `corpus.tree` traversal and the `depth` / `parentContext` parameters on `corpus.getFile`. When writing new files: prefer inline cross-references in concept-file bodies; reserve bare-line links for `index.md` files and "See also" tails.
- **Tenant neutrality is a hard rule.** No corpus file, eval, or worked example names a real tenant, client, vendor, deal, or proprietary playbook — see the *Tenant neutrality* section of [`CONVENTIONS.md`](./CONVENTIONS.md) and Principle 19 of [`KNOWLEDGE-BASE-PRINCIPLES.md`](./KNOWLEDGE-BASE-PRINCIPLES.md). Tenant-specific content lives in the per-tenant memory layer, never in the canonical corpus.
- **Don't add invocation surfaces over code we own.** This is the architectural restraint principle (Appendix C of the PRD). Wrapping our own functions in MCP servers or custom CLIs for the agent to invoke through Bash is forbidden — both are indirection over code we own and an agent we control. SDK custom tools are the default. MCP only at real cross-process/cross-language/cross-org boundaries.
- **Commits.** Short imperative titles, optional clarifying context after an em-dash. Examples in `git log`. Co-Author lines for AI assistants are conventional.
- **Branching.** `main` is the working branch. Branch for substantial work, otherwise commit directly.

## What's deliberately not in this document

These are real gaps and they'll be filled in dedicated docs as they become urgent:

- **Setup / first-run instructions** — there's no implementation code yet, so no setup to document. When week 1 of `PRD §14` begins, write `SETUP.md`.
- **Per-tool implementation specs** — `PRD §7.1` names tools with one-line behaviours. Concrete Zod schemas, example TOON outputs, error cases need a `schemas/` directory or per-tool spec file once implementation starts.
- **Sub-agent prompt templates** — `PRD §8` names three sub-agents (`citation-verifier`, `bundle-assembler`, `freshness-checker`) but their actual prompts aren't drafted. Create `prompts/sub-agents/` when week 5–6 of `PRD §14` begins.
- **Skill body templates** — `PRD §5.2` describes the persona-skill pattern. One reference `SKILL.md` per category (baseline, task) will unblock the trust-officer skill batch in `PRD §14` week 7.
- **Tenant onboarding runbook** — `PRD §9` is the static layout; the provisioning script and first-tenant flow live in a future `TENANT-ONBOARDING.md`.

Each of these is flagged in the relevant PRD section. If you arrive needing one and it doesn't exist yet, that's the signal to write it before going further.

**Deferred-but-discussed ideas** that aren't on the build plan yet live in [`BACKLOG.md`](./BACKLOG.md). Each entry needs design exploration + approval before pickup — it's not a roadmap, just the holding area for proposals we've thought about enough to write down.

## A note on the PRD's status

The PRD has been through several rounds of structural pushback (no MCP wrapping of own logic; no Zod runtime validation on outputs; no custom CLIs over own functions; switch from Python to TypeScript as primary). It reflects those revisions. If you find an inconsistency where one section assumes Python or describes a custom CLI surface, it's a missed sweep — flag it. Appendix C is the single best summary of the architectural restraint principles that emerged from those revisions.

## A note on multi-host agent conventions

This file used to delegate the cold-start guide to a separate `AGENTS.md` (read by Cursor, Codex, Aider, and other non-Claude agents per the AGENTS.md convention). For now the content lives inline here. If multi-host coverage becomes load-bearing again, recreate `AGENTS.md` as a thin pointer to this file or as a sibling with synchronised content.

---

# Orientation context (transcluded)

The corpus orientation surfaces and the canonical tag taxonomy are
@-referenced below so Claude sessions arrive with jurisdiction,
cross-jurisdictional, strategic-narrative, and tag-taxonomy context already
loaded. (`@`-transclusion support varies across SDK hosts — the
load-bearing operating discipline and the contributor cold-start guide
above are therefore stated inline, not delegated to a transclusion.)

@TAGS.md

@knowledge/jersey/index.md
@knowledge/CROSS-JURISDICTIONAL-MAP.md
@knowledge/jersey/history/finance/trajectory.md
