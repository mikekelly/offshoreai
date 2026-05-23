# @offshoreai/web

A small bespoke web UI for the offshoreai answering agent. Streaming
chat over the in-process Claude Agent SDK runtime, with the
citation-verifier gate visible in the transcript and primary sources
rendered as first-class.

```
pnpm --filter @offshoreai/web start         # http://localhost:3104
PORT=3105 pnpm --filter @offshoreai/web start
pnpm --filter @offshoreai/web test          # vitest, 27 tests
```

## Security model — local single-user tool

**This server ships without authentication and is intended for local
development use only.** Defaults:

- Binds to `127.0.0.1` only (`OFFSHOREAI_BIND` overrides).
- When loopback-bound, rejects requests whose `Host` header isn't a
  localhost name — closes the DNS-rebinding vector where a malicious
  page resolved to `127.0.0.1` tries to talk to this server from a
  victim browser.
- All routes validate `conversationId` against the UUID v4 shape, so
  even if the storage layer later moves from an in-memory map to per-
  file persistence, a malformed id can't reach the filesystem.
- The conversation store serialises all mutations through an in-process
  queue (no JSON-file write races) — see `src/store.ts`.
- All untrusted strings (model output in answers, corpus frontmatter
  in citation URLs) are URL-scheme-checked and attribute-escaped
  before they reach the DOM — see `public/render.js` + tests in
  `test/render.test.ts`.

### What's NOT in scope at this layer

The following are explicit non-features of this UI and MUST be added
at the perimeter if the service is ever exposed beyond localhost:

- **No HTTP auth.** Any process on the host can call the API.
- **No CSRF / Origin enforcement.** Browser-CORS is the only barrier
  for cross-origin pages, and CORS doesn't protect non-mutating reads.
- **No rate limiting.** Each `/api/ask` invokes the SDK and the
  inline verifier — burning real API budget.
- **No multi-tenant separation.** The conversation store is a single
  JSON file per server process; no per-user namespace.
- **No TLS.** Plain HTTP only.

Set `OFFSHOREAI_BIND=0.0.0.0` (or a non-loopback hostname) only when
you have added each of the above at the perimeter (reverse proxy,
auth, rate-limit, TLS). The DNS-rebinding Host check is also bypassed
in that mode — you've opted in.

## Environment

| Variable                       | Default                                   | Purpose                                                    |
| ------------------------------ | ----------------------------------------- | ---------------------------------------------------------- |
| `PORT`                         | `3104`                                    | TCP port                                                   |
| `OFFSHOREAI_BIND`              | `127.0.0.1`                               | Interface to bind                                          |
| `OFFSHOREAI_WEB_DATA`          | `packages/web/.data/conversations.json`   | Conversation store file                                    |
| `OFFSHOREAI_VERIFIER_MODEL`    | `claude-opus-4-6`                         | Citation-verifier model alias (pin to a current model)     |
