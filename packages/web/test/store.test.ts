// Tests for the conversation store — migration of legacy single-answer
// turns into the drafts[] shape, and serialisation of concurrent mutations
// through the internal write queue.

import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ConversationStore, migrateTurn, type Turn } from "../src/store.js";

describe("migrateTurn (legacy single-answer → drafts[])", () => {
  it("wraps a passing legacy turn as a single verified draft", () => {
    const out = migrateTurn({
      question: "What is GST?",
      answer: "5%",
      citations: [],
      verdict: {
        kind: "pass",
        claimsChecked: 1,
        claimsWithCitation: 1,
        rejectCount: 0,
        notes: "",
        reasons: [],
      },
      createdAt: "2026-05-22T16:00:00.000Z",
    });
    expect(out.drafts).toHaveLength(1);
    expect(out.drafts[0]!.status).toBe("verified");
    expect(out.drafts[0]!.superseded).toBe(false);
    expect(out.drafts[0]!.answer).toBe("5%");
  });

  it("wraps a rejected legacy turn as a single rejected draft", () => {
    const out = migrateTurn({
      question: "x",
      answer: "y",
      citations: [],
      verdict: {
        kind: "reject",
        claimsChecked: 2,
        claimsWithCitation: 1,
        rejectCount: 1,
        notes: "",
        reasons: [],
      },
      createdAt: "2026-05-22T16:00:00.000Z",
    });
    expect(out.drafts[0]!.status).toBe("rejected");
  });

  it("is idempotent on already-migrated turns", () => {
    const already: Turn = {
      question: "q",
      createdAt: "2026-05-22T00:00:00Z",
      drafts: [
        { answer: "a", citations: [], verdict: null, verifyError: null, status: "verified", superseded: false },
      ],
    };
    expect(migrateTurn(already)).toBe(already);
  });

  it("defaults missing fields safely", () => {
    const out = migrateTurn({});
    expect(out.question).toBe("");
    expect(out.drafts).toHaveLength(1);
    expect(out.drafts[0]!.answer).toBe("");
    expect(out.drafts[0]!.status).toBe("verified");
  });
});

describe("ConversationStore — write serialisation", () => {
  let dir: string;
  let file: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "offshoreai-store-"));
    file = join(dir, "convos.json");
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("serialises concurrent creates without losing any of them", async () => {
    const store = new ConversationStore(file);
    // Fire 10 concurrent creates — without the #queue mutex the JSON read-
    // modify-write would race and most would be lost.
    const convos = await Promise.all(
      Array.from({ length: 10 }, (_, i) => store.create(`question ${i}`)),
    );
    expect(convos).toHaveLength(10);
    const ondisk = JSON.parse(await readFile(file, "utf8")) as Array<{ id: string }>;
    expect(ondisk).toHaveLength(10);
    // ids round-trip
    const wroteIds = new Set(ondisk.map((c) => c.id));
    for (const c of convos) expect(wroteIds.has(c.id)).toBe(true);
  });

  it("appendTurn under concurrency keeps every turn", async () => {
    const store = new ConversationStore(file);
    const convo = await store.create("seed");
    await Promise.all(
      Array.from({ length: 8 }, (_, i) =>
        store.appendTurn(
          convo.id,
          {
            question: `q${i}`,
            drafts: [
              { answer: `a${i}`, citations: [], verdict: null, verifyError: null, status: "verified", superseded: false },
            ],
          },
          null,
        ),
      ),
    );
    const got = await store.get(convo.id);
    expect(got?.turns).toHaveLength(8);
  });
});
