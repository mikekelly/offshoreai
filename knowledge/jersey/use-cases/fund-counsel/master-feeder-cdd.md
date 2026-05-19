---
title: Master-Feeder CDD — Separate CDD for Sub-Funds?
jurisdiction: jersey
category: use-cases
persona: fund-counsel
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - fund-counsel
  - master-feeder
  - cdd
  - persona-fund-counsel
  - use-case
see_also:
  - ./index.md
  - ./cdd-fund-investors.md
---

# Master-Feeder CDD — Separate CDD for Sub-Funds?

## The question

You're operating a **master-feeder** structure. Investor X
subscribes to **Feeder Fund A**, which itself invests in
**Master Fund M**. What CDD is needed at each level?

## The short answer

In a typical master-feeder structure:

- **Investor → Feeder**: full CDD on Investor X by Feeder A;
- **Feeder → Master**: entity-level CDD on Feeder A by Master M
  (often with **reliance** on Feeder's investor-level CDD);
- **Look-through** under CRS / FATCA / beneficial-ownership
  rules typically requires identifying ultimate controlling
  persons.

**Equivalence** of CDD between feeder and master is the key
mechanism — Master can rely on Feeder's CDD provided Feeder is
itself a properly regulated entity in an equivalent jurisdiction.

## The proper answer

### The master-feeder structure

```
[Investor X] → subscribes to → [Feeder Fund A] → invests in → [Master Fund M]
```

In tax terms:

- **Feeder A** typically a corporate vehicle for tax-relevant
  investor classes (e.g. a Cayman / Jersey company for tax-
  exempt investors; a Jersey LP for US-taxable investors);
- **Master M** the principal investment vehicle aggregating
  capital across feeders.

### CDD at each level

#### Investor → Feeder

Standard CDD on Investor X by Feeder A:

- Identification, verification, beneficial-owner identification;
- Source of funds;
- PEP / sanctions screening;
- Eligibility for the Feeder's investor class.

This is the **primary CDD layer** — full diligence on every
investor.

#### Feeder → Master

Entity-level CDD on Feeder A by Master M:

- Feeder A's constitutional documents;
- Feeder A's regulators and registrations;
- Feeder A's source of funds (aggregated from its investors);
- **Reliance on Feeder's CDD** subject to equivalence.

The Master typically does **not** need to do separate
investor-level CDD if:

- Feeder is itself a **regulated entity** in an **equivalent
  jurisdiction**;
- Feeder's CDD meets **equivalent standards** to the Master's;
- **Documentation** of the equivalence is maintained.

### Look-through for transparency

CRS, FATCA, and beneficial-ownership rules may require **look-
through** to ultimate controlling persons / beneficial owners:

- **CRS**: ultimate controlling persons identified for non-FI
  investors;
- **FATCA**: US-person identification at controlling-person
  level;
- **Beneficial-ownership** registers: ultimate beneficial owners.

The look-through obligation may extend through master-feeder
even where the operational CDD is layered.

### When equivalence breaks

The "equivalence" reliance breaks where:

- **Feeder is in a non-equivalent jurisdiction** (e.g. weakly-
  regulated);
- **Feeder's regulatory status is unclear**;
- **CDD documentation isn't available** at the Master level;
- **Adverse circumstances** with specific investors require
  scrutiny.

In these cases, the Master must do its own investor-level CDD —
which can be operationally complex.

### Practical compliance

For a master-feeder structure:

- **Identify** all feeders and their regulatory statuses;
- **Establish** equivalence documentation for each;
- **Apply** the relevant CDD layers consistently;
- **Maintain** look-through records for AEoI / BO reporting;
- **Refresh** periodically.

### Specific feeder types

#### Cayman feeder

- Regulated under Cayman Mutual Funds Act;
- Generally equivalent for CDD-reliance purposes;
- Standard documentation requirements.

#### Jersey feeder

- Jersey AML rules apply directly;
- No equivalence question — same regulatory framework.

#### Luxembourg feeder

- AIFMD-regulated vehicles;
- Generally equivalent.

#### US-onshore feeder

- US AML rules apply;
- Equivalence question more complex;
- Often requires bespoke arrangements.

## What to do next

1. **Map** the master-feeder structure;
2. **Identify** each layer's CDD obligation;
3. **Establish** equivalence and reliance arrangements;
4. **Document** the CDD architecture;
5. **Implement** consistent ongoing CDD;
6. **Maintain** look-through records.

## Pitfalls

- **Assuming equivalence**: must be documented, not assumed;
- **Feeder-jurisdiction CDD weakness**: undermines the whole
  layer;
- **Look-through gaps**: AEoI / BO reporting requires reach to
  ultimate controllers;
- **New feeders**: each addition requires fresh equivalence
  analysis.

## Cross-references

- [`cdd-fund-investors.md`](./cdd-fund-investors.md)
- [`../../aml-cft/aml-cft-handbook.md`](../../aml-cft/aml-cft-handbook.md)
