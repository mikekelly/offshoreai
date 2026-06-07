# @offshoreai/agent

The **production answering-agent runtime**. This is the most load-bearing
runtime package: it composes the Claude Agent SDK's `query()` loop with the
typed in-process corpus tools (`@offshoreai/tools-corpus`), the production
system prompt (`prompts/system.md`), the runtime tag taxonomy, and the
citation-verifier gate — and exposes that as both a one-shot result API and a
streaming event API for the web UI.

> ⚠️ **Running this hits the model API and costs real money.** Every path in
> this package except `compose-system-prompt.ts` / `taxonomy-block.ts` (pure)
> and the helper functions in `web-agent.ts` invokes the live Anthropic API
> through the SDK — the main agent loop *and* the citation-verifier, plus up to
> `maxVerifyRetries` regenerations. Do not casually run `query`, `auth-test`,
> or the web UI in a loop. The deterministic build/test/health commands
> (`pnpm build:corpus`, `pnpm health`, the unit tests below) do **not** need an
> API key; only the agent runners do — see [`SETUP.md`](../../SETUP.md).

```
pnpm --filter @offshoreai/agent query -- --question "What is voisinage?"
pnpm --filter @offshoreai/agent test         # vitest — pure unit tests, no API
pnpm --filter @offshoreai/agent auth-test     # one trivial live query() — costs ~nothing, confirms auth
```

The package's design lives in [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md)
§4.2 (runtime choice), §7 (tool surface), §8 (sub-agents), and the
behaviours doc [`AGENT-BEHAVIOURS.md`](../../AGENT-BEHAVIOURS.md). The agent's
*operating discipline* (cite everything, refuse when the corpus is silent,
respect `last_verified`, prefer statute over secondary) is **not** in this
package — it's the production system prompt at
[`prompts/system.md`](../../prompts/system.md), loaded at runtime.

---

## Layout

```
packages/agent/
├── README.md                  ← this file
├── package.json               ← exports ./web-agent; scripts: query, auth-test, test, typecheck
└── src/
    ├── runtime.ts                ← one-shot SDK harness — runQuery() → RunQueryResult
    ├── web-agent.ts              ← streaming factory — createOffshoreaiAgent() → AgentEvent stream
    ├── citation-verifier.ts      ← the verifier sub-agent (PRD §8) — runs after the answer, parses a JSON verdict
    ├── compose-system-prompt.ts  ← prompts/system.md + runtime taxonomy block → one byte-identical prompt
    ├── taxonomy-block.ts         ← builds the closed-tag-list block appended to the system prompt
    ├── query-cli.ts              ← engineer/CI-facing dev CLI (NOT an agent invocation surface)
    └── auth-test.ts              ← empirical "does auth work" probe — a bare query() with no tools
```

---

## The two harnesses

Both compose the **same** in-process SDK setup (corpus tools via
`createCorpusToolsServer`, the composed system prompt, `bypassPermissions`,
`maxTurns` default 20, `allowedTools` = the five `mcp__corpus__*` tools + `Read`
/ `Glob` / `Grep`). They differ in shape.

### `runtime.ts` — one-shot, batch / eval

`runQuery(opts)` runs the SDK `query()` loop to completion and returns a
`RunQueryResult`: the answer, turn count, token usage, USD cost, the tool-call
log, the SDK `session_id` (so a developer can open the full JSONL transcript at
`~/.claude/projects/<encoded-cwd>/<sessionId>.jsonl`), and **system-prompt
provenance** (`presetName`, `source`, `appendBytes`, `appendSha256`). The
`evalMode` flag prepends a one-line eval framing to the question. This is what
the eval runners and `query-cli.ts` drive.

The system prompt is sent as the SDK preset
`{ type: "preset", preset: "claude_code", append: fullSystemPrompt }` — the
`claude_code` preset plus our composed append. (Note the contrast with the
`claude-p` control harness described in [`CLAUDE.md`](../../CLAUDE.md), which
opts *out* of CLAUDE.md auto-discovery via `--bare` and supplies the same
prompt via `--system-prompt-file`; both harnesses produce a byte-identical
system prompt so eval comparisons isolate the tool-surface/verifier delta —
see `compose-system-prompt.ts`.)

### `web-agent.ts` — streaming, the web UI's engine

