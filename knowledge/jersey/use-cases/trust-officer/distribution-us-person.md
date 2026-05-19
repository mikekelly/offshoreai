---
title: Distribution to a US-Person Beneficiary — What to Flag
jurisdiction: jersey
category: use-cases
persona: trust-officer
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - trust-officer
  - distributions
  - us-tax
  - us-person
  - throwback-tax
  - pfic
  - persona-trust-officer
  - use-case
see_also:
  - ./index.md
  - ./distribution-uk-resident.md
---

# Distribution to a US-Person Beneficiary — What to Flag

## The question

A beneficiary of a Jersey trust is a **US person** (US citizen,
green-card holder, or US-resident under the substantial-presence
test). You're about to make a distribution. What US-tax issues
should you flag?

## The short answer

A distribution from a Jersey trust to a US-person beneficiary
typically engages **US tax** at potentially **severe** rates:

- **Throwback tax** on accumulated income distributions (high
  effective rates with interest charges);
- **PFIC** issues on underlying investments (mark-to-market
  alternative regimes);
- **Form 3520 / 3520-A** reporting on distributions and trust
  ownership (substantial penalties for failure);
- **FATCA / CRS** reporting at the trust level;
- **Trust classification** as **foreign grantor trust (FGT)**
  vs **foreign non-grantor trust (FNGT)** drives the tax
  treatment.

The Jersey trustee has **no US tax** but must alert the US-
beneficiary and provide information for their US filings.

## The proper answer

### FGT vs FNGT classification

The first question is whether the trust is a **foreign grantor
trust (FGT)** or **foreign non-grantor trust (FNGT)** under US
tax rules:

- **FGT**: typically where a **US-person settlor** with
  retained power, or specific US-tax rules apply. Trust income
  is taxed to the **grantor** (settlor) regardless of who
  receives distributions.
- **FNGT**: most Jersey trusts settled by non-US persons.
  Trust income accumulates within the trust; distributions to
  US-person beneficiaries trigger US tax under the **DNI** and
  **UNI** rules.

### The throwback tax (FNGT distributions)

For FNGT distributions to US-person beneficiaries from
**accumulated income** (UNI — undistributed net income):

- Tax computed at the **highest US individual rate** in the
  years the income was earned;
- **Interest charge** on top, dating back to the year of
  accumulation;
- Effective rate can be **70%+** for long-accumulated income;
- Effectively **eliminates** the deferral benefit of accumulating
  in a foreign trust.

This is one of the harshest US-tax outcomes in the system.

### PFIC issues

If the trust holds **non-US mutual funds / investment funds**
(or shares in companies classified as PFICs):

- US-person beneficiaries can face **PFIC** taxation on the
  underlying;
- **QEF election** or **mark-to-market election** can mitigate
  but require advance setup;
- Default PFIC taxation is **punitive** with throwback-style
  interest charges.

### Form 3520 / 3520-A

US persons must file:

- **Form 3520**: receipt of distributions from foreign trust,
  receipt of foreign gifts above thresholds;
- **Form 3520-A**: annual reporting by the trust (or by the
  US-grantor-beneficiary if the trust doesn't file).

Failure-to-file penalties are **severe** (35% of distribution
or asset amounts, with minimum amounts).

### FATCA at the trust level

Separately, the trust itself is likely a **Foreign Financial
Institution (FFI)** under FATCA:

- **Identifies** US-person beneficiaries / controllers;
- **Reports** to Revenue Jersey under the Jersey-US IGA;
- Revenue Jersey forwards to **IRS**.

### Practical flagging

When proposing a distribution to a US-person beneficiary:

- **Confirm** US-person status and current US tax position;
- **Classify** the trust (FGT vs FNGT);
- **Compute** DNI / UNI position for FNGT distributions;
- **Identify PFIC** exposure in underlying assets;
- **Provide** information for Form 3520 / 3520-A;
- **Strongly recommend** US tax adviser engagement.

## What to do next

1. **Confirm** US-person status with documentation;
2. **Compute** DNI / UNI / accumulation history of the trust;
3. **Identify** PFIC holdings in trust portfolio;
4. **Coordinate** with the beneficiary's US tax adviser before
   distribution;
5. **Provide** the documentation needed for Form 3520 filings;
6. **Make the distribution** with full trustee documentation.

## Pitfalls

- **Long-accumulated income** distributions can be near-
  confiscatory after throwback tax — sometimes deferring is
  better than distributing;
- **PFIC surprise** — settlors often don't realise the
  investments inside the trust trigger PFIC issues;
- **Form 3520 deadlines** — penalties for late filing are
  extreme;
- **FGT misclassification** — getting this wrong can produce
  decades of incorrect tax filings.

## Cross-references

- [`distribution-uk-resident.md`](distribution-uk-resident.md) —
  UK counterpart.
- [`../../international/fatca.md`](../../international/fatca.md) —
  FATCA framework.
