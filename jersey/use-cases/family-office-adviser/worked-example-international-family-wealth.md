---
title: "Worked Example: International Family Wealth Structure Through Jersey"
jurisdiction: jersey
category: use-cases
persona: family-office-adviser
status: draft
last_verified: 2026-05-18
tags:
  - jersey
  - family-office
  - worked-example
  - trust-structure
  - cross-border
  - forced-heirship
  - persona-family-office
  - use-case
see_also:
  - ./index.md
  - ./trust-or-foundation.md
  - ./cross-offshore-wealth-structure.md
  - ../../trusts/firewall.md
---

# Worked Example: International Family Wealth Structure Through Jersey

## The scenario

The **Rossi family** (a fictional client) presents this
structuring brief:

- **Settlor** (Mr Rossi): 70, Italian-domiciled, retired
  industrialist;
- **Family wealth**: €80 million across European
  operating-company shares, US public equities, a
  Swiss private bank portfolio, and a Caribbean villa;
- **Family**: Wife (Italian-domiciled); two adult
  children (one in Italy, one in the UK); three
  grandchildren;
- **Objective**: long-term family wealth structure
  protecting against Italian forced-heirship rules,
  enabling tax-efficient succession across multiple
  jurisdictions, and providing professional governance.

This worked example walks the structural and legal
layers end to end.

## The end-state structure

```
                  Jersey Discretionary Trust
                  ("The Rossi Family Trust")
                          |
              +-----------+-----------+
              |                       |
        Trustee:                  Underlying
        Jersey TCB                   Companies
        + PTC structure        (asset-holding SPVs
                               in suitable
                               jurisdictions)
                                       |
              +------+--------+----+------+
              |      |        |    |      |
            EU Co.  US      Swiss  BVI    Other
            shares  equities a/c   villa  assets
```

## Step-by-step

### Step 1 — Choose the wrapper: trust vs foundation

Both Jersey trusts and Jersey foundations are options.
For the Rossi family:

- **Discretionary trust** is the natural choice — long
  history, well-understood by foreign tax authorities
  (UK looks-through; US grantor-trust elections work),
  and the **Article 9 firewall** is in fully developed
  form for trusts;
- **Foundation** would be considered if the family
  preferred a civil-law-familiar wrapper or wanted the
  governance precision of a Council-driven entity.

For this scenario, the **discretionary trust** is
chosen. See [`trust-or-foundation.md`](trust-or-foundation.md)
for the decision framework.

### Step 2 — Set up the Jersey discretionary trust

**Settlor**: Mr Rossi creates a discretionary trust by
**Settlement Deed**:

- **Jersey law** as the governing law (explicit
  declaration triggering Article 9 firewall);
- **Settlor**: Mr Rossi (with intent to avoid Italian
  forced-heirship application);
- **Trustees**: Initial trustee = a Jersey-licensed
  Trust Company Business (TCB) under FSL 1998;
- **Beneficiaries**: a broad class — Mr Rossi, his
  wife, children, grandchildren, future issue, certain
  charitable purposes;
- **Protector**: a trusted external advisor (typically
  a lawyer or family friend);
- **Reserved powers** under Article 9A:
  - Power of consent to specified trustee actions;
  - Power to add / remove beneficiaries;
  - Power to remove and replace trustees;
- **Letter of wishes**: separately, non-binding,
  setting out Mr Rossi's preferred distribution
  approach.

See [`../../trusts/firewall.md`](../../trusts/firewall.md)
and [`../../trusts/reserved-powers.md`](../../trusts/reserved-powers.md).

### Step 3 — Build the underlying holding structure

Rather than the trust holding individual investments
directly, an **underlying holding company** is typically
inserted between the trust and the investments:

- **Underlying company**: Jersey company (CJL 1991) or
  another suitable holding-jurisdiction company (e.g.,
  Cayman, BVI, Luxembourg depending on asset class and
  tax considerations);
- **Trustee owns 100%** of underlying company shares;
- **Underlying company holds** the asset portfolio.

Benefits:

- **Cleaner asset administration** — one company to
  manage rather than a hundred direct trust holdings;
