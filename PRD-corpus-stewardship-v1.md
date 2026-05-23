# PRD — Corpus Stewardship (v1)

**Status:** draft for review
**Author:** Mike Kelly (with Claude)
**Date:** 2026-05-23
**Audience:** product/eng founder & first engineer(s); content editorial
**Scope:** the *writing-side* of the corpus — conventions, tooling, and a
maintenance agent. Peer to [`PRD-baseline-agent-v1.md`](./PRD-baseline-agent-v1.md),
which covers the *reading-side* (the answering agent).

---

## 0. TL;DR

The baseline PRD assumes the corpus is well-maintained. This PRD is how
that assumption gets paid for. Two complementary moves:

**Part A — iwe-aligned conventions and tool affordances.** Adopt the
*inclusion-link* convention from [iwe](https://iwe.md) — *a markdown
link on its own line is a structural parent→child relationship; an
inline link is a cross-reference*. We already write `index.md` files
this way; documenting it turns implicit practice into a machine-readable
hierarchy alongside folders + [`TAGS.md`](./TAGS.md). Fold iwe-shaped
affordances (`depth`, `parentContext`, `tree`) into our existing
[`corpus.*`](./packages/tools-corpus/) handlers so the agent gets
mechanical sibling/parent retrieval instead of the prose nudge in
[`CLAUDE.md`](./CLAUDE.md). Pilot the `iwe` binary as a developer-side
editing tool (link-safe renames, section extract/inline, graph stats)
— never on the agent's runtime tool surface. Architectural restraint
([Baseline PRD Appendix C](./PRD-baseline-agent-v1.md)) is satisfied
because iwe is genuinely external code at a cross-process boundary, not
a CLI over functions we own.

**Part B — Knowledge Manager Agent.** A second agent — separate process,
separate authority, scheduled rather than user-triggered — whose job is
to *maintain* the corpus rather than read from it. Three sub-agents under
one runtime, with three strictly bounded authority levels:

1. **Auditor** (read-only) — scheduled scan for stale `last_verified`,
   broken cross-links, claims without citations, dead primary-source
   URLs. Output: reports to `corpus-health.md` and BACKLOG.
2. **Refresher** (PR-only) — fetches live primary sources, diffs, opens
   PRs with `last_verified` bumped or substantive edits flagged. Never
   auto-merges to `stable`.
3. **Outreach coordinator** (drafts-only) — drafts emails to a curated,
   opt-in panel of named experts for second opinions on judgment calls
   primary sources can't settle. Human reads and sends.

These two parts share a single PRD because Part A is partially enabling
for Part B: the manager uses inclusion-link awareness to navigate, uses
depth-aware retrieval for context-bounded diffs, and reuses the iwe CLI
(at human invocation) for link-safe edits. They are scoped to be staged
independently — Part A can ship without Part B; Part B Auditor can ship
without Part B Refresher/Outreach.

The strategic point this gets at: the answering agent and the manager
agent are two sides of the same architecture. They share the freshness
contract, the source hierarchy, and the eval surface — but have opposite
authority directions. Building both turns the corpus from "Jersey wiki
with an MCP" into "self-maintaining knowledge graph with eval-measured
quality on both axes." Editorial throughput is one of the six unresolved
items in [baseline PRD §16](./PRD-baseline-agent-v1.md); this PRD is the
proposed resolution.

---

## 1. Motivation

### 1.1 The editorial-throughput problem

The corpus's quality moat is hand-curation: every `last_verified` date
represents a real editorial check against a primary source. That moat is
also the corpus's scaling bottleneck. Three failure modes already visible:

1. **Mechanical decay.** `last_verified` ages whether anyone watches it
   or not. The [`freshnessCheck`](./packages/tools-corpus/src/handlers/freshnessCheck.ts)
   tool surfaces stale verdicts to the answering agent — but nothing
   *acts* on them. A stale file stays cited (with a caveat) until a
   human notices.
2. **Find-the-work tax.** The biggest cost of editorial work isn't the
   editing — it's identifying *which* file needs editing. Today this
   means manual cross-checks against [`gaps.md`](./knowledge/jersey/history/finance/gaps.md),
   [`COVERAGE-AUDIT.md`](./knowledge/jersey/COVERAGE-AUDIT.md), and
   conversation logs.
3. **Claim drift across files.** The corpus has many files; the same
   claim sometimes appears in three of them with slightly different
   paraphrasings. There is no mechanism today that notices this and
   canonicalises.

### 1.2 The iwe convention as enabling infrastructure

[iwe](https://iwe.md) (a Rust CLI + LSP + MCP layer over markdown
corpora) ships an opinionated convention we have effectively already
adopted without naming it: a markdown link on its own line is a
structural parent→child relationship; an inline link is just a
cross-reference. Their [`seventeen-centuries`](https://github.com/iwe-org/seventeen-centuries)
example repo is a 1,200-document philosophical knowledge graph built on
this single convention.

The convention is worth borrowing for three reasons:

1. **We already write this way.** [`knowledge/jersey/index.md`](./knowledge/jersey/index.md)
   has bare-line links under each section; [`CROSS-JURISDICTIONAL-MAP.md`](./knowledge/CROSS-JURISDICTIONAL-MAP.md)
   has 35 of them; [`knowledge/jersey/trusts/index.md`](./knowledge/jersey/trusts/index.md)
   has 25. We just haven't *named* the convention.
2. **It gives the agent a machine-readable hierarchy beyond folders +
   tags.** Folders organise editing; tags organise topical retrieval;
   inclusion-links organise *navigation context* (parents, siblings,
   children). The baseline PRD §6.4 commits to "query-time retrieval is
   the agent's job" — inclusion-links make that retrieval cheaper.
3. **It unlocks tooling without committing to lock-in.** The convention
   is just a writing rule; we can adopt it without ever installing iwe.
   But if we do install iwe, we get a free editor LSP, refactor
   commands, and a graph-stats CLI that work because we follow the
   convention.

The relationship between Part A and Part B: the knowledge-manager agent
in Part B *uses* the inclusion-link graph to bound the blast radius of
its proposed changes (e.g. "when refreshing X, also re-verify X's
inclusion-link parents"). It can be built without Part A, but works
better with it.

---

## 2. Scope

### 2.1 In scope (v1)

**Part A:**
- Add the inclusion-link convention to [`CONVENTIONS.md`](./CONVENTIONS.md)
  as a documented rule with examples.
- Add a `depth` parameter to [`getFile`](./packages/tools-corpus/src/handlers/getFile.ts)
  that follows inclusion links N levels into children.
- Add a `parentContext` parameter to [`getFile`](./packages/tools-corpus/src/handlers/getFile.ts)
  that includes N levels of parent context (parents discovered by
  inverse-scanning which files include this one as a bare-line link).
- Add a new `corpus.tree` handler that returns the inclusion-graph
  rooted at a path, in TOON format, with depth bound.
- Document the `iwe` binary as a supported developer-side tool in
  [`SETUP.md`](./SETUP.md) and AGENTS.md, with usage notes for `iwe
  rename`, `iwe extract`, `iwe inline`, `iwe stats`, `iwe export dot`.

**Part B:**
- Ship the **Auditor** sub-agent as a `pnpm corpus-audit` CLI producing
  `corpus-health.md`. Includes: stale-file list, broken-cross-link list,
  dead primary-source URL list, claim-drift detector, citation-coverage
  per file.
- Add `last_verified_by: human | agent | hybrid` to the frontmatter
  spec in CONVENTIONS.md; default `human` for existing files.
- Add a new eval class — *manager evals* — that deliberately introduce
  corpus defects and measure whether the Auditor finds them.

### 2.2 Deferred (v2+, behind v1 evidence)

- **Refresher** sub-agent (PR-opening). Deferred until the Auditor has
  produced enough signal to know which classes of refresh are
  mechanically safe.
- **Outreach coordinator** sub-agent. Deferred until panel curation is
  designed; needs explicit opt-in process for named experts.
- Scheduled-run scaffolding (nightly/weekly cron). v1 is on-demand only.

### 2.3 Explicitly out of scope

- Running iwe's MCP server alongside the `corpus` MCP at agent runtime.
  These overlap on retrieval surface area and the `corpus` connector
  owns the load-bearing freshness/citation envelope. See §3.4.
- Replacing the `corpus.*` toolset with iwe-native conventions. The
  `getArticle` dispatch ([context.ts:50-65](./packages/tools-corpus/src/context.ts:50))
  and the closed-TAGS index ([findByTag](./packages/tools-corpus/src/handlers/findByTag.ts))
  are corpus-specific affordances iwe doesn't provide.
- Bot-driven outbound email to anyone not on the curated panel.
- Auto-merge of any agent-authored corpus changes to files with
  `status: stable`.

---

## 3. Part A — iwe-aligned conventions and tool affordances

### 3.1 The inclusion-link convention

**The rule.** A markdown link on its own line is a *structural
parent→child* relationship — the containing file is the parent of the
linked file. A markdown link inside prose is a *cross-reference* —
backlink-discoverable but not structural.

**Worked example.** In [`knowledge/jersey/index.md`](./knowledge/jersey/index.md),
the "Sections" list contains bare-line links to `government/index.md`,
`legal-system/index.md`, `tax/index.md`, etc. Under this convention,
those declare *Jersey is the parent of each of those sections*. An
inline link like `the [Article 47B mistake regime](./trusts/article-47-set-aside.md)`
in a paragraph is a *reference*, not a structural relationship.

**Polyhierarchy is allowed and expected.** The same file can be the
child of multiple parents. `firewall.md` is a child of `trusts/index.md`
(by directory and by inclusion link in the trusts section list) *and* of
`use-cases/family-office-adviser/index.md` (by inclusion link in the
family-office persona's relevant-concepts list). This is the same
polyhierarchy the iwe `seventeen-centuries` example uses for
philosophical concepts.

**Why this matters mechanically.** Given the convention, an agent (or
the tooling in §3.2) can compute, for any file:

- Its **structural parents**: files that include it via a bare-line link.
- Its **structural children**: files it includes via bare-line links.
- Its **siblings**: structural children of any of its structural parents.
- Its **structural ancestors**: transitive parents.

This gives the corpus a third navigation axis alongside folders
(physical layout) and tags (topical index). The three axes answer
different questions: folders say *where to edit*, tags say *what's
about*, inclusion-links say *what context this lives inside*.

**The cost of the convention is zero.** Every index.md file in the
corpus already follows it. The work is editorial: audit non-index files
to confirm they don't have inadvertent bare-line links that should be
inline (or vice versa), and add a short section to
[`CONVENTIONS.md`](./CONVENTIONS.md) documenting the rule with examples
and the exceptions (footnote-style references, table-of-contents links,
"Sources" bibliography lists — all of which are legitimately bare-line
but are *not* structural parenting).

### 3.2 Depth and parent-context on existing tools

The baseline agent today reads files one at a time. The CLAUDE.md
operating discipline asks the agent to *manually* "read the on-topic
siblings on a multi-part question" — a prose nudge that the agent will
sometimes skip under context pressure. Mechanise that.

**`getFile` additions:**

```ts
{
  path: string;                  // existing
  depth?: number;                // NEW: follow inclusion links N levels (default 0)
  parentContext?: number;        // NEW: include N levels of parents (default 0)
  format?: "markdown" | "toon";  // existing
}
```

Behaviour:
- `depth: 0` (default) — current behaviour, return just the file.
- `depth: 1` — return the file plus the bodies of every file it
  includes via a bare-line link, framed with a divider and a
  `included_from:` annotation.
- `depth: N` — recurse N levels. Capped at 3 by config; above that,
  return a `truncated_at_depth: N` signal per AXI output discipline.
- `parentContext: 1` — also include the file's structural parents,
  framed with `parent_of_target:`.

Output is TOON-shaped per [baseline PRD §7.0.2](./PRD-baseline-agent-v1.md);
the response envelope reports `included_files: [...]` and
`truncated: bool` so the agent can decide whether to follow up.

**New `corpus.tree` handler.** Returns the inclusion-graph rooted at a
path, depth-bounded, in TOON. Equivalent to `iwe tree -k <key> -d N`
but in our envelope (`status`, `last_verified`, citation discipline
preserved). Use case: the agent asks `corpus.tree(path:
"knowledge/jersey/trusts/index.md", depth: 2)` to get the full
sub-graph of trust-related concepts before answering a multi-part trust
question.

**Eval-gated rollout.** Before adding `depth` / `parentContext` to the
default agent prompt, run an A/B on the showcase eval at
[`evals/baselines/2026-05-19-offshoreai-agent-full/`](./evals/baselines/2026-05-19-offshoreai-agent-full/).
The hypothesis: the three PARTIAL cases are failing on missing sibling
context. If true, ship. If the partials are failing on something else,
ship the params but don't promote them to the default discipline — keep
them as an agent-callable affordance, not a behaviour.

### 3.3 iwe CLI as developer-side editing tool

The iwe binary ships a set of refactoring commands that are genuinely
hard to replicate ourselves and that we currently do poorly or
manually. Three concrete wins:

1. **`iwe rename <old-key> <new-key>`** — link-safe file rename across
   the entire corpus. Today this is a grep-and-pray operation over
   thousands of cross-links. iwe updates every reference atomically.
   Strict win.
2. **`iwe extract <doc-key> --section "Title"`** and **`iwe inline
   <doc-key>`** — pull a heading-bounded section out into its own file
   (preserving the inclusion-link), or inline a child back into its
   parent. The corpus's one-concept-per-file commitment makes this a
   common operation; today it's manual cut-paste with link rewriting.
3. **`iwe stats`** and **`iwe export dot`** — orphan detection (files
   with no inclusion-link parents), root detection (files with no
   inclusion-link parents that *should* be roots like index.md vs
   accidental orphans), graph density. Direct feed into
   [`COVERAGE-AUDIT.md`](./knowledge/jersey/COVERAGE-AUDIT.md) and the
   Auditor sub-agent in Part B.

**Where iwe is installed.** As a developer-machine dependency, not in
production. Documented in SETUP.md with `cargo install iwe` or the
distributed binary. Configured per-project via `.iwe/config.toml` —
which we add to the repo so editor LSP integrations work out of the
box.

**What it knows about our corpus structure.** iwe expects either a flat
graph directory or hierarchical key-prefixed files. We'll need to test
whether iwe groks our per-jurisdiction nested layout
(`knowledge/jersey/trusts/firewall.md` etc.) — the open question is
whether the inclusion-link discipline alone is enough for iwe's
discovery, or whether we need a `.iwe/config.toml` that points at
`knowledge/` as the root. This is a non-blocking experiment that ships
with the v1 rollout.

### 3.4 What we deliberately don't do

**Don't run iwe's MCP server at agent runtime.** The iwe MCP and our
`corpus` MCP overlap on retrieval (`iwe retrieve` ≈ `corpus.getFile`)
but the corpus connector owns the load-bearing pieces:

| Capability | `corpus` MCP | iwe MCP |
|---|---|---|
| Read file by path | ✓ | ✓ |
| Read article by (statute, article) dispatch | ✓ | ✗ |
| Closed-TAGS taxonomy index (`findByTag`) | ✓ | ✗ |
| `last_verified` / `status` envelope on responses | ✓ | ✗ |
| Source-hierarchy (`kind: statute / regulator / ...`) | ✓ | ✗ |
| Inclusion-link traversal (after Part A.2 lands) | ✓ | ✓ |
| Refactor commands (rename, extract, inline) | ✗ | ✓ |

Stacking both on the agent would burn tool-surface budget per [baseline
PRD §7.0.2](./PRD-baseline-agent-v1.md) and the AXI 30-tool / 185k-token
finding, without adding a unique runtime capability. iwe stays a
human-invoked tool. Its refactor commands run from a developer
terminal, not from the agent's Bash lane.

**Don't pre-emptively migrate the corpus to iwe-flat layout.** The
nested per-jurisdiction directory structure is editorially meaningful
(`knowledge/jersey/trusts/` is *also* a coverage statement). Flattening
to `graph/` would lose that. The convention is independent of the
layout; we adopt the convention without the layout.

**Don't add iwe to the build/CI pipeline.** Optional developer
ergonomics, not a required dependency. CI continues to validate
frontmatter, tags, and citations via the existing
[`packages/build`](./packages/build/) pipeline.

---

## 4. Part B — Knowledge Manager Agent

### 4.1 The shape of the second agent

Two agents on the same corpus:

| | **Answering agent** (baseline PRD) | **Knowledge-manager agent** (this PRD) |
|---|---|---|
| Invocation | User question, real-time | Scheduled / on-demand, batch |
| Direction | Reads corpus, writes user-facing answer | Reads corpus, writes back to corpus (or to PRs / drafts) |
| Discipline | Citation-mandatory | Verification-mandatory |
| Latency budget | Seconds | Minutes to hours |
| Authority | None over corpus | Three bounded levels (see §4.2) |
| Eval class | Coverage / showcase / adversarial | **New: manager evals** (§5) |
| Audit trail | Conversation logs | Git history + `corpus-health.md` + outbox-drafts |

Shared:
- Same corpus, read through the same `corpus.*` MCP.
- Same freshness contract (`last_verified`, `freshnessCheck`).
- Same source hierarchy preference.
- Same closed-TAGS taxonomy.

### 4.2 Three sub-agents, three authority levels

The whole architecture of Part B is the authority model. If the
knowledge-manager were allowed to write directly to `stable` files, the
`last_verified` contract goes circular — the agent verifies its own
work. The three sub-agents are *defined by* what they're allowed to do.

#### 4.2.1 Auditor (read-only)

**What it does.** On invocation, scans the corpus and produces a
report. Specifically:

- Stale files: `last_verified` older than configurable threshold
  (default 180 / 365 days for warn / stale).
- Broken cross-links: any markdown link to a corpus path that no longer
  resolves.
- Dead primary-source URLs: any URL in a `sources.md` or inline
  citation that returns non-200.
- Claims without citations: paragraphs containing legal/regulatory
  assertions (heuristic: presence of "Article", "Law", "Regulation",
  "the JFSC", named statutes) but no link to a corpus file or external
  primary source within N lines.
- Load-bearing draft files: files with `status: draft` cited by other
  files marked `status: stable`.
- Claim drift: identical or near-identical assertions appearing in
  three or more files with different wordings (LLM-graded, sampled).

**Tools it uses.** The existing `corpus.*` toolset plus `Read`,
`Grep`, `Glob`, `Bash` (for URL checks via `curl -I`), and
`primarySource.fetch` (per [baseline PRD §7.2](./PRD-baseline-agent-v1.md))
in HEAD-only mode for URL liveness.

**Output.** A single markdown file `corpus-health.md` at repo root,
sectioned by finding type, with paths and one-line summaries. Entries
that are also editorial-backlog material are also appended to
[`BACKLOG.md`](./BACKLOG.md) under a dated section.

**Authority.** Zero. Produces text. Humans read.

**Why this ships first.** Risk-free, immediate value (the find-the-work
tax is the biggest of the three editorial problems in §1.1), and
produces enough signal to design Refresher and Outreach properly.

#### 4.2.2 Refresher (PR-only, deferred to v2)

**What it does.** For files where the primary source is *fetchable and
diffable* (jerseylaw.je statute pages, gov.je policy pages, JFSC
handbook PDFs, statesassembly.je records — the canonical roots in
[`knowledge/jersey/sources.md`](./knowledge/jersey/sources.md)):

1. Fetches the current primary source.
2. Diffs the relevant portion against the corpus claim.
3. If no semantic diff: opens a PR bumping `last_verified` only.
4. If semantic diff: opens a PR with proposed edits and the file's
   `status` downgraded to `draft` pending human review.
5. Updates the `last_verified_by: agent` frontmatter field on PRs it
   originates (see §4.3).

**Authority.** PR-only. Never auto-merge. Never edit files with
`status: stable` directly — the agent's only path to a stable file's
content is via a `draft` intermediate and human approval.

**Why deferred.** The Refresher's correctness depends on (a) the
primary-source fetch being reliable (and the fetch tool defending
against scraping breakage), (b) the diff being semantically meaningful
rather than cosmetic whitespace, and (c) the new-eval class in §5
existing to grade refresh quality. All three need v1 work before
Refresher is safe.

#### 4.2.3 Outreach coordinator (drafts-only, deferred to v3)

**What it does.** For genuinely uncertain claims that primary sources
can't settle — market practice, judgment calls, post-judgment
practitioner consensus — drafts an email to a named expert from a
pre-curated, opt-in panel asking the specific question. The draft
lands in an outbox (filesystem or email-client integration). A human
reads, edits, sends.

**Authority.** Outbox-drafts only. Never sends. Never adds anyone to
the panel.

**Why outreach is the riskiest sub-agent.** A bot-driven outbound
channel from "the corpus" to offshore practitioners burns goodwill
catastrophically if any of three things go wrong: rate (too many
questions per expert per month), tone (overly demanding or robotic),
or false attribution (an expert's answer mis-summarised in a corpus
file). The constraint design:

- **Panel curation is manual.** A human invites named experts; experts
  opt in via signed agreement. The panel list lives in
  `knowledge/_meta/outreach-panel.md` with a per-expert rate limit and
  preferred-question-types tag.
- **Rate limits are enforced by the runtime**, not by the agent's
  judgment.
- **Every send is human-approved.** The agent drafts; a human reviews
  and clicks send.
- **Expert responses are added as `status: draft` files** under
  `knowledge/<jurisdiction>/expert-opinions/`, attributed by name with
  the expert's permission, and only promoted to `stable` after a human
  cross-checks against primary sources.

**Why deferred to v3.** Even the design surface here is large enough
that it warrants its own PRD when picked up. v2 ships Refresher; v3
ships Outreach.

### 4.3 Frontmatter additions

One new field, added to [`CONVENTIONS.md`](./CONVENTIONS.md):

```yaml
last_verified: 2026-05-23
last_verified_by: human    # or "agent" or "hybrid"
```

Default for existing files is `human` (since every existing
`last_verified` reflects a manual check). The Refresher sets it to
`agent` on no-diff PRs and `hybrid` on PRs where a human approves the
agent's diff.

**How the answering agent uses this.** The
[`freshnessCheck`](./packages/tools-corpus/src/handlers/freshnessCheck.ts)
handler returns the `last_verified_by` value in its envelope. For
high-stakes claims (heuristic: claim cites a specific Article number, a
specific monetary threshold, or a specific procedural deadline), the
answering agent should *additionally* re-verify the cited assertion
against the primary source if `last_verified_by: agent` — i.e. the
agent doesn't fully trust its own prior verification.

This is the same lemma as "two-person rule" for high-stakes changes,
expressed in `last_verified_by` semantics.

### 4.4 The manager's out-of-band runtime

The manager agent is *not* hosted in the same process as the answering
agent. It runs as a CLI / cron job — `pnpm corpus-audit` (v1),
`pnpm corpus-refresh <path>` (v2), `pnpm corpus-outreach <expert>` (v3)
— with no exposed HTTP endpoint, no user-facing UI surface, no shared
conversation context with the answering agent.

This isolation matters for two reasons:

1. **Cost discipline.** The manager's LLM calls are bounded by
   schedule, not by user demand. Cost is predictable and capped per
   run.
2. **Audit trail discipline.** Manager activity produces git commits
   (Refresher), markdown reports (Auditor), and outbox drafts
   (Outreach) — *all of which are inspectable artifacts*. The answering
   agent's conversation logs are user-private; the manager's outputs
   are repo-public. Different audit surfaces, different access
   patterns, different retention rules.

The manager *can* read conversation logs (with appropriate access
control) to prioritise which corpus files to audit first — the
batch-verifier-monitor entry already in BACKLOG.md is a related
proposal that the manager could subsume or coexist with.

---

## 5. Evals

### 5.1 New eval class: manager evals

Existing evals at [`evals/`](./evals/) measure the answering agent —
*given a question, does the response cite correctly and from
appropriate sources?* The manager needs an inverse eval class — *given
a corpus defect, does the manager find / fix / propose-fix it?*

Three eval kinds, by sub-agent:

**Auditor evals.** Programmatically inject a known defect into a
sandbox corpus copy (`evals/manager/fixtures/`):

- A file with `last_verified` artificially aged past threshold.
- A cross-link rewritten to a non-existent path.
- A primary-source URL replaced with one returning 404.
- A "claim drift" defect — the same fact paraphrased differently in 3
  files.
- A file with an unsupported assertion (no citation within N lines).

Run the Auditor. Assert it surfaces each defect in `corpus-health.md`
with the correct file path and finding type. Score: precision / recall
per defect type.

**Refresher evals (when shipped).** Start from a corpus state where a
file's claim is *known* to diverge from the primary source. Run
Refresher. Assert: (a) it opens a PR, (b) the PR's diff matches the
known divergence, (c) `last_verified_by: agent` is set, (d)
`status: draft` is applied if the diff is substantive.

**Outreach evals (when shipped).** Mock-expert harness — a synthetic
"expert response" file is the ground truth. Assert: (a) Outreach drafts
the right question, (b) sends only to a panel member, (c) the response
lands as a `status: draft` file with correct attribution.

### 5.2 Existing evals continue to measure the answering agent

The two agents are eval-separate. A manager-eval failure doesn't fail
the answering-agent showcase; an answering-agent regression doesn't
fail the manager. They share fixtures (the same corpus) but the eval
runners are distinct under `evals/manager/`.

### 5.3 Cross-eval — does manager activity improve answering quality?

The eventual proof of the manager's value is that the answering
agent's showcase scores improve over time as the manager removes
defects. This is a *longitudinal* eval, not a per-run one — track the
showcase PASS/PARTIAL/FAIL counts over each manager run, expect the
PARTIAL count to drift downward as the manager refreshes stale
high-cited files. Not a v1 metric; surfaces in v2+.

---

## 6. Risks & mitigations

| Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|
| Auditor produces noisy reports humans ignore | Medium | High (kills the whole project) | Sample-tune thresholds in v1 against the actual corpus before promoting to scheduled runs; report categories with worked examples; rate-limit findings per file per run |
| Inclusion-link convention conflicts with existing bare-line links that are *not* structural (TOC lists, bibliographies) | High | Medium | Document exceptions in CONVENTIONS.md (bibliography sections, "Sources" lists, footnote refs); audit script flags ambiguous cases |
| iwe's flat-graph assumption breaks on our nested layout | Medium | Low (degrades to convention-only, no tool wins) | Spike `.iwe/config.toml` against `knowledge/` as root; if iwe can't groke it, fall back to convention-only and skip Move 3 |
| Refresher proposes PRs that look right but quietly mis-paraphrase the primary source | Medium when Refresher ships | Critical (this is the failure mode that destroys corpus credibility) | (a) Refresher only ships after manager-eval suite exists; (b) every Refresher PR sets `status: draft`; (c) human approval required for merge; (d) `last_verified_by: agent` provides downweighting signal |
| Outreach sends a draft as a real email by accident | Medium when Outreach ships | Catastrophic (reputational) | Outbox-drafts only; no SMTP credentials in the agent's environment; manual send-from-mail-client; signed expert panel only |
| Manager + iwe-CLI conflict on file modification (manager opens PR, human runs `iwe rename` mid-PR) | Low | Low | Refresher PRs are isolated branches; conflicts surface as normal git conflicts |
| `last_verified_by: agent` makes the answering agent under-trust its own corpus | Low | Medium | The downweighting in §4.3 is restricted to high-stakes claims (Article numbers, thresholds, deadlines) — not blanket; tune via eval |
| The third navigation axis (inclusion-links) confuses content writers — folders vs tags vs links | Medium | Low | CONVENTIONS.md gives a one-line rule for which axis governs which decision: *folders = where I edit, tags = what it's about, inclusion-links = what context this lives inside* |

---

## 7. Open questions for review

1. **Convention vs tool, sequencing.** Should Part A.1 (convention) and
   Part A.2 (tool params) ship together, or convention-only first? The
   convention is editorial; the tool params need eval evidence. Argue
   for separate PRs.
2. **`tree` handler vs `getFile(depth: N)`.** Is the separate `tree`
   handler necessary, or is `getFile` with `depth` enough? `tree` is
   structure-only (no bodies), which is cheaper context for navigation.
   Probably worth having both.
3. **Auditor cadence in v1.** On-demand only (CLI), or also nightly
   cron? Cron adds infrastructure; CLI alone is enough for v1 if the
   editorial team commits to running it weekly.
4. **Auditor report location.** `corpus-health.md` at repo root,
   `knowledge/_meta/corpus-health.md`, or GitHub issues? Markdown in
   repo gives PR-fodder; issues give triage workflow. Slight preference
   for markdown; deferred to first implementation.
5. **`last_verified_by` migration.** Add to every existing file as
   `human` in a single mechanical PR, or treat absent-field as implicit
   `human`? Mechanical PR is cleaner but a huge diff. Implicit-default
   is lazier but might cause subtle bugs.
6. **Outreach panel — do we need it formally now?** Even though
   Outreach is v3, panel curation has a long lead time (real
   relationships, signed agreements). Argument for starting panel
   recruitment alongside v1 even though the agent doesn't exist yet.
7. **iwe vendoring.** Do we pin a specific iwe version in SETUP.md, or
   take whatever `cargo install` gives? Versioning matters because
   `iwe rename`'s correctness across versions is load-bearing.

---

## 8. Milestones

Proposed sequencing; tied to baseline-agent milestones in
[`PRD-baseline-agent-v1.md` §14](./PRD-baseline-agent-v1.md).

| Milestone | Scope | Depends on | Ships after |
|---|---|---|---|
| **A.1 — Convention** | Document inclusion-link convention in CONVENTIONS.md; audit pass over existing files; one-page reading note in AGENTS.md | None | Independent — could ship next week |
| **A.2 — Tool params** | Add `depth` / `parentContext` to `getFile`; add `corpus.tree`; A/B against showcase eval | Baseline agent eval suite is running | After A.1, after baseline agent v1 ships |
| **A.3 — iwe pilot** | Install iwe locally; `.iwe/config.toml`; document `iwe rename` / `extract` / `inline` / `stats` in SETUP.md | A.1 | Optional, low priority |
| **B.1 — Auditor v1** | `pnpm corpus-audit` CLI producing `corpus-health.md`; defect-injection eval fixtures; manager-eval runner | A.1 (uses inclusion-link graph); baseline-agent `corpus.*` tools | After A.1, after baseline agent v1 evals are stable |
| **B.2 — `last_verified_by` migration** | Add field to CONVENTIONS.md; mechanical PR over existing files; update `freshnessCheck` envelope | None hard; cleaner after B.1 | Bundled with B.1 |
| **B.3 — Refresher v1** | `pnpm corpus-refresh <path>` CLI; per-source-domain fetchers; PR-opening; Refresher eval class | B.1 (need eval surface), B.2 (need `last_verified_by`), reliable `primarySource.fetch` | v2 |
| **B.4 — Outreach v1** | Panel curation process; outbox-draft CLI; expert-opinion file template; Outreach eval class | B.1, B.3, real panel members opt in | v3 |

**Critical path for v1**: A.1 → B.2 → B.1. That's ~2-3 weeks of work
once started, mostly editorial.

---

## 9. Relationship to existing architecture

### 9.1 vs [`PRD-baseline-agent-v1.md`](./PRD-baseline-agent-v1.md)

The baseline PRD is *reading-side*; this PRD is *writing-side*. They
share the corpus, the `corpus.*` MCP, the freshness contract, the
TAGS taxonomy, the AGENT-PRINCIPLES restraint. The baseline PRD's §16
flags editorial throughput as one of six unresolved questions; this
PRD is the proposed resolution.

The baseline PRD's three planned inline sub-agents (citation-verifier,
freshness-checker, bundle-assembler) are *not* replaced by the
knowledge-manager. They run in the answering session; the manager runs
out-of-band. They are complementary.

### 9.2 vs [`AGENT-BEHAVIOURS.md`](./AGENT-BEHAVIOURS.md)

AGENT-BEHAVIOURS documents *answering-agent* behaviours. The manager
gets its own behaviours doc when B.1 ships — provisionally
`MANAGER-BEHAVIOURS.md` or a new §"Out-of-band agents" within
AGENT-BEHAVIOURS. v1 of this PRD doesn't pre-commit; the right surface
emerges from the first implementation.

### 9.3 vs [`AGENT-PRINCIPLES.md`](./AGENT-PRINCIPLES.md) and Appendix C

Architectural restraint applies. The manager:

- Uses the same `corpus.*` MCP as the answering agent — no wrapping of
  our own logic in a second MCP.
- Is invoked via a `pnpm` script (a CLI command, but not a CLI over our
  *own* functions — `pnpm corpus-audit` runs a TypeScript entry point
  directly, the way `pnpm test` runs vitest).
- iwe is genuinely external code at a cross-process boundary — exactly
  the kind of MCP / CLI dependency Appendix C permits.

### 9.4 vs [`KNOWLEDGE-BASE-PRINCIPLES.md`](./KNOWLEDGE-BASE-PRINCIPLES.md)

The "one concept per file" and "agent-orientation" commitments stay
load-bearing. The inclusion-link convention *operationalises*
agent-orientation — it gives the agent a third navigation axis without
requiring the agent to memorise the corpus structure. The manager
agent *enforces* `last_verified` as a real contract rather than a
hopeful annotation.

---

## Appendix A — Why one PRD, not two

The iwe moves (Part A) and the knowledge-manager (Part B) could be
two PRDs. Reasons for one:

1. **Part A is partially enabling for Part B.** The manager uses
   inclusion-link awareness to scope its work; `corpus.tree` is one of
   its primary tools; the iwe CLI is one of the human-side tools the
   manager produces output for. Splitting them would force forward
   references between PRDs.
2. **Both parts are *corpus stewardship*** — operations on the corpus
   as a curated artefact, distinct from the baseline PRD's *agent
   construction* concerns. The shared mental model justifies the shared
   PRD.
3. **The milestones are interleaved.** A.1 ships before B.1, but
   A.2/A.3 ship after B.1 ships. A single PRD makes the ordering
   tractable.

Reasons that argued the other way:

1. Part A is mostly editorial; Part B is mostly engineering. Different
   reviewers, different release cadences.
2. Part A could ship in a single week; Part B takes months. Bundling
   them risks Part A getting stuck behind Part B's open questions.

The compromise this PRD takes: **single document, but Part A and Part
B are independently approvable**. Reviewers may green-light A and defer
B, or vice versa. The milestone table (§8) is structured to make that
explicit.

---

## Appendix B — What we are explicitly not borrowing from iwe

For completeness, the iwe surface we evaluated and rejected:

- **iwe's MCP server at agent runtime.** Reasoned through in §3.4. The
  corpus connector owns the citation envelope; running iwe's MCP
  alongside duplicates retrieval without adding capability.
- **iwe's `squash` command** (combine a document with all its linked
  content into a single file). Looks tempting for bundle assembly, but
  the [baseline PRD §6.2 bundle compiler](./PRD-baseline-agent-v1.md)
  already does this with full control over source-hierarchy and
  freshness annotations. iwe-squash would be a worse version of work
  we've already done.
- **iwe's templates** (`iwe new "Title" --template meeting`). Useful for
  daily-notes workflows; not useful for our corpus, where file creation
  is rare and follows per-section conventions documented in the
  per-jurisdiction `index.md`.
- **iwe's flat `graph/` layout convention.** We keep nested per-
  jurisdiction folders for editorial reasons (§3.4). The
  inclusion-link convention works in either layout.
- **iwe's `inlay hints` / `find references` LSP features.** These ship
  free with iwe if we adopt it; we don't *not* want them, but they're
  not load-bearing for the corpus and don't change the PRD's scope.

---
