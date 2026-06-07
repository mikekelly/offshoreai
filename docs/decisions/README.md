# Architecture Decision Records

This directory is the repository's **decisions store**: a set of dated,
individually-linkable nodes capturing the load-bearing architectural
decisions that govern how the agent and its tooling are built.

## What an ADR is here

An ADR records **one decision** — its context (the failure mode or
temptation it guards against), the decision itself, and the consequences
that follow. It is a durable, citable node so that "why did we decide X?"
is answerable at the point of decision, rather than requiring a reader to
know to open a specific PRD appendix.

These ADRs **formalise existing decisions**; they do not invent them. Each
of the four below already lived as prose — most densely in
[`PRD-baseline-agent-v1.md` Appendix C](../../PRD-baseline-agent-v1.md)
(the architectural restraint principle) — and was reached through "several
rounds of structural pushback" during PRD revision. Capturing them here
makes them survive PRD churn: the PRD can be re-sectioned or rewritten
without dislodging the decision record.

## Format

Each ADR uses a standard lightweight template:

- **Title** — the decision, stated as a position.
- **Status** — `Accepted`, `Superseded by NNNN`, `Deprecated`, etc.
- **Date** — when the decision was captured into this store, with a note
  on its provenance (these four were captured from the PRD revision history,
  not freshly decided).
- **Context** — the situation, and the failure mode / temptation the
  decision guards against.
- **Decision** — what we decided.
- **Consequences** — what follows, including the sanctioned exceptions.
- **Sources** — where the rationale was previously documented.

New ADRs get the next sequential number and never reuse a retired number.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](./0001-no-mcp-wrapping-of-own-logic.md) | No MCP-wrapping of our own logic | Accepted |
| [0002](./0002-no-zod-runtime-validation-on-tool-outputs.md) | No Zod runtime validation on tool outputs | Accepted |
| [0003](./0003-no-custom-clis-over-own-functions.md) | No custom CLIs over our own functions as agent surfaces | Accepted |
| [0004](./0004-typescript-over-python.md) | TypeScript over Python as the primary implementation language | Accepted |

ADRs 0001–0003 are facets of the single **architectural restraint
principle** in PRD Appendix C ("don't add invocation surfaces over code we
own and an agent we control"); 0004 is the language choice made in the same
revision sweep.
