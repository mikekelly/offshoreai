---
title: AML/CFT Handbook — Identification and Beneficial Ownership
jurisdiction: jersey
category: aml-cft
status: draft
last_verified: 2026-05-25
tags:
  - aml-cft
  - jersey
  - aml-handbook
  - jfsc
  - regulator-guidance
  - cdd
  - beneficial-ownership
  - wealth-manager-relevance
sources:
  - title: JFSC AML/CFT Handbook
    url: https://www.jerseyfsc.org/industry/aml-cft-handbook/
    accessed: 2026-05-25
    kind: regulator-guidance
see_also:
  - ./amlh-cdd.md
  - ./amlh-customer-types.md
  - ./aml-cft-handbook.md
  - ../registries/fs-dpi-law-2020.md
---

# AML/CFT Handbook — Identification and Beneficial Ownership

Identifying the customer and the beneficial owner is the
**first operational step** of CDD. The discipline of doing
this thoroughly — particularly the beneficial-owner trace
through complex structures — distinguishes a competent CDD
programme from one that will fail thematic-review scrutiny.

## Two questions, two answers

CDD requires answering two distinct questions:

1. **Who is the customer?** — the immediate counterparty
   entering into the relationship with the regulated
   business;
2. **Who is the beneficial owner?** — the natural person(s)
   ultimately owning or controlling the customer (or, where
   no natural person meets the test, the senior managing
   official).

For an individual customer, the two answers are the same:
the customer **is** the natural-person beneficial owner.
For corporate customers, trust customers, partnership
customers, and other complex structures, the answers
diverge — and the harder discipline is the second.

## Identifying the customer

For a natural person:

- **Full name** (including any prior names);
- **Date and place of birth**;
- **Residential address**;
- **Nationality and citizenship**;
- **Identity number** (passport / national ID).

For a legal person:

- **Legal name** and any trading names;
- **Legal form** (company / partnership / foundation /
  trust);
- **Place of incorporation / formation**;
- **Registered office**;
- **Registration number**;
- **Constitutional documents** (articles, memorandum, trust
  deed, partnership agreement, charter);
- **Directors / officers / equivalent governing body**;
- **Authorised signatories** for the relationship.

## Identifying the beneficial owner — the 25% test

The standard rule under the
[Money Laundering Order 2008](./money-laundering-order-2008.md)
and the Handbook: a beneficial owner is any natural person
who **directly or indirectly owns or controls 25% or more**
of the customer entity, or who otherwise exercises control
through other means.

The threshold is identical to the FSDI Law 2020 beneficial-
ownership register threshold (see
[`../registries/fs-dpi-law-2020.md`](../registries/fs-dpi-law-2020.md)).

### Working through layers

For multi-layered structures, the trace goes through every
layer until natural persons are reached:

```
Customer (Jersey company)
  ↓
Holding company (BVI)
  ↓
Trust (Cayman)
  ↓
Settlor / beneficiaries / trustees (natural persons)
```

At each layer, the natural-person ownership / control
positions are identified and the 25% threshold reassessed.
A natural person owning 50% of the BVI company that owns
60% of the Jersey customer is **30% indirect beneficial
owner** of the customer (50% × 60% = 30%) — above the
threshold.

### Where no natural person meets the threshold

The Handbook recognises that some structures have **no
natural person at 25%+** — e.g. a widely-held listed company,
a discretionary trust with broad beneficiary class, a multi-
contributor charitable structure. In these cases the
Handbook expects identification of:

- **The senior managing official** of the customer entity
  (where corporate) — typically the CEO / Chair / equivalent;
- **The trustee** of the trust (already identified as part
  of trust CDD);
- **The council** of a foundation (already identified as
  part of foundation CDD).

This is the **fallback identification** — not optional, not
a "no beneficial owner" answer.

### Control beyond ownership

The 25% test captures ownership-based beneficial ownership.
The "other means" extension captures control patterns that
do not flow through formal ownership:

- **Voting agreements** between shareholders;
- **Veto rights** held by a minority shareholder;
- **Protector / appointor** powers in a trust where the
  protector / appointor can change beneficiaries or remove
  trustees;
