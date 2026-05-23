The corpus has a worked example almost exactly matching this brief — an Italian-domiciled HNW family with European, US, Swiss, and Caribbean assets, structuring a Jersey trust against *legittima* forced heirship. Note that the citing files are status `draft` (content written and source-cited but unverified against primary law), so verify before acting.

## Core wrapper — Jersey discretionary trust under Article 9

Set up a **Jersey-law discretionary trust** by Settlement Deed with an **express choice of Jersey law** as the proper law. The express choice engages **Article 9 of the Trusts (Jersey) Law 1984** — the firewall — which instructs the Royal Court to apply Jersey law (and only Jersey law) to questions of validity, capacity to settle, administration, and beneficial rights, and to refuse to give effect to foreign forced-heirship rules. Critically, **Article 9(4)** makes foreign judgments inconsistent with Article 9 unenforceable in Jersey — including Italian court orders for *legittima* clawback against the trust assets (`knowledge/jersey/trusts/firewall.md`).

The deed should not include any provisions that re-import foreign rules through the back door (e.g., a clause requiring the trustee to distribute in accordance with the settlor's home-country succession law would undercut the firewall) (`knowledge/jersey/trusts/firewall.md`).

## Parties

- **Settlor**: Mr Rossi (Italian-domiciled), with documented intent to remove assets from the Italian estate.
- **Trustee**: a Jersey-licensed Trust Company Business (TCB) regulated under FSL 1998. A **Private Trust Company (PTC)** owned by a Jersey Article 12 purpose-trust can be layered in later for family governance.
- **Beneficiaries**: a broad discretionary class — settlor, wife, children, grandchildren, future issue, and charitable purposes.
- **Protector**: external trusted adviser.
- **Reserved powers** to the settlor under **Article 9A** — consent to specified trustee actions, add/remove beneficiaries, remove/replace trustees. Article 9A(3) protects the trustee acting on settlor direction from breach-of-trust liability; Article 9A(3A) confirms the settlor is not thereby made a trustee (`knowledge/jersey/trusts/reserved-powers.md`).
- **Letter of wishes**: separate, non-binding.

## Asset-holding layer — underlying SPVs by asset class

The trust should not hold investments directly; insert an underlying holding layer, with the SPV jurisdiction chosen per asset class (`knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`):

| Asset | Vehicle |
|---|---|
| European operating-company shares | Luxembourg or Jersey holdco (treaty access) |
| US public equities | **Cayman or BVI blocker corporation** — essential to avoid US federal estate tax on the settlor's death (non-US-domiciled individual gets only a $60,000 US-situs estate threshold) |
| Swiss private bank portfolio | Held directly by the underlying company |
| Caribbean villa | BVI BC owning the property directly |

## Italian forced-heirship — how the defence actually operates

Italian law would otherwise apply to Mr Rossi's estate (Italian-domiciled, Italian-national) and Italian forced heirs could in principle pursue *legittima* clawback of lifetime gifts. The Jersey response:

1. **Jersey law** governs validity, capacity, and beneficial rights of the Jersey trust (Article 9(1)–(2));
2. **Italian forced-heirship is not applied** by the Royal Court;
3. **Italian clawback judgments** are unenforceable in Jersey (Article 9(4));
4. On a substantive claim, the trustee applies for **Article 51 directions** from the Royal Court for explicit endorsement of the Article 9 position (`knowledge/jersey/use-cases/trust-officer/forced-heirship.md`; `knowledge/jersey/trusts/firewall.md`).

## Limits the family must be told about

The firewall is structural, not absolute (`knowledge/jersey/trusts/firewall.md`; `knowledge/jersey/use-cases/trust-officer/forced-heirship.md`):

- **Personal jurisdiction over Italian-resident beneficiaries.** Article 9 binds the Royal Court and Jersey-located assets; it does not bind Italian courts ordering an Italian-resident *beneficiary* to take steps. The trust is protected; an in-Italy beneficiary remains personally subject to Italian orders.
- **Asset location.** The firewall cannot reach foreign-situs assets that an Italian court can attach directly.
- **Sham analysis.** If the structure fails the Article 2 existence test because the settlor in substance retains beneficial ownership, the firewall does not engage. Reserved-powers drafting must stay on the right side of that line.
- **Public policy.** Jersey public policy is a residual override, rarely invoked.
- **Trustee personnel travel.** Italian-court contempt risk for trustee staff travelling to Italy on business is a real practical exposure.

## Compliance and cross-border tax overlay

The structure carries substantial ongoing reporting (`knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`):

- **CRS** reporting from Jersey to Italy, the UK, and any other controlling-person home jurisdictions;
- **FATCA** if any US person sits in the controlling-persons list;
- **DAC6** reportability of the cross-border arrangement to EU member states;
- **UK Trust Registration Service** for the UK-resident child;
- **Italian tax declarations** by Mr Rossi for the trust;
- The **UK-resident child** creates separate UK tax exposure (excluded-property analysis, 10-year anniversary IHT, distribution matching rules) needing specialist UK tax advice.

## Why Jersey for this specific brief

The corpus's cross-jurisdictional map places Jersey's Article 9 firewall — particularly Article 9(4) on foreign judgments — as the strongest forced-heirship defence among the offshore centres covered (`knowledge/CROSS-JURISDICTIONAL-MAP.md` — "Where should I form my trust?" / "Maximum forced-heirship defence" → Jersey). Article 9A on reserved powers plus Article 47B–H on mistake-based set-aside give the structure additional resilience over its lifetime.

## Caveats

The four citing files are all status **draft** (written 14–18 May 2026, ages 5–9 days) — content is drafted but not yet stably verified. Article references should be checked against the consolidated [Trusts (Jersey) Law 1984 on jerseylaw.je](https://www.jerseylaw.je/laws/current/l_11_1984) before relying on them in client work. The Italian-law side (current scope of *legittima* clawback, EU Succession Regulation interaction) is outside the corpus — Italian counsel is required.

## Cited files

1. `knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`
2. `knowledge/jersey/trusts/firewall.md`
3. `knowledge/jersey/trusts/reserved-powers.md`
4. `knowledge/jersey/use-cases/trust-officer/forced-heirship.md`
5. `knowledge/CROSS-JURISDICTIONAL-MAP.md`

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
