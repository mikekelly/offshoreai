## When to use Jersey trust vs Cayman STAR vs BVI VISTA — what the Jersey corpus says

The Jersey corpus has only a partial answer here: it gives a thorough Jersey-side treatment and one-line definitions of the foreign regimes, but the detailed Cayman STAR and BVI VISTA write-ups it points to (`../cayman/star-trusts.md`, `../bvi/trusts.md`) sit outside the `jersey/` scope I'm restricted to. So I can only give you the comparison from Jersey's side of the table.

### What the three regimes are

- **Jersey non-charitable purpose trust (NCPT)** under **Article 12** of the Trusts (Jersey) Law 1984. Jersey was an early mover here. The trust exists for a non-charitable **purpose** rather than for beneficiaries, and is valid only if the deed appoints an **enforcer** (Articles 12–14). The trustee cannot also act as enforcer. Duration is unlimited (no perpetuities rule post-2006). Royal Court has cy-près-style redirection power under Article 47A if the purpose fails (`jersey/trusts/purpose-trusts.md`).
- **Cayman STAR trust** — Special Trust – Alternative Regime under the **STAR Act 1997**, described in the glossary as Cayman's "distinctive non-charitable purpose trust regime" (`jersey/glossary-extension.md`).
- **BVI VISTA trust** — Virgin Islands Special Trusts Act 2003, described as a regime "where trustee holds shares of underlying company **without active management duties**" (`jersey/glossary-extension.md`). That phrasing is the key tell: VISTA is specifically a *shareholder-grade* trust regime, designed to disapply the trustee's prudent-investor / interventionist duties over the shares of an underlying operating company.

### When you'd reach for which (per the Jersey corpus)

Jersey NCPTs are presented as the workhorse for four use-cases (`jersey/trusts/purpose-trusts.md`):

1. **Orphan SPVs in securitisations, aviation/shipping finance, structured finance** — share-holding purpose trust to keep the SPV off everyone's balance sheet.
2. **Holding a private trust company (PTC)** — the PTC's shares are settled into a purpose trust so they're out of the family's personal estate while the PTC remains trustee.
3. **Family-governance purpose trusts** — long-term holding for purposes (heritage, non-charitable philanthropy) rather than beneficiaries.
4. **STAR-like applications** — Jersey NCPT is "functionally similar to (though not identical with)" Cayman STAR. The corpus states explicitly that the choice between Jersey NCPT and Cayman STAR turns on three axes:
   - **Identity and qualifications of the enforcer** — both regimes require one, but the rules on who can act differ.
   - **Redomiciliation** options.
   - **Regulatory and tax treatment** of the underlying entities.

   No equivalent decision-axes table is given for VISTA in the Jersey corpus, but the VISTA definition implies the natural use-case split: **if your structural problem is "trustee holds shares in an operating company and we don't want the trustee second-guessing the directors / forcing diversification,"** the VISTA design point speaks most directly to that. The Jersey/STAR pair speaks more directly to the "trust without beneficiaries, for a purpose, with an enforcer" design point.

### Adjacent Jersey considerations the corpus flags

- **Foundation vs purpose trust** is the other Jersey-domestic fork: foundations (Foundations (Jersey) Law 2009) are body-corporate vehicles with council/guardian/qualified-member governance and a public charter; NCPTs are private trust deeds with trustee + enforcer (`jersey/trusts/purpose-trusts.md`).
- **Redomiciliation in/out of Jersey for trusts** is covered at `jersey/trusts/change-of-proper-law.md`, which expressly contemplates Jersey-to-Cayman and Jersey-to-BVI moves — relevant if the choice between regimes is being revisited mid-life rather than at settlement.
- The enforcer concept is shared across all three regimes (`jersey/glossary-extension.md`).

### Honest gap

The Jersey corpus **does not give a head-to-head feature comparison of Cayman STAR vs BVI VISTA** — only one-line glossary entries pointing to files outside `jersey/`. For the substantive "STAR vs VISTA" half of your question (e.g. duration rules, who can be enforcer in each, whether trustee can be sole director, how the prudent-investor duty is disapplied) the corpus does not answer the question within the `jersey/` scope.

All files cited below carry `last_verified` dates within the last week (≤ 5 days old) — well inside the 180-day freshness window.

### Cited files

1. `jersey/trusts/purpose-trusts.md` — Article 12 NCPTs, the four use-cases, the explicit Jersey-vs-Cayman-STAR choice axes (`last_verified: 2026-05-14`).
2. `jersey/glossary-extension.md` — definitions of Enforcer, STAR trust, VISTA trust, plus the VISTA design-point hint about shareholdings without active management duties (`last_verified: 2026-05-17`).
3. `jersey/index.md` — confirms Trusts (Jersey) Law 1984 is the relevant statute and that per-Article coverage is complete.
4. `jersey/trusts/change-of-proper-law.md` — referenced for Jersey-to-Cayman/BVI redomiciliation as a live option (not read in depth).
