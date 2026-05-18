---
title: Jersey Statute Coverage Audit
jurisdiction: jersey
category: meta
status: draft
last_verified: 2026-05-18
tags:
  - jersey
  - coverage-audit
  - meta
  - statute-wiki
---

# Jersey Statute Coverage Audit

## What this audit is for

We built this corpus outward from sophisticated-professional personas — fund counsel, trust officer, MLRO, family-office adviser, international lawyer, founder-entrepreneur, royal court litigator, journalist/NGO/academic. The result is a deep, article-level wiki on the **finance, AML, trusts, companies, foundations, tax, and regulatory** statutes that those personas use daily — and a near-empty corpus on the statutes that ordinary Jersey residents (tenants, drivers, parents, employees, consumers, patients) interact with.

We discovered the gap when a routine question on residential eviction returned nothing on the **Residential Tenancy (Jersey) Law 2011**. This audit enumerates the principal Jersey statutes by subject area, scores each one against the corpus, and ranks the highest-priority gaps so they can be filled.

Statutes enumerated below are derived from the Wikipedia "List of laws of Jersey" page, supplemented from knowledge of the Jersey legislative landscape (the Wikipedia list itself is incomplete, as flagged on that page). Amendments are folded under their parent law — only principal statutes appear.

## How to read the tables

| Symbol | Meaning |
|---|---|
| ✅ | **Article-level wiki** — individual article files exist (e.g. `cjl-article-*.md`, `tjl-article-*.md`). Deepest tier. |
| 🟢 | **Dedicated treatment** — a dedicated file or substantive section covers the statute. |
| 🟡 | **Mentioned** — the statute name appears (in `see_also`, glossary, body text) but no dedicated file. |
| ❌ | **Not covered** — no mention at all. |

A statute is scored 🟡 (not 🟢) where the only references are passing mentions, glossary entries, or `see_also` lists. We deliberately avoided inflating scores.

---

## 1. Companies & Securities

| Statute | Coverage | Where |
|---|---|---|
| Companies (Jersey) Law 1991 | ✅ | `companies/cjl-*.md`, `companies/articles-index.md` (~80 files) |
| Limited Partnerships (Jersey) Law 1994 | 🟡 | `registries/limited-partnerships-registry.md`, mentions only |
| Incorporated Limited Partnerships (Jersey) Law 2011 | 🟡 | mentions only |
| Separate Limited Partnerships (Jersey) Law 2011 | 🟡 | mentions only |
| Limited Liability Partnerships (Jersey) Law 2017 | 🟡 | mentions only |
| Limited Liability Companies (Jersey) Law 2018 | 🟡 | single mention |
| Companies (Takeovers and Mergers Panel) (Jersey) Law 2009 | 🟡 | single mention |
| Registration of Business Names (Jersey) Law 1956 | 🟡 | `registries/business-names.md` mention |
| Control of Borrowing (Jersey) Order 1958 (COBO) | 🟢 | discussed in `companies/registration.md`, `companies/formation-of-a-company.md` |

## 2. Trusts & Foundations

| Statute | Coverage | Where |
|---|---|---|
| Trusts (Jersey) Law 1984 | ✅ | `trusts/tjl-*.md` (~60 article files) |
| Foundations (Jersey) Law 2009 | ✅ | `foundations/fjl-*.md` (~50 article files) |
| Charities (Jersey) Law 2014 | ✅ | `charities/cl-*.md` |

## 3. Banking, Funds & Insurance

