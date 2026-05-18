# prompts/sub-agents/

System prompts for the three first-class sub-agents in PRD §8. Each
sub-agent runs in an **isolated context window** with a **curated
tool subset**. The main agent only ever sees the sub-agent's verdict
or assembled result — never the sub-agent's scratch reasoning. This
is load-bearing: it keeps the main agent's context clean and avoids
sub-agent exploration polluting the main reasoning trace
(AGENT-BEHAVIOURS cross-cutting properties).

| Sub-agent | When it runs | Tools | Model |
|---|---|---|---|
| `bundle-assembler` | SessionStart; re-runs on persona/task pivot | `corpus.*`, Read | Sonnet 4.6 |
| `citation-verifier` | `Stop` hook before every response goes to the user | `corpus.getFile`, `corpus.getArticle`, Read, Grep | **Opus 4.7** (PRD §12 — precision > latency for a gate) |
| `freshness-checker` | `PreToolUse` on every `corpus.*` content-returning call | `corpus.freshnessCheck`, `primarySource.fetch` | Sonnet 4.6 |

Each `.md` file in this directory **is** the sub-agent's system prompt.
The implementation wiring (Claude Agent SDK `AgentDefinition` with the
tool list, model selection, and the prompt loaded from this file) lives
in `packages/agent/src/sub-agents/` once week 5-7 of
[`../../IMPLEMENTATION-PLAN.md`](../../IMPLEMENTATION-PLAN.md) lands.

These prompts are **load-bearing structural gates**, not soft suggestions.
Same-model self-verification is not sufficient — the sub-agent is the
mechanism that turns "the main agent should remember to do X" into "X
happens because a separate process checks for it" (AGENT-PRINCIPLES
Principle 4 and Principle 23).
