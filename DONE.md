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

## 2026-06-08 — promode audit "Next" tier (all 5)

- **Next-1 · Deterministic seam test** — `packages/agent/test/stream.test.ts`
  drives `agent.stream()` with a stubbed SDK (`queryFn`/`runVerifier` injection
  seam added to `web-agent.ts`); 9 cases assert the event state machine
  (draft→done, revise→rejected-draft→fresh-draft, retries-exhausted,
  verify_error→unavailable, session emission + resume, error path). Perturbation
  check confirms the seam is load-bearing. Commit `472c6eb`.
- **Next-2 · Audit-logging hooks (AGENT-BEHAVIOURS #6)** — `packages/agent/src/audit.ts`:
  SDK PostToolUse / SessionStart / SessionEnd hooks + a stream-loop verdict audit,
  emitting single-line `kind:"audit"` JSON to stderr keyed on `requestId` +
  `session_id`, with real `latency_ms` and a SHA-256 `input_hash` (raw input never
  logged). Pure `buildAuditRecord` unit-tested (7 cases). Commit `5f66921`.
- **Next-3 · Lookbook + live-refresh loop** — `docs/product/lookbook/` renders
  every UI state against the app's real CSS (extracted live from `index.html`, so
  it can't drift), with a Node-only SSE live-reload server
  (`pnpm --filter @offshoreai/web lookbook`). Zero API calls to use. Commit `4657560`.
- **Next-4 · Package READMEs** — orientation docs for `packages/agent`,
  `packages/build`, `packages/tools-corpus`, matching the web/schemas bar, each a
  graph node with up-links. Commit `5c4fd7e`.
- **Next-5 · ADR store** — `docs/decisions/` hub + 4 dated ADRs (no MCP-wrapping,
  no output Zod, no custom-CLI agent surfaces, TS-over-Python), each sourced from
  PRD Appendix C / revision history. Commit `eac84ba`.

Post-tier integration: `pnpm typecheck` clean across 5 packages; full vitest
suite **149 passing** (build 19, tools-corpus 54, agent 39, web 37).
Dimensions moved: Observability Weak→addressed, Design Weak→addressed, Tests
Partial→strengthened, Knowledge Partial→strengthened.
