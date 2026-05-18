---
title: Cayman Segregated Portfolio Company (SPC)
jurisdiction: cayman
category: companies
status: draft
last_verified: 2026-05-18
tags:
  - cayman
  - spc
  - segregated-portfolio-company
  - concept-file
sources:
  - title: Companies Act (Cayman Islands) Part XIV — Segregated Portfolio Companies
    url: https://www.gov.ky/
    accessed: 2026-05-18
    kind: statute
see_also:
  - ./companies.md
  - ./exempted-company.md
  - ./funds.md
  - ./index.md
---

# Cayman Segregated Portfolio Company (SPC)

## What it is

A **Segregated Portfolio Company (SPC)** is a Cayman
exempted company that has elected, by reference to Part
XIV of the Companies Act, to operate as a **single legal
entity divided into segregated portfolios**:

- Each **segregated portfolio (SP)** has its own assets
  and liabilities;
- **Statutory segregation** prevents creditors of one SP
  reaching the assets of another;
- **General assets** of the SPC are available to all
  general creditors but **not** to SP creditors except
  through their respective SP;
- A **single legal entity** with multiple bankruptcy-
  remote pockets.

Cayman SPCs are the **Cayman equivalent** of:

- Bermuda **Segregated Accounts Company (SAC)**;
- BVI **Segregated Portfolio Company** (statute mirrors
  Cayman);
- Guernsey **Protected Cell Company (PCC)** (invented in
  Guernsey);
- Jersey **PCC** (Loi équivalent).

Together these are the "cell company" family.

## Why SPCs exist

The problem an SPC solves: a sponsor wants **multiple
distinct pools** of capital, risk, and investors —
typically because each pool has different investment
strategies, fee terms, or risk profiles — but doesn't
want to form a separate company for each.

Forming separate companies has costs:

- Multiple incorporations and annual fees;
- Multiple sets of directors, registered offices,
  compliance reporting;
- Duplicative governance overhead.

An SPC achieves the **same segregation outcome** with:

- One legal entity;
- One board of directors;
- One registered office;
- One audit (with portfolio-level reporting);
- One set of regulatory filings (with portfolio-level
  detail).

The trade-off: SPC use depends on the statutory
segregation being respected by foreign courts and
counterparties, which is generally well-established for
Cayman but not universal.

## Formation

An SPC is created by:

1. **Incorporating** as a Cayman exempted company **or**
   **converting** an existing exempted company;
2. **Filing notice** with the Registrar electing SPC
   status;
3. **Specifying** the initial segregated portfolios in
   the constitutional documents or by board resolution.

New segregated portfolios can be added by board
resolution. Closing portfolios follows specific
procedural requirements.

## Operating an SPC

### Naming and identification

When acting in respect of a specific portfolio, the SPC
must:

- **Identify itself** as "[SPC name] acting in respect
  of [portfolio name]";
- **Contract** on behalf of the specific portfolio (not
  the SPC at large);
- **Maintain** records segregating assets and
  liabilities by portfolio;
- **Issue** portfolio-specific shares (where investor-
  pool segregation is wanted).

Failure to identify the portfolio properly risks
**piercing the segregation veil** — the obligation may
become an SPC-general obligation rather than a portfolio-
specific one.

### Portfolio shares vs general shares

An SPC has:

- **General shares** — entitle to general assets
  (typically minimal);
- **Portfolio shares** — entitle to the assets of a
  specific portfolio (the substantive investor stake).

Investors in a given portfolio hold the portfolio shares
of that portfolio. Cross-investment between portfolios is
possible but uncommon.

### Cross-portfolio dealings

The SPC can enter into transactions between portfolios
("internal hedges", for example) — these are recorded as
contracts between the SPC-as-portfolio-A and the SPC-as-
portfolio-B. They must be properly documented to be
respected.

## Use cases

### Multi-strategy hedge funds

A sponsor running multiple hedge-fund strategies
(equity long-short + credit + macro) can operate them
through a single SPC with portfolios for each strategy:

- **Common board, administrator, custodian**;
- **Portfolio-specific** investment management,
  performance fees, and investor stakes;
- **Investor choice** of strategy.

### Insurance / reinsurance segregation

A specialty insurer can issue multiple captive lines or
reinsurance arrangements through one SPC, each in its own
portfolio. Common in the Cayman insurance market.

### Securitisation conduits

Where a sponsor wants a structured-finance conduit issuing
multiple securitisation series, each series can be a
portfolio of an SPC. Bankruptcy-remote at the series
level.

### Family-office multi-strategy

Family offices running multiple investment strategies or
holdings can use SPC structure for internal segregation
between strategies.

## Cross-portfolio risk

The statutory segregation is **strong but not absolute**:

- **Cayman courts** routinely respect the segregation;
- **Foreign courts** may or may not respect it depending
  on jurisdiction and circumstance;
- **Improper portfolio identification** can lead to
  pooling;
- **Common services** (administrator, custodian, audit)
  do not break segregation, but joint counterparties
  exposed to multiple portfolios must contract carefully.

In practice, SPCs are accepted in most major financial-
market jurisdictions, but counterparties may insist on
specific contractual protections (subordination of inter-
portfolio claims, recognition of segregation, etc.).

## Comparison with cell-company variants

| Feature | Cayman SPC | Bermuda SAC | Guernsey PCC | Guernsey ICC |
|---|---|---|---|---|
| Single legal entity | Yes | Yes | Yes | **No — each cell is its own entity** |
| Statutory segregation | ✅ | ✅ | ✅ | ✅ (legal-personality basis) |
| Vintage | 1998 | 2000 | 1997 (the original) | Later |
| Insurance focus | Used | **Primary use** | Used | Used |
| Funds focus | Used | Less common | Used | Used |

The Guernsey ICC (Incorporated Cell Company) goes a step
further than the PCC — each cell has its own separate
legal personality, eliminating any residual cross-cell
risk. Cayman has no statutory ICC equivalent; an Cayman
ICC-style outcome requires forming separate companies.

## Tax treatment

- Each portfolio is treated **economically** as a separate
  fund / investment vehicle;
- **Cayman tax**: none directly;
- **Investor jurisdiction tax**: depends on the
  portfolio's classification (typically as a pass-through
  vehicle or a corporation — see local rules);
- **CRS / FATCA**: portfolio-level reporting in most
  cases.

## Regulatory perimeter

- **Mutual Funds Act / Private Funds Act** apply at the
  portfolio level if the portfolio is a regulated fund;
- **CIMA registration** for each fund portfolio
  separately;
- **Insurance Act** applies at portfolio level for
  insurance SPCs.

## Pitfalls

- **Sloppy portfolio identification** in contracting
  breaks the segregation;
- **Common counterparties** may require recognition
  language;
- **Foreign-court** non-recognition risk for international
  contracts;
- **Cross-portfolio** transactions need proper
  documentation;
- **Tax classification** can differ portfolio-by-
  portfolio.

## Cross-references

- [`companies.md`](companies.md);
- [`exempted-company.md`](exempted-company.md);
- [`exempted-limited-partnership.md`](exempted-limited-partnership.md);
- [`funds.md`](funds.md);
- [`insurance.md`](insurance.md);
- [`private-funds-act.md`](private-funds-act.md);
- [`../bermuda/insurance.md`](../bermuda/insurance.md);
- [`../guernsey/funds.md`](../guernsey/funds.md);
- [`../jersey/companies/index.md`](../jersey/companies/index.md);
- [`index.md`](index.md).
