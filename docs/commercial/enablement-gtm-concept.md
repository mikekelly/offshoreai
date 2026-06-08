# Commercial concept — OffshoreAI as enablement infrastructure for TCSPs

> Status: **early concept**, per Mike 2026-06-08. The seed for the
> customer/partner deck. Positioning and the pricing *shape* are decided in
> principle; the pricing *numbers* are unsettled and flagged below.
> Provenance: Mike's strategy thread, prompted by Eric Siu's "services-as-software /
> managed growth loops" post (<https://x.com/ericosiu/status/2052091708826063284>,
> 2026-05-06).

## One line

**Sell the *capability*, not the corpus.** OffshoreAI is the AI infrastructure that
lets an incumbent, JFSC-licensed trust company business (TCSP) offer AI-run,
human-signed-off compliance and administration loops — without becoming a software
company itself. Picks-and-shovels, not a competing trust company.

## The thesis

The VC "services-as-software" bet: for every $1 spent on software, ~$6 is spent on
services, and AI now lets that services spend be captured by software-shaped
businesses. That ratio is *more* extreme in offshore finance than almost anywhere,
because so little is productised and so much is bespoke, high-billable human time
stuck in an expensive manual maze (gather docs → unpick ownership → source-of-wealth
→ screen → assemble file → review → sign off).

