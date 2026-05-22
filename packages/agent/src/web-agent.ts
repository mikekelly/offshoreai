// Streaming agent factory for the offshoreai web UI.
//
// Wraps the same in-process SDK setup as runtime.ts (corpus tools via
// register.ts, the baseline system prompt, the citation-verifier) but
// exposes a streaming interface: build the heavy bits (tools server +
// freshness-lookup corpus context) ONCE, then stream typed events per
// question. The web server (packages/web) consumes these events as NDJSON.
//
// The UI's differentiator lives here: alongside the answer text we emit
// `citation` events — every corpus path the answer cites, looked up against
// the corpus for status + last_verified (and flagged MISSING when the path
// doesn't exist, which surfaces hallucinated citations) — and the
// `verdict` event from the citation-verifier.

import { query } from "@anthropic-ai/claude-agent-sdk";
import { getArticlesCovered, getLastVerified, getStatus, getTitle } from "@offshoreai/build";
import type { CorpusRecord } from "@offshoreai/build";
import {
  buildCorpusContext,
  corpusAllowedToolNames,
  createCorpusToolsServer,
  type CorpusContext,
} from "@offshoreai/tools-corpus";
import { baselineSystemPrompt } from "./baseline-system-prompt.js";
import { runCitationVerifier, type VerifierVerdict } from "./citation-verifier.js";
import { buildTaxonomyBlock } from "./taxonomy-block.js";

export type AgentEvent =
  | { readonly type: "tool"; readonly name: string; readonly input: unknown }
  | { readonly type: "text"; readonly delta: string }
  // Extended-thinking deltas — the agent's planning/retrieval reasoning,
  // rendered as a separate (collapsible) trace, never as the answer.
  | { readonly type: "reasoning"; readonly delta: string }
  // The answer text streamed so far was interstitial narration emitted
  // before a tool call; the UI should clear the answer pane and re-stream.
  | { readonly type: "reset" }
  // The citation-verifier subagent is about to run (surfaced to the user
  // as a visible "second opinion on citation quality" delegation).
  | { readonly type: "verify_start" }
  // The SDK session id for this turn — the handle the caller resumes to
  // continue the conversation. Emitted as soon as it's known.
  | { readonly type: "session"; readonly sessionId: string }
  // The verifier rejected the draft answer and the agent is regenerating a
  // corrected one. The UI clears the answer/sources and shows why.
  | {
      readonly type: "revise";
      readonly attempt: number;
      readonly rejectCount: number;
      readonly reasons: ReadonlyArray<{ claim: string; issueKind: string; citedSource: string; detail: string }>;
    }
  // The verifier could not be evaluated (it threw, or returned unparseable
  // output). This is "verification unavailable", NOT a content rejection —
  // the answer stands; the UI shows a soft caution and does not regenerate.
  | { readonly type: "verify_error"; readonly message: string }
  | {
      readonly type: "citation";
      readonly path: string;
      readonly exists: boolean;
      readonly title: string | null;
      readonly status: string | null;
      readonly lastVerified: string | null;
      readonly ageDays: number | null;
      readonly freshness: "fresh" | "warn" | "stale" | "missing";
      // The underlying PRIMARY sources for this corpus file (statute /
      // regulator guidance / gov page / judgment / secondary), pulled
      // deterministically from the file's `sources` frontmatter so the UI can
      // cite the primary source — not the internal corpus path — to the user.
      readonly sources: ReadonlyArray<{ title: string; url: string; kind: string }>;
      /** Statute Articles this file covers (from `articles_covered`). */
      readonly articles: ReadonlyArray<string>;
    }
  | {
      readonly type: "verdict";
      readonly kind: string;
      readonly claimsChecked: number;
      readonly claimsWithCitation: number;
      readonly rejectCount: number;
      readonly notes: string;
      readonly reasons: ReadonlyArray<{ claim: string; issueKind: string; citedSource: string; detail: string }>;
    }
  | {
      readonly type: "done";
      readonly turns: number;
      readonly costUsd: number;
      // Canonical final answer text + session id, so callers can persist
      // the turn without replicating the narration-reset bookkeeping.
      readonly answer: string;
      readonly sessionId: string;
    }
  | { readonly type: "error"; readonly message: string };