`createOffshoreaiAgent(opts)` builds the heavy bits **once** (tools server +
freshness-lookup `CorpusContext`), then returns an object whose
`stream(question, opts?)` yields a typed `AgentEvent` async-iterable per
question. The web server ([`packages/web`](../web/README.md)) serialises these
events as NDJSON to the browser. The UI's differentiator lives here: alongside
the answer text it emits per-citation freshness/source metadata and the
verifier's verdict.

The `AgentEvent` protocol (discriminated union):

| event | meaning |
|---|---|
| `session` | the SDK `session_id` for this turn — the handle to resume the conversation; emitted as soon as it's seen |
| `text` | a delta of user-facing answer text (streamed from partial deltas) |
| `reasoning` | a delta of extended-thinking — rendered as a separate collapsible trace, never as the answer |
| `tool` | the agent called a tool (`name` + `input`) |
| `reset` | answer text streamed before a tool call was interstitial narration; the UI should clear the answer pane and re-stream |
| `citation` | one corpus path the answer cites, badged with `exists` / `status` / `lastVerified` / `ageDays` / `freshness` (`fresh`/`warn`/`stale`/`missing`) + the file's **primary `sources`** and per-article **`pinpoints`** deep-links pulled from frontmatter |
| `verify_start` | the citation-verifier sub-agent is about to run (surfaced as a visible "second opinion" delegation) |
| `revise` | the verifier rejected the draft and the agent is regenerating; carries the rejected draft + the flagged reasons so the UI keeps it visible and the server can persist it |
| `verdict` | the final verifier verdict (pass, or surfaced-with-unresolved-flags) |
| `verify_error` | the verifier could not be evaluated (threw, or unparseable output) — "verification unavailable", **not** a content rejection; the answer stands |
| `done` | terminal — turns, USD cost, canonical final `answer`, `sessionId` |
| `error` | terminal — the stream threw |

Two seams worth knowing:

