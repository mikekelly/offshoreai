---
title: AML/CFT Handbook — EDD Triggers in Detail
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
  - edd
  - wealth-manager-relevance
sources:
  - title: JFSC AML/CFT Handbook
    url: https://www.jerseyfsc.org/industry/aml-cft-handbook/
    accessed: 2026-05-25
    kind: regulator-guidance
see_also:
  - ./amlh-edd.md
  - ./amlh-peps.md
  - ./amlh-high-risk-countries.md
  - ./amlh-risk-assessment.md
---

# AML/CFT Handbook — EDD Triggers in Detail

EDD (enhanced due diligence) is **mandatory** for specific
customer / relationship categories under the
[Money Laundering Order 2008 Article 15](./mlo-article-15.md)
and the JFSC AML/CFT Handbook. This file goes through the
triggers in operational detail — when each applies, what
practical question pattern surfaces it, and how the trigger
interacts with the rest of the EDD discipline.

For the EDD discipline itself (what additional measures
apply once triggered), see
[`./amlh-edd.md`](./amlh-edd.md). For source-of-wealth
specifically (the load-bearing piece), see
[`./amlh-edd-source-of-wealth.md`](./amlh-edd-source-of-wealth.md).

## The seven mandatory triggers

### 1. PEPs, family members, and known close associates

**The most demo-relevant trigger** for wealth-management
businesses with international customer flow.

