# IMPLEMENTATION-PLAN.md

Concrete week-by-week task backlog for the v1 Jersey baseline agent. The
strategic shape — runtime choice, memory tiers, tool surface, sub-agents,
restraint principles — is fixed in
[`PRD-baseline-agent-v1.md`](PRD-baseline-agent-v1.md) §0–§9 and is **not
re-litigated here**. This document translates PRD §14's twelve-week
milestone table into concrete deliverables, file paths, owner-decidable
sub-tasks, and acceptance criteria.

It is a **living document**. Update as tasks land (move to ✅), as scope
adjusts inside individual weeks, and as new tasks emerge from logs in the
post-week-7 shadow-pilot phase. Sweeping changes (re-ordering weeks,
adding new milestones) require a PRD §14 update first.

**Eval-driven acceptance.** Every week from week 3 onwards has a
**score-delta acceptance criterion** drawn from
[`EVAL-DRIVEN-PLAN.md`](EVAL-DRIVEN-PLAN.md). A milestone ships only
when the showcase / coverage eval moves by the target margin against
the prior baseline. "Feature exists" is not enough. Weeks 1–2 have no
score impact (infrastructure-only) but their convention-validator
output feeds the editorial backlog used from week 3 onwards.

---

## Week 0 — readiness gaps (this document and its peers)

Pre-week-1 design artefacts that unblock implementation. These exist
because AGENTS.md "what's deliberately not in this document" listed them
as gaps; week 0 closes them so week 1 can start cold.

| Deliverable | Path | State |
|---|---|---|
| First-run dev env doc | [`SETUP.md`](SETUP.md) | ✅ |
| Week-by-week task backlog | [`IMPLEMENTATION-PLAN.md`](IMPLEMENTATION-PLAN.md) | ✅ (this file) |
| Eval-driven plan that overrides this file's acceptance criteria | [`EVAL-DRIVEN-PLAN.md`](EVAL-DRIVEN-PLAN.md) | ✅ |
| Zod schemas + 5-part descriptions for every tool | `schemas/` | ✅ (spec; promoted to `packages/schemas/` in week 3) |
| Reference bundle YAML for `trust-officer/article-47-set-aside-for-mistake` | `bundles/trust-officer/article-47-set-aside-for-mistake.yaml` | ✅ |
| Sub-agent prompts (citation-verifier, bundle-assembler, freshness-checker) | `prompts/sub-agents/*.md` | ✅ |
| Reference SKILL.md per category (baseline, task) | `skills/templates/*.SKILL.md` | ✅ |
| Eval grader sub-agent prompt | `prompts/eval/grader.md` | week 0 in progress |
| Trajectory schema + harness-adapter spec | `schemas/eval-trajectory.ts`, `evals/harnesses/README.md` | week 0 in progress |
| Convention-validator conformance baseline | `evals/conformance-baseline.yaml` | week 1 — populated by first validator run |
| `claude-p` + `explore-subagent` eval baselines | `evals/baselines/<date>-{claude-p,explore-subagent}/` | Phase 1 — once Phase 0 ships |
| Tenant onboarding runbook | `TENANT-ONBOARDING.md` | deferred — not week-1-to-7 blocking |

Acceptance: a new implementation engineer can run `git pull`, read
[`AGENTS.md`](AGENTS.md), then [`SETUP.md`](SETUP.md), then this file, and
have everything they need to start week 1 without further design questions.

---

## Week 1 — workspace bootstrap + convention validator

| Task | Deliverable |
|---|---|
| pnpm workspace skeleton | `package.json` (private, workspace root), `pnpm-workspace.yaml`, `.nvmrc` (22), `tsconfig.base.json` (strict, ESM, NodeNext), `.gitignore` additions (`node_modules/`, `dist/`, `.env.local`) |
| `@offshoreai/build` package scaffold | `packages/build/{package.json,tsconfig.json,src/index.ts}` |
| Convention validator | `packages/build/src/validate/{frontmatter.ts,tags.ts,links.ts}` — `gray-matter` parse, Zod schema derived from `CONVENTIONS.md`, tag whitelist enforced against `TAGS.md`, `remark-validate-links` for relative paths |
| First CLI verb: `pnpm build:corpus validate` | `packages/build/src/cli.ts` — exits non-zero on any violation |
| GitHub Actions on PR | `.github/workflows/build.yml` — `pnpm install --frozen-lockfile && pnpm build:corpus validate && pnpm test` |
| Vitest harness | `vitest.config.ts` at root + per-package `vitest.config.ts` |

