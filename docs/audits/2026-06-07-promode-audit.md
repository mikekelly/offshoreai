# Promode Methodology Audit — offshoreai

**Date:** 2026-06-07
**Method:** `promode:promode-audit` — 7 parallel read-only assessors (one per dimension), synthesised into a prioritised plan.
**Branch audited:** `main`

---

## Overall alignment

A genuinely well-engineered, self-describing repo with two faces: a meticulous
markdown knowledge **corpus** and a small, clean TypeScript workspace. The
*documentation-as-architecture* and *code architecture* dimensions are
exemplary (Strong across Framing, Architecture, Hygiene). The weaknesses cluster
in **runtime feedback loops** — the things an agent needs to debug, test, and
visually iterate the *running* system: there is no end-to-end request
traceability, the agent runtime has zero tests, and the actively-iterated web UI
has no design source-of-truth, lookbook, or live-refresh loop. The single
highest-leverage defect is that the root knowledge node (`CLAUDE.md`) *actively
lies* — it tells every agent "there's no implementation code yet" while 54 TS
files and a working `SETUP.md` sit on disk.

**Per-dimension ratings:**

| Dimension | Rating |
|---|---|
| Framing & traceability | **Strong** |
| Tests & feedback loops | **Partial** |
| Agent knowledge & orientation | **Partial** (CLAUDE.md leaning Weak) |
| Architecture & navigability | **Strong** |
| Observability & traceability | **Weak** |
| Design system & visual feedback loop | **Weak** |
| Change hygiene | **Strong** |

**Setup check:** clean — no stale per-project promode leftovers
(`.claude/PROMODE_MAIN_AGENT.md`, `promode-main-context.sh` absent; no promode
`SessionStart` copy-install). `promode@promode: true` in `.claude/settings.json`
is just plugin enablement.

---

## Findings by dimension

### Framing & traceability — Strong

- Full goal→principle→behaviour→PRD→plan→eval-acceptance→persona-tagged-test→corpus
  spine exists and links upward by file path. Personas are evidence-grounded
  (PRD §3 jobs-to-be-done, `TAGS.md` 14-persona taxonomy, 16 use-case indexes,
  `persona:` fields in eval YAML).
- **F1:** `evals/showcase.yaml` is the one feature-test with no persona link
  (uses `category:`).
- **F2:** Eval-score drift — `EVAL-DRIVEN-PLAN.md` says "14 PASS/3 FAIL",
  `CLAUDE.md` says "26/26 PASS"; three docs cite different runs, none reconciled.
- **F3:** `SESSION-PROGRESS-2026-05-18.md` is a root-level near-orphan.

### Tests & feedback loops — Partial

- Fast deterministic tier is excellent: `pnpm test` 100 tests in **3.6s**,
  `pnpm typecheck` 4.0s, fixtures not over-mocks (`handlers.test.ts` builds a real
  on-disk corpus; `render.test.ts` tests exactly what ships). NB: these vitest
  unit tests are pure and free — no model API. Only the `evals/` suite hits the
  API and burns inference.
