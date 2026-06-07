// Audit logging (AGENT-BEHAVIOURS #6).
//
// "Auditability is non-negotiable." Every tool call, every citation-verifier
// verdict, and every session bracket emits a structured, per-request-
// correlatable audit event. The transport here is the same one the web server
// already uses for request-lifecycle logs (packages/web/src/server.ts
// `logRequest`): a single-line JSON object written to stderr, no logging
// dependency, KISS. A distinct `kind:"audit"` field makes the events greppable
// and keeps them separable from the `logRequest` lifecycle lines that share the
// stderr stream and the `request_id` correlation key.
//
// The SDK hooks (PostToolUse / Stop / SessionStart / SessionEnd) wired in
// web-agent.ts and runtime.ts only FIRE under the real SDK — the stubbed
// `queryFn` operator seam bypasses them entirely. So the testable surface is
// the pure record SHAPING below (`buildAuditRecord`); the hooks are thin
// adapters that map SDK hook inputs onto it and hand the result to `emitAudit`.

import { createHash } from "node:crypto";
import type {
  HookCallbackMatcher,
  HookEvent,
  PostToolUseHookInput,
  SessionEndHookInput,
  SessionStartHookInput,
} from "@anthropic-ai/claude-agent-sdk";

/** Single-tenant for now (PRD §9 is the per-tenant model; not built yet). */
export const DEFAULT_TENANT_ID = "default";

/** Discriminated input to the pure record builder — one variant per hook. */
export type AuditRecordInput =
  | {
      readonly event: "PostToolUse";
      readonly requestId?: string;
      readonly sessionId?: string;
      readonly tenantId?: string;
      readonly toolName: string;
      readonly toolInput: unknown;
      readonly toolResponse: unknown;
      /** SDK PostToolUse `duration_ms` — REAL tool execution latency. */
      readonly durationMs?: number;
      /** Override the timestamp (tests); defaults to now. */
      readonly ts?: string;
    }
  | {
      readonly event: "Stop";
      readonly requestId?: string;
      readonly sessionId?: string;
      readonly tenantId?: string;
      /** Citation-verifier verdict fields (#4). */
      readonly verdictKind?: string;
      readonly claimsChecked?: number;
      readonly claimsWithCitation?: number;
      readonly rejectCount?: number;
      readonly ts?: string;
    }
  | {
      readonly event: "SessionStart" | "SessionEnd";
      readonly requestId?: string;
      readonly sessionId?: string;
      readonly tenantId?: string;
      /** SDK SessionStart `source` / SessionEnd `reason`. */
      readonly source?: string;
      readonly ts?: string;
    };

export interface AuditRecord {
  readonly kind: "audit";
  readonly event: AuditRecordInput["event"];
  readonly ts: string;
  readonly request_id: string | null;
  readonly session_id: string | null;
  readonly tenant_id: string;
  readonly tool_name?: string;
  /** Stable digest of the tool input — content-addressable, never the raw input. */
  readonly input_hash?: string;
  readonly result_status?: "ok" | "error";
  readonly latency_ms?: number;
  readonly verdict_kind?: string;
  readonly claims_checked?: number;
  readonly claims_with_citation?: number;
  readonly reject_count?: number;
  readonly source?: string;
}

/** SHA-256 of the JSON-serialised tool input, truncated to 16 hex chars. */
export function hashInput(input: unknown): string {
  let serialised: string;
  try {
    serialised = JSON.stringify(input ?? null);
  } catch {
    serialised = String(input);
  }
  return createHash("sha256").update(serialised ?? "null").digest("hex").slice(0, 16);
}

/**
 * Did the tool response signal an error? The SDK / MCP tool-result envelope
 * carries `isError: true` (and built-in tools may use `is_error`). Default to
 * "ok" when neither is set.
 */
function resultStatus(toolResponse: unknown): "ok" | "error" {
  if (toolResponse && typeof toolResponse === "object") {
    const o = toolResponse as Record<string, unknown>;
    if (o["isError"] === true || o["is_error"] === true) return "error";
  }
  return "ok";
}

/**
 * Pure: map a hook input onto the structured audit record. No I/O — the caller
 * (`emitAudit`) writes it. This is the unit-tested SHAPING core of the audit
 * hooks; keeping it pure lets the field mapping / input hashing / latency /
 * id-propagation be asserted deterministically without the live SDK.
 */
