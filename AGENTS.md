# AGENTS.md

Instructions for any agent or contributor — human or LLM — arriving cold at this repository.

This file is the single source of truth for the cold-start reading order. [CLAUDE.md](CLAUDE.md) @-references this file so Claude Code sessions inherit it automatically; other agents (Cursor, Codex, Aider, etc.) read this file directly per the AGENTS.md convention.

---

## What this repository is in one paragraph

A research-grade, agent-readable knowledge base for **offshore jurisdictions** — currently Jersey, with other Crown Dependencies, Caribbean and Mediterranean centres to follow. The corpus (markdown files under `<jurisdiction>/`) is the knowledge layer; on top of it sits a planned baseline agent (Claude Agent SDK, TypeScript) plus per-customer white-label agents. The corpus is hand-curated, source-cited, dated, and citation-mandatory for any agent built on it. There is **no implementation code in this repo yet** — the design is in [`PRD-baseline-agent-v1.md`](PRD-baseline-agent-v1.md) and the principles in [`AGENT-PRINCIPLES.md`](AGENT-PRINCIPLES.md) and [`KNOWLEDGE-BASE-PRINCIPLES.md`](KNOWLEDGE-BASE-PRINCIPLES.md).

---

## Cold-start reading order

Read in this order. The order is deliberate — each document assumes the ones above it but not the ones below.

### Part 1 — what the corpus is (read these in full)

1. **[`README.md`](README.md)** — what the repo is, the LLM Wiki approach (after Karpathy), the repository layout, the file conventions in summary, the status enum, the disclaimer. ~15 min.
2. **[`KNOWLEDGE-BASE-PRINCIPLES.md`](KNOWLEDGE-BASE-PRINCIPLES.md)** — the strategic commitments behind the corpus (one concept per file, agent-orientation, tags as the primary navigation layer for agents, `last_verified` as the freshness contract, source hierarchy, layer separation). ~15 min.
3. **[`CONVENTIONS.md`](CONVENTIONS.md)** — the operational rules for content files (frontmatter spec, prose style, cross-linking, sources, updating, stubs). This is *how* the principles in (2) get applied. ~10 min.
4. **[`TAGS.md`](TAGS.md)** — the canonical closed taxonomy of tags. Skim the categories; you don't need to memorise the list, just know it's authoritative and additions go via PR. ~5 min.
5. **[`knowledge/jersey/index.md`](knowledge/jersey/index.md)** — a concrete example of the agent-facing front door for one jurisdiction. Read it to see how all of (1)–(4) actually land in the corpus. ~10 min.

### Part 2 — what the agent is (read these in full)

6. **[`AGENT-PRINCIPLES.md`](AGENT-PRINCIPLES.md)** — region-non-specific commitments for any agent built on this corpus (memory architecture, retrieval, tool surface, output discipline, build order, architectural restraint). ~20 min.
7. **[`AGENT-BEHAVIOURS.md`](AGENT-BEHAVIOURS.md)** — the region-non-specific design doc for each customised agent behaviour the runtime adds on top of the Claude Agent SDK's default loop (bundle pre-loading, ambient session-state dashboard, freshness checking, citation verification, tool deny-list/sandbox, audit logging, progressive skill disclosure). States the *why* (failure mode addressed) and the *broadly how* (SDK mechanism level) for each. Sits between the principles in (6) and the PRD-level specifics in (8). ~20 min.
8. **[`PRD-baseline-agent-v1.md`](PRD-baseline-agent-v1.md)** — the Jersey v1 instantiation. Required sections, in this order:
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

---

## Different contributor types — what to prioritise

If you're not an implementation engineer, you can stop earlier in the reading order.

| You are… | Stop after | What to add |
|---|---|---|
| **Implementation engineer (TS, agent build-out)** | Part 3 in full | Plus a per-tool spec pass through `PRD §7.1–7.5` |
| **Content writer (editorial, jurisdiction expansion)** | Part 1 in full + skim `KNOWLEDGE-BASE-PRINCIPLES.md` whenever a structural question arises | Plus the relevant `<jurisdiction>/changelog.md` for context on recent work |
| **Tenant onboarding / white-label deployment** | Part 1 (skim) + `PRD §9` (tenant model) + `AGENT-PRINCIPLES.md` (the restraint principles) | Plus the future `SETUP.md` when written |
| **Code reviewer / second opinion** | `AGENT-PRINCIPLES.md` + `PRD Appendix C` + the PR's diff | The principles tell you what's load-bearing and what's negotiable |
| **Strategic / external reader** | `README.md` + the TL;DRs of both principles docs + `PRD §0` | That's the full pitch in under 30 min |

---

## Repository conventions for agents working on this repo

- **Don't edit content files casually.** Corpus files have `last_verified` dates that represent real editorial checks against primary sources. If you change a content file's meaning, bump `last_verified` and append to the jurisdiction's `changelog.md`. If you can't actually verify against the primary source, mark the change `draft` not `stable`.
- **Don't invent tags.** [`TAGS.md`](TAGS.md) is closed. If you need a tag that isn't there, add it to `TAGS.md` with a one-line description in the same commit as the file that uses it.
- **Don't add invocation surfaces over code we own.** This is the architectural restraint principle (Appendix C of the PRD). Wrapping our own functions in MCP servers or custom CLIs for the agent to invoke through Bash is forbidden — both are indirection over code we own and an agent we control. SDK custom tools are the default. MCP only at real cross-process/cross-language/cross-org boundaries.
- **Commits.** Short imperative titles, optional clarifying context after an em-dash. Examples in `git log`. Co-Author lines for AI assistants are conventional.
- **Branching.** `main` is the working branch. Branch for substantial work, otherwise commit directly.

---

## What's deliberately not in this document

These are real gaps and they'll be filled in dedicated docs as they become urgent:

- **Setup / first-run instructions** — there's no implementation code yet, so no setup to document. When week 1 of `PRD §14` begins, write `SETUP.md`.
- **Per-tool implementation specs** — `PRD §7.1` names tools with one-line behaviours. Concrete Zod schemas, example TOON outputs, error cases need a `schemas/` directory or per-tool spec file once implementation starts.
- **Sub-agent prompt templates** — `PRD §8` names three sub-agents (`citation-verifier`, `bundle-assembler`, `freshness-checker`) but their actual prompts aren't drafted. Create `prompts/sub-agents/` when week 5–6 of `PRD §14` begins.
- **Skill body templates** — `PRD §5.2` describes the persona-skill pattern. One reference `SKILL.md` per category (baseline, task) will unblock the trust-officer skill batch in `PRD §14` week 7.
- **Tenant onboarding runbook** — `PRD §9` is the static layout; the provisioning script and first-tenant flow live in a future `TENANT-ONBOARDING.md`.

Each of these is flagged in the relevant PRD section. If you arrive needing one and it doesn't exist yet, that's the signal to write it before going further.

---

## A note on the PRD's status

The PRD has been through several rounds of structural pushback (no MCP wrapping of own logic; no Zod runtime validation on outputs; no custom CLIs over own functions; switch from Python to TypeScript as primary). It reflects those revisions. If you find an inconsistency where one section assumes Python or describes a custom CLI surface, it's a missed sweep — flag it. Appendix C is the single best summary of the architectural restraint principles that emerged from those revisions.
