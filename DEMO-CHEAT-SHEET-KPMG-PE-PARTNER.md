---
title: Demo Cheat-Sheet — KPMG Crown Dependencies PE Partner
audience: Senior commercial PE adviser
prepared: 2026-05-18
last_revised: 2026-05-19
status: demo-prep
---

# Demo Cheat-Sheet — KPMG Crown Dependencies PE Partner

## The audience

KPMG partner, Crown Dependencies, Private Equity Group.
Expertise: Alt Investments, Fin Services, High Growth
Markets, HNWIs, Investment Management, PE, Small
Entities, Trusts and Estates, VC Funds.

This is a **senior commercial advisor**, not a generalist
tax/audit person. Has seen everything. Will spot a thin
answer in 30 seconds. Will be impressed by **operational
depth**, **currency**, **historical perspective**, and
**practitioner voice**.

## What's new since the original cheat-sheet

The corpus has materially grown since this cheat-sheet was
first drafted on 18 May 2026. New capabilities to leverage
in the demo:

- **`knowledge/jersey/history/finance/`** with five time-
  horizon retrospectives (last 2 / 5 / 10 / 25 years +
  trajectory synthesis) — gives senior commercial advisor
  the "how did Jersey get here" strategic narrative for
  the dominant sector; non-finance sectors (real estate,
  retail, construction, digital, tourism, agriculture)
  are flagged as expansion targets;
- **`knowledge/jersey/economy/index.md`** — Jersey's
  economy in shape and proportion: GDP partition (~40%
  finance / ~60% everything else) with short summaries
  of real estate, public sector, retail, construction,
  digital, tourism, agriculture. Lets the agent give a
  defensible answer to *"how is Jersey's economy
  structured?"* without defaulting to *"it's just finance"*;
- **`knowledge/jersey/history/finance/sources.md`** with 45 verified
  high-reputation sources (IMF, MoneyVal, OECD, Bain,
  McKinsey, BCG, KPMG, PwC, EY, Deloitte, Capgemini,
  Capital Economics, Cebr, TheCityUK, Monterey, Z/Yen,
  Tax Justice Network) — gives the demo source-cited
  rigor;
- **`knowledge/jersey/history/finance/regulatory-milestones.md`** — Edwards Report
  1998, IMF FSAP 2009, MoneyVal 4th→5th round 2016-2024;
- **`knowledge/jersey/history/finance/gaps.md`** — explicit knowledge-graph gap
  tracking with 13 of 14 closed; the
  **honesty mechanism** is itself a credibility signal;
- **Continuation funds doctrinal corpus** —
  `knowledge/jersey/funds/continuation-funds.md` and
  `knowledge/guernsey/continuation-funds.md` (legal architecture,
  separate from the decay-managed frontier file);
- **Sustainable finance doctrinal corpus** —
  `jersey/sustainable-finance/{index,sfdr}.md`;
- **Digital assets doctrinal index** —
  `knowledge/jersey/digital-assets/index.md`;
- **Bermuda CIT 2023 dedicated file** —
  `knowledge/bermuda/corporate-income-tax-2023.md`;
- **JFSC 2026-2030 Strategy + FSCP files** — the
  strategic-direction layer;
- **Innovation Council file** — the digital-assets
  coordination body;
- **CARF (Crypto-Asset Reporting Framework) file** —
  closing the transparency-arc through to digital assets;
- **Showcase eval at 29/29 PASS** (was 26/26) — three
  frontier questions added (UK carry, continuation
  funds, AIFMD II) all PASS.
- **Bespoke streaming web UI** at
  [`packages/web`](./packages/web/) — the recommended
  demo surface (not raw CLI). Renders each cited corpus
  file as a linked primary source (statute / regulator
  guidance / gov.je) with a freshness badge, plus
  per-article pinpoint chips that deep-link into
  jerseylaw.je's consolidated text. Every verifier
  attempt is its own visible draft in the transcript
  (Verified ✓ / Rejected ✕ / Verification unavailable ⚠)
  — the compliance discipline is itself the
  credibility signal. Threaded conversations support
  follow-ups (resume the SDK session for context). Run
  with `pnpm --filter @offshoreai/web start` →
  http://localhost:3104.

## What to lead with — questions the corpus answers strongly

### Of-the-moment / frontier (5 min slot)

> **"What's happening with UK carried interest from
> 6 April 2026, and what are Crown Dependencies clients
> actually doing about it?"**

