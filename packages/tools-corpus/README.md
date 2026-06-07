# @offshoreai/tools-corpus

The **corpus retrieval tools** — the agent's read surface over the knowledge
base. v1 ships **five** of the PRD §7.1 `corpus.*` tools as typed, in-process
Claude Agent SDK custom tools: `getFile`, `getArticle`, `findByTag`,
`freshnessCheck`, and `tree`. The agent calls them as
`mcp__corpus__getFile` etc.; each call is a direct in-process function
invocation, not a network or cross-process hop.

Design: [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) §7.0 (tool
principles), §7.0.2 (output discipline — TOON), §7.1 (the `corpus.*` tools), and
Appendix C (the restraint principle). The Zod input/output schemas and the
five-part tool descriptions live in
[`@offshoreai/schemas`](../schemas/README.md) — see that package for the
contract; this package is the implementation.

```
pnpm --filter @offshoreai/tools-corpus test          # vitest — handlers, toon, inclusion-links
pnpm --filter @offshoreai/tools-corpus mcp           # run the stdio MCP adapter (third-party hosts)
```

---

## Layout

```
packages/tools-corpus/
├── README.md             ← this file
├── package.json          ← exports . / ./register / ./toon; bin: offshoreai-corpus-mcp
└── src/
    ├── index.ts             ← public surface barrel
    ├── context.ts           ← buildCorpusContext — the shared, partially-applied read context
    ├── register.ts          ← in-process registration (createSdkMcpServer) — the production path
    ├── mcp-stdio.ts         ← cross-process stdio MCP adapter — for third-party SDK hosts
    ├── toon.ts              ← the minimal TOON renderer (output discipline)
    ├── error-envelope.ts    ← the stable error envelope shared by all handlers
    ├── inclusion-links.ts   ← bare-line inclusion-link parser + target resolver
    ├── levenshtein.ts       ← edit distance, for "did you mean" tag/path suggestions
    └── handlers/
        ├── getFile.ts          ├── getArticle.ts      ├── findByTag.ts
        ├── freshnessCheck.ts   └── tree.ts
```

---

## `context.ts` — the shared read context

