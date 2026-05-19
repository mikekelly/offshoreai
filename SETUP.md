# SETUP.md

First-run developer setup for the offshoreai agent runtime. This document is
forward-looking — the agent runtime hasn't been built yet (week 1 of
[`PRD-baseline-agent-v1.md`](PRD-baseline-agent-v1.md) §14 starts the
implementation). What it describes is the layout that week 1–3 work will
create, and the prerequisites a developer needs in place to begin.

For corpus-only work (editorial, content writing) you do **not** need any
of the runtime prerequisites below. The corpus is plain markdown; clone the
repo, edit a file, follow [`CONVENTIONS.md`](CONVENTIONS.md), open a PR.

---

## Cold-start reading first

Before touching code or content, read [`AGENTS.md`](AGENTS.md) in full. It is
the cold-start reading order and it transcludes into Claude Code sessions
via [`CLAUDE.md`](CLAUDE.md). Allow ~90 minutes for a thorough first pass.

---

## Prerequisites for the agent runtime

| Tool | Version | Why |
|---|---|---|
| Node.js | 22 LTS | PRD §12 — primary runtime |
| pnpm | ≥ 9 | PRD §12 — workspace package manager |
| Postgres | ≥ 16 | PRD §12 — relational + pgvector |
| pgvector | ≥ 0.7 | PRD §5.3, §6.1 — semantic memory + summary embeddings |
| git | any recent | obvious |

macOS quickstart:

```bash
# Node 22 via nvm or asdf
nvm install 22 && nvm use 22

# pnpm
corepack enable && corepack prepare pnpm@latest --activate

# Postgres + pgvector (Homebrew)
brew install postgresql@16 pgvector
brew services start postgresql@16
createdb offshoreai_dev
psql offshoreai_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

Linux: use the official Postgres apt/dnf repo + the `pgvector` package from
the same repo, then `CREATE EXTENSION vector` as above.

Docker-compose is acceptable if you prefer; a `docker-compose.dev.yml` will
land alongside the first runtime package in week 1.

---

## Environment variables

The agent runtime needs the following at runtime; the build pipeline needs
the first two. Create `.env.local` in the repo root (gitignored).

| Var | Required for | Source |
|---|---|---|
| `ANTHROPIC_API_KEY` | build pipeline (hier-tree summaries), agent runtime | console.anthropic.com |
| `VOYAGE_API_KEY` | build pipeline (summary embeddings) | voyageai.com |
| `DATABASE_URL` | agent runtime, build pipeline (vector index write) | local Postgres, e.g. `postgres://localhost/offshoreai_dev` |
| `OFFSHOREAI_TENANT_ID` | dev tenant scoping for `memory.*` | freeform string — `dev` is fine |

Do not commit `.env.local`. The repo's `.gitignore` covers it.

---

## Repo layout (what week 1 will create)

Today the repo is corpus + design docs. Week 1 of PRD §14 adds the agent
runtime in-tree as a pnpm workspace. The planned layout:

```
offshoreai/
├── README.md, AGENTS.md, CLAUDE.md, CONVENTIONS.md, TAGS.md, …  ← unchanged
├── knowledge/jersey/                                                       ← corpus, unchanged
├── schemas/                                                      ← Zod tool schemas (spec)
├── bundles/                                                      ← compiled retrieval contracts
├── prompts/sub-agents/                                           ← sub-agent system prompts
├── skills/templates/                                             ← reference SKILL.md files
├── IMPLEMENTATION-PLAN.md                                        ← week-by-week task backlog
├── SETUP.md                                                      ← this file
├── package.json, pnpm-workspace.yaml, tsconfig.base.json        ← week-1 deliverables
└── packages/                                                    ← week-1+ deliverables
    ├── build/              # @offshoreai/build — corpus compile pipeline
    ├── schemas/            # @offshoreai/schemas — promoted from /schemas
    ├── tools-corpus/       # @offshoreai/tools-corpus
    ├── tools-memory/       # @offshoreai/tools-memory
    ├── tools-primary-source/
    ├── tools-register/
    └── agent/              # @offshoreai/agent — SDK runtime
```

The `schemas/` directory at the root exists *now* as a spec — TypeScript
files using Zod to declare the tool input/output shapes and the §7.0.3
five-part descriptions. Those files are not buildable yet (no
`package.json` next to them). Week 3 of PRD §14 lifts them into
`packages/schemas/` as the published `@offshoreai/schemas` package and
adds the actual handlers in `packages/tools-corpus/` etc.

This staging — spec-first in `schemas/`, package-second in `packages/` —
matches the AGENTS.md "what's deliberately not in this document" pattern:
the gaps get filled as design artefacts first, then promoted to
implementation when the relevant PRD §14 week arrives.

---

## First-run commands (post-week-1)

Once week 1's deliverables land, the daily-driver commands will be:

```bash
pnpm install                      # restore workspace deps
pnpm build:corpus                 # convention validate + hier-tree + tag-index + bundle compile
pnpm test                         # vitest across all packages
pnpm dev                          # start the agent runtime against a local tenant
```

Each command's owning package and exit codes are documented in
[`IMPLEMENTATION-PLAN.md`](IMPLEMENTATION-PLAN.md) under the relevant week.

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