Acceptance: `pnpm build:corpus validate` runs in CI, fails on any frontmatter
violation, link rot, or invented tag. **Existing corpus violations are
captured as a snapshot in `evals/conformance-baseline.yaml`** so the
editorial team has a backlog target, but they do not block CI on this
week's branch.

Score impact: none (infrastructure). The conformance snapshot is the
week-1 deliverable that *feeds* later weeks' editorial prioritisation.

**Owner-decidable sub-tasks (no PRD change needed):**
- ESM vs CJS — **ESM (NodeNext)**, no compat shims.
- Lint/format — `eslint` + `prettier` with `eslint-config-airbnb-typescript` or `@typescript-eslint/recommended-type-checked`; final choice during week 1.
- Test fixtures location — `packages/<pkg>/test/fixtures/`.

---

## Week 2 — hier-tree + tag-index compile

| Task | Deliverable |
|---|---|
| `hier-tree.json` compiler (no auto-summaries yet) | `packages/build/src/compile/hier-tree.ts` — walks the jurisdiction tree, emits a JSON tree of `{path, title, status, lastVerified, tags, articlesCovered, children}` |
| Hier-tree SHA cache | `packages/build/src/cache/file-sha.ts` — content-addressed so the next step's expensive Sonnet summarisation pass is incremental |
| Auto-summary batch (cached) | `packages/build/src/compile/summarise.ts` — Sonnet 4.6 via `@anthropic-ai/sdk` with prompt caching, 1-3 sentence summary per node; budget alarm at $5/full-rebuild |
| `tag-index.json` compiler | `packages/build/src/compile/tag-index.ts` — direct walk, emits `{tag: [path]}` plus a co-occurrence matrix `{tag: {tag: count}}` |
| New CLI verbs | `pnpm build:corpus tree`, `pnpm build:corpus tags`, `pnpm build:corpus all` |

Acceptance: `pnpm build:corpus all` produces `hier-tree.json` and
`tag-index.json` under `dist/build/`; incremental re-build of a single
file completes in < 5s without recomputing summaries for unchanged files.

