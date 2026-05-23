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

---

## Showcase A/B — measuring the inclusion-link affordances

**Status:** pending — code, prompt, and treatment arm are shipped;
eval run blocked on Anthropic API credentials in this environment.

**What shipped.** PRD-corpus-stewardship v1 Part A is committed in
full (commits `34be6da`, `e70e9e5`, `6a5bbfc`, `b7ed599`):

- `getFile` gained opt-in `depth` and `parentContext` params backed by
  a precomputed inclusion-link graph.
- New `corpus.tree` handler walks the inclusion-link graph from a
  root, returning per-node summaries.
- Baseline system prompt now lists 5 corpus tools and rewrites the
  "Read on-topic siblings" nudge to recommend the three inclusion-link
  mechanisms (`getFile depth:1`, `getFile parentContext:1`, `tree`)
  over the older "Glob + read each sibling" pattern, with Glob as a
  fallback for sparse-graph areas.

**What needs validating.** Whether the treatment arm actually moves
the three PARTIAL cases in
[`evals/baselines/2026-05-19-offshoreai-agent-full/summary.yaml`](./evals/baselines/2026-05-19-offshoreai-agent-full/summary.yaml).

**Empirical smoke-test against the live MCP** (run on 2026-05-23 with
the corpus's `mcp__corpus__tree` and `mcp__corpus__getFile` deferred
tools) — *not a substitute for the full eval, but a check that the
affordances expose the right files in principle*:

| Partial case | Baseline failure | Smoke-test result | Prediction |
|---|---|---|---|
| `show-trusts-comparison` | "never reading firewall.md", VISTA "barely sketched", classic discretionary trust never discussed | `tree` on `CROSS-JURISDICTIONAL-MAP.md` (depth 2, 49 nodes) exposes `firewall.md`, `cayman/star-trusts.md`, `bvi/vista-trusts.md`, `guernsey/trust-law-differences-from-jersey.md` at depth 1 with summaries. `getFile parentContext:1` from `firewall.md` returns CROSS-JURISDICTIONAL-MAP.md with the full trust-regime row | **High confidence the partial moves to pass** — the files the baseline missed are 1 tool-call away |
| `show-aifmd-nppr` | Missed AIFMD Article 42 + Article 21 reporting + "Jersey AIFM Regulations 2012" naming | `aifmd-nppr.md` is already a direct child of `funds/index.md` — discovery wasn't the gap. The gap is content density inside the file | **Low confidence** — this is a within-file content gap, not a sibling-discovery one |
| `show-friday-passing` | Asserted corpus silence when ≥3 unrelated files mention Friday-passing incidentally | Inclusion-link graph won't surface incidental mentions in files whose primary topic is something else (leases, force-majeure) | **Unlikely to move** — vocabulary/grep failure, not sibling-context. Useful as non-regression check |

**Run plan when credentials are available** — phased, ~$1.20 then ~$5.40:

```bash
# Phase 1 — 3 partials only (~$1.20)
pnpm --filter @offshoreai/agent eval -- \
  --harness offshoreai-agent \
  --eval evals/showcase.yaml \
  --ids show-trusts-comparison,show-aifmd-nppr,show-friday-passing \
  --output evals/baselines/2026-05-23-iwe-treatment-partials \
  --concurrency 3

# Phase 2 — full 14 if Phase 1 is positive (~$5.40)
pnpm --filter @offshoreai/agent eval -- \
  --harness offshoreai-agent \
  --eval evals/showcase.yaml \
  --output evals/baselines/2026-05-23-iwe-treatment-full \
  --concurrency 4
```

**Decision rule.** If `show-trusts-comparison` moves PARTIAL → PASS
in Phase 1 with no regression on the other two, the affordance is
validated; run Phase 2 to confirm no regression on the 11 passes and
promote the prompt change to permanent. If `show-trusts-comparison`
*doesn't* move, investigate why — either the prompt nudge wasn't
strong enough or the agent didn't pick the right entry point — and
iterate before re-running.

**Cost estimate basis.** `2026-05-19-offshoreai-agent-full/summary.yaml`
reports `totalCostUsd: 5.4384` for 14 questions = ~$0.39/q.

**Related shipped work.**
[`packages/agent/src/baseline-system-prompt.ts`](./packages/agent/src/baseline-system-prompt.ts),
[`packages/tools-corpus/src/handlers/getFile.ts`](./packages/tools-corpus/src/handlers/getFile.ts),
[`packages/tools-corpus/src/handlers/tree.ts`](./packages/tools-corpus/src/handlers/tree.ts),
[`packages/tools-corpus/src/inclusion-links.ts`](./packages/tools-corpus/src/inclusion-links.ts).

---

## iwe-aligned conventions and tool affordances (historical — superseded above)

**Status:** SHIPPED. The original deferred entry is preserved below
for the design rationale; the validation work moved up to the
*Showcase A/B* entry above. Move 1 (convention docs), Move 2
(depth/parentContext/tree + system-prompt integration), and Move 3
(iwe CLI scaffolding) all landed in commits `c411ddc` → `b7ed599`.
Design rationale in
[`PRD-corpus-stewardship-v1.md`](./PRD-corpus-stewardship-v1.md) Part A.

