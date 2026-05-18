# PRD — Offshore AI Jersey Baseline Agent (v1)

**Status:** draft for review
**Author:** Mike Kelly (with Claude)
**Date:** 2026-05-17
**Audience:** product/eng founder & first engineer(s)
**Scope:** v1 of the "baseline" agent — a production-grade Jersey domain expert built on top of the offshoreai corpus, designed to be the substrate from which per-company agents are cloned (Jersey TCBs, fund managers, family offices, banks, insurers).

---

## 0. TL;DR

We turn the offshoreai Jersey knowledge graph into a **stateful, citation-mandatory Jersey domain agent**, shipped as a Claude Agent SDK runtime. The baseline agent is what every customer-specific agent forks from. Customer agents add their own private memory, MCP integrations, and operator skills on top.

The bet, informed by the 2026 memory-infrastructure shift (Pinecone Nexus / KnowQL, SAP+Datasphere+Prior Labs, PageIndex, Microsoft GraphRAG, A‑Mem, Mem0, Letta, the Yu et al. "Agentic Memory" RL paper, the December 2025 "Memory in the Age of AI Agents" survey, and Leonie Monigatti's "Agentic Search for Context Engineering" thesis from Elastic), is that **classical RAG over chunks is the wrong abstraction for legal/regulatory agents**, and that **context engineering is mostly agentic search** — the part of the pipeline that decides which slice of which source enters the window. The right abstraction is:

1. A **retrieval contract per persona**: pre-defined "bundles" of canonical files, statute articles, tags and freshness windows assembled before query time, not searched at query time.
2. A **hierarchical retrieval primitive** (PageIndex-style) over the document tree the corpus already is — section index → topic file → statute article — instead of chunk-and-embed.
3. A **multi-tier memory** (working / episodic / semantic / procedural / canonical knowledge) where the corpus is *immutable canonical knowledge* and per-customer learning lives in a separate A-Mem-style note store that never contaminates citations.
4. **Citation-mandatory output**: every claim is grounded in a corpus file path + article + `last_verified` date, verified by a sub-agent before the user sees it.
5. A **low-floor / high-ceiling tool surface**: specialised in-process TypeScript tools registered with the Claude Agent SDK for the common cases (cheap, deterministic, easy to call correctly, no extra protocol layer); the SDK's **tool search** mechanism for scaling the typed surface without always-resident schema cost; and **Bash + standard pre-existing shell tools** (`rg`, `jq`, `sed`, `awk`, `gh`, `git`) for the genuine long tail. AXI's output discipline applies to the typed tool results (TOON in `content[0].text`, minimal default fields, definitive empty states, structured errors paired with `isError: true`, `help[]` blocks suggesting next-step tool calls). We deliberately don't ship custom CLIs over our own functions or MCP wrappers around our own logic — both are indirection over code we own and an agent we control (see Appendix C). MCP is reserved for boundary-crossing only (per-tenant external systems we don't own). Following the Monigatti/Elastic playbook: start general-purpose, log behaviour, compile specialised tools and bundles from observed patterns rather than from intuition.
6. **Claude Agent SDK as the runtime**, because (a) Skills + sub-agents + sessions + hooks map cleanly to the memory tiers we want, (b) the corpus is already optimised for "agent arrives cold" reading per `CONVENTIONS.md`, and (c) from June 15 2026 the Anthropic OAuth subscription credit pool is reachable only through the official Agent SDK — i.e. there is a real economic advantage to building on it.

v1 ships:
- A standalone CLI + library (TypeScript-first; Python sidecar only if a heavy text-analysis batch needs it later) wrapping the SDK.
- A compiled-bundle layer over the corpus (~25 persona/task bundles for the trust-officer persona, plus the four "cold-start orientation" bundles).
- A semantic-memory store (per-tenant) using A-Mem-style atomic notes.
- A typed **corpus toolset** (in-process TypeScript module `@offshoreai/tools-corpus`, SDK-registered with Zod input schemas and TOON output per §7.0.2) that gives typed access to the graph (`getFile`, `getArticle`, `findByTag`, `getBundle`, `freshnessCheck`).
- A **citation-verifier sub-agent** that hard-fails the response if a claim lacks a corpus citation.
- One paying-customer-ready white-label: **Jersey TCB Trust Officer Agent**, derived from the existing 33 trust-officer use-case files.

---

## 1. Why now — the 2026 memory inflection

Five signals across the last six months converge on the same conclusion: **infrastructure built for chatbot-era RAG is the wrong substrate for production agents, and the agent's tool surface — not its retrieval index — is the real product surface**.

- **Pinecone Nexus / KnowQL** (Apr 2026) — the vector-DB category leader explicitly positioning vector search as plumbing and a *knowledge-compilation* stage as the product, claiming up to 30× execution improvement and 90% token reduction by compiling reusable agent contexts ahead of time instead of re-running similarity search per query.
- **SAP's >€1bn AI infra spend** on Datasphere (lakehouse + semantic layer + lineage + access control) and Prior Labs (tabular foundation models). None of it is chatbot RAG; all of it is shape-respecting access to governed business data.
- **The "Memory in the Age of AI Agents" survey (arXiv:2512.13564, Dec 2025)** and the "Memory for Autonomous LLM Agents" survey (arXiv:2603.07670, 2026) — both formalising the same three-axis taxonomy (temporal scope × representational substrate × control policy), naming the same five mechanism families (context compression, retrieval stores, reflective self-improvement, hierarchical virtual context, policy-learned management), and reporting the same finding from MemoryArena: systems that score near-perfect on passive recall benchmarks (LoCoMo) collapse to 40–60% when memory has to be used in service of a real task.
- **Three open-source production memory systems** with credible 2026 numbers: **Mem0** (hybrid vector+graph+KV; 92.5 on LoCoMo, 94.4 on LongMemEval, <7k tokens per retrieval), **A-Mem** (Zettelkasten atomic notes with auto-link generation and memory evolution), and **Letta** (commercial MemGPT-derived three-tier OS-style virtual memory).
- **Monigatti's "Agentic Search for Context Engineering" (Elastic, AI Engineer 2026)** — argues that ~80% of context engineering is *agentic search*: the tool-call that decides what enters the window from local files, scratchpads, plan files, skills, databases, web, and long-term memory. Names three failure modes (no tool call, wrong tool, wrong parameters), commits to **low-floor/high-ceiling** as the tool-surface design principle (specialised tools for the common path, general-purpose tools like Bash for the long tail), and cites the Vercel "is bash all you need?" experiment in which a hybrid (database tool + Bash) outperformed either alone because Bash *verified* the database tool's output. Key build-order advice: start general-purpose, instrument every tool call, then compile specialised tools and bundles from observed patterns — don't pre-specify them.
- **AXI ("Agent eXperience Interface") spec** — a 10-principle specification for CLIs that agents drive via shell execution, validated against 490-run browser and 425-run GitHub benchmarks. AXI's headline finding: a ~30-tool MCP browser server burns ~185k input tokens per task vs ~79k for the equivalent AXI CLI surface (schema overhead scales with tool count and compounds per turn). AXI prescribes: token-efficient TOON output instead of JSON, minimal default field schemas, content truncation with size hints, pre-computed aggregates that eliminate round-trips, definitive empty-state messages, structured errors with a stable envelope, ambient-context home views, `help[]` blocks of parameterised next-step commands, idempotent mutations. We adopt AXI's **output-discipline** principles for the typed SDK tool surface (TOON in `content[0].text`, minimal defaults, truncation hints, pre-computed aggregates, definitive empty states, structured errors paired with `isError: true`, `help[]` blocks suggesting next-step tool calls). The CLI-implementation parts of AXI (subcommand discovery, exit codes, ambient `bin:` views) do not apply because we don't ship custom CLIs over our own functions — see Appendix C.

The Nate B Jones video ("Pinecone Just Demoted Vector Search") summarises the practical takeaway crisply: stop picking a database first; write down the **bundle** your agent needs to do its job; then pick the retrieval primitives that deliver that bundle. The shapes that matter are fuzzy prose (vectors), structured long documents (hierarchical trees, e.g. PageIndex), tabular business data (semantic layer + table-native reasoning), and relational data (graphs). For offshore legal/regulatory work the dominant shapes are the second and the fourth — exactly the two that classic RAG handles worst.

The Monigatti talk completes the picture from the other end: even with the right bundle and the right retrieval primitives, your agent will still fail in predictable ways at the *tool-calling* layer unless the tool surface itself is designed. Tool descriptions are systematically under-invested in; parameter complexity is a failure axis (simple `get_by_id` is robust, free-form `execute_query` is brittle); error responses should be returned *to the agent* so it can self-correct rather than crashing; and the long-tail "agent does something unexpected" cases need a high-ceiling escape hatch (Bash + CLIs + skills as docs-loaded-on-demand) rather than an ever-growing menagerie of specialised tools.

This is the opening for an opinionated, vertical agent: **a Jersey domain agent that is right because the corpus, the retrieval contract, and the tool surface are right — not because the retrieval index is fancy.**

---

## 2. Product vision

### 2.1 Baseline agent
A single agent process — runnable as CLI, library, or hosted endpoint — that:
- Reads the offshoreai Jersey corpus as its canonical knowledge.
- Answers Jersey-law, Jersey-regulation, Jersey-tax and Jersey cross-border questions with mandatory primary-source citations.
- Knows what it doesn't know (refuses on stub files, flags stale `last_verified`, distinguishes statute / regulator guidance / secondary).
- Remembers the user's prior turns within a session and (opt-in) across sessions.
- Exposes persona modes via Skills (trust-officer, fund-counsel, MLRO, family-office, litigator, founder, journalist).

