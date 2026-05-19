---
title: Data Protection and AML — Managing the Overlap
jurisdiction: jersey
category: use-cases
persona: compliance-mlro
status: draft
last_verified: 2026-05-17
tags:
  - jersey
  - compliance-mlro
  - data-protection
  - aml
  - persona-compliance-mlro
  - use-case
see_also:
  - ./index.md
  - ../../aml-cft/index.md
  - ../../data-protection/index.md
---

# Data Protection and AML — Managing the Overlap

## The question

You're the MLRO of a Jersey TCB. The **Data Protection
(Jersey) Law 2018** and **AML / CFT obligations** under POCL
1999 / MLO 2008 can pull in **different directions**. How do
you reconcile them?

## The short answer

- **AML / CFT obligations** generally **prevail** where they
  conflict with DP rights through **legal obligation** lawful
  basis (DPL Article 8(c));
- **CDD data** is processed lawfully on this basis;
- **Sanctions screening** lawful on this basis;
- **SAR records** retained on this basis;
- **Tipping-off** restrictions limit data subject access
  (DPL Article 22 objection / Article 17 access can be
  refused);
- **International transfers** of CDD subject to specific
  rules.

## The proper answer

### Lawful basis for AML processing

Under DPL Article 8, six lawful bases. For AML processing:

- **Legal obligation** (Article 8(c)) — primary basis for
  AML processing required by POCL / MLO;
- **Legitimate interests** (Article 8(f)) — secondary basis
  for some processing;
- **Contract** (Article 8(b)) — for customer onboarding;
- **Consent** generally not the basis (cannot withdraw
  consent to satisfy AML obligation).

See [`../../data-protection/dpl-article-8.md`](../../data-protection/dpl-article-8.md).

### Special category data in CDD

CDD may incidentally collect **special category** data
(DPL Article 9):

- **Ethnicity** from ID document;
- **Religious affiliation** from name patterns / source-of-
  wealth investigation;
- **Health** information in some cases;
- **Sexual orientation** rarely.

The **lawful basis** for special category processing is
typically **substantial public interest** (DPL Article 9 —
including AML / CFT supervision public interest).

See [`../../data-protection/dpl-article-9.md`](../../data-protection/dpl-article-9.md).

### Subject access requests

Customer **subject access request** (SAR) under DPL Article
17:

- Customer **entitled** to copy of personal data;
- **Subject to exemptions**;
- **AML / CFT-related** exemption — disclosure that would
  prejudice AML / CFT investigation **can be refused**;
- **Tipping off** — cannot disclose existence of internal
  disclosure or external SAR (POCL Article 35);
- **Practical**: respond with **general** personal data,
  withhold AML-specific records.

### Right of erasure

DPL Article 19 (right to erasure):

- **Customer** can request deletion;
- **AML / CFT retention** obligations (MLO Article 17 — 5+
  years post-relationship) typically **override** erasure
  right;
- **Justify** refusal on legal obligation basis;
- **Retain** specifically for AML purposes only.

### Right to object

DPL Article 22 (right to object):

- **Customer** can object to AML processing;
- **Cannot** prevent legally-required AML processing;
- **Justify** continued processing on legal obligation
  basis.

### International transfers

CDD data often transferred:

- **Group-wide** AML systems;
- **Foreign authorities** under MLA / treaty obligations;
- **Foreign regulators** through MoUs;
- **Foreign customers'** jurisdictions through CRS / FATCA.

Each transfer must satisfy DPL Part 5 (transfers):

- **Adequate** destination (UK, EU);
- **SCCs** for other destinations;
- **Specific** Article 51 derogations (legal claims, public
  interest);
- See [`../../data-protection/dpl-part-5-transfers.md`](../../data-protection/dpl-part-5-transfers.md).

### Records retention

Two regimes intersect:

- **DPL** — retain only as long as necessary for the
  purpose;
- **MLO Article 17** — retain at least **5 years** post-
  relationship;
- **POCL** — investigative records retained per Court /
  AG direction.

Justify retention beyond DPL minimum by **legal obligation**:

- **Document** the retention period rationale;
- **Specific** retention schedules per record type;
- **Regular review** for justified retention.

### Breach notification

If **personal data breach** affecting CDD data:

- **DPL Article 43** — notify JOIC within 72 hours;
- **POCL** — consider whether breach is AML-relevant;
- **JFSC** — material breach notification required;
- **Coordinated** response.

### Tipping off and DPL transparency

Tension:

- **DPL transparency** requires informing customers about
  processing;
- **Tipping off** prohibits informing customer about SAR;
- **Resolution**: privacy notice mentions AML / CFT
  processing generically; **specific** SAR details not
  disclosed;
- **Specific** legal basis (Article 22 of POCL —
  protected disclosure exception).

## Specific scenarios

### Customer asks why account is frozen

- **AML / SAR** based freeze cannot be explained citing the
  SAR (tipping off);
- **General** statement about "investigations" / "regulatory
  reviews" possibly possible (subject to AG / FIU advice);
- **Specific** customer-facing messaging coordinated with
  legal counsel;
- **DPL subject access** can be refused for AML-specific
  records.

### Group AML system

- **Transfer** of CDD to group entities outside Jersey;
- **DPL Article 7** — Jersey processor / controller
  established in Jersey, group affiliates may be processors;
- **SCCs** or **BCRs** for non-adequate destinations;
- **Group-wide** AML programme as the legal basis.

### Customer requests deletion

- **Active customer** — refuse based on legal obligation
  (cannot conduct relationship without CDD);
- **Former customer** — retain for 5+ years per MLO;
- **Post-retention** — can delete with specific safeguards
  for ongoing matters.

### Authority request

- **Foreign authority** requests CDD data;
- **MLA route** (CICL 2001) or direct regulatory channel;
- **Justify** disclosure on legal obligation or treaty
  obligation;
- **Document** the disclosure.

## What to do next

For DP / AML interaction:

1. **Document** lawful bases for each AML processing
   purpose;
2. **Privacy notice** addressing AML processing
   transparently (generic);
3. **Records of processing** maintained per DPL Article 36;
4. **Subject access procedures** with AML carve-outs;
5. **Retention schedule** justified by AML obligations;
6. **Cross-border transfer** safeguards documented;
7. **Coordinated** breach response between DPL and AML.

## Pitfalls

- **Confused** lawful basis (consent vs legal obligation);
- **Disclosure** of SAR information in DP response;
- **Refusal** without proper exemption justification;
- **Retention** beyond justified period;
- **Inadequate** transfer safeguards;
- **Inadequate** breach response.

## Cross-references

- [`../../data-protection/dpl-article-8.md`](../../data-protection/dpl-article-8.md);
- [`../../data-protection/dpl-article-9.md`](../../data-protection/dpl-article-9.md);
- [`../../data-protection/dpl-part-3-rights.md`](../../data-protection/dpl-part-3-rights.md);
- [`../../aml-cft/pocl-article-35.md`](../../aml-cft/pocl-article-35.md);
- [`../../aml-cft/mlo-article-17.md`](../../aml-cft/mlo-article-17.md);
- [`tipping-off.md`](./tipping-off.md);
- [`record-retention.md`](./record-retention.md).
