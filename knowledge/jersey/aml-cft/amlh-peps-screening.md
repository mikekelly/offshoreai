---
title: AML/CFT Handbook — PEP Screening
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
  - pep
  - edd
sources:
  - title: JFSC AML/CFT Handbook
    url: https://www.jerseyfsc.org/industry/aml-cft-handbook/
    accessed: 2026-05-25
    kind: regulator-guidance
see_also:
  - ./amlh-peps.md
  - ./amlh-edd.md
  - ./amlh-cdd.md
---

# AML/CFT Handbook — PEP Screening

PEP screening is the operational discipline by which a
Jersey-supervised business **identifies** which of its
prospective and existing customers (and their family members /
close associates) are politically exposed persons. Missed
identification at onboarding is a recurring JFSC enforcement
theme — the screening programme is one of the most-inspected
parts of the AML/CFT control framework.

## What screening must catch

Screening must surface:

- **Foreign PEPs** — heads of state, heads of government,
  senior politicians, senior government / judicial / military
  officials, senior executives of state-owned enterprises,
  important political-party officials, of any foreign
  jurisdiction;
- **Domestic PEPs** — UK / Jersey equivalents (subject to
  Handbook treatment of the Jersey domestic context — verify
  current position);
- **International-organisation PEPs** — UN, IMF, World Bank,
  regional development banks, EU institutions, FATF, etc.;
- **Family members** — typically spouse / partner, children
  and their spouses / partners, parents, siblings (exact
  scope per the Handbook's current edition);
- **Known close associates** — natural persons known to share
  beneficial ownership of legal entities or arrangements with
  the PEP, or in other close business relationships.

## The four screening tiers

A robust screening programme typically operates in four tiers:

### Tier 1 — Customer self-declaration

Onboarding questionnaire asks the prospective customer to
declare PEP status, family-member PEP relationships, and
close-associate relationships. Insufficient alone — the
incentive to declare is weak, particularly where the PEP
relationship is uncomfortable for the customer to disclose.

### Tier 2 — Public-domain searches

Manual or semi-automated searches of:

- **News media** for the customer's name (multi-language
  coverage for non-English-speaking jurisdictions);
- **Government registers** — parliamentary registers,
  cabinet listings, judiciary listings, official-position
  registers;
- **Corporate registers** — for board positions at state-
  owned enterprises;
- **Charity registers** — many PEPs hold trustee positions
  at charitable foundations associated with their political
  role;
- **Sanctions lists** as a related screening dimension.

### Tier 3 — Commercial PEP-screening tools

The expected baseline for any regulated business with
material customer flow. Commercial providers (Refinitiv World-
Check, Dow Jones Risk & Compliance, LexisNexis WorldCompliance,
ComplyAdvantage, Acuris, etc.) maintain large PEP databases
and adverse-media coverage with structured matching.

Implementation considerations:

- **Fuzzy matching** for name-spelling variants (particularly
  important for non-Latin-script names transliterated to
  English);
- **Date-of-birth disambiguation** for common names;
- **Match-disposition workflow** — every screen result must
  be reviewed and dispositioned;
- **False-positive management** — calibrated tolerance for
  initial-search false positives so genuine matches are not
  buried;
- **Alert handling SLAs**.

### Tier 4 — Ongoing re-screening

Customer base re-screened on:

- **List updates** — commercial PEP databases update
  continuously; the customer base re-runs against the latest
  list at defined frequency (often daily for high-risk
  customers, monthly otherwise);
- **Periodic CDD refresh** — full re-screen at refresh
  intervals;
- **Trigger events** — adverse-media match for an existing
  customer prompts immediate review.

## Common screening failure modes

The JFSC's enforcement record surfaces recurring failure
modes:

- **Reliance on Tier 1 alone** — customer declaration not
  corroborated by independent screening;
- **Inadequate fuzzy matching** — name-spelling variants
  missed at screen;
- **Stale screening** — initial screen at onboarding never
  re-run;
- **False-positive desensitisation** — high alert volumes
  drive review fatigue and genuine matches are missed;
- **Family-member screening gaps** — customer screened but
  family members (also subject to EDD per the PEP regime)
  not screened;
- **Close-associate identification weakness** — particularly
  difficult given the absence of formal records of "close
  business associate" relationships;
- **No documented disposition** — alerts cleared without
  recorded reasoning.

A screening programme that addresses each of these in its
design will withstand thematic-review scrutiny.

## Match-handling workflow

When a screening hit is positive (the customer is — or is
related to — a PEP):

1. **Initial review** by the screening / onboarding team;
2. **Investigation** to confirm the match and determine the
   PEP category (foreign / domestic / IO; PEP / family
   member / close associate);
3. **Escalation** to compliance / MLRO for review;
4. **Senior-management approval** required before
   onboarding (per the PEP-specific EDD requirements at
   [`amlh-peps.md`](./amlh-peps.md));
5. **EDD application** at the appropriate intensity —
   particularly the source-of-wealth verification at
   [`amlh-edd-source-of-wealth.md`](./amlh-edd-source-of-wealth.md);
6. **Documentation** of every step.

## Tools landscape (descriptive, not endorsing)

Per the tenant-neutrality discipline at
[`../../CONVENTIONS.md`](../../CONVENTIONS.md), this file
does **not** endorse specific commercial tooling. The major
providers in the market include Refinitiv World-Check, Dow
Jones Risk & Compliance, LexisNexis WorldCompliance,
ComplyAdvantage, Acuris, and several others. Each business
selects tooling appropriate to its size, customer profile,
and budget. The Handbook's expectation is that **some
commercial-grade screening tool is in use** for any business
with material customer flow.

## When PEP status changes or ends

The Handbook generally provides that PEP status continues for
**at least one year** after the PEP ceases to hold the
qualifying function — and then the business re-assesses on
documented risk grounds whether residual PEP risk remains.

Operational implications:

- **Cessation tracking** — when a customer ceases to hold a
  PEP-triggering position, the cessation date is recorded;
- **Residual-risk assessment** — at the minimum cessation
  period, formal assessment of whether ongoing EDD is
  required;
- **Exit decision** — documented.

For close associates and family members, PEP-derived risk
ends when the underlying PEP relationship ends, subject to
the same residual-risk assessment.

## Cross-references

- [`./amlh-peps.md`](./amlh-peps.md) — PEP section index.
- [`./amlh-edd.md`](./amlh-edd.md) — EDD regime PEPs sit
  inside.
- [`./amlh-edd-source-of-wealth.md`](./amlh-edd-source-of-wealth.md)
  — SoW operational depth.
- [`./aml-cft-handbook.md`](./aml-cft-handbook.md) — hub.

## Status

Draft. The tool / vendor landscape evolves; verify against
current JFSC publications and current market practice
before relying on this file in a specific implementation.
