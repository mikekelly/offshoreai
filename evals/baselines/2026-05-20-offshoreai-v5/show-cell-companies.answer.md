This is a cross-jurisdictional cell-company question, so let me pull the four specific structure files in parallel.I have the four files I need. Note all four are `status: draft` (verified 2026-05-18, so fresh on age but unverified content) — I'll flag that.

## Cell-company selection: SAC vs SPC vs PCC vs ICC

All four solve the same problem — multiple statutorily ringfenced asset/liability pools inside shared governance — but they differ on **legal personality**, **sector orientation**, and **foreign-court robustness**. Here is when each is the right reach.

### Bermuda SAC — reach for it when the use case is *insurance*
The SAC (Segregated Accounts Companies Act 2000) is functionally a single legal entity with segregated accounts, but in practice it is **heavily insurance-oriented**: captives, ILS / catastrophe-bond series, rent-a-captive, and collateralised reinsurance, supervised by the BMA. Choose it when your structure sits in Bermuda's insurance/ILS ecosystem and you want each programme or bond series in its own account. (`knowledge/bermuda/segregated-accounts-company.md`)

### Cayman SPC — reach for it for *general-purpose funds*
The SPC (Companies Act Part XIV) is the **general-purpose** member of the family — one legal entity, portfolio shares per segregated portfolio, single audit and filing set with portfolio-level detail. It is the default where you want multiple bankruptcy-remote pockets in a Cayman fund (multi-strategy hedge funds, umbrella structures) rather than an insurance-specific vehicle. (`knowledge/cayman/segregated-portfolio-company.md`)

### Guernsey PCC — the *original*, default single-entity cell vehicle
Guernsey invented the form (Protected Cell Companies Ordinance 1997, now in the Companies (Guernsey) Law 2008): a core plus statutorily ringfenced cells, single legal personality. Born from Guernsey's **captive insurance** industry (still the principal use case) but now used across funds and structured finance. Reach for it as the lower-cost, lower-complexity Guernsey option when single legal personality is acceptable and your counterparties accept statutory segregation. (`knowledge/guernsey/protected-cell-company.md`)

### Guernsey ICC — reach for it when *separate legal personality matters*
The ICC gives **each cell its own separate incorporated legal personality** while sharing board, registered office, and administration. Choose it over a PCC (or any single-personality cell company) when:
- **foreign-court recognition risk is acute** — each cell is unambiguously its own company, not a statutory ringfence a foreign court might decline to respect;
- **counterparties insist on a separate corporate counterparty** (prime brokers, custodians who won't deal with a "cell");
- **cell migration** is contemplated — an ICC cell can leave/join cleanly because it is already a company;
- a **regulatory regime** wants the cell treated as a company.

The trade-off is slightly higher cost/complexity (each cell is a separate registration). (`knowledge/guernsey/incorporated-cell-company.md`)

### Decision summary

| If your priority is… | Use |
|---|---|
| Bermuda insurance / captive / ILS series | **Bermuda SAC** |
| General-purpose / multi-strategy fund pockets (Cayman) | **Cayman SPC** |
| Lowest-friction single-entity cell vehicle; captives, EU-proximate funds | **Guernsey PCC** |
| Separate legal personality per cell — foreign-court robustness, counterparty insistence, cell migration | **Guernsey ICC** |

The corpus's own framing: **PCC/SPC/SAC = one company with ringfenced internal accounts; ICC = a group of companies under shared governance with statutory cell-ringfencing** (`knowledge/guernsey/incorporated-cell-company.md`). The cross-jurisdictional matrix also notes Guernsey is "Europe's largest [captive market] by vehicle count; PCC-based," Bermuda SAC is "insurance-focused," and Cayman SPC is general-purpose (`knowledge/CROSS-JURISDICTIONAL-MAP.md`).

**Caveat:** All four cited concept files are `status: draft` — drafted but not yet editorially verified against primary sources. They were last verified 2026-05-18 (fresh on age), but you should confirm the statutory detail against the primary instruments (SACA 2000, Cayman Companies Act Part XIV, Companies (Guernsey) Law 2008) before relying on it.

### Cited files
1. `knowledge/bermuda/segregated-accounts-company.md` (draft)
2. `knowledge/cayman/segregated-portfolio-company.md` (draft)
3. `knowledge/guernsey/protected-cell-company.md` (draft)
4. `knowledge/guernsey/incorporated-cell-company.md` (draft)
5. `knowledge/CROSS-JURISDICTIONAL-MAP.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
