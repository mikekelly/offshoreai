# BACKLOG.md

Deferred ideas that have been raised and discussed, but are **not yet
committed to the build plan**. Each entry needs **design exploration and
approval** before pickup. This is not a roadmap and not a wish list — it's
the holding area for proposals we've thought about enough to write down,
but not enough to schedule.

For the build plan as actually scheduled, see
[`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md). For the design that
the build plan rolls up to, see
[`PRD-baseline-agent-v1.md`](./PRD-baseline-agent-v1.md).

---

## Batch verifier monitor

**Status:** pending design exploration and approval.

**Concept.** A scheduled, out-of-band job that walks the conversation store
(`packages/web/.data/conversations.json` today; whatever it becomes later)
and re-runs the same citation-verifier we use inline — but for *aggregate
analysis*, not gating any individual answer. The output is a report for the
editorial team, not a verdict the user sees.

**How it differs from the inline gate** (which is shipped, see
[`AGENT-BEHAVIOURS.md` §4](./AGENT-BEHAVIOURS.md)).
The inline gate fixes *this answer, now*; the batch monitor fixes *the
system that produces answers*. They are complementary, not substitutes.

|                   | Inline gate (shipped)                  | Batch monitor (proposed)               |
| ----------------- | -------------------------------------- | -------------------------------------- |
| Purpose           | Correct *this* user's answer           | Improve the corpus and the agent       |
| Where it runs     | In the `/api/ask` request path         | Scheduled (nightly / weekly)           |
| Action on finding | Regenerate the answer                  | Produce a report / open a ticket       |
| Scope of view     | One turn                               | Every historical turn → finds patterns |

**What it would produce.** Reports only make sense aggregated. Examples of
the findings:

- *"`firewall.md` was cited 47 times last week; in 3 cases the verifier
  flagged because the answer claimed Article 9A behaviour against a file
  that only documents Article 9 — the file should mention 9A explicitly."*
- *"The claim 'Article 9(4) renders foreign judgments unenforceable' was
  the most-asserted fact this month, paraphrased 12 different ways —
  consider canonicalising the wording for retrieval stability."*
- *"`worked-example-international-family-wealth.md` was cited in 18
  answers last month while still `status: draft` — it's load-bearing,
  promote it from draft to review."*
- *"5 conversations went reject → corrected → reject; these are the
  agent's hard cases, escalate to editorial."*
- **Drift detection:** an answer that previously verified clean now
  rejects — the corpus has changed underneath an old conversation; flag
  the prior answer as potentially stale.

**Why it's deferred.** The whole value of the monitor is *patterns across
real usage*. The conversation store has a handful of test conversations
today; building a reporting system against our own QA traffic would tune
the system on the worst possible signal. The right time to build this is
**after the UI sees genuine use** (a few weeks of real questions).

**Recommended first step, when picked up.** A small `pnpm verifier-replay
<conversationId | --since DATE | --status rejected>` CLI that re-runs the
verifier on persisted turns ad-hoc. One-shot, no scheduling, no
aggregation — useful immediately for debugging individual cases, and the
seed the scheduled monitor and aggregation reports get built on top of.

**Open design questions** to resolve before pickup:

- Sampling vs full sweep — the LLM verifier is expensive; what's the cost
  budget per run and what's a sensible sampling strategy?
- Where do reports land? Markdown in the repo (editorial PR fodder),
  GitHub issues, a separate dashboard? Different audiences want different
  surfaces.
- Drift detection requires keeping the answer-vs-corpus-version pairing;
  do we snapshot the corpus's git SHA at answer time, or re-run against
  the current corpus only?
- Sub-agent vs in-process — the inline verifier is an SDK sub-agent;
  the batch could be either. In-process saves overhead but couples more
  tightly.
- Does the monitor itself get verified / sanity-checked? The verifier
  has its own parse-failure mode (see `citation-verifier.ts`).

**Related shipped work.** The inline gate, drafts-as-visible-messages,
soft-fail handling of verifier infrastructure errors — see
[`AGENT-BEHAVIOURS.md` §4](./AGENT-BEHAVIOURS.md) and
[`packages/web/README.md`](./packages/web/README.md).