### 2.2 White-label per-company agents
Each paying customer gets an agent that:
- **Inherits** the baseline corpus, skills, citation discipline, and MCP servers.
- **Adds** a private semantic-memory store (their internal precedents, client correspondence, internal precedents-bank).
- **Adds** tenant-scoped MCP servers (their CRM, ticketing system, document store, signing platform).
- **Adds** customer-specific skills overlaying the baseline ones (e.g. *Crestbridge's house view on Article 47*).
- **Never** writes customer-specific knowledge into the canonical corpus. The corpus is one-way upstream.

This split — canonical/shared vs private/tenant — is the load-bearing architectural commitment of v1. Everything downstream depends on it.

### 2.3 Initial commercial wedge
The **Jersey TCB Trust Officer Agent**. Jersey's regulated trust-company population is ~150 entities; trust officers are the daily-driver persona; the corpus already has 33 trust-officer use-case files with the persona's canonical questions enumerated. This is the shortest path from corpus to revenue.

---

## 3. Users & jobs-to-be-done

Drawn from the corpus's persona taxonomy (`jersey/use-cases/`):

| Persona | Daily job v1 must do | Why this persona first |
|---|---|---|
| **Trust officer (TCB)** | Decide whether a distribution can be made, draft a Court application, run CDD on a new trust, classify under CRS/FATCA, screen sanctions, run Beddoe/blessing logic | 33 use-case files already exist; revenue density is high |
| **Fund counsel / GP** | Classify a fund under JPF / Expert / Listed / public; check NPPR marketing; AIFMD interaction | Index written; ~10 use-case stubs |
| **MLRO / compliance** | SAR threshold, sanctions screening, PEP onboarding, AML handbook checks | Index written |
| **Family-office adviser** | HVR residency, succession planning, forced-heirship defence, foreign-tax interaction | Index written |
| **Royal Court litigator** | Article 51 directions, Beddoe, blessing, set-aside | Some content in trusts/ |
| **Founder / entrepreneur** | TopCo structuring, economic substance, redomiciliation | Index written |
| **Journalist / NGO / academic** | Registers, transparency, regulatory history | Index written |

v1 ships **deep coverage for trust-officer**; the other six personas ship as **functional-but-shallow** so the agent doesn't refuse cross-persona questions but only one persona has real bundle depth.

---

## 4. Architecture

### 4.1 High-level diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                       Claude Agent SDK runtime (TypeScript / Node) │
│  ┌─────────────────────┐    ┌────────────────────────────────┐    │
│  │  Persona Skills     │    │   Sub-agents                    │    │
│  │  (.claude/skills/)  │    │   - bundle-assembler            │    │
│  │  - trust-officer    │    │   - citation-verifier           │    │
│  │  - fund-counsel ... │    │   - freshness-checker           │    │
│  └─────────────────────┘    │   - cross-jurisdiction-comparer │    │
│                             └────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Built-in tools: Read, Glob, Grep, Bash, WebFetch, ...      │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ In-process custom tools (SDK-registered TS functions w/Zod)│   │
│  │   corpus.*   memory.*   register.*                          │   │
│  │   primarySource.*   freshness.*                             │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ MCP servers (boundary-crossing only)                        │   │
│  │   tenant-systems-mcp (per-customer external systems:        │   │
│  │     NavOne, Salesforce, M-Files, signing platform, etc.)    │   │
│  └────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Hooks: PreToolUse (guard), PostToolUse (audit),             │   │
│  │        Stop (citation-verify), SessionStart (load bundle)   │   │
│  └────────────────────────────────────────────────────────────┘   │
└────┬──────────────────────────────┬────────────────────────────────┘
     │                              │
     ▼                              ▼
┌────────────────────┐    ┌─────────────────────────────────────────┐
│  Canonical layer   │    │   Tenant layer (per-customer)            │
│  - offshoreai/     │    │   - A-Mem note store (Postgres+pgvector) │
│  - bundles/*.yaml  │    │   - tenant skills overlay                │
│  - hier-tree.json  │    │   - tenant MCP creds (external systems)  │
│  - tag-index.json  │    │   - session JSONL                        │
│  - vec-index/      │    │                                          │
└────────────────────┘    └─────────────────────────────────────────┘

Same TypeScript module (Zod-typed functions) backs both the SDK-registered
tool and the AXI CLI (`corpus`, `memory`, `register`, `primary-source`) —
one source of truth, two invocation surfaces.
```

### 4.2 Choice of runtime: Claude Agent SDK

Why the SDK (and not roll-our-own Messages API loop or move straight to Managed Agents):

- **Built-in tool loop, hooks, sub-agents, sessions, skills, MCP** — all the primitives we'd otherwise build from scratch. We are not in the business of writing an agent harness; we are in the business of being right about Jersey law.
- **In-process custom tool registration** — the SDK lets us register a TypeScript function as a tool directly with Zod input/output schemas, no separate server, no JSON-RPC wrapper. This is the default mode for our own logic (corpus, memory, register, primary-source, freshness). MCP is reserved for boundary-crossing — per-tenant external systems we do not own.
- **Filesystem-native config** — `.claude/skills/*/SKILL.md`, `.claude/agents/*.md`, `CLAUDE.md` — maps 1-to-1 onto the corpus's existing markdown-first ethos. No format mismatch between corpus and runtime.
- **Sessions as JSONL on disk** with `resume` / `fork` semantics — gives us episodic memory for free, plus session-store adapter for serverless deploys.
- **OAuth subscription credits**: from 15 June 2026 the Pro and Max subscription monthly credit allocation ($20 / $200 of Agent SDK usage) is consumable **only through the official Agent SDK**, not third-party CLIs. For a vertical agent business this is a measurable margin advantage on the long tail of low-volume tenants — and a competitive moat against teams who built on OpenClaw-style routers and are now paying full API rates.
- **Migration path to Managed Agents** (REST, sandboxed, Anthropic-hosted) when we want hosted long-running async sessions without operating the harness ourselves. v1 stays on the SDK in our process; v2 may move tenant runtimes to Managed Agents (beta header `managed-agents-2026-04-01`). When we make that move, the in-process tools we ship in v1 will need MCP wrappers (because the hosted sandbox can't import our TS modules) — but we build those wrappers *then*, auto-generated from the same Zod schemas, not pre-emptively.

The two SDKs (Python and TypeScript) are at feature parity for our needs. **Choose TypeScript** as the primary. Reasoning:

- **Type-sharing end-to-end.** A single Zod schema defines the SDK tool input, the CLI arg parser, and (in v1.1) the frontend request type. Zod's runtime validation does real work on the *input* side (untrusted agent-supplied arguments). On the *output* side we own the values, so Zod degrades to a build-time shape declaration only — useful for `z.infer` typing, for deriving TOON field lists from `Object.keys(schema.shape)`, for round-tripping test fixtures, and for generating the future MCP server's output schema (Appendix C) — but not validated at runtime. The "one source of truth, two invocation surfaces" promise in §7.0.2 is genuinely easier to honour in TS because you write the function once with proper types and both surfaces derive from it.
- **The TS SDK bundles a native Claude Code binary** as an optional dep — one less install step than the Python SDK, and zero-config on first run.
- **Enterprise integration SDKs** for `tenant-systems-mcp` connectors (Microsoft Graph, Salesforce JSforce, DocuSign, Adobe Sign, Okta, Microsoft 365) are all TS/JS-first; the Python equivalents are thinner and frequently community-maintained.
- **Serverless / edge story** for white-label tenant deployments — Fly Machines on Node/Bun, Cloudflare Workers (with Durable Objects for session state), Vercel Functions — has a much better cold-start and image-size profile than Python.
- **MCP server ecosystem is TS-first.** When we add tenant-systems connectors we're more likely importing existing TS MCP servers than rolling Python ones.
- **Frontend symmetry** when v1.1 adds a chat UI — share Zod schemas between agent and React/Next.js, no protobuf or OpenAPI generators.

We accept one tradeoff: if v2 explores RL-style learned memory management (the Yu et al. AgeMem direction), we'll either bridge to a Python subprocess or accept thinner libraries. The build pipeline's one-off corpus-summarisation batch (auto-generating hier-tree summaries via Sonnet) is also TS in v1; if that ever needs heavier text-analysis tooling we may carve it out as a Python sidecar invoked from the build pipeline. Neither is a v1 concern.

### 4.3 What we deliberately do *not* build in v1

- **No invocation surfaces over code we own.** This single architectural restraint principle covers two specific commitments:
    - **No MCP wrapper around our own in-process logic.** Wrapping a TS function we own in an MCP server just to call it from an agent we also run in the same Node process is indirection for its own sake — three schema representations (TS/Zod signature, MCP schema, agent-facing schema), JSON-RPC serialisation overhead, a separate process to monitor, and harder stack traces. SDK-native in-process custom tools give us the same typed agent-facing surface with one source of truth.
    - **No custom CLIs over our own functions.** Building a `corpus`/`memory`/`register`/`primary-source` CLI so the agent can invoke it via Bash is the same kind of indirection — subprocess spawn, argv string-marshalling, stdout capture, exit-code-vs-`isError` translation — to call code in the same process. The composability story (Bash pipes) is also weak when the alternative is just sequencing typed-tool calls with no expressive loss and no parsing failure modes.
    - **MCP is reserved** for cases that actually cross a process / language / org boundary (per-tenant external systems, future Managed Agents migration, future third-party distribution).
    - **Custom CLIs are reserved** for cases where a consumer beyond our own agent (humans, CI, third-party integrations) genuinely needs shell composability — a v1.1+ distribution play, not now.
    - **Standard pre-existing shell tools** (`rg`, `jq`, `sed`, `awk`, `gh`, `git`) remain available via the Bash tool for genuine long-tail composability the agent already knows from training. We use them; we don't add to that lane.
- No fine-tuning, no LoRA, no learned memory controller (the Yu et al. RL approach is interesting but the cost/complexity is not justified at our scale yet — Pattern B from the 2026 survey first, Pattern C only when measured pain demands it).
- No multimodal memory.
- No multi-agent collaboration beyond sub-agents inside a single tenant session.
- No fancy graph DB. The corpus tag-graph fits in memory; A-Mem note links fit in Postgres.
- No bespoke vector DB. pgvector on Postgres for v1; defer Pinecone/Weaviate/Qdrant until we have a measured retrieval-quality problem they actually solve.

---

## 5. Memory architecture

We adopt the three-axis taxonomy from the 2026 surveys and map it to concrete SDK primitives. The taxonomy axes are **temporal scope**, **representational substrate**, and **control policy**. We commit to four memory tiers + one knowledge tier.

| Tier | Substrate | Control | Lifetime | SDK mechanism |
|---|---|---|---|---|
| **Working** | Context window | Heuristic (turn-based) | This turn | Native Claude Agent SDK context |
| **Episodic** | JSONL on disk | Heuristic (auto-persist) | This session, optional cross-session | SDK session files, `resume`/`fork` |
| **Semantic (private)** | A-Mem atomic notes in Postgres + pgvector | Prompted self-control via `memory.*` tools | Per tenant, persistent | In-process `@offshoreai/tools-memory` module (SDK-registered) |
| **Procedural** | Markdown SKILL.md files | Discoverable, model-invoked | Versioned in git | `.claude/skills/` + plugins option |
| **Canonical knowledge** | Markdown corpus + compiled artifacts | Read-only; never written by agents | Owned by editorial team; out-of-band updates | In-process `offshoreai.tools.corpus` (+ `corpus` CLI) and Read/Glob/Grep |

### 5.1 Canonical knowledge (the corpus itself)

The corpus is the **authority surface**. It is read-only to agents. Updates flow through the editorial process (PRs to the offshoreai repo) with explicit `last_verified` dating. The agent treats `last_verified > 180 days` as a soft warning to the user, and `last_verified > 365 days` or `status: stub` as a hard refusal-or-warn.

This separation is the single most important guardrail in the whole product. **Agent inferences never become corpus content.** This is how we avoid the "agent stores its own previous run as a confirmed fact and quietly poisons future runs" failure mode the Nate B Jones video and the surveys both flag as the central risk of reflective memory.

### 5.2 Procedural memory: Skills as personas + task bundles

Each persona/task pair becomes a Claude Skill. Concretely:

```
.claude/skills/
├── jersey-trust-officer/
│   └── SKILL.md          # "You are advising a TCB officer. Always..."
├── jersey-trust-officer-distribution/
│   └── SKILL.md          # invoked when "distribution" + "trust" appear
├── jersey-trust-officer-cdd-new-trust/
│   └── SKILL.md
├── jersey-fund-counsel/
│   └── SKILL.md
├── jersey-mlro-sar-threshold/
│   └── SKILL.md
└── jersey-baseline/
    └── SKILL.md          # always-on: citation rules, freshness rules, refusal patterns
```

The skill's `description` field is what Claude uses to decide whether to invoke. We get persona routing for free, model-side, instead of building a router.

Every use-case file in the corpus (`jersey/use-cases/trust-officer/article-47-set-aside-for-mistake.md` and its 32 siblings) gets a paired skill at `.claude/skills/jersey-trust-officer-article-47-set-aside/SKILL.md` that:
- Names which corpus files form the "bundle" for this task.
- Names the canonical statute Articles required.
- Names the tags whose graph to expand.
- Specifies the freshness window required (some answers tolerate older `last_verified`; sanctions screening does not).
- Specifies the citation pattern the answer must follow.

This is what makes the corpus "compile" into bundles. The skill is the **retrieval contract** for that persona/task combination.

### 5.3 Semantic memory: A-Mem-style atomic notes (private, per tenant)

For things the customer's agent learns *over time* — house views, client preferences, recurring matter context, internal precedents — we use an A-Mem-style note store:

- Each note is **atomic** (one fact / one observation), with a contextual description, keywords, and tags drawn from the corpus tag taxonomy.
- New notes are **auto-linked** to existing notes via embedding similarity + tag overlap, bidirectional.
- Notes can **evolve**: when a new note arrives that conflicts with or extends an existing one, the agent updates rather than overwrites.
- Retrieval is **two-stage**: embedding ANN to seed top-k, then graph traversal across links to surface contextually adjacent notes.

Implementation: Postgres with pgvector accessed via `drizzle-orm`; one schema per tenant; the `@offshoreai/tools-memory` TypeScript module exposes `memory.add`, `memory.search`, `memory.link`, `memory.evolve`, `memory.forget` as in-process SDK tools registered with Zod input schemas. The agent calls them explicitly — we use **prompted self-control**, not learned control, for v1.

Crucial: semantic-memory notes are **never** treated as authoritative for legal claims. They influence retrieval and framing, but every legal/regulatory assertion in the final answer must cite a corpus file. This is the firewall against the reflective-memory failure mode.

### 5.4 Episodic memory: SDK sessions

In the TS SDK, multi-turn conversations within a process are handled by passing `continue: true` on each successive `query()` call (the SDK picks up the most recent session in the current `cwd`). Persist the returned `session_id` in our app DB per (tenant, user, thread). Use `resume` with an explicit id to return to a specific past session; `forkSession: true` for "what if we tried it differently" branches the user requests. Use a `SessionStore` adapter to mirror JSONL transcripts to S3 so we can resume across hosts and survive container churn.

### 5.5 Working memory: context window

Default Sonnet 4.6 1M-context for most tenants; promote to Opus 4.7 for the citation-verifier sub-agent and for hard adversarial questions. Use the SDK's compaction. Use `CLAUDE.md` at the tenant repo root to inject persistent tenant context (firm name, regulated entities, default Court venue).

### 5.6 Why these five tiers and not more

The 2026 surveys list working / episodic / semantic / procedural as the canonical Baddeley-derived layering. We add **canonical knowledge** as a fifth tier because the corpus is qualitatively different from semantic memory: it is owned by the editorial process, externally authored, and version-controlled. Conflating it with semantic memory destroys the citation discipline.

### 5.7 Progressive disclosure & the context budget

A direct lesson from the Monigatti talk and from the Elastic team's own runtime experience: **skills should not be fully resident in context**. The Claude Agent SDK already implements the right pattern — skill *names + descriptions* sit in the system prompt; the skill *body* is loaded on demand when the model decides the skill is relevant. We commit to this pattern hard:

- **Always-resident**: only the `jersey-baseline` skill body (citation rules, freshness rules, refusal patterns, persona-routing heuristics). Everything else is name+description only.
- **On-demand load**: bundle-assembler loads the matching task-skill body when a query routes to a persona/task. A `PostToolUse` hook on the skill load tool tracks which skill bodies are currently resident.
- **Active offload**: when the conversation pivots away from a task (detected via the bundle-assembler re-evaluating the next user turn), the previously-loaded skill body is dropped from context and any details the agent still needs are written to the **scratch file store** (`/sandbox/<tenant>/scratch/<session>/`) as a 2-3 line plan-note. This mirrors the pattern Elastic's Joe described and the Claude Code compaction behaviour.
- **Plan file as scratchpad**: each session gets a `plan.md` in the scratch dir; the agent writes intent, sub-task status, and what to come back to. This is working memory that survives skill swaps without burning context tokens.

Concrete budget targets, against a Sonnet 4.6 1M-context default:

| Layer | Target tokens at steady state |
|---|---|
| System prompt + baseline skill body | ≤ 8k |
| Active task-skill body | ≤ 4k (only one resident at a time) |
| Active bundle (corpus files pre-loaded) | ≤ 30k for trust-officer tasks (median bundle is 12 files of ~2-3k each) |
| Always-resident tool schemas | ≤ 2k — ~15 high-frequency tools stay always-visible; specialised tools register but load on demand via the SDK's tool-search feature (zero schema cost when not loaded); see tool-sprawl risk in §15 |
| Scratch plan-notes from offloaded skills | ≤ 2k |
| Conversation history (pre-compaction) | ≤ 40k |
| **Steady-state window** | **≤ 86k** |
| **Headroom for tool results + reasoning** | ≥ 914k |

This is generous on purpose — the bundle approach trades context for retrieval round-trips, and we want enough headroom that even a heavy multi-turn matter doesn't trigger compaction mid-task.

A second-order effect from AXI's output discipline: tool-*result* tokens (what tools return on each call) are usually a bigger share of context than tool-*schema* tokens (what the agent sees up-front). Emitting TOON in the tool-result text block buys us roughly 40% per list-shaped response vs JSON, and the pre-computed-aggregate pattern (a single `corpus.getBundle(...)` call returning content + freshness + tag-neighbours in one envelope) further reduces round-trip cost. Over a 10-turn trust-officer matter the combined saving is on the order of 8-15k tokens against an equivalent JSON-only design. Worth tracking as a KPI (see §11.2).

---

## 6. Retrieval: contracts and primitives

### 6.1 Three retrieval primitives, not one

Following the "match the retrieval unit to the work" principle:

1. **Hierarchical tree retrieval (primary)**. The corpus is *already* a tree: section index → topic file → statute article. We build a one-off compile step that produces `hier-tree.json` — every node carries its file path, title, frontmatter tags, articles_covered, status, last_verified, and a 2-3 sentence summary auto-generated by a build-time Sonnet call (cached, re-run only on file change). The agent reasons over the tree to pick the right node — PageIndex-style. No embeddings on the bulk content.

2. **Tag-graph retrieval (cross-cutting)**. Compile `tag-index.json`: `{tag: [file_paths]}` plus a tag co-occurrence matrix. Exposed to the agent as `corpus.findByTag` (direct AND/OR intersection) and `corpus.expandTags` (nearest-neighbour expansion over the co-occurrence matrix). For queries like "Article 9 firewall AND US grantor trust AND forced heirship" the agent intersects tag sets to find cross-cutting files no single section would surface; for queries like "find me the tag-neighbourhood of `firewall`" it walks the co-occurrence matrix.

3. **Vector retrieval (fallback)**. pgvector index over per-file embeddings of the auto-generated summaries (not the body content). Exposed to the agent at runtime via `corpus.semanticSearch(query, k)`, not just as a build-time index. Used when (1) and (2) miss — fuzzy phrasing, novel terminology. This is the "vector search as plumbing" stance, deliberately small-footprint.

### 6.2 Bundles: compile, don't search

For every persona/task we know about (every use-case file), we pre-compile a **bundle**:

```yaml
# bundles/trust-officer/article-47-set-aside-for-mistake.yaml
persona: trust-officer
task: article-47-set-aside-for-mistake
required_files:
  - jersey/trusts/article-47-set-aside.md
  - jersey/trusts/article-47-set-aside-procedure.md
  - jersey/trusts/trusts-law-1984-articles-47-47I.md
  - jersey/use-cases/trust-officer/article-47-set-aside-for-mistake.md
required_articles:
  - { statute: trusts-law-1984, articles: ["47", "47A", "47B", "47C", "47D", "47E", "47F", "47G", "47H", "47I"] }
related_tags: [mistake, setting-aside, royal-court, court-application, hastings-bass]
related_bundles:
  - trust-officer/distribution-decisions-and-court-blessing
  - trust-officer/reserved-powers-blessed
freshness_max_age_days: 365
citation_required_per_claim: true
refuse_if_any_required_file_status: [stub]
warn_if_any_required_file_status: [draft]
```

The bundle is loaded by the matching skill at session start (via a `SessionStart` hook). The agent enters the conversation already holding the right corpus context — no first-turn rediscovery, no re-summarising files it summarised yesterday. This is the "knowledge-compilation stage moves reasoning upstream from retrieval" thesis from Pinecone Nexus, implemented over markdown instead of a proprietary engine.

v1 ships bundles for: all 4 cold-start orientation files + all 33 trust-officer use-cases + the 7 persona-overview bundles = **44 compiled bundles**.

### 6.3 The retrieval contract every answer must satisfy

```
For every claim of Jersey law/regulation/tax in the response:
  - cite at least one corpus file (relative path + section anchor)
  - that file must have status ∈ {review, stable}
  - that file's last_verified must be within the bundle's freshness window
  - prefer statute > regulator-guidance > gov-page > judgment > secondary
  - if only a secondary source supports a claim, flag explicitly
```

Enforcement: **citation-verifier sub-agent** runs as a `Stop` hook before the response is returned to the user. It re-reads each cited file, checks the claim is supported, and either passes or rejects-with-reason. On reject the main agent gets one retry to fix; on second reject the response is downgraded to "I don't have a confident answer; here is what the corpus does say" with raw citations.

### 6.4 Ambient retrieval via UserPromptSubmit

Bundles (§6.2) cover known persona/task combinations; the citation contract (§6.3) gates output. There's a gap between them: conversations evolve, users pivot, queries drift into corpus territory the bundle didn't anticipate. The agent can close the gap by explicitly calling `corpus.semanticSearch` mid-turn, but that relies on the agent recognising it doesn't know what it's missing. **Ambient retrieval** is the pull-based complement — automatic top-up of high-relevance corpus context on each user turn, before the model reads the new prompt.

For the broader rationale, design properties, and how this sits alongside the other customised agent behaviours, see [`AGENT-BEHAVIOURS.md`](AGENT-BEHAVIOURS.md) §3.

**Mechanism.** A `UserPromptSubmit` hook fires once per user turn before the model reads the prompt. The hook:

1. Scans the recent session transcript for **sentinel markers** of past ambient injections — each injection wraps content in `<!-- ambient-corpus-injection: <path>@hash=<sha> --> ... <!-- /ambient-corpus-injection -->`. Produces the set of (path, hash) pairs already injected ambiently this session.
2. Also reads a session-scoped "seen via Bash" log (populated by a PostToolUse hook on Bash that scans the command text for corpus paths in `cat`/`head`/`tail`/`less` invocations — see §7.0.2 Safety on the Bash lane).
3. Runs retrieval (`corpus.semanticSearch` + `corpus.findByTag` + `corpus.expandTags`) over the new prompt + a short summary of recent turns.
4. Filters out (path, hash) pairs from steps 1 and 2.
5. Takes top-K remaining candidates above a configurable relevance threshold; hard cap K = 2-3 per turn.
6. Injects them, sentinel-wrapped, as a synthetic ambient-retrieval block prepended to the user's prompt that the model is about to read. The block is formatted to look like a `corpus.*` tool result so the citation-verifier (§6.3) treats injected files as valid citation sources.

**Sentinel-based self-dedup is deliberate.** The main duplicate risk is ambient-vs-ambient (the same high-relevance file getting re-injected across many turns), not ambient-vs-explicit-call. Sentinels close ambient-vs-ambient exactly without requiring a separate state ledger — the SDK's session JSONL is the source of truth, scanned per turn.

**Tension with the bundle-first principle, addressed.** Bundles are the *primary* retrieval contract for known persona/task combinations; ambient is the *secondary* mechanism for conversation drift the bundle didn't anticipate. Without ambient, the agent's alternative is either (a) refuse / ask the user to refine, or (b) explicitly call `corpus.semanticSearch` itself. Ambient is the pull-based auto-version of (b) — same retrieval cost, just pre-emptive. The principle still holds: we don't search at query time *as the primary mode*; ambient is the safety net.

**Per-persona toggle.** Each persona's SKILL.md carries an `ambient_retrieval` config block: `{enabled: true|false, relevance_threshold: 0.0-1.0, k_max: 1-3, summary_turns: 0-5}`. Heavily-bundle-covered personas (trust-officer with comprehensive bundles) set the threshold high or disable. Thinly-bundled personas (journalist, exploratory cross-jurisdiction comparisons) benefit from aggressive ambient retrieval.

**Known limitation.** Sentinel dedup catches ambient-vs-ambient cleanly. PostToolUse-on-Bash logging catches `cat`/`head` discoveries explicitly. But `rg`/`grep` results that include corpus content as match snippets are *not* added to the "seen via Bash" set — those are treated as snippet-level discovery rather than full reads, and the matched files may still be ambient-injected on a later turn. Acceptable token-cost vs the alternative of an opaque "agent already saw enough of this" inference. Engineering can revisit if the audit log shows real duplication.

**Budget impact.** Ambient injections count against the steady-state context budget (§5.7). With K = 3 and median injected file ~3k tokens, ambient adds up to ~9k tokens per turn worst-case. The §5.7 budget table reserves headroom; the §11.2 KPIs include ambient-specific metrics.

---

## 7. Tool surface

One lane for everything we own, plus the agent's existing shell muscle for the genuine long tail.

- **Typed in-process tools** registered with the Claude Agent SDK via Zod input schemas. This is the default and the only lane we *build* for our own logic (`corpus`, `memory`, `register`, `primarySource`, `freshness`).
- **Tool search** ([SDK feature](https://code.claude.com/docs/en/agent-sdk/tool-search)) for scaling the typed surface past ~15 tools without paying always-resident schema cost — the SDK-native answer to schema bloat.
- **Bash + standard pre-existing shell tools** (`rg`, `jq`, `sed`, `awk`, `head`, `wc`, `gh`, `git`) for genuine long-tail composability the agent already knows from training. We *leverage* this lane; we don't add to it.
- **One MCP server** in v1: `tenant-systems-mcp` (§7.5) — used because the customer's external systems genuinely cross a process / language / org boundary that we do not own.

What we explicitly do not build (per §4.3 and Appendix C): MCP wrappers around our own in-process logic; custom CLIs that mirror our own functions for the agent to invoke via Bash. Both are indirection over code we own and an agent we control.

### 7.0 Tool-surface design principles

The Monigatti/Elastic finding that context engineering is ~80% agentic search means our tool surface *is* most of the product surface. We commit to four principles:

**Principle 1 — Low floor, high ceiling.** Specialised typed tools (`getArticle`, `findByTag`, `getBundle`) carry the common-case load: cheap, deterministic, easy for even small models to call correctly. The high-ceiling lane has two components: (a) **tool search** lets us register more typed tools than we keep always-resident — specialised paths load on demand when their descriptions match the query, with no per-turn schema cost for unloaded tools; (b) **Bash + standard shell tools the agent already knows** (e.g. `rg` over the corpus filesystem as a freshness-independent fallback, `jq` on a tool-result that returns structured JSON) for composition the typed surface can't naturally express. The agent picks based on tool descriptions and reinforcement in the baseline skill.

**Principle 2 — Tool descriptions are the contract.** Every typed tool ships with a description structured as: (a) **core purpose**, (b) **when to use**, (c) **when NOT to use** (especially relative to overlapping tools), (d) **relationships and ordering** ("call `freshnessCheck` first if the user mentions 'current' or 'latest'"), and (e) **parameter discipline notes**. The description lives on the SDK tool registration (it's what the model sees when deciding to call). One-line descriptions are a footgun once a second overlapping tool exists. For tools that load via tool search, the description is also the matcher — sloppy descriptions mean tools that should load don't, and tools that shouldn't load do.

**Principle 3 — Errors are the agent's job to handle, not the harness's.** Every tool wraps in try/except and returns the error string *as the tool response*, never as an exception that crashes the loop. The agent retries, rewrites, or escalates. The harness only intervenes when a tool exceeds its retry budget.

**Principle 4 — Parameter complexity is a failure axis; pay it down with skills.** A tool with a single typed parameter (`get_article(statute, article)`) is robust across all models. A tool that takes a free-form query (`execute_corpus_search(esql_query)`) is brittle even on strong models. When we need a high-ceiling tool, we pair it with a **Skill** whose body documents the query language, loaded only when the tool is invoked (progressive disclosure — see §6.6).

**Principle 5 — Push-based explicit tool calls and pull-based ambient retrieval coexist.** The typed `corpus.*` lane is the agent's *explicit* retrieval surface: it knows what it needs and calls for it. Ambient retrieval (§6.4) is the *implicit* surface: the runtime pre-emptively injects high-relevance corpus context the agent didn't think to ask for, via a `UserPromptSubmit` hook with sentinel-based self-deduplication. The two are designed to coexist — explicit calls dominate for known persona/task work, ambient covers conversation drift. Both are budget-aware, both are observable via the audit log (§11.3), both produce material the citation-verifier (§6.3) treats as a valid source. For the full design of ambient retrieval and the other customised behaviours, see [`AGENT-BEHAVIOURS.md`](AGENT-BEHAVIOURS.md).

### 7.0.1 The three failure modes we are designing against

From Monigatti's taxonomy, mapped to mitigations in our stack:

| Failure mode | Example in our domain | Mitigation |
|---|---|---|
| **Agent doesn't call any tool** — answers from parametric knowledge | Agent guesses what Article 9 says instead of fetching it | Baseline skill mandates: *every* Jersey legal claim must come from a tool call into `corpus.*` or `primary_source.*` (typed or CLI). Citation-verifier rejects responses with claims unbacked by a tool result in the session log |
| **Agent calls the wrong tool** | Reaches for `WebFetch` on `jerseylaw.je` instead of the cached `primary_source.fetch` | Tool descriptions include "do not use WebFetch for jerseylaw.je / gov.je / jerseyfsc.org — use `primary_source.fetch` or `primary-source fetch <url>`"; PreToolUse hook on WebFetch rejects URLs that match those hosts |
| **Agent calls the right tool with wrong parameters** | Searches `find_by_tag("zero-10")` instead of `"zero-ten"` | Tag whitelist enforced server-side with a "did you mean" response; `glossary_lookup` for term normalisation; bundle-pre-load means the most common tags are already in context |

### 7.0.2 Output discipline — what survives from AXI on the typed SDK tool surface

AXI was originally a spec for *agent-driven CLIs*. We don't build CLIs over our own functions (per §4.3 and Appendix C), so the CLI-implementation parts of the spec (subcommand discovery, `--help` fallback, exit codes, ambient `bin:` dashboard) don't apply to us. The output-discipline parts do — and they carry over to typed SDK tool results cleanly. These are the conventions every in-process tool we ship adheres to:

1. **TOON output, not JSON, in the tool-result text block.** The handler returns `CallToolResult` with `content: [{ type: "text", text: "<TOON string>" }]`. Text reaches the agent verbatim — the SDK does not re-serialise the payload, only the thin envelope wraps it. We deliberately leave `structuredContent` unset (setting it would cause the SDK to drop text blocks and forward JSON instead — the opposite of what we want; we add a lint rule that fails the build if any handler sets `structuredContent`).

    Concrete shape for a tag lookup:

    ```
    count: 8 of 866 total
    files[8]{path,status,last_verified,tags}:
      jersey/trusts/firewall.md,stable,2026-04-12,firewall|conflict-of-laws|forced-heirship
      jersey/trusts/article-9.md,stable,2026-04-12,firewall|trusts-law-1984
      ...
    help[3]:
      Call `corpus.getFile` with path=<path>
      Call `corpus.freshnessCheck` with paths=[<path>]
      Call `corpus.findByTag` with tags=[<tag>] and fields=["path","title","sources"]
    ```

    JSON is emitted only by (a) the future MCP wrapper (Appendix C), where MCP convention requires JSON in `structuredContent`, and (b) `JSON.stringify` for tests and debugging. The agent's normal reading path never sees JSON.

2. **Minimal default field schemas.** A list response returns 3-4 fields per row by default (e.g. `path`, `status`, `last_verified`, `tags`). The full ~12-field frontmatter is available via an opt-in `fields` parameter on the tool input (`fields: ["title","sources","articles_covered","see_also"]`).

3. **Content truncation with size hints.** `corpus.getFile` returns the first ~120 lines by default with an AXI-style hint: `(truncated, 487 lines / ~9200 tokens total — call again with full=true to see complete file)`. Critical for the corpus because individual statute-article files run 200-800 lines.

4. **Pre-computed aggregates that eliminate round-trips.** `corpus.getBundle` returns the bundle yaml *and* freshness verdicts for every referenced file *and* the resolved tag-neighbours in a single tool-result. The agent does not have to call freshness and tag-expand separately. This is the AXI "combined operations" pattern applied to our domain.

5. **Definitive empty states.** Zero-match results return `count: 0` followed by an explicit no-match line (e.g. `files: None matching tags firewall + xyz-not-a-real-tag — did you mean: forced-heirship?`). Silence is forbidden — an agent cannot distinguish "no result" from "tool errored" otherwise.

6. **Structured errors via `isError: true` + TOON envelope in the text block.** Errors carry a stable envelope so the agent can dispatch on `error_kind`:

    ```
    error_kind: stale_corpus
    path: jersey/trusts/firewall.md
    last_verified: 2025-09-03
    age_days: 622
    threshold_days: 365
    help[2]:
      Call `primarySource.fetch` with url="https://www.jerseylaw.je/laws/current/l_4_1984"
      Call `corpus.freshnessCheck` with paths=[<path>] and override=true (requires reason)
    ```

    The handler returns the envelope in `content[0].text` and sets `isError: true` on the `CallToolResult`. The SDK propagates `isError` to the model as a first-class error signal, so the agent treats it as a failed call (retry / pivot / explain) rather than odd-looking data. Without `isError` the model has to infer failure from envelope shape; with it, dispatch is unambiguous.

7. **`help[]` blocks suggest next-step tool calls, not commands.** Every successful tool-result ends with 2-4 `help[]` lines naming specific tool calls with `<placeholder>` syntax (never invented values). This is the AXI "contextual disclosure" pattern transposed to in-process tool-calling: turns navigation from a guessing game into a guided walk through the tool surface.

8. **Mutations are idempotent.** `memory.add` deduplicates by content hash + tags; a second call returns the existing note id rather than creating a duplicate. `memory.evolve` is upsert-with-history, never overwrite-and-lose.

#### Shared shape declaration — one type, multiple renderers

For each tool we define one Zod shape and a small set of renderers over it:

```ts
// One shape, declared once
export const BundleResult = z.object({
  persona: z.string(),
  task: z.string(),
  files: z.array(z.object({
    path: z.string(),
    status: z.enum(["stub", "draft", "review", "stable"]),
    lastVerified: z.string(),  // ISO date
    ageDays: z.number(),
    tags: z.array(z.string()),
  })),
  freshness: z.enum(["fresh", "warn", "stale"]),
  tagNeighbours: z.array(z.string()),
});
export type BundleResult = z.infer<typeof BundleResult>;

// Input schema is the same Zod, fully validated at runtime
export const BundleInput = z.object({ persona: z.string(), task: z.string() });

// Function returns the typed object — no serialisation here
export async function getBundle(input: z.infer<typeof BundleInput>): Promise<BundleResult> { ... }
```

The renderers consume the typed value:

| Renderer | When it runs | Output | Output validation |
|---|---|---|---|
| `toon(result, BundleResult)` | SDK tool-result `content[0].text` | TOON text, field list derived from `BundleResult` keys | None (we own the values) |
| `JSON.stringify(result)` | Tests, debug logging | JSON text | None |
| `mcpEnvelope(result, BundleResult)` | Future v2 MCP wrapper | JSON in `structuredContent`, schema published from Zod | Zod schema as the MCP output contract |
| `formData(result)` | Future v1.1 frontend | Plain TS object over the wire | Zod re-validates on the frontend's input boundary — different boundary, different lane |

Compile-time guarantee: every renderer agrees on the shape. Runtime cost on the hot path is zero — TOON rendering is direct field access; we lift `Object.keys(BundleResult.shape)` to a module-level constant so there's no per-call schema introspection.

#### Session-start ambient context

We register a `SessionStart` hook that injects a per-tenant corpus/memory dashboard once at the top of every session — file count by section, stub/draft/stale counts, the currently warm bundle, the tenant's open memory notes count. The agent opens every conversation already knowing what's stale, which bundle is hot, and where the gaps are. This is the AXI "ambient context" pattern transposed: not a `bin` running with no args, but a hook that prints the same shape of information into the system context.

#### Safety on the Bash lane

The Bash tool is enabled for the standard-shell-tools high-ceiling lane (`rg`, `jq`, `sed`, `awk`, `head`, `wc`, `gh`, `git`), but restricted: per-tenant sandbox directory (`/sandbox/<tenant-id>/`), deny-list enforced via the SDK's `canUseTool` callback (`rm -rf`, network egress to non-allowlisted hosts, `sudo`, package installs), and a PATH limited to the whitelisted standard tools. The agent has no custom CLIs of ours to call; it has standard shell tools and the typed SDK lane.

### 7.1 `corpus.*` (in-process, shared, read-only)

TypeScript module `@offshoreai/tools-corpus`. Functions defined with Zod input schemas; SDK-registered as typed in-process tools. Output is TOON-formatted text in the tool-result `content[0].text` block per §7.0.2.

**Read individual items**
- `corpus.getFile(path)` → file content + frontmatter
- `corpus.getArticle(statute, article)` → canonical article-wiki file
- `corpus.glossaryLookup(term)` → from `jersey/glossary.md`

**Navigate by structure**
- `corpus.findByTag(tags, mode = "and")` → matching file paths
- `corpus.expandTags(tags, k = 5)` → nearest-neighbour tags from the co-occurrence matrix; lets the agent broaden a tag set when direct intersection returns too few hits
- `corpus.neighbours(path, kinds = ["see_also", "backlinks", "tag"])` → one call returning the file's `see_also` targets, its backlinks (files that link *to* it), and its tag-neighbours. Pre-computed-aggregate per §7.0.2 — three relationships, one round-trip
- `corpus.tree(section?)` → hierarchical view from `hier-tree.json` for PageIndex-style traversal

**Discover across the corpus**
- `corpus.semanticSearch(query, k = 10)` → ranked `(path, score, summary)` rows over the pgvector summary index. The runtime exposure of §6.1 primitive 3; fallback for fuzzy phrasing and novel terminology that tag/tree retrieval misses
- `corpus.inventory(filter)` → status / age / tag / section filtered listing (e.g. `{status: "stub", section: "trusts"}`, `{lastVerifiedOlderThanDays: 180}`, `{recentlyChangedDays: 14}`). Covers editorial backlog, freshness survey, and changelog access in one tool

**Aggregate per persona/task**
- `corpus.getBundle(persona, task)` → bundle yaml + all referenced files + freshness verdicts + tag-neighbours, in one envelope (AXI pre-computed-aggregate)

**Freshness gate**
- `corpus.freshnessCheck(paths)` → `(path, lastVerified, status, ageDays)` rows

**Loading discipline.** Of these 11 tools, the high-frequency ones stay always-resident (`getFile`, `getArticle`, `findByTag`, `getBundle`, `freshnessCheck`, `neighbours`, `tree`, `glossaryLookup` — ~8 tools, well under the §5.7 cap of 15). The specialised tools (`expandTags`, `semanticSearch`, `inventory`) register via the SDK's tool-search feature and load only when their descriptions match — they cost nothing per turn until the agent reaches for them. This split is what keeps the corpus surface generous without pushing the always-resident schema budget toward the ~30-tool knee AXI's benchmarks identify.

### 7.2 `primarySource.*` (in-process, shared, read-only)

TypeScript module `@offshoreai/tools-primary-source`. Cached, version-aware fetcher for `jerseylaw.je`, `gov.je`, `jerseyfsc.org`, `statesassembly.je`. Returns the live primary-source content plus the last-modified header. The agent uses this when:

- A corpus file's `last_verified` is older than the primary source's last-modified — emits a "corpus is stale relative to primary source" signal.
- The user explicitly asks for "the current text of Article X" — we serve the primary source, not just our corpus.

This is the **trust amplifier** layer. We are not the source of truth for Jersey law; `jerseylaw.je` is. We are the agent that knows which paragraph of which Article to fetch and what it means.

### 7.3 `register.*` (in-process, shared, read-only or scraped)

TypeScript module `@offshoreai/tools-register`. Read-only access to JFSC public register, Jersey companies register, charities register. Where these don't expose APIs we screen-scrape with caching (using `cheerio` for HTML parsing) and clearly mark the data as "scraped, accessed at T". v1 launches with read-only; never writes to any government system.

### 7.4 `memory.*` (in-process, per-tenant)

TypeScript module `@offshoreai/tools-memory`. The A-Mem-style atomic-note store. Functions: `memory.add`, `memory.search`, `memory.link`, `memory.evolve`, `memory.forget`, `memory.listByTag`, `memory.diff`. Backed by per-tenant Postgres+pgvector schema accessed via `drizzle-orm` with its `pgvector` plugin; the tenant id is injected from the SDK options at session start.

### 7.5 `tenant-systems-mcp` (per-tenant, configurable — the *only* actual MCP server in v1)

The boundary-crossing case that genuinely earns the MCP indirection. Bridges to the customer's own systems (NavOne, Viewpoint, Salesforce, M-Files, OneDrive, signing platforms). These are:

- run in different processes (often in different clouds);
- often written in non-Node stacks (Java, .NET, ABAP, custom);
- often owned by the customer, not us — versioning is theirs to control;
- best authenticated per-tenant with the customer's own creds.

MCP is the right abstraction here precisely because the boundary is real. We ship reference connectors for NavOne, Viewpoint, Microsoft 365 (Files + Outlook), and Salesforce; customers can plug in any other MCP-compatible server they have. Outbound writes (sending an email, creating a calendar event) are **never auto-approved**; the SDK's `canUseTool` callback prompts the human.

### 7.6 When a future MCP wrapper is justified

We will add MCP wrappers around our in-process modules (`corpus`, `memory`, `register`, `primary-source`) only when one of these is true:

1. We migrate tenant runtimes to Anthropic Managed Agents (planned v2). The hosted sandbox cannot import our TS modules; it can only reach us over MCP.
2. A customer wants to plug our corpus into a non-Agent-SDK client (their own Claude Code, Cursor, an in-house tool). This is a v1.1+ distribution play.
3. A third-party team wants to embed our domain expertise in their own agent.

In each of these cases the MCP wrapper is mechanical (auto-generated from the same Zod schemas and JSDoc/TSDoc comments — the official MCP TS SDK accepts Zod input/output schemas directly) and earns its keep at the boundary it actually crosses. We don't write it now.

A neat consequence of the `CallToolResult` shape: when we do add the MCP wrapper, we can populate **both** `content` (our existing TOON text, for consumers that read text — including, still, any Agent SDK client) **and** `structuredContent` (a JSON object whose schema is published from the same Zod definition, for machine consumers that want typed JSON). One backing function, two consumer types, no compromise on either. The in-process v1 deliberately leaves `structuredContent` unset because setting it would suppress the text block on Agent SDK consumers — but that constraint relaxes when we're producing for a mixed audience.

---

## 8. Sub-agents

Three first-class sub-agents in v1, defined via `AgentDefinition` with curated tool lists:

| Sub-agent | Purpose | Tools |
|---|---|---|
| `bundle-assembler` | At SessionStart, choose the right bundle and load it into context. Re-runs mid-session if the user pivots persona/task. | `corpus.*`, Read |
| `citation-verifier` | Stop-hook gate. Re-reads every cited file, checks support, returns pass/fail with reasons. | `corpus.*`, Read, Grep |
| `freshness-checker` | At PreToolUse on `corpus.*` calls, decides whether to also fetch primary source. Returns a stale/fresh verdict. | `corpus.*`, `primary_source.*` |

A fourth, opt-in for v1.1: `cross-jurisdiction-comparer` for the eventual Guernsey/IoM/BVI/Cayman expansion.

Sub-agent runs are isolated context windows — we don't pollute the main agent context with verification scratch. The main agent only sees the verifier's verdict.

---

## 9. White-label / multi-tenancy

### 9.1 Tenant model

Each tenant is a directory under `tenants/<tenant-id>/`:

```
tenants/crestbridge/
├── CLAUDE.md             # tenant context, regulated entities, house style
├── .claude/
│   ├── skills/           # tenant-specific skills overlay
│   └── settings.json
├── memory.db.url         # pointer to tenant's pgvector schema
├── mcp-config.json       # tenant MCP creds (encrypted at rest)
└── sessions/             # SessionStore mirror (or S3 path)
```

The baseline corpus and the baseline skills are **mounted read-only** from the offshoreai repo at agent startup. Tenant skills override matching baseline skills (name collision rule: tenant wins). Tenant memory is fully isolated — no shared embeddings, no shared notes, no shared session state.

### 9.2 Customisation surface for tenants

What a tenant can customise (and how):

- **House view on a topic** → add a tenant skill named `jersey-trust-officer-article-47-set-aside` that overrides the baseline; tenant skill links back to baseline skill so the agent has both.
- **Internal precedents** → ingest into A-Mem notes via a one-shot importer; thereafter live in semantic memory.
- **System integrations** → register `tenant-systems-mcp` connectors.
- **Style and disclaimer language** → CLAUDE.md.
- **Approval policies** (e.g. "never draft a Court application without partner review") → hooks in `.claude/settings.json` (PreToolUse for Edit/Write, or canUseTool callback).

### 9.3 What tenants cannot do

- Cannot edit the canonical corpus.
- Cannot disable the citation-verifier sub-agent.
- Cannot disable freshness checks.
- Cannot grant the agent write access to government systems.

These are non-configurable. They are the product.

---

## 10. Build & compile pipeline

A small TypeScript build tool (`@offshoreai/build`, runnable as `pnpm build:corpus`) runs:

1. **Walk the corpus** using `fast-glob`, parse frontmatter with `gray-matter`, validate against a `zod` schema derived from `CONVENTIONS.md` (status enum, tag whitelist from `TAGS.md`, link validity via `remark-validate-links`, frontmatter completeness). Existing convention enforcement, formalised.
2. **Compile `hier-tree.json`** — nodes for every section index + file, with auto-summaries (1-3 sentences) generated by a Sonnet 4.6 batch job (via `@anthropic-ai/sdk`, with prompt caching). Cached on file SHA — re-run only on change. Budget estimate: ~870 files × ~$0.001/file with prompt caching ≈ $1 per full rebuild.
3. **Compile `tag-index.json`** — direct walk of frontmatter, output as a JSON `Record<Tag, FilePath[]>` plus a co-occurrence matrix.
4. **Compile vector index** — embed each summary with Voyage 3 (`voyageai` npm package or raw `fetch`), store in pgvector (shared schema) via `drizzle-orm`.
5. **Compile bundles** — read each `bundles/*.yaml` with `yaml` package, validate against a `zod` bundle schema, confirm every referenced file exists and isn't a stub.
6. **Run evals** (section 11) via `vitest` with custom matchers for the three eval tracks.

The build runs on every PR via GitHub Actions (`actions/setup-node@v4` + `pnpm install --frozen-lockfile` + `pnpm build:corpus` + `pnpm test`); failing convention checks block merge.

---

## 11. Evals & success metrics

### 11.1 Eval suite

Three eval tracks, run on every build and weekly against production logs.

**Track 1 — Bundle assembly**. 100 hand-curated queries per persona; check that the right skill triggers and the right bundle loads. Pass/fail per query. Target: ≥ 95% correct bundle on trust-officer in v1.

**Track 2 — Answer quality** (gold standard). 50 hand-curated trust-officer questions written with reference answers by a Jersey-qualified lawyer (we hire one part-time for this; budget ~£3-5k for the gold set). Each model answer is scored on:
- Citation precision (did every claim cite a corpus file?) — target 100%.
- Citation recall (did the agent use the most authoritative available source?) — target ≥ 90%.
- Legal correctness (judged by the lawyer) — target ≥ 90% "fully correct", ≤ 5% "wrong in a material way".
- Freshness handling (does the agent flag stale `last_verified`?) — target 100%.

**Track 3 — Memory-in-action** (our MemoryArena analogue). Multi-turn scenarios where the agent must use semantic-memory notes from a prior session. 20 scenarios per persona. We deliberately include adversarial cases where a stored note conflicts with the corpus — the agent must surface the conflict, not silently obey the note.

### 11.2 Production KPIs

- **Refusal rate** on stub/stale content (good if it's catching real stubs; bad if it's spuriously refusing answerable questions).
- **Average bundle-load tokens** — track context efficiency. Target < 8k tokens loaded per query for bundle content (Mem0's reported bar). Steady-state working set per §5.7.
- **Citation-verifier reject rate** — first-pass reject rate ≤ 15%; post-retry reject rate ≤ 2%.
- **Tool-call count per resolved query** — Monigatti's leading indicator that a tool is too general-purpose. Target median ≤ 3 tool calls for bundle-covered queries; ≤ 6 for fallback Bash-lane queries. A bundle whose median tool-call count rises over time gets flagged for re-compilation.
- **Tool-search load rate** — % of turns where the agent loads a previously-unloaded specialised tool via the SDK's tool-search mechanism. Healthy range 5-15%. Below 5% probably means we've over-specialised (or under-instrumented our tool descriptions for searchability); above 15% means we're missing common-case tools from the always-resident set that should be promoted.
- **Standard-shell-tool usage rate** — % of turns where the agent reaches for `rg`/`jq`/`sed`/`gh`/`git` via Bash. Healthy is whatever's natural; what we *watch* for is monotonic growth, which would suggest a missing typed tool the agent is routing around with shell composition.
- **Skill-body residency time** — average wall-clock duration a task-skill body sits in context before being offloaded to scratch. Long residencies are a context-rot risk; short residencies that thrash are a re-load cost.
- **Always-resident schema tokens** — sum of tool-schema bytes the SDK injects into every turn. Hard cap at 2k (≤ ~15 always-visible tools). Tools loaded on demand via tool search add to the per-turn cost only when they're actually loaded, so this metric only tracks the always-resident set. AXI's benchmarks suggest schema overhead becomes the dominant input-token cost past ~30 tools — we stay well clear of that knee.
- **Tool-result tokens per session, with notional-JSON delta** — track tool-result token totals as the primary number (TOON is now the only agent-facing output format, so there's no live JSON baseline to shadow-run against). Alongside each TOON tool-result we log the byte length of `JSON.stringify` of the same typed value at emit time; aggregate the delta to confirm we're realising the AXI-claimed ~40% saving. If the gap collapses (e.g. because our payloads are mostly long prose where TOON's structural savings don't apply), that's an architectural signal — investigate per tool, not a system-wide regression.
- **Output-discipline conformance score** for our typed SDK tools — automated check on every PR that each tool handler: (a) emits TOON in the `content[0].text` block, (b) never sets `structuredContent` (lint rule), (c) emits `help[]` blocks with `<placeholder>` syntax suggesting follow-up tool calls, (d) returns a definitive empty-state message on zero-result queries, (e) uses the stable error envelope with `isError: true` on failures. 100% conformance gate before release.
- **Ambient injection rate** (§6.4) — % of user turns where the `UserPromptSubmit` hook injects at least one corpus file. Tracked per persona. Healthy range depends on the persona's bundle coverage: ≤ 5% on heavily-bundle-covered personas (trust-officer) suggests the bundle is doing its job; 20-40% on thinly-bundled personas (journalist, cross-jurisdiction comparisons) is expected.
- **Ambient hit rate** — % of ambient-injected files the agent subsequently cites in its response. Measures whether ambient injections are actually useful. Target ≥ 50%; below 30% means the relevance threshold is too loose and the agent is paying token cost for context it doesn't use. Below 10% means ambient is essentially noise — investigate per persona.
- **Ambient duplicate-injection rate** — % of injected files where the sentinel-dedup or Bash-log dedup should have caught a prior delivery but didn't (detected via post-hoc replay analysis). Target 0%; any non-zero is a bug, not a tuning signal.
- **Customer task NPS** per persona.
- **$ cost per resolved query** — to be tracked from day one. The Anthropic OAuth credit allocation gives us a real spread between marginal cost and list price; we need the operational data to know how big.

### 11.3 Observability — logging is the bundle-prioritisation engine

Every tool call (typed in-process, CLI, or MCP-external), every skill load, every memory operation, and every citation-verifier verdict streams to a per-tenant event log (Postgres `tool_events` table; mirrored to S3 in JSONL). We use these logs for three things:

1. **Bundle prioritisation.** Weekly job ranks observed (persona, task-shape) pairs by frequency × current-fallback-rate. The top N un-compiled pairs become the next bundle batch. This is exactly the "ask the agent what tools to build next, based on three days of logs" pattern Monigatti described from her own open-claw experiments.
2. **Tool-description regressions.** If the wrong-tool-call rate for a given tool rises week-over-week, the tool description is regressed against a held-out routing eval; fix lands as a description rewrite, not a hot patch in the system prompt.
3. **Replay & memory diff.** A `pnpm replay <session_id>` developer command (engineer-facing, not agent-facing) replays the session against the current corpus state and highlights claims that would now be wrong (because `last_verified` rolled forward, a statute changed, or a memory note evolved). This is the bedrock of the verifier-as-eval-service product surface in open question 6.

---

## 12. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Language / runtime | **TypeScript 5.x strict + Node 22 LTS** (Bun for tenant runtimes once its FFI/Postgres story matures) | Section 4.2 |
| Agent SDK | **`@anthropic-ai/claude-agent-sdk`** (TS) — bundles the native Claude Code binary as an optional dep | Same feature set as the Python SDK; one fewer install step; TS-first MCP ecosystem |
| Schema / validation | **`zod`** | Runtime input validation (SDK tool inputs, CLI args, frontend request bodies — these are the boundaries with untrusted data). On the output side Zod is a shape declaration only: `z.infer` gives the TS return type; `Object.keys(schema.shape)` drives TOON header generation; no per-call runtime validation on the output path |
| Markdown / frontmatter | **`gray-matter`** + **`unified`** + **`remark-parse`** + **`remark-frontmatter`** | Mature AST tooling; the build pipeline reads these as ASTs not strings |
| CLI framework | None for agent-facing tools (we don't ship custom CLIs over our own logic — see Appendix C). **`commander`** may appear for engineer-facing developer commands (`pnpm replay`, `pnpm build:corpus`) | Keeps the agent-facing surface to typed SDK tools only |
| Database | **Postgres + pgvector** via **`drizzle-orm`** (pgvector plugin) and **`postgres`** (porsager driver) | Single technology for relational + vector; Drizzle gives type-safe queries from the same TS types we use everywhere else |
| Embeddings | **Voyage 3** via raw `fetch` (or `voyageai` package) | Best-in-class for legal/long-doc retrieval; cheap and async; no SDK lock-in |
| Default model | **Sonnet 4.6 1M** | Best price/quality for long-context reading |
| Citation-verifier model | **Opus 4.7 1M** | Higher precision matters more than latency for the gate |
| Testing | **`vitest`** | Fast, ESM-native, parallel; custom matchers for our three eval tracks |
| Build / bundling | **`tsup`** (esbuild-based) for libraries; **`pnpm`** workspace for the monorepo | Zero-config, fast, hands off |
| Object storage | **S3** (or R2 if we go Cloudflare) | SessionStore mirror, file checkpointing |
| Auth | **Anthropic API key per tenant**; Pro/Max OAuth credit for low-volume internal tools | Anthropic does not permit third-party developers to expose claude.ai login to end users |
| Deployment | **Fly Machines** for tenant runtimes (stateful, Postgres co-located); **GitHub Actions** for build/test/eval; **Cloudflare Workers** later if we expose a read-only public corpus API at the edge | TS Node runtime + Postgres + S3 = standard boring SaaS shape; serverless-friendly cold starts |
| Frontend | None in v1 | API-first; customers integrate via the SDK or via our agent endpoint. UI is v1.1, will share Zod schemas with the agent |

---

## 13. v1 scope

### In scope
- Build pipeline (validation, hier-tree, tag-index, vector index, bundle compile).
- **Four in-process toolsets** (`corpus`, `primarySource`, `register`, `memory`) registered as SDK tools with Zod input schemas and TOON-formatted output per §7.0.2. Tool search wired up for specialised tools that should load on demand. Plus **one MCP server**: `tenant-systems-mcp` for per-customer external systems (stub with 2 reference connectors).
- 3 sub-agents (bundle-assembler, citation-verifier, freshness-checker).
- **Seed bundles only**: 4 orientation + ~5 hand-picked trust-officer + 7 persona overviews ≈ **16 bundles at week-7**. Remaining bundles compiled in batches from shadow-pilot logs (weeks 9-11), targeting ≥90% coverage of observed pilot queries by week 11.
- Always-resident baseline skill + on-demand task-skill bodies with active offload to scratch (per §5.7 progressive disclosure).
- High-ceiling Bash + sandbox + deny-list as the long-tail escape hatch for queries no bundle covers.
- Eval suite (Track 1 + Track 2 + Track 3) with 50-question gold set; tool-call telemetry as the bundle-priority signal.
- API + CLI runtime.
- Single white-label tenant deployment (trust-officer flavour).

### Explicitly out of scope (for v1)
- UI / chat front-end.
- Document drafting (Court applications, deeds) — v1.1.
- Other jurisdictions.
- Outbound writes to anything other than the user's own filesystem.
- Learned memory controller (Yu et al. RL approach).
- Multi-agent debate / committee patterns.

### Coverage gaps in the corpus that v1 must close
From the exploration report, the corpus is sparse on: **employment law, real estate, Jersey Data Protection Law, charities, matrimonial, Royal Court procedure depth, full JFSC code-of-practice coverage, FSDI beneficial-ownership register, insolvency/désastre, advocate regulation**. For v1, the trust-officer agent only marginally needs employment / real estate / matrimonial — but **JFSC code-of-practice depth and BO register coverage are blocking** for the compliance/MLRO persona. Editorial sprint required alongside engineering: ~6 weeks of corpus writing on JFSC codes + BO register + désastre.

---

## 14. Milestones (proposed)

The build order deliberately follows Monigatti's advice: ship a **high-ceiling general-purpose** surface first, instrument every tool call, then compile **specialised tools and bundles from observed patterns** rather than guessing them. We do *not* try to write all 33 trust-officer bundles up front — we write the four orientation bundles and let logs tell us which use-cases are actually hit and how, then compile the rest in priority order.

| Week | Milestone |
|---|---|
| 1-2 | Build pipeline; convention validator; hier-tree & tag-index compile; tag whitelist enforcement |
| 3 | `@offshoreai/tools-corpus` TS module — SDK-registered as typed in-process tools with Zod input schemas and TOON output per §7.0.2; tool-description discipline applied per §7.0; tool-search wiring for the specialised long tail |
| 4 | `@offshoreai/tools-memory` TS module (SDK tools); Postgres schema via drizzle-orm; A-Mem semantics implemented |
| 5 | `@offshoreai/tools-primary-source` TS module (SDK tools) + caching; freshness-checker sub-agent; Bash + sandbox + `canUseTool` deny-list (PATH limited to standard shell tools `rg`/`jq`/`sed`/`gh`/`git`); `tenant-systems-mcp` stub with reference connectors |
| 6 | Citation-verifier sub-agent + Stop hook; baseline skill (always-resident, ~8k tokens); 4 orientation bundles compiled |
| 7 | Bundle-assembler + SessionStart hook; **5 hand-picked seed trust-officer bundles** (CDD, distribution, sanctions, Article 47, SAR threshold) — picked because they are the highest-frequency questions from the corpus's own use-case index |
| 8 | **Shadow pilot opens** with 2-3 friendly TCBs on the seed bundles; every tool call logged to a bundle-recommendation table; eval Track 1 (bundle routing) running on hand-curated queries |
| 9 | Eval Track 2 (gold set); first **log-driven bundle batch** — compile the next 5-8 bundles that the shadow-pilot logs prioritise; observability dashboard (memory diff, replay) live |
| 10 | Eval Track 3 (memory-in-action, our MemoryArena analogue); SessionStore S3 adapter; second log-driven bundle batch |
| 11 | Hardening, audit log, progressive-disclosure budget metrics; bundles compiled to cover ≥90% of observed shadow-pilot queries |
| 12 | First paying-customer pilot live with bundles plus tool-search-loaded specialised tools plus Bash + standard shell tools (`rg`/`jq`/`sed`/`gh`/`git`) for the remaining 10% |

Parallel editorial track (weeks 1-8): close JFSC codes / BO register / désastre coverage gaps. The editorial backlog is itself re-prioritised in week 9 against shadow-pilot logs — whichever corpus paths the pilot agents hit most often that returned stale/stub/missing get jumped to the top of the editorial queue.

This ordering also means **we never ship a "complete" bundle set**: the bundle catalogue is a living artefact that grows from logs. A v1 success criterion is that month-2 bundles are demonstrably better-targeted than week-7 seed bundles — measured by reduction in tool-call count per resolved query and reduction in standard-shell-tool fallback rate (the agent reaching for `rg` / `jq` over the corpus filesystem instead of the typed bundle path).

---

## 15. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Citation-verifier becomes a latency bottleneck | Med | Run it as a Stop hook on Opus 4.7; aggressive prompt caching; only verify substantive legal claims, not chit-chat |
| Semantic-memory poisoning from a single bad note | Med | Hard rule: semantic memory never authoritative for legal claims; `memory_diff` UI for tenants to audit; `memory_forget` always available |
| Corpus staleness — a statute changes between `last_verified` and a query | High | `primary_source.fetch` last-modified check on the fly; editorial alerting tool that subscribes to Jersey-law RSS / States Assembly notifications |
| Tenant pollution between customers | Critical | Architectural — separate Postgres schemas, separate skill directories, separate session stores; integration tests that assert no cross-tenant data appears |
| Anthropic pricing or auth changes break the SDK economics | Med | Build behind a thin shim so we could swap to Bedrock/Vertex/Foundry without rewriting; track Managed Agents pricing as alternative |
| Hallucination on out-of-corpus questions | High | Refusal-first defaults: if no bundle matches, surface "I don't have a confident corpus path for this — here are the closest files" rather than synthesising |
| The 33 trust-officer use-cases turn out to under-cover real practice | Med | Run a 4-week shadow pilot with 2-3 friendly TCBs before billing; capture every refusal and every "this wasn't what I meant" event |
| Regulatory — agent advice becomes "advice" under JFSC interpretation | High | Hard disclaimer baked into baseline skill; agent never holds itself out as a regulated advocate; user-side disclaimer required for tenant deployment |
| **Tool sprawl** — over time we accumulate dozens of specialised typed tools and the agent starts mis-routing between them; AXI's data suggests always-resident schema cost grows faster than usefulness past ~30 tools | Med | Hard cap of ~15 always-resident SDK tools; specialised long-tail tools register but load on demand via the SDK's tool-search mechanism (zero always-resident schema cost when not loaded); quarterly tool-pruning review using the wrong-tool-call telemetry from §11.3 |
| **Missing-tool gap** — a query needs something no typed tool covers and no standard shell tool (`rg`/`jq`/etc) can do, so the agent either refuses or produces a non-tool-grounded answer | Med | §11.3 log analysis surfaces these explicitly (the "missing-tool" event); priority signal feeds the typed-tool development backlog; until covered, the baseline skill enforces refusal-with-citation-of-gap rather than free-form prose |
| **Progressive-disclosure thrash** — skill bodies repeatedly loaded and offloaded in the same session, costing tokens and latency | Low/Med | Bundle-assembler caches the last 3 skill bodies in a short-lived "warm" tier before fully offloading; skill-residency dashboard surfaces thrashing pairs for re-bundling |
| **Ambient retrieval blows the context budget** (§6.4) — relevance threshold set too loose, or `k_max` set too high, and the `UserPromptSubmit` hook injects 3 × ~3k-token files every turn on top of the bundle and conversation history | Med | Hard cap `k_max = 3` files per turn; per-persona relevance threshold (default 0.75) tuned against the §11.2 ambient hit-rate KPI — falling hit rate triggers a threshold bump, not a quiet token-cost drift; per-persona ambient toggle in SKILL.md so heavily-bundle-covered personas opt out entirely; weekly replay against the audit log confirms ambient additions stay within the §5.7 steady-state budget |
| **Ambient injection contaminates the citation surface** — the agent cites a file that arrived via ambient injection but was never explicitly retrieved, and the user-facing answer attributes more deliberateness than there was | Low | Ambient-injected blocks carry the `<!-- ambient-corpus-injection -->` sentinel; citation-verifier (§6.3) accepts them as valid citation sources (same authority as explicit `corpus.*` calls) but the audit log records the provenance distinction so per-tenant reporting can distinguish "agent cited X" from "ambient surfaced X and agent cited it" if needed |
| **Bash + CLI escape hatch becomes the default lane** — agent prefers the high-ceiling surface even when a typed tool exists | Med | Tool descriptions on the typed surface include explicit "prefer this over the CLI for X"; baseline skill includes the heuristic; metric in §11.2 (Bash fallback rate) is a leading indicator |

---

## 16. Open questions for review

1. **Editorial throughput**: closing the BO / JFSC code-of-practice gap in 6 weeks needs ~1 FTE of Jersey-qualified writing time. Do we have that or hire?
2. **Gold-set lawyer**: who writes (and stands behind) the 50 trust-officer gold-set reference answers?
3. **Pilot customers**: do we have 2-3 friendly TCBs already, or is week 10 also a sales sprint?
4. **Hosting topology**: tenant-per-process vs tenant-per-thread inside a shared process? v1 design assumes per-process for isolation; that's more expensive at low scale. Worth revisiting.
5. **Brand**: "Offshore AI" works for B2B but reads as a tax-avoidance label to consumers. Worth a marketing/legal review before we go customer-facing.
6. **Should the citation-verifier also be exposed as a standalone product** (eval-as-a-service for Jersey legal content)? Could be a Trojan-horse acquisition motion into firms not ready to buy the agent.

---

## Appendix A — Mapping the 2026 memory landscape to our choices

| 2026 system / paper | What it argues | Where we adopt it |
|---|---|---|
| **Pinecone Nexus / KnowQL** | Move reasoning upstream from query-time retrieval to compilation-time knowledge artifacts; up to 30× speedup / 90% token reduction | Pre-compiled bundles per persona/task |
| **PageIndex** | Document structure carries meaning; flatten-to-chunks destroys it; tree-of-summaries retrieval hits 98.7% on FinanceBench | Hierarchical `hier-tree.json` over corpus sections + files + articles |
| **SAP Datasphere + Prior Labs** | Most enterprise knowledge isn't prose; respect the native shape (tables, lineage, governed access) | Out of scope for v1, but the architecture leaves room to add table-native sub-agents for tax computation later |
| **Microsoft GraphRAG** | Some knowledge is naturally relational; entity-relation extraction enables multi-hop traversal | Adopted lightly via tag-graph; full GraphRAG deferred |
| **Mem0** (ECAI 2025) | Hybrid vector+graph+KV memory; LoCoMo 92.5; <7k tokens per call | Token-budget target; we don't use Mem0 directly but match its discipline |
| **A-Mem** (Feb 2025) | Zettelkasten atomic notes with auto-link generation and memory evolution | Adopted directly for semantic memory tier |
| **Letta / MemGPT** | OS-style virtual context, agent actively manages tiers via tool calls | Pattern inspiration; we implement via SDK skills + in-process `memory.*` module rather than Letta itself (to avoid runtime lock-in) |
| **Agentic Memory (Yu et al., 2026)** | Treat memory ops as policy actions; train via three-stage RL + GRPO | Deferred to v2; not justified by current scale |
| **"Memory in the Age of AI Agents" survey** (Dec 2025) | Three-axis taxonomy; emphasis on trustworthiness and multi-agent governance | Adopted as our taxonomy; trustworthiness embodied in citation-verifier |
| **"Memory for Autonomous LLM Agents" survey** (2026) | Start at Pattern B (context + retrieval store); graduate to Pattern C only with measured pain; production needs observability infra | Direct architectural advice — we are Pattern B with one tier of learned-ish control (skill routing) |
| **Chroma's context-rot research** | Bigger context windows don't solve relevance; performance degrades with clutter | Bundle approach as the discipline against context-rot |
| **Monigatti / Elastic, "Agentic Search for Context Engineering"** (AI Engineer, 2026) | Context engineering is ~80% agentic search; design for the three failure modes (no call / wrong tool / wrong params); low-floor specialised + high-ceiling general-purpose; start general, log, then specialise from logs; tool descriptions are the contract; errors return *to* the agent; skills as progressive disclosure | Adopted wholesale as the §7.0 tool-surface principles, the build order in §14, and the logging-as-prioritisation engine in §11.3 |
| **Vercel "is bash all you need?"** experiment | Hybrid agent (typed database tool + Bash) outperformed either alone — Bash *verified* the database tool's output | The two-surface pattern in §7.0.2 (typed in-process + same code as AXI CLI); conceptually the same shape as our citation-verifier sub-agent doing a second-pass check of the typed-tool result |
| **AXI ("Agent eXperience Interface") spec** | 10-principle spec for agent-driven CLIs: token-efficient TOON output (~40% less than JSON), minimal default field schemas, content truncation with size hints, pre-computed aggregates that fold multiple calls into one, definitive empty-state messages, structured errors with a stable envelope, ambient-context home views, `help[]` blocks of parameterised next-step commands, idempotent mutations, consistent `--help` fallback. Also: always-resident tool-schema cost scales with tool count and starts dominating per-turn input tokens past ~30 tools | Adopted as **output discipline on typed SDK tools** (§7.0.2): TOON in the `content[0].text` block, minimal default fields, content truncation with size hints, pre-computed aggregates, definitive empty states, structured errors paired with `isError: true`, `help[]` blocks suggesting next-step tool calls, idempotent mutations. The CLI-implementation parts of AXI (subcommand discovery, ambient `bin:` home views, `--help` fallback, exit codes, stdout vs stderr) do **not** apply — we don't ship CLIs over our own functions per the architectural restraint in Appendix C. Schema-cost mitigation is the SDK's first-party tool search, not a CLI escape valve. KPIs in §11.2 track output-discipline conformance and the TOON-vs-JSON token delta |
| **Nate B Jones, "Pinecone Just Demoted Vector Search"** | Don't pick a database first; write down the bundle; pick primitives that deliver the bundle; match retrieval unit to data shape | The bundle-first design (§6.2) and the three-primitive retrieval mix in §6.1 |

## Appendix B — Why not just Mem0 or Letta?

Both are excellent and we should learn from both. Reasons we don't adopt either as the runtime:

- **Mem0** is a memory layer, not an agent runtime. We'd still need an agent harness — and the SDK gives us that plus skills, sub-agents, hooks, sessions, and (where useful) MCP. We adopt Mem0's *discipline* (token budget, hybrid stores, single-pass extraction) without the SDK lock-in.
- **Letta** is an agent runtime, but adopting it means giving up Anthropic OAuth credit economics and the Claude-native skill/sub-agent/hook surfaces. The lock-in is high (Letta owns the agent loop) and the upside vs SDK + in-process `memory.*` is small for a domain agent.

The architectural cost of building our own thin `memory.*` module on Postgres+pgvector is ~2 weeks. The cost of being locked into a third-party runtime is permanent.

## Appendix C — The architectural restraint principle (the indirection question)

Two reasonable instincts when reading earlier drafts of this PRD asked the same underlying question, in slightly different forms:

- Why was every toolset wrapped in an MCP server when we control both the agent and the tool?
- Why were we building custom CLIs (`corpus`, `memory`, `register`, `primary-source`) for the agent to invoke through Bash when those CLIs are just shells over functions we also call directly from the SDK?

The unified answer is one principle:

> **Don't add invocation surfaces over code we own and an agent we control.** SDK custom tools are the default. MCP earns its keep only at a real cross-process / cross-language / cross-org boundary. CLIs earn their keep only when a consumer beyond our own agent (humans, CI, third-party integrations) genuinely needs shell composability with the rest of their workflow.

### Why neither MCP nor a custom CLI is the right default for our own logic

When the agent loop and the tool implementation both live in our Node process, both layers of indirection cost us:

**MCP wrapping** adds three schema representations (TS function signature, MCP JSON schema, agent-facing schema) for one logical function; JSON-RPC serialisation on every call, including trivial reads; a separate process to start, monitor, restart, observe; stack traces that don't cross the boundary, making debugging harder; and always-resident schema tokens even for tools the agent will never call in this session.

**A custom CLI mirror** adds subprocess spawn cost on every call; argv string-marshalling (every parameter through string and back); stdout capture; exit-code-vs-`isError` translation; a separate code path to test and maintain; and a parsing failure surface that the typed SDK lane simply doesn't have. The composability story (Bash pipes between our own commands) is also weak — sequencing typed SDK tool calls has no expressive loss and no parsing failure modes.

The Claude Agent SDK supports in-process custom tool registration directly — a function with a Zod input schema, returning a `CallToolResult` whose `content[0].text` reaches the agent verbatim. That gives the agent the same typed, validated, schema-bearing surface with none of the boundary cost. That is the right default. The SDK's tool-search feature handles the only legitimate reason we considered building a CLI lane (always-resident schema bloat) without a second invocation surface.

### Where each surface does earn its keep, and how v1 uses it

| Surface | v1 use | Justified by |
|---|---|---|
| **MCP** | `tenant-systems-mcp` only | Per-tenant external systems genuinely cross process / language / org boundaries that we do not own |
| **Custom CLI** | None in v1 | Justified only when a consumer *beyond our own agent* (humans for CI integration, third-party tools) needs shell composability. v1.1+ distribution play, not now |
| **Standard pre-existing shell tools** (`rg`, `jq`, `sed`, `awk`, `gh`, `git`) | Available via the Bash tool, restricted to per-tenant sandbox | The agent already knows these from training; composability is the *agent's* default reach for long-tail work; we leverage this lane, we don't add to it |
| **Future MCP wrapper around our own logic** | Triggered only by: (a) migration to Managed Agents (v2; the hosted sandbox can't import our TS), (b) a customer wanting our corpus inside their own Claude Code / Cursor / in-house tool (v1.1+ distribution play), (c) a third-party team embedding our domain expertise in their own agent | Each is an actual boundary; the wrapper is mechanical (auto-generated from Zod schemas — the official MCP TS SDK accepts Zod directly, wrapping a function is ~10 lines) and the `CallToolResult` shape lets us populate `content` (TOON, for any SDK consumer) and `structuredContent` (JSON, schema published from Zod, for machine consumers) from the same backing function |

### The library-shaped pattern this matches

The right way to think about this is the way a well-designed library exposes itself: programmatic API as the default; CLI when humans or shell workflows actually need it; REST or RPC only when external consumers turn up. We're a library that an agent happens to be the primary consumer of. The agent has *programmatic access* via the SDK custom-tool registration — that's the right primary surface. Adding CLIs and MCP servers pre-emptively is the same shape as a library that ships a CLI before anyone has asked for one and a REST API before anyone is calling it remotely: surface area for bugs and tests, with no measured demand to justify it.

The pattern is therefore: **one source of truth (a TypeScript module exporting Zod-typed functions registered as SDK tools), additional surfaces (MCP, REST, edge) added only when an actual boundary needs crossing**.
