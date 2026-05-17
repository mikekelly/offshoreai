# PRD — Offshore AI Jersey Baseline Agent (v1)

**Status:** draft for review
**Author:** Mike Kelly (with Claude)
**Date:** 2026-05-17
**Audience:** product/eng founder & first engineer(s)
**Scope:** v1 of the "baseline" agent — a production-grade Jersey domain expert built on top of the offshoreai corpus, designed to be the substrate from which per-company agents are cloned (Jersey TCBs, fund managers, family offices, banks, insurers).

---

## 0. TL;DR

We turn the offshoreai Jersey knowledge graph into a **stateful, citation-mandatory Jersey domain agent**, shipped as a Claude Agent SDK runtime. The baseline agent is what every customer-specific agent forks from. Customer agents add their own private memory, MCP integrations, and operator skills on top.

The bet, informed by the 2026 memory-infrastructure shift (Pinecone Nexus / KnowQL, SAP+Datasphere+Prior Labs, PageIndex, Microsoft GraphRAG, A‑Mem, Mem0, Letta, the Yu et al. "Agentic Memory" RL paper, and the December 2025 "Memory in the Age of AI Agents" survey), is that **classical RAG over chunks is the wrong abstraction for legal/regulatory agents**. The right abstraction is:

1. A **retrieval contract per persona**: pre-defined "bundles" of canonical files, statute articles, tags and freshness windows assembled before query time, not searched at query time.
2. A **hierarchical retrieval primitive** (PageIndex-style) over the document tree the corpus already is — section index → topic file → statute article — instead of chunk-and-embed.
3. A **multi-tier memory** (working / episodic / semantic / procedural / canonical knowledge) where the corpus is *immutable canonical knowledge* and per-customer learning lives in a separate A-Mem-style note store that never contaminates citations.
4. **Citation-mandatory output**: every claim is grounded in a corpus file path + article + `last_verified` date, verified by a sub-agent before the user sees it.
5. **Claude Agent SDK as the runtime**, because (a) Skills + sub-agents + sessions + hooks map cleanly to the memory tiers we want, (b) the corpus is already optimised for "agent arrives cold" reading per `CONVENTIONS.md`, and (c) from June 15 2026 the Anthropic OAuth subscription credit pool is reachable only through the official Agent SDK — i.e. there is a real economic advantage to building on it.

v1 ships:
- A standalone CLI + library (Python and TypeScript) wrapping the SDK.
- A compiled-bundle layer over the corpus (~25 persona/task bundles for the trust-officer persona, plus the four "cold-start orientation" bundles).
- A semantic-memory store (per-tenant) using A-Mem-style atomic notes.
- A custom **corpus MCP server** that gives typed access to the graph (`get_file`, `get_article`, `find_by_tag`, `get_bundle`, `freshness_check`).
- A **citation-verifier sub-agent** that hard-fails the response if a claim lacks a corpus citation.
- One paying-customer-ready white-label: **Jersey TCB Trust Officer Agent**, derived from the existing 33 trust-officer use-case files.

---

## 1. Why now — the 2026 memory inflection

Four signals across the last six months converge on the same conclusion: **infrastructure built for chatbot-era RAG is the wrong substrate for production agents**.

- **Pinecone Nexus / KnowQL** (Apr 2026) — the vector-DB category leader explicitly positioning vector search as plumbing and a *knowledge-compilation* stage as the product, claiming up to 30× execution improvement and 90% token reduction by compiling reusable agent contexts ahead of time instead of re-running similarity search per query.
- **SAP's >€1bn AI infra spend** on Datasphere (lakehouse + semantic layer + lineage + access control) and Prior Labs (tabular foundation models). None of it is chatbot RAG; all of it is shape-respecting access to governed business data.
- **The "Memory in the Age of AI Agents" survey (arXiv:2512.13564, Dec 2025)** and the "Memory for Autonomous LLM Agents" survey (arXiv:2603.07670, 2026) — both formalising the same three-axis taxonomy (temporal scope × representational substrate × control policy), naming the same five mechanism families (context compression, retrieval stores, reflective self-improvement, hierarchical virtual context, policy-learned management), and reporting the same finding from MemoryArena: systems that score near-perfect on passive recall benchmarks (LoCoMo) collapse to 40–60% when memory has to be used in service of a real task.
- **Three open-source production memory systems** with credible 2026 numbers: **Mem0** (hybrid vector+graph+KV; 92.5 on LoCoMo, 94.4 on LongMemEval, <7k tokens per retrieval), **A-Mem** (Zettelkasten atomic notes with auto-link generation and memory evolution), and **Letta** (commercial MemGPT-derived three-tier OS-style virtual memory).