- **The `requestId` seam.** `StreamOptions.requestId` is a per-request
  correlation id minted at HTTP ingress (`packages/web/src/server.ts`) and
  threaded down so agent-side logging can carry it. It is **distinct** from the
  SDK `session_id`: `session_id` identifies a *conversation* across turns and
  is assigned mid-stream; `requestId` isolates one `/api/ask` request end to
  end. Available to the agent layer now; the full SDK audit hooks that consume
  it (AGENT-BEHAVIOURS #6) land separately.

- **The operator seam for deterministic tests.** `CreateAgentOptions.queryFn`
  and `runVerifier` default to the real SDK `query` and `runCitationVerifier`,
  but can be injected. A test scripts a fake async-iterable of SDK messages and
  a fixed verdict to drive the whole `draft → revise → verify_error →
  done/error` state machine **with no network, no model, no billing**. This is
  the thinnest interface a deterministic test needs (per the
  discovery⇄determinism / operator-seam pattern).

The streaming loop also distinguishes the SDK's canonical `result` text from
the last streamed `segment` (post-narration-reset), uses
`thinking: { type: "enabled", budgetTokens: 4000 }` so the model plans in
thinking blocks rather than narrating in the answer, and resumes its own
session across correction passes so the agent sees its prior draft + the
verifier's reasons in context.

---

## The citation-verifier (`citation-verifier.ts`)

The PRD §8 / AGENT-BEHAVIOURS #4 sub-agent, run as a **post-step** after the
main loop finishes (this is the MVP — the Stop-hook + retry-budget wiring is
designed but the verifier ships first). It loads
[`prompts/sub-agents/citation-verifier.md`](../../prompts/sub-agents/citation-verifier.md)
as its system prompt, passes the candidate answer + the tool-call log, and
parses a structured JSON verdict (`pass` / `reject`, claim counts, per-claim
`reasons` with an `issueKind` enum: `hallucinated_citation`,
`unsupported_by_cited_file`, `no_citation_attached`, `wrong_authority_tier`,
`cite_pattern_violation`, `stale_corpus_cited`).

The parser is defensive: it extracts the first balanced JSON object if the
fenced block fails, and on total parse failure returns a **synthetic soft
reject** (`claim: "(verifier parse failure)"`). The web-agent treats that — and
any thrown verifier — as `verify_error` (verification unavailable), **never** as
a content rejection that would trigger a destructive regeneration. The verifier
runs on its own model: `opts.model ?? OFFSHOREAI_VERIFIER_MODEL ??
"claude-opus-4-6"` (env-pinnable so ops can rotate the alias without a code
change — the gate is precision-critical).

---

## System-prompt composition (`compose-system-prompt.ts` + `taxonomy-block.ts`)

`composeSystemPrompt()` reads `prompts/system.md` verbatim and appends the
runtime **tag taxonomy block**, returning the text plus `bytes` + `sha256` for
trajectory provenance. What's deliberately **not** appended: corpus content. The
corpus is reachable via the agent's read tools, and per
[PRD §6.4 Principle 5](../../PRD-baseline-agent-v1.md) query-time retrieval is
the agent's job — pre-loading orientation files would privilege some corpus
content over others without a principled reason.

The taxonomy block **is** appended because it is not corpus content but a
runtime-derived index — the closed tag list (from the compiled
`tag-index.json`) with frequency counts, analogous to a search index. It exists
because the agent otherwise guesses tag names (`set-aside` instead of
`setting-aside`, `parish-hall-enquiry` instead of `parish-hall`), wasting tool
calls; ~6K tokens paid once per session as a cache write buys first-call
`findByTag` accuracy. If the tag-index is absent the block is empty and the
agent operates without it.

---

## `query-cli.ts` — engineer/CI surface, not an agent surface

This is a **dev CLI for engineers and CI**, not a tool the agent invokes. Per
[AGENT-PRINCIPLES](../../AGENT-PRINCIPLES.md) Principle 21 and the architectural
restraint principle ([PRD Appendix C](../../PRD-baseline-agent-v1.md#appendix-c--the-architectural-restraint-principle-the-indirection-question)),
we do **not** build custom CLIs over our own functions for the agent to invoke
through Bash — the agent uses the typed in-process MCP tools directly. This CLI
exists only so a human or CI job can fire one question, print the answer +
usage, and optionally persist `<id>.answer.md` + `<id>.trajectory.json` to an
`--output-dir`. It does **not** grade or verify — that's the
`.claude/agents/eval-manager.md` subagent's job, invoked via the `/run-evals`
command.

---

## Relationship to the rest of the workspace

- **`@offshoreai/tools-corpus`** — the agent's read surface. The runtime loads
  the corpus tools via the SDK (in-process `createSdkMcpServer`), per
  [`CLAUDE.md`](../../CLAUDE.md): "The production agent loads its tools via the
  SDK in `runtime.ts`, not via `.mcp.json`." See
  [`packages/tools-corpus/README.md`](../tools-corpus/README.md).
- **`@offshoreai/build`** — `web-agent.ts` imports the corpus loader accessors
  (`getLastVerified`, `getStatus`, `getTitle`, `getArticlesCovered`,
  `CorpusRecord`) to build citation freshness/source events deterministically.
- **`@offshoreai/web`** — the only consumer of the streaming `web-agent` export;
  it serialises `AgentEvent`s to NDJSON. Security model and env in
  [`packages/web/README.md`](../web/README.md).
- **`prompts/system.md`** and **`prompts/sub-agents/citation-verifier.md`** —
  the production behaviour. Edit agent *behaviour* there, not here.

## Tests

`test/web-agent.test.ts` covers the **pure** core of the citation pipeline —
`freshnessFor`, `ageDaysFrom`, `sourcesOf`, `pinpointsOf`, `buildCitationEvent`,
and the `CORPUS_PATH_RE` matcher — on in-memory `CorpusRecord` fixtures only, no
SDK / network / model. These are the UI's hallucination-surfacing differentiator
(a cited path that doesn't resolve → `exists:false`, `freshness:"missing"`). A
full state-machine test that drives `stream()` end to end via the injected
`queryFn` / `runVerifier` seams (no API) is the natural next test and may be in
flight. Run `pnpm --filter @offshoreai/agent test`.

## See also

- [`SETUP.md`](../../SETUP.md) — prerequisites, env vars (`ANTHROPIC_API_KEY`),
  first-run commands.
- [`CLAUDE.md`](../../CLAUDE.md) — contributor cold-start; production-agent vs
  dev-guidance separation; the restraint principle.
- [`AGENT-PRINCIPLES.md`](../../AGENT-PRINCIPLES.md) /
  [`AGENT-BEHAVIOURS.md`](../../AGENT-BEHAVIOURS.md) — the design layer above
  this package.
- [`PRD-baseline-agent-v1.md`](../../PRD-baseline-agent-v1.md) §4.2, §7, §8,
  §14, Appendix C.
