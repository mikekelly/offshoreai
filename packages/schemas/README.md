# @offshoreai/schemas

Per-tool Zod input/output schemas and the §7.0.3 five-part descriptions
for every tool the v1 agent exposes. This is the **contract** between
the agent and the typed SDK tool surface.

**Status: published workspace package.** Started life under `schemas/`
at the repo root as a design artefact; promoted to `packages/schemas/`
at the start of week 3 once the handlers in `packages/tools-corpus/`
needed to import from it. Consumers import via:

```ts
import { getFileInput, getFileResult, getFileDescription } from "@offshoreai/schemas/corpus";
```

---

## Layout

```
packages/schemas/
├── README.md            ← this file
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts             ← barrel re-export
    ├── common.ts            ← shared types (Tag, FilePath, Status, FreshnessVerdict, ErrorEnvelope, …)
    ├── corpus.ts            ← 11 tools per PRD §7.1
    ├── memory.ts            ← 7 tools per PRD §7.4 (per-tenant A-Mem)
    ├── primary-source.ts    ← 1 tool per PRD §7.2 (cached fetch + last-modified)
    ├── register.ts          ← 3 tools per PRD §7.3 (JFSC, companies, charities)
    └── eval-trajectory.ts   ← trajectory + batch-summary shapes for the eval runner
```

Each per-namespace file exports, for every tool:

- `<tool>Input` — Zod schema, used at runtime for input validation (PRD §7.0.2: validation lives on the input side, where the agent's untrusted arguments enter).
- `<tool>Result` — Zod **shape declaration** for the typed return value. No runtime output validation (we own the values; the schema's job is to drive the TOON field-list and the type alias).
- `<tool>ResultType` — TypeScript alias via `z.infer<typeof <tool>Result>`.
- `<tool>Description` — the §7.0.3 five-part description string the SDK tool registration uses.

This split keeps the file scannable for reviewers checking the contract,
and it gives the handler module exactly one import line per tool.

---

## What every description must cover (PRD §7.0.3)

Every `<tool>Description` is structured around these five parts. None is
optional. PR review against this directory must enforce all five present,
≥ 60 words total, and at least one reference to a sibling tool by name:

1. **Core purpose** in domain terms.
2. **When to use** in concrete situations.
3. **When NOT to use**, especially against overlapping tools.
4. **Relationships and ordering** with sibling tools.
5. **What the result looks like and what to do with it.**

A description that fails any of these is a footgun the moment a second
overlapping tool exists. The §11.2 conformance gate enforces this on PR.

---

## What lives elsewhere

- **Output rendering (TOON)** — `packages/tools-corpus/src/render/toon.ts` once the package lands. The renderer reads field names from `Object.keys(<tool>Result.shape)` lifted to a module-level constant, so the hot path has zero schema introspection cost.
- **SDK tool registration** — `packages/tools-corpus/src/sdk-register.ts` etc. It imports `<tool>Input`, `<tool>Description`, and the handler function, then calls the SDK's `tool(...)` factory.
- **MCP wrapper** (future v2 only) — published automatically from the same Zod schemas per PRD §7.6 and Appendix C; mechanical, ~10 lines per tool.

---

## Why Zod for outputs at all, given no runtime validation

Per PRD §7.0.2: on the input side Zod is genuine runtime validation
(untrusted agent arguments). On the output side Zod is a **build-time
shape declaration only** — useful for:

- `z.infer` to derive the TypeScript return type.
- Deriving the TOON header field list from `Object.keys(shape)` so the
  renderer doesn't drift from the type.
- Round-tripping test fixtures.
- Generating the future MCP server's `outputSchema` from the same source.

It is **not** validated at runtime on the output side — we own the values.

---

## Description discipline conformance check (week-3 deliverable)

A vitest matcher will assert, on every PR that touches this directory:

- `<tool>Description` exists for every exported tool input.
- Word count ≥ 60 (the empirical floor below which descriptions become
  too vague to disambiguate against siblings).
- Mentions at least one sibling tool name (the "relationships" part).
- Contains the substrings `Do NOT` or `Don't use` (the "when NOT to use"
  part — exact wording flexible, presence required).

PRs failing the check don't merge. Wrong-tool-call telemetry from §11.3
triggers description rewrites, not system-prompt patches.
