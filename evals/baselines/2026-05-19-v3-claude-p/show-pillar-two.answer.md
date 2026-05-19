I have enough to answer. Task-tracking isn't needed for a single-question research answer.

---

## Pillar Two applied to a Jersey TopCo above a UK operating business

### The framework

Pillar Two is the OECD/G20 Inclusive Framework's global-minimum-tax regime. It targets **MNE groups with consolidated revenue of €750m+** in at least two of the four preceding fiscal years, and imposes a **15% minimum effective tax rate (ETR)** on GloBE income, computed jurisdiction by jurisdiction. Three operative rules: an **Income Inclusion Rule (IIR)** at parent level, an **Undertaxed Profits Rule (UTPR)** as backstop, and a **Qualified Domestic Minimum Top-up Tax (QDMTT)** that lets the source jurisdiction collect the top-up itself (`jersey/tax/pillar-two.md`, `jersey/international/pillar-two-mcit.md`).

### Jersey's implementation — MCIT

Jersey has implemented Pillar Two via the **Multinational Corporate Income Tax (Jersey) Law 2024 ("MCIT Law")**, effective for accounting periods commencing on or after **1 January 2025**. The MCIT is structured as a Jersey **QDMTT-equivalent plus an IIR / Domestic Top-up Tax** for in-scope constituent entities. The deliberate policy is that **Jersey collects the top-up itself rather than ceding it** to the parent jurisdiction under that parent's IIR (`jersey/tax/pillar-two.md`, `jersey/international/pillar-two-mcit.md`).

### Application to the specific structure (Jersey TopCo above UK Opco)

Two sub-cases — they turn entirely on whether group consolidated revenue clears €750m:

**1. Group below the €750m threshold (the typical founder TopCo).**
Pillar Two does not engage. The Jersey TopCo continues on zero-ten — **0%** as a generic holding company under Article 123A — and the UK Opco is taxed under UK domestic corporation tax. No MCIT filing, no top-up. This is the position for the great majority of Jersey TopCos (`jersey/tax/pillar-two.md` §"Who is in scope"; `jersey/use-cases/founder-entrepreneur/topco-tax.md`; `jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`; `jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md` Step 4).

**2. Group at or above €750m consolidated revenue.**
Pillar Two engages and produces a coordinated pair of results across the two jurisdictions:

- **Jersey TopCo side.** The TopCo is a Jersey constituent entity (Jersey-resident, Jersey-managed). Jersey applies the MCIT: GloBE income is computed under the OECD's standardised rules (starting from consolidated accounting income with prescribed adjustments — different from local Jersey taxable income), the Jersey jurisdictional ETR is calculated, and if it is below 15% a **top-up to 15%** is charged. Because the MCIT functions as a QDMTT, that top-up stays in Jersey rather than being collected by the UK or any other parent jurisdiction. **Zero-ten is not displaced** as the local-tax regime — MCIT sits *on top* of it; the total Jersey burden for in-scope groups becomes "at least 15%" regardless of whether the TopCo's local classification was 0%, 10%, or 20% (`jersey/tax/pillar-two.md` §"Interaction with zero-ten"; `jersey/international/pillar-two-mcit.md` table).

- **UK Opco side.** The UK Opco is taxed under UK corporation tax in the ordinary way; the UK is also a Pillar Two jurisdiction and runs its own parallel rules. The worked example notes only that "UK Pillar Two implementation runs in parallel" and that "group consolidation tests apply" — the corpus does not elaborate on the UK's domestic Pillar Two mechanics (`jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md` Step 4).

- **Who ends up collecting what.** Without Jersey's QDMTT, the UK (as the operating-business jurisdiction and a likely parent in many post-IPO structures) or other parent jurisdictions could have collected the top-up on Jersey-booked low-taxed income under the IIR. Jersey's MCIT pre-empts that by collecting the top-up at source (`jersey/international/pillar-two-mcit.md` §"Qualified Domestic Top-up Tax"; `jersey/tax/pillar-two.md` §"Jersey's response").

### Mechanics and reliefs worth knowing

- **GloBE income ≠ Jersey local taxable income** — separate computation under OECD methodology (`jersey/tax/pillar-two.md`).
- **Substance-based income exclusion** — formulaic carve-out for payroll + tangible assets, phasing down over time (`jersey/international/pillar-two-mcit.md` §"Excluded income").
- **Excluded entities** — government, international organisations, pension funds, certain investment funds and REIT-type vehicles; not generally relevant to a commercial TopCo (`jersey/international/pillar-two-mcit.md`, `jersey/tax/pillar-two.md`).
- **Compliance** — registration, separate MCIT return, GIR coordination across the group, specialist software/advisers typically required (`jersey/tax/pillar-two.md` §"Compliance"; `jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`).
- **Substance Law 2019 still applies** in parallel — Pillar Two does not displace the economic-substance regime (`jersey/international/pillar-two-mcit.md` §"Challenging"; `jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md` Step 3).

### Strategic implication for this structure

For founder/pre-IPO groups below €750m, a Jersey TopCo above a UK Opco continues to deliver the zero-ten + no-Jersey-WHT economics that motivate the structure. As the group scales through the threshold, the headline Jersey rate effectively becomes 15% (via MCIT), the comparative advantage versus an onshore (UK/Ireland) holdco narrows, and the structure is typically re-evaluated — though non-tax advantages (capital flexibility under CJL 1991, no Jersey CGT at investor level, LSE acceptance, UK Takeover Code applicability) often still justify staying in Jersey (`jersey/use-cases/founder-entrepreneur/pillar-two-impact.md` §"Strategic considerations"; `jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md` "Why this structure").

### Caveats

- All four Pillar Two files in the corpus carry **`status: draft`**. Their `last_verified` dates (2026-05-15 to 2026-05-18) are recent (within 180 days of today's 2026-05-19), so no staleness flag — but the draft status itself is a quality caveat the reader should weigh.
- The corpus does **not** describe UK domestic Pillar Two mechanics (Multinational Top-up Tax / Domestic Top-up Tax) in any detail — only that they "run in parallel". A complete answer on the UK-side treatment of the Jersey TopCo's income would need UK-side sources outside this corpus.

---

### Files cited

1. `jersey/tax/pillar-two.md`
2. `jersey/international/pillar-two-mcit.md`
3. `jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`
4. `jersey/use-cases/founder-entrepreneur/topco-tax.md`
5. `jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`
