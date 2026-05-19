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
  New [`../CONVENTIONS.md`](../../CONVENTIONS.md) update defines the
  `tags` frontmatter field and articulates the **orientation
  principle**: every file (especially every `index.md`) must make
  sense to a cold-reader agent arriving via search rather than
  from the parent. New [`../TAGS.md`](../../TAGS.md) is the canonical
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

## 2026-05-15 — Companies Law Part 18B (Mergers)

Added 22 deep concept files plus a Part overview, covering the
Part 18B statutory merger regime (Articles 127A–127GA):

- General: `merger-interpretation.md`, `merger-eligible-bodies.md`,
  `merger-eligible-merged-bodies.md`
- Members: `merger-agreement.md`,
  `merger-resolutions-certificates.md`, `merger-approval.md`,
  `merger-simplified-approval.md`, `merger-member-objection.md`
- Creditors: `merger-notice-creditors.md`,
  `merger-court-application.md`, `merger-creditor-objection.md`
- Commission (cross-border consent regime):
  `merger-commission-consent.md`, `merger-commission-fees.md`,
  `merger-commission-info.md`, `merger-commission-decisions.md`
- Registration: `merger-preregistration-jersey.md`,
  `merger-preregistration-foreign-merged.md`,
  `merger-preregistration-other.md`, `merger-registration.md`
- Final: `merger-completion-effect.md` (universal succession),
  `merger-offences.md`, `part-18b-amendment-power.md`
- Overview: `mergers.md` (six-chapter breakdown, decision table
  for choosing between merger / scheme / takeover / continuance /
  demerger).

Articles index updated.

## 2026-05-15 — Companies Law Part 18C (Continuance / Redomiciliation)

Added 18 deep concept files plus a Part overview, covering the
Part 18C continuance regime (Articles 127H–127Y):

- Eligibility & gating: `continuance-eligible-bodies.md`,
  `continuance-restrictions.md`, `continuance-security.md`
- Inbound (foreign body → Jersey company):
  `continuance-inbound-application.md`, `continuance-articles.md`,
  `continuance-name.md`,
  `continuance-inbound-determination.md`,
  `continuance-inbound-certificate.md`,
  `continuance-inbound-effect.md`
- Outbound (Jersey company → foreign body):
  `continuance-outbound-approval.md`,
  `continuance-outbound-creditor-notice.md`,
  `continuance-outbound-objection.md`,
  `continuance-outbound-application.md`,
  `continuance-outbound-determination.md`,
  `continuance-outbound-effect.md`
- Cross-cutting: `continuance-solvency.md`,
  `continuance-supplementary.md`, `continuance-offences.md`
- Overview: `continuance.md` (inbound/outbound flow comparison,
  decision table for redomiciliation tools).

Articles index updated.

## 2026-05-15 — Companies Law Part 18D (Cell Companies — ICC and PCC)

Added 24 deep concept files covering the Part 18D cell-company regime
(Articles 127YA–127YW), and expanded the Article 3I overview file with
a full Part 18D index.

ICC (incorporated cell company) provisions (127YA–127YN, 15 files):

- `icc-cell-application.md` (127YA) — cell-creation application
- `icc-cell-articles.md` (127YB) — cell constitutional documents
- `icc-cell-creation.md` (127YC) — registration mechanic
- `icc-cell-status.md` (127YD) — cells as separate legal persons
- `icc-cell-shared-administration.md` (127YDA) — shared registers / office
- `icc-cell-annual-confirmation.md` (127YE)
- `article-127yf.md` (127YF) — stub
- `icc-accounts.md` (127YG)
- `icc-cell-incorporation-independence.md` (127YH) — cell→standalone
- `icc-cell-transfer.md` (127YI) — moving cells between ICCs
- `icc-company-becoming-cell.md` (127YIA) — standalone→cell
- `cell-companies-winding-up.md` (127YJ) — Part 21 application
- `icc-cell-names.md` (127YL)
- `icc-alteration-restriction.md` (127YM)
- `part-18d-amendment-power.md` (127YN)

