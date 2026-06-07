// Deterministic state-machine test for the web-agent's streaming event
// protocol. The point of this file: prove the SDK-message → AgentEvent
// translation (draft → done, revise → rejected-draft → fresh-draft,
// verify_error → unavailable, session emission + resume, and the error path)
// WITHOUT a live model, network, or API billing.
//
// The operator seam: createOffshoreaiAgent accepts `queryFn` (the SDK query
// override) and `runVerifier` (the citation-verifier override). Tests script
// a fake async-iterable of SDK messages through `queryFn` and a fake verdict
// through `runVerifier`, then assert the ORDER and SHAPE of emitted events —
// not internal calls.
//
// `createOffshoreaiAgent` still builds the corpus tools server / context /
// system prompt from the real repo at construction time. Those are pure
// filesystem reads (no model, no network), so they keep this test free.

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createOffshoreaiAgent,
  type AgentEvent,
  type OffshoreaiAgent,
  type QueryFn,
} from "../src/web-agent.js";
import type { VerifierVerdict } from "../src/citation-verifier.js";

// Repo root = three levels up from packages/agent/test/.
const REPO_ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "..", "..");

// --- Fake SDK message builders -------------------------------------------
//
// The real SDK yields `stream_event` (partial deltas), `assistant` (tool_use
// blocks), and `result` (final answer + cost + turns) messages, each carrying
// `session_id`. We only build the fields web-agent.ts actually reads.

type FakeMsg = Record<string, unknown>;

function textDelta(text: string, sessionId: string): FakeMsg {
  return {
    type: "stream_event",
    session_id: sessionId,
    event: { type: "content_block_delta", delta: { type: "text_delta", text } },
  };
}

function thinkingDelta(thinking: string, sessionId: string): FakeMsg {
  return {
    type: "stream_event",
    session_id: sessionId,
    event: { type: "content_block_delta", delta: { type: "thinking_delta", thinking } },
  };
}

function toolUse(name: string, input: unknown, sessionId: string): FakeMsg {
  return {
    type: "assistant",
    session_id: sessionId,
    message: { content: [{ type: "tool_use", name, input }] },
  };
}

function result(opts: { result: string; sessionId: string; turns?: number; costUsd?: number }): FakeMsg {
  return {
    type: "result",
    session_id: opts.sessionId,
    result: opts.result,
    num_turns: opts.turns ?? 1,
    total_cost_usd: opts.costUsd ?? 0,
  };
}

/**
 * A scripted `queryFn`. Each call (the first answer pass, then any correction
 * passes) consumes the next message-script in `scripts`. Captures the options
 * each call received so tests can assert `resume` threading. If `throwOn` is
 * set for a call index, the iterable throws mid-stream to drive the error path.
 */
function scriptedQuery(scripts: FakeMsg[][], opts?: { throwOnCall?: number }): {
  queryFn: QueryFn;
  calls: Array<{ prompt: unknown; resume: string | undefined }>;
} {
  const calls: Array<{ prompt: unknown; resume: string | undefined }> = [];
  let callIndex = 0;
  const queryFn = ((params: { prompt: unknown; options?: { resume?: string } }) => {
    const i = callIndex++;
    calls.push({ prompt: params.prompt, resume: params.options?.resume });
    const msgs = scripts[i] ?? [];
    const shouldThrow = opts?.throwOnCall === i;
    async function* gen(): AsyncGenerator<FakeMsg, void, unknown> {
      for (const m of msgs) yield m;
      if (shouldThrow) throw new Error("scripted SDK failure");
    }
    return gen() as unknown as ReturnType<QueryFn>;
  }) as unknown as QueryFn;
  return { queryFn, calls };
}

function passVerdict(): VerifierVerdict {
  return {
    kind: "pass",
    claimsChecked: 2,
    claimsWithCitation: 2,
    claimsWithPrimarySourceCitation: 2,
    notes: "",
    reasons: [],
    remediationHint: "",
    costUsd: 0,
    wallClockSeconds: 0,
  };
}

