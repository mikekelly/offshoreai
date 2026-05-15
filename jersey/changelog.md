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

- **Companies Law Articles 18–33 added** (Parts 5, 6, 7) — 16 new
  deep files: corporate capacity with ultra vires abolished
  (Art 18), no implied notice (Art 19), form of contracts (Art 20),
  pre-incorporation contracts (Art 21), seals (Arts 22–24);
  member definition with the trust/nominee carve-out (Art 25),
  cross-holdings prohibited with pre-1992 grandfather and
  fiduciary exception (Art 26), minimum two members for public
  companies with personal-liability rule (Art 27), no minors
  (Art 28); prospectuses with the qualified-investor and
  small-scale carve-outs (Art 29), civil compensation (Art 30),
  exemption defences (Art 31), recovery as ordinary debt
  (Art 32), and criminal liability (Art 33).

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

- **Companies Law Articles 34–54 added** (Parts 8, 9, 10) — 29
  new deep files:
  - **Part 8 — Share Capital (Articles 34–40C)**: nature and
    numbering of shares with bearer-share prohibition (Art 34);
    abolition of the rule on share discounts (Art 35); Article 36
    (heading not visible, stub); different amounts on shares /
    partly-paid shares (Art 37); alteration of par-value vs
    no-par-value capital (Arts 38, 38A); currency-conversion rate
    (Art 38B); share-premium account for par-value (Art 39) and
    stated-capital account for no-par-value (Art 39A); relief
    from transfer requirements for group reorganisations (Art
    39B); fractional shares (Art 40); conversion between par and
    no-par (Arts 40A, 40B); Part 8 amendment power (Art 40C).
  - **Part 9 — Register of Members and Certificates (Articles
    41–51A)**: the register of members (Art 41); share transfer
    and registration mechanics with deed-imposed restrictions
    (Art 42); certification of transfers (Art 43); register
    location with Registrar notification (Art 44); inspection of
    register on reasonable notice (Art 45); declaration for lost
    certificates with indemnity practice (Art 46); Royal Court
    rectification (Art 47); the "trusts not on the register"
    clean-handed rule (Art 48); overseas branch registers
    supplementing the principal register (Art 49); share-
    certificate content and timing (Art 50); prima facie evidence
    of title (Art 51); uncertificated-securities regime including
    CREST-eligibility (Art 51A).
  - **Part 10 — Class Rights (Articles 52–54)**: variation of
    class rights with the 75% written-consent / class-meeting
    route (Art 52); the 15% minority-objection right with Royal
    Court application (Art 53); registration of special-rights
    particulars (Art 54).

  Articles index updated. Articles 55–224 remain (~170 active
  provisions across Parts 11–24).

- **Companies Law Articles 55–72 added** (Parts 11, 12, 13) — 26
  new deep files (and catch-up of the index for Parts 8–10 if not
  already reflected):
  - **Part 11 — Redemption and Purchase of Shares (Articles 55,
    57–59)**: redeemable shares (55); share buyback (57);
    abolition of financial-assistance rule (58); treasury shares
    (58A); treasury limits (58B); Part 11 ops not a capital
    reduction (58C); amendment power (59). [Article 56 repealed.]
  - **Part 12 — Reduction of Capital (Articles 60–66A)**: share
    forfeiture (60); reduction of capital accounts (61); **the
    Article 61A solvency-statement mechanism** as the centrepiece
    of Jersey capital management (cash-flow rather than
    profits-available test; all directors must sign; personal
    liability for false statements); solvency-statement
    registration (61B); court route under Articles 62–64;
    member liability post-reduction (65); concealing-creditor
    offence (66); amendment power (66A).
  - **Part 13 — Administration (Articles 67–72)**: registered
    office in Jersey (67); court relief from breach in
    unavoidable circumstances (67A); review of Registrar's
    decision (67B); evidence of authorization (67C); Articles 68
    and 71 (stubs — headings not visible); name on correspondence
    (69); particulars in correspondence (70); service of documents
    at registered office (72).

  Articles index updated to live links for Parts 8–13. Articles
  73–224 remain (~150 active provisions across Parts 14–24).

