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
- Articles 30–43A added: breach-of-trust liability (with the
  irreducible-core exoneration limits — fraud, wilful misconduct,
  gross negligence — cannot be excluded), cross-trust notice and
  transaction rules (Art 31), third-party liability with the "as
  trustee, not personally" formula (Art 32), constructive
  trusteeship including knowing-receipt and dishonest-assistance
  liability (Art 33), outgoing-trustee position (Art 34),
  spendthrift / protective trusts (Art 35), class-interest
  mechanics (Art 36), deed-based variation (Art 37),
  accumulation/maintenance/advancement (Art 38), power of
  appointment (Art 39), power of revocation (Art 40), change of
  proper law (Art 41), failure / resulting-trust default (Art 42),
  termination (Art 43, Saunders-v-Vautier analogue), and trustee
  security on exit / distribution (Art 43A). 15 new files.
  Articles 44–47A and 48–61 remain (~17 active provisions; one
  more turn to finish Trusts Law 1984).
- **Trusts Law 1984 statute-wiki COMPLETE.** Final batch:
  Articles 44–47A (court powers — resident-trustee appointment,
  relief from liability, beneficiary indemnity, court variation,
  cy-près redirection), Articles 48–55 (Part 3 foreign-trust
  recognition; Part 4 general provisions on execution, costs,
  trustee insolvency-remoteness, and BFPV protection), and
  Articles 57–61 (limitation with the distinctive Jersey 3-year /
  21-year structure and fraud exception; temporal application;
  savings preserving customary-law jurisdictions; rules of court;
  citation). 17 new files.

  Every active Article of the Trusts (Jersey) Law 1984 (1–61,
  excluding repealed 20 and 56) now has a dedicated concept file
  (Articles 47B–47J consolidated in one mistake-regime file).
  ~60 per-Article files plus the Articles index, plus 3 earlier
  concept files (firewall, reserved powers, beneficiary rights)
  that anchor major cross-cutting themes.

  Next statute: Companies (Jersey) Law 1991 (24 Parts, several
  hundred Articles, est. 10–15 turns).

- **Companies (Jersey) Law 1991 statute-wiki started.** New
  [`companies/articles-index.md`](companies/articles-index.md) lists
  every active Article across the 24 Parts of the Law (and
  Schedules 1, 2). Deep files written for Part 1 (Articles 1, 2,
  2A, 2B — interpretation and group-relationship definitions) and
  for the Article 3 family (Articles 3, 3A–3I — formation methods
  and company-type definitions, including PCC/ICC cell companies).
  14 new files.

- **Tags introduced as primary cross-cutting navigation layer.**
  New [`../CONVENTIONS.md`](../CONVENTIONS.md) update defines the
  `tags` frontmatter field and articulates the **orientation
  principle**: every file (especially every `index.md`) must make
  sense to a cold-reader agent arriving via search rather than
  from the parent. New [`../TAGS.md`](../TAGS.md) is the canonical
  taxonomy — categories cover subject, legal concept, trust-
  specific, company-specific, tax-specific, process, cross-border,
  foreign-tax, regulatory, document-type, statute, persona, and
  source. Files cite only tags listed there; new tags require a
  TAGS.md addition first.

- **Index files rewritten for cold-reader orientation.** Rewrote
  [`index.md`](index.md), [`trusts/index.md`](trusts/index.md),
  [`trusts/articles-index.md`](trusts/articles-index.md),
  [`use-cases/index.md`](use-cases/index.md), and
  [`use-cases/trust-officer/index.md`](use-cases/trust-officer/index.md)
  to open with a **what / why / when / where-to-start** section,
  group links by **conceptual theme** rather than flat alphabetical
  or numerical lists, and give every link a **substantive
  description** that tells a cold reader why they would click. An
  agent landing in these files via search now has the orientation
  it needs to follow its nose forward.

- **Tags applied to first batch of high-traffic concept files**:
  firewall, reserved-powers, beneficiary-rights, article-47-set-aside,
  article-51-directions, trustee-duties, zero-ten, crown-dependency,
  jfsc, companies-law-1991, trusts-law-1984, royal-court. Tag
  application will continue across the rest of the corpus in
  subsequent batches.

- **Tag propagation across the corpus** — ~75 files. Every Article
  file in trusts/ (1–61 except repealed), all Companies-Law files
  written, all tax/government/legal-system/financial-regulation/
  foundations content files, all stub section indexes, the three
  written use-case files, and the meta files (glossary, sources).

- **`.obsidian/` untracked** and added to `.gitignore`. A stray
  empty `jersey/stamp-duty.md` (created by Obsidian on a broken-
  link click) removed.

- **Section index rewrites** to cold-reader orientation: tax/index,
  companies/index, government/index, legal-system/index,
  financial-regulation/index, foundations/index. Each now opens
  with "what / why / when / where-to-start", groups files by
  conceptual theme, gives every link a substantive description,
  and surfaces tag-driven navigation.

- **Companies Law 1991 statute-wiki continued** — Articles 4–17D
  added as 21 new deep files:
  - **Memorandum cluster (Articles 4, 4A, 4B, 4C)** — general
    memorandum, share companies, guarantee companies, limited-
    duration companies.
  - **Articles, Standard Table, incorporation documents (Articles
    5, 6, 7)** — articles of association, the Minister's Standard
    Table for vanilla par-value companies, the documents required
    on incorporation including director particulars.
  - **Registration, effect, alteration, copies (Articles 8–12)** —
    Registrar's authority and public-interest referral; certificate
    of incorporation as conclusive evidence; the statutory contract
    between company and members under Article 10; alteration by
    special resolution with member-protection limits; the member's
    right to a copy of the deed.
  - **Names cluster (Articles 13–15)** — name requirements with
    mandatory "Limited" / "Ltd" suffix; change of name by special
    resolution with 14-day Greffier notice for property-holding
    companies; the Registrar's post-incorporation power to direct
    a change.
  - **Status changes (Articles 16, 17, 17A, 17B, 17C, 17D)** —
    public → private and private → public conversions, the
    30-member threshold and its member-counting rules
    (employee-shareholders excluded), effective date on certificate
    issue, and the abolition-of-limit power exercised by the
    States.

  Articles index updated to reflect live files (no more "planned"
  markers for Articles 4–17D). Articles 18–224 remain (~250 active
  provisions, est. 10–12 further turns).

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
