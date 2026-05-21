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

**C1 — Routing (as originally attempted).** Ship the routing nudge
validated in Phase B (read a `derived: true` node first when one covers the
question; spot-verify rather than re-traverse), gated on a full 28-q
regression. *(This was the original C1 plan; the result below redirected it
— see the revised Conclusion and Phase D.)*

**Status: NO-GO for prompt-only routing (reverted).** Regression
`evals/baselines/2026-05-21-offshoreai-c1-routing/` (4 wormholes present +
the nudge), vs v6:
- Aggregate flat-to-worse: 23/5/0 vs v6 24/4/0; recall 0.86 vs 0.93;
  one hallucinated citation appeared. Most of the per-question flips
  (aifmd-ii/voisinage up, bermuda-captive/continuation-funds down) are
  non-wormhole questions — i.e. the ~14% run-to-run noise, not routing.
- The hallucination (`show-worked-family-wealth` cited a non-existent
  `financial-regulation/private-trust-company.md`) is **not** wormhole-
  caused — it traces to the worked-example, the wormhole was read last,
  and v6 didn't hallucinate it. Background agent variance.
- **The real problem is the value prop:** prompt-only routing makes the
  agent read the wormhole *in addition to* the cluster, not *instead of*
  it. Traversal collapsed on only **1 of 4** (topco 6→3); trusts-comparison
  read wormhole + cluster (6 calls), fund-routes didn't route at all (4),
  family-wealth read wormhole + cluster (7, worse than v6's 5). The nudge's
  "spot-verify rather than re-traverse" does not reliably land — the agent
  doesn't trust the wormhole as *sufficient*.

**Conclusion (revised — see AGENT-PRINCIPLES #24).** The first read was "a
prompt plea is too weak, go deterministic." On review that over-corrected.
The nudge was **confounded**, not proof prompting can't route:
- the test wormholes are `status: draft`, and the agent's own status rules
  say draft content is unverified — so it dutifully read the primaries *too*;
- the nudge competed with the always-resident "read the on-topic siblings"
  rule, pulling the agent both ways at once.
The fix is **not** a deterministic surfacing layer (forcing a node into
context is the RAG move #24 rejects). It is a **semi-deterministic agent
flow**: a **retrieval phase-skill** loaded JIT (so it's conflict-free — no
competing sibling rule resident at the same time) that prefers a
**trustworthy** wormhole (curator-accepted, not `draft`). Re-test with
curator-accepted wormholes + the skills flow + repeat runs — that is the
proper retry, in Phase D. Until then the wormholes sit as valid `draft`
nodes, read opportunistically but not yet routing-preferred.

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

**Status (C2):** *core DONE + safe; prompt-driven drafting under-triggers.*
- Plumbing built and verified: pure `canUseTool` sandbox (9/9 unit tests —
  allows writes only under `wormholes/candidates/`, denies curated-corpus /
  `..`-escape / prefix-trick / no-path), wired behind an off-by-default
  `enableWormholeDrafting` flag (normal path unchanged); the `default` +
  `canUseTool` permission path **works headlessly (no hang)**.
- But across 3 live runs the agent **never drafted** a candidate — declining
  for a mix of defensible reasons (a wormhole already exists for the
  task-class; the BVI sources are `draft`-status, not stable) and, even with
  the stability gate relaxed, simple prompt-under-triggering. A prompt
  instruction does not reliably make the agent author a node.

**Meta-finding (C1 + C2), revised per AGENT-PRINCIPLES #24.** The first
reading — "prompt-driven autonomy is the wrong lever, go deterministic" —
was too strong. What the runs actually show is that *isolated prompt
instructions competing with always-resident rules*, tested against
*draft-status* wormholes the agent is told to distrust, are unreliable —
not that prompting can't drive the behaviour. The fix is **structured,
semi-deterministic agent flow**, not deterministic code or RAG-style
forcing:
- **Thin high-level flow + JIT phase-skills** so each phase's context is
  clean and **conflict-free** (no routing rule fighting a sibling rule), and
  a **task list** that enforces the agent follows the steps it planned.
- **Routing →** a *retrieval phase-skill* that prefers a **trustworthy**
  (curator-accepted) wormhole — re-tested without the draft-distrust and
  competing-rule confounds.
- **Drafting →** a *closing proposal phase-skill* (reusing the proven C2
  sandbox) + a **fresh-context curator sub-agent** that adjudicates
  add/amend/discard, with **dedup doing the recurrence work** — *not* a
  deterministic log-loop nomination.

Determinism stays only where #24 says it belongs: the substrate and
guardrails (the scoped-write sandbox, the validator, git). C2's sandbox +
flag are exactly that durable substrate; the *trigger* is the in-session
proposal phase-skill, and the *gate* is the curator sub-agent.

---

## Phase D — Skills-driven execution flow (the proper routing retry)  **[INF] [POSTURE]**

*Goal: replace the isolated routing nudge with a structured agent flow
(AGENT-PRINCIPLES #24), and re-test routing without the C1 confounds.*

**Deliverables**
- Wire the **SDK skills mechanism** (`.claude/skills/`) into the runtime, and
  add **`TodoWrite`** to `allowedTools` (the task-list / program-counter).
  *Verify first* that the agent can load a skill **JIT mid-flow** (agent-
  invokable), not only at session start — the whole approach rests on this.
- A **thin high-level flow** in the baseline prompt + a small set of
  **phase-skills** (orient/retrieve, compare, freshness, …), each carrying
  *only* its phase's instructions. Fold the existing grep-fallback /
  grep-context / sibling-reads rules into the relevant phase-skill so they
  are no longer all resident at once.
- A **retrieval phase-skill** that, when a `derived: true` node *of
  trustworthy status* covers the question, reads it first and skips the
  underlying cluster.

**Acceptance (INF)**
- On the 4 wormhole questions (now **curator-accepted**, not `draft`), the
  agent reads the wormhole *instead of* the cluster and collapses the
  traversal; no over-routing or quality regression on the full 28-q suite
  vs v6 + `claude-p`; confirm with repeat runs (single 28-q is too noisy).

---

## Phase E — Propose → curator sub-agent (authoring loop)  **[INF]**

*Goal: the agentic authoring loop. A closing proposal phase-skill emits a
candidate; a fresh-context curator sub-agent disposes. Replaces the old
"verifier-gated promotion" AND the deterministic "log-loop nomination" —
**not** infra-blocked; it needs no persistence.*

**Deliverables**
- **Proposal phase-skill** (closing step of the flow): when the agent judges
  it produced a generalised, reusable insight over settled sources after
  non-trivial traversal, it `Write`s a candidate to `wormholes/candidates/`
  via the proven C2 sandbox. (C2 showed the agent under-proposes from a
  prompt block buried in the system prompt; a *dedicated closing
  phase-skill* loaded JIT is the #24 way to make it reliable — re-test.)
- **Curator sub-agent** (fresh context — the #23 verifier pattern
  generalised): takes each candidate cold and returns **ADD / AMEND+ADD /
  DISCARD**, judging appropriateness, generalisability, **dedup vs existing
  wormholes** (this is the recurrence signal — repeated proposals of a
  task-class are the recurring ones), conventions (no second-order), and
  that every citation traces. On ADD it sets `verifier_passed`, places +
  shallow-links the node, and (Phase F) opens the PR.
- Wire the Phase A `derived_unverified_stable` rule to the curator's marker.

**Acceptance (INF)**
- A proposed good candidate is ADDed (or AMENDed) and then found by ordinary
  retrieval; a hallucinated/duplicate/over-narrow candidate is DISCARDed; the
  proposer never self-promotes into the served graph.
- *Optional later optimiser (not a prerequisite):* a periodic **usage
  review** evicts cold/bypassed wormholes (publish-then-evict). This is the
  only step that benefits from measured traversal data.

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
A (done) ─▶ B (done) ─▶ C (C1 NO-GO / C2 core done) ─▶ D (skills flow + routing retry)
                                                          └─▶ E (propose → curator) ─▶ F (tenant forks)
```

A and B are landed. C recorded the negative result that motivated the #24
redirect. D wires the skills-driven flow and re-tests routing without the
C1 confounds; E adds the proposal phase-skill + curator sub-agent on top of
D's flow. F (tenant forks) is infra-blocked. Eviction is an optional
optimiser, not on the critical path.

---

## Current status

- **Phase A — DONE.** Derived-node conventions + validator rules + tests;
  additive (health == baseline).
- **Phase B — DONE (GO-with-qualification).** First wormhole + hypothesis
  test; wormholes are sufficient but need routing.
- **Phase C — done as an experiment, redirected.** C1 (prompt-only routing)
  NO-GO and reverted; C2 sandbox + off-by-default flag DONE and safe, but
  prompt-only drafting under-fires. Both feed the #24 conclusion.
- **Phase D / E — the #24 build, not yet started.** Gated first on
  *verifying the SDK supports agent-invoked JIT skill loading* — the whole
  approach rests on it. These involve a capability-posture change; land with
  review, not unsupervised.
- **Phase F — infra-blocked** on tenant infrastructure (PRD §9).

The durable, shipped assets regardless of D/E: Phase A's conventions +
validator, the 4 hand-authored wormholes, and the C2 sandbox guard + tests.