- **Biggest gap:** `packages/agent` (the runtime) has **zero tests and no test
  script**. Untested *and unit-testable*: `freshnessFor`/`ageDaysFrom`,
  `citationEvent` (the MISSING-citation path — the UI's differentiator),
  `hostAllowed` (DNS-rebinding defence) and `UUID_RE` in `server.ts`,
  `citation-verifier.ts` verdict parsing.
- The operator seam exists (`web-agent.ts` `agent.stream()` yields typed events)
  but is driven end-to-end only by the **slow, LLM-judge-flaky** `evals/`
  (~5 min, API-billed, logged same-question PASS↔PARTIAL variance). No
  deterministic test asserts the event state machine.
- **`pnpm lint` is theatre** — no lint tooling installed at all; the root script
  runs and prints nothing.

### Agent knowledge & orientation — Partial (CLAUDE.md → Weak)

- **Correctness bug (top priority):** `CLAUDE.md` lines ~109 & ~128 say "no
  implementation code yet… write SETUP.md when written" — false; the workspace
  and `SETUP.md` (8.9KB) exist. The root node lies to every cold-starting agent.
- **Concision FAIL:** `CLAUDE.md` `@`-transcludes four large corpus files
  (`jersey/index.md`, `CROSS-JURISDICTIONAL-MAP.md`, `trajectory.md`, `TAGS.md`)
  ≈ **~74KB ambient into every session** — including code-only work — violating
  the repo's *own* "retrieval is the agent's job" principle.
- **Orphaned from both roots:** `SETUP.md`, `IMPLEMENTATION-PLAN.md`,
  `EVAL-DRIVEN-PLAN.md`, `PRD-corpus-stewardship-v1.md`,
  `packages/schemas/README.md`. README's only outbound `.md` link is
  `CONVENTIONS.md`.
- No ADR/decisions store (the 4 load-bearing restraint decisions live as
  scattered prose). No `RUNBOOKS.md` hub. `packages/agent`, `build`,
  `tools-corpus` have no README (web & schemas do, and are excellent).

### Architecture & navigability — Strong

- Clean acyclic DAG, deep modules (`tools-corpus/context.ts` exemplar), testable
  at the right tier, architectural-restraint principle honoured *and* documented
  at the point of temptation (`mcp-stdio.ts` is a legitimate cross-process
  adapter reusing the same tool defs, zero duplication).
- **F1:** 6 of 11 tool schemas in `corpus.ts` are aspirational (unimplemented) —
  latent surface that misleads readers.
- **F2:** `getFileResult` schema doesn't match the TOON the handler emits.
- **F4:** Freshness/age math duplicated in `tools-corpus/context.ts` and
  `web-agent.ts` (two sources of truth for "how stale").

### Observability & traceability — Weak

- **No correlation ID threads client→server→agent.** Client POSTs
  `{question, conversationId}` only; server mints no per-request ID; the SDK
  `session_id` (the only ID crossing the boundary) identifies a *conversation*,
  not a turn, and is assigned mid-stream.
- **Effectively no app logs** — server emits only startup/fatal `stderr`;
  runtime logs nothing. The root `logs/*.log` are **foreign artifacts from a
  different harness**, not this code's output.
- The "non-negotiable" audit-logging behaviour (`AGENT-BEHAVIOURS.md` #6) is
  **entirely unimplemented** — only an enum value exists. Debugging one request
  means slurping an external JSONL by session and disambiguating turns by hand.

### Design system & visual feedback loop — Weak

- Dimension applies (`packages/web` editorial UI, actively iterated). The taste
  is real — `index.html:16-40` has a coherent, semantically-named token layer
  (ink/bg/border ramps, 4 state accents) — but **all three promode artifacts are
  missing**: no `docs/product/DESIGN_SYSTEM.md`, no lookbook, no live-refresh
  (hand-rolled `node:http` under `tsx`, no watcher/HMR; many states only visible
  after a live API round-trip).
- **At-risk knowledge:** a genuine persona/design brief exists only in an
  **uncommitted worktree** (`.claude/worktrees/brave-cori-0133f8/DESIGN-BRIEF-landing-page.md`)
  — one `git clean` from loss.

### Change hygiene — Strong

- Atomic, single-purpose commits; rationale-rich messages (the eval-manager
  revert series narrates dead-ends); tests co-land with code
  (`enrich-pinpoints.test.ts`, guard tests).
- **Lapse:** `tags-audit.ts` (84 lines, a `--fail` CI gate) shipped with no test
  and still has none. One merge-then-revert recovery (`2549ff4`→`5af954a`) from a
  committed stale working tree.

---

## Prioritised action plan

Ranked across all dimensions by impact × effort. Leads with what most compounds
an agent's ability to work this repo. See `KANBAN_BOARD.md` for live status.

### Now — high impact, low/med effort

1. **Fix the false claims in `CLAUDE.md`** — root node tells every agent the
   implementation doesn't exist and `SETUP.md` isn't written; both false. · S ·
   `general-purpose`
2. **Restructure `CLAUDE.md`: trim ambient load + fix reachability** — drop the
   three corpus transclusions (keep `@TAGS.md`), add an "Engineering quick-links"
   signpost block linking `SETUP.md`, `IMPLEMENTATION-PLAN.md`,
   `EVAL-DRIVEN-PLAN.md`, `PRD-corpus-stewardship-v1.md`, design docs. · M ·
   `general-purpose`
3. **Capture the at-risk design persona + extract `DESIGN_SYSTEM.md`** —
   transcribe the worktree `DESIGN-BRIEF` into `docs/product/PERSONAS.md` before
   it's lost, and the existing CSS tokens into a two-layer
   `docs/product/DESIGN_SYSTEM.md`; link both from `CLAUDE.md`. · S ·
   `promode:product-design-expert`
4. **Mint a `requestId` at ingress + one structured per-request log on both
   sides** — `crypto.randomUUID()` in `handleAsk`, thread through
   `agent.stream()` and the first NDJSON event, log start/end/error keyed on it.
   · S · `promode:implementer`
5. **Test the agent runtime's pure & security helpers** — `web-agent.test.ts`
   for `freshnessFor`/`ageDaysFrom`/`citationEvent` MISSING-path/`sourcesOf`,
   plus `hostAllowed` + `UUID_RE`; add a `test` script to
   `packages/agent/package.json`. (Local vitest only — never the eval suite.) · S ·
   `promode:implementer`
6. **Kill the no-op `pnpm lint`** — remove the misleading root script (no tooling
   installed); adding a real linter tracked in `IDEAS.md`. · S ·
   `promode:implementer`

### Next — high impact, higher effort

7. **Deterministic seam test driving `agent.stream()` with a stubbed SDK** —
   assert the event state machine on the fast tier. · M · `promode:implementer`
   (via `discovery-to-determinism`)
8. **Implement the specified audit hooks (`AGENT-BEHAVIOURS` #6)** —
   PostToolUse/Stop/SessionStart carrying `requestId`+`sessionId`, real
   `latency_ms`. · M–L · `promode:implementer`
9. **Reference lookbook + live-refresh loop for `packages/web`** — static
   lookbook rendering every UI state against real CSS, plus `tsx watch` +
   injected reload. · M · `promode:product-design-expert` (via
   `design-system-lookbook`)
10. **READMEs for `packages/agent`, `build`, `tools-corpus`.** · M ·
    `general-purpose`
11. **`docs/decisions/` ADR store** — extract the 4 restraint decisions from PRD
    Appendix C into dated, linkable nodes. · M · `general-purpose`

### Later — lower impact / nice-to-have

12. `RUNBOOKS.md` hub (S) · eval scoreboard single source of truth, reconcile F2
    (S) · `showcase.yaml` persona field (S) · fence the 6 unimplemented tool
    schemas + reconcile `getFileResult` vs TOON (S) · hoist freshness/age math to
    one shared helper (S) · backfill `tags-audit.ts` test before trusting its CI
    gate (S) · archive/link `SESSION-PROGRESS` (S) · wire a real linter
    (biome/eslint) (S–M) · pre-commit working-tree check for web (S–M).

---

## High-confidence cross-cutting findings

Two findings surfaced independently by multiple assessors:

- **Per-request traceability** — flagged by both Observability and Architecture.
- **Freshness/age duplication** — flagged by both Architecture and Tests.

The **stale `CLAUDE.md` claim** is the fix to make first regardless — a
correctness bug in the file every agent reads first.
