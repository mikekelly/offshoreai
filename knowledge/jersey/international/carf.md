---
title: CARF — Crypto-Asset Reporting Framework
jurisdiction: jersey
category: international
status: stable
last_verified: 2026-05-19
tags:
  - jersey
  - international
  - carf
  - crypto-asset-reporting
  - oecd
  - automatic-exchange
  - concept-file
sources:
  - title: OECD — Crypto-Asset Reporting Framework
    url: https://www.oecd.org/tax/exchange-of-tax-information/crypto-asset-reporting-framework.htm
    accessed: 2026-05-19
    kind: supranational
  - title: OECD Global Forum — CARF implementation peer review
    url: https://www.oecd.org/
    accessed: 2026-05-19
    kind: supranational
  - title: Government of Jersey — CARF implementation
    url: https://www.gov.je/
    accessed: 2026-05-19
    kind: government
see_also:
  - ./crs.md
  - ./fatca.md
  - ./dac6.md
  - ./index.md
  - ../registries/vasp-register.md
  - ../digital-assets/index.md
---

# CARF — Crypto-Asset Reporting Framework

## What it is

The **Crypto-Asset Reporting Framework (CARF)** is the
**OECD's automatic-exchange regime for crypto-asset
information**, approved by the OECD/G20 in August 2022 and
incorporated into the Multilateral Competent Authority
Agreement framework from 2024.

CARF is the **crypto-asset complement** to the existing
[**Common Reporting Standard (CRS)**](./crs.md), which
covers traditional financial-account information. Together
CARF and CRS form the **second-generation automatic-
exchange architecture** — the first generation being the
US [FATCA](./fatca.md) regime.

Jersey is a **CARF-implementing jurisdiction** and the
regime applies to Jersey-resident Reporting Crypto-Asset
Service Providers (RCASPs).

## Why it exists

The original [CRS](./crs.md) regime — designed in 2014-
2017 — pre-dated the mainstream emergence of crypto-
assets. CRS captures information held by traditional
banks, custodians, fund administrators, and trust
companies, but not by crypto-asset exchanges, custodians,
or service providers.

As crypto-assets became a meaningful holding category, the
**transparency gap** widened. CARF is designed to close
it. The combined CRS + CARF framework now captures:

- **CRS**: traditional financial-account information
  (deposits, investment assets, custody, life-assurance
  policies, equity in passive investment vehicles);
- **CARF**: crypto-asset and digital-currency
  information (exchange, transfer, custody, retail
  payment transactions over thresholds, reportable
  crypto-asset events).

## Scope — who's caught

A **Reporting Crypto-Asset Service Provider (RCASP)** is a
service provider that, as a business, **effectuates
exchange transactions** in relevant crypto-assets for, or
on behalf of, customers. This captures:

- Crypto-asset exchanges;
- Crypto-asset brokers;
- Crypto-asset wallet providers (in certain operating
  models);
- Certain crypto-asset ATM operators;
- DeFi platforms (in specific operating arrangements).

In Jersey, **registered Virtual Asset Service Providers
(VASPs)** — see [`../registries/vasp-register.md`](../registries/vasp-register.md) —
are the primary cohort caught by CARF.

## What gets reported

For each Reportable Person (typically a customer
identified by tax residence), the RCASP reports:

- **Identity information** (name, address, jurisdiction
  of tax residence, TIN);
- **Aggregate gross amount** of exchange transactions per
  type of crypto-asset, per type of transaction
  (acquisition, disposal, retail-payment over USD 50,000,
  transfers);
- **Reportable crypto-assets** — including stablecoins,
  certain derivatives of crypto-assets, and central-
  bank digital currencies in some scope variations.

Reports are made annually to the Jersey tax authority,
which exchanges with the relevant Competent Authorities
of the customer's home jurisdiction under the CARF
Multilateral Competent Authority Agreement.

## How CARF, CRS, and FATCA fit together

The three regimes are layered:

| Regime | Subject | Reporter | Scope |
|---|---|---|---|
| FATCA | US-person account information | Foreign Financial Institutions | US tax residents |
| CRS | Cross-border financial-account information | Financial Institutions | Cross-border tax residents (excl. US) |
| CARF | Cross-border crypto-asset information | RCASPs | Cross-border tax residents |