The PEP-regime trigger captures **foreign, domestic, and
international-organisation PEPs**, plus their **family
members** (spouse, children, parents — the exact list per
the Handbook's current edition) and **known close
associates** (joint beneficial owners of structures, close
business relationships).

For detail: [`./amlh-peps.md`](./amlh-peps.md).

For screening operations: [`./amlh-peps-screening.md`](./amlh-peps-screening.md).

### 2. High-risk-country nexus

Triggered where any of:

- The customer is **resident in** a high-risk jurisdiction
  (FATF Black, FATF Grey, JFSC-listed, EU HRTC);
- The customer has **substantial assets in** a high-risk
  jurisdiction;
- The customer's transactions involve **counterparties in**
  high-risk jurisdictions;
- The customer's **business activity is in** a high-risk
  jurisdiction.

For detail: [`./amlh-high-risk-countries.md`](./amlh-high-risk-countries.md).

The Handbook's view is that any one of these touchpoints is
sufficient to trigger EDD; multiple touchpoints intensify
the EDD requirement.

### 3. Customer risk-rated as higher-risk by the BWRA

Where the business's own
[business-wide risk assessment](./amlh-risk-assessment.md)
and customer-risk-rating methodology produces a "high" or
equivalent rating, EDD applies regardless of whether one of
the categorical triggers (PEP / high-risk country / etc.)
is met.

This is the **risk-based catch-all** — the customer-risk
methodology is operationalising the Handbook's discretion to
calibrate EDD beyond the categorical triggers.

### 4. Complex or unusual structures

Triggered where the customer's structure:

- Has **multiple layers** with no clear economic / legal
  purpose;
- Uses **nominee shareholders** or other arrangements
  obscuring beneficial ownership;
- Spans **multiple high-secrecy jurisdictions**;
- Involves **opaque trust arrangements** (e.g. trusts
  within trusts within companies);
- Has a **stated purpose that does not match the structure's
  actual shape**.

The Handbook's view: complexity is **not in itself
suspicious** (HNW families often have legitimate complex
structures), but complexity **without clear purpose** is.
The regulated business should be able to articulate why the
specific complexity exists.

### 5. Non-face-to-face onboarding in elevated risk circumstances

Triggered where:

- The customer is being onboarded **remotely** (typical for
  international wealth-management) **and**
- The risk profile is otherwise elevated.

Note: not every remote onboarding triggers EDD. The
Handbook's position is that remote onboarding is a **risk
factor** weighted with others. A low-risk customer
onboarded remotely is not automatically EDD.

Mitigations available without full EDD include:

- Enhanced electronic verification;
- Additional documentary verification;
- Video-based identity verification;
- Reliance on a regulated intermediary's CDD.

### 6. Where a SAR has previously been filed

Triggered where the customer (or a related party) has been
the subject of a previous internal or external SAR. Even if
the SAR did not lead to law-enforcement action, the prior
suspicion changes the risk profile.

The Handbook expects the SAR history to be **part of the
customer file** and to trigger EDD on subsequent onboarding
attempts, periodic refresh, or relationship expansion.

### 7. Unusual transaction patterns during the relationship

This is an **ongoing-monitoring trigger** — not strictly an
onboarding trigger, but it converts an existing standard-CDD
relationship into an EDD relationship.

Triggered by:

- Transactions inconsistent with the customer's documented
  purpose / pattern;
- Transactions sized to avoid reporting thresholds
  (structuring);
- Transactions through pass-through accounts with no
  economic substance;
- Transaction patterns suggesting changed underlying
  activity.

See [`./amlh-ongoing-monitoring.md`](./amlh-ongoing-monitoring.md)
for the monitoring framework that surfaces these triggers.

## Trigger combinations

In practice, **most EDD relationships are triggered by
multiple factors simultaneously**:

- UAE-resident PEP family member with assets across UAE,
  London, and Mumbai → PEP trigger + high-risk-country
  trigger (depending on country list at the time);
- Russian-national family with cross-border structure
  established 2010-2015 → high-risk country + complex
  structure + possible historic-SAR trigger;
- Crypto-asset-focused fund customer → BWRA-based trigger
  (VASP-adjacent businesses are inherently high-risk under
  FATF / JFSC framing).

The Handbook does not aggregate triggers mechanically; the
**risk-based approach** means the business assesses the
overall risk profile, including how triggers combine, and
calibrates EDD intensity to the combination.

## Mandatory vs discretionary EDD

The Handbook distinguishes:

- **Mandatory EDD triggers** (above) — EDD must apply, no
  exceptions;
- **Discretionary EDD triggers** — the business may choose
  to apply EDD where its own risk methodology indicates
  caution, even where no mandatory trigger fires.

A robust EDD programme typically applies a generous
discretionary EDD margin — the operational cost of EDD is
modest compared to the enforcement cost of getting it
wrong.

## How triggers interact with onboarding

At onboarding, the EDD trigger assessment is part of the
[customer-onboarding workflow](../financial-regulation/cop-tcb-customer-onboarding.md):

1. **Preliminary screening** catches PEP / sanctions /
   country triggers early;
2. **Initial risk assessment** identifies BWRA-driven
   triggers;
3. **CDD discovery** surfaces complex-structure triggers as
   the structure is mapped;
4. **Onboarding decision** confirms the EDD trigger
   inventory and the EDD measures applied;
5. **Senior-management approval** with EDD documentation.

## How triggers interact with the ongoing relationship

A relationship that started as standard CDD may become EDD
later:

- Customer becomes a PEP through a new public role;
- Country-risk-list update brings the customer into
  high-risk-country EDD;
- Transaction patterns surface unusual activity;
- A SAR is filed (internal or external).

The regulated business must have **procedures for in-life
EDD escalation** — see
[`./amlh-ongoing-monitoring.md`](./amlh-ongoing-monitoring.md).

## Common trigger-handling failure points

- **Trigger missed at onboarding** — particularly PEP
  family-member triggers and complex-structure triggers;
- **Trigger surfaced but EDD measures not applied
  consistently** — partial EDD where full applies;
- **Trigger expired but EDD not de-escalated** (e.g. PEP
  ceased + minimum period passed + no documented residual-
  risk assessment);
- **In-life trigger not surfaced** — the relationship
  evolves into EDD territory but ongoing-monitoring does
  not catch it.

## Status

Draft. Specific trigger thresholds and the Handbook's
trigger-handling provisions should be verified against the
current publication.

## Cross-references

- [`./amlh-edd.md`](./amlh-edd.md) — EDD section index.
- [`./amlh-peps.md`](./amlh-peps.md) — PEP-specific
  trigger.
- [`./amlh-high-risk-countries.md`](./amlh-high-risk-countries.md)
  — country-risk-specific trigger.
- [`./amlh-edd-source-of-wealth.md`](./amlh-edd-source-of-wealth.md)
  — SoW EDD measure.
- [`./amlh-risk-assessment.md`](./amlh-risk-assessment.md)
  — risk-based-approach foundation.
- [`./amlh-ongoing-monitoring.md`](./amlh-ongoing-monitoring.md)
  — in-life trigger surfacing.