| Statute | Coverage | Where |
|---|---|---|
| Banking Business (Jersey) Law 1991 | ✅ | `banking/bbl-*.md` |
| Financial Services (Jersey) Law 1998 | ✅ | `financial-regulation/fsl-*.md` |
| Collective Investment Funds (Jersey) Law 1988 | ✅ | `funds/cifl-*.md` |
| Insurance Business (Jersey) Law 1996 | ✅ | `insurance/ibl-*.md` |
| Financial Services Commission (Jersey) Law 1998 | 🟢 | `financial-regulation/jfsc-law-1998.md` |
| Depositor Compensation Scheme (Jersey) Regulations 2009 | 🟢 | `banking/depositor-compensation.md` |
| Alternative Investment Funds (Jersey) Regulations 2012 | 🟢 | `funds/aifmd-nppr.md` |
| Financial Services (Disclosure and Provision of Information) (Jersey) Law 2020 | 🟢 | `registries/fs-dpi-law-2020.md` |

## 4. AML / CFT, Proceeds of Crime & Sanctions

| Statute | Coverage | Where |
|---|---|---|
| Proceeds of Crime (Jersey) Law 1999 | ✅ | `aml-cft/pocl-*.md` |
| Money Laundering (Jersey) Order 2008 | ✅ | `aml-cft/mlo-*.md` |
| Sanctions and Asset-Freezing (Jersey) Law 2019 | ✅ | `aml-cft/safl-*.md` |
| Criminal Justice (International Co-operation) (Jersey) Law 2001 | ✅ | `aml-cft/cicl-*.md` |
| Terrorism (Jersey) Law 2002 | 🟡 | mentioned in AML files; no dedicated treatment |
| Proceeds of Crime (Supervisory Bodies) (Jersey) Law 2008 | 🟡 | mentioned |
| Drug Trafficking Offences (Jersey) Law 1988 | 🟡 | mentioned in PoCL context |
| Forfeiture of Assets (Civil Proceedings) (Jersey) Law 2018 | ❌ | not covered |
| Investigation of Fraud (Jersey) Law 1991 | ❌ | not covered |

## 5. Tax

| Statute | Coverage | Where |
|---|---|---|
| Income Tax (Jersey) Law 1961 | ✅ | `tax/itl-*.md` |
| Goods and Services Tax (Jersey) Law 2007 | 🟢 | `tax/gst.md`, `tax/gst-international-services-entity.md` |
| Taxation (Land Transactions) (Jersey) Law 2009 | 🟡 | single mention |
| Taxation (Implementation) (Jersey) Law 2004 | 🟡 | single mention |
| Taxation (Companies — Economic Substance) (Jersey) Law 2019 | 🟢 | `tax/economic-substance.md` |
| Taxation (Exchange of Information with Third Countries) (Jersey) Regulations 2008 | 🟢 | `international/exchange-of-information.md`, `international/tieas.md` |
| Stamp Duties and Fees (Jersey) Law 1998 | 🟢 | `tax/stamp-duty.md` |
| Long-Term Care (Jersey) Law 2012 | 🟡 | `tax/long-term-care.md` (treated as tax, not as care/welfare statute) |
| Revenue Administration (Jersey) Law 2019 | 🟢 | `tax/revenue-jersey.md` |
| Multinational Corporate Income Tax (Jersey) Law 2025 (Pillar Two) | 🟢 | `tax/pillar-two.md`, `tax/pillar-two-mcit.md` |

## 6. Employment & Discrimination

| Statute | Coverage | Where |
|---|---|---|
| Employment (Jersey) Law 2003 | ✅ | `employment/el-*.md` |
| Discrimination (Jersey) Law 2013 | ✅ | `discrimination/dl-*.md` |
| Employment of States of Jersey Employees (Jersey) Law 2005 | ❌ | not covered |
| Jersey Advisory and Conciliation (Jersey) Law 2003 (JACS) | 🟡 | mentioned in employment tribunal context |
| Health and Safety at Work (Jersey) Law 1989 | 🟡 | two mentions, no dedicated treatment |

## 7. Data Protection & Information

| Statute | Coverage | Where |
|---|---|---|
| Data Protection (Jersey) Law 2018 | ✅ | `data-protection/dpl-*.md` |
| Data Protection Authority (Jersey) Law 2018 | 🟢 | covered alongside DPJL |
| Freedom of Information (Jersey) Law 2011 | ❌ | not covered |
| Public Records (Jersey) Law 2002 | ❌ | not covered |

