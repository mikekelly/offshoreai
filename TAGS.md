# Tags — Canonical Taxonomy

This is the **canonical list** of tags used in the corpus. Every value in a
file's frontmatter `tags:` field must come from this list. Adding a new tag
means adding it here first, with a description.

Tags are the **primary organisational layer** for agent search. The folder
tree is a convenience; tags are how concepts cluster across folders, and an
agent traversing by tag finds related material that pure-folder navigation
would miss.

The taxonomy is grouped into **categories** below. A typical file carries
**5–10 tags** drawn from across the categories. Tags are
**lower-kebab-case**.

---

## Subject — what area of law / practice the file is in

- `trusts` — Jersey trust law (Trusts (Jersey) Law 1984 and case law)
- `foundations` — Jersey foundation law (Foundations (Jersey) Law 2009)
- `companies` — Jersey company law (Companies (Jersey) Law 1991 and
  partnership laws)
- `funds` — Jersey collective investment funds and AIFs
- `banking` — deposit-taking and banking regulation
- `insurance` — insurance underwriting and intermediation
- `tax` — Jersey tax (corporate, personal, GST, social security)
- `aml-cft` — anti-money-laundering and counter-financing-of-terrorism
- `regulation` — financial-services regulation (JFSC framework)
- `government` — constitutional and political structures
- `legal-system` — courts, sources of law, legal profession
- `immigration-residency` — housing and work status, residency
- `international` — cross-border frameworks, treaties, AEoI
- `registries` — statutory registers
- `meta` — corpus-level documents (TAGS, CONVENTIONS, glossary,
  changelog, sources)
- `insolvency` — corporate insolvency and the Bankruptcy (Désastre)
  (Jersey) Law 1990
- `contract` — Jersey contract / obligations law (Pothier, cause,
  délit / voisinage)
- `property` — Jersey real-property law (Loi (1880) sur la propriété
  foncière, hypothec, servitudes, Security Interests Law 2012)
- `employment` — Employment (Jersey) Law 2003
- `discrimination` — Discrimination (Jersey) Law 2013
- `data-protection` — Data Protection (Jersey) Law 2018 (GDPR-equivalent)
- `charities` — Charities (Jersey) Law 2014
- `residential-tenancy` — Residential Tenancy (Jersey) Law 2011
- `planning` — Planning and Building (Jersey) Law 2002
- `road-traffic` — Road Traffic (Jersey) Law 1956
- `family-law` — Jersey family law (matrimonial causes, children, civil
  partnership, adoption)
- `welfare` — social security and income support
- `crime` — criminal law and offences (distinct from `aml-cft`
  financial crime)
- `criminal-procedure` — police powers and criminal procedure (PPCE 2003)

## Jurisdiction — which offshore centre the file is about

The corpus now covers six jurisdictions. Files carry the jurisdiction
tag(s) they describe; cross-jurisdictional files carry several.

- `jersey` — Jersey (the deepest-covered jurisdiction)
- `guernsey` — Guernsey
- `cayman` — Cayman Islands
- `bermuda` — Bermuda
- `bvi` — British Virgin Islands
- `isle-of-man` — Isle of Man
- `channel-islands` — Channel Islands (Jersey + Guernsey) collectively

## Economy, industry & frontier

Tags for the economic-context, industry-state, and decay-managed
frontier layers (see `KNOWLEDGE-BASE-PRINCIPLES.md` on layer
separation).

- `economy` — a jurisdiction's economy in shape and proportion (GVA by
  sector)
- `frontier` — bleeding-edge / decay-managed developments tracked with
  `as_of` / `expected_decay`
- `financial-services-competitiveness-programme` — the Government of
  Jersey's FSCP and its "Time to Win" final report
- `digital-assets` — digital-asset / crypto activity and its regulation
- `tokenisation` — tokenised assets, digital registers, and digital
  corporate actions
- `sustainable-finance` — ESG / SFDR-adjacent sustainable-finance work
- `private-wealth` — private-wealth / family-office structuring
- `private-equity` — private-equity / carry / fund-sponsor context
- `vasp` — virtual-asset service provider registration regime

## Legal concept — cross-cutting doctrines and tests

- `fiduciary-duty` — duties owed by trustees, directors, protectors,
  enforcers, agents
- `breach-of-trust` — trustee liability for breach
- `breach-of-duty` — directors' / officers' breach of duty
- `mistake` — mistake-based remedies (set-aside, rescission)
- `undue-influence` — vitiating factor
- `sham` — sham-trust / sham-transaction analysis
- `fraud` — fraud / dishonesty doctrines
- `proper-purpose` — proper-purpose doctrine for fiduciary powers
- `disclosure` — disclosure obligations (to beneficiaries, regulators,
  courts)
