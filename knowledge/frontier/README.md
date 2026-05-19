---
title: Frontier — Tracking Current Developments
status: standing-discipline
last_verified: 2026-05-18
---

# Frontier — Tracking Current Developments

## What this directory is

The doctrinal corpus (the `jersey/`, `cayman/`, `bvi/`,
`bermuda/`, `guernsey/`, `isle-of-man/` directories)
captures what the law **is** — statutes, case law, the
mechanics of structures. Doctrinal files have long shelf
life: they update when the law changes, but the
underlying concepts are stable.

This directory captures what's **in motion** — recent
consultations, pending reforms, market practices that
have shifted in the last 12-18 months, regulator pronouncements,
industry-body data, evolving structures.

Frontier files have **explicit decay**:

- `as_of:` frontmatter showing when the file was assembled;
- `expected_decay:` showing when the content is likely to
  be stale enough to need refresh;
- `status:` indicating the lifecycle stage (consultation /
  draft / in force / superseded).

Frontier files **link out** to primary sources
(consultation papers, ministerial decisions, regulator
publications, finance-industry reports) rather than
restating them in full.

## Why this matters

A senior practitioner doesn't just want to know "what's
the statute?" — they want to know:

- What's the JFSC currently consulting on?
- What changed last quarter that competitors are
  already pitching?
- Which fund structures are gaining market share right
  now?
- Where is regulation moving — and how fast?

The doctrinal corpus answers the first kind of question
beautifully. The frontier section is where the second
kind lives.

## Pattern

A frontier file looks roughly like:

```yaml
---
title: ...
status: in-force-2026-04-06   # or draft / consultation / pending
as_of: 2026-05-18
expected_decay: 2026-11-18    # 6 months typical
sources:
  - title: primary source
    url: ...
    accessed: 2026-05-18
    kind: legislation | regulator | industry-body | law-firm-commentary
---

# Title

## What this is
Quick framing.

## Where it stands (as of [date])
The current state with explicit dates.

## What it changes
What is materially different from the prior position.

## What practitioners are doing about it
The operational response — restructurings, deferrals,
elections — that have emerged in market.

## What to watch for next
Pending milestones with dates.

## Cross-references
Links into the doctrinal corpus for the underlying
framework.
```

## Discipline

- **Refresh on cadence** — at least every 6 months for
  each file. Mark superseded items rather than deleting.
- **Date everything** — every claim has a date attached.
- **Cite primary sources** — consultation papers, statutory
  instruments, regulator letters, named industry reports.
- **No anonymous "market practice" claims** — either cite
  named law firms / accountants, or flag as "general
  market understanding".
- **Distinguish status** — "consultation" ≠ "draft" ≠ "in
  force" ≠ "effective date 2026-MM-DD".
- **Keep doctrinal content out** — the underlying
  mechanics belong in the doctrinal corpus; frontier
  files are about what's moving.

## Current frontier files

- [`uk-carried-interest-reform-2026.md`](./uk-carried-interest-reform-2026.md)
  — the new UK carry regime in force from 6 April 2026
- [`aifmd-ii-april-2026.md`](./aifmd-ii-april-2026.md) —
  AIFMD II requirements effective 16 April 2026
- [`continuation-funds-and-gp-led-secondaries.md`](./continuation-funds-and-gp-led-secondaries.md)
  — the dominant PE liquidity trend
- [`tokenisation-jersey-2026.md`](../jersey/frontier/tokenisation-jersey-2026.md)
  — Jersey's evolving digital-assets posture
- [`sfdr-2-and-sustainable-finance.md`](../jersey/frontier/sfdr-2-and-sustainable-finance.md)
  — SFDR 2.0 proposal + Channel Islands implications
- [`jersey-finance-industry-2026.md`](../jersey/frontier/jersey-finance-industry-2026.md)
  — JFSC strategy 2026-2030 + Jersey Finance chairman's
  outlook + Guernsey AUM data

## Standing tasks

- [ ] Re-verify each file on or before its
  `expected_decay` date
- [ ] Add new frontier files as live consultations open
- [ ] Tag superseded content and update doctrinal corpus
  when frontier content moves into stable law
