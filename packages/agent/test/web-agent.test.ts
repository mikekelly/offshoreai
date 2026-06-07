// Pure, deterministic unit tests for the web-agent's freshness / citation /
// frontmatter helpers. These exercise the answer-citation pipeline's pure core
// (the UI's hallucination-surfacing differentiator lives in buildCitationEvent)
// WITHOUT touching the SDK, the network, or a live model — they run on
// in-memory CorpusRecord fixtures only.

import type { CorpusRecord } from "@offshoreai/build";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ageDaysFrom,
  buildCitationEvent,
  CORPUS_PATH_RE,
  freshnessFor,
  pinpointsOf,
  sourcesOf,
} from "../src/web-agent.js";

/** Minimal CorpusRecord fixture — only `frontmatter` matters for these helpers. */
function rec(frontmatter: Record<string, unknown>, path = "knowledge/jersey/x.md"): CorpusRecord {
  return { path, abs: `/repo/${path}`, kind: "concept", frontmatter, body: "" } as CorpusRecord;
}

describe("freshnessFor — WARN/STALE day-boundary thresholds", () => {
  it("returns 'fresh' below the WARN boundary", () => {
    expect(freshnessFor(0)).toBe("fresh");
    expect(freshnessFor(179)).toBe("fresh");
  });

  it("returns 'warn' AT the 180-day WARN boundary (>=, inclusive)", () => {
    expect(freshnessFor(180)).toBe("warn");
  });

  it("stays 'warn' between WARN and STALE boundaries", () => {
    expect(freshnessFor(181)).toBe("warn");
    expect(freshnessFor(364)).toBe("warn");
  });

  it("returns 'stale' AT the 365-day STALE boundary (>=, inclusive)", () => {
    expect(freshnessFor(365)).toBe("stale");
    expect(freshnessFor(1000)).toBe("stale");
  });

  it("treats a null age (unknown last_verified) as 'warn', not fresh", () => {
    // A file we couldn't date is suspect — never silently 'fresh'.
    expect(freshnessFor(null)).toBe("warn");
  });
});

describe("ageDaysFrom — date → integer age in days", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for a null / empty / unparseable date", () => {
    expect(ageDaysFrom(null)).toBeNull();
    expect(ageDaysFrom("")).toBeNull();
    expect(ageDaysFrom("not-a-date")).toBeNull();
  });

  it("computes a floored whole-day age against a frozen clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T00:00:00Z"));
    // Exactly 10 days earlier.
    expect(ageDaysFrom("2026-05-29")).toBe(10);
    // 0 days for today.
    expect(ageDaysFrom("2026-06-08")).toBe(0);
  });

  it("lands exactly on the 180-day WARN edge when composed with freshnessFor", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T00:00:00Z"));
    const day180 = new Date("2026-06-08T00:00:00Z");
    day180.setUTCDate(day180.getUTCDate() - 180);
    const iso = day180.toISOString().slice(0, 10);
    expect(ageDaysFrom(iso)).toBe(180);
    expect(freshnessFor(ageDaysFrom(iso))).toBe("warn");
  });

  it("lands exactly on the 365-day STALE edge when composed with freshnessFor", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T00:00:00Z"));
    const day365 = new Date("2026-06-08T00:00:00Z");
    day365.setUTCDate(day365.getUTCDate() - 365);
    const iso = day365.toISOString().slice(0, 10);
    expect(ageDaysFrom(iso)).toBe(365);
    expect(freshnessFor(ageDaysFrom(iso))).toBe("stale");
  });
});

describe("CORPUS_PATH_RE — corpus path recognition in answer prose", () => {
  it("matches knowledge/ paths ending in .md", () => {
    const text = "See knowledge/jersey/trusts/firewall.md and knowledge/cayman/index.md.";
    const found = [...text.matchAll(CORPUS_PATH_RE)].map((m) => m[0]);
    expect(found).toEqual(["knowledge/jersey/trusts/firewall.md", "knowledge/cayman/index.md"]);
  });

  it("does not match non-knowledge paths or .md outside knowledge/", () => {
    const text = "Edit packages/agent/src/web-agent.ts or README.md please.";
    expect([...text.matchAll(CORPUS_PATH_RE)]).toHaveLength(0);
  });

  it("matches paths with hyphens, dots and digits in segments", () => {
    const text = "knowledge/jersey/trusts/article-47-set-aside.md";
    const found = [...text.matchAll(CORPUS_PATH_RE)].map((m) => m[0]);
    expect(found).toEqual(["knowledge/jersey/trusts/article-47-set-aside.md"]);
  });
});

