Read the worked example, firewall, reserved-powers, and proper-law files — the corpus has an on-point worked example mapping almost exactly to this brief.

## The structure in outline

A **Jersey discretionary trust** governed by Jersey law, holding the family's assets via **underlying SPVs** chosen per asset class, with the **Article 9 firewall** doing the forced-heirship defence work and **Article 9A reserved powers** preserving settlor influence without invalidating the trust. This is the standard architecture for an Italian-domiciled HNW family with multi-jurisdictional assets — `knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md` walks essentially this exact scenario end-to-end.

## Step-by-step

### 1. Establish Jersey as the proper law

Make an **express choice of Jersey law** in the trust deed. Article 4 TJL 1984 recognises express, implied, or closest-connection routes, but the express choice is dispositive — and it is the express choice that engages Articles 9 and 9A. A non-Jersey-proper-law trust does **not** get the firewall (`knowledge/jersey/trusts/proper-law.md`).

### 2. Structure the deed for Article 9 firewall protection

Article 9 instructs the Royal Court to apply **only Jersey law** to validity, capacity, administration, beneficial rights, and trustee powers, and **to disregard** foreign rules that would otherwise constrain the settlor — including Italian *legittima* (`knowledge/jersey/trusts/firewall.md`). Key paragraphs that matter for an Italian client:

- **9(1)–(2):** Italian forced-heirship is not applied by Jersey courts, even though Italy is the settlor's domicile.
- **9(4):** Foreign judgments inconsistent with Article 9 — e.g., an Italian clawback order under *legittima* — are **unenforceable in Jersey**.
- **9(3A):** Jersey *renvoi* is shut off; the firewall is a self-contained choice-of-law rule.

The deed must **not** smuggle Italian rules back in — for example, no clause requiring distributions to track Italian forced-heirship shares, which would undercut the firewall.

### 3. Use Article 9A to give the settlor calibrated control

Article 9A permits the settlor to reserve a defined menu of powers without invalidating the trust: revocation, variation, advancement, direction of investment, appointment/removal of beneficiaries or trustees, change of proper law, consent powers (`knowledge/jersey/trusts/reserved-powers.md`). Trustee protection under 9A(3) only bites when the reserved power is **exercised expressly**, so the deed should:

- list reserved powers exactly (no catch-alls);
- specify the mechanism of exercise (written direction, witnessing);
- address what happens on the settlor's incapacity or death (otherwise the powers lapse awkwardly);
- pair with a non-binding letter of wishes.

**Cautions:** reserved-powers planning still has to survive (a) sham analysis — if the settlor in substance retains beneficial ownership, Article 9A does not save the structure; (b) **Italian substance-over-form characterisation** — Article 9A confirms Jersey-law validity but does not answer how Italian tax authorities will treat the trust. Specialist Italian tax advice is essential before signing.

### 4. Build the underlying holding layer per asset class

Hold the assets through SPVs sitting beneath the trustee, not directly in the trust. The worked example points to these per asset class:

- **EU operating-company shares** — Luxembourg or Jersey holdco for treaty access;
- **US public equities** — Cayman or BVI **blocker corporation** to remove US-situs exposure on the settlor's death (non-US-domiciled individuals get only a $60k US estate-tax exemption holding US shares directly);
- **Swiss private bank account** — held by underlying company directly;
- **Caribbean villa** — typically a BVI BC owning the property, to avoid local estate-tax exposure.

### 5. Trustee selection — TCB initially, PTC option later

Initial trustee = a **Jersey-licensed Trust Company Business** under FSL 1998. For a family of this size, a **Private Trust Company** owned by a Jersey Article 12 purpose trust (or Cayman STAR / BVI VISTA) is often added once governance matures, with family and professional directors. See `knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md` step 4.

### 6. Compliance and reporting

Per `knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md` step 8 — the structure must address: **CRS** (Italy is a reportable jurisdiction for the settlor and Italian-resident beneficiaries), **FATCA** (if any US person enters the controlling-persons list), **DAC6** (cross-border-arrangement reporting on the EU side), and **Italian tax declarations** of the trust by the settlor on creation and ongoing.

## Limits of the firewall — flag to the client

The firewall is structural protection, not absolute immunity. The corpus is explicit (`knowledge/jersey/trusts/firewall.md` "Limits" section):

- It binds the Royal Court and Jersey-located assets — **not** the Italian court acting *in personam* against an Italian-resident beneficiary.
- Assets located outside Jersey may be reached by foreign courts directly.
- Sham analysis — failing the Article 2 existence test — defeats Article 9 entirely.
- Public policy is a residual override.

For belt-and-braces, consider parallel **lifetime succession planning in Italy** (notarial instruments such as a *patto di famiglia* for operating-business interests) rather than relying on Jersey alone.

## Status caveat

All four cited corpus files are currently **`draft`** (not `stable`) — content is verified within the last two weeks but pending an editorial pass. Treat the architecture as directionally correct and cite the statute / primary sources directly before acting.

## Sources cited

1. `knowledge/jersey/trusts/firewall.md` — Article 9 TJL 1984 (firewall)
2. `knowledge/jersey/trusts/reserved-powers.md` — Article 9A TJL 1984
3. `knowledge/jersey/trusts/proper-law.md` — Article 4 TJL 1984
4. `knowledge/jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md` — end-to-end worked example (Italian-domiciled patriarch, multi-jurisdiction assets)

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
