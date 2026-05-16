---
title: CRS / FATCA Reporting on Family Members
jurisdiction: jersey
category: use-cases
persona: family-office-adviser
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - family-office-adviser
  - crs
  - fatca
  - family-reporting
  - persona-family-office
  - use-case
see_also:
  - ./index.md
  - ../../international/crs.md
  - ../../international/fatca.md
---

# CRS / FATCA Reporting on Family Members

## The question

Your family's wealth is structured through Jersey vehicles
(trusts, foundations, holding companies). **CRS** and **FATCA**
require reporting of family members. What's reported and to
whom?

## The short answer

Jersey vehicles are typically **Financial Institutions** under
CRS / FATCA. Reporting captures:

- **Settlors** of trusts;
- **Trustees** (institutional and individual);
- **Protectors / guardians**;
- **Named beneficiaries**;
- **Discretionary beneficiaries** receiving distributions;
- **Controlling persons** of foundations / family companies.

Reports go to **Revenue Jersey**, which **forwards** to:

- **Partner-jurisdiction tax authorities** (CRS) for non-Jersey-
  resident family members;
- **IRS** (FATCA) for US-person family members.

The family should expect their **home-jurisdiction tax
authorities** to receive information about Jersey holdings.

## The proper answer

### What CRS reports

For Jersey vehicles classified as FIs (most professionally-
managed trusts / foundations / fund vehicles):

- **Identity** of reportable persons;
- **Account / equity-interest values**;
- **Income** (interest, dividends);
- **Disposition proceeds**;
- **Reporting jurisdictions** based on tax-residence.

For Passive NFFE customers (some real-estate-only trusts), the
bank or other FI holding the account reports controlling persons.

### Who counts as a "reportable person"

For a Jersey trust:

- **Settlor** — current and historical contributors;
- **Trustees** — corporate or individual;
- **Protector / enforcer**;
- **Named beneficiaries**;
- **Discretionary beneficiaries** receiving distributions in
  the reporting year;
- **Other identified controlling persons**.

For a Jersey foundation:

- **Founder**;
- **Council members**;
- **Guardian**;
- **Beneficiaries / objects**.

For each, **tax residence** drives whether they are reportable
to specific jurisdictions.

### What FATCA reports

For US-person family members:

- **Identity** including name, address, US TIN;
- **Account balances and values**;
- **Income credited**;
- **Specific to US-person classification**.

Reports go to Revenue Jersey → IRS under the Model 1 IGA.

### Family-member experience

A typical family will see:

- **Each Jersey FI** (the trust, foundation, holding company)
  reports about them annually;
- **Each tax-residence jurisdiction** receives the information
  from Jersey;
- **The family member** doesn't separately file the report —
  the FI does it on their behalf;
- The family member's **tax filings** should match the
  information reported (otherwise inconsistency questions);
- **Adverse consequences** for unreported foreign holdings in
  any case.

### Practical implications

- **Foreign tax authorities know** about Jersey holdings of
  family members;
- **Tax compliance in home jurisdiction** is essential — Jersey
  isn't a hiding place;
- **Coordination** between Jersey filings and family-member
  filings recommended;
- **Family-office systems** should aggregate the CRS / FATCA
  reports across vehicles.

### Tax-information flows

```
Jersey FI (trust / foundation / company)
    | (annual report)
    v
Revenue Jersey
    | (forwarded under treaty / IGA)
    v
Foreign tax authority (HMRC / IRS / etc.)
    | (matched against family-member filings)
    v
Family member faces enquiry if mismatch
```

### Family-specific scenarios

#### UK-resident family member, Jersey trust

- **CRS report** by the trust;
- **Forwarded to HMRC**;
- **Family member** must report Jersey-trust matters in UK
  return;
- **HMRC matches** the reports.

#### US-person family member, Jersey foundation

- **FATCA report** by the foundation;
- **Forwarded to IRS**;
- **Family member** files Form 3520 / 3520-A as required;
- **IRS matches** reports and filings.

#### Multi-jurisdiction family

- **Multiple reports** under CRS to different jurisdictions;
- **Coordination** essential to avoid inconsistencies;
- **Family-office aggregation** valuable for oversight.

### Beneficial-ownership reporting

Separate from CRS / FATCA:

- **FS(DPI)(J)L 2020** beneficial-ownership central register;
- **Not publicly accessible** but available to authorities;
- **Updated** as ownership changes.

## What to do next

For ongoing management:

1. **Map** which Jersey vehicles report on family members;
2. **Coordinate** with family-member tax advisers;
3. **Aggregate** reports for family-office overview;
4. **Verify** family-member returns reflect the reported
   information;
5. **Address** any inconsistencies proactively.

## Pitfalls

- **Inconsistency** between Jersey reports and home-jurisdiction
  filings;
- **Late or incorrect** family-member tax returns triggering
  enquiry;
- **Missing controlling persons**: family-office must ensure all
  reportable persons are captured;
- **Stale classifications**: vehicle classifications need
  refresh.

## Cross-references

- [`../../international/crs.md`](../../international/crs.md)
- [`../../international/fatca.md`](../../international/fatca.md)
- [`../trust-officer/crs-classification.md`](../trust-officer/crs-classification.md)
