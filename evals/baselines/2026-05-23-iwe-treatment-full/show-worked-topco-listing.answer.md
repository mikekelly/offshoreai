The corpus has a worked example exactly for this scenario. The file is `status: draft` (last verified 2026-05-18) — content is drafted but unverified, so treat the walkthrough as orientation, not a settled implementation plan.

## End-state structure

```
Public investors → Jersey TopCo (LSE-listed) → UK TechCo (operating)
```

`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`

## Step by step

**1. Incorporate the Jersey TopCo.** Public company limited by shares under the **Companies (Jersey) Law 1991**. Jersey reformed away from authorised share capital, so issued no-par-value shares are common. Need ≥ 2 directors initially, a Jersey-resident corporate-services provider for the registered office, and beneficial-ownership info lodged with the Registry (private register). Incorporation: 1–3 days. (`knowledge/jersey/companies/index.md`, `knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`)

**2. Share-for-share exchange.** UK shareholders of TechCo transfer their UK shares to TopCo in return for newly-issued TopCo shares (typically 1:1). Result: TopCo owns 100% of UK TechCo. Tax points flagged by the worked example:
- **UK CGT**: TCGA s.135 share-for-share rollover generally available, subject to anti-avoidance.
- **UK stamp duty**: 0.5% potentially payable on transfer of UK shares to TopCo; reliefs may apply for genuine restructurings.
- **Jersey**: no Jersey corporate-tax issue on the exchange (no general CGT; income taxed under zero-ten).

(`worked-example-jersey-topco-uk-listing.md`; sibling: `migration-pre-ipo.md`.) These are UK-tax points — for a UK-tax opinion you need UK counsel; the corpus surfaces the issue but is Jersey-anchored.

**3. Jersey TopCo tax position.** TopCo is Jersey-resident (incorporated in Jersey + management/control in Jersey via Jersey-resident directors). Under the **Income Tax (Jersey) Law 1961** zero-ten regime, a generic holding company is taxed at **0%**; 10% is the financial-services rate and 20% applies to utilities/quarrying/cannabis/property income. (`knowledge/jersey/tax/zero-ten.md`)

**4. Economic substance.** Under the **Taxation (Companies — Economic Substance) (Jersey) Law 2019**, a pure holding company benefits from the **reduced substance test** — adequate human resources and premises in Jersey, but the bar is lower than for trading/financing companies. (`knowledge/jersey/tax/economic-substance.md`)

**5. Pillar Two.** If consolidated group revenue ≥ **EUR 750m**, MCIT 2025 engages: Jersey applies a 15% QDMTT + IIR for accounting periods from 1 January 2025, so the top-up tax stays in Jersey rather than ceding to the UK under IIR. No UTPR. Below the threshold, the 0% zero-ten position continues unchanged. (`knowledge/jersey/international/pillar-two-mcit.md`, `knowledge/jersey/tax/pillar-two.md`)

**6. Capital structure for IPO.** CJL 1991 gives flexibility most issuers care about pre-IPO: multiple share classes (founder / investor / public), no-par-value shares as standard, treasury shares permitted, redeemable shares, share buy-backs, and **capital reductions by special resolution + solvency statement** (lighter than the English court-confirmed process). (`worked-example-jersey-topco-uk-listing.md`)

**7. LSE listing.** Jersey TopCos are routinely accepted on the LSE Main Market (and AIM):
- UK Listing Rules, DTRs, MAR, Prospectus Regulation all apply.
- The **UK Takeover Code** applies to Jersey-incorporated companies admitted to a UK regulated market (statutory extension).
- Prospectus requires Jersey legal opinions and Jersey corporate-authority confirmations — Jersey advocates work alongside UK securities counsel.

(`worked-example-jersey-topco-uk-listing.md`; sibling: `listing-rule-overlay.md`.)

**8. Post-IPO governance and distributions.** UK Corporate Governance Code applies. JFSC does not regulate the TopCo unless it carries on regulated business in Jersey. Distributions use the CJL 1991 **solvency-based** test — no English-style retained-earnings constraint. **Jersey imposes no withholding tax** on dividends to non-resident shareholders. UK-resident shareholders are taxed on dividends under UK rules. (`worked-example-jersey-topco-uk-listing.md`; `knowledge/jersey/tax/withholding-on-dividends.md` is referenced; sibling `distributions-mechanics.md`.)

## Pitfalls the worked example flags

- Stamp-duty leakage on the share exchange if not structured for relief.
- UK tax-residence creep — board meetings, decision-making, and minutes need to evidence Jersey management and control.
- Pillar Two triggering on group scale-up.
- Listing-specific UK-law obligations (FCA prospectus approval, sponsor/nomad, MAR compliance).
- Paper-only Jersey presence won't pass substance.

## Caveats

- The worked-example file is `status: draft` (last verified 2026-05-18) — drafted but not editorially verified against primary sources. Treat the walkthrough as orientation; before acting, instruct Jersey advocates and UK securities/tax counsel to verify each step against current CJL 1991, the Listing Rules, and current HMRC practice.
- Several supporting files referenced by the worked example (`migration-pre-ipo.md`, `listing-rule-overlay.md`, `distributions-mechanics.md`, `pillar-two-impact.md`) sit alongside it in the same folder — read them for layer-specific detail.

## Cited files

1. `knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`
2. `knowledge/jersey/use-cases/founder-entrepreneur/index.md`
3. `knowledge/jersey/companies/index.md`
4. `knowledge/jersey/tax/zero-ten.md`
5. `knowledge/jersey/tax/economic-substance.md`
6. `knowledge/jersey/international/pillar-two-mcit.md`
7. `knowledge/jersey/tax/pillar-two.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
