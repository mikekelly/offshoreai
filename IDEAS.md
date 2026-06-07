# Ideas

Raw, not-yet-spec'd ideas. Promote to [`KANBAN_BOARD.md`](./KANBAN_BOARD.md) once
spec'd. Spec'd-and-ranked work currently lives in
[`docs/audits/2026-06-07-promode-audit.md`](./docs/audits/2026-06-07-promode-audit.md).

## From the 2026-06-07 promode audit — "Later" tier

- **`RUNBOOKS.md` hub** — one discoverable address tying together `SETUP.md`
  (build/test/typecheck/query), `packages/web/README.md` (web server),
  `.claude/commands/run-evals.md` (eval batch), and future
  `DEPLOYMENT.md`/`TENANT-ONBOARDING.md`. Link from `CLAUDE.md`.
- **Eval scoreboard, single source of truth** — a "Scoreboard" block (date,
  suite, version, score) in `EVAL-DRIVEN-PLAN.md` that other docs link to instead
  of restating numbers. Reconciles the "14 PASS/3 FAIL" vs "26/26 PASS" drift
  across `EVAL-DRIVEN-PLAN.md` / `CLAUDE.md` / `showcase.yaml`.
- **`showcase.yaml` persona field** — add `persona:`/`audience:` per question (or
  a header mapping showcase categories to the PRD §3 persona table) so the one
  feature-test layer without a persona link gets one.
- **Fence the 6 unimplemented tool schemas** in `schemas/src/corpus.ts`
  (`glossaryLookup`, `expandTags`, `neighbours`, `semanticSearch`, `inventory`,
  `getBundle`) behind a clearly-marked "NOT YET IMPLEMENTED (PRD §7.1 roadmap)"
  block; reconcile `getFileResult` schema vs the TOON the handler actually emits
  (or comment it as TOON-shape documentation).
- **Hoist freshness/age math** into one shared helper — `tools-corpus/context.ts`
  and `web-agent.ts` each define their own `ageDays`/WARN/STALE thresholds; one
  source of truth so the tool verdict and UI badge can't diverge.
- **Backfill `tags-audit.ts` test** — the `--fail` CI gate (set-diff of used tags
  vs taxonomy) has no test; mirror the `enrich-pinpoints.test.ts` pattern before
  relying on the gate to stay calibrated.
- **Archive/link `SESSION-PROGRESS-2026-05-18.md`** — root-level near-orphan;
  move to an `archive/`-style location or link from a session-log index.
- **Wire a real linter** (biome or eslint) with a `lint` script per package — the
  honest replacement for the no-op `pnpm lint` being removed now.
- **Pre-commit working-tree check for `packages/web`** — a snapshot/landmark
  assertion (e.g. "index.html still contains the Briefings Desk landmark") to
  catch the "committed a stale working tree" class of mistake (cf. `2549ff4` →
  `5af954a`) before it reaches `main`.
- **`PERSONAS.md` as a first-class node** (beyond the design persona) —
  consolidate the well-grounded-but-scattered persona evidence (TAGS.md persona
  category + PRD §3 table + the 16 use-case indexes) into one landing point.
