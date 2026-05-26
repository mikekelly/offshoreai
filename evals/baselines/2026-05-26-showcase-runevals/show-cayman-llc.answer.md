The corpus has a direct on-point file. Let me also check the redomiciliation angle.## Is the Cayman LLC the right form?

**Yes — it is the form specifically engineered for this case.** The Cayman LLC (introduced by the **Limited Liability Companies Act 2016**) was deliberately designed as a Cayman-law mirror of the Delaware LLC, including to support cross-border restructurings of Delaware LLCs. Among Cayman's options, it is the only form that permits a **direct conversion** from a Delaware LLC; redomiciling into a Cayman exempted company instead would require converting to a corporate form first (`knowledge/cayman/cayman-llc.md`).

The form preserves what you have in Delaware: limited liability for **all members**, contractual flexibility via the **LLC Agreement** as the master document, member-managed by default (or elective manager-managed), and minimal statutory formalities (no shares, no statutory capital concept). For a redomicile, the on/off-migration regime under the LLC Act is what carries you across (`knowledge/cayman/cayman-llc.md`; `knowledge/cayman/companies.md`).

The Cayman exempted company is the wrong choice here unless something else in the structure compels it — it is treated as a **per-se corporation** in most cases for US tax purposes, removing check-the-box flexibility (`knowledge/cayman/cayman-llc.md`).

## How does check-the-box work for the Cayman LLC?

The Cayman LLC is **eligible** for the US "check-the-box" classification regime (Treas. Reg. §301.7701-3 — note this is US federal tax law, not corpus-resident). The corpus summary (`knowledge/cayman/cayman-llc.md`):

- **Default classification** as a foreign eligible entity owned by US persons:
  - **Partnership** if more than one member;
  - **Disregarded entity** if a single member.
- **Election**: the LLC can elect to be treated as a **corporation** instead (Form 8832).
- **Why it matters**: partnership / disregarded treatment gives direct flow-through; corporation treatment is useful for **blocker structures** and for **GILTI / Subpart F** planning where you want to break flow-through.

This elective flexibility is one of the main reasons sponsors prefer the LLC form over the exempted company in US-touching structures (`knowledge/cayman/cayman-llc.md`).

## Things to handle in the redomicile

The corpus flags two material points beyond form choice:

1. **Tax-residency and Pillar Two implications** of migrating from Delaware need careful handling — the migration itself can have US tax consequences and, if the wider group is in scope, Cayman's **MCIT 2025** (15% QDMTT for EUR 750m+ groups) bites on Cayman-resident entities (`knowledge/cayman/cayman-llc.md`; `knowledge/CROSS-JURISDICTIONAL-MAP.md`).
2. **LLC Agreement drafting**: under the LLC Act the agreement is load-bearing for the whole structure; member-managed is the default, so if you want manager-managed governance it must be expressly elected (`knowledge/cayman/cayman-llc.md`).

## Caveats

- Both cited Cayman files are **`status: draft`** — the corpus content is drafted but not yet verified-stable, so treat as orientation and verify against the LLC Act 2016 and your US tax adviser before acting.
- Files were last verified 2026-05-17 and 2026-05-18 (fresh).
- The check-the-box mechanics themselves (Treas. Reg. §301.7701-3, Form 8832, the 60-month limit on changes, the relevance-date election timing) are **US federal tax** and not in the offshoreai corpus — confirm with US tax counsel.

### Cited files

1. `knowledge/cayman/cayman-llc.md`
2. `knowledge/cayman/companies.md`
3. `knowledge/CROSS-JURISDICTIONAL-MAP.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
