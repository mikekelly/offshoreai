# Bundle mechanism — forward design

How the bundle format evolves to support **compiled artifacts** and a
future **read-through cache** (see the design frame in
[`../AGENT-BEHAVIOURS.md`](../AGENT-BEHAVIOURS.md#design-frame-knowledge-compilation-and-the-declarative-retrieval-contract)).

This is a **design, not a build**. Nothing here ships until the
bundle-vs-agentic-retrieval eval cell shows a compiled path beats both
agentic retrieval and the sticky `claude-p` control. The point of
writing it now is that **today's bundle authoring should be
forward-compatible** — every field below is additive, and the
hand-authored bundles in this directory remain valid unchanged.

For *how to author a bundle today*, see [`README.md`](./README.md). This
doc is the *where it's going* layer.

---

## The shift: one contract → contract + compiled artifact

A bundle today is a **retrieval contract**: it names the files,
articles, tags, and rules the agent needs, and the agent reads the files
itself at session start. The compilation direction adds a second,
*generated* object alongside it:

| Object | Authored or generated? | What it is | Lifecycle |
|---|---|---|---|
| **Bundle definition** | authored (curated) *or* generated (fly) | the contract — key, trigger, required files/articles, tags, freshness, refusal, citation pattern, priming | edited in PR (curated) or minted on cache miss (fly) |
| **Compiled artifact** | always generated | the *composed, cited, conflict-resolved context* the agent queries instead of the corpus, plus its provenance | built from the definition; invalidated when sources change |

The definition is the *recipe*; the compiled artifact is the *dish*.
Today we ship only definitions and the agent does the cooking each
session. Compilation moves the cooking upstream and caches the dish.

---

## Three fields that make a bundle cache-ready

These are the only structural additions needed now. They are additive to
both the YAML and `getBundleResult`.

### 1. An explicit key (`key`)

The cache key is what a lookup matches on. Today the unit is
`(persona, task)`; a future fly-compile cache also keys on a normalized
**intent** so two phrasings of the same task resolve to one artifact.

```yaml
key:
  persona: trust-officer
  task: article-47-set-aside-for-mistake
  # Forward field, unused today. The (future) intent classifier maps a
  # raw question to one of these canonical intents before cache lookup.
  # Until the classifier exists, routing is (persona, task) only.
  intents:
    - "can a past trust act be undone for mistake about its tax effect"
    - "set aside a distribution / appointment / transfer into trust"
```

> **The load-bearing risk lives here.** A cache is only as good as its
> key. If the question→key classifier is fuzzy or stochastic, near-miss
> phrasings miss the cache and **variance re-enters at the routing
> layer** — the exact thing compilation was meant to remove. The
> `trigger_description` (human-readable) stays as the routing signal for
> the assembler sub-agent; `key.intents` is the machine-matchable
> surface the classifier will target. Designing and *evaluating* that
> classifier deterministically is a prerequisite for the cache, not an
> afterthought.

### 2. Provenance for precise invalidation (`provenance`, on the compiled artifact)

A compiled artifact records exactly which corpus state it was built from,
so invalidation is *precise* (not a guessed TTL). This block is
**generated at compile time**, never authored.

```yaml
provenance:
  compiled_at: 2026-05-21T10:30:00Z
  corpus_commit: 4f7505e            # repo commit the sources were read at
  compiler: build                   # build | fly | editorial
  sources:
    - path: knowledge/jersey/trusts/article-47-set-aside.md
      content_hash: sha256:…        # hash of the file body at compile time
      last_verified: 2026-04-02     # frontmatter snapshot at compile time
    - path: knowledge/jersey/trusts/article-51-directions.md
      content_hash: sha256:…
      last_verified: 2026-03-15
```

**Invalidation contract:** an artifact is valid iff, for every source,
the file still exists and its current `content_hash` equals the recorded
one **and** its freshness is still within the definition's window. Any
mismatch invalidates the artifact → it is removed from the served set and
queued for recompile. The **freshness-checker (AGENT-BEHAVIOURS #3) is
the invalidation trigger** — it already watches `last_verified`; it gains
the job of nilling artifacts whose sources moved. Because we have
explicit source→artifact provenance, invalidation is exact: changing one
corpus file invalidates *only* the artifacts that compiled it.

Corollary the frontmatter already gives us: **don't compile high-decay
content.** Frontier files (`expected_decay` short) churn too fast to be
worth caching; stable doctrine is the ideal resident. Compilation
eligibility is read off the layer + decay metadata, not decided per hand.

### 3. A trust/status field (`origin` + `status`)

A hand-authored bundle is human-blessed; a fly-compiled artifact is a
*machine synthesis* that could be wrong. The served set must distinguish
them, and an unverified artifact must be **quarantined until the
citation-verifier (#4) passes it** — otherwise a hallucinated artifact
becomes a fast cache hit for everyone.

```yaml
origin: editorial        # editorial (hand-authored) | compiled (machine)
status: stable           # reuse the corpus status enum:
                         #   stable  — curated or verifier-passed; servable
                         #   draft   — machine-compiled, not yet verified; quarantined
                         #   stub    — placeholder; never served
verifier_verdict:        # generated; required before a compiled artifact goes stable
  kind: pass
  checked_at: 2026-05-21T10:31:00Z
```

This reuses the corpus's existing `status` discipline rather than
inventing a parallel trust model: `stub` is never cited, `draft` is
flagged/quarantined, `stable` is served. An `editorial` bundle is
`stable` by authorship; a `compiled` artifact earns `stable` only by
passing the verifier.

---

## Lifecycle (with the cache as the future end-state)

```
            ┌─ editorial author writes a definition (curated, stable)
 warm  ─────┤
            └─ build pipeline compiles the obvious top use-case files
               at build time  → artifacts (stable after verifier)

 serve ─────── agent routes (persona, task[, intent]) → cache lookup
                 │
                 ├─ HIT (stable artifact, provenance still valid)
                 │     → serve the artifact; no query-time retrieval
                 │
                 └─ MISS  [FUTURE: read-through cache]
                       → serve query-time retrieval NOW (never block)
                       → compile artifact async (origin: compiled, status: draft)
                       → citation-verifier → pass: promote to stable
                                            → fail: discard / flag editorial

 invalidate ── freshness-checker detects a source content_hash / last_verified
               change → nil the affected artifacts → recompile on next miss
```

**Today** we do only the `warm` lane (authored definitions; the agent
retrieves each session). **Compilation** adds build-time artifact
generation. **The cache** (deferred) adds the miss→serve-now→compile-async
populate-behind loop, which is what makes "what to compile" demand-driven.

---

## Invariants the design must keep

- **Canonical-only; the firewall holds.** Bundles and their artifacts are
  built from the canonical corpus and are **shared** across tenants — one
  tenant's miss can warm the cache for all. Tenant-specific framing
  (memory, house view) never enters a bundle; it stays in the tenant's
  own skills (per [`README.md`](./README.md) "What a bundle is *not*").
  A future cache is therefore a *two-layer* model: a shared canonical
  artifact layer + a private per-tenant overlay that is never cached
  globally.
- **The query-time path is never removed.** A cold or invalidated cache
  must degrade to agentic retrieval (`findByTag`, grep, `getFile`), never
  to failure. Compilation optimises the hot paths; PRD §6.4 still governs
  the tail.
- **Additive only.** Every field here is optional and defaulted; a bundle
  with none of them behaves exactly as today. No reformat, no flag day.
- **Eval-gated, per Appendix C.** A compiled artifact ships only if it
  beats *its own query-time fallback* and the `claude-p` control on the
  bundle-vs-agentic eval cell. An artifact that scores worse than the
  retrieval path it replaced is an **auto-evict** signal — the cache
  A/B-tests itself against the thing it stands in for.

---

## What to build first (when this is picked up)

In dependency order, each gated on the one before earning its keep:

1. **The bundle-vs-agentic eval cell** — measures token / latency /
   *variance* deltas of a compiled path against agentic retrieval and
   `claude-p`. This is both the go/no-go gate and the prioritisation
   instrument (high retrieval-cost + high-variance + stable-source
   questions are the first compile targets; the trajectory data already
   identifies them, e.g. `show-worked-topco-listing`).
2. **`provenance` + content-hashing in the build pipeline** — generate
   the artifact and its source snapshots deterministically; wire the
   freshness-checker to invalidate on hash/`last_verified` drift.
3. **Build-time compilation of the seed catalogue** — compile the
   existing curated definitions into artifacts; verify; serve.
4. **The intent classifier + its own eval** — the prerequisite for any
   fly-compile cache. Must be deterministic enough that paraphrases hit
   the same key. *Until this is solid, the cache is not safe to build.*
5. **The read-through cache** — only after 1–4. The miss→serve-now→
   compile-async→verify→promote loop, with the two-layer canonical/tenant
   split.

The honest sequencing point: steps 1–3 deliver most of the value
(compiled hot paths, precise invalidation) with machinery we already
have. Steps 4–5 (the cache) are where the genuinely new, harder work is —
and they should not start until the keying problem in step 4 has an
eval that says it's deterministic.
