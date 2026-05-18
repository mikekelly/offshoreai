---
title: "Worked Example: Jersey TopCo Above UK Opco, Listing on LSE"
jurisdiction: jersey
category: use-cases
persona: founder-entrepreneur
status: draft
last_verified: 2026-05-18
tags:
  - jersey
  - founder-entrepreneur
  - worked-example
  - topco-structure
  - lse-listing
  - pre-ipo
  - persona-founder-entrepreneur
  - use-case
see_also:
  - ./index.md
  - ./topco-tax.md
  - ./migration-pre-ipo.md
  - ./pillar-two-impact.md
---

# Worked Example: Jersey TopCo Above UK Opco, Listing on LSE

## The scenario

Your UK private company (let's call it **TechCo Limited**)
is preparing to list on the **London Stock Exchange**'s
Main Market. You've decided — on tax, capital-flexibility,
and investor-comfort grounds — to insert a **Jersey
holding company** ("TopCo") above the UK operating
business as part of the pre-IPO restructuring.

This worked example walks the structural and legal layers
end to end.

## The end-state structure

```
                       Public investors
                              |
                              v
                    [Jersey TopCo] (listed on LSE)
                              |
                              v
                      [TechCo Limited]
                       (UK operating co.)
```

## Step-by-step

### Step 1 — Incorporate the Jersey TopCo

**Vehicle**: Jersey public company limited by shares
under the **Companies (Jersey) Law 1991** (CJL 1991).

- **Memorandum and Articles** drafted for IPO-readiness;
- **Authorised share capital** (Jersey reformed away from
  this concept — issued capital with no-par-value shares
  is common);
- **At least two directors** initially (extendable);
- **Jersey-resident** corporate services provider for the
  registered office;
- **Beneficial-ownership** information lodged with the
  Companies Registry (private register).

Timeline: **1-3 days** to incorporate. See
[`../../companies/index.md`](../../companies/index.md).

### Step 2 — Share-for-share exchange

The UK shareholders of TechCo Limited **exchange their
UK shares for Jersey TopCo shares** on a 1:1 (or other
specified) ratio:

- **TopCo issues** new shares to the UK shareholders;
- **Shareholders transfer** their UK TechCo shares to
  TopCo;
- **Result**: TopCo owns 100% of UK TechCo; UK
  shareholders own equivalent stakes in Jersey TopCo.

**Tax considerations**:

- **UK tax**: Share-for-share rollover relief under TCGA
  s.135 generally available (subject to anti-avoidance
  rules), deferring CGT on the exchange;
- **Stamp duty**: 0.5% UK stamp duty potentially payable
  on the transfer of UK shares to TopCo (specific reliefs
  may apply for genuine corporate restructurings);
- **Jersey tax**: No Jersey corporate tax issue on the
  exchange (Jersey has no general capital-gains tax;
  Jersey-source income is taxed under the zero-ten
  regime).

See [`migration-pre-ipo.md`](migration-pre-ipo.md).

### Step 3 — Jersey TopCo tax position

The TopCo is a **Jersey-resident company** for tax
purposes (incorporated in Jersey; management and control
in Jersey through the Jersey-resident directors).

**Income tax**: Under the **Income Tax (Jersey) Law
1961** zero-ten regime:

- **0%** standard corporate income tax for most income;
- **10%** for financial-services companies;
- **20%** for utility / quarrying / cannabis / property
  income.

For a generic holding company, the rate is **0%**. See
[`../../tax/zero-ten.md`](../../tax/zero-ten.md).

**Economic substance** under the **Taxation (Companies —
Economic Substance) (Jersey) Law 2019**: A pure holding
company benefits from a **reduced substance test** — must
have adequate human resources and premises in Jersey but
the bar is low.

See [`../../tax/economic-substance.md`](../../tax/economic-substance.md).

### Step 4 — Pillar Two consideration

If the consolidated group (TopCo + UK Opco + any
subsidiaries) has **annual revenue ≥ EUR 750 million**,
**Pillar Two** applies:

- **MCIT Law 2025**: Jersey introduced a 15% **QDMTT-
  equivalent** effective 1 January 2025;
- The TopCo's Jersey-source income is **topped up to
  15%** rather than ceded to the UK under the IIR;
- **UK Pillar Two** implementation runs in parallel;
- **Group consolidation tests** apply.

For **smaller groups** below the threshold, Pillar Two
doesn't engage and the 0% zero-ten position continues.

See [`pillar-two-impact.md`](pillar-two-impact.md) and
[`../../tax/pillar-two.md`](../../tax/pillar-two.md).

### Step 5 — Capital structure

Jersey companies offer **substantial capital flexibility**
useful for IPO-stage corporates:

- **Multiple classes** of shares (founder, investor,
  public);
- **Treasury shares** permitted;
- **Capital reductions** by special-resolution + solvency
  statement procedure (less court-intensive than UK);
- **No par value** shares standard;
- **Redeemable** shares;
- **Buy-backs** authorised by share-buyback regime.

These features are typically used to:

- **Class** founder vs investor vs public shares with
  different rights;
- **Manage** post-IPO buybacks and treasury operations;
- **Implement** specific anti-takeover provisions (where
  permitted).

### Step 6 — Listing on LSE

Jersey TopCos are **routinely accepted** by the LSE:

- **Premium / Standard / High-Growth segments** all
  available;
- **UK Listing Rules** apply (including Disclosure and
  Transparency Rules, Market Abuse Regulation,
  Prospectus Regulation);
- **UK takeover code** applies to Jersey-incorporated
  companies that have securities admitted to a UK
  regulated market;
- **Specific** Jersey-law confirmations required in the
  prospectus (Jersey legal opinions, Jersey corporate
  authorities, etc.).

A **prospectus** is required (or an admission-document
equivalent for AIM listings). Jersey advocates work
alongside UK securities counsel on the disclosure.

See [`listing-rule-overlay.md`](listing-rule-overlay.md).

### Step 7 — Post-IPO governance

After listing:

- **UK Corporate Governance Code** applies (Jersey
  companies admitted to UK regulated markets are within
  scope);
- **JFSC** does not generally regulate the TopCo per se
  (unless it carries on regulated business);
- **Jersey companies registry** filings continue
  (annual return, beneficial ownership);
- **Board** typically has a mix of executive and non-
  executive directors, with at least one Jersey-resident
  director for substance.

### Step 8 — Dividends and distributions

The TopCo can pay dividends to public shareholders:

- **Solvency-based** distributions under CJL 1991 (no
  retained-earnings test like English company law);
- **Withholding tax**: typically **0%** on dividends paid
  by a Jersey company to non-Jersey-resident
  shareholders;
- **UK shareholders**: subject to UK income tax on
  dividends; UK dividend allowance applies.

See [`../../tax/withholding-on-dividends.md`](../../tax/withholding-on-dividends.md)
and [`distributions-mechanics.md`](distributions-mechanics.md).

## Why this structure

The **Jersey TopCo / UK Opco / LSE listing** combination
delivers:

| Benefit | Mechanism |
|---|---|
| **No Jersey corporate tax** on TopCo income | Zero-ten 0% rate |
| **No Jersey withholding tax** on dividends | Jersey's no-WHT regime |
| **Capital flexibility** for IPO economics | CJL 1991 share-structure rules |
| **UK Listing Rules compliance** maintained | Jersey companies routinely accepted |
| **UK Takeover Code** still applies | Statutory extension to Jersey-incorporated regulated-market listed companies |
| **Substantive substance** in Jersey at reduced cost | Holding-company substance test |
| **Pillar Two** managed via QDMTT | MCIT 2025 keeps top-up tax in Jersey |
| **Robust corporate law** with English-trained advocates | Jersey common-law tradition; UK CGC overlay |

## Common variants

### AIM listing rather than Main Market

AIM-listed Jersey TopCos are common — the same structural
logic applies with AIM-specific admission-document
requirements rather than full prospectus.

### Dual-class share structures

Founders sometimes use **dual-class** structures (Class A
super-voting / Class B ordinary) for retained-control
purposes. Jersey CJL 1991 permits these subject to
specific protections.

### Pre-listing reorganisation

A pre-listing reorganisation may also involve:

- **Spinning off** non-core businesses to other
  shareholders;
- **Settling** founder shares into family trusts;
- **Implementing** management-equity programmes;
- **Refinancing** debt at TopCo level.

## Pitfalls

- **Stamp duty leakage** on the share-for-share exchange
  if not structured for relief;
- **UK tax-residence** of TopCo — must be managed
  carefully via Jersey-based directors and decision-
  making;
- **Pillar Two** triggers if the group is in scope;
- **Listing-specific** UK-law requirements (FCA
  prospectus approval, sponsor / nomad relationship,
  market-abuse compliance);
- **Substance** — pure-paper Jersey presence won't
  satisfy substance rules at the TopCo level.

## Cross-references

- [`index.md`](index.md);
- [`topco-tax.md`](topco-tax.md);
- [`migration-pre-ipo.md`](migration-pre-ipo.md);
- [`pillar-two-impact.md`](pillar-two-impact.md);
- [`listing-rule-overlay.md`](listing-rule-overlay.md);
- [`distributions-mechanics.md`](distributions-mechanics.md);
- [`../../companies/index.md`](../../companies/index.md);
- [`../../tax/zero-ten.md`](../../tax/zero-ten.md);
- [`../../tax/economic-substance.md`](../../tax/economic-substance.md);
- [`../../tax/pillar-two.md`](../../tax/pillar-two.md);
- [`../../tax/pillar-two-mcit.md`](../../tax/pillar-two-mcit.md).
