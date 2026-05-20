All sources are fresh (last_verified within the last few days; none exceed the 180-day threshold), so no freshness warnings apply.

## Is the Cayman LLC the right form for redomiciling a Delaware LLC?

Yes — the Cayman LLC is the form purpose-built for exactly this. The **Limited Liability Companies Act 2016** was introduced specifically to **mirror the Delaware LLC** and make Cayman attractive for cross-border restructurings involving Delaware LLCs (`knowledge/cayman/cayman-llc.md`). It is a distinct legal form — neither a company nor a partnership — combining limited liability for *all* members with the contractual flexibility of an LLC Agreement, member-managed governance by default, and minimal statutory formalities (no shares, no statutory capital concept).

The decisive advantage over the alternative (a Cayman exempted company) is structural continuity. For a Delaware LLC, **direct conversion to a Cayman LLC is possible**, whereas redomiciling into an exempted company would require converting to a corporate form first (`knowledge/cayman/cayman-llc.md`). Migration in and out is permitted, and mergers/conversions are available, including with foreign LLCs. So if you want like-for-like parity — same form, same membership-interest concept, same LLC Agreement as master document — the Cayman LLC is the right target.

Two caveats from the corpus:
- The Cayman LLC is **member-managed by default**, so unless you explicitly elect manager-managed, every member may hold management authority. The whole structure rides on the LLC Agreement, and the corpus flags sloppy drafting as "fatal" (`knowledge/cayman/cayman-llc.md`).
- The corpus warns that migration from a Delaware LLC carries **tax-residency and Pillar Two implications** that need careful handling (`knowledge/cayman/cayman-llc.md`). Cayman has implemented a Pillar Two-equivalent **Multinational Top-up Tax (MTT) from 2025**, a 15% minimum effective rate for groups with €750m+ revenue (`knowledge/cayman/tax.md`). If your group is in scope, that changes the tax calculus. Cayman also has economic-substance obligations (Substance Law 2018) that apply to any entity carrying on relevant activities (`knowledge/cayman/cayman-llc.md`, `knowledge/cayman/tax.md`).

The general Cayman migration mechanism is **continuance in / continuance out** under specified Registrar procedures (`knowledge/cayman/companies.md`, `knowledge/cayman/exempted-company.md`), and the LLC registers with the Registrar much like an exempted company, with a 50-year tax undertaking available (`knowledge/cayman/cayman-llc.md`).

## How check-the-box works

"Check-the-box" is the US federal tax **entity-classification election**. As described in the corpus (`knowledge/cayman/cayman-llc.md`):

- **Default classification.** As a foreign entity owned by US tax persons, the Cayman LLC defaults to a **partnership** (if more than one member) or a **disregarded entity** (if a single member). Both give pass-through / flow-through treatment.
- **Elective classification.** The entity can instead **elect to be treated as a corporation**. Corporation treatment is useful for blocker structures and for GILTI / Subpart F planning.

This eligibility for check-the-box is one of the main reasons sponsors pick the LLC over the exempted company — the exempted company is a **per-se corporation in most cases**, so it lacks that flexibility (`knowledge/cayman/cayman-llc.md`). The corpus also flags a pitfall: do not assume the *default* classification is what your structure needs — "US tax assumption errors" are listed explicitly, so the election should be a deliberate decision rather than an afterthought.

Note: the corpus describes the *mechanism and consequences* of check-the-box at this conceptual level. It does not contain the procedural detail (e.g., IRS Form 8832, election timing/effective-date rules), as that is US domestic tax administration outside this offshore corpus.

## Cited files

1. `knowledge/cayman/cayman-llc.md`
2. `knowledge/cayman/companies.md`
3. `knowledge/cayman/exempted-company.md`
4. `knowledge/cayman/tax.md`
