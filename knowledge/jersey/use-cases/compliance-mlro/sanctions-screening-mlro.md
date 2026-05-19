---
title: How Do I Screen for Sanctions Matches?
jurisdiction: jersey
category: use-cases
persona: compliance-mlro
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - compliance-mlro
  - sanctions
  - screening
  - persona-compliance-mlro
  - use-case
see_also:
  - ./index.md
  - ../../aml-cft/sanctions.md
  - ../trust-officer/sanctions-screening.md
---

# How Do I Screen for Sanctions Matches?

## The question

What sanctions screening should a regulated entity do, against
which lists, and how?

## The short answer

Screen all **customers**, **beneficial owners**, and
**counterparties** against:

- **Jersey sanctions** lists;
- **UK OFSI** lists;
- **EU sanctions** lists (especially for EU-customer exposure);
- **US OFAC** lists (for USD transactions / US-person
  involvement);
- **UN** consolidated lists.

Use a **specialist screening provider** (Refinitiv, Dow Jones,
WorldCheck, LexisNexis) with **automated ongoing screening**
in addition to onboarding screening.

Match handling: **verify, assess, freeze if confirmed, notify
authorities, document**.

## The proper answer

### Lists to cover

#### Mandatory for Jersey businesses

- **Sanctions and Asset-Freezing (Jersey) Law 2014** designations;
- **UN sanctions** as implemented;
- **UK OFSI** sanctions (extraterritorial and Jersey-aligned).

#### Commercially significant

- **EU sanctions** for any EU-customer exposure;
- **US OFAC** sanctions for USD transactions and US-person
  involvement;
- **Other national** sanctions for relevant jurisdictions.

### Provider selection

Commercial sanctions-screening providers:

- **Refinitiv WorldCheck** — broad coverage, popular in finance;
- **Dow Jones Risk & Compliance** — comprehensive lists;
- **LexisNexis Bridger** — alternative;
- **Sanctions Search** — Jersey-specific specialist providers;
- **Internal** small-firm tools — may suffice for small books.

Key considerations:

- **List coverage** (which lists, how frequently updated);
- **Match-handling tools** (false-positive reduction, scoring);
- **Audit trail** (records of screens, matches, decisions);
- **Integration** with case-management systems.

### Frequency of screening

- **Onboarding**: comprehensive screen at start of relationship;
- **Ongoing**: **automated re-screening** at high frequency
  (daily / weekly) for sanctions / PEP-list updates;
- **Transaction-time**: counterparty screening for specific
  transactions;
- **List-update-triggered**: fresh screen when material list
  changes (e.g. major new designations).

### What gets screened

- **Customer** (individual / entity);
- **Beneficial owners** and controlling persons;
- **Authorised representatives**;
- **Counterparties** to specific transactions;
- **Underlying-entity directors / shareholders**;
- For an investment fund: **investors** and their controlling
  persons.

### Handling a match

When a screening match arises:

1. **Stop** any in-flight dealings with the matched party;
2. **Verify** the identity match:
   - **Many matches are false positives** (similar names);
   - **Compare** customer details against the designated
     person's details;
   - **Confirm** identity match or rule out;
3. If **confirmed match**:
   - **Freeze** the affected assets / accounts;
   - **Notify** JFSC and FIU;
   - **Document** the freeze;
   - **Consider** licence application for any necessary dealings;
4. If **false positive**:
   - **Document** the reasoning;
   - **Clear** the match;
   - **Maintain** the match-clearance record.

### Asset-freezing

A confirmed match typically requires:

- **Immediate freeze** of customer assets / accounts;
- **Notification** to authorities (JFSC, FIU);
- **No further dealings** with the designated person without
  licence;
- **Documentation** of the freeze.

### Licence applications

If dealings with a designated person are necessary:

- **Apply** for OFSI / Jersey licence;
- Categories include **basic needs**, **legal fees**,
  **humanitarian**;
- **Narrow scope** — only the specifically authorised activity
  permitted;
- **Documentation** of the licence and its scope.

### Documentation

Maintain:

- **Screening records** (date, lists used, results, match
  hits);
- **Match assessment** records (false-positive clearance
  reasoning);
- **Asset-freeze** records;
- **Licence applications and outcomes**;
- **Periodic review** records.

### Common pitfalls

- **Spelling / transliteration** variations — some screening
  providers handle better than others;
- **Family-name matches** — common surnames generate noise;
- **Date-of-birth omissions** in CDD make matches harder to
  rule out;
- **List currency** — using a stale list misses recent
  designations;
- **Coverage gaps** — single-list screening leaves exposure to
  other regimes.

## What to do next

For programme readiness:

1. **Choose** a screening provider with comprehensive coverage;
2. **Configure** automated re-screening at appropriate
   frequency;
3. **Train** staff on match-handling;
4. **Document** the sanctions policy;
5. **Test** the system periodically.

For an active match:

1. **Stop** dealings;
2. **Verify** the match;
3. **Freeze and notify** if confirmed;
4. **Document** all steps;
5. **Apply** for licences if needed.

## Pitfalls

- **Single-list reliance**: leaves significant exposure;
- **Stale lists**: missing recent designations;
- **False-positive fatigue**: dismissing matches as routine;
- **Inadequate documentation**: JFSC scrutiny is high.

## Cross-references

- [`../../aml-cft/sanctions.md`](../../aml-cft/sanctions.md)
- [`../trust-officer/sanctions-screening.md`](../trust-officer/sanctions-screening.md)
- [`sanctions-match-handling.md`](./sanctions-match-handling.md)
