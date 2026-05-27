---
description: Run a batch of eval questions through the offshoreai SDK custom agent and aggregate verdicts. Each question runs in parallel via an `eval-manager` subagent that dispatches the candidate, verifies, grades, optionally evolves the rubric, and writes verdict.yaml. With no arguments, runs the default smoke set.
argument-hint: [--suite <path>] [--ids <id1,id2,...> | --smoke | --section <name>] [--output <dir>]
---

You are running `/run-evals`. The args (from `$ARGUMENTS`):

```
$ARGUMENTS
```

## What you do

1. **Parse the args.** All are optional — defaults below.

   - `--suite <path>` — repo-relative path to an eval suite YAML.
     **Default:** `evals/coverage-questions.yaml`.
   - `--ids <id1,id2,...>` — comma-separated question IDs to run (no spaces).
   - `--smoke` — shorthand for "run every question with `smoke: true` in the suite" (the default smoke set). This is the **default behaviour when no `--ids` and no `--section` is given**.
   - `--section <name>` — run every question whose `section:` field matches.
   - `--output <dir>` — output directory for artifacts.
     **Default:** `evals/baselines/<YYYY-MM-DD>-<scope-label>-<random-4>/` where `<scope-label>` is `smoke` / `section-<name>` / `ids-<n>` depending on which selector resolved.

   Selector precedence: `--ids` > `--section` > `--smoke` > default-smoke. Stop with an error message if more than one selector is given.

   **No-args call** (`/run-evals` with nothing): defaults to `--suite evals/coverage-questions.yaml --smoke`. This is the recommended routine smoke run.

2. **Resolve the question ID list.**
   - `Read` the suite YAML.
   - **`--ids` form**: validate each requested ID exists in `questions:`. If any missing, list them and stop.
   - **`--smoke` form** (or default): collect every question with `smoke: true`. **Also** look at the suite's `default_smoke_set:` block (in `coverage-questions.yaml`) — it may list IDs in OTHER suite files (e.g. `adv-nonexistent-llc-article` in `adversarial-citations.yaml`); IDs from other files go to a separate parallel batch.
   - **`--section` form**: collect every question whose top-level `section:` field equals the arg. Stop with an error if no matches.

   The resolved list goes into `<output_dir>/summary.yaml` as `run.ids: [...]`.

3. **Create the output directory.**
   - `mkdir -p` the resolved output path.
   - Resolve the worktree's repo root (the directory you're running in is the worktree root).

4. **Spawn eval-manager subagents in parallel.**
   - Use the **Agent tool** to spawn one `eval-manager` subagent per question ID. **Send all of them in a single message with multiple Agent tool calls** so they run concurrently.
   - The Agent tool's `description` should be `Eval <question_id>`.
   - The `prompt` for each subagent should include:
     - `question_id`
     - `eval_suite_path` (the `--suite` arg, repo-relative)
     - `output_dir` (the resolved output directory, repo-relative)
     - `repo_root` (the absolute path to the worktree root)
   - **Batch size cap**: 8 subagents per parallel batch. If more than 8 IDs were requested, run in waves of 8.

5. **Wait for all subagents to complete.**
   - Each subagent's return message will be a one-line status (per the `eval-manager` spec) and will have written `<output_dir>/<question_id>.verdict.yaml` to disk.

6. **Aggregate verdicts.**
   - `Read` each `<output_dir>/<question_id>.verdict.yaml`.
   - Compute totals: `pass`, `partial`, `fail`.
   - Compute median wall-clock seconds across the runs (from each `<id>.trajectory.json`).
   - Sum `usage.totalCostUsd` from each trajectory for total candidate cost.
   - Collect any `stretchPromotions` across questions — these are the rubric edits made this run.

7. **Write the batch summary.**
   - `Write` `<output_dir>/summary.yaml`:

```yaml
schemaVersion: eval_batch_summary_v2
run:
  command: /run-evals
  suite: <suite path>
  ids: [<id1>, <id2>, ...]
  ranAt: <ISO timestamp>
  questions: <count>
totals:
  pass: <n>
  partial: <n>
  fail: <n>
dimensionAggregates:
  citationPrecisionPassRate: <0..1>
  jerseySpecificPassRate: <0..1>
  substancePassRate: <0..1>
  medianWallClockSeconds: <float>
  totalCostUsd: <float; candidate-only — manager subagents are subscription-billed>
  meanHallucinatedCitationsPerAnswer: <float>
rubricEvolution:
  stretchPromotionsByQuestion:
    <question_id>: [<promoted fact 1>, <promoted fact 2>]
    # only includes questions that had promotions
perQuestion:
  - id: <question_id>
    verdict: <pass | partial | fail>
    factsCovered: <n>
    factsExpected: <n>
    hallucinatedCitations: <n>
    summary: <pull-quote from the verdict>
```

8. **Report to the user.**
   - Single message with:
     - A one-line headline: `<pass>/<partial>/<fail> over <total>. Cost $<x.xx>. <stretchPromotions count> rubric promotions.`
     - A markdown table: question ID | verdict | facts | summary
     - Path to `<output_dir>/` for full artifacts
   - If any question failed or partial, surface the per-question `summary` so the user has the signal immediately rather than having to read the YAML.
   - **Synthesise a "fix backlog" when there are 2+ non-pass verdicts.** Read each non-pass verdict's `summary:` field. Identify shared patterns across questions (same retrieval-path failure on multiple questions; same term-of-art missed; same kind of corpus-content gap; same agent-discipline slip). Write 1-3 short paragraphs at the end of your report grouping the failures by what would fix them:
     - **Corpus edits** — facts that are in the corpus but in narrow contexts the agent's retrieval doesn't reach, or facts not in the corpus at all. Name the file to edit and what to add.
     - **Agent-discipline patterns** — failures where the material was reachable and the agent missed it. Useful signal for the next prompt iteration.
     - **Rubric phrasing / staleness** — facts the rubric demands in a form the corpus doesn't use, or rubric items that have aged out.
     - **Candidate variance** — questions where prior runs passed but this run didn't, with no structural cause.
     Don't fabricate patterns. If the failures are all idiosyncratic with no shared cause, say so. The point is to surface ACTIONABLE highest-leverage fixes — usually each "fix backlog" item should be something the maintainer could land in <30 min.

## Discipline

- **Don't grade the questions yourself.** Spawn the `eval-manager` subagent for each — that's its job. You orchestrate; it evaluates.
- **Don't modify the eval YAML yourself.** The `eval-manager` subagent has the scoped permission to append to `stretch_facts`; the orchestrator does not modify the rubric.
- **Don't bail on partial failures.** If 7 questions complete and 1 errors, write summary.yaml with what you have and report the error explicitly. Don't lose the 7 completed verdicts.
- **Parallelism matters.** A single message with N Agent tool calls is much faster than N sequential messages. Do batch-up-to-8.
- **Don't run the full suite without explicit request.** Routine smoke uses the `smoke: true`-flagged subset. Full suite is opt-in via explicit `--ids` listing.

## After the report

If verdicts look clean, suggest the user `git add -A && git commit` the output directory and any rubric edits the eval-manager made. If verdicts have regressions, surface them — don't auto-commit.
