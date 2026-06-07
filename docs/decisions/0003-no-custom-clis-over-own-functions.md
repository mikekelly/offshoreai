# 0003 — No custom CLIs over our own functions as agent surfaces

- **Status:** Accepted
- **Date:** 2026-06-08 — captured from PRD Appendix C / revision history
  (one of the structural pushback items: "no custom CLIs over own
  functions").

## Context

Early PRD drafts proposed custom CLIs (`corpus`, `memory`, `register`,
`primary-source`) for the agent to invoke through Bash. The question that
surfaced during revision was "why were we building custom CLIs for the
agent to invoke through Bash when those CLIs are just shells over functions
we also call directly from the SDK?"

For an agent we control calling logic we own, a custom-CLI mirror is
indirection with real cost:

- subprocess spawn on every call;
- argv string-marshalling (every parameter through string and back);
- stdout capture;
- exit-code-vs-`isError` translation;
- a separate code path to test and maintain;
- a parsing failure surface the typed SDK lane simply doesn't have.

The supposed upside — Bash-pipe composability between our own commands — is
weak: sequencing typed SDK tool calls has no expressive loss and no parsing
failure modes.

## Decision

**Do not ship custom CLIs over our own functions as agent-facing
surfaces.** Typed in-process SDK tools are the agent's surface for the
common path; standard pre-existing shell tools (`rg`, `jq`, `sed`, `awk`,
`gh`, `git`) via the sandboxed Bash tool serve the genuine long tail (the
agent already knows these from training — we leverage that lane, we don't
add to it).

A custom CLI earns its keep only when a consumer **beyond our own agent**
(humans, CI, third-party integrations) genuinely needs shell composability
— a v1.1+ distribution play, not a v1 agent surface.

## Consequences

- The agent has **no** bespoke `corpus`/`memory`/`register` CLI to invoke;
  it calls the typed SDK tools directly.
- **Sanctioned exception — engineer/CI-facing CLIs are fine** because they
  are not agent surfaces:
  - `packages/build/src/cli.ts` (and the build pipeline, `pnpm
    build:corpus`) — runs on every PR via GitHub Actions; convention/health
    checks gate merge.
  - `packages/agent/src/query-cli.ts` — a minimal engineer-facing dispatch
    CLI that kicks off the SDK agent and writes `answer.md` +
    `trajectory.json`; its header explicitly states it is "an
    engineer-facing dev CLI, not an agent-facing surface" (per
    AGENT-PRINCIPLES Principle 21). The agent itself uses the in-process
    tools, not this CLI.
  - Other developer commands such as `pnpm replay <session_id>` are
    explicitly engineer-facing, not agent-facing.
- `commander` may appear for these engineer-facing commands; it never backs
  an agent-facing surface.

## Sources

- [`PRD-baseline-agent-v1.md` Appendix C](../../PRD-baseline-agent-v1.md)
  — "Why neither MCP nor a custom CLI is the right default for our own
  logic" and the surface table ("Custom CLI: None in v1"); also §4.3,
  §7.0, and §12 (CLI-framework row: none for agent-facing tools).
- [`CLAUDE.md`](../../CLAUDE.md) — "Don't add invocation surfaces over code
  we own" and the revision-history note.
- `packages/agent/src/query-cli.ts` and `packages/build/src/cli.ts` — the
  sanctioned engineer/CI-facing CLIs, with the query-CLI header citing
  AGENT-PRINCIPLES Principle 21.