- `confidentiality` — duty of confidence
- `beneficial-ownership` — equitable and BO-register concepts
- `solvency` — solvency tests (Article 61A / Article 115)
- `variation` — variation of trust / company instruments
- `interpretation` — statutory and instrument interpretation
- `limitation` — limitation of actions / prescription
- `irreducible-core` — non-excludable trustee duties

## Trust-specific concepts

- `firewall` — Article 9 firewall protection
- `reserved-powers` — Article 9A settlor-reserved-powers
- `purpose-trust` — non-charitable purpose trust
- `charitable-trust` — charitable trust
- `discretionary-trust` — discretionary beneficial interests
- `fixed-interest` — fixed beneficial interest
- `protective-trust` — Article 35 protective / spendthrift trust
- `settlor` — settlor's position / powers
- `beneficiary` — beneficiary's position / rights
- `trustee` — trustee's position / powers
- `protector` — protector role
- `enforcer` — purpose-trust enforcer role
- `letter-of-wishes` — settlor's non-binding wishes
- `perpetuity` — duration / no-perpetuity rule
- `private-trust-company` — PTC structures
- `appointment-power` — power of appointment
- `revocation-power` — power of revocation
- `momentous-decision` — Public Trustee v Cooper category 2
- `blessing` — court blessing application
- `beddoe` — Beddoe directions on trust-funded litigation
- `hastings-bass` — pre-2013 doctrine and its Jersey adaptation

## Company-specific concepts

- `cell-company` — PCC / ICC structures
- `share-capital` — issued capital, par-value / no-par-value
- `directors-duty` — Article 74 statutory and common-law duties
- `shadow-director` — *de facto* / shadow director liability
- `distribution` — Part 17 distributions and dividends
- `audit` — accounts and audit (Part 16)
- `takeover` — Part 18 takeovers and squeeze-out / sell-out
- `takeovers-panel` — Companies (Takeovers and Mergers Panel) (Jersey)
  Law 2009 and the Jersey Panel
- `scheme-of-arrangement` — Part 18A compromises and arrangements
- `merger` — Part 18B statutory merger
- `demerger` — Part 18BA demerger
- `continuance` — Part 18C continuance / redomiciliation
- `unfair-prejudice` — Part 20 member remedy
- `wrongful-trading` — Article 177 wrongful-trading liability
- `fraudulent-trading` — Article 178 fraudulent-trading liability
- `treasury-shares` — Article 58A treasury shares
- `financial-assistance` — Article 58 abolition of the rule
- `aim-listed-group` — files relevant to AIM-listed Jersey-incorporated
  plcs (operating reality, governance, disclosure cadence)
- `listed-company-governance` — listed-issuer governance topics that
  cross the Jersey-incorporation / market-rules boundary

## Tax-specific concepts

- `zero-ten` — Jersey corporate income tax structure
- `gst` — Goods and Services Tax
- `personal-tax` — personal income tax
- `marginal-relief` — Article 92AA marginal-relief computation
- `social-security` — Class 1 / Class 2 contributions
- `long-term-care` — LTC contribution
- `economic-substance` — Taxation (Companies — Economic Substance) Law 2019
- `no-cgt` — Jersey has no capital gains tax
- `no-iht` — Jersey has no inheritance tax
- `stamp-duty` — land transaction and probate stamp duty
- `pillar-two` — OECD Pillar Two / MCIT
- `large-corporate-retailer` — Article 123I 20% category
- `financial-services-company` — Article 123D 10% category

## Process — what kind of action the file covers

- `court-application` — application to the Royal Court
- `royal-court` — Royal Court procedure or jurisdiction
- `incorporation` — forming a Jersey company
- `registration` — registry filings
- `winding-up` — solvent or insolvent wind-up
- `désastre` — Jersey customary-law insolvency
- `licensing` — JFSC licensing process
- `enforcement` — regulatory or court enforcement
- `compliance` — compliance procedures
- `dispute-resolution` — litigation and adjudication
- `redomiciliation` — change of jurisdiction (in or out)
- `setting-aside` — set-aside / rescission application
- `creditors-winding-up` — creditors' winding-up under Companies Law
  Part 21
- `summary-winding-up` — solvent summary winding-up
- `forfeiture` — forfeiture of criminal property
- `confiscation` — confiscation orders (proceeds of crime)
- `restraint-orders` — pre-conviction restraint of assets
- `investigations` — criminal / regulatory investigation powers

