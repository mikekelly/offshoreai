# Agent Behaviours

Region-non-specific design doc for the **customised agent behaviours** that the offshoreai agent runtime adds on top of the Claude Agent SDK's default loop. Each behaviour exists for a specific reason — a failure mode the default loop doesn't handle, a guardrail the domain requires, a budget the architecture has to respect.

This doc complements [`AGENT-PRINCIPLES.md`](AGENT-PRINCIPLES.md) (the *what* — strategic commitments) and the per-jurisdiction PRDs (the *when and at what scale* — implementation specifics). It is the *why and broadly how* layer between them. When a new behaviour is added to any product agent on this corpus, document it here first; PRD-level rollout follows.

The layering, restated:

| Doc | Question it answers | Region-specific? |
|---|---|---|
| `AGENT-PRINCIPLES.md` | What do we believe and what won't we compromise? | No |
| **`AGENT-BEHAVIOURS.md`** | **Why does this customisation exist and how does it broadly work?** | **No** |
| `PRD-*.md` | What gets built when, with what budget, against which evals? | Yes (per jurisdiction / product) |

---

## Catalogue

Each behaviour follows a consistent template: **what it does**, **what fails without it**, **how it broadly works** (SDK mechanism level — not implementation), **per-tenant toggle** (whether tenants can tune or disable), and **where the Jersey v1 instantiation lives**.

### 1. Bundle pre-loading at session start

**What it does.** Before the agent reads the user's first prompt, the runtime determines which persona/task the session matches and loads the corresponding **bundle** (a pre-compiled set of corpus files, statute articles, tags and freshness windows) into the session context.

**What fails without it.** The agent first-turn-rediscovers the same corpus material every session. Token budget is burned re-reading files the system already knows are required. Latency stretches as the agent makes 5+ exploratory tool calls before useful work starts. Pinecone's data suggests rediscovery can eat ~85% of agent compute in chatbot-era RAG; bundles eliminate it for known persona/task combinations.

**How it broadly works.** A `SessionStart` hook invokes a `bundle-assembler` sub-agent (isolated context window) that routes by signals in the system context — persona declared in the tenant CLAUDE.md, task hinted by the customer-supplied initial prompt or by a routing slash-command. The sub-agent picks the matching bundle YAML, calls `corpus.getBundle`, and returns the assembled content as a tool result that the main agent reads at the top of the session.

**Per-tenant toggle.** No — bundles are the primary retrieval contract. Tenants can extend bundles with their own house-view skills but cannot disable bundle pre-loading.

**Jersey v1.** PRD §6.2 (bundle compilation), §8 (sub-agent definition), §7.0.2 (ambient session-start context).

### 2. Ambient session-state dashboard

**What it does.** At the top of every session, the agent receives a compact text dashboard of the corpus and tenant-memory state: file counts by section, stub/draft/stale counts, currently warm bundle, count of tenant memory notes.

**What fails without it.** The agent opens each session blind to corpus health. It might confidently cite a file whose `last_verified` is 9 months old. It doesn't know what's stub-only in the section the user is asking about. Cold starts are footguns.

**How it broadly works.** A `SessionStart` hook (separate from the bundle-loading hook above; runs after it) injects a short TOON-formatted dashboard into the system context. The injection is purely informational — the agent reads it as context, not as a tool result. Refreshed per session, not per turn.

**Per-tenant toggle.** Yes — tenants whose interaction model is short-and-focused may set this to a minimal mode (corpus stale-count only).

**Jersey v1.** PRD §7.0.2 (session-start ambient context), §5.7 (steady-state context budget).

### 3. Ambient retrieval via UserPromptSubmit

**What it does.** On each user turn, before the model sees the new prompt, the runtime runs corpus retrieval over the prompt plus recent conversation summary, takes top-K candidates above a relevance threshold, and injects those that haven't already been injected this session.

**What fails without it.** Bundles cover known persona/task combinations. Conversations evolve — the user pivots, asks something tangential, drifts into territory the original bundle doesn't fully cover. Without ambient retrieval the alternatives are: (a) the agent explicitly calls `corpus.semanticSearch` mid-turn (push-based; relies on the agent recognising the gap), or (b) the agent answers from less context than is available. Ambient retrieval is the pull-based version of (a), useful when the agent doesn't yet know what it's missing.