Jersey is in **full scope** for all three. A Jersey
financial institution may have reporting obligations under
multiple regimes simultaneously (FATCA + CRS for
traditional accounts; CRS for fund interests; CARF for
crypto-asset holdings).

## Implementation timeline

| Date | Event |
|---|---|
| Aug 2022 | OECD publishes CARF |
| 2023 | CARF Multilateral Competent Authority Agreement opened for signature |
| **November 2024** | **Jersey signs the CARF multilateral agreement** |
| 2025 | Jersey domestic implementing regulations |
| **1 January 2026** | **Jersey CARF implementation begins** (first reporting period) |
| **2027** | **First reports filed and exchanged** |

Jersey is on the standard implementation timetable. The
Crown Dependencies + Overseas Territories cluster is
implementing on the same timeline.

## CARF and the VASP register

Jersey's [VASP register](../registries/vasp-register.md)
predates CARF and serves a related but distinct purpose
(AML/CFT supervision of VASP activity). Many registered
VASPs are RCASPs for CARF purposes, but the two regimes
have **separate frameworks**:

- **VASP register**: AML/CFT supervision under Jersey's
  POCL framework;
- **CARF**: tax-information-exchange reporting.

A Jersey VASP typically needs **both** registrations to
operate compliantly — VASP registration with the JFSC for
AML/CFT supervision, and CARF compliance for tax-
information reporting.

## The Substance Law overlap

A Jersey-resident RCASP carrying on crypto-asset business
falls within the [Substance Law 2019](../tax/economic-substance.md)
relevant-activities perimeter (typically the "financing-
and-leasing" or "holding-company" categories depending on
the operating model). Substance compliance is required in
parallel with CARF compliance.

## The transparency-arc context

CARF continues the **decades-long transparency arc** that
runs from OECD HTP (1998), through FATCA (2014), CRS (2014-
2017), OECD MDR / DAC6-style commitments (2018-),
beneficial-ownership registers (2017-),
and now CARF (2024-2027). For the strategic narrative see
[`../../history/trajectory.md`](../history/trajectory.md).

The cumulative effect: **Jersey is more transparent in 2026
than at any prior point in its modern history**, and CARF
extends the architecture into the digital-asset domain.

## Pitfalls

- **Treating CARF as a substitute for CRS** — it is a
  complement, not a replacement;
- **Underestimating scope** — DeFi and wallet operations
  may qualify as RCASP depending on the operating model;
- **Ignoring overlap with VASP registration** — both are
  required;
- **Threshold misunderstanding** — the USD 50,000 retail-
  payment threshold applies per transaction per customer
  per year, with aggregation rules;
- **TIN gaps** — customer-onboarding processes need to
  capture sufficient information to support CARF
  reporting, including jurisdiction-of-tax-residence
  certification;
- **Implementation timing** — first reports are due in
  2027; preparation work needs to start now (2026) on
  customer-identification programmes, data architecture,
  and reporting infrastructure.

## Cross-references

- [`./crs.md`](./crs.md);
- [`./fatca.md`](./fatca.md);
- [`./dac6.md`](./dac6.md);
- [`./index.md`](./index.md);
- [`./pillar-two-mcit.md`](./pillar-two-mcit.md);
- [`../registries/vasp-register.md`](../registries/vasp-register.md);
- [`../digital-assets/index.md`](../digital-assets/index.md);
- [`../tax/economic-substance.md`](../tax/economic-substance.md);
- [`../use-cases/compliance-mlro/vasp-crypto-customers.md`](../use-cases/compliance-mlro/vasp-crypto-customers.md);
- [`../use-cases/trust-officer/crs-classification.md`](../use-cases/trust-officer/crs-classification.md);
- [`../use-cases/trust-officer/fatca-classification.md`](../use-cases/trust-officer/fatca-classification.md);
- [`../../frontier/tokenisation-jersey-2026.md`](../frontier/tokenisation-jersey-2026.md);
- [`../../history/last-25-years.md`](../history/last-25-years.md);
- [`../../history/trajectory.md`](../history/trajectory.md).
