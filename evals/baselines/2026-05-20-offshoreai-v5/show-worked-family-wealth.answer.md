The worked-example file is the closest match to this scenario. Let me read it along with the firewall-strength and forced-heirship analysis files.The corpus has a near-exact worked example for this scenario (the fictional "Rossi family" — Italian-domiciled, ~€80m across EU/US/Swiss/Caribbean), so I can give you a structured, cited answer.

**Status caveat up front:** every file I cite is currently `draft` status — the content is drafted but not yet editorially verified against primary sources. All were last verified 2–6 days ago, so freshness is fine; treat the substance as reliable orientation but verify the Article references against the consolidated Trusts Law on jerseylaw.je before relying on it.

## The core defence: the Article 9 firewall

The structural answer to Italian forced heirship (the *legittima* — indefeasible reserved shares for spouse and children) is the **Article 9 firewall** of the Trusts (Jersey) Law 1984. It instructs the Royal Court to determine all questions of the trust's validity, the settlor's capacity to settle, administration, and beneficial rights **by Jersey law alone**, and to give no effect to foreign rules — expressly including forced-heirship and matrimonial-property rules (`knowledge/jersey/trusts/firewall.md`, Article 9(1)–(2)). Critically for an Italian client:

- Jersey's own *légitime* applies **only if the settlor is domiciled in Jersey** (Article 9(3)) — Mr Rossi being Italian-domiciled, it does not bite.
- A foreign judgment inconsistent with Article 9 — e.g. an Italian *clawback* (*riduzione*) order treating the lifetime transfer into trust as defeating reserved shares — is **unenforceable in Jersey** (Article 9(4), the strong-form firewall) (`knowledge/jersey/trusts/firewall.md`; `knowledge/jersey/use-cases/trust-officer/forced-heirship.md`).

## How to set it up — step by step

Drawing on the worked example (`knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`):

1. **Wrapper choice — discretionary trust.** A Jersey discretionary trust is the natural choice over a foundation: long history, well-understood by foreign tax authorities, and the firewall is in fully developed form for trusts.

2. **Settlement deed.** Establish the trust with an **explicit Jersey-law governing-law declaration** (this triggers the Article 9 firewall), Mr Rossi as settlor, a Jersey-licensed Trust Company Business as initial trustee, and a broad beneficiary class (settlor, spouse, children, grandchildren, future issue, charitable purposes). Add a **protector** and a **non-binding letter of wishes**.

3. **Reserved powers under Article 9A.** Mr Rossi can retain a defined menu of powers — consent over specified trustee actions, power to add/remove beneficiaries, power to remove and replace trustees — without invalidating the trust; the trust takes immediate effect and the trustee acting on a reserved power does not breach trust (`knowledge/jersey/trusts/reserved-powers.md`, Article 9A(1)–(3)). **Watch the limit:** reserved powers must stop short of *retained beneficial ownership*, or the trust risks failing the Article 2 existence test as a sham — Article 9A does not save a sham.

4. **Underlying holding structure, asset-class by asset-class** (worked example, Step 3 & 7):
   - **EU operating-company shares** — Luxembourg or Jersey holdco for treaty access;
   - **US public equities** — held through a **non-US blocker** (Cayman/BVI) to avoid US estate-tax exposure (a non-US-domiciliary gets only a $60,000 threshold on US-situs assets);
   - **Swiss bank portfolio** — held directly by the underlying company;
   - **Caribbean villa** — a **BVI BC** owning the property directly, avoiding local estate tax on death.

5. **Optional PTC layer.** As the structure matures, a Jersey **Private Trust Company** (owned by a purpose trust) can replace the professional trustee for greater family governance (`knowledge/jersey/financial-regulation/private-trust-company.md`, per the worked example).

## What the firewall does *not* do — manage these honestly

- **It protects the trust, not the people.** The firewall is *in rem* for the trust assets but does not stop a foreign court making orders **personal to the settlor or beneficiaries**. Italian-resident beneficiaries remain subject to Italian jurisdiction, and a settlor can face contempt pressure abroad — that pressure drives many practical outcomes despite Article 9 (`knowledge/jersey/use-cases/international-lawyer/article-9-firewall.md`).
- **Article 9 is asserted, not automatic.** On a live forced-heirship claim the trustee should apply for **Article 51 Royal Court directions** to obtain authoritative Jersey-court confirmation of the firewall position (`knowledge/jersey/use-cases/trust-officer/forced-heirship.md`).
- **Tax and transparency are separate questions the firewall cannot answer.** The structure carries substantial ongoing obligations: **CRS** reporting to Italy/UK, **FATCA** (US IGA), possible **DAC6** cross-border-arrangement disclosure, **UK TRS** registration for the UK-resident child, and **Italian declaration** of the trust. The UK-resident beneficiary creates UK IHT/income exposure (excluded-property analysis, 10-year charges) needing specialist UK tax advice. Italian tax declarations done carelessly invite retrospective challenge (worked example, Steps 6–8 and Pitfalls).

## Cited files

1. `knowledge/jersey/trusts/firewall.md` (Article 9) — draft
2. `knowledge/jersey/trusts/reserved-powers.md` (Article 9A) — draft
3. `knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md` — draft
4. `knowledge/jersey/use-cases/international-lawyer/article-9-firewall.md` — draft
5. `knowledge/jersey/use-cases/trust-officer/forced-heirship.md` — draft

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