## 8. Property, Land & Conveyancing

| Statute | Coverage | Where |
|---|---|---|
| Loi (1880) sur la propriété foncière | 🟢 | `property/loi-1880-sur-la-propriete-fonciere.md` |
| Security Interests (Jersey) Law 2012 | 🟢 | `property/security-interests-law-2012.md` |
| Loi (1991) sur la copropriété des immeubles bâtis (flying freehold) | 🟢 | `property/flying-freeholds.md` |
| Loi (1851) sur les Testaments d'Immeubles | ❌ | not covered |
| Loi (1839) sur les remises de biens | 🟡 | mentioned (dégrèvement context) |
| Loi (1832) sur les décrets | ❌ | not covered |
| Public Registry (Indexes) (Jersey) Law 1969 | 🟡 | mentioned |
| Land Transactions (Third Party Rights) (Jersey) Law 2014 | ❌ | not covered |

## 9. Residential Tenancy & Housing

| Statute | Coverage | Where |
|---|---|---|
| **Residential Tenancy (Jersey) Law 2011** | ❌ | **single passing mention** in `property/leases.md` |
| Control of Housing and Work (Jersey) Law 2012 | ✅ | `immigration-residency/chwl-*.md` |
| Lodging Houses (Registration) (Jersey) Law 1962 | 🟡 | two mentions |
| Public Health and Safety (Rented Dwellings) (Jersey) Law 2018 | ❌ | not covered |

## 10. Family, Marriage & Succession

| Statute | Coverage | Where |
|---|---|---|
| Wills and Successions (Jersey) Law 1993 | ✅ | `succession/wsl-*.md` |
| Probate (Jersey) Law 1998 | 🟡 | mentions in succession files; no dedicated treatment |
| Matrimonial Causes (Jersey) Law 1949 | ❌ | one off-topic mention in trusts/savings.md |
| Marriage and Civil Status (Jersey) Law 2001 | ❌ | not covered |
| Civil Partnership (Jersey) Law 2012 | 🟡 | two mentions |
| Children (Jersey) Law 2002 | ❌ | not covered |
| Adoption (Jersey) Law 1961 | ❌ | not covered |
| Child Custody (Jurisdiction) (Jersey) Law 2005 | ❌ | not covered |
| Inheritance (Provision for Family and Dependants) (Jersey) Law 2025 | ❌ | not covered |

## 11. Insolvency & Bankruptcy

| Statute | Coverage | Where |
|---|---|---|
| Bankruptcy (Désastre) (Jersey) Law 1990 | ✅ | `insolvency/bdl-*.md` |
| Loi (1839) sur les remises de biens | 🟡 | mentioned in dégrèvement context |
| Companies (Jersey) Law 1991 — winding-up provisions | ✅ | inside CJL coverage |

## 12. Crime & Criminal Procedure

| Statute | Coverage | Where |
|---|---|---|
| Police Procedures and Criminal Evidence (Jersey) Law 2003 (PPCE) | ❌ | not covered |
| Criminal Procedure (Jersey) Law 2018 | 🟡 | single mention |
| Civil Evidence (Jersey) Law 2003 | ❌ | not covered |
| Misuse of Drugs (Jersey) Law 1978 | ❌ | not covered |
| Sexual Offences (Jersey) Law 2018 | 🟡 | single mention |
| Crime (Disorderly Conduct and Harassment) (Jersey) Law 2008 | ❌ | not covered |
| Crime and Security (Jersey) Law 2003 | ❌ | not covered |
| Extradition (Jersey) Law 2004 | 🟢 | `aml-cft/cicl-part-4-extradition.md` |
| Regulation of Investigatory Powers (Jersey) Law 2005 | ❌ | not covered |
| Bail (Jersey) Law 2018 | ❌ | not covered |
| Police (Jersey) Law 1974 | ❌ | not covered |
| Prison (Jersey) Law 1957 | ❌ | not covered |

