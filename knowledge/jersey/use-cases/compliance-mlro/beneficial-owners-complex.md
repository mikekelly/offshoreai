---
title: Identifying Beneficial Owners of Complex Structures
jurisdiction: jersey
category: use-cases
persona: compliance-mlro
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - compliance-mlro
  - beneficial-ownership
  - complex-structures
  - persona-compliance-mlro
  - use-case
see_also:
  - ./index.md
  - ./customer-due-diligence.md
---

# Identifying Beneficial Owners of Complex Structures

## The question

Your customer is a **multi-layered structure** — a Jersey
company owned by a foundation, which holds a trust, behind
which sits a family. How do you identify the **beneficial
owners**?

## The short answer

Trace through the layers to identify **natural persons** who
ultimately:

- **Own** 25% or more (by aggregate beneficial interest);
- **Control** the structure (through direct / indirect votes,
  director appointments, etc.); or
- **Otherwise exercise** dominant influence.

For trust / foundation layers, identify **settlors / founders,
trustees / council members, protectors / guardians, named
beneficiaries, and principal members of discretionary classes**.

Where no single natural person meets the 25% / control test,
identify the **senior managing official** as a backstop.

## The proper answer

### The beneficial-owner concept

A **beneficial owner** is the **natural person** who ultimately
benefits from / controls a structure:

- **Not the immediate legal owner** (a company, trust,
  foundation);
- **Not a nominee**;
- **The person behind** the legal arrangements.

For corporate customers, identify natural persons who:

- **Own** 25%+ shares directly or indirectly;
- **Control** 25%+ votes;
- **Exercise control** through other means (e.g. shareholder
  agreements, family-governance arrangements).

### Tracing through layers

For a multi-layer structure:

1. **Map** the ownership chain;
2. **Calculate** indirect ownership through each layer;
3. **Identify** natural persons meeting the 25% threshold by
   indirect ownership;
4. **Identify** controlling persons even if below 25% (e.g.
   sole director, dominant family member);
5. **Document** the analysis.

Example calculation:

- Jersey company customer owned 50/50 by Foundation A and
  Family LP B;
- Foundation A founded by Mr. X, with Mr. X as council
  member;
- Family LP B has Mr. X (40%), Mrs. X (30%), kids (30%)
  as LPs;
- Mr. X's beneficial-ownership: 50% of LP B = 20% indirect of
  customer; plus founder control of Foundation A which owns
  50% of customer;
- **Mr. X is a beneficial owner** via Foundation A
  (controlling-person test) regardless of percentage from LP B.

### Trusts and foundations in the chain

For trust / foundation layers:

#### Trust

- **Settlor** — historical and current contributors;
- **Trustees** — current and historical;
- **Protector** — if any, current and historical;
- **Named beneficiaries**;
- **Discretionary-class principal members** (e.g. settlor's
  spouse and children).

All of these may be beneficial owners depending on the structure.

#### Foundation

- **Founder**;
- **Council members**;
- **Guardian**;
- **Beneficiaries** named or class;
- **Foundation's regulations** may identify additional
  controlling parties.

### Backstop: senior managing official

Where no natural person meets the 25%-or-control test:

- Identify the **senior managing official** of the immediate
  customer;
- This person is a **proxy** beneficial owner for
  documentation purposes;
- **Not** a true beneficial owner economically.

This typically arises with **broadly-held corporates** (e.g.
listed companies, large operating companies).

### Verification

For each identified beneficial owner:

- **Identity verification** (photo ID, address);
- **PEP / sanctions screening**;
- **Source of wealth** evidence for HNW beneficial owners;
- **Documentation** in the customer file.

### Nominees and concealment

Watch for **nominee arrangements** concealing true ownership:

- **Bearer shares** (now rare but still exist in some
  jurisdictions);
- **Nominee shareholders** holding for undisclosed parties;
- **Trustee** arrangements concealing settlor influence;
- **Powers of attorney** giving control without ownership.

The customer must **disclose** true beneficial ownership; the
regulated entity must **document** and verify.

### Reporting under the FS(DPI)(J)L 2020

Jersey companies and foundations must report beneficial-
ownership information to the **central register**:

- **Maintained** by the JFSC;
- **Accessible** to law enforcement and authorities;
- **Not publicly accessible** at this writing;
- **Significant Persons** in a separate category for some entities.

The regulated entity's CDD beneficial-owner identification
feeds into the central-register filings.

## What to do next

For a complex-structure customer:

1. **Obtain** structure chart from customer;
2. **Map** the layers and identify natural persons;
3. **Calculate** indirect ownership through each layer;
4. **Apply** 25% / control / other-influence tests;
5. **For trust / foundation layers**, identify all relevant
   parties (settlor, trustees, protectors, beneficiaries,
   founder, council, guardian);
6. **Verify** identification of each beneficial owner;
7. **Document** the analysis;
8. **File** central-register report as required.

## Pitfalls

- **Calculation errors**: indirect ownership multiplies along
  the chain;
- **Missing trust / foundation parties**: settlor / founder
  often missed for entity customers behind these vehicles;
- **Senior-managing-official misuse**: a backstop, not a
  default;
- **Stale BO information**: refresh when structure changes.

## Cross-references

- [`customer-due-diligence.md`](./customer-due-diligence.md)
- [`../../registries/beneficial-ownership.md`](../../registries/beneficial-ownership.md)