- **Tax efficiency** for specific asset classes;
- **Counterparty acceptance** (banks, brokers prefer
  dealing with a corporate entity);
- **Specific structuring** for individual assets:
  - **EU operating-company shares**: Luxembourg or
    Jersey holdco for treaty benefits;
  - **US public equities**: Cayman or BVI to avoid US
    estate tax exposure on shares directly;
  - **Swiss private bank a/c**: held directly by
    underlying company;
  - **Caribbean villa**: BVI BC owning the property
    directly (avoids Caribbean estate tax on Rossi's
    death).

### Step 4 — Private Trust Company (PTC) consideration

For families with significant wealth and a desire for
greater control, a **Private Trust Company (PTC)** can
replace the professional trustee:

- **PTC**: a Jersey company whose sole purpose is to
  act as trustee of the family's trusts;
- **Owned**: typically by a purpose-trust (Jersey
  Article 12, or Cayman STAR, or BVI VISTA — see
  [`../../../bvi/vista-trusts.md`](../../../bvi/vista-trusts.md)
  and [`../../../cayman/star-trusts.md`](../../../cayman/star-trusts.md));
- **Directors**: family members, advisors, and
  professionals;
- **JFSC** exemption / Article 4A status under FSL
  1998 — see [`../../financial-regulation/private-trust-company.md`](../../financial-regulation/private-trust-company.md).

For the Rossi family, a PTC may be added once the
structure matures and family-governance is the priority.

See [`when-ptc.md`](when-ptc.md).

### Step 5 — Italian forced-heirship overlay

Italy operates **forced heirship** (the *legittima*):
spouse and children have indefeasible shares of the
estate. Under classical Italian conflict-of-laws rules:

- Italian law would apply to Mr Rossi's estate (he is
  Italian-domiciled and Italian-national);
- Italian forced heirs could claim **clawback** of
  lifetime gifts that defeated their reserved shares.

The **Jersey Article 9 firewall** disapplies these rules
in respect of the Jersey trust:

- **Jersey law** governs validity, capacity, and
  beneficiary rights of the trust;
- **Italian forced-heirship** is not applied by Jersey
  courts;
- **Foreign judgments** based on inconsistent law
  (e.g., an Italian clawback order) are not enforceable
  in Jersey (Article 9(4));
- **Beneficiaries** remain personally subject to
  Italian jurisdiction (if they're Italian-resident),
  but the **trust** itself is protected.

In practice, the trustee may apply for **Article 51
directions** from the Royal Court if Italian heirs
make claims, obtaining authoritative Jersey-court
confirmation of the firewall position.

### Step 6 — UK-resident beneficiary

One of Mr Rossi's children is **UK-resident**. UK tax
implications:

- **Excluded-property trust** treatment may apply if the
  trust is established by a non-UK-domiciled settlor
  with non-UK assets (subject to current UK rules and
  the 2017 reforms);
- **10-year anniversary** IHT charges on trust assets
  (subject to excluded-property considerations);
- **Distributions** to UK-resident beneficiaries may be
  treated as **income** or **capital** depending on
  trust accumulation history and UK matching rules;
- **Specific** UK reporting (Trust Registration
  Service);
- **Specialist UK tax advice** essential.

### Step 7 — US-asset exposure

The portfolio includes **US public equities**. Without
careful structuring:

- **US estate tax** would apply to US-situs assets held
  directly on Mr Rossi's death (a non-US-domiciled
  individual gets a low estate-tax threshold —
  $60,000);
- **Withholding tax** on US-source dividends.

The standard structuring response: hold US equities
through a **non-US blocker corporation** (often a
Cayman or BVI BC) within the trust structure. The trust
owns the blocker; the blocker owns the US assets. Mr
Rossi's death does not trigger US estate tax because he
doesn't directly own US assets.

### Step 8 — CRS / FATCA / DAC6 / TIN reporting

The structure must comply with international transparency:

- **CRS**: Jersey is a CRS Reportable Jurisdiction; the
  Rossi trust reports to relevant home jurisdictions of
  controlling persons (Italy, UK, possibly US);