function rejectVerdict(): VerifierVerdict {
  return {
    kind: "reject",
    claimsChecked: 2,
    claimsWithCitation: 1,
    claimsWithPrimarySourceCitation: 1,
    notes: "",
    reasons: [
      {
        claim: "Jersey has no inheritance tax",
        issueKind: "no_citation_attached",
        citedSource: "",
        detail: "no corpus citation attached",
      },
    ],
    remediationHint: "add a citation",
    costUsd: 0,
    wallClockSeconds: 0,
  };
}

// The verifier's synthetic parse-failure reason — web-agent.ts treats this as
// "verification unavailable" (verify_error), NOT a content rejection.
function parseFailureVerdict(): VerifierVerdict {
  return {
    kind: "reject",
    claimsChecked: 0,
    claimsWithCitation: 0,
    claimsWithPrimarySourceCitation: 0,
    notes: "verifier output was not parseable",
    reasons: [
      { claim: "(verifier parse failure)", issueKind: "unsupported_by_cited_file", citedSource: "", detail: "boom" },
    ],
    remediationHint: "soft failure",
    costUsd: 0,
    wallClockSeconds: 0,
  };
}

async function collect(stream: AsyncGenerator<AgentEvent, void, unknown>): Promise<AgentEvent[]> {
  const out: AgentEvent[] = [];
  for await (const ev of stream) out.push(ev);
  return out;
}

const types = (evs: AgentEvent[]): string[] => evs.map((e) => e.type);