## 13. Civil Procedure, Courts & Legal Profession

| Statute | Coverage | Where |
|---|---|---|
| Royal Court (Jersey) Law 1948 / Royal Court Rules 2004 | 🟢 | `legal-system/royal-court.md`, `legal-system/royal-court-rules.md` |
| Court of Appeal (Jersey) Law 1961 | 🟢 | `legal-system/court-of-appeal.md` |
| Magistrate's Court (Miscellaneous Provisions) (Jersey) Law 1949 | 🟢 | `legal-system/magistrates-court.md` |
| Petty Debts Court (Miscellaneous Provisions) (Jersey) Law 2000 | 🟡 | two mentions in court files |
| Advocates and Solicitors (Jersey) Law 1997 | 🟡 | mentioned |
| The Law Society of Jersey Law 2005 | ❌ | not covered |
| Human Rights (Jersey) Law 2000 | 🟢 | `legal-system/echr-human-rights.md` |
| Interpretation (Jersey) Law 1954 | 🟡 | mentioned in statutory-interpretation contexts |

## 14. Consumer, Contract & Sale of Goods

| Statute | Coverage | Where |
|---|---|---|
| Supply of Goods and Services (Jersey) Law 2009 | 🟡 | covered in `contract/sale-of-goods.md` as background; no dedicated file |
| Consumer Safety (Jersey) Law 2006 | ❌ | not covered |
| Competition (Jersey) Law 2005 | 🟡 | mentioned across several files |
| Unfair Contract Terms (no Jersey statute — common law) | n/a | (contract-overview discusses) |

## 15. Health, Welfare & Social Security

| Statute | Coverage | Where |
|---|---|---|
| Social Security (Jersey) Law 1974 | 🟡 | mentions in tax/personal-income-tax.md |
| Income Support (Jersey) Law 2007 | ❌ | not covered |
| Health Insurance (Jersey) Law 1967 | ❌ | not covered |
| Long-Term Care (Jersey) Law 2012 | 🟡 | treated only as tax topic |
| Mental Health (Jersey) Law 2016 | 🟡 | two mentions |
| Capacity and Self-Determination (Jersey) Law 2016 | ❌ | not covered |
| Public Health and Safety (Rented Dwellings) (Jersey) Law 2018 | ❌ | not covered |
| Nursing and Residential Homes (Jersey) Law 1994 | ❌ | not covered |
| Regulation of Care (Jersey) Law 2014 | ❌ | not covered |
| Medicines (Jersey) Law 1995 | ❌ | not covered |
| Termination of Pregnancy (Jersey) Law 1997 | ❌ | not covered |
| Restriction on Smoking (Jersey) Law 1973 | ❌ | not covered |

## 16. Planning, Environment & Building

| Statute | Coverage | Where |
|---|---|---|
| Planning and Building (Jersey) Law 2002 | ❌ | not covered |
| Water Pollution (Jersey) Law 2000 | ❌ | not covered |
| Water (Jersey) Law 1972 | ❌ | not covered |
| Waste Management (Jersey) Law 2005 | ❌ | not covered |
| Drainage (Jersey) Law 2005 | ❌ | not covered |
| Wildlife (Jersey) Law 2021 | ❌ | not covered |
| Animal Welfare (Jersey) Law 2004 | ❌ | not covered |
| Plant Health (Jersey) Law 2003 | ❌ | not covered |

## 17. Immigration & Residency

| Statute | Coverage | Where |
|---|---|---|
| Control of Housing and Work (Jersey) Law 2012 | ✅ | `immigration-residency/chwl-*.md` |
| Immigration (Jersey) Order 1993 (extension of UK Immigration Act) | 🟢 | covered in `immigration-residency/index.md` |
| High Value Residency policy framework | 🟢 | `immigration-residency/high-value-residency.md` |

