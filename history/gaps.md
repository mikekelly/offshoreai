---
title: Knowledge-Graph Gaps Exposed by History Docs
status: stable
last_verified: 2026-05-19
tags:
  - history
  - gaps
  - knowledge-graph-meta
  - audit
see_also:
  - ./README.md
  - ./sources.md
  - ../jersey/COVERAGE-AUDIT.md
---

# Knowledge-Graph Gaps Exposed by History Docs

## What this is

While building the five [time-horizon history docs](README.md),
several places in the narrative wanted to inline-link to a
doctrinal concept file that **does not yet exist** in the
corpus. This file catalogues those gaps so the next pass of
graph-building can close them.

This is **complementary to** the per-jurisdiction
[`COVERAGE-AUDIT.md`](../jersey/COVERAGE-AUDIT.md), which is
audit-driven from statutes-down; this file is **narrative-
driven from history docs upward**.

## Gap classification

| Tier | Meaning |
|---|---|
| **P0** | Blocks a major narrative claim across multiple history docs |
| **P1** | Wanted inline at a specific point; workaround uses a less-specific file or footnote |
| **P2** | Nice-to-have for completeness; current workaround is fine |

## P0 — Major narrative-supporting concepts missing

### G-001 — Bermuda CIT 2023 dedicated file

**Wanted as**: `bermuda/corporate-income-tax-2023.md`

**Currently lands at**: `bermuda/tax.md` (general)