Pulls from [`knowledge/frontier/uk-carried-interest-reform-2026.md`](./knowledge/frontier/uk-carried-interest-reform-2026.md).
Demonstrates: currency (effective just last month);
specific numbers (72.5% multiplier, 34.1% effective
rate); operator-shaped voice; Crown Dependencies
residency-planning angle. **Showcase eval PASS.**

> **"AIFMD II just kicked in — what changed for my
> Jersey AIFM clients marketing into Germany via NPPR?"**

Pulls from [`knowledge/frontier/aifmd-ii-april-2026.md`](./knowledge/frontier/aifmd-ii-april-2026.md).
**Showcase eval PASS.** Identifies the counterintuitive
positioning (tightened EU delegation makes direct CI
AIFMs more attractive).

> **"What's driving the continuation-funds surge, why is
> Guernsey winning so much, and what's the typical
> structure?"**

Pulls from BOTH:

- [`knowledge/frontier/continuation-funds-and-gp-led-secondaries.md`](./knowledge/frontier/continuation-funds-and-gp-led-secondaries.md)
  (market dynamics, 46% adoption stat);
- [`knowledge/jersey/funds/continuation-funds.md`](./knowledge/jersey/funds/continuation-funds.md)
  and [`knowledge/guernsey/continuation-funds.md`](./knowledge/guernsey/continuation-funds.md)
  (legal architecture, not-a-CIS treatment, 3-business-
  day GFSC approval, transaction structure).

**Showcase eval PASS.** This is now a doctrinal-plus-
frontier dual answer — the **strongest single demo
moment** for this audience.

### Historical and strategic narrative (5 min slot — NEW)

> **"How did Jersey get to the position it's in now?
> Walk me through the trajectory."**

Pulls from [`knowledge/jersey/history/finance/trajectory.md`](./knowledge/jersey/history/finance/trajectory.md).
**The "four acts"** narrative: Modernisation (2001-2008) →
Re-regulation (2009-2015) → Build-and-Validate (2016-
2023) → Validation-and-Offensive-Posture (2024-2026).
Cites IMF FSAP 2009, MoneyVal 4th→5th round, Bain PE
since 2010, Monterey since 1995. Five structural
through-lines (build-respond-embed-validate cycle;
transparency arc; product-mix sophistication; Crown
Dependencies cluster; sophistication-over-scale).

> **"What's the 2016 vs 2024 MoneyVal arc, and what does
> it mean for Jersey going forward?"**

Pulls from [`knowledge/jersey/history/finance/regulatory-milestones.md`](./knowledge/jersey/history/finance/regulatory-milestones.md)
and [`knowledge/jersey/aml-cft/moneyval.md`](./knowledge/jersey/aml-cft/moneyval.md).
Clean 8-year narrative: identifiable gaps → top tier.
Enables the offensive-posture pivot articulated in
[`knowledge/jersey/financial-regulation/jfsc-strategy-2026-2030.md`](./knowledge/jersey/financial-regulation/jfsc-strategy-2026-2030.md).

> **"Show me the source base."**

Pulls from [`knowledge/jersey/history/finance/sources.md`](./knowledge/jersey/history/finance/sources.md).
45 verified sources organised across nine categories
(supranational regulator, local regulator/government,
Jersey-commissioned, Big 4, strategy consulting,
industry data, index series, counterweight, professional
bodies).

### Cross-jurisdictional comparison

> **"I'm an emerging PE manager launching my first sub-
> $100m fund. Compare Jersey JPF vs Cayman ELP vs BVI
> Approved Fund vs Guernsey PIF for me."**

Showcase question `show-fund-routes`, PASS. Cites 7
files across all 4 jurisdictions. Clean decision
framework.

> **"Where should I put my captive insurance — Bermuda,
> Cayman, or Guernsey?"**

Showcase `show-bermuda-captive`, PASS. Bermuda Class
system; SAC option; Solvency II equivalence; NAIC
qualification.

> **"Bermuda SAC vs Cayman SPC vs Guernsey PCC vs ICC —
> when each?"**

Showcase `show-cell-companies`, PASS.

### Sophisticated structural

> **"Walk me through setting up a Jersey TopCo above a UK
> Opco listing on the LSE — the full step-by-step."**

Worked example at [`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`](./knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md).
9-step structure; UK TCGA s.135 rollover relief;
zero-ten; Substance Law; MCIT 2025; LSE listing rules.

