# EVAL-DRIVEN-PLAN.md

How the eval suite drives implementation. Sits next to
[`IMPLEMENTATION-PLAN.md`](IMPLEMENTATION-PLAN.md) and overrides its
"feature exists" acceptance criteria with **score-delta** acceptance
criteria.

The premise: scores have to move. A week's milestone "ships" only when
the showcase / coverage eval improves against the previous baseline by
at least the expected delta. If a milestone lands and the score is
flat, we built something that didn't earn its keep, and the right
response is to pause the build and ask why — not to advance to the
next week.

---

## What's already in place (week 0 starting state)

- **`evals/coverage-questions.yaml`** — 17 questions across personas. v3-postfill: 14 PASS / 3 FAIL. Coverage bar: "can the corpus answer this?".
- **`evals/showcase.yaml`** — 14 landing-page-bar questions. 13 PASS / 1 PARTIAL. Showcase bar: substance + Jersey-specificity + voice + citation density + tightness.
- **Runner methodology** — fresh `Explore` subagents per question, read-only sandbox on `knowledge/jersey/`. Documented in `evals/README.md`.
- **Grader** — currently the orchestrator agent doing *introspective* grading. The `evals/README.md` itself flags this as circular.
- **Trajectory** — not captured. We see pass/fail but not tool-call sequence, turn count, or token budget per question.

These shape the work below.

---

## The four phases

### Phase 0 — eval-framework hardening (week 0 — concurrent with bootstrap)

The introspective grader and missing trajectory mean any score delta we measure today is noisy. Two changes lift this:

1. **LLM-as-judge grader sub-agent.** Opus 4.7, isolated context, tool subset `corpus.getFile` + `Read` + `Grep`. Same architecture as the production `citation-verifier` (PRD §8) — dual-use, not throwaway. Reads the question, the expected_facts/expected_files rubric, and the candidate answer (with trajectory). Returns a structured verdict per scoring dimension.

2. **Trajectory capture.** Every harness run records: tools called in order, parameters, result-size, total tokens, wall-clock. Captured as JSON sidecars per question per run. Without this we cannot compute the PRD §11.2 KPIs (tool-call count median, agent-driven retrieval rate, etc.) and we cannot tell *why* a score moved.

**Deliverables (Phase 0):**
- `prompts/eval/grader.md` — grader sub-agent prompt.
- `prompts/eval/runner.md` — orchestrator prompt for dispatching questions to harnesses.
- `schemas/eval-trajectory.ts` — Zod schema for trajectory records.
- `evals/harnesses/README.md` — adapter spec (how `explore-subagent`, `claude-p`, and future `offshoreai-agent` are invoked uniformly).
- `evals/conformance-baseline.yaml` — captured violations from the convention validator run, so the editorial backlog has a starting point.

### Phase 1 — baseline (week 0–1 transition)

Once Phase 0 lands, re-run the existing eval suites under the hardened grader. Establish two preliminary controls:

- **`explore-subagent`** — the current runner (Claude Code Agent tool, Read/Glob/Grep/Bash, sandboxed to `knowledge/jersey/`). The legacy baseline.
- **`claude-p`** — `claude -p` invoked via Bash, same prompt, same corpus. The "vanilla harness, no typed tools" baseline.

These two baselines bracket "what the corpus alone produces with general-purpose retrieval." Anything we build on top has to beat them — and the delta is the marginal value of our customisations.

**Deliverable (Phase 1):**
- `evals/baselines/<date>-{explore-subagent,claude-p}/` — score + trajectories per harness per question.

### Phase 2 — score-driven implementation (weeks 1–12)

Each week's milestone in `IMPLEMENTATION-PLAN.md` is rewritten to a score-delta acceptance criterion against the baselines. The pattern:

> Week N's deliverable ships when the showcase eval improves by ≥ Δ% on dimension X against the better of the two baselines, with the regression watchlist (Y, Z) within tolerance.

Concretely the per-week targets are:

| Week | Deliverable | Primary score target | Why this delta |
|---|---|---|---|
| 1 | Convention validator | corpus-conformance violations from N to 0 (build-pipeline fail mode), no eval score impact yet | weeks 1–2 don't move the agent score — they set up the substrate |
| 2 | hier-tree + tag-index compile | no eval score impact yet | infrastructure for week 3 |
| 3 | `@offshoreai/tools-corpus` | **citation precision ≥ +20 pp** over `claude-p` baseline; tool-call count per question reduces by ≥ 30% | typed `corpus.getFile`/`getArticle`/`findByTag` directly improve precision and reduce exploratory rediscovery |
| 4 | `@offshoreai/tools-memory` | no measurable showcase impact (memory is per-tenant; showcase is canonical-only) — but track memory-in-action eval Track 3 separately starting week 10 | memory shapes per-tenant framing, not canonical-question scores |
| 5 | freshness-checker sub-agent | **stale-flag detection ≥ 90%** on synthetic stale-corpus harness; **zero stale-corpus citations in showcase** | the §11.2 freshness-handling KPI lands here |
| 6 | citation-verifier sub-agent | **hallucinated-citation rate → 0** on adversarial set; **first-pass reject rate ≤ 15%** on showcase | PRD §11.2 citation-verifier KPI |
| 7 | bundle-assembler + 5 seed bundles | **tool-call count median ≤ 3** for bundle-covered questions (vs ≥ 6 on the baselines); **bundle-routing accuracy ≥ 95%** | bundles are the §11.2 efficiency KPI |
| 8 | shadow pilot opens | first real-world Track 1 eval run on pilot tenants | external validation |
| 9 | Track 2 gold-set + first log-driven batch | **Track 2 legal correctness ≥ 90%**; new bundles improve the targeted (persona × task) cells by measurable margin | the PRD §11.1 Track 2 target lands |
| 10 | Track 3 memory-in-action | conflict-surfacing rate ≥ 95% on adversarial note/corpus scenarios | the memory-firewall KPI |
| 11 | hardening | all §11.2 KPIs report cleanly; no week-11 regression vs week-10 baseline | the lockdown week |
| 12 | first paying-customer pilot | live tenant queries flow through the full stack with logged trajectories | the launch |

This replaces "feature exists" with "feature moved the number". The
table above is now copy-pasted into IMPLEMENTATION-PLAN.md as the
acceptance column.

### Phase 3 — sticky `claude-p` control

`claude-p` stays in the comparison set permanently. After our harness
wins on a given KPI we don't drop the baseline; we keep re-running it
weekly. The day our harness *doesn't* beat `claude-p` by a meaningful
margin on a newly-added feature is the day to ask whether that feature
earns its keep.

This is the architectural-restraint principle (AGENT-PRINCIPLES #21)
made operational. It directly answers the bias the cold-start brief
warned about — every time the agent proposes a new hook, sub-agent, or
auto-injection layer, the next eval run will tell us whether it
deserved to ship.

---

## Concrete scoring dimensions (carried in trajectories)

The grader emits a structured verdict per question. The dimensions are
drawn from `evals/showcase.yaml`'s `showcase_bar` shape:

| Dimension | Definition | Source |
|---|---|---|
| `substance` | Facts correct; no errors. | from `expected_facts` |
| `jersey_specific` | Cites Jersey statutes/cases; not generic offshore prose. | from `jersey_specific` rubric on each question |
| `voice` | Operationally useful, "smart-friend" tone where appropriate. | from `voice` field |
| `citation_precision` | % of cited paths that actually support the claim attached to them. | computed; the grader re-reads each cited file |
| `citation_recall` | Most-authoritative-available source used? Statute > regulator > gov-page > judgment > secondary. | computed; cross-checked against `frontmatter.sources[].kind` |
| `freshness_handling` | Stale files flagged? `last_verified` surfaced to the user where material? | computed from trajectory + answer |
| `tool_calls` | Count, sequence, redundancy. | trajectory |
| `tokens` | Total input + output tokens. | trajectory |
| `wall_clock` | End-to-end latency. | trajectory |
| `verdict` | `pass` / `partial` / `fail` overall. | grader-decided |

For the showcase eval specifically, the existing five-dimension scoring
(substance, jersey-specific, voice, citation, tightness) maps onto
this — we don't break the existing fixtures; we extend the grader to
produce both legacy verdicts and the trajectory-augmented dimensions.

---

## What's load-bearing about doing this *first*

- **Cheap pivot.** A bad week-3 metric is faster to learn from than a bad month of building.
- **Restraint signal.** Architectural-restraint principles are easy to violate when you can't measure. Once you can, the next "let's add a hook for X" gets a yes-or-no from the score, not from intuition.
- **Editorial signal.** Trajectories surface which corpus paths the agent reaches for and where they were stale/stub/missing. That's the editorial backlog input from week-1, not week-9.
- **Dual-use.** The grader sub-agent and the trajectory format are *production* artefacts (citation-verifier is the same shape as the grader; trajectory ≡ §11.3 tool-event log). Building them for evals is building them for v1.

---

## What this document does *not* cover

- The PRD itself — `EVAL-DRIVEN-PLAN.md` does not modify PRD design sections.
- The corpus content — eval-driven dev surfaces editorial gaps as signals; the editorial team still owns the writing.
- Tenant onboarding — tenant-side acceptance criteria appear in week 12 only.

---

## Status

- 2026-05-18 — Phase 0 work in progress; this document drafted.
