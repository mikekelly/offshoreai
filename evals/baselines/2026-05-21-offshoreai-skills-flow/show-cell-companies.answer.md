This is a comparative cell-company question, so I'll pull the four jurisdiction-specific files plus the cross-jurisdictional synthesis already in context.All four files are `status: draft` (last verified 2026-05-18, 3 days ago — fresh on age, but draft means the content is written-but-not-source-verified, so I flag that below).

## Short answer

All four are **cell companies** — one shared governance shell (board, registered office, regulatory licence) holding multiple statutorily ringfenced pools. They differ on **(a) jurisdiction-specialism**, **(b) whether each cell has its own legal personality**, and **(c) what foreign counterparties will accept**. Guernsey invented the form (PCC, 1997); Cayman (SPC, 1998) and Bermuda (SAC, 2000) followed.

## When to use each

**Bermuda SAC** — reach for it when the structure is **insurance-led**: captives, rent-a-captive, ILS / catastrophe-bond series, collateralised reinsurance. The SAC is heavily insurance-oriented and BMA-supervised, and sits inside Bermuda's leading reinsurance/ILS market. Each cat-bond series or captive programme gets its own segregated account.
`knowledge/bermuda/segregated-accounts-company.md`

**Cayman SPC** — the **general-purpose, funds-led** choice, especially **multi-strategy hedge funds** where each strategy/share class is a segregated portfolio with its own portfolio shares. Default when you're in a Cayman fund structure and want multiple bankruptcy-remote pockets in one entity.
`knowledge/cayman/segregated-portfolio-company.md`

**Guernsey PCC** — the original, **captive-insurance-led** but now also funds and structured finance. Single legal entity with ringfenced cells. Choose it for European-parent captives and where Guernsey's captive-market depth matters; it's the more common of the two Guernsey forms and the lower-cost option.
`knowledge/guernsey/protected-cell-company.md`

**Guernsey ICC** — choose over a PCC when **cell separateness must be unambiguous**. Each cell is a *separately incorporated company* (not just a ringfenced account), so use it when:
- foreign-court recognition of statutory segregation is a real risk;
- counterparties (prime brokers, custodians) insist on dealing with a distinct legal-personality company, not a cell;
- you anticipate **cell migration** in/out of the structure — an ICC cell already is a company, so it exits/joins cleanly.
Trade-off: slightly higher cost/complexity (each cell is a separate registration).
`knowledge/guernsey/incorporated-cell-company.md`

## The deciding question

| If your priority is… | Use |
|---|---|
| Insurance / captive / ILS, Bermuda market | **Bermuda SAC** |
| Multi-strategy fund, Cayman ecosystem | **Cayman SPC** |
| Captive (esp. European parent), lower cost, single entity | **Guernsey PCC** |
| Each cell must be an unambiguous separate company (foreign-court / counterparty / migration) | **Guernsey ICC** |

The PCC/SPC/SAC are functionally close cousins (single entity, statutory ringfence) and the jurisdiction choice usually follows where the rest of your structure and regulator sit. The **ICC is the genuine structural fork** — it's the only one of the four that gives each cell its own legal personality. (Note the corpus also records a **Cayman LLC** and the original Jersey PCC, but those fall outside your four-way comparison.) This aligns with the cross-jurisdictional decision frameworks in `knowledge/CROSS-JURISDICTIONAL-MAP.md` ("multi-strategy single-entity → Cayman SPC or Guernsey PCC"; "insurance/ILS → Bermuda SAC").

**Caveat:** all four cited files are `status: draft` — the content is drafted but not yet editorially verified against primary statute (SACA 2000, Cayman Companies Act Part XIV, Guernsey Companies Law 2008 / PCC Ordinance 1997). Verify against those primary sources before relying on specific procedural points.

### Cited files
1. `knowledge/bermuda/segregated-accounts-company.md` (draft)
2. `knowledge/cayman/segregated-portfolio-company.md` (draft)
3. `knowledge/guernsey/protected-cell-company.md` (draft)
4. `knowledge/guernsey/incorporated-cell-company.md` (draft)
5. `knowledge/CROSS-JURISDICTIONAL-MAP.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