> **"How do I structure international family wealth
> through Jersey for an Italian-domiciled HNW client?"**

Worked example at [`knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`](./knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md).

> **"My client is a Jersey trust beneficiary. The trustee
> made a £15m appointment based on wrong tax advice. How
> do we unwind?"**

Worked example at [`knowledge/jersey/use-cases/international-lawyer/worked-example-contentious-trust-litigation.md`](./knowledge/jersey/use-cases/international-lawyer/worked-example-contentious-trust-litigation.md).

## The corpus's structural showcase pieces

### Top-level synthesis

- [`knowledge/CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md)
  — comparison matrix across six jurisdictions.

- [`knowledge/jersey/history/finance/trajectory.md`](./knowledge/jersey/history/finance/trajectory.md) —
  **NEW** — the four-acts narrative + five structural
  through-lines + 2001-vs-2026 position table.

- [`knowledge/frontier/README.md`](./knowledge/frontier/README.md) — the
  bleeding-edge tracking discipline; explicit `as_of`
  and `expected_decay` frontmatter.

### Evals

- [`evals/showcase.yaml`](evals/showcase.yaml) — **29
  questions, 29 PASS** at showcase-quality bar (was
  26/26 — frontier round added UK carry / continuation
  funds / AIFMD II all PASS). Runners are fresh
  `Explore` subagents constrained to read-only
  filesystem access.

- [`evals/coverage-questions.yaml`](evals/coverage-questions.yaml)
  — 26 questions covering the top-20 audit gaps;
  **26 PASS** under external measurement.

- [`evals/README.md`](./evals/README.md) — the runner
  methodology. The fact that this exists is itself a
  credibility signal.

### Source rigor

- [`knowledge/jersey/history/finance/sources.md`](./knowledge/jersey/history/finance/sources.md) — **NEW** —
  45 verified high-reputation sources across nine
  categories. Includes counterweight perspectives (Tax
  Justice Network) for triangulation.

### Honesty mechanisms

- [`knowledge/jersey/history/finance/gaps.md`](./knowledge/jersey/history/finance/gaps.md) — **NEW** —
  explicit knowledge-graph gap catalogue with priority
  tiering. **13 of 14 gaps closed** as of 2026-05-19.
  Demonstrates: the corpus knows what it doesn't know.

## What to AVOID — genuine remaining gaps

Honest acknowledgement remains a strength. **The corpus
has materially closed prior gaps** but specific
operational depth still pending:

### Operational PE fund mechanics (still thin)

- *"American vs European waterfall mechanics in detail,
  with worked numbers."* — gap; corpus has fund-regime
  framework but not waterfall depth
- *"How does the GP catch-up actually work mechanically?"*
  — gap
- *"Side letter / MFN drafting — when does it trigger?"*
  — gap

### Carried interest taxation specifics (partial)

- *"UK 2025 reform 'qualifying' boundary in detail —
  what makes carry non-qualifying?"* — frontier file has
  the framework but not exhaustive scenarios
- *"Carry vs co-invest distinction for tax — drafting
  best practice?"* — gap

### Audit and financial reporting (still thin)

- *"Fair-value methodology under IPEV guidelines for an
  unlisted infrastructure asset."* — gap
- *"Carry accounting — vesting recognition?"* — gap
- *"NAV strike mechanics for an open-ended fund?"* — gap

This is **KPMG's literal core business**. Honest
acknowledgement is the right play.

### Substance enforcement specifics (statute + framework only)

- *"What JFSC actually inspects during a substance
  review — the detail."* — corpus has statute but not
  inspection practice depth
- *"Tribunal cases on substance breaches."* — gap

### Pillar Two operational specifics for PE (improved but still partial)

- *"Walk me through QDMTT compliance for a portfolio
  holdco with multiple subsidiary chains."* — corpus
  now has both [`knowledge/jersey/international/pillar-two-mcit.md`](./knowledge/jersey/international/pillar-two-mcit.md)
  and [`knowledge/bermuda/corporate-income-tax-2023.md`](./knowledge/bermuda/corporate-income-tax-2023.md);
  comparative depth improved; operational PE walkthrough
  still pending.

## Recommended demo sequence

About 30 minutes (updated):

### Open (3 min)

Frame the corpus: "This is an LLM-wiki-style knowledge
graph for Crown Dependencies + adjacent offshore
jurisdictions. Statute-anchored doctrinal content,
a separate frontier section tracking what's currently
moving, **a history section with five time-horizon
retrospectives anchored in 45 verified third-party
sources**, and two evals — coverage and showcase — both
at full PASS under externally-measured runs."

### Demonstrate currency (5 min)

Open with the UK carried interest question — same as
before. **This will land hardest** because the reform
took effect one month ago and they're dealing with it
daily.

Then show [`knowledge/frontier/uk-carried-interest-reform-2026.md`](./knowledge/frontier/uk-carried-interest-reform-2026.md)
directly so they see the frontmatter discipline.

### Demonstrate strategic narrative (5 min — NEW)

This is **the new demo moment** for this audience.

Open [`knowledge/jersey/history/finance/trajectory.md`](./knowledge/jersey/history/finance/trajectory.md) and
walk through the "four acts" narrative briefly. A senior
PE adviser at KPMG Crown Dependencies will recognise the
period markers (Edwards Report, IMF FSAP, MoneyVal 4th
round build-out, MoneyVal 5th round validation, Pillar
Two, AIFMD II) and the through-lines (transparency arc;
sophistication-over-scale; defensive-to-offensive pivot).

Then show [`knowledge/jersey/history/finance/sources.md`](./knowledge/jersey/history/finance/sources.md) to
demonstrate that the narrative is source-cited.

### Demonstrate depth (8 min)

Pick **one worked example**. Suggest the TopCo IPO
walkthrough — most directly PE-relevant. Show the file
and then run the question through the runner.

Then pull up [`knowledge/CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md)
and show the decision frameworks.

