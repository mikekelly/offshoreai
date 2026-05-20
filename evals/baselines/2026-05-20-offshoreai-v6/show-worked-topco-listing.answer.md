I'll find the founder-entrepreneur use-case cluster since this is a worked-example question about Jersey TopCo + LSE listing.I'll use the correct tool names.The worked example is the centerpiece. Let me read it plus the key sibling files on structure, requirements, and the listing overlay.I have the worked example plus the requirements and migration siblings — all consistent. Here's the walk-through.

**Note on source quality:** The files below are all status `draft` (last verified 15–18 May 2026 — fresh). Drafted but not yet editorially verified against primary sources, so treat the structure as a sound roadmap and confirm specifics with Jersey counsel before acting.

## The end-state structure

```
        Public investors
              │
     [Jersey TopCo] ── listed on LSE
              │
       [UK Opco Ltd]
```

A Jersey public company limited by shares sits above your existing UK operating company; the public buys shares in the Jersey TopCo, which holds 100% of the UK business.

## Step by step

**1. Why a *new* Jersey TopCo rather than migrating the UK company.** A UK company **cannot** outbound-continue (re-domicile) directly to Jersey — UK law doesn't permit it. So the standard route for a UK opco is to incorporate a fresh Jersey Newco TopCo above the UK company, not to migrate the UK entity itself. (Continuance under CJL 1991 Part 18C is the route only when the existing TopCo is in a jurisdiction that permits outbound continuance, e.g. BVI/Cayman.) `migration-pre-ipo.md`

**2. Incorporate the Jersey TopCo.** A public company limited by shares under the Companies (Jersey) Law 1991, with IPO-ready memorandum & articles, no-par-value shares (common), a Jersey registered office, a secretary, and beneficial-ownership details lodged on the (private) Registry. Incorporation itself takes ~1–3 days. Statutory minimums: at least one director (Art. 73), a secretary (Art. 81), a Jersey registered office (Art. 67) — but for substance you'll want some Jersey-resident directors; a listed TopCo typically runs 5–9 directors with an independent majority and audit/remuneration/nomination committees. `worked-example-jersey-topco-uk-listing.md`, `topco-requirements.md`

**3. Share-for-share exchange.** UK shareholders exchange their UK shares for Jersey TopCo shares (e.g. 1:1); TopCo issues new shares and ends up owning 100% of the UK opco. UK CGT rollover relief under TCGA s.135 is generally available (subject to anti-avoidance), and 0.5% UK stamp duty may arise on the transfer of UK shares (reliefs may apply for genuine reorganisations). No Jersey tax issue on the exchange. `worked-example-jersey-topco-uk-listing.md`

**4. TopCo Jersey tax position.** Jersey-resident company, taxed under the zero-ten regime — **0%** for a generic holding company. Manage UK tax-residence carefully: keep management and control in Jersey via Jersey-based directors and decision-making. `worked-example-jersey-topco-uk-listing.md`, `knowledge/jersey/tax/zero-ten.md`

**5. Economic substance.** Under the Taxation (Companies — Economic Substance) (Jersey) Law 2019, a pure equity-holding company gets a **reduced** substance test — adequate Jersey premises and personnel, board meetings held in Jersey, but a low bar. Pure-paper presence won't satisfy it. `worked-example-jersey-topco-uk-listing.md`

**6. Pillar Two check.** If the consolidated group has annual revenue ≥ €750m, the Jersey MCIT Law 2025 (a QDMTT, effective for periods beginning on/after 1 Jan 2025) tops the TopCo's income up to 15% in Jersey rather than ceding it to the UK under the IIR; UK Pillar Two runs in parallel. Below the threshold, the 0% position continues. `worked-example-jersey-topco-uk-listing.md`, `knowledge/jersey/tax/pillar-two.md`

**7. Capital structure.** CJL 1991 gives IPO-useful flexibility: multiple share classes (founder/investor/public, including dual-class super-voting), no-par-value shares, treasury shares, redeemable shares, buybacks, and solvency-statement capital reductions (less court-intensive than the UK). `worked-example-jersey-topco-uk-listing.md`

**8. List on the LSE.** Jersey TopCos are routinely accepted across Main Market segments (and AIM via an admission document rather than a full prospectus). UK Listing Rules, DTRs, MAR and the Prospectus Regulation apply; the **UK Takeover Code applies** to a Jersey-incorporated company with securities on a UK regulated market. The prospectus needs Jersey-law confirmations (legal opinions, corporate authorities), with Jersey advocates working alongside UK securities counsel. `worked-example-jersey-topco-uk-listing.md`

**9. Post-IPO.** The UK Corporate Governance Code applies; the JFSC does not generally regulate the TopCo unless it carries on regulated business; Jersey Registry filings (annual confirmation, beneficial ownership) continue. Dividends to non-resident shareholders carry **0% Jersey withholding tax** and are paid on a solvency basis (no UK-style retained-earnings test); UK shareholders pay UK income tax on dividends. `worked-example-jersey-topco-uk-listing.md`

## Main pitfalls
Stamp-duty leakage on the exchange if not structured for relief; accidental UK tax-residence of the TopCo; Pillar Two if in scope; FCA prospectus/sponsor and market-abuse compliance; and inadequate substance at TopCo level. `worked-example-jersey-topco-uk-listing.md`

## Files cited
1. `knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md` (draft)
2. `knowledge/jersey/use-cases/founder-entrepreneur/topco-requirements.md` (draft)
3. `knowledge/jersey/use-cases/founder-entrepreneur/migration-pre-ipo.md` (draft)
4. `knowledge/jersey/tax/zero-ten.md`
5. `knowledge/jersey/tax/pillar-two.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