Score impact: none yet (the artefacts feed week 3's typed tools).

---

## Week 3 — corpus toolset (`@offshoreai/tools-corpus`)

| Task | Deliverable |
|---|---|
| Promote `schemas/` to `packages/schemas/` | `packages/schemas/{package.json,src/...}` — published as `@offshoreai/schemas`; spec files moved verbatim |
| `@offshoreai/tools-corpus` handlers | `packages/tools-corpus/src/{getFile,getArticle,glossaryLookup,findByTag,expandTags,neighbours,tree,semanticSearch,inventory,getBundle,freshnessCheck}.ts` — 11 tools per PRD §7.1 |
| TOON renderer | `packages/tools-corpus/src/render/toon.ts` — single source of truth, per-tool field lists derived from Zod shape keys (lifted to module-level constants for hot-path zero-cost) |
| SDK registration helper | `packages/tools-corpus/src/sdk-register.ts` — registers all 11 tools with the SDK, attaches descriptions from `schemas/`, splits high-frequency (always-resident) vs specialised (tool-search) per PRD §7.1 |
| Output-discipline conformance test | `packages/tools-corpus/test/output-discipline.test.ts` — asserts every handler: (a) TOON in `content[0].text`, (b) never sets `structuredContent` (also enforced by a lint rule), (c) emits `help[]` blocks with `<placeholder>` syntax, (d) definitive empty-state lines on zero results, (e) `isError: true` paired with the stable error envelope on failures |

Acceptance: every tool listed in `schemas/corpus.ts` has a passing
handler, a passing description-discipline check, and emits TOON identical
to the example in PRD §7.0.2. **Score gate**: re-running the showcase
eval against the new `offshoreai-agent` harness must show **citation
precision ≥ +20 percentage points** over `claude-p` and the
`explore-subagent` baseline, and **median tool-call count per question
≥ 30% lower**. If neither moves, the typed surface didn't earn its
keep against bare Read+Grep — pause and ask why.

---

## Week 4 — memory toolset + Postgres schema

| Task | Deliverable |
|---|---|
| `@offshoreai/tools-memory` handlers | `packages/tools-memory/src/{add,search,link,evolve,forget,listByTag,diff}.ts` — A-Mem atomic-note semantics per PRD §5.3 |
| Drizzle schema (per-tenant) | `packages/tools-memory/src/schema/{notes,links,embeddings}.ts` using `drizzle-orm` + `pgvector` plugin |
| Tenant scoping | `packages/tools-memory/src/tenant.ts` — `tenantId` injected from SDK options at session start; all queries scoped at the DB level (separate schemas per tenant) |
| Idempotency tests | `packages/tools-memory/test/idempotency.test.ts` — `memory.add` deduplicates by content hash; `memory.evolve` is upsert-with-history |

Acceptance: a tenant can `memory.add` 100 atomic notes, `memory.search`
returns relevance-ranked hits, `memory.evolve` updates without losing
history, cross-tenant queries return zero rows (integration test).
Score impact on showcase: none expected (showcase is canonical-only).
Track 3 (memory-in-action) eval begins at week 10 and is where memory
scores get measured.

---

## Week 5 — primary-source + freshness sub-agent + Bash sandbox + tenant-systems MCP stub

| Task | Deliverable |
|---|---|
| `@offshoreai/tools-primary-source` handler | `packages/tools-primary-source/src/fetch.ts` — cached + last-modified-header-aware, allowlist of `jerseylaw.je`, `gov.je`, `jerseyfsc.org`, `statesassembly.je` |
| Disk cache for primary-source fetches | `packages/tools-primary-source/src/cache.ts` — keyed by URL + ETag/Last-Modified |
| Freshness-checker sub-agent | `prompts/sub-agents/freshness-checker.md` is the prompt (week 0 delivered); `packages/agent/src/sub-agents/freshness-checker.ts` is the `AgentDefinition` wiring per PRD §8 |
| `PreToolUse` hook on `corpus.*` content-returning tools | `packages/agent/src/hooks/freshness-pretool.ts` — triggers freshness-checker, attaches verdict to tool result |
| Bash sandbox + `canUseTool` deny-list | `packages/agent/src/sandbox/{cwd.ts,deny-list.ts}` — per-tenant `/sandbox/<tenant>/`, PATH limited to `rg`/`jq`/`sed`/`awk`/`head`/`wc`/`gh`/`git`, denies `rm -rf`/`sudo`/package installs/non-allowlisted network egress |
| `tenant-systems-mcp` stub | `packages/tenant-systems-mcp/src/{server.ts,connectors/{m365.ts,salesforce.ts}}` — 2 reference connectors stubbed; full impl is per-tenant work |

Acceptance: a corpus file with `last_verified` > 365 days emits a `stale`
verdict on `getFile`; a Bash `rm -rf /` is denied with a structured
refusal; the `tenant-systems-mcp` stub starts under `pnpm dev`.
**Score gate**: on a synthetic stale-corpus eval (a question whose
canonical file is artificially aged past the threshold), the agent
**flags the staleness ≥ 90%** of runs; **zero stale-corpus citations
pass through to the user** on the standard showcase.

---

## Week 6 — citation-verifier sub-agent + baseline skill + 4 orientation bundles

| Task | Deliverable |
|---|---|
| Citation-verifier sub-agent | `prompts/sub-agents/citation-verifier.md` (week 0 delivered); `packages/agent/src/sub-agents/citation-verifier.ts` is the wiring; runs on Opus 4.7 per PRD §12 |
| `Stop` hook | `packages/agent/src/hooks/citation-verify-stop.ts` — invokes citation-verifier; on first reject, replays main agent with verdict for one retry; on second reject, substitutes the refusal template |
| Refusal template | `packages/agent/src/templates/unverified-refusal.ts` — wording configurable per tenant (per PRD §9.2) |
| Baseline skill (always-resident, ~8k tokens) | `.claude/skills/jersey-baseline/SKILL.md` — derived from `skills/templates/baseline.SKILL.md` |
| 4 orientation bundles | `bundles/orientation/{crown-dependency,zero-ten,trusts-overview,jfsc-overview}.yaml` |

Acceptance: a hand-crafted "agent makes a claim with no corpus tool call
in the session log" prompt is rejected by the citation-verifier; the
retry succeeds; the refusal template fires on a second rejection.
**Score gate**: on the adversarial hallucinated-citation set (synthetic
questions whose plausible-but-wrong answers cite real files that don't
support the claim), the verifier achieves **zero false-pass rate**;
first-pass reject rate on the standard showcase is **≤ 15%**;
post-retry reject rate is **≤ 2%**.

---

## Week 7 — bundle-assembler + SessionStart hook + 5 seed trust-officer bundles

| Task | Deliverable |
|---|---|
| Bundle-assembler sub-agent | `prompts/sub-agents/bundle-assembler.md` (week 0 delivered); `packages/agent/src/sub-agents/bundle-assembler.ts` |
| `SessionStart` hook A (bundle load) | `packages/agent/src/hooks/bundle-load-sessionstart.ts` — routes by persona declared in tenant CLAUDE.md + initial-prompt heuristic |
| `SessionStart` hook B (ambient dashboard) | `packages/agent/src/hooks/dashboard-sessionstart.ts` — emits the §7.0.2 ambient context per AGENT-BEHAVIOURS #2 |
| 5 seed trust-officer bundles | `bundles/trust-officer/{cdd-new-trust,distribution-decisions-and-court-blessing,sanctions-screening,article-47-set-aside-for-mistake,sar-threshold}.yaml` (the reference bundle authored in week 0 covers the fourth) |
| 5 seed task skills | `.claude/skills/jersey-trust-officer-{cdd-new-trust,distribution-decisions-and-court-blessing,sanctions-screening,article-47-set-aside-for-mistake,sar-threshold}/SKILL.md` |

Acceptance: starting a session with `persona: trust-officer` and a prompt
containing "Article 47" loads the matching bundle; the dashboard appears
in the first system context. **Score gate**: on bundle-covered showcase
questions (those that map to one of the 5 seed bundles), median
**tool-call count ≤ 3** (vs ≥ 6 on the bare-Read baselines); bundle-
routing accuracy on the 100-question Track 1 set is **≥ 95%**.

---

## Week 8 — shadow pilot opens; Track 1 eval

| Task | Deliverable |
|---|---|
| Shadow-pilot deployment | 2-3 friendly TCBs (PRD §16 question 3 — escalate if not yet secured); each runs against their own tenant directory |
| Tool-call event log | `packages/agent/src/audit/tool-events.ts` — writes to per-tenant Postgres `tool_events` table + S3 JSONL mirror per AGENT-BEHAVIOURS #6 |
| Eval Track 1 (bundle routing) | `evals/track-1-bundle-routing/{queries.yaml,run.ts}` — 100 hand-curated queries per persona; target ≥95% correct bundle on trust-officer |

Acceptance: pilot tenants produce a week of tool-call log data; Track 1
runs on every PR and on a nightly schedule. **Score gate**: Track 1
bundle-routing accuracy on the 100-question set is **≥ 95%** for the 5
seed bundles; all-five-bundle median latency is within 2× of the
single-bundle case.

---

## Week 9 — Track 2 eval + first log-driven bundle batch + observability dashboard

| Task | Deliverable |
|---|---|
| Gold-set authoring | 50 trust-officer questions with lawyer-written reference answers (PRD §16 question 2 — escalate if author not yet secured) |
| Eval Track 2 (answer quality) | `evals/track-2-answer-quality/{questions.yaml,run.ts}` — scores citation precision/recall, legal correctness, freshness handling per PRD §11.1 |
| Log-driven bundle batch | Weekly job in `packages/build/src/jobs/bundle-prioritise.ts` — ranks (persona × task-shape) pairs by frequency × current-fallback-rate; produces 5-8 new bundle YAMLs |
| Replay command | `pnpm replay <session_id>` — engineer-facing tool that replays a session against current corpus state and highlights claims that would now be wrong (PRD §11.3) |

Acceptance: Track 2 gold-set passes **≥ 90% legal correctness**; the
log-driven batch produces bundles whose existence demonstrably reduces
median tool-call count on subsequent matching queries by **≥ 25%** vs
the no-bundle baseline. **Score gate**: per PRD §11.1 Track 2 — citation
precision = 100%, citation recall ≥ 90%, freshness flag = 100% on stale
items.

---

## Week 10 — Track 3 eval + SessionStore S3 adapter + second log-driven bundle batch

| Task | Deliverable |
|---|---|
| Eval Track 3 (memory-in-action) | `evals/track-3-memory-in-action/{scenarios.yaml,run.ts}` — 20 multi-turn scenarios per persona including adversarial conflict cases |
| SessionStore S3 adapter | `packages/agent/src/session-store/s3.ts` — mirrors SDK JSONL transcripts to S3 for resume-across-hosts |
| Second log-driven bundle batch | another 5-8 bundles from week-10's accumulated logs |

Acceptance: Track 3 surfaces note/corpus conflicts (memory does not
silently override); SessionStore S3 round-trips correctly. **Score
gate**: on adversarial scenarios where a stored note contradicts the
corpus, **conflict-surfacing rate ≥ 95%** — the agent flags the
conflict to the user rather than silently obeying either side.

---

## Week 11 — hardening + progressive-disclosure budget metrics + coverage to ≥90%

| Task | Deliverable |
|---|---|
| Audit log productionisation | retention configurable per tenant (default 90/13mo per AGENT-BEHAVIOURS #6); access controls |
| Progressive-disclosure budget telemetry | `packages/agent/src/telemetry/budget.ts` — emits the §5.7 steady-state numbers per session |
| Bundle coverage push | reach ≥ 90% of observed shadow-pilot queries; remaining gaps documented as known-fallback-via-Bash |

Acceptance: §11.2 KPIs (citation-verifier reject rate, tool-call count
median, always-resident schema tokens, agent-driven retrieval rate)
report cleanly in a dashboard. **Score gate (regression watch)**: every
metric established in weeks 3, 5, 6, 7, 9, 10 must hold without
regression vs the week-10 snapshot — hardening must not move the
numbers backwards.

---

## Week 12 — first paying-customer pilot live

| Task | Deliverable |
|---|---|
| Tenant provisioning script | `packages/build/src/jobs/provision-tenant.ts` — creates `tenants/<id>/` skeleton + Postgres schema + S3 prefix + secrets entries |
| First tenant config | `tenants/<id>/{CLAUDE.md,.claude/settings.json,mcp-config.json}` |
| Smoke tests + go-live runbook | content of the eventual `TENANT-ONBOARDING.md` starts crystallising here |

Acceptance: a Jersey TCB can issue a real query, the agent answers with
a real bundle, the answer is citation-verified, and the tenant can
inspect the tool-event log. **Score gate (sticky baseline)**: at launch,
the `offshoreai-agent` harness beats `claude-p` by **≥ 25 percentage
points overall pass-rate** on the showcase eval, with both controls
re-baselined within the prior week. The eval re-runs weekly; any
sub-25 pp delta on a new feature is a restraint signal to review the
feature.

---

## Parallel editorial track (weeks 1-8)

Driven by content writers, not implementation engineers, but tracked here
for visibility. Close the corpus coverage gaps PRD §13 flags as blocking
the MLRO persona: JFSC code-of-practice depth, FSDI BO register,
insolvency/désastre. From week 9, editorial backlog re-prioritises against
shadow-pilot logs — whichever paths the agent hits most often that return
stale/stub/missing get promoted.

PRD §16 question 1 (editorial throughput — do we have / need to hire 1 FTE
Jersey-qualified writer for 6 weeks?) is the open blocker on this track.

---

## Cross-cutting backlog (not week-pinned)

These tasks emerge during weeks 1–12; track them as discovered, work them
in slack capacity:

- **Tool-description regression review** — quarterly per PRD §15 risk
  "Tool sprawl"; uses the §11.3 wrong-tool-call telemetry; output is
  PRs that rewrite descriptions, not system-prompt patches (per
  AGENT-PRINCIPLES Principle 10).
- **Tag taxonomy hygiene** — periodic `grep -r` against `TAGS.md` to find
  unused tags + frontmatter scans for inconsistent application.
- **Stale-corpus alerting** — RSS / States Assembly polling that surfaces
  when a corpus file's primary source has moved, feeding the editorial
  backlog.

---

## Decisions held open (escalation list)

These need stakeholder input; they are *not* code-side blockers for
weeks 1–7, but they will be blockers later:

- PRD §16 Q1 (editorial throughput) — blocks JFSC/BO coverage; affects
  MLRO persona depth; week 8+ pilot may be thinner without resolution.
- PRD §16 Q2 (gold-set lawyer) — blocks week 9 Track 2 eval.
- PRD §16 Q3 (pilot customers) — blocks week 8 shadow pilot opening.
- PRD §16 Q4 (hosting topology — tenant-per-process vs tenant-per-thread) —
  affects week-12 deployment shape; assume per-process until told otherwise.
- PRD §16 Q5 (brand) — blocks public-facing language but not code.
- PRD §16 Q6 (verifier-as-product) — strategic; not a v1 blocker.
