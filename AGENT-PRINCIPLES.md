# Agent Principles

Region-non-specific principles for any agent we build on top of the offshoreai knowledge base. The principles travel across jurisdictions (Jersey, Guernsey, Isle of Man, BVI, Cayman, Bermuda, Gibraltar, Malta, Mauritius, Singapore-IFC) and across product flavours (per-firm white-labels, persona-specific agents, public-research agents). The Jersey-specific v1 implementation in [`PRD-baseline-agent-v1.md`](PRD-baseline-agent-v1.md) is one instantiation; this document is what stays constant.

For the corpus-side counterpart — how the knowledge layer itself is organised — see [`KNOWLEDGE-BASE-PRINCIPLES.md`](KNOWLEDGE-BASE-PRINCIPLES.md).

These principles compress a series of decisions made while drafting the v1 PRD, informed by the 2026 memory-infrastructure shift (Pinecone Nexus, SAP Datasphere, PageIndex), the agentic-memory surveys (arXiv:2603.07670 and arXiv:2512.13564), Mem0 / A-Mem / Letta as production memory systems, Leonie Monigatti's "Agentic Search for Context Engineering" thesis, and the AXI spec for agent-driven tool surfaces — checked against the actual Claude Agent SDK contract.

---

## Knowledge & memory

**1. Canonical knowledge is not memory.** The authoritative external surface (the corpus) is read-only to the agent and never mixed with the agent's inferences. Agent inferences never become corpus content. This is the central guardrail against the reflective-memory failure mode: an agent that stores its own previous conclusions as confirmed facts, then quietly poisons future runs.

**2. Memory is multi-tier; each tier has different write authority and different lifetime.** Working (context window, this turn) / episodic (per-session, optional cross-session) / semantic (per-tenant, persistent — agent-written under prompted self-control) / procedural (skills, versioned in git) / canonical knowledge (corpus, externally authored). Conflating the tiers destroys citation discipline.

**3. Reflective / semantic memory is never authoritative for high-stakes claims.** Per-tenant notes influence retrieval and framing, but every legal, regulatory, or factual assertion in the final answer must cite a corpus file or primary source. Semantic memory is a hint; the corpus is the authority.

**4. Every claim cites its source. Verification is a separate sub-agent.** The sub-agent runs in an isolated context window with its own tools, re-reads each cited file, and either passes the response or rejects it with reasons. Same-model self-verification is not sufficient — the verifier must run as a structural gate, not as a prompt-level afterthought.

**5. Freshness is a first-class signal.** Every cited file carries a `last_verified` date; agents enforce age thresholds and refuse or warn beyond them. Where the corpus tracks an external authority (statute, regulator handbook), agents check primary-source last-modified headers on the fly and emit a "stale relative to primary source" signal when the corpus is behind.

---

## Retrieval

**6. Match the retrieval unit to the data shape.** Prose → vectors. Structured long documents (statutes, contracts, filings) → hierarchical trees over the natural document structure (the PageIndex pattern: no embeddings on bulk content; the model reasons over a tree of summaries). Tabular business data → semantic layer over governed tables. Relational data → graphs. A single product surface usually needs more than one primitive; pick per data shape, not per vendor.

**7. Compile bundles, don't search at query time.** For every persona-task combination, pre-resolve which files, statute articles, tags, and freshness windows the agent needs. Load the bundle at session start. The Pinecone Nexus thesis applied over markdown: move reasoning upstream from query-time retrieval to compilation-time knowledge artifacts.

**8. Vector search is plumbing, not the product.** Embeddings are a fallback for fuzzy phrasing and novel terminology, not the primary retrieval mode for structured content. If the bulk of retrieval is vector similarity, you've matched the wrong primitive to the data shape.

---

## Tool surface

**9. One invocation surface for our own logic: typed SDK custom tools registered in-process with Zod input schemas.** No MCP wrapping of our own functions; no custom CLIs over our own functions. Both are indirection over code we own and an agent we control — they add schema multiplication, serialisation cost, and a parallel maintenance path with no marginal benefit. See principle 18 for the unified architectural restraint principle, and Appendix C of the v1 PRD for the full argument.

**10. Tool descriptions are the contract.** Every tool ships with a description structured as: (a) core purpose, (b) when to use, (c) when NOT to use (especially against overlapping tools), (d) relationships and ordering ("call X first if Y"), (e) parameter discipline notes. One-line descriptions are a footgun once a second overlapping tool exists. For tools that load on demand via tool search, the description is also the matcher — sloppy descriptions mean tools that should load don't, and tools that shouldn't do.

**11. Errors return *to* the agent as data, with a structured retry/pivot signal.** Handlers wrap in try/catch and return the failure as a `CallToolResult` with `isError: true` and a stable TOON envelope keyed by `error_kind`. The agent dispatches on the envelope; uncaught exceptions kill the loop and are reserved for genuine programmer errors. Mutations are idempotent (deduplicate by content hash, upsert-with-history, never overwrite-and-lose).

**12. Parameter complexity is a failure axis; pay it down with skills, not system-prompt rules.** Simple typed parameters (`getById`) are robust across all models. Free-form query parameters (`executeQuery`) are brittle even on strong models. When complexity is necessary, pair the tool with a skill whose body documents the parameter language, loaded on demand. Don't accumulate band-aids in the system prompt.

**13. Design against the three failure modes.** (a) Agent doesn't call any tool, answers from parametric knowledge — mitigated by baseline-skill mandate plus citation-verifier rejection of tool-unbacked claims. (b) Agent calls the wrong tool — mitigated by tool descriptions with explicit when-NOT-to-use plus `PreToolUse` hooks for hard cases. (c) Agent calls the right tool with wrong parameters — mitigated by server-side validation with "did you mean" responses, glossary normalisation, and bundle pre-loading so common parameters are already in context. Source: Monigatti's failure-mode taxonomy.

