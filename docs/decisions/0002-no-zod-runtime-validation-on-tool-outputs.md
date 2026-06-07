# 0002 — No Zod runtime validation on tool outputs

- **Status:** Accepted
- **Date:** 2026-06-08 — captured from PRD Appendix C / revision history
  (one of the structural pushback items: "no Zod runtime validation on
  outputs").

## Context

Every tool carries a Zod schema. The natural instinct is to validate both
sides of the call — inputs *and* outputs — at runtime. But the two sides
are not symmetric:

- **Inputs** are untrusted: they are arguments the agent supplies. Runtime
  validation there does real work, catching malformed agent calls at the
  point they enter our code.
- **Outputs** are values **we own**: they are produced by our own handler
  functions. Re-validating data we just constructed buys nothing at runtime
  — it is a tax with no untrusted source to police.

What the agent actually consumes on the output side is **TOON text** in
`content[0].text`, not validated JSON. The agent's normal reading path
never sees JSON at all; JSON is emitted only by the future MCP wrapper
(where MCP convention requires it in `structuredContent`) and by
`JSON.stringify` in tests/debugging.

## Decision

**Do not run Zod validation on tool outputs.** On the input side Zod is
genuine runtime validation; on the output side it is a **build-time shape
declaration only**.

The output schema (`<tool>Result`) still earns its place as documentation
and tooling input, used for:

- `z.infer` to derive the TypeScript return type (`<tool>ResultType`);
- deriving the TOON header field list from `Object.keys(<tool>Result.shape)`
  (lifted to a module-level constant) so the renderer can't drift from the
  type, with zero schema-introspection cost on the hot path;
- round-tripping test fixtures;
- generating the future MCP server's `outputSchema` from the same source.

## Consequences

- The schemas package (`@offshoreai/schemas`) documents the
  input/output/description triple per tool, but only `<tool>Input` is wired
  to runtime validation. `<tool>Result` is a typed shape declaration.
- The TOON renderer reads field names from the result shape at module load,
  not per call — the contract stays single-sourced without runtime cost.
- This is **schemas-as-documentation**: a reviewer can read the contract,
  the type system enforces it at build time, and validation effort is
  concentrated where untrusted data actually enters (the input layer).

## Sources

- [`packages/schemas/README.md`](../../packages/schemas/README.md) — "Why
  Zod for outputs at all, given no runtime validation" and the
  `<tool>Result` description ("No runtime output validation — we own the
  values").
- [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) §7.0.2 (output
  discipline; validation lives on the input side) and §12 (the
  type-sharing rationale: "On the output side we own the values, so Zod
  degrades to a build-time shape declaration only … but not validated at
  runtime").
- [`CLAUDE.md`](../../CLAUDE.md) — revision-history note listing "no Zod
  runtime validation on outputs" as a structural-pushback outcome.