export interface StreamOptions {
  /** SDK session id to resume — continues an existing conversation. */
  readonly resume?: string;
}

interface VerifierReason {
  readonly claim: string;
  readonly issueKind: string;
  readonly citedSource: string;
  readonly detail: string;
}

interface VerifierVerdictLike {
  readonly kind: string;
  readonly claimsChecked: number;
  readonly claimsWithCitation: number;
  readonly reasons: VerifierReason[];
}

export interface CreateAgentOptions {
  readonly repoRoot: string;
  readonly tagIndexPath?: string;
  readonly maxTurns?: number;
  /** Run the citation-verifier after each answer and emit its verdict. Default true. */
  readonly verify?: boolean;
  /**
   * When the verifier rejects an answer, regenerate a corrected one (feeding
   * the verifier's reasons back to the agent) up to this many times before
   * surfacing the answer with the unresolved flags. Default 1.
   */
  readonly maxVerifyRetries?: number;
}

export interface OffshoreaiAgent {
  stream(question: string, opts?: StreamOptions): AsyncGenerator<AgentEvent, void, unknown>;
}

const CORPUS_PATH_RE = /knowledge\/[A-Za-z0-9._/-]+\.md/g;
const WARN_DAYS = 180;
const STALE_DAYS = 365;

function freshnessFor(ageDays: number | null): "fresh" | "warn" | "stale" {
  if (ageDays === null) return "warn";
  if (ageDays >= STALE_DAYS) return "stale";
  if (ageDays >= WARN_DAYS) return "warn";
  return "fresh";
}

function ageDaysFrom(lastVerified: string | null): number | null {
  if (!lastVerified) return null;
  const then = Date.parse(lastVerified);
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86_400_000);
}

/**
 * Build the corpus tools server + a freshness-lookup context once, and
 * return an agent that streams answers (+ citations + verifier verdict).
 */
