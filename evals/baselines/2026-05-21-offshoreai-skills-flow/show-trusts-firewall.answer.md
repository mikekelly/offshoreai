I have what I need from the canonical firewall file. (My parallel `findByTag` call errored on a missing argument; the firewall file is comprehensive enough that a second search isn't needed.)

## How the Article 9 firewall handles foreign forced-heirship

**The core mechanism.** Article 9 of the Trusts (Jersey) Law 1984 directs the Royal Court to determine all the key questions about a Jersey trust — its validity, the validity of a transfer of property into it, the settlor's capacity, interpretation, administration, trustees' powers, and beneficial rights — **exclusively under Jersey law**, and provides that "no rule of foreign law shall affect such question" (Art. 9(1)). Crucially, Art. 9(2) requires that determination to proceed *without regard* to whether any foreign law fails to recognise trusts or whether the trust "avoids or defeats rights, claims or interests conferred by any foreign law." That second limb is what neutralises forced heirship: even if a civil-law forum treats a lifetime transfer into the trust as a fraud on *réserve héréditaire* / *légitime*, Jersey law as applied by the Royal Court will not give effect to that foreign view (`knowledge/jersey/trusts/firewall.md`).

**The standard forced-heirship attack it defeats.** A settlor with children resident in, say, France or Italy may face local rules reserving a fixed share of the estate to certain heirs; after the settlor's death the heirs typically attack the lifetime transfer into the Jersey trust as a disposition that should be notionally clawed back into the estate to compute the reserve (e.g. German *Pflichtteilsergänzung*). Article 9 refuses to give effect to those rules in Jersey (`knowledge/jersey/trusts/firewall.md`).

**Strong-form protection against foreign judgments.** Art. 9(4) makes a foreign judgment *unenforceable in Jersey* to the extent it is inconsistent with Article 9 — so even a foreign court ruling that the transfer was invalid cannot be enforced against the Jersey trust. Art. 9(3A) closes the *renvoi* gap by excluding Jersey's ordinary conflict-of-laws rules, making Article 9 a self-contained choice-of-law rule (`knowledge/jersey/trusts/firewall.md`).

**The express limits — where the firewall does *not* save the structure:**

- **Jersey-domiciled settlor.** Art. 9(3) preserves Jersey's *own* légitime (customary forced heirship for spouse and children of the movable estate); a Jersey-domiciled settlor cannot escape it merely by settling into a Jersey trust.
- **Title and formalities.** Art. 9(2A) means the firewall cannot validate a disposition where the settlor had no ownership or no power to dispose, cannot override foreign-law formalities for transferring property, and cannot cure a will invalid under the testator's domicile.
- **Reach of the foreign forum.** Article 9 binds the Royal Court and Jersey-located assets — not the foreign court. A foreign court with *in personam* jurisdiction over a resident beneficiary, or jurisdiction over assets physically located abroad, may still act; the firewall cannot protect what is not in Jersey.
- **Sham / Article 2.** A structure that fails the Article 2 existence test (settlor in substance retained beneficial ownership) is not a trust at all, so the firewall never engages.

**Practical drafting takeaways from the corpus:** make an express choice of Jersey proper law (engaging Art. 4 so Art. 9 is triggered); avoid back-door clauses that re-import foreign succession rules (e.g. directing distributions per the settlor's home-country succession law); and where a forced-heirship jurisdiction is in play, consider parallel substantive lifetime planning there (e.g. a notarial *pacte de famille*) rather than relying on the firewall alone. Article 9A reserved-powers protection complements the firewall by ensuring settlor-retained powers don't invalidate the trust (`knowledge/jersey/trusts/firewall.md`).

**Caveats.** The firewall file is `status: draft` — the content is drafted but not yet verified against the primary source, so treat it accordingly and confirm against the consolidated Trusts (Jersey) Law 1984 (Article 9) at jerseylaw.je. The file was last verified 2026-05-14 (7 days ago), so freshness itself is not a concern.

### Cited files
1. `knowledge/jersey/trusts/firewall.md` (status: draft) — Article 9, with the forced-heirship analysis, Art. 9(2)/(2A)/(3)/(3A)/(4) breakdown, and limits.

> This is information drawn from the offshoreai corpus, not legal, tax, or investment advice. Verify the cited primary sources before acting.
