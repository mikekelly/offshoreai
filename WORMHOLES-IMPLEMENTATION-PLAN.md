# WORMHOLES-IMPLEMENTATION-PLAN.md

Phased build order for the wormhole mechanism. The design is in
[`bundles/DESIGN.md`](./bundles/DESIGN.md); the strategic frame is in the
design-frame section of [`AGENT-BEHAVIOURS.md`](./AGENT-BEHAVIOURS.md).

The plan is **eval-gated, restraint-first**: the cheap, deterministic,
reversible work comes first, and the genuinely-new automated machinery is
**gated on a single hypothesis test** (Phase B) proving that a wormhole
actually beats agentic retrieval *and* the `claude-p` control. If Phase B
fails, most of the later phases should not be built.

Recurring discipline (carried from `EVAL-DRIVEN-PLAN.md`): keep `claude-p`
the sticky control; prefer partial eval runs (1–3 questions) over full
28-q runs to conserve inference; the eval has ~1-in-7 run-to-run verdict
variance, so treat single-question deltas as weak signal and confirm real
moves with a repeat or a small-N median.

---

## Phase legend

| Marker | Meaning |
|---|---|
| **DET** | Deterministic — verified by unit tests / the validator, **no LLM inference** |
| **INF** | Needs inference — verified by eval runs (use partial runs) |
| **INFRA** | Blocked on infrastructure not yet built (persistence / audit log / tenant forks) |
| **POSTURE** | Changes the agent's capability posture (read-only → scoped write) — review before shipping |

---

## Phase A — Derived-node conventions + validator  **[DET]**

*Goal: the corpus can hold a wormhole node, and the validator enforces the
derived-node rules. Pure build-pipeline work; no agent change, no inference.*

**Deliverables**
- `packages/build/src/validate/frontmatter.ts`: extend `frontmatterSchema`
  with optional `derived: boolean` and `derived_from: Array<{ path,
  content_hash?, last_verified? }>`.
- `packages/build/src/validate/run.ts`: add checks —
  1. `derived: true` ⇒ `derived_from` present and non-empty
     (`derived_missing_sources`);
  2. every `derived_from.path` exists (`derived_source_missing`);
  3. every `derived_from.path` resolves to a *primary* node — i.e. its own
     frontmatter does **not** have `derived: true`
     (`derived_second_order` — the no-second-order rule);
  4. a `derived` node with `status: stable` must be flagged unless a
     verifier-pass marker is present (`derived_unverified_stable` — for
     now a warning; the promotion path in Phase D will set the marker).
- `packages/build/src/validate/types.ts`: add the new `ViolationKind`s.
- `packages/build/test/run.test.ts`: fixtures + tests for each rule
  (valid wormhole passes; missing `derived_from` fails; second-order
  fails; dangling source fails).

**Acceptance (DET)**
- `pnpm --filter @offshoreai/build test` green, new tests included.
- `pnpm health` / validator run on the real corpus shows **no new
  violations** (no real file sets `derived` yet, so the new rules are
  inert on current content — confirms additivity).

**Status: DONE.** frontmatter/types/validator + 6 tests landed; build
14/14, tools-corpus 18/18, full typecheck clean; `pnpm health` 4340 ==
baseline (rules inert on current content — additive confirmed).

---

## Phase B — One hand-authored wormhole + hypothesis test  **[INF]**

*Goal: prove the core value proposition before building any automation.
Hand-author one wormhole for a known high-cost, recurring, stable-source
question; measure whether it helps. This is the **go/no-go gate** for
Phases C–F.*

**Why this question.** `show-worked-topco-listing` is the textbook
candidate from today's trajectory analysis: claude-p reads 5 sibling files
in the `founder-entrepreneur/` cluster (15+ citations); our agent reaches
recall `pass` only by reading several siblings (high tool-call cost). The
sources are stable doctrinal/use-case content (low decay). A wormhole that
distils that cluster into one shallow-linked node is exactly what the
mechanism is for.