**Concept.** Borrow three things from [`iwe`](https://iwe.md) — a Rust
CLI + LSP + MCP layer over markdown corpora that uses a *link on its
own line* as a structural parent→child relationship (an **inclusion
link**) and inline links as cross-references.

1. **Document the inclusion-link convention** in [`CONVENTIONS.md`](./CONVENTIONS.md).
   We already write `index.md` files this way ([`knowledge/jersey/index.md`](./knowledge/jersey/index.md)
   has 4 bare-line links, [`CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md)
   has 35, [`knowledge/jersey/trusts/index.md`](./knowledge/jersey/trusts/index.md)
   has 25); naming the convention turns implicit practice into a
   machine-readable hierarchy alongside folders + [`TAGS.md`](./TAGS.md).
2. **Fold iwe-shaped affordances into our existing tools.** Add
   `depth` and `parentContext` parameters to
   [`getFile`](./packages/tools-corpus/src/handlers/getFile.ts), mirroring
   `iwe retrieve -d N -c N`. Add a new `tree` handler that returns the
   inclusion-graph shape rooted at a path. Both replace the prose nudge
   in [`CLAUDE.md`](./CLAUDE.md) ("read on-topic siblings", "read
   surrounding context") with mechanical retrieval.
3. **Pilot the `iwe` binary as a developer-side editing tool** (not in
   the agent's runtime tool surface) for `iwe rename` (link-safe file
   renames — today this is grep-and-pray), `iwe extract` / `iwe inline`
   (refactor a section into its own concept file and back), `iwe stats`
   and `iwe export dot` (orphan/root detection for the COVERAGE-AUDIT
   discipline). Architectural restraint ([PRD §C](./PRD-baseline-agent-v1.md)
   Appendix C) is satisfied because iwe is genuinely external code at a
   cross-process boundary, not a CLI over functions we own.

**What we deliberately don't do.** Run iwe's MCP server alongside our
`corpus` connector at agent runtime. The corpus connector owns the
load-bearing freshness/citation envelope — `last_verified`, `status`,
`articles_covered` dispatch, the closed-TAGS index, and the
help-line/error envelope. Running both MCPs would duplicate retrieval
surface area without the citation discipline and add tool-surface
noise on the agent's context window. iwe stays a human-side tool.

**Why deferred.** Move 1 (convention documentation) is essentially
free and could land in a single PR. Move 2 (depth/parentContext)
needs eval evidence that the current "manually read on-topic siblings"
discipline is actually failing on the showcase partials at
[`evals/baselines/2026-05-19-offshoreai-agent-full/summary.yaml`](./evals/baselines/2026-05-19-offshoreai-agent-full/summary.yaml)
— if it isn't, Move 2 is speculative. Move 3 (iwe CLI) needs the
non-trivial step of getting iwe to grok our hierarchical folder layout
and per-jurisdiction directory structure (iwe is happiest with a flat
`graph/` directory à la its [`seventeen-centuries`](https://github.com/iwe-org/seventeen-centuries)
example).

**Recommended first step, when picked up.** Move 1 alone — add the
inclusion-link convention to CONVENTIONS.md, audit a representative
sample of index.md files to confirm they already follow it, and write
a one-page note in [`AGENTS.md`](./AGENTS.md) explaining the
graph-structure-from-flat-files reading. No code. Unlocks Moves 2 and
3 without committing to them.

**Open design questions** to resolve before pickup:

- Does iwe's flat-`graph/` assumption interact badly with our nested
  jurisdiction folders? Need to verify against iwe's actual `init`
  behaviour, not just the `seventeen-centuries` example.
- Move 2's `tree` handler — does it need to honour the closed-TAGS
  taxonomy, or is the inclusion-link graph a *separate* navigation
  layer? Three navigation layers (folders, tags, inclusion-links) is
  one more than we currently have; worth a deliberate choice.
- Does `getFile` with `depth=N` blow the AXI output budget? Need to
  re-check token cost against the §7.0.2 discipline.

**Related shipped work.** [`CONVENTIONS.md`](./CONVENTIONS.md),
[`getFile`](./packages/tools-corpus/src/handlers/getFile.ts),
[`getArticle`](./packages/tools-corpus/src/handlers/getArticle.ts),
[`COVERAGE-AUDIT.md`](./knowledge/jersey/COVERAGE-AUDIT.md).

---

## Knowledge Manager Agent

**Status:** pending design exploration and approval. Design draft in
[`PRD-corpus-stewardship-v1.md`](./PRD-corpus-stewardship-v1.md) Part B.

**Concept.** A second agent — *not* the answering agent — whose job
is to *maintain* the corpus rather than read from it. Three sub-agents
under one runtime, each with a strictly bounded authority level:

1. **Auditor (read-only).** Scheduled scan for stale `last_verified`,
   broken cross-links, claims without citations, dead primary-source
   URLs, files where `status: draft` is load-bearing in answered
   questions. Output: appended reports to [`BACKLOG.md`](./BACKLOG.md)
   and a new `corpus-health.md`. **Authority: zero** — produces text
   for humans to triage.
2. **Refresher (proposes PRs, never auto-merges to `stable`).** For
   files whose primary source is fetchable (jerseylaw.je, gov.je,
   JFSC handbooks, statesassembly.je — the canonical roots in
   [`knowledge/jersey/sources.md`](./knowledge/jersey/sources.md)),
   fetches the live source, diffs against the corpus claim, and opens
   a PR with either `last_verified` bumped (no-diff case) or
   substantive edits flagged for human review. **Authority: PR-only**.
3. **Outreach coordinator (drafts emails, never sends).** For
   genuinely uncertain claims that primary sources can't settle —
   judgment calls, market practice, expert second opinions — drafts an
   email to a *named expert from a pre-curated, opt-in panel*. Human
   reads and sends. **Authority: outbox-drafts only**.

**How it differs from the existing inline sub-agents.** The
shipped/planned inline sub-agents
([`citation-verifier`](./prompts/sub-agents/citation-verifier.md),
[`freshness-checker`](./prompts/sub-agents/freshness-checker.md),
[`bundle-assembler`](./prompts/sub-agents/bundle-assembler.md))
run *during* an answering session — they fix *this answer, now*. The
knowledge-manager runs *out-of-band* (scheduled / on-demand) and fixes
*the corpus the answering agent will read tomorrow*. Same freshness
contract, same source hierarchy, opposite authority direction:
answering agent *reads* under citation discipline; manager *writes*
(or proposes writes) under verification discipline.

**What it would produce.** Examples:

- "27 files have `last_verified` older than 365 days. The 5 most-cited
  stale files in the last month of conversations were …"
- "`firewall.md` cites jerseylaw.je URL X; URL X now redirects to URL
  Y; opening PR to update the citation."
- "Article 47B set-aside text in `article-47-set-aside.md` no longer
  matches the live statute (3-line diff attached); flagged as
  `status: draft` pending human review."
- "Claim *'JFSC Code of Practice C.1.4 requires X'* appears in 4 files
  with 3 different paraphrasings — canonicalise wording for retrieval
  stability."
- Outreach: "Drafted email to [named Jersey trust practitioner] asking
  whether the Article 9A reserved-powers practice has shifted post-[case];
  human approval required before send."

**Why outreach must be human-gated and panel-scoped.** Cold-emailing
offshore lawyers in the corpus's name at any volume burns goodwill
catastrophically fast if bot-driven. A pre-agreed panel of named
experts (10–20 people) with explicit opt-in consent, per-person rate
limits, and human send-approval keeps the channel sustainable.
Without that constraint this is the part that *destroys* the corpus's
reputation rather than building it.

**Why deferred.** Three big unknowns:

1. **Authority model.** `last_verified` means "a human looked at the
   primary source." If the agent self-certifies, the contract goes
   circular. Need a `last_verified_by: human | agent | hybrid` field
   plus eval-time downweighting of agent-only verifications before any
   Refresher work merges to `stable`.
2. **Eval surface.** No existing eval measures the manager. Need a new
   class: *deliberately stale a file, can the manager refresh it
   correctly?* *Insert a gap, does the proposed draft pass the
   answering agent's citation discipline?*
3. **Build order vs Auditor-only first cut.** Auditor is essentially
   risk-free and could ship behind the others. Build incrementally.

**Recommended first step, when picked up.** Ship the **Auditor only**
as a `pnpm corpus-audit` CLI that produces a `corpus-health.md` report
and stops. Read-only, no PR-opening, no email-drafting. That alone
removes the largest editorial-throughput tax (humans don't have to
*find* the work to do) and produces enough signal to design Refresher
and Outreach properly.

**Open design questions** to resolve before pickup:

- Does the Auditor run nightly, weekly, or on-demand? Cost vs signal
  freshness tradeoff.
- Where does the Auditor's report land — markdown in the repo (PR
  fodder), GitHub issues, a separate dashboard?
- Does the Refresher need its own MCP for primary-source fetching, or
  does it reuse `primarySource.fetch` (existing per
  [`AGENT-BEHAVIOURS.md` §3](./AGENT-BEHAVIOURS.md) / [PRD §7.2](./PRD-baseline-agent-v1.md))?
- Outreach panel curation — who decides who's on it, how do experts
  opt in / out, what's the per-expert rate limit?
- Does the manager have access to conversation logs (to prioritise
  refreshing high-cited files), and how does that interact with
  per-tenant data segregation?
- Frontmatter: do we add `last_verified_by`, or compute it from git
  blame on the `last_verified` line?

**Related shipped work.**
[`freshnessCheck`](./packages/tools-corpus/src/handlers/freshnessCheck.ts),
[`gaps.md`](./knowledge/jersey/history/finance/gaps.md),
[`COVERAGE-AUDIT.md`](./knowledge/jersey/COVERAGE-AUDIT.md),
[`changelog.md`](./knowledge/jersey/changelog.md), [PRD §16 open
questions](./PRD-baseline-agent-v1.md) (editorial throughput is one
of the six unresolved items).
