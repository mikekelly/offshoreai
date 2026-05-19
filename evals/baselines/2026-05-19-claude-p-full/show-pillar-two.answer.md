Task is a single question, not multi-step — answering directly.

## Pillar Two and a Jersey TopCo above a UK operating business

The corpus answers the Jersey-side mechanics and is explicit about the parent/subsidiary geometry, but it does not contain a dedicated walk-through of the UK's own Pillar Two implementation. Working from what the Jersey files actually say:

### 1. Threshold — does the group fall in scope at all?

Pillar Two only bites on **MNE groups with €750 million+ consolidated revenue in at least two of the four preceding fiscal years** (`jersey/tax/pillar-two.md`, `jersey/international/pillar-two-mcit.md`). Below that threshold the answer is "Pillar Two is irrelevant — Jersey zero-ten 0% continues at the TopCo level" (`jersey/use-cases/founder-entrepreneur/topco-tax.md`, `jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`). Most founder/family-office Jersey TopCos sit below.

### 2. If the group is in scope: where is each entity taxed?

Pillar Two computes an **effective tax rate (ETR) per jurisdiction on GloBE income** (consolidated-accounts starting point with prescribed adjustments — *not* Jersey local taxable income); if a jurisdiction's ETR is under 15%, top-up tax is charged to bring it to 15% (`jersey/tax/pillar-two.md`).

For the structure described — **Jersey TopCo, UK operating subsidiary** — the corpus implies the following:

- **UK operating sub.** The UK has a 25% headline corporate tax rate (this is general knowledge — the corpus does not state the UK rate); the corpus implies that high-rate onshore jurisdictions usually compute an ETR above 15% and so attract no top-up at the operating-sub level. The corpus does not describe the UK regime in detail.
- **Jersey TopCo.** Jersey is identified as a "low-tax jurisdiction" under Pillar Two — most Jersey companies pay 0% under zero-ten, so the Jersey ETR for an in-scope group's Jersey constituent entities is well below 15% and a top-up is owed on Jersey-booked income (`jersey/tax/pillar-two.md`).

### 3. Who collects the Jersey top-up — Jersey, or the parent country?

This is the load-bearing point for a Jersey-TopCo-over-UK-op-co structure. Pillar Two has a collection hierarchy:

1. **QDMTT** — the low-taxed jurisdiction itself collects the top-up locally, which then offsets IIR/UTPR elsewhere.
2. **IIR (Income Inclusion Rule)** — top-up tax paid in the parent jurisdiction on low-taxed subsidiaries.
3. **UTPR (Undertaxed Profits Rule)** — backstop allocating top-up to other group jurisdictions.

(`jersey/tax/pillar-two.md`, `jersey/international/pillar-two-mcit.md`)

Jersey has chosen to **collect the top-up itself** via the **Multinational Corporate Income Tax (Jersey) Law 2024 ("MCIT")**, effective for financial years commencing on or after **1 January 2025**, structured as a **QDMTT-equivalent** with an IIR and a Domestic Top-up Tax (`jersey/tax/pillar-two.md`, `jersey/international/pillar-two-mcit.md`). The corpus is explicit that the design goal is "without [Jersey's] own implementation, this would mean the parent country (often UK / US / EU) collects the top-up rather than Jersey" (`jersey/international/pillar-two-mcit.md`).

For a Jersey TopCo (i.e. Jersey is the **parent**, not a sub of a UK parent), the IIR direction-of-flow is the other way: if the group has lower-taxed entities anywhere in the group, Jersey's IIR at the TopCo level could in principle pull top-up tax to Jersey. The corpus describes the IIR mechanism but does not work through this specific TopCo-as-parent scenario.

### 4. What the Jersey TopCo actually pays

For an in-scope MNE group with a Jersey TopCo:

- **Zero-ten still applies as the Jersey local-tax position** (0% for most TopCo activity; 10% for financial-services classifications; 20% for utility/large-retail/property-rental/etc.) (`jersey/use-cases/founder-entrepreneur/topco-tax.md`, `jersey/tax/pillar-two.md`).
- **MCIT is an additional tax on top** — a top-up bringing the Jersey ETR up to 15%. Total Jersey tax for the in-scope group is therefore **at least 15%**, regardless of zero-ten classification (`jersey/tax/pillar-two.md`).
- The headline "0% Jersey rate is no longer the headline result for large groups — Jersey collects up to 15% via MCIT instead of the foreign parent jurisdiction collecting it under IIR / UTPR" (`jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`).

### 5. Compliance load

In-scope groups must register Jersey constituent entities, compute GloBE income and ETR under standardised methodology, file Pillar Two returns alongside or separately from local Jersey returns, and pay top-up by prescribed deadlines. The corpus repeatedly flags this as **complex — most in-scope groups use specialist tax software and advisers** (`jersey/tax/pillar-two.md`, `jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`).

### 6. What persists alongside Pillar Two

- **Substance Law 2019** obligations remain — Pillar Two does not displace the substance regime (`jersey/international/pillar-two-mcit.md`, `jersey/use-cases/founder-entrepreneur/topco-tax.md`).
- **Jersey legal/structural advantages** (corporate law, no investor-level Jersey CGT, listing acceptance, no Jersey dividend withholding) are unchanged (`jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`).
- The strategic question once a group crosses €750m becomes: **stay in Jersey at 15% effective rate** (with the MCIT layer) **or migrate the TopCo onshore** to a 15%+ jurisdiction such as UK or Ireland — the corpus flags the trade-off but does not prescribe (`jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`).

### What the corpus does NOT answer

- The specifics of the **UK Multinational Top-up Tax / Domestic Top-up Tax** as it would apply to a Jersey-parented structure with a UK operating sub — the corpus mentions in glossary form that other jurisdictions (Guernsey, Cayman, BVI) have "MTT" equivalents to Jersey's MCIT, and acknowledges UK Pillar Two implementation exists, but does not contain a dedicated UK Pillar Two page.
- Whether the UK operating sub would itself owe any UK top-up tax — the corpus does not address this and the corpus does not answer this question.
- The interaction of UK CFC rules, UK withholding on dividends Jersey-bound, or UK transfer-pricing on intra-group flows between the UK sub and the Jersey TopCo — outside Pillar Two but commonly relevant; not covered.

All four cited files were last verified within the past week (today is 2026-05-19), so no freshness flags are required.

---

### Files cited

1. `jersey/tax/pillar-two.md`
2. `jersey/international/pillar-two-mcit.md`
3. `jersey/use-cases/founder-entrepreneur/pillar-two-impact.md`
4. `jersey/use-cases/founder-entrepreneur/topco-tax.md`
5. `jersey/glossary-extension.md`
6. `jersey/README.md`
