// Pure, deterministic unit tests for the web server's security-critical
// predicates: the DNS-rebinding Host-header defence and the conversationId
// UUID validation. These live in ./validation.ts (factored out of server.ts,
// which has module-load side effects — it builds the SDK agent and listens),
// so they're testable without any network, SDK, or live model.

import { describe, expect, it } from "vitest";
import { hostAllowed, UUID_RE } from "../src/validation.js";

describe("hostAllowed — DNS-rebinding defence (loopback bind)", () => {
  it("accepts localhost-family Host headers when bound to loopback", () => {
    expect(hostAllowed("127.0.0.1", true)).toBe(true);
    expect(hostAllowed("localhost", true)).toBe(true);
  });

  it("accepts a localhost Host header that carries a port", () => {
    // The defence strips the :port before comparing.
    expect(hostAllowed("localhost:3104", true)).toBe(true);
    expect(hostAllowed("127.0.0.1:3104", true)).toBe(true);
  });

  it("is case-insensitive on the host name", () => {
    expect(hostAllowed("LOCALHOST", true)).toBe(true);
    expect(hostAllowed("LocalHost:3104", true)).toBe(true);
  });

  it("REJECTS a spoofed / foreign Host header on a loopback bind", () => {
    // The DNS-rebinding scenario: attacker.example resolves to 127.0.0.1 in
    // the victim's browser, but the Host header still reads the attacker domain.
    expect(hostAllowed("attacker.example", true)).toBe(false);
    expect(hostAllowed("evil.com:3104", true)).toBe(false);
    // Not a localhost name even though it embeds 127.0.0.1.
    expect(hostAllowed("127.0.0.1.attacker.example", true)).toBe(false);
    // ::1 (IPv6 loopback) is not in the allowlist — must be rejected.
    expect(hostAllowed("[::1]:3104", true)).toBe(false);
  });

  it("REJECTS a missing / empty Host header on a loopback bind", () => {
    expect(hostAllowed(undefined, true)).toBe(false);
    expect(hostAllowed("", true)).toBe(false);
  });

  it("allows ALL hosts when NOT bound to loopback (operator opted in)", () => {
    // With an explicit non-local bind the operator owns perimeter security,
    // so the predicate short-circuits to allow.
    expect(hostAllowed("attacker.example", false)).toBe(true);
    expect(hostAllowed(undefined, false)).toBe(true);
    expect(hostAllowed("anything", false)).toBe(true);
  });
});

describe("UUID_RE — conversationId shape validation", () => {
  it("matches canonical v4 UUIDs (the shape randomUUID produces)", () => {
    expect(UUID_RE.test("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(UUID_RE.test("00000000-0000-0000-0000-000000000000")).toBe(true);
  });

  it("is case-insensitive (accepts upper-case hex)", () => {
    expect(UUID_RE.test("123E4567-E89B-12D3-A456-426614174000")).toBe(true);
  });

  it("rejects malformed ids used as conversationId", () => {
    expect(UUID_RE.test("not-a-uuid")).toBe(false);
    expect(UUID_RE.test("")).toBe(false);
    // Wrong segment lengths.
    expect(UUID_RE.test("123e4567-e89b-12d3-a456-42661417400")).toBe(false); // last group short
    expect(UUID_RE.test("123e4567-e89b-12d3-a456-4266141740000")).toBe(false); // last group long
    // Non-hex character.
    expect(UUID_RE.test("123e4567-e89b-12d3-a456-42661417400g")).toBe(false);
    // Path-traversal / injection attempt that must never validate.
    expect(UUID_RE.test("../../etc/passwd")).toBe(false);
  });

  it("rejects a UUID with surrounding whitespace or extra characters (anchored)", () => {
    expect(UUID_RE.test(" 123e4567-e89b-12d3-a456-426614174000")).toBe(false);
    expect(UUID_RE.test("123e4567-e89b-12d3-a456-426614174000 ")).toBe(false);
    expect(UUID_RE.test("x123e4567-e89b-12d3-a456-426614174000")).toBe(false);
  });
});
