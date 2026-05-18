# evals/harnesses/

Harness adapter specs for the eval runner. Each adapter is a thin shape
that lets the runner ([`../../prompts/eval/runner.md`](../../prompts/eval/runner.md))
dispatch the same question to a different agent harness and capture a
uniform [trajectory](../../schemas/eval-trajectory.ts) for the grader.

This is the *only* place in the architecture where we wrap an agent
behind an interface — and it's justified because the harnesses are
genuinely different processes / codepaths (vanilla Claude Code CLI;
our subagent dispatch; our future TypeScript runtime). Per Appendix C
of the PRD, indirection earns its keep at real cross-boundary lines.
This is one.

---

## The three v1 harnesses

| Harness | Process | Tool surface | Trajectory source | When usable |
|---|---|---|---|---|
| `explore-subagent` | Claude Code Agent tool, subagent_type=Explore | Read, Glob, Grep, Bash (no Edit/Write) | runner reconstructs from the Agent invocation's result + parent's view of tool calls | now |
| `claude-p` | `claude -p` invoked via Bash subprocess | Read, Grep, Glob, Bash (configurable via `--allowed-tools`) | `--output-format json` envelope: `usage`, `num_turns`, `duration_ms`; tool sequence parsed from stdout stream where verbose | now (Claude Code CLI required) |
| `offshoreai-agent` | `pnpm --filter @offshoreai/agent run query` | all typed `corpus.*`, `memory.*`, `primarySource.*`, `register.*`; Bash sandboxed | native trajectory writer emits a complete `Trajectory` directly | from week 7 of IMPLEMENTATION-PLAN.md |

The first two are **baselines**. The third is the thing we're building.
Every implementation milestone is measured by the gap the third opens
over the first two.

---

## The shared prompt template

Identical across harnesses (modulo dispatch-layer wrappers). This is
the load-bearing convention: the prompt is constant; the harness is the
variable. If we tailor the prompt per harness we lose the comparison.

```
You are answering an eval question against the offshoreai Jersey
corpus. Your tools are <tool list available to this harness> —
read-only filesystem access only. You may not invoke any other agent.

Constraints:
- Use ONLY corpus files under jersey/. Do not draw on training-data
  knowledge of Jersey law.
- Cite every file you read inline using its relative path. Where the
  question is about a statute Article, also cite the Article number.
- If the corpus does not answer the question, say so explicitly: "the
  corpus does not answer this question" — do not confabulate.
- Where last_verified > 180 days, surface that to the reader.

Question (<question-id>):
<question.question>

Produce an answer in your own words. End with a list of cited files.
```

The `<tool list available to this harness>` differs per harness only in
naming — the surface is constrained the same way (read-only, no
mutation, no external network beyond allowlist).

---

## Per-harness dispatch — concrete shape

### explore-subagent

Invoked via the parent agent's `Agent` tool:

```ts
Agent({
  subagent_type: "Explore",
  description: `Eval: ${questionId}`,
  prompt: renderPrompt(question, "explore-subagent"),
})
```

**Trajectory reconstruction.** The Explore subagent's tool calls aren't
directly enumerable from the parent's perspective — we get the final
result string. The runner does its best to reconstruct from any inline
"I read X" / "I grep'd Y" mentions in the answer, but `tool_calls` and
`tokens_*` will be approximate. Wall-clock is measurable. Caveat in
`trajectory.meta.trajectory_quality: "approximate"`.

### claude-p

Invoked via shell:

```bash
claude -p \
  --allowed-tools "Read Grep Glob Bash" \
  --output-format json \
  --max-turns 20 \
  --cwd <repo-root> \
  "<rendered prompt>"
```

**JSON envelope shape** (from `claude --help` / Claude Code docs):

```json
{
  "type": "result",
  "subtype": "success",
  "result": "<final answer text>",
  "session_id": "<uuid>",
  "total_cost_usd": 0.04,
  "usage": {
    "input_tokens": 32100,
    "output_tokens": 1240,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 28000
  },
  "num_turns": 6,
  "duration_ms": 14200,
  "duration_api_ms": 12800
}
```

From which the runner populates a complete `Trajectory.usage` and a
`Trajectory.turns` count. `toolCalls` is left empty (Claude Code's
default JSON output doesn't enumerate individual tool calls); set
`trajectory.meta.trajectory_quality: "approximate"`.

For a fuller trajectory under `claude -p`, use `--output-format
stream-json` instead and parse the per-event stream into individual
tool calls — this is the recommended mode for the hardened comparison
runs.

### offshoreai-agent (week 7+)

Invoked via the package's query CLI:

```bash
pnpm --filter @offshoreai/agent run query \
  --tenant dev \
  --persona <persona-from-question-yaml> \
  --output-trajectory <output-dir>/<question-id>.trajectory.json \
  --output-answer    <output-dir>/<question-id>.answer.md \
  --question "<question.question>"
```

**Native trajectory.** The agent writes a full `Trajectory` directly —
every tool call is logged with input digests, result bytes, latency,
isError flag. No reconstruction needed.

---

## Trajectory file naming

Per output directory:

```
evals/baselines/2026-05-20-claude-p/
├── summary.yaml
├── show-trusts-firewall.answer.md
├── show-trusts-firewall.trajectory.json
├── show-trusts-firewall.verdict.yaml
├── show-article-47.answer.md
├── show-article-47.trajectory.json
├── show-article-47.verdict.yaml
└── ...
```

The runner writes `.answer.md` + `.trajectory.json`; the grader writes
`.verdict.yaml`; the runner's post-batch aggregator writes
`summary.yaml`.

---

## Dispatch error handling

If a harness invocation errors:

- Write an empty-shaped trajectory with `errors[].where: "dispatch"` and `errors[].detail: "<error message>"`.
- Write the answer file with an explicit `# DISPATCH ERROR\n\n<detail>` body.
- Pass to the grader anyway — the grader records the error and marks the question `fail` with `notable_wrong: ["harness dispatched but did not return an answer"]`.

The runner does **not** retry dispatches automatically. A failed
dispatch is a real signal — investigate before re-running.

---

## When to add a new harness

A fourth harness is justified when there's a genuine cross-process
boundary to compare across:

- A different SDK runtime (e.g. once the Anthropic Managed Agents migration in PRD §4.2 lands, that becomes harness #4).
- A competitor product we want to benchmark against (e.g. a specialist legal-AI tool).
- A different model class (e.g. a hypothesised lighter agent we'd run on Haiku 4.5 for cheap-tier queries).

A new harness is **not** justified for:

- A new tool surface inside the existing `offshoreai-agent` — that's a feature, measured against the existing harness's baseline.
- A new prompt variation — that's a prompt experiment, not a harness experiment.
- A different way of running the same SDK with the same tools — that's a config knob, not a harness.

The bar for harness #4 is: a genuine boundary that wouldn't be honestly
captured by the existing three.