The naïve move is to bolt AI onto labour to make it cheaper. The stronger move
(Siu's argument) is to stop selling labour and **own end-to-end *loops*** — processes
that turn inputs into outcomes and get smarter from feedback — with three layers:

1. **Managed loops** — own the outcome (e.g. a completed, defensible CDD file).
2. **Specialist agents** — execute the work inside the loop (research, screening, QA,
   drafting, narrative).
3. **Human judgment** — taste, trust, the accountable decision.

**Why this fits offshore better than marketing (Siu's original domain):** the human
layer isn't a nice-to-have here, it's *mandated*. The JFSC requires an accountable
person / MLRO sign-off. So the three-layer model maps perfectly, and the human
sign-off is a regulatory feature, not a cost to engineer away. OffshoreAI already
owns layer-2's hardest dependency: a research-grade, cited, dated corpus of the law
(see [`../../README.md`](../../README.md)) — the thing a generic agent zoo can't
fake.

## Why enablement, not competing

Two ways to capture the services spend: **(A)** license the capability to incumbent
TCSPs, or **(B)** become a next-gen TCSP yourself and capture the whole fee. We lead
with **A**:

- **They keep the regulatory burden.** The TCSP stays the licensed, accountable
  entity — MLRO, source-of-wealth, fiduciary liability all sit with them. OffshoreAI
  stays infrastructure. Enormous de-risk; no JFSC licensing on our critical path.
- **We ride their books and trust.** They already hold the client structures, the
  data-handling permissions, and the relationships. We rebuild none of it.
- **Jersey's small, dense market works *for* us.** Land 2–3 flagship trust-company
  logos and the whole island knows. Referenceability is the currency here.
- **The fear is on our side.** Incumbents are scared of AI disruption *and* of falling
  behind. Enablement lets them adopt without becoming software companies.

A (enablement) does not foreclose B (own TCSP) later — but the moment a TCSP suspects
we might become their competitor, the enablement sale gets harder. **Stance to take
consciously**, not drift into (see Open questions).

## Who buys, who uses

- **Economic buyer:** TCSP leadership — COO / head of compliance / managing director.
  Buys reduced cost-per-file, faster onboarding, audit-defensibility, and capacity to
  grow the book without linear headcount.
- **End users:** the personas the corpus already serves deepest — the
  **[trust officer](../product/PERSONAS.md)** and **compliance/MLRO**, plus fund
  administrators. The product's job is to give them *an answer they can stand behind
  in front of a regulator*: every assertion traceable to a cited, dated source. The
  one trait [`PERSONAS.md`](../product/PERSONAS.md) names — *sceptical of hype,
  allergic to being sold to, quietly impressed by precision* — governs the pitch as
  much as the UI: lead with evidence and verifiable output, never adjectives.

## The wedge: the CDD / onboarding loop

Start with the single biggest labour sink and the clearest ROI story:

```
client docs + structure + source-of-wealth
        ↓  research agent  → unpick beneficial ownership, map the structure
        ↓  screening agent → sanctions / PEP / adverse media
        ↓  corpus check    → JFSC AML/CFT handbook requirements for this entity type
        ↓  assembly agent  → draft the CDD file + risk rating
        ↓  HUMAN: MLRO / accountable person reviews and SIGNS OFF   ← mandated layer
        ↓  learning saved  → what was queried, what failed QA, what the reviewer changed
```

Why this wedge: it is high-volume, high-cost, painfully manual today, and has a
crisp, measurable outcome (a completed, defensible file). Adjacent loops to follow:
**ongoing monitoring / periodic CDD review**, **regulatory-change horizon-scanning**
(JFSC guidance, substance, CRS/FATCA, Pillar Two → which structures are affected),
and **entity administration** (statutory deadlines, substance returns, board minutes).

## Pricing model

**Core principle: anchor to the labour cost displaced, not to a software-seat
budget.** Per-seat pricing is the trap — it benchmarks us against generic AI tools
and underprices a loop that quietly removes headcount. Price as a meaningful fraction
of the fully-loaded administrator/analyst hours each loop removes.

Recommended shape — **base platform licence + metered usage**:

| Component | Meters on | Captures |
|---|---|---|
| **Base platform licence** (annual) | access to the maintained corpus + skill/loop library + reg-change updates | the *compounding* asset — the thing they can't build or maintain themselves |
| **Usage** (pick per deployment) | **per active entity/relationship under administration** *and/or* **per loop-run** (per CDD onboarding / periodic review / reg-change assessment) | value as they scale; aligns with how TCSPs already measure their book |

Per-entity metering is attractive because it's exactly how trust companies already
count revenue; per-loop-run is cleanest for the onboarding wedge where usage = value
delivered. Avoid per-seat; treat outcome/margin-share as premature for conservative
incumbents.

> **Unsettled — needs a real number.** The "fraction of labour displaced" logic only
> bites once we can state: fully-loaded cost of a Jersey compliance administrator,
> and the hours a CDD onboarding / periodic review eats today. That single input
> sizes per-entity pricing and is also the decisive slide for the buyer (their cost,
> our fraction of it). **Action: get these two figures from a friendly TCSP contact.**

## The moat, and the one design decision that protects it

The moat is the **learning loop** — but in a licensing model it fragments unless
deliberately architected, because each TCSP's client data is confidential and can't
be pooled. Split it:

- **Compounds centrally (ours):** regulatory / jurisdictional learning — how the JFSC
  actually applies rules, reg-change updates, skill/workflow/QA improvements.
  Non-confidential. This is the shared asset every licensee rents and renews for, and
  the reason they don't build it in-house (maintaining a research-grade,
  continuously-updated regulatory corpus is *our* job, not something a trust company
  wants to staff). It also **replicates across jurisdictions** — a loop proven in
  Jersey extends to Guernsey, IoM, BVI, Cayman… per the corpus roadmap.
- **Stays siloed (theirs):** client-specific KYC / source-of-wealth data, per their
  confidentiality and data obligations.

The continuous reg-change cadence is both the renewal hook and the defence against
incumbents copying it once it's proven.

## Risks / open questions

- **Channel dependency.** Selling only through slow, conservative, relationship-driven
  buyers means long cycles. Mitigation: a sharp, measurable wedge (cost-per-CDD-file)
  and flagship references.
- **Copy risk.** A large TCSP may try to build in-house once it works — countered by
  the central corpus + reg-update cadence they'd have to reproduce and maintain.
- **Data / confidentiality.** Handling client KYC and source-of-wealth raises
  data-residency and JFSC confidentiality questions — design for siloing and
  auditability from day one. (Siu's "ship 100 variants, kill 90" velocity framing does
  **not** transfer; the currency here is precision + auditability + sign-off.)
- **Identity question (decide early-ish):** pure infrastructure (the "Stripe of
  offshore compliance" — higher trust, higher multiple, capped at a slice) vs.
  optionality to become a TCSP later (higher capture, jeopardises the enablement
  sale). Pick a stance consciously.

## Next steps

1. Get the two pricing-anchor numbers (administrator fully-loaded cost; hours per
   CDD file) from a friendly TCSP contact.
2. Spec the **CDD onboarding loop** as a concrete product — inputs, agent roster,
   corpus touchpoints, the human sign-off gate, and what's saved back as learning.
3. Turn this concept + the loop spec into the **customer/partner deck** (the existing
   open thread).