export function buildAuditRecord(input: AuditRecordInput): AuditRecord {
  const base = {
    kind: "audit" as const,
    event: input.event,
    ts: input.ts ?? new Date().toISOString(),
    request_id: input.requestId ?? null,
    session_id: input.sessionId ?? null,
    tenant_id: input.tenantId ?? DEFAULT_TENANT_ID,
  };

  if (input.event === "PostToolUse") {
    return {
      ...base,
      tool_name: input.toolName,
      input_hash: hashInput(input.toolInput),
      result_status: resultStatus(input.toolResponse),
      latency_ms: input.durationMs ?? 0,
    };
  }

  if (input.event === "Stop") {
    return {
      ...base,
      verdict_kind: input.verdictKind ?? "unknown",
      claims_checked: input.claimsChecked ?? 0,
      claims_with_citation: input.claimsWithCitation ?? 0,
      reject_count: input.rejectCount ?? 0,
    };
  }

  // SessionStart / SessionEnd
  return {
    ...base,
    ...(input.source !== undefined ? { source: input.source } : {}),
  };
}

/** Write one audit record as a single-line JSON object to stderr. */
export function emitAudit(record: AuditRecord): void {
  process.stderr.write(`${JSON.stringify(record)}\n`);
}

/**
 * Build the SDK `hooks` option (AGENT-BEHAVIOURS #6). These callbacks fire only
 * under the REAL SDK — the stubbed `queryFn` operator seam bypasses them — so
 * the field shaping (the testable part) lives in `buildAuditRecord`; here the
 * hooks just adapt SDK hook inputs onto it and `emitAudit` the result.
 *
 * Each callback returns `{ continue: true }` (non-blocking pass-through):
 * auditing observes, it never gates the loop (cross-cutting property
 * "failure-as-data" — auditing must not be able to crash a turn). The
 * verifier-verdict Stop audit is NOT a hook here — the verdict is produced by
 * our stream loop, not visible inside the SDK Stop hook, so the loop emits it
 * directly at the turn-stop boundary via `buildAuditRecord({event:"Stop"})`.
 *
 * `requestId` is the per-request correlation id threaded from HTTP ingress;
 * `session_id` rides on every SDK hook input. Together they correlate a
 * request's whole audit trace with one grep.
 */
export function auditHooks(opts: {
  readonly requestId?: string;
  readonly tenantId?: string;
}): Partial<Record<HookEvent, HookCallbackMatcher[]>> {
  const cont = async () => ({ continue: true as const });
  return {
    PostToolUse: [
      {
        hooks: [
          async (input) => {
            const i = input as PostToolUseHookInput;
            emitAudit(
              buildAuditRecord({
                event: "PostToolUse",
                ...(opts.requestId !== undefined ? { requestId: opts.requestId } : {}),
                sessionId: i.session_id,
                ...(opts.tenantId !== undefined ? { tenantId: opts.tenantId } : {}),
                toolName: i.tool_name,
                toolInput: i.tool_input,
                toolResponse: i.tool_response,
                ...(i.duration_ms !== undefined ? { durationMs: i.duration_ms } : {}),
              }),
            );
            return cont();
          },
        ],
      },
    ],
    SessionStart: [
      {
        hooks: [
          async (input) => {
            const i = input as SessionStartHookInput;
            emitAudit(
              buildAuditRecord({
                event: "SessionStart",
                ...(opts.requestId !== undefined ? { requestId: opts.requestId } : {}),
                sessionId: i.session_id,
                ...(opts.tenantId !== undefined ? { tenantId: opts.tenantId } : {}),
                source: i.source,
              }),
            );
            return cont();
          },
        ],
      },
    ],
    SessionEnd: [
      {
        hooks: [
          async (input) => {
            const i = input as SessionEndHookInput;
            emitAudit(
              buildAuditRecord({
                event: "SessionEnd",
                ...(opts.requestId !== undefined ? { requestId: opts.requestId } : {}),
                sessionId: i.session_id,
                ...(opts.tenantId !== undefined ? { tenantId: opts.tenantId } : {}),
                source: i.reason,
              }),
            );
            return cont();
          },
        ],
      },
    ],
  };
}