PCC (protected cell company) provisions (127YO–127YW, 9 files):

- `pcc-interpretation.md` (127YO)
- `pcc-cell-status.md` (127YP) — cells as statutory compartments
- `pcc-membership.md` (127YQ) — core vs cellular members
- `pcc-director-duties.md` (127YR) — segregation duties
- `pcc-names.md` (127YS)
- `pcc-segregation.md` (127YT) — central segregation rule
- `pcc-cellular-assets.md` (127YU)
- `pcc-summary-winding-up.md` (127YV) — segregation in insolvency
- `pcc-court-liability.md` (127YW) — Royal Court determinations

Articles index updated with full ICC and PCC tables.

This completes the Companies Law 1991 statute wiki through Part 18D
(commercial reorganisation regime: takeovers, schemes, demergers,
mergers, continuance, cell companies). Remaining Parts: 19 (Investigations),
20 (Unfair Prejudice), 20A (Economic Substance), 21 (Winding Up), 22
(External Companies), 23 (Registrar), 24 (Miscellaneous).

## 2026-05-15 — Companies Law Parts 19, 20, 20A

Added 18 deep concept files plus a Part 19 overview, covering the
investigation, unfair-prejudice, and economic-substance regimes:

Part 19 — Investigations (13 files + overview):

- `inspector-appointment.md` (Art 128)
- `inspector-powers.md` (Art 129)
- `inspector-production.md` (Art 130)
- `inspector-bank-accounts.md` (Art 131)
- `inspector-search.md` (Art 132)
- `inspector-obstruction.md` (Art 133)
- `inspector-non-cooperation.md` (Art 134)
- `inspector-reports.md` (Art 135)
- `inspector-civil-proceedings.md` (Art 136)
- `inspector-expenses.md` (Art 137)
- `inspector-report-evidence.md` (Art 138)
- `privileged-information.md` (Art 139)
- `external-company-investigations.md` (Art 140)
- `investigations.md` — Part 19 overview

Part 20 — Unfair Prejudice (3 files):

- `unfair-prejudice-member-application.md` (Art 141)
- `unfair-prejudice-minister-jfsc.md` (Art 142)
- `unfair-prejudice-court-powers.md` (Art 143)

Part 20A — Economic Substance Test (2 files):

- `substance-court-application.md` (Art 143A)
- `substance-court-powers.md` (Art 143B)

Articles index updated.

## 2026-05-15 — Companies Law Part 21 (Winding Up of Companies)

Added 62 deep concept files plus a Part 21 overview, covering the
entire winding-up regime — the largest single Part of the Companies Law:

Overview: `winding-up.md` covers the five-chapter structure and choice
between summary, just-and-equitable, creditors', limited-duration and
désastre routes.

Chapter 1 — Limited duration (2 files):
- `winding-up-limited-life.md` (Art 144)
- `winding-up-limited-duration.md` (Art 144A)

Chapter 2 — Summary winding up (11 files): solvent voluntary
liquidation including procedure, commencement, liquidator appointment,
distribution, insolvency conversion, désastre bridge, and termination.

Chapter 3 — Just and equitable (1 file):
- `just-and-equitable-winding-up.md` (Art 155)

Chapter 4 — Creditors' winding up (39 files) — the dominant insolvency
route, covering company application, creditor application, provisional
liquidator, court order, notice, commencement, creditors' meetings,
liquidator appointment, liquidation committee, costs, désastre bridge,
arrangements, liquidator powers/duties, disclaimer of onerous property
and leases, claw-back regime (transactions at undervalue, preferences,
extortionate credit), wrongful trading (Art 177), fraudulent trading
(Art 178), delivery and seizure, share-buyback claw-back, cooperation
duty, misconduct reporting, termination, and distribution waterfall.

