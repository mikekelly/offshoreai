---
title: Client Cohort — US Person Abroad
jurisdiction: jersey
category: use-cases
status: draft
last_verified: 2026-05-25
tags:
  - jersey
  - use-case
  - client-cohort
  - us-tax
  - us-grantor-trust
  - fatca
  - wealth-manager-relevance
sources:
  - title: IRS — International Taxpayers
    url: https://www.irs.gov/individuals/international-taxpayers
    accessed: 2026-05-25
    kind: gov-page
see_also:
  - ./index.md
  - ../../trusts/firewall.md
  - ../../international/fatca.md
  - ../../international/crs.md
---

# Client Cohort — US Person Abroad

## Who's in this cohort

"US person" is a defined US tax-law term: US citizens (regardless
of residence), US lawful permanent residents (green-card
holders), individuals meeting the substantial-presence test,
US-domiciled estates, US-domestic trusts, and US-incorporated
corporations and partnerships.

For wealth-structuring, the cohort is **US citizens or green-
card holders living outside the US** — the population for whom
Jersey structures most often interact with US tax obligations.

## Home-jurisdiction load-bearing facts

The US tax regime is **citizenship-based**, not residence-based.
A US person is subject to US tax on **worldwide income**
regardless of where they live. This is the **most distinctive
fact** about the cohort and shapes everything else.

### Core US obligations

- **Worldwide income reporting** on Form 1040 every year;
- **FBAR (Form FinCEN 114)** — foreign financial accounts
  above the USD 10,000 threshold;
- **Form 8938** — specified foreign financial assets above
  threshold;
- **Form 3520** — transactions with foreign trusts (gifts,
  contributions, distributions);
- **Form 3520-A** — annual foreign-trust return where the US
  person is treated as the owner under grantor-trust rules;
- **Form 5471** — controlled foreign corporation (CFC)
  reporting where the US person owns ≥10% of a foreign
  corporation;
- **Form 8865** — foreign partnership interests above
  threshold.

### Trust taxation — the load-bearing piece

US-tax treatment of foreign trusts is **complex and punitive**
in default form:

- **Grantor trust** — where the US settlor retains specified
  powers, trust income is taxed to the settlor as if earned
  directly. See [`../../trusts/reserved-powers.md`](../../trusts/reserved-powers.md)
  for the Jersey Article 9A reserved-powers regime that
  intersects this.
- **Non-grantor foreign trust** — distributions to US
  beneficiaries trigger the **throwback rules** with interest
  charges on accumulated income; PFIC treatment may apply to
  underlying investments.
- **Form 3520 / 3520-A** reporting on every contribution,
  distribution, and annual basis.

### PFIC (Passive Foreign Investment Company)

A foreign-incorporated investment vehicle holding mostly
passive assets is a PFIC for US tax. PFIC treatment is
penalising — high tax + interest charges — unless mark-to-
market or QEF elections are made (often impractical).

A Jersey-incorporated investment company holding US-investor
funds is **typically a PFIC** for the US investors.

### Estate tax

US estate tax applies to US-citizen / US-domiciled decedents
on worldwide estate. Non-US assets are within scope; foreign
trusts have complex inclusion rules.

## Why Jersey

For US-person clients, Jersey structuring is shaped by **not
making the US tax position worse** rather than by tax
optimisation. Common drivers:

- **Family-governance vehicle** for non-US family branches;
- **Non-US asset wrapper** where the structure can be
  designed as a grantor trust under specific Article 9A
  reserved-powers patterns — the US-tax treatment then runs
  through the settlor's individual return without throwback /
  PFIC complications;
- **Pre-IPO equity** in non-US companies where Jersey-incorporated
  holding company is the natural vehicle (with PFIC implications
  factored into investor structuring);
- **Asset-protection** for non-US assets against non-US claims;
- **Succession planning** for mixed US / non-US family branches.

## Jersey-structure menu

| Need | Jersey option | Cross-reference + US-tax consideration |
|---|---|---|
| US-grantor-trust-compatible structure | Jersey discretionary trust with Article 9A reserved powers structured to satisfy US grantor-trust tests | [`../../trusts/reserved-powers.md`](../../trusts/reserved-powers.md); requires US tax advice on specific powers retained |
| Non-grantor trust (rare for current-US-person settlor) | Jersey trust without US-grantor-triggering powers — used post-settlor-death or for non-US-settlor with US beneficiaries | [`../../trusts/index.md`](../../trusts/index.md); PFIC and throwback rules apply on US beneficiary distributions |
| Pre-IPO equity holding | Jersey company with PFIC analysis for US-person investors | [`../founder-entrepreneur/why-jersey-topco.md`](../founder-entrepreneur/why-jersey-topco.md) |
| Asset protection (non-US assets) | Jersey trust + Article 9 firewall | [`../../trusts/firewall.md`](../../trusts/firewall.md) |

## Common objections and responses

| Objection | Response |
|---|---|
| "Why bother — the US taxes me anyway." | Worldwide US tax is a given. The structuring goal is **succession protection** and **non-US-side coherence**, not US-tax minimisation. |
| "Will the trust be a grantor trust or not?" | Designed-in. With Article 9A reserved powers, the trust can be **deliberately structured** as a grantor trust to avoid throwback and to give US-tax treatment that runs through the settlor's return. **Requires US tax advice on the specific reserved-powers package.** |
| "What about FATCA?" | Jersey reports US-person account information to the IRS under FATCA — see [`../../international/fatca.md`](../../international/fatca.md). The structure is **not** an FATCA-opacity tool. Reporting is part of the design. |
| "What about PFICs?" | A Jersey investment company holding passive assets is typically a PFIC for US investors. Structure choices (corporate vs partnership vs trust) can avoid the issue at the cost of other complications. **Requires US tax advice.** |

## Reporting and information-exchange exposure

- **FATCA** — Jersey is a FATCA Model 1 IGA jurisdiction;
  reports US-person account information to the IRS via the
  Comptroller of Revenue.
- **CRS** — operates alongside FATCA; the US does not
  participate in CRS (operates its own bilateral FATCA
  network), but third-country residence may trigger CRS in
  addition.
- **Form 3520 / 3520-A** — heavy US trust reporting on every
  transaction.
- **Form 8938 / FBAR** — annual reporting of foreign
  accounts and assets.

## Common red flags / EDD triggers

- **Historical US-tax non-compliance** — e.g. unreported
  foreign accounts pre-2014; significant risk indicator
  requiring careful diligence.
- **Renunciation of US citizenship** (expatriation) —
  triggers the **expatriation tax** under IRC § 877A;
  structuring in anticipation of renunciation requires
  specific US-tax planning.
- **Sanctions exposure** through US-person status (US
  sanctions reach is broad).

## Status

Draft. **US tax law is the most complex of any cohort's home
jurisdiction. Specific US tax advice is essential** for any
Jersey structure involving a US person. This file is for
orientation only; no part of it substitutes for engagement
with a US tax adviser.

## Cross-references

- [`./index.md`](./index.md) — cohort hub.
- [`../../trusts/reserved-powers.md`](../../trusts/reserved-powers.md)
  — Article 9A reserved powers (the load-bearing tool for
  grantor-trust design).
- [`../../international/fatca.md`](../../international/fatca.md)
  — FATCA framework.
- [`../../international/crs.md`](../../international/crs.md)
  — CRS framework.