describe("sourcesOf — primary-source extraction from frontmatter", () => {
  it("returns [] when sources is absent or not an array", () => {
    expect(sourcesOf(rec({}))).toEqual([]);
    expect(sourcesOf(rec({ sources: "not-an-array" }))).toEqual([]);
  });

  it("extracts well-formed source entries and defaults missing fields to ''", () => {
    const out = sourcesOf(
      rec({
        sources: [
          { title: "Trusts (Jersey) Law 1984", url: "https://jerseylaw.je/t.aspx", kind: "statute" },
          { url: "https://gov.je/x" }, // title/kind missing → defaulted
        ],
      }),
    );
    expect(out).toEqual([
      { title: "Trusts (Jersey) Law 1984", url: "https://jerseylaw.je/t.aspx", kind: "statute" },
      { title: "", url: "https://gov.je/x", kind: "" },
    ]);
  });

  it("drops entries that have neither title nor url, and non-objects", () => {
    const out = sourcesOf(rec({ sources: [{ kind: "statute" }, "garbage", 42, { title: "Keep" }] }));
    expect(out).toEqual([{ title: "Keep", url: "", kind: "" }]);
  });
});

describe("pinpointsOf — per-article deep-link extraction from frontmatter", () => {
  it("returns [] when pinpoints is absent or not an array", () => {
    expect(pinpointsOf(rec({}))).toEqual([]);
    expect(pinpointsOf(rec({ pinpoints: {} }))).toEqual([]);
  });

  it("extracts entries that have BOTH article and url, defaulting source", () => {
    const out = pinpointsOf(
      rec({
        pinpoints: [
          { article: "9", url: "https://jerseylaw.je/a9", source: "TJL 1984" },
          { article: "9A", url: "https://jerseylaw.je/a9a" }, // source missing
        ],
      }),
    );
    expect(out).toEqual([
      { article: "9", url: "https://jerseylaw.je/a9", source: "TJL 1984" },
      { article: "9A", url: "https://jerseylaw.je/a9a", source: "" },
    ]);
  });

  it("drops entries missing article or url (both are required)", () => {
    const out = pinpointsOf(
      rec({ pinpoints: [{ article: "9" }, { url: "https://x" }, { article: "10", url: "https://ok" }] }),
    );
    expect(out).toEqual([{ article: "10", url: "https://ok", source: "" }]);
  });
});

describe("buildCitationEvent — the hallucination-surfacing path", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("flags a cited path that doesn't resolve as MISSING (exists:false)", () => {
    // The UI differentiator: a citation whose corpus path doesn't exist must
    // be surfaced as a (likely hallucinated) missing citation, not silently
    // dropped or rendered as fresh.
    const ev = buildCitationEvent("knowledge/jersey/does-not-exist.md", undefined);
    expect(ev.type).toBe("citation");
    expect(ev.path).toBe("knowledge/jersey/does-not-exist.md");
    expect(ev.exists).toBe(false);
    expect(ev.freshness).toBe("missing");
    expect(ev.title).toBeNull();
    expect(ev.status).toBeNull();
    expect(ev.lastVerified).toBeNull();
    expect(ev.ageDays).toBeNull();
    expect(ev.sources).toEqual([]);
    expect(ev.articles).toEqual([]);
    expect(ev.pinpoints).toEqual([]);
  });

  it("builds a fresh citation for a recently-verified resolving file", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T00:00:00Z"));
    const ev = buildCitationEvent(
      "knowledge/jersey/trusts/firewall.md",
      rec(
        {
          title: "Article 9 Firewall",
          status: "stable",
          last_verified: "2026-05-29", // 10 days → fresh
          sources: [{ title: "TJL 1984", url: "https://x", kind: "statute" }],
          articles_covered: ["9", "9(4)"],
          pinpoints: [{ article: "9", url: "https://x/a9", source: "TJL 1984" }],
        },
        "knowledge/jersey/trusts/firewall.md",
      ),
    );
    expect(ev.exists).toBe(true);
    expect(ev.title).toBe("Article 9 Firewall");
    expect(ev.status).toBe("stable");
    expect(ev.ageDays).toBe(10);
    expect(ev.freshness).toBe("fresh");
    expect(ev.sources).toHaveLength(1);
    expect(ev.articles).toEqual(["9", "9(4)"]);
    expect(ev.pinpoints).toEqual([{ article: "9", url: "https://x/a9", source: "TJL 1984" }]);
  });

  it("marks a file 'stale' when its status is stale regardless of age", () => {
    // Status-driven staleness wins over the date-derived freshness.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T00:00:00Z"));
    const ev = buildCitationEvent(
      "knowledge/jersey/y.md",
      rec({ status: "stale", last_verified: "2026-06-08" }), // age 0 → would be 'fresh'
    );
    expect(ev.freshness).toBe("stale");
  });

  it("downgrades a stable file to 'warn' once it crosses 180 days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T00:00:00Z"));
    const old = new Date("2026-06-08T00:00:00Z");
    old.setUTCDate(old.getUTCDate() - 200);
    const ev = buildCitationEvent(
      "knowledge/jersey/z.md",
      rec({ status: "stable", last_verified: old.toISOString().slice(0, 10) }),
    );
    expect(ev.freshness).toBe("warn");
  });

  it("treats a resolving file with no last_verified as 'warn'", () => {
    const ev = buildCitationEvent("knowledge/jersey/w.md", rec({ status: "stable" }));
    expect(ev.exists).toBe(true);
    expect(ev.ageDays).toBeNull();
    expect(ev.freshness).toBe("warn");
  });
});