**Why it matters**: The Bermuda Corporate Income Tax Act
2023 is referenced across `last-2-years.md`, `last-5-years.md`,
`last-10-years.md`, `last-25-years.md`, `trajectory.md`,
and the doctrinal corpus. It's the Bermuda-cluster
equivalent of [Jersey's MCIT 2025](../jersey/international/pillar-two-mcit.md)
and a top-line Pillar Two implementation event. Deserves
its own concept file with effective date, rate, scope,
QDMTT mechanics, transition rules, and contrast with
Jersey MCIT.

**Indicative depth**: ~150-200 line concept file.

### G-002 — Continuation funds doctrinal corpus

**Wanted as**: `jersey/funds/continuation-funds.md` and/or
`guernsey/continuation-funds.md`

**Currently lands at**: `frontier/continuation-funds-and-gp-led-secondaries.md`
(decay-managed) only

**Why it matters**: The frontier file is decay-managed
(6-month refresh). Continuation funds are now a structural
product line, not a frontier topic. The doctrinal layer
should have stable concept files on:

- single-asset continuation funds;
- multi-asset continuation funds;
- strip sale mechanics;
- tender-offer transactions;
- GFSC 3-business-day approval mechanics (Guernsey);
- LP rollover/cash election mechanics;
- carry crystallisation mechanics;
- conflict-of-interest committees and fairness opinions.

**Indicative depth**: 4-6 concept files.

### G-003 — Sustainable finance / SFDR doctrinal corpus

**Wanted as**: `jersey/sustainable-finance/index.md` plus
concept files on SFDR 1.0, taxonomy regulation, sustainable
fund classifications, greenwashing risk

**Currently lands at**: `frontier/sfdr-2-and-sustainable-finance.md`
(decay-managed) only

**Why it matters**: Same reasoning as G-002. SFDR 1.0 has
been operationally in force since 2021 and is structurally
mature; it should be in the doctrinal layer. SFDR 2.0
remains rightly in `frontier/`.

**Indicative depth**: 3-5 concept files.

## P1 — Specific concept files wanted at named points

### G-004 — Innovation Council 2025

**Wanted as**: `jersey/financial-regulation/innovation-council.md`
or `jersey/registries/innovation-council.md`

**Currently lands at**: passing mention in
`frontier/tokenisation-jersey-2026.md`

**Why it matters**: Referenced in `last-2-years.md`,
`last-10-years.md`, `frontier/jersey-finance-industry-2026.md`,
`frontier/tokenisation-jersey-2026.md`, and the demo
cheat-sheet. The Innovation Council is now a load-bearing
regulatory body for the digital-assets vertical.

### G-005 — JFSC 2026-2030 Strategy concept file

**Wanted as**: `jersey/financial-regulation/jfsc-strategy-2026-2030.md`

**Currently lands at**: passing mentions in `frontier/`
and `history/` only

**Why it matters**: The Strategy is the regulator's first
explicit five-year articulation and the operational
framework that next-cycle work will sit under. Deserves
a concept file capturing the four priorities, the
implementation roadmap, and the deliverables.

### G-006 — Financial Services Competitiveness Programme (FSCP)

**Wanted as**: `jersey/government/financial-services-competitiveness-programme.md`

**Currently lands at**: passing mentions only

**Why it matters**: The Government's 10-year economic-policy
counterpart to the JFSC 2026-2030 Strategy. Co-load-bearing
with G-005.

### G-007 — CARF (Crypto-Asset Reporting Framework)

**Wanted as**: `jersey/international/carf.md`

**Currently lands at**: nowhere (only referenced in
`history/last-25-years.md` and `last-5-years.md`)

**Why it matters**: CARF is the next-generation extension
of [CRS](../jersey/international/crs.md) for crypto-assets.
Jersey is a CARF-aligned jurisdiction. Should sit alongside
[CRS](../jersey/international/crs.md), [FATCA](../jersey/international/fatca.md),
and [DAC6](../jersey/international/dac6.md) in the
international-information-exchange suite.

### G-008 — Bermuda CIT 2023 dedicated (cross-listed; see G-001)

See G-001 above.

### G-009 — Edwards Report 1998 historical context

**Wanted as**: `jersey/history/edwards-report-1998.md`

**Currently lands at**: passing mention in
`last-25-years.md`

**Why it matters**: The Edwards Report (Andrew Edwards'
1998 *Review of Financial Regulation in the Crown
Dependencies* for HM Treasury) is the foundational policy
document underpinning the FSL 1998 / JFSC architecture.
A short concept file would close a historical-context
gap.

**Note**: lower priority than G-001 to G-008 because
historical context can sit in `history/` rather than the
doctrinal corpus.

## P2 — Nice-to-have additions

### G-010 — Guernsey continuation-fund specific files

**Wanted as**: `guernsey/continuation-funds-single-asset.md`,
`guernsey/gfsc-fast-track-approvals.md`

**Why it matters**: Guernsey's specific continuation-fund
edge (3-business-day GFSC approval, single-asset CFs as
not-CIS) is the cleanest cross-jurisdictional differentiator
in continuation-fund work. Currently lives in `frontier/`
and the Guernsey overview only.

### G-011 — Tokenisation concept files in doctrinal corpus

**Wanted as**: `jersey/digital-assets/tokenisation.md`,
`jersey/digital-assets/security-tokens.md`,
`jersey/digital-assets/stablecoins.md`,
`jersey/digital-assets/index.md`

**Currently lands at**: `frontier/tokenisation-jersey-2026.md`,
`jersey/registries/vasp-register.md`

**Why it matters**: Similar to G-002 / G-003 — the
doctrinal layer should hold the stable concept files
while frontier holds the timely / changing layer.

### G-012 — IMF Jersey FSAP 2009 historical reference file

**Wanted as**: `history/imf-fsap-2009.md` or
`jersey/financial-regulation/imf-fsap-2009.md`

**Why it matters**: The 2009 IMF FSAP is a load-bearing
historical regulatory event and the most recent IMF FSAP
for Jersey. A short file capturing its findings,
recommendations, and how Jersey responded would close a
gap.

### G-013 — MoneyVal 4th round 2016 historical reference file

**Wanted as**: `history/moneyval-4th-round-2016.md` or
section in existing `jersey/aml-cft/moneyval.md`

**Currently lands at**: `jersey/aml-cft/moneyval.md`
(present-state file)

**Why it matters**: The 2016 → 2024 MoneyVal arc is the
single cleanest narrative thread of the modern era and
deserves a dedicated 4th-round-specific file capturing
the gaps identified and the build-out programme that
followed.

### G-014 — Capital Economics / TheCityUK research index

**Wanted as**: `history/external-research-history.md`

**Why it matters**: A short index of the major Jersey-
commissioned external research (Capital Economics 2014/2016,
Cebr 2021, TheCityUK 2026) showing what each measured and
how methodologies compared would be useful for orienting
the narrative claims.

## Approach to closing gaps

The graph evolves naturally — gaps surface when narratives
want to link to concept files that don't exist yet. The
approach for closing these:

1. **P0 first** (G-001 to G-003) — each closes structural
   linking across multiple history docs and the doctrinal
   corpus;
2. **P1 next** (G-004 to G-009) — close named linking
   points;
3. **P2 opportunistic** — close when in the area for
   adjacent work.

Each gap close should:

- Create the concept file with proper frontmatter,
  `last_verified`, sources, and cross-references;
- Update the history docs to link inline rather than via
  this gap-file footnote;
- Update [`sources.md`](sources.md) with any new sources;
- Add tags as needed per [`../TAGS.md`](../TAGS.md).

## Tracking

This file should be updated as gaps are closed (mark each
as "closed by [path/to/new-file.md]") and as new gaps are
identified during future history / frontier work.

## Cross-references

- [`./README.md`](./README.md);
- [`./sources.md`](./sources.md);
- [`../jersey/COVERAGE-AUDIT.md`](../jersey/COVERAGE-AUDIT.md) —
  the per-statute audit for Jersey
- [`../frontier/README.md`](../frontier/README.md);
- [`../KNOWLEDGE-BASE-PRINCIPLES.md`](../KNOWLEDGE-BASE-PRINCIPLES.md).