If continuation funds comes up (likely for this
audience), show **both** the frontier file and the new
doctrinal files at
[`knowledge/jersey/funds/continuation-funds.md`](./knowledge/jersey/funds/continuation-funds.md)
and [`knowledge/guernsey/continuation-funds.md`](./knowledge/guernsey/continuation-funds.md)
— demonstrates the architecture: doctrinal corpus for
the stable legal-architecture layer, frontier for the
market-dynamics layer.

### Demonstrate measurement (5 min)

Show [`evals/showcase.yaml`](evals/showcase.yaml) at
29/29. Walk through the scoring methodology and a
question's `expected_facts` / `expected_files` rubric.
Show how the runner is just a fresh Explore subagent.

This signals **engineering discipline**.

### Demonstrate honesty (2 min — NEW)

Show [`knowledge/jersey/history/finance/gaps.md`](./knowledge/jersey/history/finance/gaps.md). Demonstrate
that the corpus **explicitly tracks what it doesn't
know**, with 13 of 14 gaps closed since the catalogue
was first written one day ago. This is the **single
strongest credibility signal** — a knowledge base that
publishes its own gap list is fundamentally different
from a marketing demo.

### Invite probing (3 min)

Invite them to ask anything. Three outcomes:

1. **They ask something the corpus passes** — show the
   answer and walk through the supporting files;
2. **They ask something the corpus refuses honestly** —
   point out that the refusal is the correct behaviour
   and (if not already on the gap list) flag for
   addition;
3. **They ask something the corpus confabulates** —
   would be a serious finding; flag immediately.

### Close (2 min)

Outline the enrichment roadmap they'd expect to see
next:

1. PE fund operating mechanics (waterfall, carry,
   side letters);
2. Carried interest taxation deep-dive (scenarios);
3. Audit and financial reporting (their bread and
   butter);
4. Substance enforcement specifics;
5. Pillar Two PE operational walkthrough;
6. ESG / SFDR Article 8/9 deep-dive scenarios.

Each is roughly 1-2 weeks of work.

## What they will (likely) probe

