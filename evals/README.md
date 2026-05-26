---
title: Coverage Evals — Offshore AI
status: draft
last_verified: 2026-05-26
---

# Coverage Evals

This directory holds **test question sets** used to measure how
well the offshoreai custom agent answers real user questions —
both for tracking coverage over time and for catching regressions
when content changes.

## Files

- [`coverage-questions.yaml`](coverage-questions.yaml) — the
  tracked test set. Each entry is a question, the persona that
  asks it, the expected answer characteristics (`expected_facts`,
  `expected_files`), optional `stretch_facts` for bonus depth,
  and the scoring history.
- [`adversarial-citations.yaml`](adversarial-citations.yaml) —
  questions designed to probe honesty-under-pressure (does the
  agent confabulate when asked about provisions that don't
  exist?). Uses a different rubric schema (`correct_response_shape`).
- [`showcase.yaml`](showcase.yaml) — demonstration-quality bar
  set for landing-page / external-pitch use.
- [`baselines/`](baselines/) — per-run output artifacts
  (answer.md, trajectory.json, verdict.yaml, summary.yaml).

## Architecture

```
You run:                          /run-evals --suite <yaml> --ids <id1,id2,...>
                                  │
Slash command parses, validates,  ▼
spawns subagents in parallel:     spawned via Claude Code Agent tool
                                  │
                                  ├── eval-manager subagent ─── candidate dispatched via
                                  │      (per question)          `pnpm -F @offshoreai/agent
                                  │                                query --question-id ...`
                                  │
                                  │   For each question, the
                                  │   subagent:
                                  │     1. Reads question entry from suite YAML
                                  │     2. Dispatches the candidate (SDK custom agent)
                                  │     3. Verifies citations against the corpus
                                  │     4. Grades against the rubric (per-dimension)
                                  │     5. Optionally appends `stretch_facts` with
                                  │        provenance (scope: ≤2 promotions per question,
                                  │        append-only, conservative bias)
                                  │     6. Writes `<output_dir>/<id>.verdict.yaml`
                                  │     7. Reports a one-line status back
                                  │
Orchestrator aggregates verdicts, ▼
writes summary.yaml.              `<output_dir>/summary.yaml`
```

Two distinct billing paths:

- **Candidate (the offshoreai SDK custom agent)** — API-billed.
  Same code path as the production web agent (`packages/agent/src/
  runtime.ts`). One per question.
- **Eval-manager subagent (grader + verifier + rubric maintainer)** —
  subscription-billed via Claude Code. One per question.

The slash command lives at `.claude/commands/run-evals.md`. The
subagent definition lives at `.claude/agents/eval-manager.md`.
Both are loaded on Claude Code session start; if you create or
edit them during a session, restart the session before invoking.

## How to run

### 1. Default — the smoke set (9 questions, ~5 min)

**This is the default run.** Use it as the minimum quality gate
on every iteration.

The smoke set is curated to cover the load-bearing surfaces of
the corpus in one batch. Membership: any question with
`smoke: true` in its body in `coverage-questions.yaml`.

```
/run-evals
```

That's it — with no args, `/run-evals` resolves to
`--suite evals/coverage-questions.yaml --smoke` and runs the
entire smoke set. Equivalent verbose form:

```
/run-evals --suite evals/coverage-questions.yaml --smoke
```

| Surface | Question ID | File |
|---|---|---|
| Trusts (Art 47 set-aside) | `sn-001` | coverage-questions.yaml |
| AML/CFT (MLO CDD) | `sn-002` | coverage-questions.yaml |
| Funds (JPF vs Expert Fund) | `sn-003` | coverage-questions.yaml |
| LLC (Art 47 modifiable duties) | `sd-co-001` | coverage-questions.yaml |
| CFT statute (Terrorism Art 19/21) | `sd-aml-001` | coverage-questions.yaml |
| Tax (zero-ten + Pillar Two) | `sm-tax-001` | coverage-questions.yaml |
| Cross-jurisdictional (PE fund choice) | `sm-xjur-001` | coverage-questions.yaml |
| Companies Law (Art 115 solvency) | `sm-co-001` | coverage-questions.yaml |
| Adversarial / honesty regression | `adv-nonexistent-llc-article` | adversarial-citations.yaml |

The adversarial smoke ID currently has a different schema
(`correct_response_shape` rather than `expected_facts`); the
eval-manager subagent handles both formats but the orchestrator
treats it as a separate batch when grading the full smoke.

**Editorial policy:** keep the smoke set at ~9 questions. Add a
new question only when a new load-bearing surface emerges (a
flagship statute, a new product class). If you're tempted to add
a tenth, replace something.

### 2. Section-specific runs (when content was touched)

When a change touches one section deeply (e.g. you added
substantial content to AML/CFT statutes), run that section's
questions **in addition to** the smoke set — not instead.

Each section is declared in the top-level `sections:` map of
`coverage-questions.yaml`. Filter by the section's ID prefix:

```
/run-evals --section statute-depth-aml
```

The smoke set is always the regression guard for any
section-specific run — run both.

### 3. Full suite (rare — explicit opt-in)

The full suite (everything in `coverage-questions.yaml` plus
everything in `adversarial-citations.yaml`) runs only on the
documented cadence:

- **Weekly** while content velocity is high (current state).
- **Monthly** once content velocity drops.
- **On-demand** for cross-cutting changes that touch many sections
  (frontmatter-spec migration, tags taxonomy revision,
  corpus-loader tooling change).