---

## Output discipline

**14. TOON in the tool-result text block, not JSON.** Saves ~40% per list-shaped response vs JSON-encoded equivalents and is what the agent actually reads (the SDK forwards text content verbatim; no re-serialisation). Output validation against a schema is not on the runtime path — we own the values; the schema is a build-time shape declaration that drives the TOON renderer's field list. Never set `structuredContent` on the tool result (a lint rule enforces this — setting it causes the SDK to drop text blocks and forward JSON, which is the opposite of what we want).

**15. One source of truth, multiple renderers.** The function returns a typed value (`z.infer<typeof Schema>`); renderers project it to TOON (SDK tool result), JSON (tests, debug logging), MCP envelope (future v2 wrapper at a real boundary), frontend object (future v1.1 UI at a real boundary). Compile-time guarantee that all renderers agree on shape; runtime cost on the hot path is zero (lift field keys to a module-level constant).

**16. Definitive empty states; structured errors with `isError: true`; `help[]` blocks suggest next-step tool calls.** Silence on a zero-result query is forbidden — the agent cannot distinguish "no result" from "tool errored" otherwise. Errors paired with the SDK's `isError` flag give the agent unambiguous dispatch. `help[]` blocks at the end of successful results carry 2-4 parameterised next-step tool calls (with `<placeholder>` syntax, never invented values) so navigation is a guided walk rather than a guessing game.

**17. Ambient session-start context.** Register a `SessionStart` hook that injects a per-tenant dashboard once at the top of every session — corpus file counts by section, stub/draft/stale counts, currently warm bundle, tenant's open memory note count. The agent opens every conversation already knowing what's stale, what's hot, and where the gaps are. This is the AXI "ambient context" pattern transposed from CLI home views to SDK session hooks.

---

## Build order & operations

**18. Start general, log, specialise from observed behaviour.** Ship the general-purpose typed tools first and a small set of seed bundles for the most-anticipated persona-task combinations. Instrument every tool call. Compile additional bundles and specialised tools from observed pilot logs, not from intuition. The bundle catalogue is a living artefact that grows from logs; "complete" is not a milestone.

**19. Logging is the prioritisation engine.** Tool calls, skill loads, memory operations, and verifier verdicts stream to a per-tenant event log. Weekly jobs use the log to: rank (persona × task-shape) pairs by frequency × current-fallback-rate for the next bundle batch; surface tool-description regressions (rising wrong-tool-call rate triggers a description rewrite); flag corpus paths that pilot agents hit most often but found stale/stub/missing for the editorial backlog.

**20. Cap always-resident tools at ~15; tool search for the long tail; standard shell tools for genuine composability.** AXI's data suggests always-resident schema cost dominates per-turn input tokens past ~30 tools. Stay clear of that knee by keeping the always-visible set tight and registering specialised tools to load on demand via the SDK's tool search. The genuine long tail (composition the typed surface can't naturally express) goes through Bash + standard shell tools the agent already knows from training (`rg`, `jq`, `sed`, `awk`, `gh`, `git`) — we leverage that lane, we don't add custom commands to it.

---

## Architectural restraint

**21. Don't add invocation surfaces over code we own and an agent we control.** SDK custom tools are the default. MCP earns its keep only at real cross-process / cross-language / cross-organisation boundaries (per-tenant external systems, future Anthropic Managed Agents migration, future third-party MCP-client distribution). Custom CLIs earn their keep only when a consumer beyond our own agent (humans, CI, third-party integrations) genuinely needs shell composability with the rest of their workflow. Everything else — wrapping our own functions in MCP for the agent to call over JSON-RPC, building a `corpus`/`memory`/`register` CLI for the agent to invoke through Bash — is indirection for its own sake. AXI's *output discipline* principles still apply on the typed SDK tool surface; AXI's *CLI-implementation* principles don't because we don't ship CLIs over our own functions.

**22. Progressive skill disclosure with active offload.** Only the baseline skill body is always-resident in the system prompt (citation rules, freshness rules, refusal patterns, persona-routing heuristics). Task-skill bodies — the bundle definition, the per-task operator instructions — load on demand at session start via the bundle-assembler sub-agent, and offload to a scratch `plan.md` when the conversation pivots to a different task. Skill names and descriptions stay resident; bodies don't. This is the SDK-native pattern, and it's load-bearing for the context budget.

**23. Sub-agent isolation for verification.** The citation-verifier runs in its own context window with its own tool subset. The main agent only sees the verifier's verdict (pass / reject-with-reasons), never the verifier's scratch. This applies generally: any time we want a structural check rather than a self-reflection, the check goes in a sub-agent with isolated context.

---

## What this document is *not*

These are principles for building agents on top of the offshoreai knowledge base. They do not cover:

- **How the knowledge base itself is organised** — see [`KNOWLEDGE-BASE-PRINCIPLES.md`](KNOWLEDGE-BASE-PRINCIPLES.md) and the operational [`CONVENTIONS.md`](CONVENTIONS.md).
- **The Jersey-specific v1 implementation** — see [`PRD-baseline-agent-v1.md`](PRD-baseline-agent-v1.md).
- **Tenant deployment specifics** — covered in §9 of the v1 PRD; will be lifted into a separate `TENANT-PRINCIPLES.md` when the second customer profile gives us enough data to generalise.

When these principles conflict with a downstream decision in the PRD or a tenant configuration, the higher-level principle wins unless the conflict is explicitly justified at the lower level. New principles or amendments require a written rationale and update both this document and the PRD that triggered the change.
