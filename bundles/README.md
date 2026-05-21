# bundles/

Pre-compiled retrieval contracts per `(persona, task)` pair. Each bundle
is a YAML file naming the corpus files, statute Articles, tags, and
freshness windows that the agent needs in context to answer questions
of that operator shape.

The bundle is loaded by the `bundle-assembler` sub-agent at SessionStart
via the `corpus.getBundle` tool (PRD §6.2, §7.1, §8 — AGENT-BEHAVIOURS #1).
The agent enters the conversation already holding the right corpus
context — no first-turn rediscovery, no re-summarising files it
summarised yesterday.

This README is *how to author a bundle today*. For *where the mechanism
is going* — compiled artifacts, provenance-based invalidation, and a
future read-through cache — see [`DESIGN.md`](./DESIGN.md). Every field
that design adds is additive; bundles authored against this README stay
valid.

---

## Layout

```
bundles/
├── README.md
├── orientation/           ← the four cold-start orientation bundles
└── <persona>/<task>.yaml  ← per persona-task bundles
    e.g. trust-officer/article-47-set-aside-for-mistake.yaml
```

The persona slug matches the `persona:` field in the corresponding
use-case file's frontmatter (per [`CONVENTIONS.md`](../CONVENTIONS.md)).
The task slug matches the use-case file's basename.

---

## Authoring a bundle

Use `trust-officer/article-47-set-aside-for-mistake.yaml` as the
reference. The shape is documented at the top of that file. A bundle
must:

- Name only files that actually exist in the corpus (the build pipeline
  asserts this — broken paths block PR merge).
- Reference only statute Articles whose canonical home is identifiable
  (via `articles_covered` frontmatter, where populated; otherwise via
  the article-index file for the statute).
- Carry only tags from [`TAGS.md`](../TAGS.md) (closed taxonomy; the
  build pipeline asserts this).
- Set `freshness_max_age_days` to the task's tolerance. 365 is a
  reasonable default; sanctions / pillar-two / economic-substance tasks
  should be tighter (90 or 180); pure-doctrinal tasks may extend to 730.
- Declare its refusal rules — at minimum, refuse on any required file
  whose status is `stub`; usually warn on `draft`.

The schema lives in [`../schemas/corpus.ts`](../schemas/corpus.ts) as
`getBundleResult` — the bundle YAML compiles into a `GetBundleResultType`
value at load time.

---

## What a bundle is *not*

- Not a system prompt. The bundle is data; the persona's behavioural
  instructions live in the matching `.claude/skills/<persona>-<task>/SKILL.md`.
- Not a search index. The bundle is the pre-resolved working set for a
  known task; `findByTag`, `semanticSearch`, etc. cover ad-hoc
  retrieval the bundle doesn't anticipate (PRD §6.4).
- Not stateful. Bundles are recompiled by the build pipeline from the
  same corpus state on every build; there is no per-tenant variation
  (tenant overlays live in the tenant's own skills, not in bundles).

---

## v1 bundle catalogue (per PRD §13 in-scope)

By week 7 of the build plan, the bundle catalogue contains:

- 4 orientation bundles (Crown-Dependency, zero-ten, trusts overview, JFSC overview)
- 5 seed trust-officer bundles (CDD-new-trust, distribution-decisions-and-court-blessing, sanctions-screening, article-47-set-aside-for-mistake, sar-threshold)
- 7 persona-overview bundles (one per persona named in PRD §3)

= 16 bundles at week-7. The remaining trust-officer bundles (and any
new persona-task pairs) are compiled in priority order from
shadow-pilot logs in weeks 9-11, targeting ≥ 90% coverage of observed
queries by week 11.

This file count is deliberate: the catalogue is a living artefact that
grows from logs. "Complete" is not a milestone.
