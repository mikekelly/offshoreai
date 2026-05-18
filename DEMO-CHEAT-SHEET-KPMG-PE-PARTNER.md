---
title: Demo Cheat-Sheet — KPMG Crown Dependencies PE Partner
audience: Senior commercial PE adviser
prepared: 2026-05-18
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
depth**, **currency**, and **practitioner voice**.

## What to lead with — questions the corpus answers strongly

These are the "show your strongest hand" questions to
open the demo. Each links to the underlying files and the
showcase eval where it passed.

### Of-the-moment / frontier

> **"What's happening with UK carried interest from
> 6 April 2026, and what are Crown Dependencies clients
> actually doing about it?"**

Pulls from [`frontier/uk-carried-interest-reform-2026.md`](frontier/uk-carried-interest-reform-2026.md).
Demonstrates: currency (effective just last month);
specific numbers (72.5% multiplier, 34.1% effective
rate); operator-shaped voice on what practitioners did
(acceleration before 5 April 2026); Crown Dependencies
residency-planning angle. **The single most timely PE-
tax topic.**

> **"AIFMD II just kicked in — what changed for my
> Jersey AIFM clients marketing into Germany via NPPR?"**

Pulls from [`frontier/aifmd-ii-april-2026.md`](frontier/aifmd-ii-april-2026.md).
Demonstrates: currency (effective 16 April 2026); the
specific narrow Channel Islands impact (expanded
disclosure + Annex IV); the JFSC AIF Code split into
EU + UK codes; the counterintuitive competitive
positioning.

> **"What's driving the continuation-funds surge, why is
> Guernsey winning so much, and what's the typical
> structure?"**

Pulls from [`frontier/continuation-funds-and-gp-led-secondaries.md`](frontier/continuation-funds-and-gp-led-secondaries.md).
Demonstrates: the 2026 Global PE Outlook survey (46%
using GP-led, doubling); why Guernsey is positioned
(single-asset CFs not regulated as CIS; 3-business-day
approval); the full structure walkthrough; conflicts /
LPAC consent / carry crystallisation.

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

Worked example at [`jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`](jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md).
9-step structure; UK TCGA s.135 rollover relief;
zero-ten; Substance Law; MCIT 2025; LSE listing rules.

> **"How do I structure international family wealth
> through Jersey for an Italian-domiciled HNW client?"**

Worked example at [`jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`](jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md).
Article 9 firewall + Italian legittima; US blocker;
PTC option; CRS / FATCA / DAC6 / TRS reporting.

> **"My client is a Jersey trust beneficiary. The trustee
> made a £15m appointment based on wrong tax advice. How
> do we unwind?"**

Worked example at [`jersey/use-cases/international-lawyer/worked-example-contentious-trust-litigation.md`](jersey/use-cases/international-lawyer/worked-example-contentious-trust-litigation.md).
Article 47B-J mistake regime; Re S&T Trusts three-limb
test; rejection of Pitt v Holt distinction; Royal Court
Representation procedure.

## The corpus's structural showcase pieces

### Top-level synthesis

- [`CROSS-JURISDICTIONAL-MAP.md`](CROSS-JURISDICTIONAL-MAP.md)
  — comparison matrix across all six jurisdictions for
  trust regime, fund regime, manager regime, company
  form, cell company, captive insurance, life
  assurance, tax / Pillar Two, Solvency II equivalence,
  substance — with decision frameworks.

- [`frontier/README.md`](frontier/README.md) — the
  bleeding-edge tracking discipline; explicit
  `as_of` dates; decay-managed.

### Evals

- [`evals/showcase.yaml`](evals/showcase.yaml) — 26
  questions, **26 PASS** at showcase-quality bar
  (substance + Jersey-specificity + operational voice +
  citation density + tightness). Runners are fresh
  `Explore` subagents constrained to read-only
  filesystem access.

- [`evals/coverage-questions.yaml`](evals/coverage-questions.yaml)
  — 26 questions covering the top-20 audit gaps;
  **26 PASS** under external measurement.

- [`evals/README.md`](evals/README.md) — the runner
  methodology. The fact that this exists is itself a
  credibility signal.

## What to AVOID — questions the corpus is currently thin on

If the partner pushes into these, give an honest
acknowledgement. **Honest refusal is one of the
corpus's strengths** — it doesn't confabulate.
Mention that these are flagged as next-batch
enrichment.

### Operational PE fund mechanics

- *"American vs European waterfall mechanics in detail,
  with worked numbers."* — gap; corpus has fund-regime
  framework but not waterfall depth
- *"How does the GP catch-up actually work mechanically?"*
  — gap
- *"Side letter / MFN drafting — when does it trigger?"*
  — gap

### Carried interest taxation specifics

- *"UK 2025 reform 'qualifying' boundary in detail —
  what makes carry non-qualifying?"* — frontier file has
  the framework but not exhaustive scenarios
- *"Carry vs co-invest distinction for tax — drafting
  best practice?"* — gap

### Audit and financial reporting

- *"Fair-value methodology under IPEV guidelines for an
  unlisted infrastructure asset."* — gap
- *"Carry accounting — vesting recognition?"* — gap
- *"NAV strike mechanics for an open-ended fund?"* — gap

This is **KPMG's literal core business**. If they push,
honest acknowledgement is the right play — and pitch
the enrichment plan.

### Substance enforcement specifics

- *"What JFSC actually inspects during a substance
  review — the detail."* — corpus has statute but not
  inspection practice depth
- *"Tribunal cases on substance breaches."* — gap

### Pillar Two operational specifics for PE

- *"Walk me through QDMTT compliance for a portfolio
  holdco with multiple subsidiary chains."* — corpus
  has MCIT 2025 framing but not operational depth

