# Comparing JPF, ELP, BVI Approved Fund, Guernsey PIF for an emerging sub-US$100m PE manager

The four regimes are not strict substitutes — they sit at different points on three axes (investor-count cap, AUM cap, and how the regulatory burden is allocated between fund / manager / service provider). For a closed-ended PE fund below US$100m, all four are viable; the right choice depends mostly on **LP base size, LP familiarity, and which entity you want to carry the regulatory weight**.

## Caveat up front

All four corpus files I'm citing are `status: draft` — drafted and reviewed but not finally verified against primary sources. Treat the parameter detail (caps, timelines, fees) as indicative; check current JFSC / GFSC / CIMA / BVI FSC publications and the relevant statutes before committing. All four were `last_verified` 2026-05-15 to 2026-05-18, so the substance is current.

## Side-by-side

| Dimension | Jersey JPF | Cayman ELP | BVI Approved Fund | Guernsey PIF |
|---|---|---|---|---|
| Max investors | 50 | No cap | **20** | 50 |
| Max AUM | None | None | **US$100m** | None |
| Time-to-launch | ~48 h JFSC approval | 1–2 business days for ELP registration; LPA negotiation weeks–months separately | Typically several weeks at the FSC | ~1 business day (Route 1) |
| Investor type | Professional / eligible | Set in LPA (institutional PE/VC LPs) | Closely-held / small | Route depends: licensed-mgr / family / qualifying |
| Manager regime needed | None — JFSC-licensed **Designated Service Provider (DSP)** carries the regulatory weight | None within Cayman directly; substance applies; investment manager often onshore | BVI **Approved Manager** typical (fast-track, separate 2012 regime) | Route 1 requires a **GFSC-licensed manager**; Routes 2 & 3 don't |
| Audit required | Yes | Yes (under Private Funds Act 2020 once registered) | **No** statutory audit requirement | Yes |
| Vehicle forms | Company / LP / unit trust / cell | Limited partnership (the ELP itself) | Company / LP | Company / LP / unit trust / PCC / ICC |
| Closed-ended PE fit | Strong — default Jersey PE vehicle | **The global PE/VC default**; LPA is the master document | Workable for small closely-held PE | Strong — competitive with JPF for mid-market PE |

(Sources: `knowledge/jersey/funds/jersey-private-fund.md`; `knowledge/cayman/exempted-limited-partnership.md`; `knowledge/bvi/incubator-and-approved-fund.md`; `knowledge/guernsey/private-investment-fund.md`; `knowledge/bvi/approved-manager.md`.)

## How to think about this for an emerging sub-US$100m PE manager

**If your LPs are institutional PE / VC (US endowments, funds-of-funds, large family offices):** Cayman ELP is what they expect — the global default for closed-ended PE, tax-transparent, contractually flexible via the LPA, and a form their counsel has documented hundreds of times (`knowledge/cayman/exempted-limited-partnership.md`). You'll register under the Private Funds Act 2020 and pay for audit, but LP familiarity is worth a lot for a first-time fund.

**If you have ≤20 LPs and genuinely want the lightest regulatory load:** BVI Approved Fund is the only one of the four with *no statutory audit requirement* and a permanent (no time limit) light-touch posture up to US$100m AUM. Paired with a BVI Approved Manager, this is the cheapest end-to-end stack — but the 20-investor cap is hard, and institutional LPs may push back on the BVI fund-regime hierarchy (`knowledge/bvi/incubator-and-approved-fund.md`).

**If you want 50 LPs and EU / UK marketing optionality via NPPR:** Jersey JPF or Guernsey PIF. They're closely matched at the 50-investor cap with 1-2 business-day approval. The structural difference is *who carries the regulatory burden*:
- **JPF**: the JFSC-licensed **DSP** (a Jersey administrator) does CDD, books, and substitutes for direct JFSC oversight of the fund — useful if you don't want to stand up a licensed manager yet (`knowledge/jersey/funds/jersey-private-fund.md`).
- **PIF Route 1**: requires a **GFSC-licensed Guernsey manager** that takes regulatory responsibility — useful if you already have or are willing to stand up a licensed manager and want maximum vehicle-form flexibility (Guernsey PCCs/ICCs are unusually strong) (`knowledge/guernsey/private-investment-fund.md`).
- **PIF Routes 2 / 3** drop the licensed-manager requirement at the cost of narrower investor eligibility (family / private-relationship in Route 2; qualifying private investors in Route 3) — Route 3 is the closer JPF analogue when you don't want the licensed-manager route.

The cross-jurisdictional map's emerging-manager guidance — *"Emerging manager, sub-$100m, BVI-friendly → BVI Approved Manager + Approved Fund"* and *"EU-marketing-focused fund (NPPR) → Jersey JPF or Guernsey PIF"* — matches that split (`knowledge/CROSS-JURISDICTIONAL-MAP.md`).

## What I'd push you on before deciding

- **LP profile**: who actually subscribes? Institutional PE LPs lean Cayman ELP; family/friends and small UHNW pools work for BVI Approved or PIF Route 2; mixed European LPs lean JPF or PIF Route 1/3 for NPPR.
- **AUM trajectory**: BVI Approved caps at US$100m permanently — if you genuinely plan to scale past that within fund life, factor the conversion to BVI Private Fund into the decision now.
- **Substance**: all four jurisdictions have economic-substance regimes; the GP/manager (not the fund vehicle) typically carries the substance burden. This isn't free in any of them — `knowledge/jersey/tax/economic-substance.md` covers the Jersey / CD cluster, and the Cayman/BVI Economic Substance Acts 2018 apply to their respective managers.
- **Parallel structures**: for a global LP base, the standard pattern is a Cayman ELP for non-US LPs with a Delaware LP parallel for US LPs. The corpus does not cover Delaware; if that's relevant, get US counsel.

## Cited corpus files

1. `knowledge/jersey/funds/jersey-private-fund.md` (draft, last_verified 2026-05-15)
2. `knowledge/cayman/exempted-limited-partnership.md` (draft, last_verified 2026-05-18)
3. `knowledge/bvi/incubator-and-approved-fund.md` (draft, last_verified 2026-05-18)
4. `knowledge/guernsey/private-investment-fund.md` (draft, last_verified 2026-05-18)
5. `knowledge/bvi/approved-manager.md` (draft, last_verified 2026-05-18)
6. `knowledge/CROSS-JURISDICTIONAL-MAP.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