Chapter 5 — General provisions (10 files): references to court,
enforcement of liquidator filings, qualifications, corrupt inducement
offence, notifications, contributory liability, bar against parallel
insolvency proceedings, record retention, amendment power.

Articles index updated. Part 21 placeholder replaced with detailed
chapter-by-chapter tables.

Companies Law remaining: Parts 22 (External Companies), 23 (Registrar),
24 (Miscellaneous and Final Provisions), and Schedules.

## 2026-05-15 — Companies Law Parts 22, 23, 24 + Schedules (Companies Law COMPLETE)

Added 31 deep concept files covering the final Parts of the
Companies (Jersey) Law 1991:

Part 22 — External Companies (1 file):
- `external-companies.md` (Art 195)

Part 23 — Registrar (12 files):
- `registrar-officers.md` (Art 196)
- `registrar-seal.md` (Art 197)
- `registered-numbers.md` (Art 198)
- `document-size-durability.md` (Art 199)
- `document-form.md` (Art 200)
- `registrar-fees.md` (Art 201)
- `registrar-records-keeping.md` (Art 201A)
- `registrar-inspection.md` (Art 202)
- `company-returns-enforcement.md` (Art 203)
- `registrar-records-destruction.md` (Art 204)
- `strike-off.md` (Art 205)
- `strike-off-duration.md` (Art 205A)

Part 24 — Miscellaneous and Final Provisions (19 files):
- `form-of-records.md` (Art 206)
- `records-as-evidence.md` (Art 207)
- `records-offence-suspected.md` (Art 208)
- `legal-professional-privilege.md` (Art 209)
- `right-to-refuse-questions.md` (Art 210)
- `private-company-relief.md` (Art 211)
- `court-relief.md` (Art 212) — "honest and reasonable" relief
- `dissolution-void.md` (Art 213) — restoration
- `foreign-corporation-recognition.md` (Art 213A) — PIL recognition
- `public-registry-registration.md` (Art 214) — Jersey land registry
- `punishment-of-offences.md` (Art 215)
- `accessories-and-abettors.md` (Art 216)
- `court-general-powers.md` (Art 217)
- `limitation-of-liability.md` (Art 217A) — Registrar/JFSC good-faith
- `power-to-make-rules.md` (Art 218)
- `orders.md` (Art 219)
- `regulations-and-orders.md` (Art 220)
- `transitional-provisions.md` (Art 221)
- `repeal.md` (Art 223)
- `citation.md` (Art 224)

Schedules (2 files):
- `schedule-1-offences.md` (Sch 1) — penalty schedule
- `schedule-2-transitional.md` (Sch 2) — bridge from 1861 Loi

Articles index updated. All "planned cluster" markers replaced
with deep links. Status section updated to "complete".

The Companies (Jersey) Law 1991 statute wiki is now complete:
24 Parts, ~300 Articles, plus 2 Schedules, all with at least one
deep concept file. Future work moves to other Jersey statutes
(Income Tax 1961, Foundations 2009, Financial Services 1998).

## 2026-05-15 — Tax section deep files (10 files)

Filled out 10 of the tax section's stub files with deep concept
content:

- `revenue-jersey.md` — Jersey tax authority
- `company-residence.md` — corporate tax residence test
- `economic-substance.md` — 2019 substance regime
- `residence-individuals.md` — three categories of individual residence
- `distributions-and-deemed-distributions.md` — shareholder tax
- `no-capital-gains-tax.md` — what Jersey doesn't tax (CGT)
- `no-inheritance-tax.md` — what Jersey doesn't tax (IHT)
- `pillar-two.md` — MCIT / DMT 2025
- `stamp-duty.md` — narrow transaction-tax base
- `social-security.md` — Class 1/2/3 contributions
- `long-term-care.md` — LTC contribution
- `gst-international-services-entity.md` — ISE flat-fee regime
- `high-value-residency-tax.md` — 2(1)(e) bespoke regime
- `international-tax.md` — DTAs, TIEAs, CRS, FATCA, BEPS overview

