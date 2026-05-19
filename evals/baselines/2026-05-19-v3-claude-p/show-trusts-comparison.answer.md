All cited files have `last_verified` within the last week, so freshness is fine.

---

## Answer

### Important caveat about coverage

The Jersey corpus only covers Jersey law in depth. **Cayman STAR and BVI VISTA are described from the Jersey side** — as comparators when choosing where the top-of-structure or PTC-orphan trust should sit — but the substantive mechanics of those two regimes live in `cayman/star-trusts.md` and `bvi/vista-trusts.md`, which are referenced as cross-links (`jersey/glossary-extension.md`, lines 343 and 360; `jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`, lines 155–156, 332–333) but are **not part of the jersey/ corpus**. So this answer can give you the Jersey-side picture of when to pick which, not a full three-way teardown.

### How the corpus frames the choice

**Jersey trust — pick this when the trust is the top-of-structure family wrapper.** The Jersey discretionary trust is the corpus's default top vehicle. Its load-bearing features are the **Article 9 firewall** (Jersey law governs validity/capacity/beneficiary rights; foreign judgments based on inconsistent law are unenforceable under Article 9(4)) and **Article 9A reserved powers** (the settlor can keep a wide menu of powers without invalidating the trust). The "Why Jersey" table in the worked example (`jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`, lines 305–315) flags these plus Article 47B mistake relief, JFSC TCB supervision, 0% Jersey tax, and Privy Council final appeal. The cross-offshore guidance puts the **"main trust at top"** in Jersey, with reasoning: "settlor reserved powers, firewall against foreign claims, family-governance flexibility" (`jersey/use-cases/family-office-adviser/cross-offshore-wealth-structure.md`, lines 34, 53–65). It's the typical choice for European-centred families.

**Cayman STAR — pick this for orphan / non-charitable-purpose use cases, especially when the family is US- or fund-anchored.** Article 12 of the Trusts (Jersey) Law 1984 (`jersey/trusts/purpose-trusts.md`, lines 32–101) explicitly says Jersey NCPTs are "functionally similar to (though not identical with) the Cayman STAR trust regime" and identifies the three deciding factors when choosing between them: (i) **identity and qualifications of the enforcer**, (ii) **redomiciliation options**, and (iii) **regulatory and tax treatment of the underlying entities**. The multi-jurisdictional guidance also flags Cayman STAR specifically for "orphan structures" and lists Cayman as the natural home where the family or its fund interests sit on the US side (`jersey/use-cases/international-lawyer/multi-jurisdictional-offshore-structure.md`, lines 41, 64, 101–102; `jersey/use-cases/family-office-adviser/cross-offshore-wealth-structure.md`, lines 36–37, 156–163).

**BVI VISTA — pick this when the trust's purpose is to hold shares of an underlying family business / company without trustee-active-management duties.** The Jersey corpus characterises VISTA precisely as "BVI distinctive trust regime where trustee holds shares of underlying company without active management duties" (`jersey/glossary-extension.md`, lines 357–360) and pairs it in the multi-jurisdictional guide with "VISTA trust **holding family business shares**" (`jersey/use-cases/international-lawyer/multi-jurisdictional-offshore-structure.md`, line 65) — i.e. the use case is parking trading-company shares above the trustee's prudent-investment duties. BVI is the cost-efficient / volume corporate jurisdiction in the corpus's framing.

**The "all three at once" case — PTC ownership.** The corpus treats Article 12 NCPT, STAR, and VISTA as *interchangeable* shells when their only job is to own a Private Trust Company's shares: "Owned: typically by a purpose-trust (Jersey Article 12, or Cayman STAR, or BVI VISTA)" (`jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`, lines 154–156). Choice there is driven by where the rest of the structure already sits.

### Practical decision shape (per the corpus)

| You want… | Vehicle the corpus points to |
|---|---|
| Top-of-structure wealth trust, forced-heirship defence, settlor wants reserved powers | **Jersey discretionary trust** (Article 9 + 9A) |
| Orphan SPV / securitisation / aviation-lease trust, or PTC-shareholder where Cayman is the natural home | **Cayman STAR** *(or Jersey Article 12 NCPT — functionally similar; choose on enforcer rules, redomiciliation, tax of underlying entities)* |
| Hold shares of an active family-business company without trustee being expected to manage them | **BVI VISTA** |
| Asian / HK-anchored family or low-cost asset-segregation holdings | **BVI** vehicles (incl. VISTA for trust layer) |

What the Jersey corpus **does not** tell you: the actual statutory mechanics of STAR (e.g. STAR Act 1997 enforcer-vs-beneficiary rules, registration, perpetuity); the statutory mechanics of VISTA (e.g. how the trustee's duty of care over the underlying company is suspended, designated-shares concept, office-of-director rules). Those live in the Cayman and BVI corpora that the cross-links anticipate but that aren't present here — so for the detailed three-way teardown you'd need those companion knowledge bases.

---

### Cited files

1. `jersey/trusts/purpose-trusts.md`
2. `jersey/glossary-extension.md`
3. `jersey/use-cases/international-lawyer/multi-jurisdictional-offshore-structure.md`
4. `jersey/use-cases/family-office-adviser/cross-offshore-wealth-structure.md`
5. `jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`