- **FATCA**: Jersey has a US IGA; any US person on the
  controlling-persons list triggers FATCA reporting;
- **DAC6**: cross-border arrangements may be reportable
  under EU mandatory-disclosure rules;
- **UK TRS**: UK Trust Registration Service registration
  for trusts with UK-tax exposure or UK beneficiaries;
- **Italian tax**: declarations of the trust to Italian
  tax authorities by Mr Rossi (and continuing for the
  trust's lifetime).

Compliance is **substantial** and is best handled by the
TCB / professional administrator.

### Step 9 — Governance and family-office integration

For long-term operation:

- **Trustee** maintains formal trust administration;
- **Investment Manager** (often a Swiss / UK private
  bank) manages portfolio;
- **Administrator** handles accounting, KYC, reporting;
- **Letter of wishes** updated periodically as family
  circumstances change;
- **Family meetings** facilitated by the protector or a
  family-office adviser;
- **Distribution policy** evolves: e.g., grandchildren's
  education, support for special-needs family members,
  philanthropy.

### Step 10 — Generational transition

On Mr Rossi's death:

- **No Italian estate** of the Rossi trust assets — they
  belong to the trust, not Mr Rossi;
- **Italian forced heirs** can challenge in Italy but
  cannot reach Jersey trust assets;
- **Italian tax authorities** are notified per the
  reporting obligations;
- **Trust continues** under the discretion of the
  trustee;
- **Letter of wishes** guides distribution to the next
  generation.

## Pitfalls

- **Italian-tax declarations** if not made carefully —
  Italian tax authority may challenge the structure
  retrospectively;
- **UK-resident beneficiaries** create UK tax exposure
  that needs careful management;
- **US-citizen beneficiaries** (none here, but a common
  complication) create FATCA / PFIC / GILTI exposures
  needing US tax-treaty / blocker / specific elections;
- **Article 9 firewall** does not protect against
  Italian *in personam* orders against beneficiaries
  (Italian-resident beneficiaries personally subject to
  Italian court orders);
- **Trustee fees and TCB regulatory cost** are real
  ongoing expenses;
- **CRS / FATCA / DAC6 / TRS** reporting is substantial
  and ongoing.

## Why Jersey for this structure

| Feature | Why Jersey |
|---|---|
| **Article 9 firewall** | Most explicit forced-heirship defence (Article 9(4) on foreign judgments) |
| **Article 9A reserved powers** | Wide menu of reservable powers without trust invalidity |
| **Article 47B mistake regime** | Insurance against future structural surprises (tax / regulatory) |
| **TCB regulation** | Robust JFSC supervision of trustees |
| **Mature industry** | Largest offshore trust industry by some measures; sophisticated practitioner base |
| **0% Jersey tax** | Trust and underlying companies generally pay 0% on Jersey-source income |
| **Substance** | Adequate substance achievable at reasonable cost |
| **Treaty network** | Limited but sufficient for typical structures |
| **Privy Council** | Final appeal provides legal certainty |

## Cross-references

- [`index.md`](index.md);
- [`trust-or-foundation.md`](trust-or-foundation.md);
- [`when-ptc.md`](when-ptc.md);
- [`cross-offshore-wealth-structure.md`](cross-offshore-wealth-structure.md);
- [`crs-fatca-family.md`](crs-fatca-family.md);
- [`forced-heirship-jurisdictions.md`](forced-heirship-jurisdictions.md);
- [`../../trusts/firewall.md`](../../trusts/firewall.md);
- [`../../trusts/reserved-powers.md`](../../trusts/reserved-powers.md);
- [`../../trusts/article-47-set-aside.md`](../../trusts/article-47-set-aside.md);
- [`../../financial-regulation/private-trust-company.md`](../../financial-regulation/private-trust-company.md);
- [`../../tax/zero-ten.md`](../../tax/zero-ten.md);
- [`../../international/crs.md`](../../international/crs.md);
- [`../../international/fatca.md`](../../international/fatca.md);
- [`../../../bvi/vista-trusts.md`](../../../bvi/vista-trusts.md);
- [`../../../cayman/star-trusts.md`](../../../cayman/star-trusts.md).
