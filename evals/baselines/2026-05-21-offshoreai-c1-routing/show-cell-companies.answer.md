This is a cross-jurisdictional cell-company comparison — I'll read the four substantive cell-company files in parallel.All four cell-company files are `status: draft` (last verified 2026-05-18, fresh), so I'll flag that the content is drafted but not yet editorially verified.

## Short answer

All four are statutory "cell" vehicles solving the same problem — multiple ringfenced asset/liability pools inside shared governance — but they diverge on **(a) primary sector**, **(b) whether each cell has separate legal personality**, and **(c) foreign-court robustness**. Pick by what dominates your structure.

## When to use each

**Bermuda SAC** — reach for it when the activity is **insurance**. SACs are heavily insurance-oriented: corporate captives, ILS / catastrophe-bond series (Bermuda's ILS market is the world's largest), rent-a-captive, and collateralised reinsurance. Single legal entity, BMA pre-vetting where the purpose is regulated. This is the standard cell vehicle for insurance/ILS. (`knowledge/bermuda/segregated-accounts-company.md`)

**Cayman SPC** — the default for **funds**, especially multi-strategy hedge funds running several strategies (equity L/S + credit + macro) through portfolios of one entity, plus securitisation conduits (each series a portfolio) and family-office multi-strategy pools. Single legal entity, portfolio-level CIMA registration. Cayman has **no ICC equivalent** — an ICC-style outcome there requires forming separate companies. (`knowledge/cayman/segregated-portfolio-company.md`)

**Guernsey PCC** — the **original** cell company (1997 Ordinance, now in the Companies (Guernsey) Law 2008) and the simpler, lower-cost Guernsey option. Single legal entity with a core plus ringfenced cells. Born from — and still dominant in — **captive insurance**, but also heavily used for funds and structured finance. Choose it for European-parent captives or general Guernsey cell use where you don't need separate legal personality per cell. (`knowledge/guernsey/protected-cell-company.md`)

**Guernsey ICC** — choose it specifically when you need **each cell to be its own incorporated company**, not just a statutory ringfence. The triggers:
- **Acute foreign-court recognition risk** — each cell is unambiguously a separate company, the most robust against cross-cell pooling;
- **Counterparties that won't deal with cells** — international prime brokers, custodians, regulated counterparties who insist on a separate corporate counterparty;
- **Contemplated cell migration** — a cell can leave/join an ICC more cleanly because it already has its own personality;
- **Regulatory regimes that treat cells differently from companies**.

Cost is slightly higher (each cell is separately registered). Don't over-engineer: most uses don't need it, and the PCC is simpler. **Guernsey is the only one of these jurisdictions offering both PCC and ICC** — Bermuda has only SAC, Cayman only SPC. (`knowledge/guernsey/incorporated-cell-company.md`)

## Decision summary

| If your driver is… | Use |
|---|---|
| Insurance / captive / ILS / reinsurance | **Bermuda SAC** |
| Multi-strategy fund / securitisation, single entity | **Cayman SPC** |
| Captive or fund, simple/lower-cost, separate personality not needed | **Guernsey PCC** |
| Need each cell to be a distinct company (foreign-court robustness, fussy counterparties, cell migration) | **Guernsey ICC** |

The corpus's own cross-jurisdictional framework agrees on the headline leans: insurance/ILS → Bermuda SAC; multi-strategy single-entity → Cayman SPC or Guernsey PCC; European-parent captive → Guernsey PCC cell (`knowledge/CROSS-JURISDICTIONAL-MAP.md`, "Where should I form my (re)insurance company?" framework).

**Two cross-cutting cautions** that apply to all four: segregation can be **pierced by sloppy cell/portfolio identification** in contracting, and **foreign-court recognition** of statutory segregation is well-established but not universal — the single biggest reason to step up from PCC/SPC/SAC to a Guernsey ICC.

## Caveats
- All four cited files are `status: draft` — content is drafted but **not yet editorially verified against primary sources**; treat the structuring conclusions as orientation and confirm against the governing statutes (SACA 2000; Cayman Companies Act Part XIV; Companies (Guernsey) Law 2008) before acting.
- Freshness: all last verified 2026-05-18 (fresh).

## Cited files
1. `knowledge/bermuda/segregated-accounts-company.md`
2. `knowledge/cayman/segregated-portfolio-company.md`
3. `knowledge/guernsey/protected-cell-company.md`
4. `knowledge/guernsey/incorporated-cell-company.md`
5. `knowledge/CROSS-JURISDICTIONAL-MAP.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