| Topic | Corpus strength | Prep |
|---|---|---|
| Fund-domicile choice | ✅ Strong | `show-fund-routes` |
| Carried interest UK 2026 reform | ✅ Strong | `frontier/uk-carried-interest...md` |
| Continuation funds | ✅ Strong | `frontier/` + doctrinal `knowledge/jersey/funds/continuation-funds.md` + `knowledge/guernsey/continuation-funds.md` |
| AIFMD II | ✅ Strong | `frontier/aifmd-ii...md` |
| Tokenisation | ✅ Strong | `frontier/` + `knowledge/jersey/digital-assets/index.md` + Innovation Council file |
| SFDR | ✅ Strong | `frontier/` + `jersey/sustainable-finance/{index,sfdr}.md` |
| Pillar Two | ✅ Improved | `knowledge/jersey/international/pillar-two-mcit.md` + `knowledge/bermuda/corporate-income-tax-2023.md` |
| Substance enforcement | 🟡 Statute only | Acknowledge gap |
| Family-office / HNW structuring | ✅ Strong | Worked example available |
| Trusts and estates | ✅ Strong | Article 9 + 47 + 51 worked example |
| Captive insurance | ✅ Strong | `show-bermuda-captive` |
| Life assurance | ✅ Strong | `show-iom-portfolio-bond` |
| Image rights | ✅ Strong | `show-image-rights` |
| **Strategic/historical narrative** | ✅ **NEW Strong** | `knowledge/jersey/history/finance/trajectory.md` |
| **JFSC Strategy + FSCP** | ✅ **NEW Strong** | Two dedicated concept files |
| **Innovation Council** | ✅ **NEW Strong** | `knowledge/jersey/financial-regulation/innovation-council.md` |
| **CARF** | ✅ **NEW Strong** | `knowledge/jersey/international/carf.md` |
| **Bermuda CIT 2023** | ✅ **NEW Strong** | `knowledge/bermuda/corporate-income-tax-2023.md` |
| Fund operating mechanics | ❌ Thin | Acknowledge — pitch enrichment |
| Audit / fair value | ❌ Thin | Acknowledge — KPMG's core business |

## Key talking points

If asked "what makes this different from a generic
offshore-law search tool":

- **Currency** — frontier section explicitly tracks
  what's currently in motion with date-stamped
  decay-managed content;
- **Strategic narrative** — history section with five
  time-horizon retrospectives source-cited to 45
  third-party reports;
- **Voice** — the corpus is operator-shaped (persona Q&A
  files, worked examples);
- **Measured** — two evals (coverage + showcase) with
  every PASS externally measured;
- **Honest refusal** — corpus declines to confabulate
  on gaps and points to the gap catalogue (`knowledge/jersey/history/finance/gaps.md`);
- **Cross-jurisdictional** — six jurisdictions with
  comparison matrices;
- **Threaded** — worked examples weave statute / tax /
  procedure / regulator content in single narratives;
- **Source-cited** — every history claim has a named
  third-party source (IMF, MoneyVal, OECD, Bain,
  McKinsey, BCG, KPMG, PwC, EY, Deloitte, Capgemini,
  Capital Economics, Cebr, TheCityUK, Monterey, Z/Yen,
  Tax Justice Network);
- **Gap transparency** — `knowledge/jersey/history/finance/gaps.md` explicitly
  tracks what the graph is missing.

## Risks to manage

- **Over-claiming the demo** — frontier files just
  written are at v1; substance is good but
  practitioner-voice depth would benefit from review by
  someone with Crown Dependencies practice experience;
- **Stale doctrine** — some doctrinal files have
  `last_verified: 2026-05-17` from prior sessions;
  refresh dates as needed before demo;
- **Source attribution** — the history sources are
  cited with accessed dates; some are paywalled
  (Monterey full reports; some Preqin/PitchBook data);
  verify the publicly-accessible ones resolve before
  demoing;
- **History detail depth** — the four-acts narrative is
  source-cited but is necessarily a synthesis; a senior
  practitioner who lived through the period may push for
  specific deeper-cut detail in places.

## Factual precision — what to be careful about

A peer-agent review of the trajectory doc on 2026-05-19
surfaced specific factual precision issues that were
corrected across the corpus. The key careful-phrasing
points to remember for the demo:

- **JFSC's constituting statute** — the **Financial
  Services Commission (Jersey) Law 1998** (not the
  separately-titled **Financial Services (Jersey) Law
  1998**, which governs financial-services activity);
- **Trust amendment chronology** — Article 9A reserved
  powers were introduced by the **Trusts (Amendment No. 4)
  (Jersey) Law 2006**; the Article 47B–H statutory
  mistake regime was inserted by the **Trusts (Amendment
  No. 6) (Jersey) Law 2013**;
- **MoneyVal 5th round** — say "top-tier technical
  compliance (39/40 C/LC) with strong but still-improvable
  effectiveness (1 High, 6 Substantial, 4 Moderate; no
  Low ratings)" rather than just "top tier";
- **MCIT 2025 mechanics** — Jersey has implemented a
  **QDMTT** and a **Qualified IIR** for accounting periods
  beginning on or after 1 January 2025; Jersey has **not**
  implemented a UTPR;
