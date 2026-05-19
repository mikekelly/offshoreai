---
title: Sanctions Screening — What Scope?
jurisdiction: jersey
category: use-cases
persona: trust-officer
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - trust-officer
  - sanctions
  - screening
  - aml-cft
  - persona-trust-officer
  - use-case
see_also:
  - ./index.md
  - ../../aml-cft/sanctions.md
---

# Sanctions Screening — What Scope?

## The question

You administer multiple Jersey trusts. What sanctions screening
must you do, and at what scope?

## The short answer

Sanctions screening should cover:

- **At onboarding** — the settlor, beneficiaries, protector,
  council members (for foundations), and counterparties /
  related parties;
- **Ongoing** — re-screening at prescribed intervals and
  whenever lists update;
- **Transaction screening** — counterparties to specific
  transactions before execution;
- **All applicable lists** — Jersey, UK, EU, US OFAC, and UN
  consolidated lists;
- **Adverse media** alongside formal lists.

A **sanctions hit** triggers asset-freezing obligations and SAR
considerations.

## The proper answer

### What sanctions are at stake

Jersey businesses must comply with:

- **Jersey sanctions** under the Sanctions and Asset-Freezing
  (Jersey) Law 2014 and supplementary Orders;
- **UN sanctions** as implemented in Jersey;
- **UK sanctions** under OFSI (applies through Jersey's
  constitutional alignment plus through extraterritorial
  contracts);
- **EU sanctions** if customer or counterparty has EU links;
- **US OFAC sanctions** (extraterritorial through USD
  transactions and US-person involvement);
- **Other national** regimes as relevant.

Most TCBs run **integrated multi-list screening** through
specialist providers (Refinitiv, Dow Jones, Worldcheck,
LexisNexis).

### Who to screen

For a trust:

- **Settlor** (current and historical);
- **All named beneficiaries**;
- **Principal members of discretionary class**;
- **Protector** (current and historical);
- **Investment manager / counterparties** of the trust;
- **Underlying-company directors** and beneficial owners.

For a foundation:

- **Founder**;
- **Council members**;
- **Guardian**;
- **Beneficiaries / objects**.

For each, screen against:

- **Sanctions lists** (designated persons / entities);
- **PEP lists** (separate but often combined);
- **Adverse media** (corruption / fraud / criminal links).

### When to screen

- **At onboarding** of any new client;
- **At each material change** (new beneficiary, new
  counterparty, structural change);
- **On scheduled re-screening cycles** (daily / weekly /
  monthly automated re-screening is common);
- **On sanctions-list updates** — new designations must trigger
  fresh checks;
- **Before specific transactions** to non-routine
  counterparties.

### Handling a sanctions match

If a screening match arises:

1. **Stop the transaction** in progress;
2. **Verify** — many matches are **false positives** (similar
   names); confirm identity;
3. If **confirmed match**:
   - **Freeze** the relevant assets;
   - **Notify** the JFSC immediately;
   - **Notify** the FIU (often parallel to SAR);
   - **Apply** for any necessary licences for specific dealings
     (basic-needs, humanitarian, legal-fee exemptions);
4. **Document** the entire process;
5. **Continue ongoing monitoring** of the relationship.

### Asset freezing

A confirmed sanctions match typically triggers an obligation to
**freeze**:

- **Bank accounts** in the trustee's name relating to the
  designated person;
- **Other assets** held for or controlled by the designated
  person;
- **Distributions** to / from the designated person are
  prohibited absent licence.

The asset freeze persists until the designation is lifted or
a specific licence permits dealings.

### Licences

If dealings with a designated person are necessary:

- **Apply for an OFSI / Jersey licence** as appropriate;
- Categories include **basic needs** (limited disbursements for
  living costs), **legal fees**, **humanitarian purposes**;
- The licence is **narrow** — only the specifically authorised
  activity is permitted.

### Documentation

Maintain:

- **Screening records** (date, tools used, results);
- **Match assessment** records (how false positives were
  cleared);
- **Asset-freezing** records if matches confirmed;
- **Licence applications** and outcomes.

JFSC inspections will look at sanctions records carefully.

## What to do next

For programme readiness:

1. **Choose** a screening provider with comprehensive list
   coverage;
2. **Set up** automated re-screening;
3. **Train** staff on match-handling procedures;
4. **Document** the sanctions policy;
5. **Test** the system through periodic exercises.

For an active situation:

1. **Stop** any in-flight dealings with the matched party;
2. **Verify** the match;
3. **Notify** JFSC / FIU as appropriate;
4. **Freeze** assets if confirmed;
5. **Apply** for licences if needed;
6. **Document** everything.

## Pitfalls

- **Stale screening**: a client who was clean at onboarding may
  be designated later;
- **False-positive fatigue**: dismissing matches as routine when
  one is genuine;
- **Single-list screening**: covering only UK leaves US OFAC
  exposure;
- **Inadequate documentation**: JFSC scrutiny of sanctions
  records is high.

## Cross-references

- [`../../aml-cft/sanctions.md`](../../aml-cft/sanctions.md)
- [`pep-onboarding.md`](./pep-onboarding.md) — PEP screening
  parallel.