`buildCorpusContext(opts)` is the deep core. It loads the corpus once (via
`@offshoreai/build`'s `loadCorpus`) and precomputes the indexes every handler
needs, so a handler never rescans on a call:

- **`byPath`** — `Map<repo-relative-path, CorpusRecord>`, the primary lookup.
- **`articleIndex`** — `Map<"${statute}|${article}", CorpusRecord>` for
  `getArticle` dispatch. Statute slugs are identified heuristically from a
  file's tags (any tag matching `-law-NNNN` / `-regs-NNNN` / `-order-NNNN`) and
  paired with every entry in `articles_covered`.
- **`tagIndex`** — the compiled `tag-index.json` (from `@offshoreai/build`),
  loaded lazily if a `tagIndexPath` is given; `null` if the artefact isn't
  built yet, in which case handlers fall back to scanning records.
- **The inclusion-link graph** — `inclusionChildren` and its inverse
  `inclusionParents`, built in one pass by parsing each record's body for
  bare-line inclusion links (per [`CONVENTIONS.md`](../../CONVENTIONS.md) — the
  third navigation axis), resolving each target against the source path, and
  keeping only links whose target is a known corpus file. This underwrites
  `getFile`'s `depth` / `parentContext` params and the `tree` handler.

The context is built once and partially applied into each handler at
registration time (`makeGetFileTool(ctx)` etc.), so handler bodies are pure
`(ctx, args) => result` seams — directly unit-testable without standing up the
SDK (see `test/handlers.test.ts`, which imports the `makeXTool` factories from
the package barrel).

---

## Output discipline — TOON, never JSON (`toon.ts`)

Per [PRD §7.0.2](../../PRD-baseline-agent-v1.md), every tool result's
`content[0].text` is **TOON**, not JSON: list-shaped data uses a tabular
`name[count]{field,field}:` header with indented rows; scalars are `key: value`;
and a `help[]` block can suggest next-step tool calls. The renderer
(`toon.ts`) is deliberately narrow — it renders exactly the line kinds the v1
handlers emit (`scalar`, `table`, `help`, `raw`), not a general object→TOON
converter, and cell-escapes the comma / pipe / newline separators rather than
trying to quote. Handlers compose the `scalar()` / `table()` / `help()` /
`raw()` helpers instead of building lines by hand.

Errors use a single stable envelope (`error-envelope.ts`): `errorResult()`
returns a TOON `error_kind` + `message` (+ optional context + help lines) with
`isError: true` on the `CallToolResult`, and the agent dispatches on the
`ErrorKind` enum (`missing_file`, `stub_file`, `stale_corpus`, `invalid_tag`,
`invalid_article`, …). `successResult()` wraps plain TOON text.

---

## The handlers (the agent's verbs)

| tool | what it does |
|---|---|
| `getFile` | reads one corpus file's body + a minimal frontmatter projection (opt-in extra `fields`); refuses on missing, warns on stub. Optional `depth` (follow inclusion-link children, ≤3) and `parentContext` (include structural parents, ≤2) walk the graph. Returns whole bodies — the one-concept-per-file discipline keeps them short. |
| `getArticle` | dispatches `(statute, article)` → the canonical file via `articleIndex`. |
| `findByTag` | resolves a tag against the closed taxonomy + the inverted index; suggests near-matches (Levenshtein) on a miss. |
| `freshnessCheck` | reports a file's `status` + `last_verified` age against the freshness thresholds. |
| `tree` | walks the inclusion-link graph from a root, the in-process analogue of `iwe tree`. |

---

## Two registration paths, one set of tool defs

This is the architectural-restraint point worth understanding (PRD Appendix C /
[AGENT-PRINCIPLES](../../AGENT-PRINCIPLES.md) #9):

### `register.ts` — in-process (the production path)

`createCorpusToolsServer(opts)` builds the context and registers the five tools
via the SDK's `createSdkMcpServer`. Despite the "MCP" in the name, **this is not
a separate process and there is no JSON-RPC** — the `McpServer` lives in the
same Node event loop and each tool call is a direct function invocation. The
"MCP" is a protocol-shape label the SDK exposes for in-process custom tools, not
a deployment topology. This is the path
[`@offshoreai/agent`](../agent/README.md) uses, per
[`CLAUDE.md`](../../CLAUDE.md): the production agent loads its tools via the SDK,
not via `.mcp.json`. `corpusAllowedToolNames()` is the convenience that returns
the `mcp__corpus__*` names for the runtime's `allowedTools`.

What Appendix C / Principle 9 forbid — "MCP wrapping of our own functions" — is
the *cross-process* kind, spawning a separate server the agent talks to over
JSON-RPC just to reach code we own. `register.ts` is explicitly **not** that.

### `mcp-stdio.ts` — cross-process (the legitimate exception)

There is one legitimate cross-process boundary: a third-party SDK host that
loads tools only from a project-scoped `.mcp.json` and has no hook for passing
in-process SDK tools (a generic SDK web UI, Claude Code, Cowork). `mcp-stdio.ts`
is the delivery adapter for that case — a standalone stdio MCP server over a
boundary we don't control. Crucially it **reuses the SAME `makeXTool`
definitions** as `register.ts` over a stdio transport: **zero logic
duplication**, and the in-process path is untouched. (`stdout` carries the
JSON-RPC stream; diagnostics go to `stderr`. `OFFSHOREAI_REPO_ROOT` overrides
the corpus root for non-standard launches.) This is the restraint principle in
practice: an MCP server only at a real cross-process / cross-org boundary, not
over our own runtime.

---

## Tests

`test/handlers.test.ts` (the `(ctx, args) => result` seams on fixtures),
`test/toon.test.ts` (the renderer), and `test/inclusion-links.test.ts` (the
parser/resolver). All pure — no SDK, no network. Run
`pnpm --filter @offshoreai/tools-corpus test`.

## See also

- [`@offshoreai/schemas`](../schemas/README.md) — the Zod input/output schemas
  and the five-part tool descriptions (the contract).
- [`@offshoreai/build`](../build/README.md) — supplies `loadCorpus`, the
  `CorpusRecord` accessors, and the compiled `tag-index.json` this package reads.
- [`@offshoreai/agent`](../agent/README.md) — the production consumer of
  `register.ts`.
- [`CONVENTIONS.md`](../../CONVENTIONS.md) — the inclusion-link convention the
  graph is built on.
- [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) §7, Appendix C;
  [`SETUP.md`](../../SETUP.md) — the `corpus.*` MCP vs `iwe` comparison.
