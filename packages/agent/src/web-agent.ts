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
import { getLastVerified, getStatus, getTitle } from "@offshoreai/build";
import {
  buildCorpusContext,
  corpusAllowedToolNames,
  createCorpusToolsServer,
  type CorpusContext,
} from "@offshoreai/tools-corpus";
import { baselineSystemPrompt } from "./baseline-system-prompt.js";
import { runCitationVerifier } from "./citation-verifier.js";
import { buildTaxonomyBlock } from "./taxonomy-block.js";

export type AgentEvent =
  | { readonly type: "tool"; readonly name: string; readonly input: unknown }
  | { readonly type: "text"; readonly delta: string }
  | {
      readonly type: "citation";
      readonly path: string;
      readonly exists: boolean;
      readonly title: string | null;
      readonly status: string | null;
      readonly lastVerified: string | null;
      readonly ageDays: number | null;
      readonly freshness: "fresh" | "warn" | "stale" | "missing";
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
  | { readonly type: "done"; readonly turns: number; readonly costUsd: number }
  | { readonly type: "error"; readonly message: string };

export interface CreateAgentOptions {
  readonly repoRoot: string;
  readonly tagIndexPath?: string;
  readonly maxTurns?: number;
  /** Run the citation-verifier after each answer and emit its verdict. Default true. */
  readonly verify?: boolean;
}

export interface OffshoreaiAgent {
  stream(question: string): AsyncGenerator<AgentEvent, void, unknown>;
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
    };
  }

  return {
    async *stream(question: string): AsyncGenerator<AgentEvent, void, unknown> {
      const prompt = `Answer the following question against the offshoreai corpus. Follow the citation, freshness, source-hierarchy, and refusal rules in your system prompt.\n\nQuestion:\n${question}`;
      const toolCalls: Array<{ name: string; inputDigest: string }> = [];
      let answer = "";
      let turns = 0;
      let costUsd = 0;

      try {
        for await (const msg of query({
          prompt,
          options: {
            mcpServers: { corpus: corpusServer },
            allowedTools,
            systemPrompt: { type: "preset", preset: "claude_code", append: fullSystemPrompt },
            maxTurns: opts.maxTurns ?? 20,
            permissionMode: "bypassPermissions",
            cwd: opts.repoRoot,
            includePartialMessages: true,
          },
        })) {
          // Stream answer text from partial deltas (do NOT also emit from the
          // assistant message, or text would double).
          if (msg.type === "stream_event") {
            const ev = (msg as { event?: { type?: string; delta?: { type?: string; text?: string } } }).event;
            if (ev?.type === "content_block_delta" && ev.delta?.type === "text_delta" && ev.delta.text) {
              answer += ev.delta.text;
              yield { type: "text", delta: ev.delta.text };
            }
          } else if (msg.type === "assistant") {
            const content =
              (msg as { message?: { content?: Array<{ type: string; name?: string; input?: unknown }> } }).message
                ?.content ?? [];
            for (const block of content) {
              if (block.type === "tool_use" && block.name) {
                toolCalls.push({ name: block.name, inputDigest: JSON.stringify(block.input ?? {}).slice(0, 200) });
                yield { type: "tool", name: block.name, input: block.input ?? {} };
              }
            }
          } else if (msg.type === "result") {
            const r = msg as { num_turns?: number; total_cost_usd?: number; result?: string };
            turns = r.num_turns ?? turns;
            costUsd = r.total_cost_usd ?? costUsd;
            if (r.result && !answer) answer = r.result;
          }
        }

        // Citations: every corpus path the answer cites, badged for freshness.
        const seen = new Set<string>();
        for (const m of answer.matchAll(CORPUS_PATH_RE)) {
          const path = m[0];
          if (seen.has(path)) continue;
          seen.add(path);
          yield citationEvent(path);
        }

        // Verifier verdict — the structural gate, surfaced to the user.
        if (verify && answer.trim().length > 0) {
          const v = await runCitationVerifier({
            repoRoot: opts.repoRoot,
            candidateAnswer: answer,
            toolCallLog: toolCalls,
          });
          yield {
            type: "verdict",
            kind: v.kind,
            claimsChecked: v.claimsChecked,
            claimsWithCitation: v.claimsWithCitation,
            rejectCount: v.reasons.length,
            notes: v.notes,
            reasons: v.reasons.map((r) => ({
              claim: r.claim,
              issueKind: r.issueKind,
              citedSource: r.citedSource,
              detail: r.detail,
            })),
          };
        }

        yield { type: "done", turns, costUsd };
      } catch (err) {
        yield { type: "error", message: (err as Error)?.message ?? String(err) };
      }
    },
  };
}