export async function createOffshoreaiAgent(opts: CreateAgentOptions): Promise<OffshoreaiAgent> {
  const ctxOpts = opts.tagIndexPath
    ? { repoRoot: opts.repoRoot, tagIndexPath: opts.tagIndexPath }
    : { repoRoot: opts.repoRoot };

  const corpusServer = await createCorpusToolsServer(ctxOpts);
  const corpus: CorpusContext = await buildCorpusContext(ctxOpts);
  const taxonomyBlock = opts.tagIndexPath
    ? await buildTaxonomyBlock(opts.repoRoot, opts.tagIndexPath)
    : "";
  const fullSystemPrompt = baselineSystemPrompt + taxonomyBlock;
  const allowedTools = [...corpusAllowedToolNames(), "Read", "Glob", "Grep"];
  const verify = opts.verify ?? true;
  const maxVerifyRetries = opts.maxVerifyRetries ?? 1;

  function sourcesOf(rec: CorpusRecord): Array<{ title: string; url: string; kind: string }> {
    const s = (rec.frontmatter as { sources?: unknown }).sources;
    if (!Array.isArray(s)) return [];
    return s.flatMap((x) => {
      if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        const title = typeof o["title"] === "string" ? o["title"] : "";
        const url = typeof o["url"] === "string" ? o["url"] : "";
        const kind = typeof o["kind"] === "string" ? o["kind"] : "";
        if (title || url) return [{ title, url, kind }];
      }
      return [];
    });
  }

  function citationEvent(path: string): Extract<AgentEvent, { type: "citation" }> {
    const rec = corpus.byPath.get(path);
    if (!rec) {
      return {
        type: "citation",
        path,
        exists: false,
        title: null,
        status: null,
        lastVerified: null,
        ageDays: null,
        freshness: "missing",
        sources: [],
        articles: [],
      };
    }
    const lastVerified = getLastVerified(rec);
    const ageDays = ageDaysFrom(lastVerified);
    const status = getStatus(rec);
    return {
      type: "citation",
      path,
      exists: true,
      title: getTitle(rec),
      status,
      lastVerified,
      ageDays,
      freshness: status === "stale" ? "stale" : freshnessFor(ageDays),
      sources: sourcesOf(rec),
      articles: [...getArticlesCovered(rec)],
    };
  }

  return {
    async *stream(question: string, streamOpts?: StreamOptions): AsyncGenerator<AgentEvent, void, unknown> {
      const basePrompt = `Answer the following question against the offshoreai corpus. Follow the citation, freshness, source-hierarchy, and refusal rules in your system prompt.\n\nBegin your response directly with the substantive answer. Do NOT narrate your retrieval or thinking in the answer text — no "let me read…", "I have what I need", "let me pull the files" preambles. Any planning belongs in your thinking, not the answer.\n\nCITATION STYLE (user-facing): attach the PRIMARY SOURCE to each claim inline — the statute and the specific Article/section (e.g. "Trusts (Jersey) Law 1984, Article 9(4)"), or for non-statutory facts the official body (e.g. Revenue Jersey, the JFSC). Do NOT put repo file paths (knowledge/….md) inline in the prose. After the answer, list the corpus files you relied on once, under a short "Corpus provenance" heading — that trailing list is for traceability and must include the repo-relative path of every file supporting a claim.\n\nQuestion:\n${question}`;

      const correctionPrompt = (reasons: VerifierReason[]): string =>
        `A citation verifier reviewed your previous answer and flagged ${reasons.length} claim(s) as inadequately supported by the corpus. Revise your answer to resolve EACH flagged claim: add a corpus citation (repo-relative path, optionally with an Article reference) that supports it, or remove/soften the claim if the corpus does not support it. Do not introduce new uncited claims. Re-read corpus files if you need to.\n\nFlagged claims:\n${reasons
          .map((r) => `- "${r.claim}" — [${r.issueKind}] ${r.detail}`)
          .join("\n")}\n\nProduce the FULL corrected answer (not just the changes), beginning directly with the substantive answer.`;

      const toolCalls: Array<{ name: string; inputDigest: string }> = [];
      let turns = 0;
      let costUsd = 0;
      let sessionId = "";
      let answer = "";

      try {
        let currentPrompt = basePrompt;
        // The first pass resumes the caller's session (if any); correction
        // passes resume the session THIS stream advanced, so the agent sees
        // its own prior draft and the verifier's reasons in context.
        let currentResume = streamOpts?.resume;
        let attempt = 0;
        let finalVerdict: VerifierVerdictLike | null = null;

        for (;;) {
          // `segment` is the contiguous answer text since the last reset; text
          // emitted before a tool call is narration and gets reset away.
          // `resultText` is the SDK's canonical final answer (preferred).
          let segment = "";
          let resultText = "";

          for await (const msg of query({
            prompt: currentPrompt,
            options: {
              mcpServers: { corpus: corpusServer },
              allowedTools,
              systemPrompt: { type: "preset", preset: "claude_code", append: fullSystemPrompt },
              maxTurns: opts.maxTurns ?? 20,
              permissionMode: "bypassPermissions",
              cwd: opts.repoRoot,
              // Resume an existing SDK session to continue with full prior
              // context (messages + tool results) replayed by the SDK.
              ...(currentResume ? { resume: currentResume } : {}),
              includePartialMessages: true,
              // Let the model plan/retrieve in thinking blocks rather than
              // narrating ("let me read X…") in the user-facing answer text.
              // Explicit `enabled` (vs `adaptive`) so thinking engages on any
              // model, not only Opus 4.6+ where adaptive is supported.
              thinking: { type: "enabled", budgetTokens: 4000 },
            },
          })) {
            // The session id rides on every message; surface it as soon as we
            // see it so the caller can persist the conversation handle.
            const sid = (msg as { session_id?: string }).session_id;
            if (sid && sid !== sessionId) {
              sessionId = sid;
              yield { type: "session", sessionId };
            }

            // Stream answer text from partial deltas (do NOT also emit from the
            // assistant message, or text would double). Thinking deltas stream
            // separately as `reasoning`.
            if (msg.type === "stream_event") {
              const ev = (
                msg as { event?: { type?: string; delta?: { type?: string; text?: string; thinking?: string } } }
              ).event;
              if (ev?.type === "content_block_delta") {
                if (ev.delta?.type === "text_delta" && ev.delta.text) {
                  segment += ev.delta.text;
                  yield { type: "text", delta: ev.delta.text };
                } else if (ev.delta?.type === "thinking_delta" && ev.delta.thinking) {
                  yield { type: "reasoning", delta: ev.delta.thinking };
                }
              }
            } else if (msg.type === "assistant") {
              const content =
                (msg as { message?: { content?: Array<{ type: string; name?: string; input?: unknown }> } }).message
                  ?.content ?? [];
              let sawTool = false;
              for (const block of content) {
                if (block.type === "tool_use" && block.name) {
                  // Text streamed before this tool call was interstitial
                  // narration, not the answer — tell the UI to clear it.
                  if (!sawTool && segment.trim().length > 0) {
                    segment = "";
                    yield { type: "reset" };
                  }
                  sawTool = true;
                  toolCalls.push({ name: block.name, inputDigest: JSON.stringify(block.input ?? {}).slice(0, 200) });
                  yield { type: "tool", name: block.name, input: block.input ?? {} };
                }
              }
            } else if (msg.type === "result") {
              const r = msg as { num_turns?: number; total_cost_usd?: number; result?: string };
              turns = r.num_turns ?? turns;
              costUsd += r.total_cost_usd ?? 0;
              if (r.result) resultText = r.result;
            }
          }

          // Canonical answer for this pass: the SDK's final result text when
          // present, else the last streamed segment (post-narration-reset).
          answer = resultText.trim().length > 0 ? resultText : segment;

          // Citations: every corpus path the answer cites, badged for
          // freshness. On a retry the UI cleared the sources via `revise`, so
          // re-emitting here repopulates them for the corrected answer.
          const seen = new Set<string>();
          for (const m of answer.matchAll(CORPUS_PATH_RE)) {
            const path = m[0];
            if (seen.has(path)) continue;
            seen.add(path);
            yield citationEvent(path);
          }

          if (!verify || answer.trim().length === 0) break;

          // Verifier — the citation-verifier subagent, surfaced as a visible
          // "second opinion on citation quality" delegation.
          yield { type: "verify_start" };
          let v: VerifierVerdict;
          try {
            v = await runCitationVerifier({
              repoRoot: opts.repoRoot,
              candidateAnswer: answer,
              toolCallLog: toolCalls,
            });
          } catch (e) {
            // Verifier infrastructure failure (SDK / network / usage limit).
            // NEVER gate on this — the agent's answer is fine; flag verification
            // as unavailable and stop. No destructive regeneration, no dead-end.
            yield { type: "verify_error", message: (e as Error)?.message ?? String(e) };
            break;
          }

          // A parse/soft failure means the verifier could not be evaluated — it
          // is "verification unavailable", NOT a substantive rejection, and must
          // not trigger a (destructive) regeneration. (rejectFromParseFailure in
          // citation-verifier.ts emits exactly this synthetic reason.)
          const parseFailed = v.reasons.length === 1 && v.reasons[0]?.claim === "(verifier parse failure)";
          if (parseFailed) {
            yield { type: "verify_error", message: v.notes || "verifier output was not parseable" };
            break;
          }

          const reasons = v.reasons.map((r) => ({
            claim: r.claim,
            issueKind: r.issueKind,
            citedSource: r.citedSource,
            detail: r.detail,
          }));

          // Pass, or retries exhausted → this is the final verdict (the
          // exhausted case surfaces the answer WITH its unresolved flags).
          if (reasons.length === 0 || attempt >= maxVerifyRetries) {
            finalVerdict = {
              kind: v.kind,
              claimsChecked: v.claimsChecked,
              claimsWithCitation: v.claimsWithCitation,
              reasons,
            };
            break;
          }

          // Rejected with retries left → regenerate a corrected answer.
          attempt++;
          yield { type: "revise", attempt, rejectCount: reasons.length, reasons };
          currentPrompt = correctionPrompt(reasons);
          currentResume = sessionId;
        }

        if (finalVerdict) {
          yield {
            type: "verdict",
            kind: finalVerdict.kind,
            claimsChecked: finalVerdict.claimsChecked,
            claimsWithCitation: finalVerdict.claimsWithCitation,
            rejectCount: finalVerdict.reasons.length,
            notes: "",
            reasons: finalVerdict.reasons,
          };
        }

        yield { type: "done", turns, costUsd, answer, sessionId };
      } catch (err) {
        yield { type: "error", message: (err as Error)?.message ?? String(err) };
      }
    },
  };
}
