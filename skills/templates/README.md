# skills/templates/

Reference `SKILL.md` files per persona-skill category. These templates
unblock the trust-officer skill batch in week 7 of
[`../../IMPLEMENTATION-PLAN.md`](../../IMPLEMENTATION-PLAN.md): a
concrete shape that other persona-task skills can be derived from
without re-deriving the structure each time.

Per PRD §5.2: each persona/task pair becomes a Claude Skill. The
skill's `description` field is what Claude uses to decide whether to
invoke; we get persona routing for free, model-side, instead of
building a router.

Per PRD §5.7 and AGENT-BEHAVIOURS #7 (progressive disclosure): only
the **baseline** skill body is always-resident. Task-skill bodies
load on demand when the matching bundle is loaded and offload to
`/sandbox/<tenant>/scratch/<session>/plan.md` when the conversation
pivots.

---

## Layout

```
skills/templates/
├── README.md
├── baseline.SKILL.md   ← always-resident (~8k tokens)
└── task.SKILL.md       ← per persona-task; loaded on demand
```

When week 6-7 implementation lands, the runtime expects skills to live
at `.claude/skills/<skill-slug>/SKILL.md`. The templates here are
authoring scaffolds — copy, fill in the persona/task specifics, and
publish at `.claude/skills/jersey-baseline/SKILL.md` and
`.claude/skills/jersey-<persona>-<task>/SKILL.md`.

---

## What every SKILL.md must contain

The Claude Agent SDK reads two things from `SKILL.md`:

1. **The frontmatter `name` and `description`** — always-visible to the model. `description` is the routing signal: a sharp description means the right skill loads; a vague one means the wrong skill loads or none does.
2. **The body** — loaded on demand when the description matches. Holds the persona/task operator instructions, the bundle reference, the citation pattern, the refusal heuristics.

The 5-part-description discipline from PRD §7.0.3 applies to skill
descriptions too: core purpose, when to use, when NOT to use,
relationships to other skills, what the agent gets if it loads the
body. Description discipline is enforced by the same week-3 vitest
matcher that enforces tool-description discipline.

---

## Skill naming convention

```
jersey-baseline                          ← always-resident persona-overview
jersey-<persona>                          ← per-persona overview (loaded when persona declared)
jersey-<persona>-<task-slug>              ← per-persona-task skill (loaded when task bundle warms)
```

Slugs are lower-kebab-case, no underscores. The task slug matches the
matching bundle's `task:` field and the use-case file's basename.

---

## Tenant overrides

Tenants can override a baseline skill by publishing their own skill at
`tenants/<tenant>/.claude/skills/<same-slug>/SKILL.md`. Name collision
rule (PRD §9.2): tenant wins. The tenant skill should link back to the
baseline so the agent has both. Tenants cannot disable the baseline
citation/refusal heuristics — those are non-configurable per PRD §9.3.
