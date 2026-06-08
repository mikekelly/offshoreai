# Commercial concept — OffshoreAI as product + forward-deployed services for TCSPs

> Status: **early concept**, per Mike 2026-06-08. The seed for the
> customer/partner deck. Positioning and the pricing *shape* are decided in
> principle; the pricing *numbers* are unsettled and flagged below.
> Provenance: Mike's strategy thread, prompted by Eric Siu's "services-as-software /
> managed growth loops" post (<https://x.com/ericosiu/status/2052091708826063284>,
> 2026-05-06).

## One line

**Sell the product *and* the services — capture both halves of the $7.** OffshoreAI
is an AI-native **product** (the offshore-law corpus + agent/loop framework) delivered
*with* **forward-deployed engineers** who stand the loops up inside each
JFSC-licensed trust company business (TCSP), codify that firm's tribal knowledge into
skills, and own the outcome alongside the firm's MLRO. Not a pure software licence
(which leaves the lucrative services spend on the table), not a competing trust
company (which takes on the regulatory burden) — the AI-native *services-as-software*
firm in between.

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

## The model: product + forward-deployed services

Three ways to capture the offshore services spend:

- **(A) Pure software licence** — rent the corpus + framework and let the TCSP
  configure it. Fast and scalable, but captures only the $1 software slice and leaves
  the $6 of services — the actual prize — on the table. Worse, a tool dropped into a
  firm that can't configure it stalls, and an unembedded vendor is the easiest thing
  to rip out or rebuild.
- **(B) Become a next-gen TCSP yourself** — capture the whole fee, but take on JFSC
  licensing, fiduciary liability, and a standing-start client book. Slow, capital- and
  regulation-heavy.
- **(C) Product + forward-deployed services** ← **lead with this.** Ship the product
  *and* embed engineers who make it deliver outcomes inside each client. Capture
  software **and** services revenue — the *services-as-software* model the VCs are
  actually funding (the Palantir-origin "forward-deployed engineer" shape).

Why **C** fits offshore / Jersey:

- **The loops need real per-client configuration.** Each TCSP has its own systems,
  file formats, risk appetite, and client structures; off-the-shelf software won't
  drop in. The FDE *is* the bridge — and that bridging work is precisely the
  high-margin services revenue, not a cost to minimise.
- **Tribal knowledge has to be codified.** Each firm's "how we actually run CDD"
  becomes the skills/loops the FDE writes during deployment — billable services *and*
  the thing that makes the product stick.
- **The regulatory de-risk survives.** Even with an FDE embedded, the TCSP remains the
  licensed, accountable entity; its MLRO signs off. OffshoreAI supplies product +
  engineering, never fiduciary/regulatory sign-off — so no JFSC licence sits on our
  critical path (the one real advantage the pure-licence framing had, kept).
- **Stickier, harder to copy.** An embedded partner delivering outcomes is far harder
  to rip out — or rebuild in-house — than a login. This is the direct answer to the
  "they'll just build it themselves" risk.
- **Services → product flywheel.** Each deployment teaches us patterns that harden the
  shared corpus + skill library, so the bespoke share of the *next* deployment
  shrinks. Services aren't only margin; they're R&D that compounds into the product.
  That is what makes this services-*as-software* rather than a consultancy — and what
  keeps gross margin climbing over time.
- **Jersey's small, dense, relationship-driven market rewards embedded delivery.**
  Trust a SaaS login can't earn; land 2–3 flagship logos and the island knows.

C does not foreclose B later — but the moment a TCSP suspects we might become their
competitor, the services relationship sours. **Stance to take consciously**, not
drift into (see Open questions).

## Who buys, who uses

- **Economic buyer:** TCSP leadership — COO / head of compliance / managing director.
  Buys a **stood-up, working capability** (product + deployment), not a tool to staff
  and configure themselves: reduced cost-per-file, faster onboarding,
  audit-defensibility, and capacity to grow the book without linear headcount.
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

Recommended shape — **deployment + platform licence + metered usage**. Land with
services, expand into recurring platform:

| Component | Meters on | Captures |
|---|---|---|
| **Deployment / forward-deployed engineering** (packaged fixed-scope engagement, or retainer) | scoped FDE work to stand up a loop in the firm + codify its skills | the **services** half of the $7; the land motion and the stickiness |
| **Base platform licence** (annual, recurring) | access to the maintained corpus + skill/loop library + reg-change updates | the *compounding* asset — the thing they can't build or maintain themselves |
| **Usage** (pick per deployment) | **per active entity/relationship under administration** *and/or* **per loop-run** (per CDD onboarding / periodic review / reg-change assessment) | value as they scale; aligns with how TCSPs already measure their book |

**Productise the services**: package the FDE engagement as a fixed-scope "loop
deployment" (e.g. *stand up the CDD onboarding loop in your firm in N weeks*) rather
than open-ended consulting — so services revenue is predictable, and the repeatable
parts of each deployment migrate into the platform over time (the FDE's deployment
work *is* the codification of reusable playbooks/skills). This is the mechanism that
shifts the revenue mix from services-heavy toward platform-heavy as the company
matures, and lifts gross margin with it.

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

- **Services-margin / scaling tension (the core FDE risk).** Forward-deployed
  engineering is people-heavy and doesn't scale like SaaS — the classic critique of
  the Palantir model, and the reason investors discount services revenue. The whole
  bet is that AI makes each FDE many times more productive *and* that the services →
  product flywheel (above) steadily productises the bespoke work, so revenue mix and
  gross margin shift platform-ward over time. **Watch the metric:** services as a % of
  revenue, and bespoke-vs-reused work per deployment, should both fall. If they don't,
  it's a consultancy wearing a software badge.
- **Channel dependency.** Selling only through slow, conservative, relationship-driven
  buyers means long cycles. Mitigation: a sharp, measurable wedge (cost-per-CDD-file),
  flagship references, and the FDE land motion that gets us inside fast.
- **Copy risk — now largely mitigated.** A large TCSP might try to build in-house, but
  an embedded FDE delivering outcomes plus the central corpus + reg-update cadence
  they'd have to reproduce and maintain make that far less attractive than ripping out
  a mere login. (This is the main reason **C** beats **A**.)
- **Data / confidentiality.** Handling client KYC and source-of-wealth raises
  data-residency and JFSC confidentiality questions — design for siloing and
  auditability from day one. (Siu's "ship 100 variants, kill 90" velocity framing does
  **not** transfer; the currency here is precision + auditability + sign-off.)
- **Identity question (decide early-ish):** stay an AI-native product + services firm
  serving TCSPs, vs. keep optionality to *become* a TCSP later (higher capture, but it
  turns today's clients into tomorrow's competitors and sours the services
  relationship). Pick a stance consciously.

## Next steps

1. Get the two pricing-anchor numbers (administrator fully-loaded cost; hours per
   CDD file) from a friendly TCSP contact.
2. Spec the **CDD onboarding loop** as a concrete product — inputs, agent roster,
   corpus touchpoints, the human sign-off gate, and what's saved back as learning.
3. Turn this concept + the loop spec into the **customer/partner deck** — a
   slide-by-slide sketch already exists at
   [`partner-deck-sketch.md`](./partner-deck-sketch.md) (AIDA arc, copy levers, visual
   placeholders); it needs the real proof/pricing numbers before it's shown.
