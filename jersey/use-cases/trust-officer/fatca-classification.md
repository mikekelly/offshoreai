---
title: How Do I Classify My Trust Under FATCA?
jurisdiction: jersey
category: use-cases
persona: trust-officer
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - trust-officer
  - fatca
  - ffi
  - trustee-documented-trust
  - persona-trust-officer
  - use-case
see_also:
  - ./index.md
  - ./crs-classification.md
  - ../../international/fatca.md
---

# How Do I Classify My Trust Under FATCA?

## The question

Same trust, FATCA perspective. Is it a **Foreign Financial
Institution (FFI)**, and if so, what specific FFI category
applies?

## The short answer

Most professionally-managed Jersey trusts are **FFIs** under
FATCA — typically classified as **Investment Entities** within
the FFI definition. Common specific categories:

- **Trustee-Documented Trust (TDT)** — the trustee (an FFI
  itself) reports for the trust;
- **Sponsored FFI** — a sponsor reports for the trust;
- **Owner-Documented FFI (ODFFI)** — a limited category for
  small trusts;
- **Reporting FFI** — the trust reports directly.

For trust-officer purposes, the **TDT** category is the most
common for professionally-administered Jersey trusts.

## The proper answer

### FATCA framework (recap)

FATCA classifies non-US financial institutions and requires
identification / reporting of **US-person account holders**.
Jersey operates under a **Model 1 IGA** — reporting through
Revenue Jersey to the IRS.

### FFI vs NFFE

A trust is either:

- **FFI** (Foreign Financial Institution) — subject to FATCA
  reporting obligations;
- **NFFE** (Non-Financial Foreign Entity) — bank/custodian of
  trust accounts does the US-person identification at account
  level.

The FFI test is similar to CRS Investment Entity test —
professionally-managed financial-asset trust qualifies.

### FFI sub-categories relevant to trusts

#### Trustee-Documented Trust (TDT)

- The **trustee is itself an FFI** (typically a Jersey TCB);
- The **trustee reports** on behalf of the trust;
- **Simpler administration** — single trustee-level GIIN
  registration covers all the trustee's TDT trusts;
- **Most common** category for Jersey professionally-administered
  trusts.

#### Sponsored Investment Entity

- A **sponsoring entity** (typically an investment manager or
  TCB) takes responsibility;
- Sponsor reports for multiple sponsored trusts under its
  sponsor-GIIN;
- Similar to TDT but with different formal mechanics.

#### Owner-Documented FFI (ODFFI)

- A **small / specific category** for trusts with limited
  account-holders;
- The **withholding agent** (bank holding the account) does the
  documentation rather than the trust itself reporting;
- Restrictive but useful for some structures.

#### Reporting FFI

- The trust **reports directly** through Revenue Jersey;
- Requires the trust to **register with the IRS** for a GIIN;
- Less common for trust structures (more common for funds).

### Specific scenarios

#### Family discretionary trust with TCB trustee

- **TDT** through the TCB (most common);
- TCB has GIIN and reports for all its TDT trusts.

#### Pure-real-estate trust

- **NFFE** (not FFI);
- The trust's bank account does the US-person check on
  controlling persons.

#### Active-business trust

- **NFFE Active** if the underlying business is active;
- Less stringent FATCA treatment.

#### PTC-administered family trust

- PTC may be an FFI itself or may rely on parent FFI structure;
- Often **TDT** through a related professional trustee
  arrangement.

### Reporting obligations

For TDT classification:

- **TCB has GIIN** and registers as the reporting entity;
- For each trust, identifies **US-person account holders**
  (settlors, beneficiaries with controlling-person status);
- **Annual report** to Revenue Jersey via FATCA portal;
- Revenue Jersey **forwards** to IRS under the Model 1 IGA.

### Joint CRS / FATCA compliance

In practice, TCBs run **integrated** CRS / FATCA programmes:

- **One classification** for each trust covering both regimes;
- **One due-diligence** process;
- **Two reports** (CRS to Revenue Jersey for forwarding to
  non-US partner jurisdictions; FATCA to Revenue Jersey for
  forwarding to IRS).

### US-person identification

US persons include:

- **US citizens** (regardless of residence);
- **US permanent residents**;
- **US-resident individuals** (substantial-presence test);
- **US corporations / entities** as beneficiaries;
- **Trusts with significant US-person involvement**.

## What to do next

For each trust:

1. **Classify** as FFI or NFFE;
2. If FFI, **determine the sub-category** (TDT most likely);
3. **Document** the classification;
4. **Register** GIIN if needed (typically at TCB level for TDT);
5. **Identify** US-person account holders;
6. **Implement** FATCA due diligence;
7. **Report** annually via Revenue Jersey portal.

## Pitfalls

- **Treating CRS and FATCA as separate**: integrated compliance
  is more efficient;
- **Missing US-person status**: US citizens born in the US who
  have lived abroad for decades are still US persons;
- **GIIN administration**: GIINs must be maintained / renewed;
- **Stale classification**: trust changes (new beneficiary,
  asset composition) can change classification.

## Cross-references

- [`crs-classification.md`](crs-classification.md)
- [`../../international/fatca.md`](../../international/fatca.md)
