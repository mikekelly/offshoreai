# SETUP.md

First-run developer setup for the offshoreai corpus, build pipeline, and
current TypeScript agent runtime. The implementation is an MVP, not the full
PRD target: the workspace currently has build/validation (including the
`enrich-pinpoints` deep-link enrichment), schemas, v1 corpus tools, an agent
query runner, eval harnesses, and a streaming web UI (see
[`packages/web/README.md`](./packages/web/README.md)); memory, primary-source
fetching, bundles, and tenant deployment are still future phases.

For corpus-only work (editorial, content writing) you do **not** need any
of the runtime prerequisites below. The corpus is plain markdown; clone the
repo, edit a file, follow [`CONVENTIONS.md`](CONVENTIONS.md), open a PR.

---

## Cold-start reading first

Before touching code or content, read [`CLAUDE.md`](CLAUDE.md) in full. It
holds both the answering-agent operating discipline and the contributor
cold-start guide (folded in from the former `AGENTS.md`). Allow ~90 minutes
for a thorough first pass.

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
├── README.md, CLAUDE.md, CONVENTIONS.md, KNOWLEDGE-BASE-PRINCIPLES.md, TAGS.md, …
├── knowledge/jersey/                                  ← corpus
├── bundles/                                           ← compiled retrieval contracts
├── prompts/
│   ├── system.md                                      ← production agent's system prompt
│   └── sub-agents/                                    ← production sub-agent prompts
├── evals/                                             ← eval question YAML + baseline artifacts
├── .claude/
│   ├── agents/eval-manager.md                         ← per-question eval-manager subagent
│   └── commands/run-evals.md                          ← /run-evals slash command
├── IMPLEMENTATION-PLAN.md                             ← historical week-by-week task backlog
├── SETUP.md                                           ← this file
├── package.json, pnpm-workspace.yaml, tsconfig.base.json
└── packages/
    ├── build/              # @offshoreai/build — corpus compile pipeline
    ├── schemas/            # @offshoreai/schemas — tool/eval schemas
    ├── tools-corpus/       # @offshoreai/tools-corpus — MCP corpus server
    └── agent/              # @offshoreai/agent — SDK runtime, query CLI, web agent
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

## Optional: iwe — corpus refactor and graph tooling

[iwe](https://iwe.md) is an external Rust CLI + LSP + MCP layer over
markdown corpora. We use it as a **developer-side editing tool** —
never on the agent's runtime tool surface (see
[`PRD-corpus-stewardship-v1.md`](./PRD-corpus-stewardship-v1.md) §3.4).
It is optional; you don't need it to edit content or run the
build/test pipeline. Install it when you need any of:

- **Link-safe file rename across the corpus** —
  `iwe rename <old-key> <new-key>`. Updates every cross-reference
  atomically. Today, without iwe, this is a grep-and-pray operation
  over thousands of links.
- **Section extract / inline refactor** — `iwe extract <doc-key>
  --section "Title"` pulls a heading-bounded section out into its own
  one-concept file (the corpus's [`CONVENTIONS.md`](./CONVENTIONS.md)
  rule). `iwe inline <doc-key> --reference <ref>` reverses it.
- **Graph statistics** — `iwe stats` reports orphans (files with no
  structural parent), roots, and graph density. Feeds the
  [`COVERAGE-AUDIT.md`](./knowledge/jersey/COVERAGE-AUDIT.md)
  discipline.
- **Tree visualisation** — `iwe tree -d 2 -k jersey-trusts-index`
  walks the inclusion-link graph from a root. Same shape as our
  in-process `corpus.tree` MCP handler but as a developer-terminal
  command.
- **DOT graph export** — `iwe export dot | dot -Tpng -o graph.png` to
  see the corpus structure visually.
- **LSP editor integration** — VS Code, Neovim, Zed, Helix all
  support iwe's language server: autocomplete on links, find-references,
  rename refactoring, hover preview.

### Install

```bash
cargo install iwe
# or: download a release binary from https://github.com/iwe-org/iwe/releases
```

The repo ships [`.iwe/config.toml`](./.iwe/config.toml), so iwe will
discover the corpus at `knowledge/**/*.md` automatically when run from
the repo root. Verify with:

```bash
iwe stats
iwe tree -d 1   # walk the top-level inclusion-link tree
```

### What we deliberately don't enable

The [`.iwe/config.toml`](./.iwe/config.toml) does **not** configure
iwe's LLM-action templates (`expand`, `rewrite`, `keywords`, etc.).
iwe can pipe text through Claude for AI-driven edits, but our
editorial discipline runs through PRs with manual review — see
[`CONVENTIONS.md`](./CONVENTIONS.md). If you want LLM actions for your
personal workflow, extend `.iwe/config.toml` locally and don't commit
it. The inclusion-link convention from `CONVENTIONS.md` is also the
*data* layer iwe operates on; understanding that section first will
save you confusion when iwe refuses to call a file a child of another.

### iwe vs `corpus.*` MCP tools

The agent talks to the corpus through the in-process
`@offshoreai/tools-corpus` MCP (`getFile`, `getArticle`, `findByTag`,
`freshnessCheck`, `tree`). iwe and this MCP overlap on retrieval but
have complementary strengths:

| Capability | `corpus.*` MCP | iwe CLI |
|---|---|---|
| Read file with `last_verified` / `status` envelope | ✓ | ✗ |
| Dispatch (statute, article) → canonical file | ✓ | ✗ |
| Closed-TAGS taxonomy index | ✓ | ✗ |
| Inclusion-link traversal | ✓ | ✓ |
| Link-safe rename, section extract/inline | ✗ | ✓ |
| Graph statistics, DOT export | ✗ | ✓ |
| LSP editor integration | ✗ | ✓ |

Use the MCP from inside an agent session; use iwe from your terminal.

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
