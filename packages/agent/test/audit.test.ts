// Pure, deterministic unit tests for the audit-record builder (AGENT-BEHAVIOURS
// #6). buildAuditRecord is the SHAPING core of the SDK audit hooks: the hooks
// themselves only fire under the real SDK (the stubbed queryFn seam bypasses
// them), so we unit-test the field mapping / input hashing / latency / id
// propagation here rather than asserting hook-firing end to end.

import { describe, expect, it } from "vitest";
import { buildAuditRecord, hashInput } from "../src/audit.js";

describe("buildAuditRecord — PostToolUse tool-call audit", () => {
  it("maps the SDK PostToolUse fields into a kind:'audit' tool record", () => {
    const rec = buildAuditRecord({
      event: "PostToolUse",
      requestId: "req-1",
      sessionId: "sess-1",
      toolName: "mcp__corpus__getFile",
      toolInput: { path: "knowledge/jersey/trusts/firewall.md" },
      toolResponse: { ok: true },
      durationMs: 42,
      ts: "2026-06-08T00:00:00.000Z",
    });

    expect(rec.kind).toBe("audit");
    expect(rec.event).toBe("PostToolUse");
    expect(rec.request_id).toBe("req-1");
    expect(rec.session_id).toBe("sess-1");
    expect(rec.tenant_id).toBe("default");
    expect(rec.tool_name).toBe("mcp__corpus__getFile");
    expect(rec.latency_ms).toBe(42);
    expect(rec.result_status).toBe("ok");
    expect(rec.ts).toBe("2026-06-08T00:00:00.000Z");
  });

  it("content-addresses the tool input: same input → same hash, never raw input", () => {
    const a = buildAuditRecord({
      event: "PostToolUse",
      toolName: "Read",
      toolInput: { path: "x.md" },
      toolResponse: {},
    });
    const b = buildAuditRecord({
      event: "PostToolUse",
      toolName: "Read",
      toolInput: { path: "x.md" },
      toolResponse: {},
    });
    const c = buildAuditRecord({
      event: "PostToolUse",
      toolName: "Read",
      toolInput: { path: "y.md" },
      toolResponse: {},
    });
    expect(a.input_hash).toBe(b.input_hash);
    expect(a.input_hash).not.toBe(c.input_hash);
    // The raw input is never present in the serialised record.
    expect(JSON.stringify(a)).not.toContain("x.md");
    expect(hashInput({ path: "x.md" })).toBe(a.input_hash);
  });

  it("flags result_status:'error' when the tool response signals isError", () => {
    const rec = buildAuditRecord({
      event: "PostToolUse",
      toolName: "mcp__corpus__getFile",
      toolInput: { path: "missing.md" },
      toolResponse: { isError: true, content: [] },
    });
    expect(rec.result_status).toBe("error");
  });

  it("defaults a missing duration_ms to 0 latency (never undefined)", () => {
    const rec = buildAuditRecord({
      event: "PostToolUse",
      toolName: "Grep",
      toolInput: {},
      toolResponse: {},
    });
    expect(rec.latency_ms).toBe(0);
  });
});

describe("buildAuditRecord — Stop (citation-verifier verdict) audit", () => {
  it("maps verifier verdict fields into a kind:'audit' Stop record", () => {
    const rec = buildAuditRecord({
      event: "Stop",
      requestId: "req-9",
      sessionId: "sess-9",
      verdictKind: "reject",
      claimsChecked: 5,
      claimsWithCitation: 3,
      rejectCount: 2,
      ts: "2026-06-08T01:00:00.000Z",
    });
    expect(rec.kind).toBe("audit");
    expect(rec.event).toBe("Stop");
    expect(rec.request_id).toBe("req-9");
    expect(rec.session_id).toBe("sess-9");
    expect(rec.tenant_id).toBe("default");
    expect(rec.verdict_kind).toBe("reject");
    expect(rec.claims_checked).toBe(5);
    expect(rec.claims_with_citation).toBe(3);
    expect(rec.reject_count).toBe(2);
  });
});

describe("buildAuditRecord — SessionStart / SessionEnd bracket audit", () => {
  it("brackets a session start with requestId + session_id + source", () => {
    const rec = buildAuditRecord({
      event: "SessionStart",
      requestId: "req-2",
      sessionId: "sess-2",
      source: "startup",
    });
    expect(rec.event).toBe("SessionStart");
    expect(rec.request_id).toBe("req-2");
    expect(rec.session_id).toBe("sess-2");
    expect(rec.source).toBe("startup");
    expect(rec.tenant_id).toBe("default");
  });

  it("brackets a session end carrying the SDK exit reason as source", () => {
    const rec = buildAuditRecord({
      event: "SessionEnd",
      sessionId: "sess-2",
      source: "clear",
    });
    expect(rec.event).toBe("SessionEnd");
    expect(rec.source).toBe("clear");
    // requestId may be unknown at the SDK session boundary → null, not crash.
    expect(rec.request_id).toBeNull();
  });
});