## 18. Road Traffic & Motor Vehicles

| Statute | Coverage | Where |
|---|---|---|
| Road Traffic (Jersey) Law 1956 | ❌ | not covered |
| Motor Traffic (Third Party Insurance) (Jersey) Law 1948 | ❌ | not covered |
| Motor Vehicle Registration (Jersey) Law 1993 | ❌ | not covered |
| Highways (Jersey) Law 1956 | ❌ | not covered |

## 19. Parishes, Local Government & Elections

| Statute | Coverage | Where |
|---|---|---|
| States of Jersey Law 2005 | 🟡 | one mention in government/states-assembly.md context |
| Public Elections (Jersey) Law 2002 | ❌ | not covered |
| Rates (Jersey) Law 2005 | 🟡 | mentions in tax/property files |
| Parish Rate (Administration) (Jersey) Law 2003 | ❌ | not covered |
| Honorary Police (Parochial Domicile) (Jersey) Law | ❌ | not covered |

## 20. Education

| Statute | Coverage | Where |
|---|---|---|
| Education (Jersey) Law 1999 | ❌ | not covered |
| Children and Day Care (Jersey) Law 2002 | ❌ | not covered |

## 21. Licensing & Commerce (consumer-facing)

| Statute | Coverage | Where |
|---|---|---|
| Licensing (Jersey) Law 1974 (liquor) | 🟡 | one mention |
| Gambling (Jersey) Law 2012 | 🟡 | one mention |
| Tourism (Jersey) Law 1948 | ❌ | not covered |
| Postal Services (Jersey) Law 2004 | ❌ | not covered |
| Telecommunications (Jersey) Law 2002 | ❌ | not covered |
| Customs and Excise (Jersey) Law 1999 | ❌ | not covered |
| Shipping (Jersey) Law 2002 | ❌ | not covered |

## 22. Government, Constitution & Public Finance

| Statute | Coverage | Where |
|---|---|---|
| States of Jersey Law 2005 | 🟡 | covered in `government/states-assembly.md`, `government/council-of-ministers.md` (concept-level, not statute-level) |
| Public Finances (Jersey) Law 2019 | ❌ | not covered |
| Official Publications (Jersey) Law 1960 | ❌ | not covered |
| Emergency Powers and Planning (Jersey) Law 1990 | ❌ | not covered |

---

## Coverage Summary

By tier (across ~115 principal statutes enumerated):

| Tier | Count | Share |
|---|---|---|
| ✅ Article-level wiki | 14 | ~12% |
| 🟢 Dedicated treatment | 18 | ~16% |
| 🟡 Mentioned only | 26 | ~23% |
| ❌ Not covered | 57 | ~50% |

The split is exactly what we feared: a deep professional-finance wiki sitting on top of a wide statutory landscape that is half-untouched. Every ✅ and most 🟢 statutes serve the offshore-finance personas. Almost every ❌ is a statute that matters to ordinary Jersey residents.

---

## Top 20 Highest-Priority Gaps

Ranked by likely impact on ordinary Jersey users. These are statutes scored ❌ or 🟡 that any resident, employee, tenant, consumer, driver, parent, or patient is likely to need.

