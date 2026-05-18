# prompts/eval/

System prompts for eval-time sub-agents. Distinct from
[`prompts/sub-agents/`](../sub-agents/) which holds the **production**
sub-agents (citation-verifier, bundle-assembler, freshness-checker);
this directory holds the agents that grade and orchestrate **eval runs**
themselves.

The split matters: the grader has access to the *expected* answer
rubric for the question under test, which the production verifier
deliberately does not. Same architecture (Opus 4.7, isolated context,
curated tool subset, structured verdict) — different inputs.

Some of these are dual-use over time. The grader prompt has the same
shape as `citation-verifier.md`; as evals mature we may extract shared
prompt fragments. But for now we keep them separate to preserve the
production/test boundary.

| Prompt | Role | When it runs | Model |
|---|---|---|---|
| `grader.md` | LLM-as-judge for eval answers | After each eval run; before scoring | **Opus 4.7** (precision > latency) |
| `runner.md` | Orchestrator that dispatches eval questions to harnesses-under-test | Per eval batch | Sonnet 4.6 |

The runner is the new piece that did not exist in week 0's framework.
The grader replaces the introspective grading that `evals/README.md`
flags as circular.

---

## Harness-under-test

The runner dispatches each question to a named harness:

- `explore-subagent` — the existing methodology (Claude Code's `Agent` tool with subagent_type=Explore, sandboxed to `jersey/`). The legacy baseline.
- `claude-p` — `claude -p "<prompt>"` invoked via Bash. The "vanilla Claude Code, no typed tools" baseline.
- `offshoreai-agent` — our future agent runtime, once weeks 1-7 of [`../../IMPLEMENTATION-PLAN.md`](../../IMPLEMENTATION-PLAN.md) ship. The thing we're building.

The harness adapter spec lives at
[`../../evals/harnesses/README.md`](../../evals/harnesses/README.md).