- **DAC6** — Jersey is not in EU DAC6 scope; Jersey has
  **OECD MDR / DAC6-style mandatory-disclosure
  commitments** under the OECD framework;
- **CARF dates** — Jersey signed the CARF multilateral
  agreement in **November 2024**; domestic regulations
  followed in **2025**; implementation starts **1 January
  2026**; first reports filed and exchanged in **2027**;
- **JPF numbers** — Jersey Finance reports **~750 JPFs as
  of March 2025**; the Government competitiveness report
  cites **~1,500 structures since launch** and **£86.7bn
  administered** — the second figure aggregates structures-
  since-launch rather than the live JPF count;
- **AIFMD II** — refer to **16 April 2026 as the EU
  transposition / application milestone**; for Jersey the
  impact is mainly through NPPR conditions, disclosure,
  Annex IV uplift, and JFSC code alignment;
- **TheCityUK figures** — **£500bn FDI / 951k UK jobs /
  £62bn UK GDP** are presented as **Jersey-attributable**;
  Guernsey reports separate metrics including ~£58bn
  capital flows and insurance/captive contribution;
- **GFCI** — say specifically "**GFCI 39 (March 2026):
  Jersey 38th**, ahead of Guernsey, Isle of Man, and
  Cayman in that index" rather than generic top-50.

## Strategic-narrative tone

The trajectory.md document and history docs were also
softened on triumphalist phrasing per the peer review.
Practitioner-facing language now uses:

- **"Defensible niche, not maximum scale"** instead of
  "most sophisticated";
- **"Increasingly complementary in market perception"**
  instead of "coordinated specialised cluster";
- **Forward-looking sections labelled as planning
  hypotheses** not predictions;
- **Explicit acknowledgement** that Jersey's 2026 strategy
  is **partly a response to competitive friction** (cost,
  speed, service, innovation, digitalisation) — not just
  a victory lap on compliance.

This is the **board-ready calibration**: confident on
factual claims, candid on competitive pressures, careful
on forward-looking inference.

## Quick reference — paths for the demo

```
# History (the strategic narrative)
knowledge/jersey/history/trajectory.md
history/last-2-years.md
knowledge/jersey/history/last-5-years.md
history/last-10-years.md
knowledge/jersey/history/last-25-years.md
history/regulatory-milestones.md
knowledge/jersey/history/sources.md           # bibliography
knowledge/jersey/history/gaps.md              # honesty mechanism

# Frontier (the of-the-moment content)
knowledge/frontier/uk-carried-interest-reform-2026.md
frontier/aifmd-ii-april-2026.md
knowledge/frontier/continuation-funds-and-gp-led-secondaries.md
frontier/tokenisation-jersey-2026.md
knowledge/jersey/frontier/sfdr-2-and-sustainable-finance.md
frontier/jersey-finance-industry-2026.md

# Newly-added doctrinal files (close gaps surfaced by history work)
knowledge/jersey/funds/continuation-funds.md
guernsey/continuation-funds.md
knowledge/jersey/sustainable-finance/index.md
jersey/sustainable-finance/sfdr.md
knowledge/jersey/digital-assets/index.md
jersey/financial-regulation/jfsc-strategy-2026-2030.md
knowledge/jersey/financial-regulation/innovation-council.md
jersey/government/financial-services-competitiveness-programme.md
knowledge/jersey/international/carf.md
bermuda/corporate-income-tax-2023.md

# Worked examples (the depth content)
knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md
jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md
knowledge/jersey/use-cases/international-lawyer/worked-example-contentious-trust-litigation.md

# Synthesis
knowledge/CROSS-JURISDICTIONAL-MAP.md

# Measurement
evals/showcase.yaml         # 29/29 PASS
evals/coverage-questions.yaml   # 26/26 PASS
evals/README.md
```

## Summary of changes vs original cheat-sheet

The corpus has matured along three dimensions since the
original cheat-sheet (one day ago):

1. **Strategic-narrative layer** — the `history/` directory
   gives a senior PE adviser the "how did Jersey get here"
   trajectory that complements the doctrinal and frontier
   layers;
2. **Source-cited rigor** — 45 verified third-party
   sources cited inline across the history docs;
3. **Honesty mechanism** — `knowledge/jersey/history/finance/gaps.md` explicitly
   tracks what's missing, with 13 of 14 closed.

The single biggest **new demo moment** is the strategic-
narrative section. The single biggest **new credibility
signal** is the gaps catalogue.