Tax section now has substantive coverage of the headline regimes
and key supporting concepts. Remaining tax stubs primarily relate
to Income Tax Law 1961 article-by-article statute wiki (next batch).

## 2026-05-15 — International section deep files (4 files)

Added deep concept files to the international section:

- `crs.md` — Common Reporting Standard (multilateral automatic
  exchange)
- `fatca.md` — FATCA (US-specific automatic exchange via Model 1 IGA)
- `dtas.md` — Jersey's bilateral DTA network (UK most important)
- `tieas.md` — TIEA network for info-exchange-on-request

These were referenced as stubs from tax/index.md and tax/
international-tax.md; now substantively populated.

## 2026-05-15 — Foundations section deep files (3 files)

Filled out the foundation-section stub files:

- `council-and-guardian.md` — the dual governance structure
  (council = management; guardian = oversight)
- `qualified-member.md` — the mandatory JFSC-regulated trust-company
  representative on every foundation council
- `uses.md` — typical use cases (philanthropy, orphan SPVs, family
  governance, PTC ownership, succession, heritage)

## 2026-05-15 — Financial Regulation section deep files (8 files)

Added 8 deep concept files to the financial-regulation section:

- `jfsc-law-1998.md` — Financial Services Commission (Jersey) Law 1998
  (constituting statute of the JFSC)
- `financial-services-jersey-law-1998.md` — FS(J)L 1998 omnibus regulatory
  statute (Investment Business, TCB, FSB, GIMB, MSB)
- `banking-business-law-1991.md` — Banking Business (Jersey) Law 1991
- `collective-investment-funds-law-1988.md` — CIF Law 1988 (public funds)
- `insurance-business-law-1996.md` — Insurance Business (Jersey) Law 1996
  (Category A / B permits, captive insurance)
- `codes-of-practice.md` — JFSC Codes of Practice across regulated classes
- `licensing.md` — registration / fit-and-proper / principal-key persons
- `enforcement.md` — JFSC graduated enforcement powers (directions,
  public statements, civil financial penalties, suspension, revocation)

Financial-regulation section now substantively populated with all
principal statutes and cross-cutting operational concepts.

## 2026-05-15 — AML/CFT section deep files (6 files)

Filled the AML/CFT section's stub files:

- `proceeds-of-crime-law-1999.md` — POCL foundation statute
- `money-laundering-order-2008.md` — operative compliance obligations
- `aml-cft-handbook.md` — JFSC AML/CFT Handbook
- `sanctions.md` — Sanctions and Asset-Freezing (Jersey) Law 2014
- `moneyval.md` — Council of Europe mutual evaluations
- `schedule-2-businesses.md` — supervised-business categories (DNFBPs)

AML/CFT section now substantively populated.

## 2026-05-15 — Funds, Banking, Insurance sector deep files (14 files)

Filled out three sector sections:

Funds (7 files):
- jersey-private-fund.md, expert-fund.md, eligible-investor-fund.md,
  listed-fund.md, public-funds.md, unregulated-funds.md, aifmd-nppr.md

Banking (3 files):
- banking-business-law-1991.md (sector view), depositor-compensation.md,
  top-50-policy.md

Insurance (4 files):
- insurance-business-law-1996.md (sector view), category-a-permit.md,
  category-b-permit.md, captive-insurance.md

All three sectors now substantively populated with their key vehicle
types and structural variations.

## 2026-05-15 — Registries, Legal System, Immigration sections (15 files)

Registries (7 files): companies-registry.md, foundations-registry.md,
business-names.md, beneficial-ownership.md, vasp-register.md,
land-registry.md, charities-register.md.

Legal System (7 files): sources-of-law.md, customary-law.md,
court-of-appeal.md, privy-council.md, bailiff.md, jurats.md,
judicial-greffe.md, legal-profession.md.

