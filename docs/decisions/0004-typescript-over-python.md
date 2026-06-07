# 0004 — TypeScript over Python as the primary implementation language

- **Status:** Accepted
- **Date:** 2026-06-08 — captured from PRD revision history (the switch
  "from Python to TypeScript as primary" was made during PRD revision; the
  decision predates this capture).

## Context

The Claude Agent SDK ships in both Python and TypeScript, and the two are
at feature parity for this project's needs. An early PRD direction assumed
Python; structural pushback during revision switched the primary
implementation language to TypeScript. This ADR records that switch and its
rationale.

## Decision

**Use TypeScript as the primary implementation language** for the agent
runtime, tools, schemas, and build pipeline. Reasoning, per PRD §12 / §1:

- **Type-sharing end-to-end** — a single Zod schema defines the SDK tool
  input, any arg parser, and (in v1.1) the frontend request type. Writing
  the function once with proper types lets both invocation surfaces derive
  from it. (This is what makes ADR 0001 and 0002 cheap to honour in TS.)
- **The TS SDK bundles a native Claude Code binary** as an optional dep —
  one fewer install step than the Python SDK, zero-config on first run.
- **Enterprise integration SDKs** for the future `tenant-systems-mcp`
  connectors (Microsoft Graph, Salesforce JSforce, DocuSign, Adobe Sign,
  Okta, Microsoft 365) are all TS/JS-first; the Python equivalents are
  thinner and often community-maintained.
- **Serverless / edge story** for white-label tenant deployments (Fly
  Machines on Node/Bun, Cloudflare Workers with Durable Objects, Vercel
  Functions) has a much better cold-start and image-size profile than
  Python.
- **MCP server ecosystem is TS-first** — adding tenant-systems connectors
  is more likely to mean importing existing TS MCP servers than rolling
  Python ones.
- **Frontend symmetry** when v1.1 adds a chat UI — share Zod schemas
  between agent and React/Next.js, no protobuf or OpenAPI generators.

## Consequences

- The workspace is a TypeScript pnpm monorepo (`packages/`): agent runtime,
  corpus tools, schemas, and build pipeline are all TS.
- **Accepted tradeoff:** if v2 explores RL-style learned memory management
  (the Yu et al. AgeMem direction), we either bridge to a Python subprocess
  or accept thinner libraries. The one-off corpus-summarisation build batch
  is TS in v1; if it ever needs heavier text-analysis tooling it may be
  carved out as a **Python sidecar** invoked from the build pipeline.
  Neither is a v1 concern.
- The PRD warns that any section still assuming Python or describing a
  custom Python CLI surface is a "missed sweep" to be flagged, not a live
  alternative.

## Sources

- [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) §12 ("Choose
  TypeScript as the primary") with the full reasoning list; §1 (runtime
  choice) and §12 tech-stack table (Agent SDK row).
- [`CLAUDE.md`](../../CLAUDE.md) — revision-history note listing "switch
  from Python to TypeScript as primary" among the structural-pushback
  outcomes; and the note that the PRD reflects those revisions.
