# Jersey — Knowledge Base Plan

This directory builds the Offshore AI knowledge base for **Jersey**, one of
the three Crown Dependencies (with Guernsey and the Isle of Man). Jersey is
a self-governing British Crown Dependency: it is not part of the United
Kingdom, and never was part of the European Union. It has its own
legislature ([States Assembly][states]), its own courts ([Royal Court][rc]),
its own tax system (administered by [Revenue Jersey][rj]), and its own
financial-services regulator (the [Jersey Financial Services Commission /
JFSC][jfsc]). The agent must treat Jersey as a fully separate legal
jurisdiction from the UK in every answer.

Population is roughly 103,000. Sterling and the Jersey pound circulate side
by side at par. The legal system is a hybrid of Norman customary law,
English common-law influence, and a large body of modern statute.

---

## What the agent needs to know about Jersey

A user asking the agent about Jersey is typically trying to do one of these
things:

1. **Set up or run a Jersey structure.** Form a company, foundation,
   trust, or fund; appoint local directors; meet substance; file accounts.
2. **Understand Jersey tax.** Decide whether and how a person or vehicle is
   taxed in Jersey, and how that interacts with their home jurisdiction.
3. **Comply with Jersey regulation.** Hold a JFSC licence, run a regulated
   business, meet AML/CFT obligations, file the right returns.
4. **Live or work in Jersey.** Residency, "Entitled" / "Licensed" / "Entitled
   to Work" categories, high-value residency.
5. **Litigate or enforce.** Use the Royal Court, enforce a foreign judgment,
   pursue a beneficiary or creditor.
6. **Compare** Jersey against another offshore jurisdiction for a specific
   use case.

The knowledge base is organised so that any one of those questions can be
answered by reading 2–6 files from a predictable path.

---

## Section taxonomy

Each section below is a directory under `jersey/`, with its own `index.md`
listing the files in it. The bullet under each section is the rough scope.

### `government/`
Constitutional position; the States Assembly (legislature); Council of
Ministers; the Bailiff and Lieutenant-Governor; relationship with the Crown
and the UK; parishes and parish administration; entrenched constitutional
conventions (e.g. *Kilbrandon* settlement).

### `legal-system/`
Sources of law (statute, customary law, English common-law influence);
Royal Court (Samedi, Inferior Number, Superior Number); Court of Appeal;
appeals to the Judicial Committee of the Privy Council; Bailiff and
Deputy Bailiff; Judicial Greffe; legal profession (Advocates and
Solicitors of the Royal Court).

### `financial-regulation/`
JFSC structure and powers; the principal regulatory laws
([Financial Services (Jersey) Law 1998][fsjl], [Banking Business (Jersey)
Law 1991][bbl], [Collective Investment Funds (Jersey) Law 1988][cif],
[Insurance Business (Jersey) Law 1996][insl], [Proceeds of Crime (Jersey)
Law 1999][pocl]); regulated activities and registration classes;
fit-and-proper test; ongoing supervisory regime; enforcement (civil
penalties, public statements, directions).

### `tax/`
Income tax (Income Tax (Jersey) Law 1961); the **zero-ten** corporate
regime (0% standard, 10% on financial-services companies, 20% on utility
and large-retailer income); personal tax (20% standard rate, marginal
relief); **Goods and Services Tax (GST)** at 5%; social security; stamp
duty and *droit d'enregistrement*; international tax (CRS, FATCA, DTAs,
TIEAs, Pillar Two / 15% multinational top-up); absence of capital gains
tax and inheritance tax.

### `companies/`
[Companies (Jersey) Law 1991][cjl] — types of company (public/private,
par-value/no-par-value, limited/unlimited/guarantee, cell companies),
incorporation, share capital, directors' duties, accounts and audit,
member remedies, solvent and insolvent winding-up, mergers and
continuances, cell companies (PCC / ICC).

### `trusts/`
[Trusts (Jersey) Law 1984][tjl] — the Jersey trust as a vehicle; types
(discretionary, fixed-interest, charitable, non-charitable purpose,
reserved-powers); firewall provisions (Article 9); duration; *hastings-bass*
relief in Jersey form; settlor reserved powers; protector role; choice
of law and forum.

### `foundations/`
[Foundations (Jersey) Law 2009][fl] — a civil-law-flavoured vehicle with
no beneficiaries as of right; council, guardian, qualified member;
comparison with trusts; typical use cases (philanthropic, succession,
asset-holding).

### `funds/`
Fund regimes by sophistication of investor: Jersey Private Fund (JPF),
Expert Funds, Eligible Investor Funds, Listed Funds, Unregulated Funds,
public funds under the Collective Investment Funds (Jersey) Law 1988;
service-provider authorisation; AIFMD National Private Placement Regime
into the EU/UK.

### `banking/`
Banking Business (Jersey) Law 1991; registration and ongoing
requirements; deposit-compensation scheme; "top-50" bank policy
(historic); current Jersey banking sector.

### `insurance/`
Insurance Business (Jersey) Law 1996; categories of permit;
captive-insurance use; PCC use in insurance.

### `immigration-residency/`
Control of Housing and Work (Jersey) Law 2012; residential and
employment status categories (Entitled, Entitled for Work, Licensed,
Registered); 2(1)(e) / High-Value Residency programme; tax on HVR; route
to Entitled status.

