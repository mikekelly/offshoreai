# Done

Completed work. Spec'd-but-pending work is in [`KANBAN_BOARD.md`](./KANBAN_BOARD.md);
raw ideas in [`IDEAS.md`](./IDEAS.md).

## 2026-06-08 — promode audit "Now" tier (all 6)

From [`docs/audits/2026-06-07-promode-audit.md`](./docs/audits/2026-06-07-promode-audit.md).

- **Now-1/2 · Fix + restructure `CLAUDE.md`** — corrected the false "no
  implementation code yet / write SETUP.md when written" claims (the root node
  was lying to every agent); trimmed ~74KB of ambient corpus transclusions to
  just `@TAGS.md`; added an "Engineering quick-links" signpost block + a README
  Engineering section so SETUP/IMPLEMENTATION-PLAN/EVAL-DRIVEN-PLAN/stewardship
  PRD/design docs are reachable in one hop. _(uncommitted→committed with the docs)_
- **Now-3 · Design source-of-truth** — `docs/product/PERSONAS.md` (5 web
  personas rescued from the at-risk uncommitted worktree brief, traced to
  TAGS/PRD §3/use-cases) and `docs/product/DESIGN_SYSTEM.md` (real CSS tokens
  transcribed from `index.html`, two-layer tokens+rationale, traces up to
  personas).
- **Now-4 · Per-request traceability** — `requestId` minted at ingress, adopts
  inbound `x-request-id`, threaded client→server→`agent.stream()`, echoed to the
  client (header + first NDJSON event + console), and emitted in one structured
  stderr JSON log line (start/ok/error) keyed on it. Commit `eaa70e0`.
- **Now-5 · Agent-runtime helper tests** — 23 tests for `web-agent.ts`
  (`freshnessFor`/`ageDaysFrom` threshold edges, `buildCitationEvent`
  MISSING-citation path, `sourcesOf`/`pinpointsOf`, `CORPUS_PATH_RE`) + 10 for
  the web server's `hostAllowed` (DNS-rebinding) and `UUID_RE` (extracted to
  `packages/web/src/validation.ts`); added a `test` script to the agent package
  so `pnpm -r test` covers it. All fast/deterministic, no API. Commit `d2d2b68`.
- **Now-6 · Remove no-op `pnpm lint`** — deleted the misleading root script that
  reported success while doing nothing (no lint tooling installed). Wiring a real
  linter is tracked in `IDEAS.md`. Commit `6e1a816`.

Audit ratings at time of work: Framing **Strong** · Tests **Partial** · Knowledge
**Partial** · Architecture **Strong** · Observability **Weak** · Design **Weak** ·
Hygiene **Strong**. The Now tier targeted the three weakest (Knowledge,
Observability, Design) plus the highest-leverage Tests gap.
