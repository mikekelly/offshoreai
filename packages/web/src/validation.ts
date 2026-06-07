// Pure request-validation predicates for the web server, factored out of
// server.ts so they're unit-testable without importing server.ts (which has
// module-load side effects: it builds the SDK agent and starts listening).
//
// These guard two security-relevant surfaces:
//   - UUID_RE   — conversationId shape validation (rejects malformed ids).
//   - hostAllowed — the DNS-rebinding defence on a loopback-only bind.

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);

/**
 * When bound to loopback (`isLocalBind`), reject requests whose Host header
 * isn't a localhost name — closes the DNS-rebinding vector where a malicious
 * page on another domain (resolved to 127.0.0.1) tries to talk to this server
 * from a victim browser. With an explicit non-local bind, the operator is
 * opting in, so everything passes.
 *
 * `hostHeader` is the raw incoming Host header (or undefined). Locality is
 * passed in rather than read from process.env so this stays a pure predicate.
 */
export function hostAllowed(hostHeader: string | undefined, isLocalBind: boolean): boolean {
  if (!isLocalBind) return true;
  const raw = (hostHeader ?? "").toString().toLowerCase();
  const host = raw.split(":")[0] ?? "";
  return LOCAL_HOSTS.has(host);
}