- **Significant economic interest** through structuring
  arrangements that do not appear in the formal cap table;
- **Family-relationship control** patterns where formal
  ownership is distributed but actual control is
  concentrated.

The Handbook expects the regulated business to **look
through formal ownership to actual control** — particularly
for complex family structures and for arrangements designed
to keep formal ownership below the threshold.

## Verification standards

Identification is one thing; **verification** is another.
The Handbook expects verification on **reliable and
independent evidence**:

### For natural persons

- **Passport** or government-issued photo ID;
- **Address verification** through utility bill, bank
  statement, government document (typically within prescribed
  age — e.g. within three months);
- **Both documents** — the Handbook generally expects two
  forms of verification, not one.

### For legal persons

- **Registry extract** (certified) from the home registry;
- **Constitutional documents** (certified copies);
- **Directors' / officers' list** with verification of
  identity for each (or the principal subset);
- **Recent annual filings** demonstrating ongoing existence.

### Electronic verification

The Handbook permits electronic verification (database-
checks, electronic-ID systems) subject to the verifier being
reliable, the data being current, and the overall
reliability standard being met. For higher-risk customers,
electronic verification may be supplemented with documentary
verification.

### Certified copies

For non-original documents, the Handbook typically expects
certification by a **trusted intermediary** — lawyer,
notary, regulated trust company, accountant — with the
certification dated, signed, and specifying the certifying
person's capacity.

## Common identification failure points

JFSC enforcement and thematic-review themes:

- **Beneficial-owner trace stopping at the immediate
  entity** rather than working through to natural persons;
- **Senior managing official identification skipped** where
  no natural person meets the 25% threshold;
- **Control patterns missed** — formal ownership below 25%
  treated as conclusive without examining actual control;
- **Verification documents stale** — initial verification at
  onboarding never refreshed;
- **Certified copies inadequately certified** — the
  certification does not meet Handbook standards;
- **Electronic verification over-relied upon** for higher-
  risk customers;
- **Trust beneficial-owner identification** weak — settlor /
  trustees / protector / named beneficiaries / class of
  objects all required.

## Particular identification scenarios

### Jersey trust customer

For a Jersey trust customer, identification covers:

- The **settlor** and any **contributor** of property;
- The **trustees** (and, for corporate trustees, the
  controllers of the trustee);
- The **protector** if appointed;
- The **enforcer** for a non-charitable purpose trust;
- The **named beneficiaries** and any **default
  beneficiaries**;
- The **class of objects** of discretionary classes
  (identified at class level if beneficiaries are not
  individually named at trust establishment).

See [`amlh-customer-types.md`](./amlh-customer-types.md)
for the type-specific framework.

### Foreign trust customer

Similar to Jersey trust, but the **trustee identification**
includes verification of the foreign trustee's regulated /
unregulated status, and the **letter of wishes** or
equivalent guidance documents may be sought for
understanding the trust's purpose.

### Foundation customer

For a Jersey foundation:

- The **founder**;
- The **council members** (with the regulated qualified
  member identified);
- The **guardian** if appointed;
- The **beneficiaries** or class of objects.

### Cell company customer

For a PCC or ICC, identification operates at:

- The **core / company** level;
- The **specific cell** level (the cell is the customer for
  most CDD purposes);
- The **cellular assets and liabilities** are tracked
  separately.

### Nominee shareholder arrangements

Where a customer's shareholder of record is a nominee, the
**underlying beneficial owner** behind the nominee is the
identification target. Nominee documentation, declarations
of beneficial ownership, and direct evidence of the
underlying person are required.

## Cross-references

- [`./amlh-cdd.md`](./amlh-cdd.md) — CDD section index.
- [`./amlh-customer-types.md`](./amlh-customer-types.md) —
  type-specific identification.
- [`./aml-cft-handbook.md`](./aml-cft-handbook.md) — hub.
- [`./mlo-part-3-cdd.md`](./mlo-part-3-cdd.md) — underlying
  MLO 2008 CDD provisions.
- [`../registries/fs-dpi-law-2020.md`](../registries/fs-dpi-law-2020.md)
  — beneficial-ownership register parallel.

## Status

Draft.