Immigration & Residency (5 files): control-of-housing-and-work-law.md,
residential-status-categories.md, employment-status-categories.md,
high-value-residency.md, route-to-entitled.md.

All three sections substantively populated.

## 2026-05-15 — Use-case persona index files (7 new personas)

Created persona index files for all 7 planned use-case personas:

- `fund-counsel/index.md` — Fund counsel / GP persona
- `compliance-mlro/index.md` — Compliance officer / MLRO persona
- `family-office-adviser/index.md` — Family office / private client adviser
- `founder-entrepreneur/index.md` — Founder / entrepreneur
- `international-lawyer/index.md` — Lawyer qualified outside Jersey
- `royal-court-litigator/index.md` — Royal Court Advocate / Solicitor
- `journalist-ngo-academic/index.md` — Public-interest researcher

Each persona index sets out the canonical questions for that role
with links into the topic graph; deep Q&A files to follow as the
use-case section is built out.

Use-cases index updated to reflect new persona directories.

## 2026-05-15 — Deep use-case Q&A files (5 files)

Wrote deep operator-shaped Q&A files for fund-counsel and
compliance-MLRO personas:

Fund counsel (3 files):
- `choosing-fund-regime.md` — JPF vs Expert vs Listed vs Public
  decision tree
- `vehicle-structuring.md` — Jersey company vs LP vs unit trust
  vs cell company
- `jpf-registration.md` — JPF documents, DSP, 48-hour process

Compliance / MLRO (2 files):
- `customer-due-diligence.md` — SDD / standard / EDD with detail
  on individual / entity / trust / foundation customers
- `filing-a-sar.md` — when, how, tipping-off, consent regime

These illustrate the operator-shaped voice with cross-links into
the topic graph.

## 2026-05-15 — More deep use-case Q&A files (3 files)

Additional deep operator-shaped use-case files:

- `family-office-adviser/trust-or-foundation.md` — the central
  vehicle-choice question with cultural / tax-characterisation
  drivers
- `founder-entrepreneur/why-jersey-topco.md` — Jersey TopCo
  selection criteria including Pillar Two threshold considerations
- `international-lawyer/article-9-firewall.md` — Article 9 trust
  firewall strength and limits for foreign-lawyer use

Each covers a foundational persona question with cross-links into
the topic graph.

## 2026-05-15 — More deep persona Q&A files (2 files)

Additional deep persona Q&A files:

- `royal-court-litigator/article-51-application.md` — drafting and
  procedure for the Royal Court's principal trust application
- `journalist-ngo-academic/searching-companies-registry.md` —
  what's publicly accessible, what isn't, investigation tips

## 2026-05-15 — Income Tax Law 1961 — overview + articles index + key articles (5 files)

Started the article-by-article wiki for the Income Tax (Jersey)
Law 1961, complementing the existing concept-based tax files:

- `income-tax-law-1961.md` — statute overview covering the 24
  Parts and key concepts
- `itl-articles-index.md` — systematic articles-index scaffold
  for future expansion
- `itl-article-1.md` — Article 1 charge of income tax
- `itl-article-123.md` — Article 123 charge of tax on body
  corporate and residence test (zero-ten foundation)
- `itl-article-134a.md` — Article 134A general anti-avoidance
  rule

The article-by-article wiki is at an **early stage**; future
batches will fill out the index. The concept files in tax/ remain
the practical reference for most substance.

## 2026-05-15 — Section status updates and index cleanup

Updated 8 section index files from "stub" to "draft" status since
their referenced files have been substantively populated:

- aml-cft/index.md, financial-regulation/index.md,
  banking/index.md, immigration-residency/index.md,
  insurance/index.md, funds/index.md, international/index.md,
  registries/index.md.

Also updated aml-cft/index.md "Files in this section" listing to
remove "stub" annotations and add proper file descriptions.