## Cross-border concerns

- `cross-border-tax` — international tax interaction
- `forced-heirship` — civil-law forced-heirship rules
- `conflict-of-laws` — choice of law and forum
- `foreign-judgment` — recognition / enforcement of foreign judgments
- `foreign-trust` — non-Jersey-proper-law trusts in Jersey
- `matrimonial` — divorce and matrimonial-property interaction with trusts
- `succession` — succession law interaction with trusts and structures
- `extraterritorial` — extraterritorial reach of foreign rules
- `hague-trusts` — Hague Convention on Trusts 1985

## Foreign-tax-specific concerns

- `us-grantor-trust` — US grantor-trust treatment
- `us-tax` — broader US tax interaction
- `uk-tax` — UK tax interaction
- `uk-iht` — UK inheritance tax interaction
- `uk-cgt` — UK capital gains tax interaction
- `uk-non-dom` — UK non-domiciled / FIG regime interaction
- `uk-carry-reform` — UK carried-interest reform (2026)
- `crs` — Common Reporting Standard
- `carf` — Crypto-Asset Reporting Framework
- `fatca` — US FATCA Model 1 IGA
- `dac6` — EU DAC6 (cross-border reporting)

## External rule-sets (bridge-file canonical tags)

These tag bridge-files only — files that document interaction points
between Jersey-law facts and external rule-sets the corpus does not
wikify.

- `uk-takeover-code` — UK Panel on Takeovers and Mergers Code (the City
  Code) applied to Jersey-incorporated companies
- `aim-rules` — London Stock Exchange AIM Rules for Companies / for
  Nominated Advisers
- `mar` — EU/UK Market Abuse Regulation
- `qca-code` — Quoted Companies Alliance Corporate Governance Code
- `uk-corporate-governance-code` — UK Corporate Governance Code
- `fca-handbook` — UK Financial Conduct Authority Handbook touchpoints
- `dtr` — UK Disclosure Guidance and Transparency Rules

## Regulatory framework

- `jfsc` — Jersey Financial Services Commission
- `tcb` — trust company business (regulated activity class)
- `fund-services-business` — FSB regulated activity class
- `investment-business` — investment-business regulated activity class
- `general-insurance-mediation` — GIMB regulated activity class
- `money-services-business` — MSB regulated activity class
- `banking-business` — Banking Business (Jersey) Law 1991 activity class
- `deposit-taking-business` — deposit-taking business (the conduct-level
  framing the JFSC uses in the current Deposit-taking Business Code)
- `insurance-business` — Insurance Business (Jersey) Law 1996 activity
- `certified-funds` — certified-fund classification under the Certified
  Funds Code of Practice
- `alternative-investment-funds` — Jersey AIF regime / AIF Code of
  Practice
- `fit-and-proper` — JFSC fit-and-proper test
- `principal-persons` — JFSC principal-person / key-person regime
- `outsourcing` — JFSC outsourcing rules
- `change-of-control` — JFSC shareholder-controller / change-of-control
  approval regime
- `aml-handbook` — JFSC AML/CFT Handbook
- `code-of-practice` — file is primarily about a JFSC Code of Practice
- `jfsc-soft-law` — JFSC thematic reviews, public statements,
  enforcement notices, industry updates, DG speeches
- `suitability` — investment-suitability obligations under the Codes
- `conduct-of-business` — conduct-of-business standards under the Codes
- `sanctions` — sanctions and asset-freezing rules
- `sar` — suspicious-activity reporting
- `cdd` — customer due diligence
- `edd` — enhanced due diligence
- `pep` — politically exposed persons handling
- `source-of-funds` — source-of-funds verification
- `source-of-wealth` — source-of-wealth verification
- `moneyval` — Moneyval evaluation

## Document type

- `index` — section orientation document
- `articles-index` — per-statute Article enumeration
- `concept-file` — concept-driven content file
- `use-case` — persona-driven question file
- `client-cohort` — cohort-driven file describing the home-jurisdiction
  tax / structuring context for a client cohort (UK non-dom, UAE expat,
  etc.) — sibling to `use-case` (persona-driven) but cohort-driven
- `decision-surface` — cross-cutting decision aid (trigger-event map,
  comparator, decision tree) that does not fit one-concept-per-file —
  see `CONVENTIONS.md` for the shape rules
- `trigger-event` — file describing an event (regulatory change, life
  event, transactional event) that should trigger a structuring or
  advisory conversation
