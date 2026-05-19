// Stable error envelope shared by all handlers. Per PRD §7.0.2 row 6:
// handlers wrap in try/catch and return the envelope as TOON in
// content[0].text with isError: true on the CallToolResult. The agent
// dispatches on error_kind.

import { scalar, help, toon } from "./toon.js";

export type ErrorKind =
  | "stale_corpus"
  | "stub_file"
  | "missing_file"
  | "invalid_tag"
  | "invalid_article"
  | "missing_bundle"
  | "primary_source_unreachable"
  | "validation_error"
  | "rate_limited"
  | "denied"
  | "internal_error";

export interface ErrorPayload {
  readonly errorKind: ErrorKind;
  readonly message: string;
  readonly context?: Readonly<Record<string, string | number | boolean>>;
  readonly helpLines?: ReadonlyArray<string>;
}

// Shape matches the SDK's CallToolResult. The SDK's expected return
// type has a `[x: string]: unknown` index signature; we mirror that
// so handlers can be passed directly without `as never` casts.
export interface SdkCallToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
  [k: string]: unknown;
}

export function errorResult(payload: ErrorPayload): SdkCallToolResult {
  const ctxLines = payload.context
    ? Object.entries(payload.context).map(([k, v]) => scalar(k, v))
    : [];
  const text = toon([
    scalar("error_kind", payload.errorKind),
    scalar("message", payload.message),
    ...ctxLines,
    help(payload.helpLines ?? []),
  ]);
  return { content: [{ type: "text", text }], isError: true };
}

export function successResult(text: string): SdkCallToolResult {
  return { content: [{ type: "text", text }] };
}
