---
title: CRS and FATCA Classification for a Jersey Fund
jurisdiction: jersey
category: use-cases
persona: fund-counsel
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - fund-counsel
  - crs
  - fatca
  - persona-fund-counsel
  - use-case
see_also:
  - ./index.md
  - ../../international/crs.md
  - ../../international/fatca.md
---

# CRS and FATCA Classification for a Jersey Fund

## The question

What is the **CRS** and **FATCA** classification of a typical
Jersey fund vehicle, and what reporting obligations follow?

## The short answer

Most Jersey funds are **Financial Institutions** under both CRS
and FATCA — typically classified as **Investment Entities**.
Reporting obligations:

- **CRS**: identify and report non-Jersey-resident reportable
  investors to Revenue Jersey (forwarded to partner
  jurisdictions);
- **FATCA**: identify and report US-person investors to Revenue
  Jersey (forwarded to IRS).

The administrator / DSP typically performs the operational
classification and reporting.

## The proper answer

### Classification

A Jersey fund is generally an **Investment Entity** because:

- A **substantial portion** of its income comes from investing,
  reinvesting, or trading financial assets;
- It is **managed by** another FI (the fund manager or
  administrator).

This makes it a **Financial Institution** under both CRS and
FATCA frameworks.

### CRS reporting

For CRS:

- **Identify** investors who are tax-resident in **CRS-partner
  jurisdictions other than Jersey**;
- For **entity investors** that are non-FIs, identify
  **controlling persons**;
- **Apply** CRS due-diligence standards (residence
  certifications, etc.);
- **Report annually** to Revenue Jersey via the CRS portal;
- Revenue Jersey **forwards** to partner jurisdictions.

### FATCA reporting

For FATCA:

- The fund is a **Foreign Financial Institution (FFI)**;
- Typically classifies as **Trustee-Documented Trust (TDT)** if
  trustee is FFI, or as **Reporting FFI** if registers directly;
- **Identifies** US-person investors and their accounts;
- **Reports annually** to Revenue Jersey;
- Revenue Jersey **forwards** to IRS under the Model 1 IGA.

### Sub-classifications

#### Sponsored Investment Entity

- A **sponsor** (typically a fund administrator or manager)
  takes FATCA responsibility;
- Sponsor reports on behalf of multiple sponsored funds under
  its sponsor-GIIN;
- Common for fund-administration platforms.

#### Trustee-Documented Trust

- For unit-trust funds where trustee is FFI;
- Trustee reports for the trust;
- Single GIIN at trustee level.

#### Owner-Documented FFI

- Limited category;
- Withholding agent (the fund's bank) does some documentation;
- Less commonly used in modern fund structures.

#### Reporting FFI

- The fund itself registers and reports;
- Has its own **GIIN** registered with IRS;
- Direct administrative path.

### Look-through for entity investors

For **entity investors** that are not themselves FIs (passive
NFFEs):

- The fund must identify **controlling persons** of the entity;
- **Controlling persons** are reportable under CRS / FATCA;
- This brings **ultimate beneficial owners** of investor
  entities into scope.

### Practical compliance

The administrator typically handles:

- **Investor self-certifications** at onboarding;
- **Classification** of each investor (FI / Active NFFE /
  Passive NFFE);
- **Controlling-person CDD** where needed;
- **Annual report** preparation and submission;
- **Ongoing monitoring** for status changes.

### Self-certification documentation

For each investor, the fund collects:

- **CRS self-certification form** (tax residence and any
  controlling persons);
- **FATCA Form W-8 / W-9 series** (US-person status / non-
  US-person status).

These are operational documents underpinning the classification
and reporting.

### Integration with onboarding

Integrated investor onboarding combines:

- **Subscription documents**;
- **CDD documents**;
- **CRS / FATCA self-certifications**;
- **Eligibility certifications**;

In a single submission package — efficient for the investor and
the fund administrator.

## What to do next

For a new fund:

1. **Classify** the fund (Investment Entity, likely);
2. **Register** GIIN if Reporting FFI route;
3. **Set up** integrated investor-onboarding pack;
4. **Configure** administrator's CRS / FATCA reporting
   capability;
5. **File** annually.

For an existing fund:

- **Review** classification periodically;
- **Update** for material structural changes;
- **Refresh** investor certifications as needed.

## Pitfalls

- **Missing controlling persons** for entity investors;
- **Stale self-certifications**: refresh on material changes;
- **GIIN administration**: must renew / maintain;
- **Master-feeder transparency**: reach to ultimate controlling
  persons.

## Cross-references

- [`../../international/crs.md`](../../international/crs.md)
- [`../../international/fatca.md`](../../international/fatca.md)
- [`master-feeder-cdd.md`](./master-feeder-cdd.md)