- **Companies Law Articles 73-85A (Part 14) and 114-115B (Part 17)
  added** — 22 new deep files covering directors and the
  distribution-restriction regime. Highlights:
  - **Article 74 directors' duties** — the most-cited Article of
    the Companies Law: honesty and good faith, proper purpose,
    avoid conflicts, no profit without authorisation, care/
    diligence/skill (with professional uplift), no self-dealing
    without disclosure, no competition. Common-law and
    equitable duties preserved alongside.
  - Connected persons (Art 74ZA) for conflict purposes; sole-
    member-director exception (74A); interest disclosure (75)
    and consequences (76).
  - Indemnity of officers (77) - subject to irreducible-core
    limits (no fraud, no wilful misconduct, no breach of duty
    to the company); disqualification orders (78); personal
    liability for acting while disqualified (79); third-party
    protection for director acts (80).
  - Secretary (81), qualifications (82), register (83);
    director particulars natural / corporate (84, 84A);
    secretary particulars (85); Part 14 amendment power (85A).
  - **Article 115 distribution restrictions** — Jersey's
    cash-flow solvency test (not English profits-available
    test), the SECOND pillar (with Art 61A) of capital
    management. Same all-directors-must-sign mechanism.
    Distinction is one of the most-cited reasons for Jersey
    TopCo structures.
  - Distribution definition (114) - substance over form;
    Article 115ZA court-rectification for procedural deficiencies;
    Article 115A unlawful-distribution consequences (members
    repay, directors personally liable, Liquidator pursuit on
    insolvency); Part 17 amendment power (115B).

  Articles index updated for Parts 14 and 17. Articles 86-101
  (Part 15 Meetings), 102-113Q (Part 16 Accounts and Audits),
  and Parts 18-24 remain.

- **Companies Law Articles 86-101 added (Part 15 Meetings)** — 20
  new deep files: participation in meetings including electronic
  (86); annual general meeting requirements public vs private
  (87); JFSC power to call meeting in default (88); 10%-member
  requisition right (89); **Article 90 definition of special
  resolution** (75% threshold, notice requirement); notice of
  meetings (91) with 21-day default; meetings and votes including
  show-of-hands default with chair's casting vote (92); corporate
  member representation (93); Royal Court power to order meetings
  (94); **Article 95 written resolutions** (the modern operational
  default for private companies); director-proposed written
  resolutions (95ZA); member-proposed written resolutions (95ZB);
  accompanying statements (95ZC); sole-member decisions (95A);
  proxies (96); poll demand (97) converting show-of-hands to
  share-weighted voting; minutes (98); minute-book inspection
  (99); filing of resolutions with the Registrar (100);
  adjourned-meeting resolutions (101).

  Articles index updated. Articles 102-113Q (Part 16 Accounts
  and Audits) and Parts 18-24 remain.

- **Companies Law Articles 102-113Q (Part 16 Accounts and Audits)
  added** — 29 new deep files covering accounting records,
  retention, accounts, audit, and the recognized-auditor regime.
  Highlights: Article 105 accounts; Article 113 appointment and
  removal of auditors; Article 113A auditor's report (true and
  fair view); Article 113E independence; the JFSC oversight
  framework (Articles 113H-113Q) for recognized auditors.

  Articles index updated. Parts 18-24 remain (~140 active
  articles).

## 2026-05-15 — Companies Law Part 18, 18A, 18BA (Takeovers, Schemes, Demergers)

Added 14 deep concept files covering the Part 18 takeover regime,
Part 18A scheme of arrangement, and Part 18BA statutory demerger:

- Part 18 (Takeovers, Arts 116–124A) — 10 files:
  - `takeover-offers.md` (Art 116 — definition gateway)
  - `squeeze-out.md` (Art 117 — 90% threshold and notice)
  - `squeeze-out-effect.md` (Art 118 — mechanics of compulsory acquisition)
  - `sell-out.md` (Art 119 — minority's reciprocal right)
  - `sell-out-effect.md` (Art 120 — mechanics of sell-out)
  - `takeover-court-applications.md` (Art 121 — Royal Court oversight)
  - `joint-offers.md` (Art 122)
  - `takeover-associates.md` (Art 123 — concert-party rule)
  - `convertible-securities.md` (Art 124)
  - `part-18-amendment-power.md` (Art 124A)
- Part 18A (Compromises and Arrangements, Arts 125–127) — 3 files:
  - `scheme-of-arrangement.md` (Art 125 — Jersey scheme foundation)
  - `scheme-information.md` (Art 126 — explanatory statement)
  - `reconstruction-and-amalgamation.md` (Art 127 — court-ordered transfers)
- Part 18BA (Demergers, Art 127GB) — 1 file: `demergers.md`

Articles index updated; planned markers replaced with live links.
