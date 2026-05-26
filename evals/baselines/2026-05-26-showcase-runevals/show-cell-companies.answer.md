I'll pull the four cell-vehicle files in parallel to ground a comparative answer.## Bermuda SAC vs Cayman SPC vs Guernsey PCC vs Guernsey ICC

All four are **single-vehicle, statutorily-segregated cell structures** in the same family — Guernsey invented the form in 1997, the others followed. They achieve the same outcome (one entity, ringfenced internal pockets, shared governance overhead), but each has a distinct centre of gravity.

### The four in one line

- **Guernsey PCC (1997)** — *the original*. Single legal entity, ringfenced cells. The Guernsey workhorse — particularly for captives. (`knowledge/guernsey/protected-cell-company.md`)
- **Cayman SPC (1998)** — *general-purpose, fund-centric*. Single legal entity, "segregated portfolios". The default for multi-strategy hedge funds and Cayman insurance. (`knowledge/cayman/segregated-portfolio-company.md`)
- **Bermuda SAC (2000)** — *insurance- and ILS-centric*. Single legal entity, "segregated accounts". BMA pre-vets; the standard structure for ILS sidecars, catastrophe-bond series, and rent-a-captives. (`knowledge/bermuda/segregated-accounts-company.md`)
- **Guernsey ICC** — *cells with their own legal personality*. Not a single entity — each cell is a separately incorporated company under shared governance. The robustness upgrade when foreign-court recognition of statutory segregation is the worry. (`knowledge/guernsey/incorporated-cell-company.md`)

### When to use each

| Scenario | Use |
|---|---|
| Catastrophe bond / ILS sidecar / collateralised reinsurance series | **Bermuda SAC** — Bermuda has the world's largest ILS market and the SAC is its native vehicle. |
| Rent-a-captive or single-parent captive in a Bermuda-clustered programme | **Bermuda SAC** — BMA pre-vetting is part of the value. |
| European-parent captive, especially where the sponsor wants Channel-Islands proximity | **Guernsey PCC** — Guernsey is "Europe's largest by vehicle count" for captives per the cross-jurisdictional matrix ([`knowledge/CROSS-JURISDICTIONAL-MAP.md`](knowledge/CROSS-JURISDICTIONAL-MAP.md)), and captives were the genesis use case for the PCC. |
| Multi-strategy hedge fund / Cayman-domiciled fund platform with strategy-specific portfolio shares | **Cayman SPC** — the dominant fund-side cell vehicle; portfolio shares are the standard investor wrapper. |
| Healthcare captive | **Cayman SPC** — Cayman's specialism ([`knowledge/CROSS-JURISDICTIONAL-MAP.md`](knowledge/CROSS-JURISDICTIONAL-MAP.md)). |
| Multiple fund products / sponsor platform where counterparties (prime brokers, custodians) insist on dealing with a clearly separate company, or where cells need to migrate cleanly in/out | **Guernsey ICC** — each cell already *is* a company, so foreign-court recognition and cell migration are non-issues. |
| Captive with global reinsurance reach where a specific foreign jurisdiction may not respect statutory segregation of a single-entity vehicle | **Guernsey ICC** — the separate-personality story removes the recognition risk. |

### The decision drivers, distilled

1. **What's the activity?** Insurance / ILS → Bermuda SAC. Funds / multi-strategy → Cayman SPC. Captive in the Channel-Islands cluster → Guernsey PCC. Funds or captives where foreign-court recognition is the concern → Guernsey ICC.
2. **Where's the rest of the structure?** Cell vehicles tend to sit in the jurisdiction that already houses the regulated activity — Bermuda for ILS, Cayman for offshore funds, Guernsey for European captives.
3. **Is single-entity status load-bearing?** PCC/SPC/SAC are all *one* legal entity with statutory ringfencing; the ICC is *multiple* entities under shared governance. If your counterparties or foreign courts will reliably honour statutory segregation, the single-entity forms are cheaper and simpler. If they won't, the ICC's separate legal personality removes the argument entirely — at the cost of separate filings per cell.
4. **Don't forget Jersey PCC.** Jersey also has a PCC (Loi 2006) — less used than the other four for cell-vehicle work, but worth noting if a Jersey structure is already in place.

### Caveats

- The four corpus files I cited above are all **`status: draft`** (last verified 2026-05-18). The substance matches the comparative matrix in [`knowledge/CROSS-JURISDICTIONAL-MAP.md`](knowledge/CROSS-JURISDICTIONAL-MAP.md), but for a live structuring decision you'd want to verify against the primary statutes (SACA 2000 for Bermuda; Part XIV of the Cayman Companies Act; Companies (Guernsey) Law 2008 for PCC and ICC) and current regulator guidance.
- **Foreign-court recognition** is the cross-cutting risk for all single-entity forms. Cell identification discipline in contracts (always "[Vehicle] acting in respect of [Cell]") is what holds the segregation together in practice — sloppy identification is the most common pitfall flagged across all four files.

### Files cited

1. `knowledge/guernsey/protected-cell-company.md` (draft, 2026-05-18)
2. `knowledge/guernsey/incorporated-cell-company.md` (draft, 2026-05-18)
3. `knowledge/bermuda/segregated-accounts-company.md` (draft, 2026-05-18)
4. `knowledge/cayman/segregated-portfolio-company.md` (draft, 2026-05-18)
5. `knowledge/CROSS-JURISDICTIONAL-MAP.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
