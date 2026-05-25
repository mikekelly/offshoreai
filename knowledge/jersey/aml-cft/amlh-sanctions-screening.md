---
title: AML/CFT Handbook — Sanctions Screening
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
  - sanctions
  - wealth-manager-relevance
sources:
  - title: JFSC AML/CFT Handbook
    url: https://www.jerseyfsc.org/industry/aml-cft-handbook/
    accessed: 2026-05-25
    kind: regulator-guidance
see_also:
  - ./amlh-sanctions.md
  - ./sanctions.md
  - ./safl-articles-index.md
---

# AML/CFT Handbook — Sanctions Screening

Sanctions screening is the operational discipline by which a
Jersey supervised business **identifies counterparties and
customers subject to financial sanctions** and applies the
required freezing / reporting / refusal responses. Failures
here generate immediate JFSC and law-enforcement attention —
sanctions breach is among the most serious AML-adjacent
offences.

## Multiple parallel sanctions regimes

A Jersey wealth-management business with international
customers operates **multiple parallel sanctions regimes**
simultaneously:

| Regime | Applies to | Source |
|---|---|---|
| **Jersey sanctions** | All Jersey-supervised business | [SAFL 2019](./safl-articles-index.md) and Minister designations |
| **UN sanctions** | All Jersey-supervised business (UN listings implemented via Jersey law) | UN Security Council resolutions |
| **UK sanctions (OFSI)** | Jersey-supervised business with UK exposure (customers, counterparties, sterling-clearing) | UK OFSI consolidated list |
| **EU sanctions** | Jersey-supervised business with EU exposure | EU consolidated list |
| **US sanctions (OFAC)** | Jersey-supervised business with US-dollar clearing exposure, US-person customers, or specific US-touch transactions | US OFAC SDN and sectoral lists |

For international wealth-management businesses, **all five
regimes are typically relevant** to some part of the
customer book.

## What sanctions impose

When a customer or counterparty is designated:

- **Asset-freeze** — the firm must freeze assets it holds
  for or on behalf of the designated person
  ([SAFL Article 10](./safl-article-10.md));
- **Making available prohibition** — the firm cannot make
  funds or economic resources available to the designated
  person, directly or indirectly
  ([SAFL Article 11](./safl-article-11.md));
- **Reporting obligation** — the firm reports the match to
  the Minister (or designated reporting channel);
- **Continuing supervision** of the frozen position with
  periodic re-screening for change in designation status.

Some sanctions regimes (notably US OFAC) impose **secondary
sanctions** on third parties dealing with the designated
person — a Jersey firm dealing with a non-US-designated
person who deals with a US-designated person may itself
face US-side consequences.

## The screening pipeline

A robust sanctions-screening pipeline typically operates:

### Customer-level screening

- **Onboarding screening** — every prospective customer
  screened against all applicable lists before relationship
  opens;
- **Periodic re-screening** of the customer base on list
  updates (typically daily for high-risk customers,
  monthly otherwise);
- **Trigger-event re-screening** — match on a related
  party prompts re-screen of the original customer.

### Transaction-level screening

- **Counterparty screening** for every transaction —
  payment beneficiaries, custody counterparties,
  investment-product issuers;
- **Real-time interdiction** where the screening identifies
  a designated counterparty;
- **Cross-currency considerations** — US-dollar payments
  routed through US correspondents are subject to OFAC
  screening even where the underlying parties are not US
  persons.

### Beneficial-owner-level screening

- **Beneficial owners** of corporate / trust customers
  screened in addition to the immediate customer;
- **Indirect-control** persons screened where identified
  through "control by other means" CDD work.

## Screening tools

The Handbook's expectation: commercial sanctions-screening
tools for any business with material customer / transaction
flow. The major providers in the market include the same
firms that provide PEP screening (Refinitiv World-Check,
Dow Jones, LexisNexis, ComplyAdvantage, etc.) plus
specialist sanctions-screening providers. Per the
[tenant-neutrality discipline](../../CONVENTIONS.md):
the corpus does not endorse specific tools.

Implementation considerations:

- **List currency** — sanctions lists update **frequently**,
  often daily for some regimes;
- **Fuzzy matching** for name-spelling variants and
  transliterations;
- **Wild-card / aliased-name handling** for designated
  persons known under multiple aliases;
- **Vessel / aircraft / company screening** alongside
  natural-person screening for specific regimes;
- **False-positive management** — calibrated thresholds so
  noise does not bury genuine matches.

## Match-handling workflow

When a screening hit is positive:

### Tier 1 — verification

The match is reviewed to confirm it is **genuinely** the
designated person (not a false-positive same-name match).
Verification uses identifiers (date of birth, place of
birth, address, identification document numbers, family
details) to confirm or rule out.

### Tier 2 — Asset-freeze action

If verification confirms the match:

- **Funds and assets frozen** immediately;
- **No further transactions** processed on the relationship;
- **Internal notifications** to senior management and the
  MLRO.

### Tier 3 — Reporting

The firm reports the match to:

- The **Minister** (or designated Jersey reporting channel)
  per SAFL Article 10 / 11 obligations;
- Where applicable, **other regime authorities** (UK OFSI,
  EU competent authorities, US OFAC) under the firm's
  international compliance arrangements;
- **JFSC** notification as a material event.

### Tier 4 — Licence application

Where the firm needs to perform any otherwise-prohibited
act in respect of the designated person (typically asset
preservation, basic-needs payments, professional fees),
the firm may apply for a **licence** under
[SAFL Article 15](./safl-article-15.md) or the
equivalent provision in the relevant regime.

### Tier 5 — Ongoing supervision

The frozen position is supervised continuously:

- **De-designation** of the person triggers re-screening
  and lifting of the freeze;
- **Asset preservation** — frozen assets continue to
  accrue income, lose value, or otherwise change;
- **Periodic reporting** to authorities per the regime
  requirements.

## Common sanctions-screening failure modes

JFSC and international enforcement themes:

- **List currency lags** — screening operates against
  out-of-date lists;
- **Fuzzy matching too tight** — variants missed;
- **Beneficial-owner screening skipped** — customer
  screened but indirect-control persons not;
- **Cross-regime gaps** — Jersey + UN screened but UK / EU
  / US not, even where the firm has exposure to those
  regimes;
- **False-positive desensitisation** — match-handling
  process becomes pro-forma;
- **Transaction-level screening absent** — onboarding
  screening robust but ongoing transaction screening light;
- **Licence applications delayed** — frozen position
  managed badly while licence is in process.

## Why this matters for wealth management

For international wealth-management businesses, sanctions
screening is the **most-elevated-risk** AML/CFT discipline:

- **Sanctions exposure** in the customer book is typically
  material (politically-connected families,
  jurisdiction-adjacent businesses, complex international
  transactions);
- **Enforcement penalties** for sanctions breach are
  among the highest in financial-services regulation;
- **Cross-regime complexity** demands sophisticated
  controls;
- **Daily list updates** demand continuous operational
  attention.

A robust sanctions-screening programme is a load-bearing
piece of the wealth-management operating model.

## Status

Draft.

## Cross-references

- [`./amlh-sanctions.md`](./amlh-sanctions.md) — Handbook
  sanctions section index.
- [`./sanctions.md`](./sanctions.md) — Jersey sanctions
  overview.
- [`./safl-articles-index.md`](./safl-articles-index.md) —
  SAFL 2019 statute wiki.