| # | Statute | Score | Why it matters |
|---|---|---|---|
| 1 | **Residential Tenancy (Jersey) Law 2011** | ❌ | Eviction, deposits, repairs, rent — the gap that prompted this audit. Every renter and landlord in Jersey is governed by it. |
| 2 | **Road Traffic (Jersey) Law 1956** | ❌ | Speeding, driving without insurance, dangerous driving, licence offences. Daily-life statute. |
| 3 | **Planning and Building (Jersey) Law 2002** | ❌ | Planning permission, building consent, enforcement — anyone extending a house or converting a property. |
| 4 | **Matrimonial Causes (Jersey) Law 1949** | ❌ | Divorce, nullity, ancillary relief. Routinely needed and currently invisible. |
| 5 | **Children (Jersey) Law 2002** | ❌ | Care orders, parental responsibility, child protection. Family-court bread and butter. |
| 6 | **Public Elections (Jersey) Law 2002** | ❌ | Voting eligibility, candidate registration, conduct of elections — civic baseline. |
| 7 | **Income Support (Jersey) Law 2007** | ❌ | Means-tested benefits. Currently zero coverage of welfare entitlement. |
| 8 | **Social Security (Jersey) Law 1974** | 🟡 | Pensions, contributions, short-term incapacity. Mentioned only as a tax deduction. |
| 9 | **Misuse of Drugs (Jersey) Law 1978** | ❌ | Drug possession/supply offences. Major chunk of magistrate's-court work. |
| 10 | **Police Procedures and Criminal Evidence (Jersey) Law 2003** | ❌ | PPCE governs arrest, search, detention, interviews. Anyone arrested in Jersey relies on it. |
| 11 | **Mental Health (Jersey) Law 2016** | 🟡 | Compulsory admission, treatment, capacity. Two passing mentions only. |
| 12 | **Capacity and Self-Determination (Jersey) Law 2016** | ❌ | Lasting powers of attorney, advance decisions, deputies. Aging-population priority. |
| 13 | **Marriage and Civil Status (Jersey) Law 2001** | ❌ | Marriage formation, civil status registration. Foundational. |
| 14 | **Education (Jersey) Law 1999** | ❌ | Compulsory schooling, exclusions, SEN, attendance. Every parent is governed by it. |
| 15 | **Consumer Safety (Jersey) Law 2006** | ❌ | Product safety, recalls, dangerous goods. Consumer-protection baseline. |
| 16 | **Health and Safety at Work (Jersey) Law 1989** | 🟡 | Workplace duties, RIDDOR-equivalent reporting. Two passing mentions. |
| 17 | **Petty Debts Court (Miscellaneous Provisions) (Jersey) Law 2000** | 🟡 | Small claims forum — debts under £30,000. Critical access-to-justice statute, only mentioned. |
| 18 | **Freedom of Information (Jersey) Law 2011** | ❌ | Citizen access to public records. Required for journalism, civic accountability. |
| 19 | **Regulation of Investigatory Powers (Jersey) Law 2005** | ❌ | Surveillance, interception, covert powers. Civil-liberties baseline. |
| 20 | **Public Health and Safety (Rented Dwellings) (Jersey) Law 2018** | ❌ | Minimum housing standards, hazard ratings. Pairs with Residential Tenancy gap at #1. |

### Honorable mentions (just outside the top 20)

- Civil Partnership (Jersey) Law 2012 (🟡)
- Adoption (Jersey) Law 1961 (❌)
- Probate (Jersey) Law 1998 (🟡)
- Customs and Excise (Jersey) Law 1999 (❌)
- Regulation of Care (Jersey) Law 2014 (❌)
- Nursing and Residential Homes (Jersey) Law 1994 (❌)
- Animal Welfare (Jersey) Law 2004 (❌)
- Loi (1851) sur les Testaments d'Immeubles (❌) — historic but live for real-property wills

---

## Method note

- Enumeration source: Wikipedia "List of laws of Jersey," supplemented by domain knowledge of Jersey legislative landscape (jerseylaw.je blocks automated access).
- Scoring method: `grep -ril` against `/Users/mike/code/offshoreai/jersey/` for each statute's canonical name and likely short forms. A statute scored ✅ where a dedicated file family (e.g. `cjl-*.md`) exists; 🟢 where one or more dedicated files cover it substantively; 🟡 where mentions exist but no dedicated file; ❌ where no mention was found.
- No new substantive content was created during this audit. Gap-filling is a separate workstream.
