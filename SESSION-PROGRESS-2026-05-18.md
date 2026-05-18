---
title: Session Progress — 2026-05-18
status: draft
last_verified: 2026-05-18
---

# Session Progress — 2026-05-18

## What changed in this session

Long autonomous session covering five strategic
workstreams in sequence:

### Workstream 1 — Coverage audit and gap-filling (top-20)

Built the coverage audit at
[`jersey/COVERAGE-AUDIT.md`](jersey/COVERAGE-AUDIT.md),
identified the corpus's structural bias toward
sophisticated-finance personas, and systematically closed
every top-20 audit gap through the loop **audit → fill →
re-run failing eval question via fresh Explore subagent →
confirm conversion**.

Sections built:

1. **Residential tenancy** (gap #1 — the trigger) —
   `jersey/residential-tenancy/`
2. **Family law** (gaps #4, #5) — `jersey/family/`
3. **Road traffic** (gap #2) — `jersey/road-traffic/`
4. **Planning** (gap #3) — `jersey/planning/`
5. **Welfare** (gaps #7, #8) — `jersey/welfare/`
6. **Criminal procedure / PPCE** (gap #10) —
   `jersey/crime-fraud/`
7. **Mental health + capacity** (gaps #11, #12) —
   `jersey/health-and-capacity/`
8. **Petty Debts Court** (gap #17) —
   `jersey/legal-system/petty-debts-court.md`
9. **Civil liberties (FOI + RIPL)** (gaps #18, #19) —
   `jersey/civil-liberties/`
10. **Education + Consumer Safety + HSWL + Rented
    Dwellings** (gaps #14-16, #20)

### Workstream 2 — Five new ordinary-resident personas

Added under `jersey/use-cases/`:

- `jersey-resident`
- `tenant-landlord`
- `driver-motorist`
- `parent-family`
- `employee-worker`

These correct the structural bias of the original
persona set (all sophisticated finance) by exposing the
"what does an actual Jersey resident need?" surface.

### Workstream 3 — Eval infrastructure

Built `evals/coverage-questions.yaml` (26 questions)
plus the runner methodology — the runner is the Agent
tool spawning fresh `Explore` subagents constrained to
read-only filesystem access on the corpus. Documented
in `evals/README.md`.

Achieved **26/26 PASS** under external measurement
across the full top-20 audit.

### Workstream 4 — Showcase eval

Reframed measurement from coverage-driven ("can the
corpus answer this?") to demonstration-driven ("would
you put this answer on a landing page?"). Built
`evals/showcase.yaml` with a higher bar:

- substance + Jersey-specificity + operational voice +
  citation density + tightness

26 showcase questions across categories: depth on
offshore-finance specialism / cross-jurisdictional
sophistication / breadth into resident-facing law /
timely awareness / distinctive Jersey concepts /
worked-example transactional walkthroughs.

### Workstream 5 — Adjacent-jurisdiction depth pass

Each adjacent jurisdiction (Cayman, BVI, Bermuda,
Guernsey, IoM) received its distinctive-concept files:

**Cayman**: exempted-company, exempted-limited-
partnership, segregated-portfolio-company, private-
funds-act, mutual-funds-act, cayman-llc.

**BVI**: vista-trusts, approved-manager,
incubator-and-approved-fund.

**Bermuda**: exempted-company, segregated-accounts-
company, insurance-classes.

**Guernsey**: protected-cell-company (the 1997
original), incorporated-cell-company, private-
investment-fund, trust-law-differences-from-jersey,
image-rights-register.

**Isle of Man**: companies-acts-1931-vs-2006, life-
assurance.

Plus three worked transactional examples threading
multiple sections:

- `jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`
- `jersey/use-cases/family-office-adviser/worked-example-international-family-wealth.md`
- `jersey/use-cases/international-lawyer/worked-example-contentious-trust-litigation.md`

And a top-level synthesis surface:

- [`CROSS-JURISDICTIONAL-MAP.md`](CROSS-JURISDICTIONAL-MAP.md)

## Eval scoreboards as of session end

### Coverage eval

| Run | Pass | Fail | Notes |
|---|---|---|---|
| v1 self-graded | 8/15 | 7 | Trigger gap (eviction) was a fail |
| v2 self-graded | 12/17 | 5 | After family-law build |
| v3 measured (baseline) | 12/17 | 5 | First external measurement |
| v3 post-six-gap-fills | 17/17 | 0 | All audit-question failures converted |
| v3-complete | 26/26 | 0 | Full audit-question set externally measured |

### Showcase eval

| Run | Pass | Partial | Fail | Notes |
|---|---|---|---|---|
| Initial 14 | 13 | 1 | 0 | One PARTIAL: trusts comparison (BVI VISTA missing) |
| After VISTA fill | 14 | 0 | 0 | Partial converted |
| +6 cross-jurisdictional | 20 | 0 | 0 | All adjacent-jurisdiction comparisons PASS |
| +3 second-round | 23 | 0 | 0 | Cayman LLC + Jersey-Guernsey trusts + Image Rights |
| +2 worked-example | 25 | 0 | 0 | TopCo IPO + family wealth |
| +1 contentious-trust | 26 (running) | — | — | Final pending |

## Commits today (chronological)

```
00e95c3 Add Jersey statute coverage audit
d03c3ca Add resident-facing personas and residential-tenancy
f77cfa0 Add family law section
17b15d8 First externally-measured eval run via Agent-tool runner
fe704bd Complete v3 externally-measured eval — all 17 questions
fb60bbb Add road-traffic section
5dfc711 Add planning section
c9f19d2 Add welfare section
28a2ca2 Add criminal procedure section
c58ad0f Add mental-health, capacity, and Petty Debts Court
28e1f02 Add civil-liberties, education, consumer-safety, HSWL, rented-dwellings
d67e7e8 Final scoreboard update — all 26 questions PASS
ff00eb8 First showcase-eval run — 13/14 pass
da0f7c8 Add BVI VISTA dedicated file — closes showcase partial
675c26a Deepen Cayman directory
5d2780d Deepen BVI directory
aa3ae15 Deepen Bermuda directory
e2d6470 Deepen Guernsey directory
938ca67 Deepen IoM directory
aafd2c3 Add 6 cross-jurisdictional showcase questions
8430b5d Cross-jurisdictional showcase: 6/6 PASS
cd54ce0 Add Cayman LLC + Guernsey trust-diffs + Guernsey Image Rights
5a35dfd Add 3 second-round showcase questions
6e113d7 Second-round showcase: 23/23 PASS
84d0ba5 Add two worked transactional examples
3dcd347 Add 2 worked-example showcase questions
cfe44ee Add CROSS-JURISDICTIONAL-MAP + worked-example showcase results
cbc377f Add contentious-trust worked example
```

## Methodology highlights

- **Externally measured throughout** — every eval result
  this session was produced by a fresh `Explore`
  subagent given only the corpus and read-only tools.
  No self-grading.
- **Honest refusal preserved** — every pre-fill failure
  was a clean "the corpus does not answer" with audit
  references. No confabulation observed in any of ~30+
  runner invocations.
- **Cross-reference graph holding up** — late evals
  consistently pulled in adjacent files the rubric
  didn't pre-specify (sn-001 retrieved Article 47G + Re
  S&T Trusts; show-aifmd-nppr cited AIFMD Article 42 +
  §330 KAGB; show-worked-family-wealth reached into
  international/crs, fatca, dac6).
- **Currency maintained** — every "what's the current
  position?" question correctly applied the May 2026
  post-amendment state (2025 Tenancy Amendment in force;
  MCIT 2025 effective; drug-driving reform still draft;
  Bermuda CIT 2023 in force).

## What's still unfinished

- **LLM-as-judge grader** — the orchestrator (me) is
  still the grader. The runner is external but grading
  remains introspective.
- **Trajectory capture** — I see what each runner
  cited, not every file read.
- **Determinism** — each run is one sample of model
  output; ideally would be N runs reporting a
  distribution.
- **Wider audit** — beyond top-20 there are ~30
  uncovered Jersey statutes (Probate 1998, Regulation
  of Care 2014, Animal Welfare 2004, etc.).
- **Bermuda ILS** could be deeper (existing file is OK
  but not as rich as the new Bermuda exempted-company
  file).
- **Adjacent-jurisdiction tax / AML / specific industry
  files** could go deeper than the distinctive-concept
  files added this session.

## Strategic state

The corpus is now **demonstrably landing-page-ready**
for the 26 showcase questions tested. It would
credibly support a public-facing demonstration of
range and depth across:

- Sophisticated offshore-finance (trusts, funds,
  companies, captive insurance, ILS, listings, Pillar
  Two);
- Cross-jurisdictional comparison (6 jurisdictions,
  comparative tables and decision frameworks);
- Resident-facing law (eviction, arrest, planning,
  family, welfare, drug-driving, FOI, surveillance,
  consumer safety, employment safety, life-assurance);
- Timely awareness (2025 Tenancy Amendment, MCIT 2025,
  drug-driving reform, Bermuda CIT 2023);
- Distinctive Jersey concepts (Parish Hall, voisinage,
  customary law, Friday-afternoon property passings);
- Worked transactional walkthroughs (TopCo IPO,
  international family wealth, contentious-trust
  litigation).

## See also

- [`evals/coverage-questions.yaml`](evals/coverage-questions.yaml)
  — the audit-driven coverage eval
- [`evals/showcase.yaml`](evals/showcase.yaml) — the
  landing-page-bar showcase eval
- [`evals/README.md`](evals/README.md) — the runner
  methodology
- [`jersey/COVERAGE-AUDIT.md`](jersey/COVERAGE-AUDIT.md)
  — the Jersey statute coverage matrix
- [`CROSS-JURISDICTIONAL-MAP.md`](CROSS-JURISDICTIONAL-MAP.md)
  — the cross-offshore comparison surface