**How it broadly works.** A `UserPromptSubmit` hook fires once per user turn before the model reads the prompt. The hook:

1. Scans the recent session transcript for **sentinel markers** of past ambient injections (each injection wraps content in `<!-- ambient-corpus-injection: <path>@hash=<hash> --> ... <!-- /ambient-corpus-injection -->`). This produces the set of (path, hash) pairs already injected ambiently this session.
2. Runs retrieval (`semanticSearch + findByTag + expandTags`) over the new prompt + recent N turns summarised.
3. Filters out (path, hash) pairs already injected and any files in a session-scoped "seen via Bash" log (see #6 below).
4. Picks top-K remaining candidates above the relevance threshold.
5. Injects them, sentinel-wrapped, as a synthetic ambient-retrieval block prepended to the prompt the model is about to read.
6. Hard cap at 2–3 files per turn; ambient injections count against the steady-state context budget.

**Self-deduplication via sentinels rather than a separate ledger** keeps the hook stateless beyond what the SDK already persists in the session JSONL. The main duplicate risk is ambient-vs-ambient (same file re-fetched by ambient retrieval on multiple turns), and sentinels close that exactly.

**Per-tenant toggle.** Yes — per-persona toggle in the persona SKILL.md. Heavily-bundle-covered personas (trust-officer with comprehensive bundles) may set the relevance threshold high or disable; thinly-bundled personas (journalist, exploratory) benefit from aggressive ambient retrieval.

**Tension with the bundle-first principle.** Ambient retrieval is query-time search, which `AGENT-PRINCIPLES.md` principle 7 flags as the wrong default. It coexists as a **complement**, not a replacement: bundles are primary for known persona/task; ambient covers conversation drift the bundle didn't anticipate. The relationship to push-based explicit `corpus.semanticSearch` calls is that ambient is the auto-version for the high-confidence cases — same retrieval cost, just pre-emptive.

**Known limitation.** The sentinel-based dedup catches ambient-vs-ambient but not ambient-vs-Bash-discovery. If the agent runs `rg "firewall" jersey/` and gets matching lines, then on the next turn ambient retrieval re-injects `firewall.md` because no sentinel for it exists. The PostToolUse-on-Bash log in #6 below partially closes this for trivial cases (`cat`-style commands name the path); `rg`/`grep` results are treated as snippet-level discovery rather than full reads, so the file may still be ambient-injected — which is acceptable.

**Jersey v1.** PRD §6.4 (new sub-section), §15 (context-budget risk), §11.2 (ambient injection rate KPI).

### 4. Freshness checking at the tool-use boundary

**What it does.** Before any `corpus.*` tool call that returns file content (`getFile`, `getArticle`, `getBundle`), the runtime checks whether the corpus file's `last_verified` date is older than the primary source's last-modified header. If so, it emits a "stale relative to primary source" signal alongside the tool result.

**What fails without it.** Offshore jurisdictions amend statutes frequently. A corpus file dated 14 months ago may describe a regime that's since been amended. The agent confidently cites the stale text. The user acts on wrong information. This is the highest-stakes failure mode for a citation-mandatory agent.

**How it broadly works.** A `PreToolUse` hook on `corpus.*` content-returning tools triggers a `freshness-checker` sub-agent (isolated context window, tools: `corpus.freshnessCheck`, `primarySource.fetch`). The sub-agent fetches the primary source's last-modified header (cached) and compares against the corpus file's `last_verified`. Returns a fresh / warn / stale verdict; warn-or-stale verdicts attach to the tool result so the main agent sees them and either flags to the user or refuses.

**Per-tenant toggle.** No — freshness is non-negotiable; tenants cannot disable. They can configure the warn/stale age thresholds (default 180/365 days).

**Jersey v1.** PRD §5.1 (freshness as guardrail), §7.0.1 (the three failure modes), §8 (sub-agent definitions).

### 5. Citation verification at the response boundary

**What it does.** Before any agent response is returned to the user, a citation-verifier sub-agent re-reads each cited file and confirms the claim it supports is actually supported by that file. Responses that fail verification get one retry; second failures are downgraded to "I don't have a confident answer; here is what the corpus does say" with raw citations.

**What fails without it.** Agent self-verification is unreliable — the same model that produced the claim is biased toward confirming it. Hallucinated citations (the agent cites a file that says nothing about the claim) are the most common failure mode in citation-mandatory agents. A structural sub-agent gate, not a prompt-level afterthought, is the only mechanism that reliably catches them.

**How it broadly works.** A `Stop` hook fires before the response is returned to the user. The hook invokes a `citation-verifier` sub-agent in an isolated context window with a curated tool subset (`corpus.getFile`, `corpus.getArticle`, `Grep`, `Read`). The sub-agent extracts the citations from the response, re-reads each cited file, and returns a structured pass/fail verdict. On fail, the main agent receives the verdict and gets one retry to fix; on second fail, the runtime substitutes a refusal template with verified raw citations.

The verifier runs on a higher-precision model than the main agent (Opus for verification, Sonnet for the main loop) — precision matters more than latency for a gate.

**Per-tenant toggle.** No — citation discipline is non-negotiable. Tenants cannot disable. They can configure the retry budget (default 1) and the refusal template's wording.

**Jersey v1.** PRD §8 (sub-agent definitions), §6.3 (the retrieval contract), §12 (Opus 4.7 for the verifier model).

### 6. Tool deny-list and sandbox

**What it does.** A `canUseTool` callback inspects every tool call before execution and rejects calls that would: invoke destructive operations (`rm -rf`, `sudo`, package installs), reach forbidden network destinations, fetch primary-source URLs via the generic `WebFetch` tool (instead of the cached `primarySource.fetch`), or read corpus content via Bash + `cat`/`head`/`tail`/`less` (instead of the typed `corpus.*` lane). Bash is sandboxed to a per-tenant directory.

**What fails without it.** Bash is general-purpose. Without constraints, an agent can read anywhere on disk, hit any URL, run any command. For a multi-tenant SaaS that's an architectural-restraint violation and a compliance problem. Specifically: an agent reading corpus content via Bash bypasses freshness checks and audit logging.

**How it broadly works.** The SDK's `canUseTool` callback is invoked for every tool call. It returns allow / deny / ask. The deny rules live in a deny-list per tenant (a deny-list is preferred over an allow-list for the Bash lane because we want the agent to retain the natural shell expressiveness for standard tools like `rg`/`jq`/`sed`). A separate PostToolUse hook on Bash scans the command text for corpus paths and logs them to a session-scoped "seen via Bash" set (consumed by ambient retrieval dedup in #3).

**Per-tenant toggle.** Limited — tenants can extend the deny-list (their compliance team adds their own forbidden patterns) but cannot remove deny rules. They can change the sandbox cwd and add allowlisted network hosts.

**Jersey v1.** PRD §7.0.2 (safety on the Bash lane), §9.3 (what tenants cannot do).

### 7. Audit logging on every tool call

**What it does.** Every tool call, every skill load, every memory operation, and every citation-verifier verdict streams to a per-tenant event log (Postgres table + S3 JSONL mirror).

**What fails without it.** The whole "log-driven bundle prioritisation" loop in `AGENT-PRINCIPLES.md` principle 19 doesn't work. Tool-description regressions go unnoticed. Corpus gaps (paths the agent reaches for but finds stub/stale) are invisible to the editorial process. The agent has no observability story for tenant operators.

**How it broadly works.** PostToolUse hooks on every tool (typed `corpus.*` / `memory.*` / `register.*` / `primarySource.*` plus built-in Read/Grep/Bash) write a structured event with: `(session_id, tenant_id, tool_name, input_hash, result_status, latency_ms, tokens, timestamp)`. Stop hooks log citation-verifier verdicts. SessionStart/End hooks log session bracketing. Weekly jobs analyse the log to surface bundle-priority signals, tool-description regressions, and corpus gaps.

**Per-tenant toggle.** No — auditability is non-negotiable. Tenants can configure log retention (default 90 days for full event content, 13 months for aggregate metrics).

**Jersey v1.** PRD §11.3 (observability), §9 (tenant audit log).

### 8. Progressive skill disclosure

**What it does.** Only the **baseline skill body** (citation rules, freshness rules, persona-routing heuristics) is always-resident in the system prompt. Task-skill bodies — operator instructions for a specific persona/task — load on demand when the relevant bundle is loaded, and offload back to a scratch `plan.md` when the conversation pivots.

**What fails without it.** With dozens of task skills (e.g. 33 trust-officer task skills + 8 baseline skills + 7 persona overviews) loaded always, the system prompt swells to 30k+ tokens before the agent reads its first user message. Context budget is destroyed; the agent has less room for actual reasoning and tool results.

**How it broadly works.** The SDK loads SKILL.md files from `.claude/skills/` with their descriptions always visible but their bodies loaded on demand (the same mechanism as tool search for typed tools). The baseline skill is always loaded fully (it's small). Task skills are loaded by the bundle-assembler sub-agent in #1 when their bundle is assembled. When the bundle changes mid-session (user pivots persona/task), the previous task skill body is written to scratch `plan.md` and a new task skill is loaded.

**Per-tenant toggle.** Yes — tenants can pin specific task skills always-resident (e.g. a firm that exclusively does trust work might pin the trust-officer skills).

**Jersey v1.** PRD §5.2 (procedural memory as skills), §5.7 (progressive disclosure & context budget).

---

## Cross-cutting properties

Every behaviour in the catalogue satisfies these constraints. New behaviours added later must too:

- **Token-budget-aware.** Each behaviour declares how it affects the steady-state context budget (PRD §5.7). If a new behaviour adds context residency, it has a budget line.
- **Observable.** Every behaviour emits structured events to the audit log so the team can measure whether it's actually working (e.g. ambient injection rate, citation-verifier reject rate, freshness-checker warn rate).
- **Isolated from main-agent context.** Behaviours that involve a sub-agent (bundle-assembler, freshness-checker, citation-verifier) run in their own context windows. The main agent sees only the verdict / result, never the sub-agent's scratch reasoning. This keeps the main agent's context clean and avoids the sub-agent's exploration polluting the main reasoning trace.
- **Failure returns to the agent as data.** Hooks that detect a problem return a structured signal (e.g. `isError: true` with a typed envelope), not an exception that crashes the loop. The agent dispatches on the signal — retry / pivot / refuse — rather than the runtime making the decision unilaterally.
- **Per-tenant configurability is bounded.** Tenants can tune thresholds and add restrictions but cannot disable behaviours that protect the architectural principles (citation verification, freshness, audit logging, deny-list). The configurability surface is documented per behaviour.

---

## What we deliberately do *not* customise

For completeness — these are agent behaviours that other systems sometimes customise but where we use the SDK's default:

- **The agent's tool-calling loop.** We use the SDK's stock loop. We don't intercept the model's reasoning or rewrite tool calls in-flight. Our hooks fire at well-defined boundaries (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop) and treat the loop between them as a black box.
- **The model's output format.** We don't post-process or rewrite the model's prose. The citation-verifier evaluates the prose; it doesn't transform it. If verification fails, the agent rewrites it itself on the retry; we don't auto-edit.
- **Per-tenant model selection.** All tenants use the same model tier (Sonnet 4.6 for the main agent, Opus 4.7 for the citation-verifier sub-agent). We don't expose model choice as a tenant configuration in v1.
- **Session persistence.** We use the SDK's session JSONL format and `resume`/`fork` semantics unchanged.
- **Message history compaction.** The SDK's native compaction does the work; we don't add a custom compactor. Bundle pre-loading and progressive skill disclosure address the main causes of compaction pressure.

---

## Adding a new behaviour

When a new customised behaviour is proposed (a new hook, a new sub-agent, a new restriction):

1. Write a new catalogue entry following the template (what / fails-without / broadly-how / per-tenant toggle / PRD reference) — even before implementing.
2. Identify the failure mode it addresses. If you can't name a specific failure mode the default loop doesn't handle, the behaviour probably shouldn't exist.
3. Check it satisfies the cross-cutting properties (budget-aware, observable, isolated, failure-as-data, bounded configurability).
4. Open a PR that adds the entry here and the implementation simultaneously. PRD-level rollout is a separate PR.
5. The behaviour ships disabled by default for the first tenant; enable when the eval suite shows it isn't regressing answer quality or latency.

This doc grows over time. The catalogue is small now because the architecture is small. As products on this corpus diversify (per-firm white-labels, public-research agents, comparison agents across jurisdictions), new behaviours will land here first.
