# Kanban Board

Spec'd work, tracked. Raw, not-yet-spec'd ideas live in [`IDEAS.md`](./IDEAS.md);
completed work in [`DONE.md`](./DONE.md). Source of the current backlog:
[`docs/audits/2026-06-07-promode-audit.md`](./docs/audits/2026-06-07-promode-audit.md).

## Doing

_(nothing in flight)_

## Ready

The audit **Next** tier (higher effort). Pull from the top.

- **Deterministic seam test** — drive `agent.stream()` with a stubbed SDK
  `query`; assert the event state machine (revise→reject→new-draft,
  verify_error→unavailable, resume). Moves wiring guarantees off the slow,
  API-billed eval suite onto the fast tier. _via `discovery-to-determinism`;
  `promode:implementer`._
- **Audit hooks (AGENT-BEHAVIOURS #6)** — PostToolUse/Stop/SessionStart carrying
  `requestId`+`sessionId`, real `latency_ms` (the `requestId` is already threaded
  to the agent layer — DONE-4 made it available). _`promode:implementer`._
- **Lookbook + live-refresh loop** for `packages/web` — static lookbook of every
  UI state (4 verdict states, freshness badges, disclosures) rendering the real
  CSS, + `tsx watch`/injected reload. Builds on the now-existing
  `docs/product/DESIGN_SYSTEM.md`. _via `design-system-lookbook`;
  `promode:product-design-expert`._
- **READMEs** for `packages/agent`, `packages/build`, `packages/tools-corpus`
  (match the bar of the web/schemas READMEs). _`general-purpose`._
- **`docs/decisions/` ADR store** — the 4 restraint decisions from PRD Appendix C
  (no MCP-wrapping, no output Zod, no custom CLIs, TS-over-Python). _`general-purpose`._

## Done

See [`DONE.md`](./DONE.md). The audit **Now** tier (all 6) is complete.