**Don't run the full suite "to be safe".** It's expensive and the
smoke set plus the relevant section already give the signal that
matters. If you find yourself reaching for the full suite often,
ask whether the smoke set is missing a surface — extending smoke
is cheaper than running full.

## Scoring

| Score | Meaning |
|---|---|
| **pass** | ≥ 80% of expected facts covered, citations supported |
| **partial** | 30-80% of facts covered, OR all present with one material error, OR partial citation issues |
| **fail** | < 30% of facts covered, OR agent can't answer, OR materially wrong answer |

A **fail** on a gap-question where the agent correctly refuses
to confabulate is still a fail — but it's the "good fail" we
want. Honest gap-recognition is part of the eval. The bad failure
mode would be an agent confabulating an answer to a question the
corpus doesn't support.

## Two-tier rubric — `expected_facts` and `stretch_facts`

`expected_facts` is the **must-cover** bar for substance PASS.
Hand-curated; humans own this. Edits to `expected_facts` are
load-bearing because they shift the PASS threshold — change
them deliberately, not casually.

`stretch_facts` is the **bonus-depth** tier. Covering them lifts
the verdict's notes and the `stretch:` dimension score but their
absence doesn't drop the verdict to PARTIAL. They are populated
two ways:

1. **By humans** — editorial decision after observing what good
   answers reliably surface.
2. **By the eval-manager subagent** — strictly scoped:
   append-only on `stretch_facts`, ≤2 promotions per question
   per run, with provenance comments. Conservative bias — most
   runs add nothing. Promotion criteria: accurate (verified
   citation), valuable (Jersey-substantive), generalisable
   (different retrieval path would also surface), not redundant
   with existing facts.

Provenance comments take the form:

```yaml
stretch_facts:
  - "Existing entry"
  # added by eval-manager 2026-05-26T13:39:00Z (run-id: 2026-05-26-smoke)
  - "Newly promoted fact"
```

A human reading the YAML can tell which entries are hand-curated
vs subagent-promoted, and remove any that prove path-dependent
or noise.

## System-prompt provenance

Each `<id>.trajectory.json` carries:

```json
"meta": {
  "systemPrompt": {
    "presetName": "claude_code",
    "source": "prompts/system.md",
    "appendBytes": 34672,
    "appendSha256": "8094dc1b6b556f6b"
  },
  "sessionId": "..."
}
```

This lets you cross-check across runs and across harnesses that
the candidate received an identical system prompt — and lets a
developer inspect the candidate's full session JSONL at
`~/.claude/projects/<encoded-cwd>/<sessionId>.jsonl` when
debugging.

## Question sources

Questions are drawn from:

- **Coverage audit gaps** (see
  [`../knowledge/jersey/COVERAGE-AUDIT.md`](../knowledge/jersey/COVERAGE-AUDIT.md))
  — top-20 gaps each get representative questions
- **Ordinary-resident personas** (tenant-landlord,
  driver-motorist, parent-family, employee-worker, …)
- **Professional personas** (trust officer, MLRO, fund counsel,
  …) — sanity check that resident-facing gap-fills don't regress
  the original offshore-finance coverage
- **Statute-depth questions** — per-Article navigation through
  the per-Article wikis (LLC 2018, Terrorism 2002, etc.)

## Question file conventions

Each entry in `coverage-questions.yaml`:

```yaml
- id: <unique-id>
  section: <section-name>             # see top-level sections: map
  smoke: true                         # optional; flags membership in default smoke set
  persona: <persona-name>
  asked_by: <role>
  question: "..."
  expected_facts:                     # must-cover for PASS (substance)
    - "..."
  expected_files:                     # must-cite for PASS (citation-recall)
    - "knowledge/jersey/..."
  stretch_facts:                      # bonus depth (optional)
    - "..."
  score:
    YYYY-MM-DD-measured: <pass|partial|fail>  # one line per measured run
```

The `score:` block is append-only — never delete a measured line.
Lets you trace regressions back through history.

## Direct dispatch (no orchestration)

If you want to invoke a single candidate directly without
grading — useful for debugging an individual answer — the CLI is:

```
pnpm -F @offshoreai/agent query -- \
  --question-id <id> \
  --eval-suite evals/coverage-questions.yaml \
  --output-dir /tmp/eval-out/ \
  --question "..."
```

This is what the eval-manager subagent invokes per question. It
writes `<id>.answer.md` + `<id>.trajectory.json` with full
provenance metadata; you can read those directly.

## Scoring history

See per-question `score:` blocks for full per-run history. The
batch-level history is in the `summary:` block at the bottom of
`coverage-questions.yaml`.

Recent landmarks:
- **2026-05-19** — first offshoreai-agent showcase baseline (11/14 PASS).
- **2026-05-26 (morning)** — full 8-question smoke through
  offshoreai-agent harness (then SDK eval-runner). 8/8 PASS, $4.62.
- **2026-05-26 (afternoon)** — first `/run-evals` orchestration
  test (eval-manager subagent). 2 questions, mixed signal
  (1 PASS / 1 PARTIAL on candidate variance), 2 stretch_facts
  promoted on sm-tax-001.

## Planned improvements

- Auto-load the smoke ID list from the suite's `smoke: true`
  flags so we don't have to enumerate them in the slash command
  invocation.
- A `--full` flag for the full suite.
- A `--section <name>` flag for section-specific runs.
- LLM-as-judge meta-grader: periodically grade the grader's
  judgments against a held-out gold-standard set, to detect
  grader drift.
- Diff reports — when a question's score changes, show old vs
  new answer side-by-side automatically.
