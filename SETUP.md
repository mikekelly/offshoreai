# SETUP.md

First-run developer setup for the offshoreai corpus, build pipeline, and
current TypeScript agent runtime. The implementation is an MVP, not the full
PRD target: the workspace currently has build/validation, schemas, v1 corpus
tools, an agent query runner, and eval harnesses; memory, primary-source
fetching, bundles, and tenant deployment are still future phases.

For corpus-only work (editorial, content writing) you do **not** need any
of the runtime prerequisites below. The corpus is plain markdown; clone the
repo, edit a file, follow [`CONVENTIONS.md`](CONVENTIONS.md), open a PR.

---

## Cold-start reading first

Before touching code or content, read [`AGENTS.md`](AGENTS.md) in full. It is
the cold-start reading order and it transcludes into Claude Code sessions
via [`CLAUDE.md`](CLAUDE.md). Allow ~90 minutes for a thorough first pass.

---

## Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | 22 LTS | PRD §12 — primary runtime |
| pnpm | ≥ 9 | PRD §12 — workspace package manager |
| Postgres | ≥ 16 | Future memory/runtime phases; not required for current corpus tools |
| pgvector | ≥ 0.7 | Future semantic memory + summary embeddings |
| git | any recent | obvious |

macOS quickstart:

```bash
# Node 22 via nvm or asdf
nvm install 22 && nvm use 22

# pnpm
corepack enable && corepack prepare pnpm@latest --activate

# Optional for future memory/vector phases: Postgres + pgvector (Homebrew)
brew install postgresql@16 pgvector
brew services start postgresql@16
createdb offshoreai_dev
psql offshoreai_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

Linux: use the official Postgres apt/dnf repo + the `pgvector` package from
the same repo, then `CREATE EXTENSION vector` as above.

Docker-compose is acceptable for the future database-backed phases, but there
is no committed dev compose file yet.

---

## Environment variables

The current deterministic build/test/health commands do not require API keys.
The agent query and eval runners need an Anthropic key. Future memory/vector
phases will need the database and embedding keys. Create `.env.local` in the
repo root when you need runtime credentials (gitignored).

| Var | Required for | Source |
|---|---|---|
| `ANTHROPIC_API_KEY` | agent query/eval runners; future summary generation | console.anthropic.com |
| `VOYAGE_API_KEY` | future summary embeddings | voyageai.com |
| `DATABASE_URL` | future memory/vector index write | local Postgres, e.g. `postgres://localhost/offshoreai_dev` |
| `OFFSHOREAI_TENANT_ID` | future tenant scoping for `memory.*` | freeform string — `dev` is fine |

Do not commit `.env.local`. The repo's `.gitignore` covers it.

---

## Repo layout

The repo is a pnpm workspace with the corpus at the root and runtime packages
under `packages/`:

```
offshoreai/
├── README.md, AGENTS.md, CLAUDE.md, CONVENTIONS.md, TAGS.md, …  ← unchanged
├── knowledge/jersey/                                                       ← corpus, unchanged
├── bundles/                                                      ← compiled retrieval contracts
├── prompts/sub-agents/                                           ← sub-agent system prompts
├── skills/templates/                                             ← reference SKILL.md files
├── IMPLEMENTATION-PLAN.md                                        ← week-by-week task backlog
├── SETUP.md                                                      ← this file
├── package.json, pnpm-workspace.yaml, tsconfig.base.json
└── packages/
    ├── build/              # @offshoreai/build — corpus compile pipeline
    ├── schemas/            # @offshoreai/schemas — tool/eval schemas
    ├── tools-corpus/       # @offshoreai/tools-corpus
    └── agent/              # @offshoreai/agent — SDK runtime
```

---

## First-run commands

Daily-driver commands:

```bash
pnpm install                      # restore workspace deps
pnpm build:corpus all             # validate + hier-tree + tag-index
pnpm health                       # deterministic housekeeping report
pnpm test                         # vitest across all packages
pnpm typecheck                    # TypeScript typecheck across packages
pnpm --filter @offshoreai/agent query -- --question "What is voisinage?"
```

`pnpm build:corpus all` currently reports the known conformance backlog rather
than treating it as a hard blocker. `pnpm health` compares that backlog against
the committed baseline and fails only on deterministic regressions.

---

## What this document is *not*

- **A runbook for production deployment** — covered by a future
  `DEPLOYMENT.md` once the first tenant ships (PRD §14 week 12).
- **A tenant-onboarding guide** — covered by a future
  `TENANT-ONBOARDING.md`. PRD §9 is the design; the runbook follows the
  provisioning script.
- **A contributor guide for corpus editorial work** — corpus contributors
  follow [`CONVENTIONS.md`](CONVENTIONS.md) and the relevant jurisdiction
  `changelog.md`. No runtime install needed.
