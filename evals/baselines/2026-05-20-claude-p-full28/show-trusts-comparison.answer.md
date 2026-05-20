I have the three core files plus the transcluded cross-jurisdictional decision framework. All three are freshly verified (within the last week), so no staleness flags are needed. Here is the synthesis.

## Jersey trust vs Cayman STAR vs BVI VISTA — when to use which

These three are **not interchangeable** — each was built to solve a different problem. The cleanest way to choose is to start from what you're actually trying to achieve.

### Jersey trust — when your problem is cross-border *defence* of the wealth itself

The Jersey trust's signature strength is the **Article 9 firewall** (`knowledge/jersey/trusts/firewall.md`). It instructs the Royal Court to apply *only* Jersey law to questions of validity, the settlor's capacity, administration, and beneficial rights, and to refuse to give effect to foreign forced-heirship rules, matrimonial/community-property regimes, and even foreign judgments that conflict with it (Article 9(4)). Paired with **Article 9A reserved powers**, the settlor can retain wide powers (revocation, investment direction, advancement) without the trust being struck down as a sham.

Choose Jersey when:
- The family is exposed to **civil-law forced heirship** (e.g. France/Italy *réserve*) or a **community-property matrimonial regime**, and you want maximum structural protection of the assets. The cross-jurisdictional decision table rates Jersey ✅ for "maximum forced-heirship defence" (Article 9(4)) (`knowledge/CROSS-JURISDICTIONAL-MAP.md`).
- You want a **settlor-reserved-powers** discretionary family trust backed by deep jurisprudence.
- You want a conventional discretionary family wealth wrapper as the central structure.

Limits to keep in mind: the firewall binds the Royal Court and Jersey-located assets — it does not bind a foreign court that has *in personam* jurisdiction over a resident beneficiary, nor does it protect assets physically sitting in the foreign jurisdiction (`knowledge/jersey/trusts/firewall.md`).

### Cayman STAR — when your problem is "there are no beneficiaries" (or you don't want any)

A STAR trust (Special Trusts — Alternative Regime, Act 1997) is a **non-charitable purpose trust**: it can exist with *stated purposes and an enforcer instead of beneficiaries* (`knowledge/cayman/star-trusts.md`). That is its distinctive capability — ordinary trust law requires beneficiaries (or a charitable purpose); STAR removes that requirement.

Choose STAR when:
- You need an **orphan SPV** for securitisation/structured finance — shares held with no beneficiaries to consolidate, bankruptcy-remote from any settlor (the classic STAR use).
- You want a **multi-generational family-governance vehicle** defined by purposes (education, philanthropy, property maintenance) rather than by named beneficiaries.
- You want a **PTC (private trust company) held by an orphan purpose trust**.
- You need a charitable-*like* vehicle that doesn't meet strict charitable status.

The corpus notes STAR is functionally similar to **Jersey's own Article 12 purpose trusts** for orphan/governance uses — both require an enforcer and allow unlimited duration; the statutory detail differs (`knowledge/cayman/star-trusts.md`).

### BVI VISTA — when your problem is holding *operating-company shares* without trustee interference

VISTA (Virgin Islands Special Trusts Act 2003) solves one specific commercial problem: under classical trust law (the *Bartlett* duty) a trustee holding company shares must monitor and intervene in the company's management. That is wrong for a family **operating business** the settlor wants run by chosen directors. VISTA **disengages the trustee from the underlying company's management** — the trustee holds legal title but is not required (or liable for failing) to intervene, with control governed by the **office of director rules (ODRs)** in the trust instrument (`knowledge/bvi/vista-trusts.md`).

Choose VISTA when:
- The trust will hold shares in a **family operating company** and you want the family/chosen directors to run it without trustee second-guessing — its principal designed use case.
- The asset is a **single, illiquid private holding** that can't be diversified, where the *Bartlett* duty doesn't fit.
- A professional trustee is otherwise **reluctant to accept operating-business shares** because of management-oversight liability — VISTA gives them statutory cover.

Note the requirement: the trust must hold a **designated BVI Business Company**; re-domiciling that company out of BVI can lose VISTA protection. And VISTA's trustee-disengagement does *not* protect beneficiaries personally against forced-heirship or matrimonial orders against them (`knowledge/bvi/vista-trusts.md`).

### Side-by-side (from the corpus's own comparison)

| Feature | Jersey trust | Cayman STAR | BVI VISTA |
|---|---|---|---|
| Cross-border forced-heirship protection | ✅ (Article 9) | Yes (different mechanism) | Less robust than Jersey/Cayman |
| Settlor-reserved powers | ✅ (Article 9A) | Yes | Yes |
| Trustee disengagement from business | Limited | N/A | ✅ (the point of VISTA) |
| No-beneficiary purpose trust | No | ✅ | No |
| Family-business succession | Works with reserved powers | Possible but indirect | Designed for this |
| Orphan SPV structures | Possible | ✅ (typical use) | Possible |

(Source: `knowledge/bvi/vista-trusts.md`, consistent with `knowledge/CROSS-JURISDICTIONAL-MAP.md`.)

### The short decision rule

- **Defending wealth against foreign forced-heirship / divorce / creditor attack** → **Jersey** (Article 9 firewall + 9A reserved powers).
- **Orphan SPV or a no-beneficiary purpose/governance vehicle** → **Cayman STAR**.
- **Holding a family operating business with a hands-off trustee** → **BVI VISTA**.

And they aren't mutually exclusive at the *structure* level: the cross-jurisdictional map's "international wealth" pattern uses a **Jersey trust as the central wrapper** with Cayman/BVI underlying vehicles for specific asset classes — so the realistic answer is often "Jersey trust on top, STAR/VISTA for the specific sub-problem underneath" (`knowledge/CROSS-JURISDICTIONAL-MAP.md`).

One caveat the corpus is explicit about: all three concept files are marked `status: draft`. Freshness is fine (all `last_verified` within the last week, well inside the 180-day window).

---

**Files cited:**
1. `knowledge/jersey/trusts/firewall.md`
2. `knowledge/cayman/star-trusts.md`
3. `knowledge/bvi/vista-trusts.md`
4. `knowledge/CROSS-JURISDICTIONAL-MAP.md`