## Recommended demo sequence

About 30 minutes:

### Open (3 min)

Frame the corpus: "This is an LLM-wiki-style knowledge
graph for Crown Dependencies + adjacent offshore
jurisdictions. Statute-anchored doctrinal content plus
a separate frontier section tracking what's currently
moving. Two evals — coverage and showcase — both at 26
PASS / 0 fail under externally-measured runs against
the corpus."

### Demonstrate currency (5 min)

Open with the UK carried interest question. **This will
land hardest** because the reform took effect one month
ago and they're dealing with it daily. Walk them through
the answer the runner produces.

Then show [`frontier/uk-carried-interest-reform-2026.md`](frontier/uk-carried-interest-reform-2026.md)
directly so they see the frontmatter discipline
(`as_of`, `expected_decay`, source citations to specific
law-firm commentary and Finance Bill 2025-26).

### Demonstrate depth (10 min)

Pick **one worked example**. Suggest the TopCo IPO
walkthrough — it's the most directly PE-relevant for
this audience. Show the file and then run the question
through the runner.

Then pull up [`CROSS-JURISDICTIONAL-MAP.md`](CROSS-JURISDICTIONAL-MAP.md)
and show the decision frameworks. Their eye will go to
the **Where should I form my fund?** and **Where should
I form my (re)insurance company?** matrices.

### Demonstrate measurement (5 min)

Show [`evals/showcase.yaml`](evals/showcase.yaml). Walk
through the scoring methodology and a question's
`expected_facts` / `expected_files` rubric. Show how
the runner is just a fresh Explore subagent. Show the
26/26 PASS scoreboard.

This signals **engineering discipline** — a senior
partner will recognise this as the difference between
a marketing demo and a real tool.

### Invite probing (5 min)

Invite them to ask anything. Three outcomes:

1. **They ask something the corpus passes** — show the
   answer and walk through the supporting files.
2. **They ask something the corpus refuses honestly** —
   point out that the refusal is the correct behaviour
   and pitch the enrichment plan.
3. **They ask something the corpus confabulates** —
   would be a serious finding; flag immediately.

### Close (2 min)

Outline the enrichment roadmap they'd expect to see
next:

1. PE fund operating mechanics (waterfall, carry,
   side letters)
2. Carried interest taxation deep-dive
3. Audit and financial reporting (their bread and
   butter)
4. Substance enforcement specifics
5. Pillar Two PE operational walkthrough
6. ESG / SFDR Article 8/9 deep-dive

Each is roughly 1-2 weeks of work to bring to
showcase-quality.

## What they will (likely) probe

Based on their expertise list, the questions most likely
to come up:

| Topic | Corpus strength | Prep |
|---|---|---|
| Fund-domicile choice | ✅ Strong | `show-fund-routes` |
| Carried interest UK 2026 reform | ✅ Strong | `frontier/uk-carried-interest...md` |
| Continuation funds | ✅ Strong | `frontier/continuation-funds...md` |
| AIFMD II | ✅ Strong | `frontier/aifmd-ii...md` |
| Tokenisation | ✅ Strong | `frontier/tokenisation...md` |
| SFDR | ✅ Strong | `frontier/sfdr-2...md` |
| Pillar Two | 🟡 Framework only | Acknowledge gap on operational |
| Substance enforcement | 🟡 Statute only | Acknowledge gap |
| Family-office / HNW structuring | ✅ Strong | Worked example available |
| Trusts and estates | ✅ Strong | Article 9 + 47 + 51 worked example |
| Captive insurance | ✅ Strong | `show-bermuda-captive` |
| Life assurance | ✅ Strong | `show-iom-portfolio-bond` |
| Image rights | ✅ Strong | `show-image-rights` |
| Fund operating mechanics | ❌ Thin | Acknowledge — pitch enrichment |
| Audit / fair value | ❌ Thin | Acknowledge — KPMG's core business |

## Key talking points

If asked "what makes this different from a generic
offshore-law search tool":

- **Currency** — frontier section explicitly tracks
  what's currently in motion with date-stamped
  decay-managed content
- **Voice** — the corpus is operator-shaped (persona Q&A
  files, worked examples) not just doctrinal
- **Measured** — two evals (coverage + showcase) with
  every PASS externally measured by fresh agents
- **Honest refusal** — corpus declines to confabulate on
  gaps and points to the audit
- **Cross-jurisdictional** — not just Jersey but six
  jurisdictions with comparison matrices
- **Threaded** — worked examples weave statute / tax /
  procedure / regulator content in single narratives

## Risks to manage

- **Over-claiming the demo** — frontier files just
  written are at v1; they're substantive but the
  practitioner-voice depth would benefit from review by
  someone with Crown Dependencies practice experience
- **Stale doctrine** — some doctrinal files have
  `last_verified: 2026-05-17` from prior sessions;
  refresh dates as needed before demo
- **Source attribution** — the frontier files cite
  named law-firm commentary; verify links resolve
  before demoing

## Quick reference — paths for the demo

```
# Frontier (the of-the-moment content)
frontier/uk-carried-interest-reform-2026.md
frontier/aifmd-ii-april-2026.md
frontier/continuation-funds-and-gp-led-secondaries.md
frontier/tokenisation-jersey-2026.md
frontier/sfdr-2-and-sustainable-finance.md
frontier/jersey-finance-industry-2026.md

# Worked examples (the depth content)
jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md
jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md
jersey/use-cases/international-lawyer/worked-example-contentious-trust-litigation.md

# Synthesis
CROSS-JURISDICTIONAL-MAP.md

# Measurement
evals/showcase.yaml
evals/coverage-questions.yaml
evals/README.md
```
