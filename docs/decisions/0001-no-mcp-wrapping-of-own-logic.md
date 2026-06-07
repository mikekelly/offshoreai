# 0001 — No MCP-wrapping of our own logic

- **Status:** Accepted
- **Date:** 2026-06-08 — captured from PRD Appendix C / revision history
  (the decision itself predates capture; it emerged from the PRD's "several
  rounds of structural pushback").

## Context

When you control both the agent loop and the tool implementation, there is
a standing temptation to expose every toolset as an MCP server — the
question raised in early PRD drafts was "why was every toolset wrapped in
an MCP server when we control both the agent and the tool?"

For logic that lives in our own Node process alongside the agent loop, MCP
wrapping is pure indirection, and it is not free:

- three schema representations for one logical function (TS function
  signature, MCP JSON schema, agent-facing schema);
- JSON-RPC serialisation on every call, including trivial reads;
- a separate process to start, monitor, restart, and observe;
- stack traces that don't cross the boundary, making debugging harder;
- always-resident schema tokens even for tools the agent never calls this
  session.

The Claude Agent SDK already supports in-process custom tool registration:
a function with a Zod input schema returning a `CallToolResult` whose
`content[0].text` reaches the agent verbatim — the same typed, validated,
schema-bearing surface with none of the boundary cost. The only legitimate
reason we considered an MCP/CLI lane (always-resident schema bloat) is
handled by the SDK's first-party tool-search feature.

## Decision

**Do not wrap our own in-process logic in an MCP server.** In-process SDK
custom tool registration is the default surface for the agent. MCP earns
its keep only at a **real cross-process / cross-language / cross-org
boundary** — e.g. per-tenant external systems we do not own
(`tenant-systems-mcp`).

A **future** MCP wrapper around our own logic is permitted only when an
actual boundary appears: migration to Anthropic-hosted Managed Agents (the
hosted sandbox can't import our TS), a customer wanting our corpus inside
their own Claude Code / Cursor / in-house tool, or a third-party team
embedding our domain expertise in their agent. Such a wrapper is mechanical
(auto-generated from the same Zod schemas, ~10 lines per tool) and built
*then*, not pre-emptively.

## Consequences

- The production runtime registers corpus tools in-process via the SDK
  (`register.ts`), not over a process boundary.
- **Sanctioned exception:** `packages/tools-corpus/src/mcp-stdio.ts` is a
  standalone stdio MCP server exposing the same tool definitions to
  third-party SDK hosts that load tools only via a project-scoped
  `.mcp.json` and have no hook for in-process registration (e.g. a generic
  SDK web UI / Claude Code / Cowork). This is a delivery adapter across a
  host boundary we don't control; it reuses the **same** `makeXTool`
  definitions, duplicates no logic, and leaves the in-process path
  untouched. It is the boundary-crossing case the decision allows, not a
  violation of it.
- When `structuredContent` is eventually needed for machine consumers, the
  `CallToolResult` shape lets one backing function populate both `content`
  (TOON) and `structuredContent` (JSON) from the same source.

## Sources

- [`PRD-baseline-agent-v1.md` Appendix C](../../PRD-baseline-agent-v1.md)
  — "The architectural restraint principle (the indirection question)";
  also §4.3 and the §1 runtime-choice discussion.
- [`CLAUDE.md`](../../CLAUDE.md) — "Don't add invocation surfaces over code
  we own" (repository conventions) and the revision-history note.
- `packages/tools-corpus/src/mcp-stdio.ts` — the sanctioned adapter, with
  its own architectural note citing AGENT-PRINCIPLES #9 / PRD Appendix C.
