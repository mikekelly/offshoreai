---
title: Coverage Evals — Offshore AI
status: draft
last_verified: 2026-05-18
---

# Coverage Evals

This directory holds **test question sets** used to measure
how well the knowledge graph answers real user questions —
both for tracking coverage over time and for catching
regressions when content changes.

## Files

- [`coverage-questions.yaml`](coverage-questions.yaml) —
  the tracked test set. Each entry is a question, the
  persona that asks it, the expected answer characteristics
  (what facts should appear, what files should be cited),
  and the current scoring.

## How to run

This is **not yet a programmatic harness** — it's a tracked
question set that an agent can answer against the corpus.
The intended workflow:

1. Periodically (e.g. weekly), point an agent at the
   `jersey/` corpus only and ask each question;
2. Compare the agent's answer to the expected characteristics;
3. Score each question:
   - **Pass** — the agent's answer covers the expected
     facts and cites the right files;
   - **Partial** — some expected facts present, others
     missing;
   - **Fail** — the agent cannot answer, or the answer is
     materially wrong;
4. Update `coverage-questions.yaml` with the date and
   score;
5. Track trend over time — passes should rise as gaps are
   filled; new failures indicate either new gaps or
   regressions.

A programmatic harness is a planned follow-up: scripted
agent invocation, automated grading by a stronger model
checking for the expected facts, dashboards over time.

## Question sources

Questions are drawn from:

- **Coverage audit gaps** (see
  [`../jersey/COVERAGE-AUDIT.md`](../jersey/COVERAGE-AUDIT.md))
  — top-20 gaps each get representative questions;
- **Ordinary-resident personas**
  ([`jersey-resident`](../jersey/use-cases/jersey-resident/),
  [`tenant-landlord`](../jersey/use-cases/tenant-landlord/),
  [`driver-motorist`](../jersey/use-cases/driver-motorist/),
  [`parent-family`](../jersey/use-cases/parent-family/),
  [`employee-worker`](../jersey/use-cases/employee-worker/));
- **Existing professional personas** (trust officer, MLRO,
  etc.) — sanity check that filling resident-facing gaps
  doesn't regress the original coverage;
- **The trigger question** that prompted the audit
  ("non-paying tenant eviction") — this should now be a
  clean pass.

## Scoring conventions

- **Pass**: answer covers ≥ 80% of expected facts and
  cites the right files;
- **Partial**: 30–80% coverage, or right files cited but
  facts incomplete;
- **Fail**: < 30% coverage, can't answer, or materially
  wrong.

## Not yet covered

Each question that fails or is partial is a **gap target**.
Filling the corpus then turns the score green. The
coverage audit is the *input* to gap-filling; the eval is
the *measurement* of whether gap-filling has worked.
