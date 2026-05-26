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
  and the scoring history.

## How the runner works

The runner is **Claude's own Agent tool** — there's no
separate Python harness. Each question in the YAML is
executed by spawning a fresh **Explore subagent** with the
following constraints:

1. **No prior context** — fresh agent invocation per question
   (no cache from the writing or grading agents).
2. **Tools restricted to read-only filesystem access** —
   the Explore subagent type provides `Read`, `Glob`,
   `Grep`, `Bash` (for searches), but explicitly excludes
   `Write` and `Edit`.
3. **Working directory fixed** to the Jersey corpus root.
4. **Prompt instructs** the agent to use *only* corpus
   files, cite every file it reads, and explicitly say
   "the corpus does not answer this question" if it can't —
   no confabulation from training data.

The orchestrator agent then **grades** each answer against
the YAML's `expected_facts` and `expected_files`. Grading
is the only step still done by the orchestrator
introspectively; an LLM-as-judge grader is the planned
next layer.

### Why subagents instead of a Python SDK harness

The Agent tool gives us everything a Python harness would:

- Fresh context per invocation (no prior-knowledge leakage);
- Tool restrictions enforced at the subagent boundary;
- Parallel execution (multiple Agent calls in a single
  message run concurrently);
- Token-cost tracking on each subagent return;
- The same model and tool stack the user actually uses.

It costs more tokens than a bare API call but gives a
realistic measure of what an agent over this corpus
actually produces — which is what we care about.

## How to run

Manually, until automated:

1. Pick a batch of questions from `coverage-questions.yaml`
   (8-10 in parallel is a comfortable batch size).
2. For each, spawn an `Explore` agent with a
   self-contained prompt — see existing eval runs in git
   history for the template.
3. Collect responses; grade each against `expected_facts`
   and `expected_files`.
4. Update the YAML, adding a dated `*-measured` line under
   each `score:` block — keep the old self-graded scores
   too for history.
5. Update the `summary:` block.
6. Commit.

### Sectioned runs — run a portion, not the whole suite

The full suite is a token burn. Most content changes touch
one section; the eval pass should match that scope.

`coverage-questions.yaml` carries a top-level `sections:`
map that lists every section, the ID prefix that flags
membership (e.g. `rt-` → residential-tenancy, `sd-co-` →
statute-depth-companies, `sd-aml-` → statute-depth-aml),
and whether the section is legacy (questions without an
explicit `section:` field, grouped by prefix convention)
or new-style (questions carry an explicit `section:`).

Typical workflow:

1. Identify which section(s) cover what you changed.
   Doctrinal-corpus edits to LLC / partnership / TMP files
   → `statute-depth-companies`. AML/CFT statute edits →
   `statute-depth-aml`. Tenancy / family / planning gap-
   fills → the relevant legacy section.
2. Filter `coverage-questions.yaml` to that section's
   ID-prefix(es) and run only those questions.
3. Run the **`sanity`** section every time as a regression
   guard — three sanity-check questions catch
   doctrinal-corpus regressions introduced by the changes.
4. Only run the full suite on the cadence in this README
   (weekly initially, monthly once stable) or when a
   cross-cutting change touches many sections.

Goal: token spend proportional to scope of change.

### Scoring

| Score | Meaning |
|---|---|
| **pass** | ≥ 80% of expected facts covered, expected files cited (or strong equivalents) |
| **partial** | 30-80% of facts covered, or right files but incomplete facts |
| **fail** | < 30% of facts covered, agent can't answer, or answer materially wrong |

A **fail** on a gap-question (e.g. `rt-rd-001` speeding,
when road traffic isn't built) where the agent correctly
refuses to confabulate is still a fail — but it's the
"good fail" we want. Honest gap-recognition is part of
the eval. The bad failure mode would be an agent
confabulating an answer to a question the corpus doesn't
support.

## Scoring history

- **v1** (2026-05-18, self-graded): baseline after
  residential-tenancy build.
- **v2** (2026-05-18, self-graded): updated after
  family-law build. Risk: self-grading by the same agent
  that wrote the content under test is circular.
- **v3** (2026-05-18, externally measured): 8/17 questions
  run via the Agent-tool runner. All 8 measured outcomes
  match v2 predictions, so the family-law and
  residential-tenancy gap-fills hold up under measurement.

## Planned improvements

- **Complete the full run** — measure the remaining 9
  questions.
- **LLM-as-judge grader** — separate grader subagent so
  the orchestrator stops doing introspective grading.
- **Trajectory capture** — record exactly which files
  each runner read, not just the ones it ultimately
  cited.
- **Cost tracking** — log tokens per question and trend
  over time.
- **Diff reports** — when a question's score changes,
  show old vs new answer side-by-side.
- **Pre-commit hook** — re-run a small smoke subset of
  the eval on any commit to `jersey/`.

## Question sources

Questions are drawn from:

- **Coverage audit gaps** (see
  [`../jersey/COVERAGE-AUDIT.md`](../knowledge/jersey/COVERAGE-AUDIT.md))
  — top-20 gaps each get representative questions;
- **Ordinary-resident personas**
  ([`jersey-resident`](../jersey/use-cases/jersey-resident/),
  [`tenant-landlord`](../jersey/use-cases/tenant-landlord/),
  [`driver-motorist`](../jersey/use-cases/driver-motorist/),
  [`parent-family`](../jersey/use-cases/parent-family/),
  [`employee-worker`](../jersey/use-cases/employee-worker/));
- **Existing professional personas** (trust officer, MLRO,
  fund counsel) — sanity check that filling resident-facing
  gaps doesn't regress the original coverage;
- **The trigger question** that prompted the audit
  ("non-paying tenant eviction") — measured as a clean
  pass in v3.

## Not yet covered

Each question that fails or is partial is a **gap target**.
Filling the corpus then turns the score green. The
coverage audit is the *input* to gap-filling; the eval is
the *measurement* of whether gap-filling has worked.