### `aml-cft/`
[Money Laundering (Jersey) Order 2008][mlo]; the JFSC AML/CFT Handbook;
beneficial-ownership and significant-persons regimes; sanctions regime
(Sanctions and Asset-Freezing (Jersey) Law 2014); Moneyval evaluations;
register of overseas entities interactions with the UK.

### `international/`
Crown-Dependency status; UK constitutional relationship; relationship
with the EU post-Brexit (no longer covered by Protocol 3); Common
Reporting Standard implementation; FATCA agreement; full double-taxation
agreements and TIEAs; OECD inclusive framework; UK–Jersey Customs Union;
sanctions co-ordination.

### `registries/`
JFSC Registry; companies, foundations, LLPs, business names; private
beneficial-ownership register; persons-with-significant-control
disclosures; the Jersey Land Registry; charities register.

---

## Source plan

The canonical sources for Jersey:

| Source                                 | Used for                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| [jerseylaw.je][jl]                     | Consolidated statutes, Royal Court & Court of Appeal judgments, Jersey & Guernsey Law Review |
| [gov.je][gov]                          | Revenue Jersey, Customs, States policy, official statistics, residency rules                 |
| [jerseyfsc.org][jfsc]                  | JFSC handbooks, codes of practice, public statements, registry                               |
| [statesassembly.gov.je][states]        | Bills, propositions, Hansard, Standing Orders                                                |
| [royalcourt.gov.je][rc]                | Court procedure rules and listings                                                           |
| [comptroller-general.gov.je][cg]       | Public-finance oversight                                                                     |
| OECD inclusive framework country pages | Pillar Two implementation, peer reviews                                                      |
| Moneyval                               | AML/CFT mutual-evaluation reports for Jersey                                                 |

A complete and dated canonical-sources list lives in
[`sources.md`](sources.md).

---

## Build plan (phased)

The directory is built in vertical slices: each phase produces a usable
agent for a defined set of question types, even though later phases are
still stubs.

### Phase 1 — Foundations *(in progress)*
- Central entry point ([`index.md`](index.md))
- `government/` — constitutional position and institutions
- `legal-system/` — courts and sources of law
- `tax/` — overview, zero-ten, personal tax, GST, social security
- `companies/` — overview and core structures
- `glossary.md`, `sources.md`, `changelog.md`

After Phase 1 the agent can answer most "what is Jersey?", "how is a Jersey
company taxed?", "how does the Royal Court work?" style questions.

### Phase 2 — Wealth structures
- `trusts/`, `foundations/`, `companies/` deep content (cell companies,
  directors' duties, members' remedies)
- `economic-substance` cross-cutting file
- `registries/` — companies and beneficial-ownership registers

### Phase 3 — Regulated business
- `financial-regulation/` — full coverage of regulatory laws, regulated
  activities, JFSC handbooks
- `funds/` — every fund regime
- `banking/`, `insurance/`

### Phase 4 — People & enforcement
- `immigration-residency/` — full coverage of housing/work categories,
  HVR, tax on residency
- `aml-cft/` — Money Laundering Order, Handbook, sanctions

### Phase 5 — International & comparison
- `international/` — DTAs, TIEAs, CRS, FATCA, Pillar Two, UK and EU
  relationships
- Cross-links into sibling jurisdictions (Guernsey, IoM) once those exist

### Phase 6 — Cases and worked examples
- `case-law/` — leading Royal Court / Court of Appeal / Privy Council
  decisions with structured summaries
- `worked-examples/` — pre-built answers to canonical user questions,
  with full source chains, suitable for fine-tuning evals

---

## Files in this directory

| File | Purpose |
|---|---|
| [`index.md`](index.md) | LLM entry point — start here when reading the corpus |
| [`glossary.md`](glossary.md) | Jersey-specific terms and abbreviations |
| [`sources.md`](sources.md) | Canonical source roots with last-verified dates |
| [`changelog.md`](changelog.md) | Updates and re-verifications |

---

[states]: https://statesassembly.je
[rc]: https://www.royalcourt.gov.je
[rj]: https://www.gov.je/TaxesMoney/IncomeTax/Pages/RevenueJersey.aspx
[jfsc]: https://www.jerseyfsc.org
[jl]: https://www.jerseylaw.je
[gov]: https://www.gov.je
[cg]: https://www.gov.je/Government/Departments/ComptrollerAuditorGeneral/Pages/index.aspx
[fsjl]: https://www.jerseylaw.je/laws/unofficialconsolidated/Pages/13.225.aspx
[bbl]: https://www.jerseylaw.je/laws/unofficialconsolidated/Pages/13.075.aspx
[cif]: https://www.jerseylaw.je/laws/unofficialconsolidated/Pages/13.100.aspx
[insl]: https://www.jerseylaw.je/laws/unofficialconsolidated/Pages/13.425.aspx
[pocl]: https://www.jerseylaw.je/laws/unofficialconsolidated/Pages/08.780.aspx
[cjl]: https://www.jerseylaw.je/laws/current/l_30_1991
[tjl]: https://www.jerseylaw.je/laws/current/l_11_1984
[fl]: https://www.jerseylaw.je/laws/current/l_23_2009
[mlo]: https://www.jerseylaw.je/laws/unofficialconsolidated/Pages/08.780.50.aspx
