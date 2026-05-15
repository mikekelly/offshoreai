---
title: Changelog — Jersey
jurisdiction: jersey
category: meta
status: draft
last_verified: 2026-05-14
---

# Changelog — Jersey

Records additions, material revisions, and re-verifications of files in
this corpus. Dated entries are newest first. The intent is that a reader
can scan this and see what has been verified recently, and that an agent
can prioritise re-checking older files.

For full diff history, see the git log.

## 2026-05-14

- Initial corpus scaffold created. Top-level [`index.md`](index.md),
  [`README.md`](README.md), [`glossary.md`](glossary.md),
  [`sources.md`](sources.md) and section directories laid down.
- First-slice content drafted for Phase 1: government, legal-system,
  tax (zero-ten, personal, GST), companies (Companies Law 1991
  overview). All marked `status: draft` pending second-pass
  verification.
- Confirmed canonical jerseylaw.je URLs for the principal statutes:
  Income Tax (Jersey) Law 1961, Companies (Jersey) Law 1991, Trusts
  (Jersey) Law 1984, Foundations (Jersey) Law 2009, Financial Services
  Commission (Jersey) Law 1998.
- **Use-cases layer introduced** under
  [`use-cases/`](use-cases/index.md). Trust-officer persona started:
  [`use-cases/trust-officer/index.md`](use-cases/trust-officer/index.md)
  lists ~30 canonical questions; three written to depth:
  [distribution decisions and Court blessing](use-cases/trust-officer/distribution-decisions-and-court-blessing.md),
  [Article 47 set-aside for mistake](use-cases/trust-officer/article-47-set-aside-for-mistake.md),
  and [beneficiary information rights](use-cases/trust-officer/beneficiary-information-rights.md).
- Supporting topic-graph files deepened from stubs:
  [`trusts/article-47-set-aside.md`](trusts/article-47-set-aside.md)
  (Articles 47B–47H, *S & T Trusts* three-limb test, divergence from
  *Pitt v Holt*),
  [`trusts/article-51-directions.md`](trusts/article-51-directions.md)
  (four *Public Trustee v Cooper* categories, *S Settlement* test,
  Beddoe procedure),
  [`trusts/beneficiary-rights.md`](trusts/beneficiary-rights.md)
  (*Schmidt v Rosewood* supervisory jurisdiction, Jersey presumptions
  by document type, DPJL 2018 interaction).
- **Statute-wiki layer started** for the Trusts (Jersey) Law 1984.
  New [`trusts/articles-index.md`](trusts/articles-index.md) lists
  every Article 1–61 (66 active provisions) with deep-file links.
  Articles 1–15 of the Trusts Law now have dedicated deep files
  covering interpretation/definitions, existence (Art 2),
  recognition (Art 3), proper law (Art 4), court jurisdiction (Art 5),
  Part 2 scope (Art 6), creation (Art 7), property (Art 8), the
  firewall (Art 9), reserved powers (Art 9A), beneficiaries (Art 10),
  disclaimer (Art 10A), validity (Art 11), purpose trusts (Art 12),
  enforcers (Art 13), enforcer lifecycle (Art 14), and duration (Art 15).
  Articles 16–47A and 48–61 remain to be filled (~46 articles, est. 3
  more turns).

## 2026-05-15

- Repository initialised as a git repo. Initial commit covers the
  full corpus to date.
- Statute-wiki layer continued: Articles 16–29 of the Trusts (Jersey)
  Law 1984 now have dedicated deep files. New files cover:
  - **Trustee appointment / retirement** — Article 16 (number of
    trustees), Article 17 (appointment out of court), Article 18
    (no renunciation after acceptance), Article 19 (resignation
    and removal).
  - **Trustee duties** — Article 21 (core duties: prudent-person,
    utmost good faith, no-profit, accounts, segregation), Article 22
    (co-trustees acting together — unanimity default), Article 23
    (impartiality).
  - **Trustee powers** — Article 24 (natural-person default
    powers), Article 25 (delegation), Article 26 (remuneration and
    expenses), Article 27 (appropriation), Article 28 (corporate
    trustee resolution), Article 29 (statutory disclosure
    interface with the *Schmidt v Rosewood* jurisdiction).
- Articles index and topic index updated to reflect the new files.
  Articles 30–47A and 48–61 remain (~35 active provisions, est. 2
  more turns to complete the Trusts Law).

## Conventions for entries

Each entry should record:

- **Date** of the change.
- **Files** touched.
- **Nature** of the change — added, revised, re-verified, removed.
- **Why**, if not obvious — e.g. a new States Assembly enactment, new
  JFSC guidance, change to a tax-allowance figure for the new Year of
  Assessment.
- **Source** triggering the change, where applicable.

Example:

> ### 2026-09-XX
> - **Files**: `tax/personal-income-tax.md`, `tax/index.md`
> - **Nature**: revised to reflect YA 2026 allowances published by
>   Revenue Jersey.
> - **Source**: gov.je 2026 tax allowances page.
