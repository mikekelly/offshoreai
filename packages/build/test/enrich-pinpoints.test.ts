// Tests for the pinpoint-citation enrichment pure functions. These cover
// the match-by-source-title logic, the article→URL computation, idempotence,
// and the safe behaviour when the registry has no anchor for a covered
// article.

import { describe, expect, it } from "vitest";
import type { CorpusRecord } from "../src/compile/loader.js";
import {
  computePinpoints,
  matchRegistryEntry,
  pinpointsEqual,
  pinpointsOf,
  type PinpointRegistry,
} from "../src/enrich/pinpoints.js";

const REGISTRY: PinpointRegistry = [
  {
    id: "trusts-jersey-law-1984",
    name: "Trusts (Jersey) Law 1984",
    source_titles_match: ["Trusts (Jersey) Law 1984"],
    base: "https://www.jerseylaw.je/laws/current/l_11_1984",
    anchor_kind: "literal",
    lastScraped: "2026-05-23",
    anchors: { "9": "_Toc224641894", "9A": "_Toc224641895", "47B": "_Toc224641945" },
  },
];

function fakeRec(frontmatter: Record<string, unknown>): CorpusRecord {
  return { path: "fake.md", abs: "/fake.md", kind: "concept", frontmatter, body: "" };
}

describe("matchRegistryEntry", () => {
  it("matches when a source title contains the registry needle (case-insensitive)", () => {
    const rec = fakeRec({
      sources: [{ title: "Trusts (Jersey) Law 1984 — Article 9 (consolidated)", kind: "statute" }],
    });
    expect(matchRegistryEntry(rec, REGISTRY)?.id).toBe("trusts-jersey-law-1984");
  });
  it("returns null when no source matches", () => {
    const rec = fakeRec({ sources: [{ title: "Some other law", kind: "statute" }] });
    expect(matchRegistryEntry(rec, REGISTRY)).toBeNull();
  });
  it("returns null when sources frontmatter is missing", () => {
    expect(matchRegistryEntry(fakeRec({}), REGISTRY)).toBeNull();
  });
});

describe("computePinpoints", () => {
  it("builds deep-link URLs for every covered article that's in the registry", () => {
    const rec = fakeRec({
      sources: [{ title: "Trusts (Jersey) Law 1984", kind: "statute" }],
      articles_covered: ["9", "9A"],
    });
    expect(computePinpoints(rec, REGISTRY)).toEqual([
      { article: "9", url: "https://www.jerseylaw.je/laws/current/l_11_1984#_Toc224641894", source: "trusts-jersey-law-1984" },
      { article: "9A", url: "https://www.jerseylaw.je/laws/current/l_11_1984#_Toc224641895", source: "trusts-jersey-law-1984" },
    ]);
  });
  it("skips articles the registry doesn't know about", () => {
    const rec = fakeRec({
      sources: [{ title: "Trusts (Jersey) Law 1984", kind: "statute" }],
      articles_covered: ["9", "999X"],
    });
    expect(computePinpoints(rec, REGISTRY).map((p) => p.article)).toEqual(["9"]);
  });
  it("returns empty when no statute matches", () => {
    const rec = fakeRec({
      sources: [{ title: "Some Other Law 2020", kind: "statute" }],
      articles_covered: ["9"],
    });
    expect(computePinpoints(rec, REGISTRY)).toEqual([]);
  });
  it("returns empty when articles_covered is missing", () => {
    const rec = fakeRec({ sources: [{ title: "Trusts (Jersey) Law 1984", kind: "statute" }] });
    expect(computePinpoints(rec, REGISTRY)).toEqual([]);
  });
});

describe("pinpointsEqual + pinpointsOf (idempotence wiring)", () => {
  const a = [
    { article: "9", url: "u1", source: "s" },
    { article: "9A", url: "u2", source: "s" },
  ];
  it("equal under reordering", () => {
    expect(pinpointsEqual(a, [...a].reverse())).toBe(true);
  });
  it("unequal on different lengths or values", () => {
    expect(pinpointsEqual(a, a.slice(0, 1))).toBe(false);
    expect(pinpointsEqual(a, [{ article: "9", url: "OTHER", source: "s" }, a[1]!])).toBe(false);
  });
  it("pinpointsOf round-trips well-formed frontmatter", () => {
    const rec = fakeRec({ pinpoints: a });
    expect(pinpointsOf(rec)).toEqual(a);
  });
  it("pinpointsOf returns [] for malformed entries", () => {
    expect(pinpointsOf(fakeRec({}))).toEqual([]);
    expect(pinpointsOf(fakeRec({ pinpoints: "not an array" }))).toEqual([]);
    expect(pinpointsOf(fakeRec({ pinpoints: [{ article: 9, url: 1, source: null }] }))).toEqual([]);
  });
});