**Deliverables**
- A hand-authored derived node, e.g.
  `knowledge/jersey/use-cases/founder-entrepreneur/wormhole-jersey-topco-uk-listing.md`,
  `derived: true`, `derived_from` the cluster's primary files
  (worked-example, why-jersey-topco, migration-pre-ipo, listing-rule-overlay,
  substance-for-topco), `status: draft`, tagged, **shallow-linked from the
  founder-entrepreneur `index.md`** (the wormhole's mouth).
- It must pass Phase A's validator (run it).

**Test (partial eval)**
- Run `show-worked-topco-listing` (the target) + 1 control that *shouldn't*
  use the wormhole (e.g. a single-fact question like `show-parish-hall`),
  via `pnpm --filter @offshoreai/agent eval`, against the wormhole-present
  corpus.
- Compare to the committed v6 baseline on: tool-call count (expect ↓),
  citationRecall (expect hold/↑), citationPrecision (must not ↓),
  wall-clock (expect ↓). Repeat the target once to gauge variance.

**Acceptance / gate**
- **GO** if the wormhole reduces tool calls on the target while holding
  precision and recall ≥ baseline, and the control is unaffected.
- **NO-GO** if precision drops or there's no efficiency/recall gain — then
  the automated machinery (C–F) is not worth building, and we record the
  negative result (restraint principle: a feature that doesn't move the
  number doesn't ship).

**Note on autonomy:** Phase B's eval is the right place to spend inference;
keep it to ~3–4 question-runs total.

**Status: DONE — result is GO-with-qualification.** Wormhole authored at
`knowledge/jersey/use-cases/founder-entrepreneur/wormhole-jersey-topco-uk-listing.md`
(validation-clean: health 4340 == baseline), shallow-linked from the
founder-entrepreneur `index.md`. Two probes (target `show-worked-topco-listing`
+ control `show-parish-hall`):

| Run | Routing | Target trajectory | Target quality | Control |
|---|---|---|---|---|
| baseline (v6) | — | 6 calls, reads worked-example + 4–5 siblings | pass, 8/8 | — |
| Probe 1 | none | 4 calls, **ignores** the wormhole (saw it in `ls`, read the original cluster) | pass, 8/8 | wormhole untouched |
| Probe 2 | routing nudge | 3 calls, **reads the wormhole first** + one spot-verify | pass, 8/8, prec+recall+subst pass | wormhole untouched (no over-routing) |

**Findings.** The wormhole is *sufficient* (contains all 8 facts + the
authoritative citations) but not *preferred* — **passive placement is
ignored**; the agent puts the wormhole on equal footing with the original
cluster and reads what it always read. With a routing signal it reads the
wormhole first and collapses the traversal (worked-example + 4–5 siblings →
wormhole + 1 spot-verify) while holding all quality dimensions, and does
**not** over-route on the unrelated control. **Routing is the load-bearing
component** — exactly the design's prediction. GO to build the automated
machinery, *provided it includes routing*, not just authoring.

The routing nudge that worked (validated on 2 questions, then reverted as
unproven for full regression):

> *Prefer a compiled node when one covers the question. Some corpus files are
> compiled shortcuts (frontmatter `derived: true`) — a distilled
> task-general synthesis with citations resolved, usually linked "start
> here" from an index. Read it first and lean on it; spot-verify rather than
> re-traverse the underlying files.*

This becomes a Phase C deliverable, gated on a full 28-q regression (it is
inert today — only one derived node exists — so a regression run is only
informative once wormholes are real).

---

## Phase C — Wormhole routing + scoped-write drafting  **[INF] [POSTURE]**

*Goal: (1) route the agent to a compiled node when one covers the question
(Phase B proved this is the load-bearing piece), and (2) let the agent
author wormhole candidates itself. Phase B is GO, so this is the next
build. Involves a capability-posture change — review before merge.*

**C1 — Routing (do this first; cheapest, highest-leverage).** Ship the
routing nudge validated in Phase B (read a `derived: true` node first when
one covers the question; spot-verify rather than re-traverse). Gate on a
**full 28-q regression** against the v6 baseline + `claude-p` — confirm it
collapses traversal on wormhole-covered questions, holds all quality
dimensions, and does not over-route / regress on the rest. Consider also a
deterministic surfacing signal (e.g. `findByTag` / index results flag
`derived` nodes first) so routing doesn't rely on the prompt alone.

**C2 — Scoped staging Write + inline drafting trigger.**
- Runtime: add `Write` to `allowedTools`, **sandboxed via `canUseTool` to
  `wormholes/candidates/**` only** (AGENT-BEHAVIOURS #5 mechanism); deny
  writes anywhere else. Audit every write (#6).
- A staging convention: `wormholes/candidates/<persona>/<task>.md`.
- System-prompt addition (the drafting trigger): at the end of a
  substantive answer, *if* (a) traversal was non-trivial, (b) sources were
  stable-layer, (c) the insight generalises beyond the specific question —
  write a candidate wormhole node (frontmatter per CONVENTIONS, `status:
  draft`, `derived_from` the files actually used). Emit via `Write` (a
  `tool_use` block, so it stays out of the concatenated answer), not prose.

**Acceptance (INF)**
- C1: on a wormhole-covered question the agent reads the wormhole first and
  collapses the traversal; no over-routing or quality regression on the
  full 28-q suite vs v6 + `claude-p`.
- C2: the agent emits well-formed candidate nodes (Phase A validator passes
  them) on recurring expensive questions and **not** on narrow single-fact
  questions; no answer pollution; no tool-budget blow-up.

---

## Phase D — Verifier-gated promotion  **[INF]**

*Goal: a candidate becomes a served wormhole only after the
citation-verifier passes it. Reuses the existing `citation-verifier.ts`.*

**Deliverables**
- A promotion step (CLI/job): for each `wormholes/candidates/**` node, run
  the citation-verifier against its body + `derived_from`; on pass, set the
  verifier-pass marker, move/commit it into the served corpus location,
  shallow-link it from the relevant index; on fail, discard or flag for
  editorial.
- Wire the Phase A `derived_unverified_stable` rule to the marker.

**Acceptance (INF)**
- A known-good candidate promotes to `status: review`/`stable` and is then
  found by ordinary `findByTag`/grep/`getFile`.
- A deliberately-wrong candidate (hallucinated citation) is rejected by the
  verifier and not promoted.

---

## Phase E — Log-loop nomination + eviction  **[INFRA]**

*Goal: demand-driven distillation and culling. Blocked on the audit/event
log (PRD §11.3 / AGENT-BEHAVIOURS #6), which needs persistence not yet
built.*

**Deliverables (when unblocked)**
- A periodic deterministic query over the event log nominating candidate
  shapes (recurrence × retrieval-cost × source-stability × no-existing-
  wormhole) — cheap, no inference; inference only on distilling winners.
- Eviction: wormholes that are cold (never traversed) or bypassed (agent
  greps past them) are flagged for removal — publish-then-evict.

**Acceptance**
- Nomination surfaces the same high-cost recurring shapes a human would
  pick (sanity-checked against trajectory data); eviction removes a planted
  cold wormhole.

---

## Phase F — Git fork / tenant mechanics + PR promotion  **[INFRA]**

*Goal: the multi-tenant substrate. Canonical upstream + per-tenant forks;
promotion upstream by PR. Blocked on tenant infrastructure (PRD §9).*

**Deliverables (when unblocked)**
- Tenant = fork of the canonical corpus; agent reads its fork's working
  tree; tenant divergence stays on the fork; valuable general wormholes
  PR'd upstream and reviewed as diffs (editorial = PR review).
- Upstream-sync workflow for forks; CI validation (Phase A rules) on PRs.

**Acceptance**
- A tenant-local wormhole never leaks upstream except by PR; `git diff
  upstream/main` is exactly the tenant's divergence.

---

## Dependency graph

```
A (det) ──▶ B (gate) ──▶ C (posture) ──▶ D (promote) ──▶ E (nominate/evict)
                                                   └─────▶ F (tenant forks)
```

A is independent and shippable now. B gates everything after it. C–D are
the automated authoring loop. E–F are infra-blocked and wait on
persistence / tenant work respectively.

---

## What ships this session (autonomous)

- **Phase A** in full (deterministic, test-gated).
- **Phase B** attempted: author the wormhole, run the partial eval, record
  GO/NO-GO honestly. If GO, leave C–F as the planned next steps for review
  (they involve a posture change and infra; not appropriate to land
  unsupervised). If NO-GO, record the negative result and stop — the
  machinery isn't justified.
