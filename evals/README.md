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

There are **three eval scopes**, in increasing token cost.
**Always pick the smallest scope that gives you the signal
you need.** Default is smoke; full-suite is an explicit
opt-in, not the safe choice.

### 1. Default — the smoke set (9 questions, ~1 batch)

**This is the default run.** Use it as the minimum quality
gate on every iteration. Token cost is one parallel Agent
batch; wall-clock target ~3 minutes.

The smoke set is declared at the top-level
`default_smoke_set:` block in `coverage-questions.yaml`.
Membership: any question with `smoke: true` in its body.
The set is curated to cover the load-bearing surfaces in
one batch:

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

### Harness identity — important

Smoke runs through the **`offshoreai-agent` harness** (the production
agent: MCP corpus tools + citation verifier + the system prompt at
[`prompts/system.md`](../prompts/system.md)).

```
pnpm -F @offshoreai/agent eval --harness offshoreai-agent \
  --suite evals/coverage-questions.yaml \
  --ids sn-001,sn-002,sn-003,sd-co-001,sd-aml-001,sm-tax-001,sm-xjur-001,sm-co-001 \
  --verify
```

Plus the adversarial smoke ID (`adv-nonexistent-llc-article` in
`adversarial-citations.yaml`) in the same batch.

There are also two control harnesses you can run against the smoke set
to measure the production agent's lift:
- `claude-p` — `claude -p --bare --system-prompt-file prompts/system.md`,
  same system prompt as offshoreai-agent but only Read/Glob/Grep/Bash
  filesystem tools (no MCP corpus tools, no citation verifier).
- `explore-subagent` — Claude Code's in-session `Agent` tool with
  `subagent_type: "Explore"`. Used for quick in-session checks during
  dev work. **Not a substitute for the smoke harness** — it lacks both
  the MCP corpus tools AND `prompts/system.md` (it gets only the
  prompt you write in your `Agent` tool call).

Procedure for the default smoke run:

1. Run the eval-runner CLI with the `--harness offshoreai-agent` form
   above. The runner spawns each question through the production
   agent, captures the trajectory (tool calls + token usage +
   system-prompt provenance) per question, and writes results to
   `evals/baselines/<date>-<label>/`.
2. Grade each against its `expected_facts` / `expected_files` (or
   `correct_response_shape` for the adversarial).
3. Update the dated `*-measured` line under each question's `score:`
   block — use `2026-MM-DD-measured` (no `-smoke` suffix; the harness
   is the load-bearing axis, recorded in the trajectory).
4. If anything fails or partials, decide: regression or known gap?
   Regressions block the commit; known gaps go in the changelog.
5. Commit.

**Editorial policy:** add a question to the smoke set only
when a new load-bearing surface emerges (a flagship
statute, a new product class). Keep the smoke set at ~9 —
if you're tempted to add a tenth, replace something.

### 2. Section-specific runs (when content was touched)

When a change touches one section deeply (e.g. you added
substantial content to AML/CFT statutes), run that
section's questions **in addition to** the smoke set —
not instead.

Each section is declared in the top-level `sections:` map
of `coverage-questions.yaml`. Filter by the section's ID
prefix (e.g. `sd-aml-*` for the AML statute-depth section).

The smoke set is always the regression guard for any
section-specific run.

### 3. Full suite (rare — explicit opt-in)

The full suite (everything in `coverage-questions.yaml` +
everything in `adversarial-citations.yaml`) runs only on
the documented cadence:

- **Weekly** while content velocity is high (current state).
- **Monthly** once content velocity drops.
- **On-demand** for cross-cutting changes that touch many
  sections (frontmatter-spec migration, tags taxonomy
  revision, corpus-loader tooling change).

**Don't run the full suite "to be safe".** It's expensive
and the smoke set plus the relevant section already give
the signal that matters. If you find yourself reaching for
the full suite often, ask whether the smoke set is missing
a surface — extending smoke is cheaper than running full.

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
