---
title: Decision Surfaces — Jersey
jurisdiction: jersey
category: decision-surfaces
status: draft
last_verified: 2026-05-25
tags:
  - jersey
  - decision-surface
  - index
see_also:
  - ../index.md
  - ./trigger-events.md
---

# Decision Surfaces — Jersey

## What this section is

A small set of **cross-cutting navigation aids** that do not
fit the one-concept-per-file convention. Decision surfaces
are described in
[CONVENTIONS.md — Decision-surface content type](../../CONVENTIONS.md#decision-surface-content-type).

The rule: decision surfaces do **not** carry substantive
content. They **route**. Every claim a decision surface
implies must be backed by a concept file the decision surface
cross-references.

## Files in this section

- [`trigger-events.md`](./trigger-events.md) — catalogue of
  regulatory / personal / transactional events that should
  trigger a structuring conversation. For RM use cases (when
  to reach out to a client about restructuring) and for
  internal supervision (what events change a client's risk
  profile).

## When to write a decision surface

Add a decision surface only when:

1. The question genuinely spans multiple concepts /
   sections;
2. The same question recurs across multiple personas /
   cohorts;
3. The navigation across concept files is non-obvious from
   the doctrinal corpus alone;
4. The cost of building the decision surface is justified
   by the navigation aid it provides.

A decision surface that ends up duplicating concept-file
content is a smell — fold it back into the concept files or
into the relevant index.

## Cross-references

- [`../index.md`](../index.md) — Jersey index.
- [`../../CONVENTIONS.md`](../../CONVENTIONS.md) — see
  Decision-surface content type for the rule definition.
