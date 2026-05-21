# Bundle / wormhole mechanism — forward design

How precompiled context evolves from hand-authored **bundles** into a
self-densifying graph of **wormholes** — derived shortcut nodes the agent
authors, served by the same retrieval as the rest of the corpus.

This is a **design, not a build**. Nothing here ships until the
hypothesis test in Phase B shows a wormhole beats agentic retrieval *and*
the sticky `claude-p` control on a recurring, expensive question. The
point of writing it now is that today's bundle authoring stays
forward-compatible, and the implementation has a spec to build against.

For *how to author a bundle today*, see [`README.md`](./README.md). For
the strategic frame this sits inside, see the design-frame section of
[`../AGENT-BEHAVIOURS.md`](../AGENT-BEHAVIOURS.md). For the build order,
see [`../WORMHOLES-IMPLEMENTATION-PLAN.md`](../WORMHOLES-IMPLEMENTATION-PLAN.md).

---

## The model in one paragraph

A **bundle** is a hand-authored retrieval contract for a `(persona,
task)`: the files, articles, tags, freshness window, and citation pattern
the agent needs. A **wormhole** is the same idea reached from the other
end: a *derived* node — a distilled, cited, task-general context — that
the **agent itself authors** when it notices it has just synthesised a
generalised, reusable insight over stable sources. Both are "precompiled
context the agent queries instead of re-deriving." A curated bundle is a
human-blessed wormhole; a wormhole is a machine-drafted bundle. They
converge on the same artifact: a corpus node, shallow-linked from the
entry point, served by ordinary traversal.

The recursive payoff: **compilation folds back into the knowledge graph.**
A compiled context is not a sidecar cache with its own store, key, and
lookup — it is a markdown file with frontmatter, tags, and `see_also`
links, served by the same `findByTag` / grep / tree / `getFile` the agent
already uses. The retrieval we are hardening *is* the cache index. The
hardest problem of a separate cache — a deterministic question→key
classifier — **dissolves**, because retrieval-by-navigation replaces
retrieval-by-key.

---

## Why "wormhole"

A wormhole is a shortcut through the graph that collapses a long, expensive
traversal (grep → sibling reads → synthesise) into **one hop** from near
the entry point to the distilled destination. "Shallow-linked from the
entry point" is literally the wormhole's mouth, and **link-depth-from-index
= cache warmth**: a wormhole linked one hop from a section/use-case index
is hot; a deeper one is cold.

The metaphor also carries the central safety rule: **a wormhole can only
open onto primary ground, never onto another wormhole.** Every wormhole is
at most one hop from hand-authored bedrock — no second-order derivation,
no drift-of-drift, no cycles.

---

## Substrate: git, not a bespoke store

Compiled output is ordinary corpus content, so **git is the store** — it
already does versioning, provenance (`git blame` / history), divergence
(branches), contribution-back (PR), and the canonical/tenant relationship
(upstream + fork). We do **not** build an overlay store or a cache engine.

- **Canonical corpus** = the upstream repo (hand-curated, the source of
  truth).
- **Tenant corpus** = a fork. Tenant-specific divergence is commits on the
  fork; nothing reaches canonical except by PR. `git diff upstream/main`
  is exactly "what this tenant added." The fork boundary *is* the
  multi-tenant firewall.
- **Promotion** of a valuable general wormhole = a PR from fork to
  upstream, reviewed as a diff, validated by CI. Editorial review is PR
  review.