- `bridge-file` — short file that documents the interaction points
  between Jersey-law facts and an external rule-set the corpus does
  not wikify (AIM Rules, UK Takeover Code, MAR, FCA Handbook, etc.)
- `service-tier` — file describing a standardised product / service
  tier for a defined client segment
- `worked-example` — stylised, anonymised worked example (per the
  tenant-neutrality rule in `CONVENTIONS.md`)
- `glossary` — defined-term file
- `changelog` — change log
- `sources` — canonical sources list
- `meta-spec` — corpus convention spec

## Statute (canonical-home tag for per-statute files)

- `trusts-law-1984` — Trusts (Jersey) Law 1984
- `companies-law-1991` — Companies (Jersey) Law 1991
- `foundations-law-2009` — Foundations (Jersey) Law 2009
- `income-tax-law-1961` — Income Tax (Jersey) Law 1961
- `gst-law-2007` — Goods and Services Tax (Jersey) Law 2007
- `financial-services-law-1998` — Financial Services (Jersey) Law 1998
- `fsc-law-1998` — Financial Services Commission (Jersey) Law 1998
- `banking-business-law-1991` — Banking Business (Jersey) Law 1991
- `cif-law-1988` — Collective Investment Funds (Jersey) Law 1988
- `insurance-business-law-1996` — Insurance Business (Jersey) Law 1996
- `aif-regs-2012` — Alternative Investment Funds (Jersey) Regulations 2012
- `poc-law-1999` — Proceeds of Crime (Jersey) Law 1999
- `mlo-2008` — Money Laundering (Jersey) Order 2008
- `economic-substance-law-2019` — Taxation (Companies — Economic Substance)
  (Jersey) Law 2019
- `control-of-housing-and-work-law-2012` — Control of Housing and Work
  (Jersey) Law 2012
- `charities-law-2014` — Charities (Jersey) Law 2014
- `llp-law-2017` — Limited Liability Partnerships (Jersey) Law 2017
- `lp-law-1994` — Limited Partnerships (Jersey) Law 1994
- `ilp-law-2011` — Incorporated Limited Partnerships (Jersey) Law 2011
- `slp-law-2011` — Separate Limited Partnerships (Jersey) Law 2011

## Persona — primary user category the file serves

- `trust-officer` — trust / fiduciary officer in a Jersey TCB
- `fund-counsel` — fund formation and operation counsel
- `family-office` — family-office adviser
- `mlro` — money-laundering reporting officer / compliance officer
- `litigator` — Royal Court litigator
- `tax-adviser` — Jersey or cross-border tax adviser
- `founder` — entrepreneur / pre-IPO planner
- `journalist` — research / public-interest user
- `legal-counsel` — general legal counsel (Jersey or foreign)
- `wealth-rm` — relationship manager in a wealth-management business
  (international or domestic)
- `wealth-group-chair` — chair / board-member of a wealth-management
  group (often AIM-listed Jersey-incorporated)
- `corporate-finance-adviser` — NOMAD / broker / M&A adviser at a
  corporate-finance house
- `cco` — chief compliance officer / head of compliance at a regulated
  business
- `m-and-a-counsel` — M&A counsel (buy-side or sell-side) acting on
  Jersey-touching transactions

## Cross-cutting relevance markers

These are *audience* hints rather than subject tags — applied so an
agent serving a particular persona can surface the file even when the
file's subject is doctrinal.

- `wealth-manager-relevance` — file is materially relevant to a
  wealth-management business (RMs, advisers, CCOs, chair)
- `corporate-finance-relevance` — file is materially relevant to a
  corporate-finance / capital-markets desk
- `m-and-a-relevance` — file is materially relevant to acquirers,
  targets, or counsel on Jersey-touching M&A

## Source-specific (where the file's authority comes from)

These are loose markers; the authoritative source data is in the
`sources:` frontmatter `kind:` field.

- `case-law` — file is primarily about Royal Court / Court of Appeal /
  Privy Council case law
- `statute-wiki` — file is a per-Article entry for a statute
- `regulator-guidance` — file is primarily about JFSC handbooks / codes

---

## Adding tags

When you encounter a concept that needs a new tag:

1. Check this file carefully — many concepts already have tags.
2. If not present, add the tag in the appropriate category with a one-line
   description.
3. Apply the new tag to the file you are working on and to any obviously-
   related existing files.
4. Commit the TAGS.md addition together with the files that use it.

## Removing tags

Tags can be removed only when **no file uses them**. Run
`grep -r "tag-name" knowledge/` first.