The Nate B Jones video ("Pinecone Just Demoted Vector Search") summarises the practical takeaway crisply: stop picking a database first; write down the **bundle** your agent needs to do its job; then pick the retrieval primitives that deliver that bundle. The shapes that matter are fuzzy prose (vectors), structured long documents (hierarchical trees, e.g. PageIndex), tabular business data (semantic layer + table-native reasoning), and relational data (graphs). For offshore legal/regulatory work the dominant shapes are the second and the fourth — exactly the two that classic RAG handles worst.

This is the opening for an opinionated, vertical agent: **a Jersey domain agent that is right because the corpus and retrieval contract are right, not because the retrieval index is fancy.**

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
│                       Claude Agent SDK runtime                     │
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
│  │ MCP servers                                                 │   │
│  │   corpus-mcp   primary-source-mcp   register-mcp            │   │
│  │   memory-mcp   tenant-systems-mcp (per-customer)            │   │
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
│  - hier-tree.json  │    │   - tenant MCP creds                     │
│  - tag-index.json  │    │   - session JSONL                        │
│  - vec-index/      │    │                                          │
└────────────────────┘    └─────────────────────────────────────────┘
```

### 4.2 Choice of runtime: Claude Agent SDK

Why the SDK (and not roll-our-own Messages API loop or move straight to Managed Agents):

- **Built-in tool loop, hooks, sub-agents, sessions, skills, MCP** — all the primitives we'd otherwise build from scratch. We are not in the business of writing an agent harness; we are in the business of being right about Jersey law.
- **Filesystem-native config** — `.claude/skills/*/SKILL.md`, `.claude/agents/*.md`, `CLAUDE.md` — maps 1-to-1 onto the corpus's existing markdown-first ethos. No format mismatch between corpus and runtime.
- **Sessions as JSONL on disk** with `resume` / `fork` semantics — gives us episodic memory for free, plus session-store adapter for serverless deploys.
- **OAuth subscription credits**: from 15 June 2026 the Pro and Max subscription monthly credit allocation ($20 / $200 of Agent SDK usage) is consumable **only through the official Agent SDK**, not third-party CLIs. For a vertical agent business this is a measurable margin advantage on the long tail of low-volume tenants — and a competitive moat against teams who built on OpenClaw-style routers and are now paying full API rates.
- **Migration path to Managed Agents** (REST, sandboxed, Anthropic-hosted) when we want hosted long-running async sessions without operating the harness ourselves. v1 stays on the SDK in our process; v2 may move tenant runtimes to Managed Agents (beta header `managed-agents-2026-04-01`).

The two SDKs (Python and TypeScript) are at feature parity for our needs. **Choose Python** as the primary because the data/ML tooling around bundle compilation, embeddings, and evals is more mature there, and ship a thin TypeScript SDK only if a customer needs in-process embedding.

### 4.3 What we deliberately do *not* build in v1

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
| **Semantic (private)** | A-Mem atomic notes in Postgres + pgvector | Prompted self-control via `memory-mcp` tools | Per tenant, persistent | Custom `memory-mcp` server |
| **Procedural** | Markdown SKILL.md files | Discoverable, model-invoked | Versioned in git | `.claude/skills/` + plugins option |
| **Canonical knowledge** | Markdown corpus + compiled artifacts | Read-only; never written by agents | Owned by editorial team; out-of-band updates | `corpus-mcp` + Read/Glob/Grep |

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

Implementation: Postgres with pgvector; one schema per tenant; the `memory-mcp` server exposes `memory_add`, `memory_search`, `memory_link`, `memory_evolve`, `memory_forget` as MCP tools. The agent calls them explicitly — we use **prompted self-control**, not learned control, for v1.

Crucial: semantic-memory notes are **never** treated as authoritative for legal claims. They influence retrieval and framing, but every legal/regulatory assertion in the final answer must cite a corpus file. This is the firewall against the reflective-memory failure mode.

### 5.4 Episodic memory: SDK sessions

Use `ClaudeSDKClient` (Python) for multi-turn conversations within a process; persist `session_id` in our app DB per (tenant, user, thread). Use `resume` to pick up; `fork` for "what if we tried it differently" branches the user requests. Use a `SessionStore` adapter to mirror JSONL transcripts to S3 so we can resume across hosts and survive container churn.

### 5.5 Working memory: context window

Default Sonnet 4.6 1M-context for most tenants; promote to Opus 4.7 for the citation-verifier sub-agent and for hard adversarial questions. Use the SDK's compaction. Use `CLAUDE.md` at the tenant repo root to inject persistent tenant context (firm name, regulated entities, default Court venue).

### 5.6 Why these five tiers and not more

The 2026 surveys list working / episodic / semantic / procedural as the canonical Baddeley-derived layering. We add **canonical knowledge** as a fifth tier because the corpus is qualitatively different from semantic memory: it is owned by the editorial process, externally authored, and version-controlled. Conflating it with semantic memory destroys the citation discipline.

---

## 6. Retrieval: contracts and primitives

### 6.1 Three retrieval primitives, not one

Following the "match the retrieval unit to the work" principle:

1. **Hierarchical tree retrieval (primary)**. The corpus is *already* a tree: section index → topic file → statute article. We build a one-off compile step that produces `hier-tree.json` — every node carries its file path, title, frontmatter tags, articles_covered, status, last_verified, and a 2-3 sentence summary auto-generated by a build-time Sonnet call (cached, re-run only on file change). The agent reasons over the tree to pick the right node — PageIndex-style. No embeddings on the bulk content.

2. **Tag-graph retrieval (cross-cutting)**. Compile `tag-index.json`: `{tag: [file_paths]}` plus a tag co-occurrence matrix. For queries like "Article 9 firewall AND US grantor trust AND forced heirship" the agent intersects tag sets to find the cross-cutting files no single section would surface.

3. **Vector retrieval (fallback)**. pgvector index over per-file embeddings of the auto-generated summaries (not the body content). Used when (1) and (2) miss — fuzzy phrasing, novel terminology. This is the "vector search as plumbing" stance, deliberately small-footprint.

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

---

## 7. MCP servers

Five MCP servers, three shared, two per-tenant.

### 7.1 `corpus-mcp` (shared, read-only)

Typed surface over the corpus. Avoids the agent burning tokens on Glob/Grep for things we can index.

- `get_file(path)` → file content + frontmatter
- `get_article(statute, article)` → the canonical article-wiki file
- `find_by_tag(tag, [tag…])` → file paths (AND/OR semantics)
- `get_bundle(persona, task)` → loaded bundle yaml + all referenced files
- `freshness_check(paths[])` → list of (path, last_verified, status, age_days)
- `glossary_lookup(term)` → from `jersey/glossary.md`

### 7.2 `primary-source-mcp` (shared, read-only)

Cached, version-aware fetcher for jerseylaw.je, gov.je, jerseyfsc.org, statesassembly.je. Returns the live primary-source content **plus** the last-modified header. The agent uses this when:

- The corpus file's `last_verified` is older than primary source's last-modified — emits a "corpus is stale relative to primary source" signal.
- The user explicitly asks for "the current text of Article X" — we serve the primary source, not just our corpus.

This is the **trust amplifier** layer. We are not the source of truth for Jersey law; jerseylaw.je is. We are the agent that knows which paragraph of which Article to fetch and what it means.

### 7.3 `register-mcp` (shared, read-only or scraped)

Read-only access to JFSC public register, Jersey companies register, charities register. Where these don't expose APIs we screen-scrape with caching and clearly mark the data as "scraped, accessed at T". v1 launches with read-only; never writes to any government system.

### 7.4 `memory-mcp` (per-tenant)

The A-Mem-style atomic-note store. Tools: `memory_add`, `memory_search`, `memory_link`, `memory_evolve`, `memory_forget`, `memory_list_by_tag`, `memory_diff`.

### 7.5 `tenant-systems-mcp` (per-tenant, configurable)

Bridges to the customer's own systems (Mourant case management, NavOne, Viewpoint, Salesforce, M-Files, OneDrive, Signing). Configured per-tenant. v1 ships connectors for: NavOne, Viewpoint, Microsoft 365 (Files + Outlook), Salesforce. Outbound writes (sending an email, creating a calendar event) are **never auto-approved**; the SDK's `canUseTool` callback prompts the human.

---

## 8. Sub-agents

Three first-class sub-agents in v1, defined via `AgentDefinition` with curated tool lists:

| Sub-agent | Purpose | Tools |
|---|---|---|
| `bundle-assembler` | At SessionStart, choose the right bundle and load it into context. Re-runs mid-session if the user pivots persona/task. | corpus-mcp, Read |
| `citation-verifier` | Stop-hook gate. Re-reads every cited file, checks support, returns pass/fail with reasons. | corpus-mcp, Read, Grep |
| `freshness-checker` | At PreToolUse on corpus-mcp calls, decides whether to also fetch primary source. Returns a stale/fresh verdict. | corpus-mcp, primary-source-mcp |

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

A small Python build tool (`offshoreai-build`) runs:

1. **Walk the corpus**, parse frontmatter, validate against `CONVENTIONS.md` (status enum, tag whitelist from `TAGS.md`, link validity, frontmatter completeness). Existing convention enforcement, formalised.
2. **Compile `hier-tree.json`** — nodes for every section index + file, with auto-summaries (1-3 sentences) generated by a Sonnet 4.6 batch job. Cached on file SHA — re-run only on change. Budget estimate: ~870 files × ~$0.001/file with prompt caching ≈ $1 per full rebuild.
3. **Compile `tag-index.json`** — direct walk of frontmatter.
4. **Compile vector index** — embed each summary with Voyage 3 or `text-embedding-3-large`, store in pgvector (shared schema).
5. **Compile bundles** — read each `bundles/*.yaml`, validate that every referenced file exists and isn't a stub.
6. **Run evals** (section 11).

The build runs on every PR via GitHub Actions; failing convention checks block merge.

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
- **Average bundle-load tokens** — track context efficiency. Target < 8k tokens loaded per query (Mem0's reported bar).
- **Citation-verifier reject rate** — first-pass reject rate ≤ 15%; post-retry reject rate ≤ 2%.
- **Customer task NPS** per persona.
- **$ cost per resolved query** — to be tracked from day one. The Anthropic OAuth credit allocation gives us a real spread between marginal cost and list price; we need the operational data to know how big.

---

## 12. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | **Claude Agent SDK (Python)** | Section 4.2 |
| Default model | **Sonnet 4.6 1M** | Best price/quality for long-context reading |
| Citation-verifier model | **Opus 4.7 1M** | Higher precision matters more than latency for the gate |
| Memory DB | **Postgres + pgvector** | Single technology for relational + vector; ops simplicity |
| Object storage | **S3** | SessionStore mirror, file checkpointing |
| Auth | **Anthropic API key per tenant**; Pro/Max OAuth credit for low-volume internal tools | Anthropic does not permit third-party developers to expose claude.ai login to end users |
| Deployment | **Fly.io or Railway** for the API; **GitHub Actions** for the build pipeline | Boring choice; revisit at scale |
| Frontend | None in v1 | API-first; ship CLI; let customers integrate. UI is v1.1 |

---

## 13. v1 scope

### In scope
- Build pipeline (validation, hier-tree, tag-index, vector index, bundle compile).
- 5 MCP servers (corpus, primary-source, register, memory, tenant-systems — the last as stub with 2 reference connectors).
- 3 sub-agents (bundle-assembler, citation-verifier, freshness-checker).
- 44 compiled bundles (4 orientation + 33 trust-officer + 7 persona overviews).
- 8 baseline skills (`jersey-baseline` + 7 personas) + 33 trust-officer task skills.
- Eval suite (Track 1 + 2 + 3) with 50-question gold set.
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

| Week | Milestone |
|---|---|
| 1-2 | Build pipeline; convention validator; hier-tree & tag-index compile |
| 3 | `corpus-mcp` server; first 5 trust-officer bundles compiled |
| 4 | `memory-mcp` + Postgres schema; A-Mem semantics implemented |
| 5 | `primary-source-mcp` + caching; freshness-checker sub-agent |
| 6 | Citation-verifier sub-agent + Stop hook integration |
| 7 | Bundle-assembler + SessionStart hook; remaining 28 trust-officer bundles |
| 8 | Eval Track 1 + Track 2 (gold set) |
| 9 | Eval Track 3 (memory-in-action) |
| 10 | First tenant deployment; SessionStore S3 adapter |
| 11 | Hardening, observability (memory diff, replay), audit log |
| 12 | First paying-customer pilot live |

Parallel editorial track (weeks 1-8): close JFSC codes / BO register / désastre coverage gaps.

---

## 15. Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Citation-verifier becomes a latency bottleneck | Med | Run it as a Stop hook on Opus 4.7; aggressive prompt caching; only verify substantive legal claims, not chit-chat |
| Semantic-memory poisoning from a single bad note | Med | Hard rule: semantic memory never authoritative for legal claims; `memory_diff` UI for tenants to audit; `memory_forget` always available |
| Corpus staleness — a statute changes between `last_verified` and a query | High | `primary-source-mcp` last-modified check on the fly; editorial alerting tool that subscribes to Jersey-law RSS / States Assembly notifications |
| Tenant pollution between customers | Critical | Architectural — separate Postgres schemas, separate skill directories, separate session stores; integration tests that assert no cross-tenant data appears |
| Anthropic pricing or auth changes break the SDK economics | Med | Build behind a thin shim so we could swap to Bedrock/Vertex/Foundry without rewriting; track Managed Agents pricing as alternative |
| Hallucination on out-of-corpus questions | High | Refusal-first defaults: if no bundle matches, surface "I don't have a confident corpus path for this — here are the closest files" rather than synthesising |
| The 33 trust-officer use-cases turn out to under-cover real practice | Med | Run a 4-week shadow pilot with 2-3 friendly TCBs before billing; capture every refusal and every "this wasn't what I meant" event |
| Regulatory — agent advice becomes "advice" under JFSC interpretation | High | Hard disclaimer baked into baseline skill; agent never holds itself out as a regulated advocate; user-side disclaimer required for tenant deployment |

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
| **Letta / MemGPT** | OS-style virtual context, agent actively manages tiers via tool calls | Pattern inspiration; we implement via SDK skills + memory-mcp rather than Letta itself (to avoid runtime lock-in) |
| **Agentic Memory (Yu et al., 2026)** | Treat memory ops as policy actions; train via three-stage RL + GRPO | Deferred to v2; not justified by current scale |
| **"Memory in the Age of AI Agents" survey** (Dec 2025) | Three-axis taxonomy; emphasis on trustworthiness and multi-agent governance | Adopted as our taxonomy; trustworthiness embodied in citation-verifier |
| **"Memory for Autonomous LLM Agents" survey** (2026) | Start at Pattern B (context + retrieval store); graduate to Pattern C only with measured pain; production needs observability infra | Direct architectural advice — we are Pattern B with one tier of learned-ish control (skill routing) |
| **Chroma's context-rot research** | Bigger context windows don't solve relevance; performance degrades with clutter | Bundle approach as the discipline against context-rot |

## Appendix B — Why not just Mem0 or Letta?

Both are excellent and we should learn from both. Reasons we don't adopt either as the runtime:

- **Mem0** is a memory layer, not an agent runtime. We'd still need an agent harness — and the SDK gives us that plus skills, sub-agents, hooks, sessions, MCP. We adopt Mem0's *discipline* (token budget, hybrid stores, single-pass extraction) without the SDK lock-in.
- **Letta** is an agent runtime, but adopting it means giving up Anthropic OAuth credit economics and the Claude-native skill/sub-agent/hook surfaces. The lock-in is high (Letta owns the agent loop) and the upside vs SDK + custom memory-mcp is small for a domain agent.

The architectural cost of building our own thin memory-mcp on Postgres+pgvector is ~2 weeks. The cost of being locked into a third-party runtime is permanent.