- The agent reads **one working tree** (its fork's checkout), which
  already contains canonical + derived + tenant content merged by git.
  **The retrieval tools need zero changes** — a wormhole is just a file.

**Cadence note.** Git's cadence (commit/merge/concurrency) fits *durable
accretion*, not per-miss machine-speed writes. So compilation is a
**deliberate, low-frequency accretion**, not a real-time cache: drafts are
captured cheaply inline (below), but only promoted at git cadence once
they've earned it. A real-time hot cache, if ever needed, is a volatile
in-process accelerator *in front of* git — never a rival source of truth.
We are not building it.

---

## Lifecycle: the agent is the compiler

There is no separate "context compiler" pipeline. The capability that
answers a question live — find the right files, read the right parts,
synthesise a cited answer — *is* the capability that produces a wormhole.
A wormhole is that capability's output, persisted when it's worth keeping.

```
 draft (inline, cheap) ── at the end of answering, if the agent judges it
        │                 synthesised a GENERALISED insight, over STABLE
        │                 sources, after NON-TRIVIAL traversal, it writes a
        │                 candidate wormhole node (scoped Write) to a
        │                 staging area and commits it. Drafting != publishing.
        ▼
 promote (gated) ─────── the citation-verifier (AGENT-BEHAVIOURS #4) MUST
        │                pass the candidate before it enters the served
        │                graph. Self-authoring: yes. Self-verifying into
        │                trust: never — that is the exact bias #4 exists for.
        ▼
 serve ───────────────── a promoted wormhole is an ordinary node: tagged,
        │                shallow-linked, found by normal traversal. No
        │                special lookup path.
        ▼
 evict ───────────────── the log loop culls wormholes that go cold (never
                         traversed) or bypassed (agent greps past them).
                         publish-then-evict: quality-gated at birth,
                         demand-culled at death.
```

### Why drafting is inline (and cheap)

The expensive part — loading context and reasoning over it — is already
paid by the time the agent finishes answering; the generalised insight is
*hot* right then. A separate batch job would reload the sessions, re-read
the files, and re-derive it from logs (lossy and costly). Inline is both
cheaper and higher quality — especially for the **instance→class
generalisation** (strip this question's specific facts, keep the reusable
substrate), which the model does best immediately after the specific
reasoning, with both the specifics and the general structure in mind.

### Why publishing is gated and demand-driven

A single session can judge **quality** (is this a clean, generalised
insight?) but not **demand** (will this recur / be traversed?) — those are
orthogonal. So:

- **Verifier gate (non-negotiable).** A candidate is unverified machine
  output; it stays quarantined (`status: draft`) until the
  citation-verifier passes it. A hallucinated wormhole must never become a
  fast hit for everyone.
- **Demand: publish-then-evict (the chosen default).** Rather than
  blocking publication until a shape provably recurs, we let
  verifier-passed wormholes publish, and rely on the eviction loop to cull
  the ones that go cold. This favours autonomy and keeps the served graph
  honest via the cull rather than a birth gate. (The alternative —
  gate-at-birth on recurrence — stays available if clutter proves a
  problem.)

### What decides distillation (the trigger)

Most of the signal is **already in the structured event log** (tool-call
count, files touched, source stability, the verifier verdict) — so
nomination is a **cheap deterministic query**, not inference over every
session. The inline self-flag is a near-free *enrichment* (the agent
pre-labels shape + cost + stability at the moment it has them), feeding
that aggregate. Inference is spent only on the distillation of nominated
winners. The same log loop that nominates also evicts (cold / bypassed
nodes) — one loop governs birth and death. This is the §11.3 audit loop
(AGENT-BEHAVIOURS #6) earning a second job.

---

## The derived-node contract (what makes a node a wormhole)

A wormhole is a corpus file with these additions to the standard
frontmatter (full spec in [`../CONVENTIONS.md`](../CONVENTIONS.md)). All
additive — a node without them is an ordinary corpus file.

```yaml
derived: true                    # marks this as machine-derived, not hand-authored
derived_from:                    # the PRIMARY nodes this distils — provenance
  - path: knowledge/jersey/use-cases/founder-entrepreneur/why-jersey-topco.md
    content_hash: sha256:…       # body hash at compile time (for invalidation)
    last_verified: 2026-04-02    # frontmatter snapshot at compile time
  - path: knowledge/jersey/use-cases/founder-entrepreneur/migration-pre-ipo.md
    content_hash: sha256:…
    last_verified: 2026-03-15
status: draft                    # draft = unverified/quarantined; promoted to
                                 # review/stable only after the verifier passes
# plus the normal title / jurisdiction / category / tags / sources / see_also
```

Three rules the validator enforces:

1. **Marked.** `derived: true` ⇒ `derived_from` is present and non-empty.
2. **No second-order derivation.** Every `derived_from` path must exist
   and must itself be a *primary* (non-derived) node. A wormhole opening
   onto another wormhole is rejected.
3. **Quarantine.** A `derived` node may not carry `status: stable` without
   a recorded verifier pass (CI/promotion enforces this; authoring-time it
   starts `draft`).

Invalidation is then free from the graph: when a `derived_from` source's
current `content_hash` (or `last_verified`) no longer matches the recorded
snapshot, the freshness checker (#3) nils the wormhole → it is re-drafted
on next demand.

**Don't derive high-decay content.** Frontier files (`expected_decay`
short) churn too fast to cache; stable doctrine is the ideal wormhole
source. Eligibility is read off the layer + decay metadata.

---

## Capture mechanism: Write + git, no bespoke tool

The agent authors a wormhole by **writing a file** (`Write`) and committing
it — not via a bespoke `proposeWormhole` tool. The two jobs such a tool
would do are already covered:

- **No answer pollution.** A `Write` call is a `tool_use` block, not a
  text block, so it does not concatenate into the runtime's accumulated
  `answer` (unlike interim prose). The capture stays out of the response.
- **Validation.** The convention validator + CI already enforce
  frontmatter shape, closed-tag membership, and the derived-node rules
  above. Validation lives at commit/CI time, not in a capture tool.

**Posture change (scoped).** This flips the agent from read-only to
read-*write*, but only through a narrow lane: `canUseTool` sandboxes
`Write` to the **staging path** (`wormholes/candidates/…`) — the agent can
*add* candidates, never edit hand-authored corpus (the curated graph stays
sacred). The audit log (#6) captures every write. We reuse the deny-list /
sandbox (#5) already specced; we don't invent new safety.

**Commit boundary.** The agent may commit its draft to the *staging*
branch/dir on its own judgement. What it may **not** do unilaterally is
merge into the served/trusted branch — promotion requires the verifier
pass. The boundary is *staging vs served*, not *agent vs system*.

---

## Invariants

- **Canonical-only firewall.** Wormholes derived from the canonical corpus
  are shareable; tenant-specific framing lives on the tenant fork and never
  reaches upstream except by PR.
- **The query-time path is never removed.** A cold/invalidated wormhole
  graph must degrade to agentic retrieval (`findByTag`, grep, `getFile`),
  never to failure. Wormholes optimise hot paths; PRD §6.4 governs the tail.
- **Additive only.** Every field here is optional; a node without them
  behaves exactly as today. No reformat, no flag day. Today's bundles stay
  valid.
- **Eval-gated, per Appendix C.** A wormhole ships only if it beats its own
  query-time fallback and the `claude-p` control. A wormhole that scores
  worse than the retrieval path it replaced is an auto-evict signal — the
  graph A/B-tests itself against the thing it stands in for.

---

## What's irreducibly new (vs reused machinery)

Reused: git (store/versioning/provenance/merge), the convention validator
(node rules), the citation-verifier #4 (promotion gate), the audit loop #6
(nomination + eviction), the freshness checker #3 (invalidation), ordinary
retrieval (lookup). The genuinely new work is small:

1. **Derived-node conventions + validator rules** (Phase A — deterministic).
2. **The instance→class distillation** — writing a good task-general node
   (the real quality work; done inline by the agent).
3. **Scoped staging `Write`** + the inline drafting trigger (runtime
   posture change).
4. **Verifier-gated promotion + eviction** wiring into the log loop.

Notably absent from this list: a cache store, a key/intent classifier, a
separate compiler, a `getBundle`-style lookup for wormholes. The fold
deleted them.

See [`../WORMHOLES-IMPLEMENTATION-PLAN.md`](../WORMHOLES-IMPLEMENTATION-PLAN.md)
for the phased build order and eval gates.
