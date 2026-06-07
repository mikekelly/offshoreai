# Personas — Offshore AI web / product surface

Who the web UI is for, and what each of them needs *from the interface*.

This file is **distilled, not invented**. It rescues the audience material
from the landing-page design brief (originally only in an uncommitted
worktree) and grounds each persona against evidence already in the
corpus, so design decisions trace back to real users rather than
flattering fictions:

- the **Persona** category of [`TAGS.md`](../../TAGS.md) — 14 persona tags
  applied across content files, the canonical user taxonomy;
- [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) **§3**
  (Users & jobs-to-be-done) — the seven personas v1 prioritises, with
  the job each does daily and the build-depth ordering;
- [`knowledge/jersey/use-cases/`](../../knowledge/jersey/use-cases/) —
  16 persona-indexed directories of operator-shaped question files
  (`trust-officer/`, `fund-counsel/`, `compliance-mlro/`,
  `family-office-adviser/`, `royal-court-litigator/`,
  `founder-entrepreneur/`, `journalist-ngo-academic/`,
  `m-and-a-acquirer/`, `aim-listed-jersey-plc/`, and others).

## The one trait that shapes every pixel

Every primary persona shares a disposition the brief names exactly:
**sceptical of hype, allergic to being sold to, and quietly impressed by
precision.** They respond to evidence, not adjectives. They have seen a
hundred "AI-powered" pitches and were moved by none.

The design consequence is direct and it governs
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md): the interface must earn trust by
*restraint and verifiability*, not persuasion. Cited sources, dated
checks, and visible limits are the product's credibility. Chrome that
shouts undermines the very users it's trying to win. When a choice is
between impressive and credible, choose credible.

---

## Primary personas (v1 build-depth order)

These ship with real corpus depth or are next in line. They are the users
the UI is optimised for today.

## Trust officer (TCB) — fiduciary officer in a Jersey trust company business
**Context:** Works inside a regulated trust company business making daily
fiduciary decisions on real client trusts. Time-poor, personally
accountable, operating under JFSC supervision. The corpus's deepest-served
user.
**Evidence:** Strong. `trust-officer` persona tag in
[`TAGS.md`](../../TAGS.md); the lead persona in
[`PRD §3`](../../PRD-baseline-agent-v1.md) ("revenue density is high",
v1 ships *deep* coverage for this persona alone); a built-out
[`use-cases/trust-officer/`](../../knowledge/jersey/use-cases/trust-officer/)
directory with deep files on distribution/Court-blessing, Article 47
set-aside, and beneficiary information rights.
**Jobs:** Decide whether a distribution can be made; draft a Royal Court
application; run CDD on a new trust; classify under CRS/FATCA; screen
sanctions; reason through Beddoe / blessing logic.
**Needs from the UI:** An answer they can *stand behind* in front of a
client or a regulator — every assertion traceable to a cited, dated
source they can open and check. The verifier signal (is this fresh? is it
sourced?) is load-bearing, not decoration.
**Anti-persona:** A retail consumer wanting general "is offshore legal?"
content; a student wanting a textbook explainer.

## Fund counsel / GP — fund-formation and operation counsel
**Context:** Classifies and stands up fund vehicles; advises GPs on
marketing and manager regimes across jurisdictions.
**Evidence:** Moderate. `fund-counsel` persona tag;
[`PRD §3`](../../PRD-baseline-agent-v1.md) lists it second (index written,
~10 use-case stubs — *functional-but-shallow* in v1);
[`use-cases/fund-counsel/`](../../knowledge/jersey/use-cases/fund-counsel/).
**Jobs:** Classify a fund under JPF / Expert / Listed / public; check NPPR
marketing routes; reason about AIFMD (and AIFMD II) interaction;
cross-jurisdiction "where should I form my fund?" comparisons.
**Needs from the UI:** Specificity over coverage claims — "knows the JPF
48-hour route and the Cayman Private Funds Act" beats "comprehensive fund
coverage". Comparative answers need their sources legible side by side.
**Anti-persona:** Someone wanting a fund marketing brochure or a fee
quote.

