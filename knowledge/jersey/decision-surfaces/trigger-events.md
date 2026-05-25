---
title: Trigger Events — Structuring Conversation Map
jurisdiction: jersey
category: decision-surfaces
status: draft
last_verified: 2026-05-25
tags:
  - jersey
  - decision-surface
  - trigger-event
  - wealth-manager-relevance
see_also:
  - ./index.md
  - ../use-cases/client-cohorts/index.md
  - ../sectors/index.md
  - ../use-cases/aim-listed-jersey-plc/index.md
---

# Trigger Events — Structuring Conversation Map

## What this is

A catalogue of **events that should trigger a structuring or
advisory conversation** with a wealth-management client.
Designed for the international wealth RM, the family-office
adviser, or the compliance function deciding whether a client
relationship needs review.

Per the [decision-surface content rule](../../CONVENTIONS.md#decision-surface-content-type),
this file routes — every claim about substantive
consequences must be supported by the linked concept files.

## How to use this file

For each event below:

1. **Identify the event** — pattern-match the client's
   situation;
2. **Read the structuring implication** — the cross-linked
   concept files or persona / cohort files;
3. **Consider whether the event triggers AML/CFT
   reconsideration** — many of these events also affect the
   customer risk rating and may require CDD refresh;
4. **Calibrate the outreach** — not every event needs an
   immediate client conversation, but every event should
   be logged for periodic review.

## Regulatory events (jurisdiction-level)

### UK non-dom regime change → cohort-wide outreach

The April 2025 UK reforms (FIG regime; IHT becoming
residence-based) materially change the structuring calculus
for UK-resident non-doms.

- **Affected cohort:** UK non-doms ([`../use-cases/client-cohorts/uk-non-dom.md`](../use-cases/client-cohorts/uk-non-dom.md));
- **Conversation:** transitional planning, structure review
  against the new regime;
- **Related events:** further UK budget changes; HMRC
  consultations.

### UK carried interest reform (effective 6 April 2026)

- **Affected cohort / sector:** PE founders / carry recipients
  ([`../sectors/pe-founders.md`](../sectors/pe-founders.md));
  also relevant to international wealth RMs serving such
  clients;
- **Frontier file:** [`../../frontier/uk-carried-interest-reform-2026.md`](../../frontier/uk-carried-interest-reform-2026.md);
- **Conversation:** carry vehicle restructuring; tax-residence
  considerations.

### AIFMD II (effective 16 April 2026)

- **Affected business:** Jersey fund management / FSB
  businesses marketing into EU via NPPR;
- **Frontier file:** [`../../frontier/aifmd-ii-april-2026.md`](../../frontier/aifmd-ii-april-2026.md);
- **Conversation:** marketing-strategy implications, Annex IV
  reporting uplift, JFSC Code interaction
  ([AIF Code](../financial-regulation/cop-aif-index.md)).

### CARF — Crypto-Asset Reporting Framework (in force 1 January 2026)

- **Affected cohort / sector:** any client with material
  crypto-asset holdings;
- **Concept file:** [`../international/carf.md`](../international/carf.md);
- **Sector file:** [`../sectors/crypto-digital-assets.md`](../sectors/crypto-digital-assets.md);
- **Conversation:** reporting visibility, documentation,
  source-of-wealth refresh.

### MoneyVal / FATF list changes

When FATF or MoneyVal updates its lists of high-risk
jurisdictions:

- **Affected:** any customer relationship with nexus to the
  newly-listed jurisdiction;
- **Concept files:** [`../aml-cft/amlh-high-risk-countries.md`](../aml-cft/amlh-high-risk-countries.md),
  [`../aml-cft/moneyval.md`](../aml-cft/moneyval.md);
- **Conversation:** EDD escalation, possible relationship
  review.

### Pillar Two / MCIT scope change

For Jersey-resident groups crossing or approaching the
EUR 750m revenue threshold:

- **Concept file:** [`../international/pillar-two-mcit.md`](../international/pillar-two-mcit.md);
- **Frontier file (group-strategic):** [`../../frontier/jersey-finance-industry-2026.md`](../frontier/jersey-finance-industry-2026.md);
- **Conversation:** group restructuring, MCIT compliance
  preparation.

## Client life events

### Marriage / partnership

- Pre-nuptial / post-nuptial agreements may interact with
  trust structuring;
- Beneficiary class updates for any existing trust;
- **AML/CFT:** family-member screening update.

### Birth of a child / grandchild

- Beneficiary class additions to existing trusts;
- New-generation succession planning;
- **AML/CFT:** family-member screening update.

### Divorce

- Pre-emptive structuring review (existing trust assets may
  be subject to matrimonial-claim challenge);
- Concept file: [`../trusts/firewall.md`](../trusts/firewall.md)
  (Article 9 firewall, matrimonial application);
- **AML/CFT:** customer risk-rating review.

### Death of family member / inheritance

- Source-of-wealth update for any wealth-management
  relationship;
- New-asset structuring conversation;
- Concept file: [`../aml-cft/amlh-edd-source-of-wealth.md`](../aml-cft/amlh-edd-source-of-wealth.md);
- **AML/CFT:** CDD refresh with documented inheritance
  source.

### Change of tax residence (departure)

- Pre-departure tax planning is materially easier than
  post-departure remedy;
- Trust / company structuring calibrated to new residence;
- Affected cohort files: per the new-residence jurisdiction
  ([`../use-cases/client-cohorts/`](../use-cases/client-cohorts/index.md));
- **AML/CFT:** customer risk-rating review; sanctions /
  country-risk re-screen.

### Change of tax residence (arrival in UK / EU / India)

- Pre-arrival structuring is essential (post-arrival changes
  often create taxable events);
- See [UK non-dom cohort](../use-cases/client-cohorts/uk-non-dom.md)
  for UK arrivals.

### Retirement / career end (sports / media / executive)

- Career-arc structures designed for post-career income drop
  trigger their post-career planning;
- Sector file: [`../sectors/sports-media-talent.md`](../sectors/sports-media-talent.md).

## Transactional events

### Liquidity event (IPO / sale of business)

- Pre-IPO / pre-sale structuring is materially better than
  post-realisation remedy;
- Sector file: [`../sectors/pe-founders.md`](../sectors/pe-founders.md);
- **AML/CFT:** SoW evidence becomes robust and recent
  (cap tables / SPA / completion accounts).

### Director appointment to UK-listed company

- MAR PDMR regime kicks in
  ([`../external-rules/mar.md`](../external-rules/mar.md));
- DTR 5 notification considerations for any concentrated
  holding;
- Personal-dealing policy considerations.

### Acquisition or sale of regulated business

- For acquirer: see [M&A acquirer persona](../use-cases/m-and-a-acquirer/index.md)
  + JFSC change-of-control;
- For seller: change-of-control + post-completion exit
  planning.

### Significant UK / EU property acquisition

- UK property: [`../sectors/uk-property.md`](../sectors/uk-property.md)
  with ATED / SDLT / NRCGT considerations;
- ME property: [`../sectors/middle-east-property.md`](../sectors/middle-east-property.md).

### Cross-border transfer of significant assets

- Source-of-funds documentation;
- Exchange-control compliance (where applicable per the
  client's home jurisdiction — see SA expat cohort, NRI
  cohort);
- Sanctions screening of counterparty.

## Regulatory profile events for the client

### Becoming a PEP (new public role / family member becomes PEP)

- Triggers PEP-regime EDD application
  ([`../aml-cft/amlh-peps.md`](../aml-cft/amlh-peps.md))
  including:
- Senior-management approval at refresh point;
- SoW evidentiary uplift;
- Enhanced ongoing monitoring;
- More frequent periodic refresh.

### Adverse media / sanctions match

- Immediate compliance escalation;
- Possible SAR consideration
  ([`../aml-cft/amlh-sars.md`](../aml-cft/amlh-sars.md));
- Relationship review.

### Significant changes in beneficial-ownership of entity customer

- CDD refresh under [MLO 2008](../aml-cft/mlo-articles-index.md);
- Trust / company beneficial-ownership register update
  ([`../registries/fs-dpi-law-2020.md`](../registries/fs-dpi-law-2020.md)).

## Group-strategic events (for the wealth-management business itself)

For the wealth-management business — particularly the
[AIM-listed Jersey plc operating reality](../use-cases/aim-listed-jersey-plc/index.md)
persona — these trigger group-level decisions:

### Approaching a regulatory threshold (e.g. Pillar Two scope, MCIT)

- See [`../international/pillar-two-mcit.md`](../international/pillar-two-mcit.md);
- Strategic-decision conversation about M&A pace, group
  structure.

### JFSC public statement against a peer firm

- Internal review against the conduct that was censured;
- Adjustment of controls if a gap is identified;
- Soft-law source: [`../financial-regulation/jfsc-public-statements-index.md`](../financial-regulation/jfsc-public-statements-index.md).

### Frontier-file `as_of` decay

- Frontier files have decay windows; an expired `as_of` is
  an editorial trigger to refresh the frontier file and
  re-survey any dependent advisory content.

## How this surface should be operated

In practice, a wealth-management business operates this
trigger-event map as:

- **A monitoring checklist** for compliance — events to
  screen for across the customer book;
- **An outreach prompt** for RMs — events affecting an
  existing client warrant a conversation;
- **A new-business hook** — public regulatory events shape
  the firm's outbound content;
- **An audit-trail discipline** — every triggered event is
  logged with the response taken.

## Cross-references

- [`./index.md`](./index.md) — decision-surfaces section
  index.
- [`../use-cases/client-cohorts/index.md`](../use-cases/client-cohorts/index.md)
  — cohort hub.
- [`../sectors/index.md`](../sectors/index.md) — sectors hub.
- [`../use-cases/aim-listed-jersey-plc/index.md`](../use-cases/aim-listed-jersey-plc/index.md)
  — wealth-group-chair persona.
- [`../../frontier/`](../../frontier/) and
  [`../frontier/`](../frontier/) — frontier files this
  surface depends on.
