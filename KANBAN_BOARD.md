# Kanban Board

Spec'd work, tracked. Raw, not-yet-spec'd ideas live in [`IDEAS.md`](./IDEAS.md);
completed work in `DONE.md`. Source of the current backlog:
[`docs/audits/2026-06-07-promode-audit.md`](./docs/audits/2026-06-07-promode-audit.md).

## Doing

- **Fix + restructure `CLAUDE.md`** (audit Now-1 + Now-2) — correct the false
  "no implementation code yet / write SETUP.md" claims; drop the three corpus
  `@`-transclusions (keep `@TAGS.md`); add an "Engineering quick-links" signpost
  block linking `SETUP.md`, `IMPLEMENTATION-PLAN.md`, `EVAL-DRIVEN-PLAN.md`,
  `PRD-corpus-stewardship-v1.md`, `docs/product/DESIGN_SYSTEM.md`,
  `docs/product/PERSONAS.md`. _Owner: `general-purpose`._
- **Capture design persona + `DESIGN_SYSTEM.md`** (audit Now-3) — rescue the
  uncommitted worktree DESIGN-BRIEF into `docs/product/PERSONAS.md`; extract the
  existing CSS tokens (`packages/web/public/index.html`) into a two-layer
  `docs/product/DESIGN_SYSTEM.md`. _Owner: `promode:product-design-expert`._
- **Per-request traceability** (audit Now-4) — mint a `requestId` at ingress
  (`handleAsk`), thread through `agent.stream()` + first NDJSON event, emit one
  structured log line (start/end/error) on both client and server keyed on it.
  _Owner: `promode:implementer`._

## Ready

- **Agent-runtime helper tests** (audit Now-5) — `web-agent.test.ts` for
  `freshnessFor`/`ageDaysFrom`/`citationEvent` MISSING-path/`sourcesOf`, plus
  `hostAllowed` + `UUID_RE` (`packages/web/src/server.ts`); add a `test` script
  to `packages/agent/package.json`. Local vitest only — **never** the eval suite
  or agent queries (those burn inference). _Held until Now-4 lands (shared files:
  `server.ts`, `web-agent.ts`). Owner: `promode:implementer`._

### Next (higher effort)

- **Deterministic seam test** — drive `agent.stream()` with a stubbed SDK
  `query`; assert the event state machine (revise→reject→new-draft,
  verify_error→unavailable, resume). _via `discovery-to-determinism`._
- **Audit hooks (AGENT-BEHAVIOURS #6)** — PostToolUse/Stop/SessionStart carrying
  `requestId`+`sessionId`, real `latency_ms`.
- **Lookbook + live-refresh loop** for `packages/web` — static lookbook of every
  UI state + `tsx watch`/injected reload. _via `design-system-lookbook`._
- **READMEs** for `packages/agent`, `packages/build`, `packages/tools-corpus`.
- **`docs/decisions/` ADR store** — the 4 restraint decisions from PRD Appendix C.

## Done

_See `DONE.md` once items complete._