## Compliance lead / MLRO — money-laundering reporting / compliance officer
**Context:** Owns AML/CFT and conduct risk at a regulated business.
Decisions are defensible-or-not; the cost of a confident-but-wrong answer
is regulatory.
**Evidence:** Moderate. `mlro` and `cco` persona tags;
[`PRD §3`](../../PRD-baseline-agent-v1.md) (index written,
functional-but-shallow);
[`use-cases/compliance-mlro/`](../../knowledge/jersey/use-cases/compliance-mlro/).
**Jobs:** SAR threshold judgement; sanctions screening; PEP onboarding;
AML Handbook checks; source-of-funds / source-of-wealth reasoning.
**Needs from the UI:** The "it knows where it stops" behaviour made
visible — when the corpus is silent, out of date, or genuinely unsettled,
the interface must *say so* plainly rather than confabulate. The four
verifier states (fresh / warn / stale / missing) exist for this user.
**Anti-persona:** Anyone wanting the tool to make the call *for* them
rather than show its working.

## Family-office adviser — adviser to HNW / UHNW families
**Context:** Coordinates cross-border wealth structuring for families with
assets and members in several jurisdictions. Long horizons, high
discretion, low tolerance for being patronised.
**Evidence:** Moderate. `family-office` persona tag;
[`PRD §3`](../../PRD-baseline-agent-v1.md) (index written,
functional-but-shallow);
[`use-cases/family-office-adviser/`](../../knowledge/jersey/use-cases/family-office-adviser/),
including a worked international-family-wealth example.
**Jobs:** HVR residency routes; succession and forced-heirship defence;
foreign-tax interaction; choosing among Jersey / Guernsey / Cayman / BVI
vehicles for a given family.
**Needs from the UI:** A calm, uncluttered surface they could read beside
a client, and answers concrete enough to act on. Generous whitespace and
typographic hierarchy do the work; no decorative motion.
**Anti-persona:** A self-directed individual seeking DIY tax avoidance.

## Partner — senior partner / practice or group leader
**Context:** The named decision-maker the brief calls "the sceptical
senior partner" — the figure whose nod-or-wince is the acceptance test for
every line of copy and every screen. Evaluates the tool's credibility on
behalf of a firm before it is trusted with client work.
**Evidence:** Moderate. Maps to the `legal-counsel`, `tax-adviser`,
`wealth-group-chair`, and `corporate-finance-adviser` persona tags in
[`TAGS.md`](../../TAGS.md) (senior, firm-level roles); the brief names this
person directly as the audience whose trust the page must earn.
**Jobs:** Assess whether this is "built by people who know our world";
decide whether to bring it into the practice; weigh credibility before
features.
**Needs from the UI:** Restraint as a signal of seriousness — an interface
that feels like a serious professional firm crossed with a well-made
software product. The first impression must read as *specialist*, not
*startup*. This persona is why the design system bans the generic
tech-gradient look outright.
**Anti-persona:** A growth-led buyer optimising for flash-demo wow.

---

## Secondary personas (corpus-served, lighter UI weight)

Served by the corpus and surfaced when their questions arrive, but not the
primary optimisation target for the web surface.

- **Royal Court litigator** (`litigator`) — Article 51 directions,
  Beddoe, blessing, set-aside.
  [`use-cases/royal-court-litigator/`](../../knowledge/jersey/use-cases/royal-court-litigator/).
- **Founder / entrepreneur** (`founder`) — TopCo structuring, economic
  substance, redomiciliation, pre-IPO planning.
  [`use-cases/founder-entrepreneur/`](../../knowledge/jersey/use-cases/founder-entrepreneur/).
- **M&A / corporate-finance counsel** (`m-and-a-counsel`,
  `corporate-finance-adviser`) — Jersey-touching transactions, AIM-listed
  Jersey plcs.
  [`use-cases/m-and-a-acquirer/`](../../knowledge/jersey/use-cases/m-and-a-acquirer/).
- **Journalist / NGO / academic** (`journalist`) — registers,
  transparency, regulatory history. Public-interest research, not
  operator work.
  [`use-cases/journalist-ngo-academic/`](../../knowledge/jersey/use-cases/journalist-ngo-academic/).

A larger set of domestic-Jersey personas exists in the corpus
(`jersey-resident`, `tenant-landlord`, `employee-worker`,
`driver-motorist`, `parent-family`) reflecting the corpus's full
six-jurisdiction breadth. They are **not** web-surface targets today — the
product is positioned to the professional finance audience above — but
they are real corpus users and are flagged here so the distinction stays
honest.

---

## What this means for the UI (the through-line)

Across every primary persona the same need recurs: **answers they can
verify and limits they can see.** The interface's job is to get out of the
way and let cited, dated substance do the persuading. That single
requirement is the spec the design system serves — see
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md), which traces its restraint
decisions back to these users.
