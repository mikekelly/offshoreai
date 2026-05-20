All four files are `status: draft`, `last_verified: 2026-05-18` (2 days old — well within the freshness window, no staleness flag needed).

## Bermuda SAC vs Cayman SPC vs Guernsey PCC vs Guernsey ICC — when to use each

All four are members of the same "cell company" family: a way to hold **multiple statutorily ringfenced risk/capital pools** without forming a separate company for each. Guernsey invented the concept (PCC, 1997); Cayman (SPC, 1998), Bermuda (SAC, 2000), BVI, and Jersey followed. The first three (SAC, SPC, PCC) are a **single legal entity** with internal ringfenced compartments; the Guernsey ICC is the odd one out — **each cell is its own separately-incorporated company** (`knowledge/guernsey/protected-cell-company.md`, `knowledge/cayman/segregated-portfolio-company.md`).

### The distinguishing axes

Two questions decide the choice:

1. **What activity is it for?** — insurance/ILS vs funds vs general.
2. **How robust does the segregation need to be against foreign courts and demanding counterparties?** — internal statutory ringfence vs genuinely separate legal personality.

### When to use each

**Bermuda SAC — insurance is the primary use.** Reach for the SAC when the activity is **captive insurance, ILS (insurance-linked securities) / catastrophe-bond series, rent-a-captive, or collateralised reinsurance**. Bermuda's ILS market is the world's largest and SACs are central to it. A SAC is an exempted company registered under the Segregated Accounts Companies Act 2000; the BMA pre-vets where the SAC's purpose is regulated (insurance most commonly) — that regulatory pre-vetting plus the insurance orientation is its distinguishing feature. It can also be used for multi-strategy funds, but for pure fund use Cayman SPC is the closer analogue (`knowledge/bermuda/segregated-accounts-company.md`).

**Cayman SPC — the general-purpose / funds workhorse.** Use the SPC when you want **multi-strategy hedge funds** (e.g. equity long-short + credit + macro under one entity with portfolio-specific fees and investor stakes), **securitisation conduits** (each series a portfolio), insurance/reinsurance segregation in the Cayman market, or family-office multi-strategy pools. It's described as general-purpose where Bermuda SAC is insurance-oriented. Each "segregated portfolio" issues portfolio shares; regulation (Mutual Funds Act / Private Funds Act, CIMA, Insurance Act) attaches at the portfolio level. Note: Cayman has **no statutory ICC equivalent** — an ICC-style outcome there requires forming separate companies (`knowledge/cayman/segregated-portfolio-company.md`).

**Guernsey PCC — the original, insurance-led but broad; the default Guernsey cell form.** Use the PCC for **captive insurance** (its genesis and still-dominant use — each cell = one insurance programme under a single Guernsey insurance licence), and also for **investment funds, structured finance, and multi-strategy hedge/PE platforms**. It's the more common of Guernsey's two forms and the simpler/lower-cost choice. Pick it over the ICC whenever you don't specifically need separate legal personality per cell (`knowledge/guernsey/protected-cell-company.md`).

**Guernsey ICC — when single legal personality isn't enough.** Choose the ICC (each cell separately incorporated) specifically when:
- **Foreign-court recognition risk is acute** — each cell as its own company is unambiguously separate, eliminating residual cross-cell pooling risk that a single-entity PCC/SPC/SAC theoretically carries;
- **Counterparties insist on a separate corporate personality** (e.g. international prime brokers, custodians, or regulated counterparties who won't deal with a "cell," only a company);
- **Cell migration in/out is contemplated** — an ICC cell can leave and continue as a standalone company (or join another ICC) more cleanly because it already has its own personality;
- **A regulatory regime requires the cell to be treated as a separate entity.**

The trade-off is slightly higher cost/administrative burden (each cell is a separate company on the register, with its own filings). The corpus warns against **over-engineering** — most use cases don't need it, and PCC is simpler. Guernsey is the only one of these jurisdictions offering both PCC and ICC; if you need the ICC's separate-personality robustness, Guernsey is the choice (`knowledge/guernsey/incorporated-cell-company.md`).

### Quick decision summary

| If you need… | Use |
|---|---|
| Captive / ILS / rent-a-captive, BMA-supervised | **Bermuda SAC** |
| Multi-strategy funds / securitisation, general-purpose | **Cayman SPC** |
| Captive or funds in Guernsey, default single-entity cell | **Guernsey PCC** |
| Each cell to be a genuinely separate company (foreign-court robustness, demanding counterparties, cell migration) | **Guernsey ICC** |

The cross-jurisdictional comparison echoes this: it pairs "multi-strategy single-entity" with **Cayman SPC or Guernsey PCC**, "European-parent captive" with **Guernsey PCC**, and "ILS / sidecar / cat-bond series" with **Bermuda SPI / SAC** (`knowledge/CROSS-JURISDICTIONAL-MAP.md`).

One caveat the files stress for all four: the statutory segregation is **strong but not absolute** — sloppy cell/portfolio/account identification in contracts, poorly documented inter-cell dealings, and foreign-court non-recognition are the recurring pitfalls (the ICC is the structural answer to that last one).

---

### Files cited
1. `knowledge/bermuda/segregated-accounts-company.md`
2. `knowledge/cayman/segregated-portfolio-company.md`
3. `knowledge/guernsey/protected-cell-company.md`
4. `knowledge/guernsey/incorporated-cell-company.md`
5. `knowledge/CROSS-JURISDICTIONAL-MAP.md` (transcluded via project context)
