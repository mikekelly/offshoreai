The reminder doesn't fit here — this is a single Q&A turn, no multi-step work to track.

# Jersey trust vs Cayman STAR vs BVI VISTA

These are three different statutory tools that solve **different problems**. They're not direct substitutes — picking between them means first identifying which problem you actually have.

## What each is built for

**Jersey trust (Trusts (Jersey) Law 1984)** — a general-purpose discretionary or fixed-interest trust with two distinctive features for cross-border families: (i) the **Article 9 firewall** insulating Jersey trusts from forced-heirship and foreign matrimonial claims, and (ii) **Article 9A reserved powers** letting the settlor retain investment, revocation, amendment, and other listed powers without invalidating the trust. The default vehicle when you need a wealth-structuring trust with strong defensive cross-border protections [`jersey/trusts/trusts-law-1984.md`, `jersey/trusts/reserved-powers.md`].

**Cayman STAR (Special Trusts — Alternative Regime Act 1997)** — a **non-charitable purpose** trust. Solves the rule that non-charitable trusts must have beneficiaries: STAR permits any lawful purpose (or a mix of purposes and beneficiaries), enforced by a mandatory **enforcer** rather than by beneficiaries. Built for orphan SPVs, PTC-holding structures, and purpose-driven family-governance vehicles [`cayman/star-trusts.md`].

**BVI VISTA (Virgin Islands Special Trusts Act 2003)** — a **share-ownership trust** that disengages the trustee from the underlying company's management. It disapplies the *Bartlett v Barclays* duty of active monitoring/intervention. The trust must hold shares in a **designated company** (typically a BVI BC) and must include **office of director rules** (ODRs) governing who appoints/removes directors. Built specifically for **family-operating-business succession** where the family wants chosen directors running the company without trustee second-guessing [`bvi/vista-trusts.md`].

## When to use which

| Problem | Vehicle |
|---|---|
| Multi-generational wealth structure for a family exposed to forced heirship or foreign matrimonial claims | **Jersey trust** — Article 9 firewall is the strongest of the three for this purpose [`bvi/vista-trusts.md`] |
| Settlor wants to keep investment / revocation / amendment powers without sham risk | **Jersey trust** with Article 9A reserved powers [`jersey/trusts/reserved-powers.md`] |
| Orphan SPV for securitisation, aviation/shipping finance, or to hold a PTC | **Cayman STAR** *or* **Jersey Article 12** non-charitable purpose trust — functionally similar; choice turns on enforcer rules, redomiciliation options, and tax treatment of the underlying entities [`jersey/trusts/purpose-trusts.md`, `cayman/star-trusts.md`] |
| Pure purpose trust with no beneficiaries (e.g. maintain a heritage asset, philanthropic-like purposes not strictly charitable) | **Cayman STAR** or **Jersey Article 12** |
| Family operating business: shares into trust, family/chosen directors continue to run the company, trustee should stay out of management decisions | **BVI VISTA** — designed for exactly this. A Jersey trust with Article 9A reserved powers can approximate it contractually, but the trustee's *Bartlett* monitoring duty isn't statutorily disabled [`bvi/vista-trusts.md`] |
| Single-asset / illiquid private-company holding where diversification isn't possible | **BVI VISTA** — Bartlett duty doesn't fit; VISTA solves the mismatch [`bvi/vista-trusts.md`] |
| Combination case: orphan structure *and* operating-company shares | Sometimes layered — e.g. a STAR purpose trust at the top and VISTA-style arrangements below, or a Jersey trust holding a BVI VISTA sub-structure |

## Things to weigh that the corpus surfaces

- **VISTA limitation**: the designated company is typically a BVI BC. If the underlying operating company isn't BVI (or later redomiciles out), VISTA protection may not apply or may be lost [`bvi/vista-trusts.md`].
- **STAR vs Jersey Article 12**: the corpus describes these as "functionally similar" for orphan and family-governance use; the distinguishing factors are **enforcer qualifications, redomiciliation, and tax/regulatory treatment of the underlying entities** [`jersey/trusts/purpose-trusts.md`].
- **Forced-heirship defence**: the corpus's comparison table rates Jersey's Article 9 firewall as the strongest of the three; STAR has its own mechanism; VISTA is "less robust than Jersey/Cayman" for this specific use [`bvi/vista-trusts.md`].
- **Settlor reserved powers**: available under all three regimes, but Jersey's Article 9A is the most heavily case-law-tested.

## Caveats

All three corpus files cited (`bvi/vista-trusts.md`, `cayman/star-trusts.md`, `jersey/trusts/purpose-trusts.md`) are **status: draft** — the content is drafted but not yet editorially verified. Re-verify against the primary statutes (TJL 1984; STAR Act 1997; VISTA Act 2003 as amended) before relying on this for a transaction. The corpus is Jersey-centric; the BVI and Cayman files are comparator material rather than first-class jurisdiction coverage, and other selection factors (tax characterisation in the relevant settlor/beneficiary jurisdictions, AML/CFT and substance overlay, regulator preference, professional-trustee availability) need to be layered on top of the trust-law analysis above.

## Sources cited

1. `jersey/trusts/trusts-law-1984.md` — Jersey Trusts Law overview (draft, 2026-05-14)
2. `jersey/trusts/reserved-powers.md` — Article 9A reserved powers (draft, 2026-05-14)
3. `jersey/trusts/purpose-trusts.md` — Article 12 non-charitable purpose trusts (draft, 2026-05-14)
4. `cayman/star-trusts.md` — Cayman STAR trusts (draft, 2026-05-17)
5. `bvi/vista-trusts.md` — BVI VISTA trusts, including the comparator table for picking between the three (draft, 2026-05-18)

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
