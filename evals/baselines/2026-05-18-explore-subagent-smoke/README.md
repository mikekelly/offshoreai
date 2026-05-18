# 2026-05-18 — explore-subagent smoke baseline

**Status: smoke validation only — 1 of 14 showcase questions.**

A single-question dispatch to the `explore-subagent` harness
([../../harnesses/README.md](../../harnesses/README.md)) to validate
that the prompt template, dispatch shape, and trajectory-capture
approach work end-to-end. Not a full baseline; a sanity check.

## What ran

- Question: `show-voisinage` ("What is voisinage and does it really apply to my neighbour problem in Jersey?")
- Harness: `explore-subagent` (Claude Code Agent tool, subagent_type=Explore, read-only filesystem on the jersey/ corpus)
- Prompt: the constant template from [../../harnesses/README.md#the-shared-prompt-template](../../harnesses/README.md#the-shared-prompt-template)
- Dispatch: in-session `Agent` tool call from the parent
- Output captured: `show-voisinage.answer.md`, `show-voisinage.trajectory.json`

## What this validates

- The Explore-subagent dispatch shape works against the real corpus.
- The harness produces a coherent, source-cited answer.
- Trajectory metadata is partial (the parent can't see the subagent's tool calls); the `trajectory_quality: "approximate"` flag in the trajectory JSON is the right honest marker.

## What this does *not* validate

- Whether the answer is *correct* — no grader ran. (The grader sub-agent prompt at [`../../../prompts/eval/grader.md`](../../../prompts/eval/grader.md) is the next thing to wire up; for a true baseline it must run over the answer + trajectory.)
- How the explore-subagent harness compares to `claude-p` — that comparison is blocked on the auth issue in [../2026-05-18-claude-p-smoke/README.md](../2026-05-18-claude-p-smoke/README.md).
- How either compares to `offshoreai-agent` — that harness doesn't exist until week 7 of [`../../../IMPLEMENTATION-PLAN.md`](../../../IMPLEMENTATION-PLAN.md).

## Notable observation worth keeping

The single-question run cited **1 file** (`jersey/property/voisinage.md`)
where the curated showcase-v1 batch cited **4 files** for the same
question and noted ["1204 Normandy split", "Le Geyt + Pothier",
"objective-test distinction from English nuisance"]. The single-shot
answer is leaner and misses the historical-foundation details.

This suggests the Explore-subagent harness benefits substantially from
*context* the parent session normally provides during the curated runs
(implicit prior reading, the parent's own framing). For a true baseline
comparison we need to control for this — each baseline run is a
fresh-context dispatch, no parent priming. The numbers from the
v1/v2/v3 showcase runs are NOT directly comparable to a Phase 1
baseline produced under the §EVAL-DRIVEN-PLAN.md methodology — they
should be re-run under hardened conditions before being treated as
"the baseline".

This is itself a useful design signal: the existing 13/14 PASS
scoreboard on `evals/showcase.yaml` is a ceiling number, not a
baseline number. The real Phase 1 baseline (fresh-context, hardened
grader) is likely several points lower.

## Next steps

1. Set up `ANTHROPIC_API_KEY` so `claude-p` can also baseline.
2. Wire up the grader sub-agent so each answer gets a structured verdict.
3. Re-run all 14 showcase questions through both `explore-subagent` and `claude-p`, hardened conditions, on the same day, into a dated baseline directory.