describe("web-agent stream() — event state machine (SDK stubbed)", () => {
  let agent: OffshoreaiAgent;

  // No fake timers here: these scripted answers carry no `knowledge/….md`
  // paths, so the freshness/clock math (covered in web-agent.test.ts) never
  // runs. Each test builds its own agent with a scripted queryFn/runVerifier
  // (construction reads the real corpus from the filesystem only — no model,
  // no network).

  async function makeAgent(extra: {
    queryFn: QueryFn;
    runVerifier?: (o: unknown) => Promise<VerifierVerdict>;
    verify?: boolean;
    maxVerifyRetries?: number;
  }): Promise<OffshoreaiAgent> {
    return createOffshoreaiAgent({
      repoRoot: REPO_ROOT,
      queryFn: extra.queryFn,
      ...(extra.runVerifier ? { runVerifier: extra.runVerifier as never } : {}),
      ...(extra.verify === undefined ? {} : { verify: extra.verify }),
      ...(extra.maxVerifyRetries === undefined ? {} : { maxVerifyRetries: extra.maxVerifyRetries }),
    });
  }

  it("normal draft → done flow (verify off): text deltas then a terminal done", async () => {
    const { queryFn } = scriptedQuery([
      [
        textDelta("Jersey has ", "sess-1"),
        textDelta("no inheritance tax.", "sess-1"),
        result({ result: "Jersey has no inheritance tax.", sessionId: "sess-1", turns: 1, costUsd: 0.01 }),
      ],
    ]);
    agent = await makeAgent({ queryFn, verify: false });

    const evs = await collect(agent.stream("Does Jersey have inheritance tax?"));

    // session emitted once (first time the id is seen), then both text deltas,
    // then done. No verdict (verify off).
    expect(types(evs)).toEqual(["session", "text", "text", "done"]);
    const session = evs[0] as Extract<AgentEvent, { type: "session" }>;
    expect(session.sessionId).toBe("sess-1");
    const done = evs.at(-1) as Extract<AgentEvent, { type: "done" }>;
    expect(done.answer).toBe("Jersey has no inheritance tax.");
    expect(done.sessionId).toBe("sess-1");
    expect(done.turns).toBe(1);
    expect(done.costUsd).toBeCloseTo(0.01);
  });

  it("emits reasoning for thinking deltas and resets narration before a tool call", async () => {
    const { queryFn } = scriptedQuery([
      [
        thinkingDelta("planning…", "sess-x"),
        textDelta("let me read the firewall file", "sess-x"), // interstitial narration
        toolUse("mcp__corpus__getFile", { path: "knowledge/jersey/trusts/firewall.md" }, "sess-x"),
        textDelta("Jersey trusts have an Article 9 firewall.", "sess-x"),
        result({ result: "Jersey trusts have an Article 9 firewall.", sessionId: "sess-x" }),
      ],
    ]);
    agent = await makeAgent({ queryFn, verify: false });

    const evs = await collect(agent.stream("What is the firewall?"));

    // session, reasoning, narration text, reset (narration cleared), tool,
    // real answer text, done.
    expect(types(evs)).toEqual(["session", "reasoning", "text", "reset", "tool", "text", "done"]);
    const tool = evs.find((e) => e.type === "tool") as Extract<AgentEvent, { type: "tool" }>;
    expect(tool.name).toBe("mcp__corpus__getFile");
  });

  it("verify pass → verdict then done (no revise)", async () => {
    const { queryFn } = scriptedQuery([
      [
        textDelta("Answer with citation.", "sess-2"),
        result({ result: "Answer with citation.", sessionId: "sess-2" }),
      ],
    ]);
    agent = await makeAgent({ queryFn, verify: true, runVerifier: async () => passVerdict() });

    const evs = await collect(agent.stream("q"));

    expect(types(evs)).toEqual(["session", "text", "verify_start", "verdict", "done"]);
    const verdict = evs.find((e) => e.type === "verdict") as Extract<AgentEvent, { type: "verdict" }>;
    expect(verdict.kind).toBe("pass");
    expect(verdict.rejectCount).toBe(0);
  });

  it("revise → rejected-draft → fresh-draft: reject then pass on the corrected answer", async () => {
    const { queryFn, calls } = scriptedQuery([
      // First pass: the rejected draft.
      [textDelta("Draft one.", "sess-3"), result({ result: "Draft one.", sessionId: "sess-3" })],
      // Correction pass: the fresh draft.
      [textDelta("Draft two, corrected.", "sess-3"), result({ result: "Draft two, corrected.", sessionId: "sess-3" })],
    ]);
    let call = 0;
    const runVerifier = async (): Promise<VerifierVerdict> => (call++ === 0 ? rejectVerdict() : passVerdict());
    agent = await makeAgent({ queryFn, verify: true, maxVerifyRetries: 1, runVerifier });

    const evs = await collect(agent.stream("q"));

    // session, draft-one text, verify_start, revise (rejected draft), then the
    // SECOND pass: draft-two text, verify_start, verdict (the passing one), done.
    expect(types(evs)).toEqual([
      "session",
      "text",
      "verify_start",
      "revise",
      "text",
      "verify_start",
      "verdict",
      "done",
    ]);

    const revise = evs.find((e) => e.type === "revise") as Extract<AgentEvent, { type: "revise" }>;
    expect(revise.attempt).toBe(1);
    expect(revise.rejectCount).toBe(1);
    expect(revise.answer).toBe("Draft one."); // canonical text of the rejected draft
    expect(revise.reasons[0]?.claim).toBe("Jersey has no inheritance tax");

    // The correction pass must resume the session THIS stream advanced, so the
    // agent sees its own prior draft + the verifier's reasons.
    expect(calls).toHaveLength(2);
    expect(calls[1]?.resume).toBe("sess-3");

    const verdict = evs.find((e) => e.type === "verdict") as Extract<AgentEvent, { type: "verdict" }>;
    expect(verdict.kind).toBe("pass");

    const done = evs.at(-1) as Extract<AgentEvent, { type: "done" }>;
    expect(done.answer).toBe("Draft two, corrected.");
  });

  it("retries exhausted: surfaces the still-rejected answer with its flags as the final verdict", async () => {
    const { queryFn } = scriptedQuery([
      [textDelta("Draft one.", "sess-r"), result({ result: "Draft one.", sessionId: "sess-r" })],
      [textDelta("Draft two.", "sess-r"), result({ result: "Draft two.", sessionId: "sess-r" })],
    ]);
    agent = await makeAgent({ queryFn, verify: true, maxVerifyRetries: 1, runVerifier: async () => rejectVerdict() });

    const evs = await collect(agent.stream("q"));

    // reject on pass 1 → revise → reject on pass 2 but retries exhausted →
    // final verdict carries the unresolved flags, then done.
    expect(types(evs)).toEqual([
      "session",
      "text",
      "verify_start",
      "revise",
      "text",
      "verify_start",
      "verdict",
      "done",
    ]);
    const verdict = evs.find((e) => e.type === "verdict") as Extract<AgentEvent, { type: "verdict" }>;
    expect(verdict.kind).toBe("reject");
    expect(verdict.rejectCount).toBe(1);
  });

  it("verify_error → unavailable: verifier THROWS → verify_error, answer stands, no regeneration", async () => {
    const { queryFn, calls } = scriptedQuery([
      [textDelta("An answer.", "sess-4"), result({ result: "An answer.", sessionId: "sess-4" })],
    ]);
    agent = await makeAgent({
      queryFn,
      verify: true,
      runVerifier: async () => {
        throw new Error("verifier usage limit");
      },
    });

    const evs = await collect(agent.stream("q"));

    // No verdict, no revise — verify_error then done. Only ONE query pass (no
    // destructive regeneration).
    expect(types(evs)).toEqual(["session", "text", "verify_start", "verify_error", "done"]);
    const ve = evs.find((e) => e.type === "verify_error") as Extract<AgentEvent, { type: "verify_error" }>;
    expect(ve.message).toBe("verifier usage limit");
    expect(calls).toHaveLength(1);
  });

  it("verify_error → unavailable: verifier PARSE FAILURE is unavailable, not a rejection", async () => {
    const { queryFn, calls } = scriptedQuery([
      [textDelta("An answer.", "sess-5"), result({ result: "An answer.", sessionId: "sess-5" })],
    ]);
    agent = await makeAgent({ queryFn, verify: true, runVerifier: async () => parseFailureVerdict() });

    const evs = await collect(agent.stream("q"));

    expect(types(evs)).toEqual(["session", "text", "verify_start", "verify_error", "done"]);
    const ve = evs.find((e) => e.type === "verify_error") as Extract<AgentEvent, { type: "verify_error" }>;
    expect(ve.message).toBe("verifier output was not parseable");
    expect(calls).toHaveLength(1); // no regeneration on a soft failure
  });

  it("resume: a caller-supplied resume id is threaded into the SDK query for the first pass", async () => {
    const { queryFn, calls } = scriptedQuery([
      [textDelta("Continued.", "sess-6"), result({ result: "Continued.", sessionId: "sess-6" })],
    ]);
    agent = await makeAgent({ queryFn, verify: false });

    await collect(agent.stream("follow-up question", { resume: "prior-session-abc" }));

    expect(calls).toHaveLength(1);
    expect(calls[0]?.resume).toBe("prior-session-abc");
  });

  it("error path: an SDK failure mid-stream emits a terminal error event", async () => {
    const { queryFn } = scriptedQuery(
      [[textDelta("partial…", "sess-7")]],
      { throwOnCall: 0 },
    );
    agent = await makeAgent({ queryFn, verify: false });

    const evs = await collect(agent.stream("q"));

    // The partial text streamed, then the thrown error is caught and surfaced
    // as a terminal `error` event (no `done`).
    expect(types(evs)).toEqual(["session", "text", "error"]);
    const err = evs.at(-1) as Extract<AgentEvent, { type: "error" }>;
    expect(err.message).toBe("scripted SDK failure");
  });
});
