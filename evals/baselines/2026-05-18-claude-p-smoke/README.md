# 2026-05-18 — claude-p smoke run

**Status: blocked on auth.**

This directory was set up to validate the `claude-p` harness adapter
([`../../harnesses/README.md`](../../harnesses/README.md)) with one
showcase question. The dispatch syntax works (`claude -p
--output-format json --allowed-tools ... --add-dir ...`) but the
subprocess Claude Code session cannot reuse the parent session's OAuth
credentials — the API returns `401: Invalid authentication
credentials`.

## What worked

- CLI installed at `/Users/mike/.local/bin/claude` (Claude Code 2.1.101).
- `--output-format json` returns a stream-style JSON array with `system init`, `assistant`, and `result` events; the result envelope carries `num_turns`, `duration_ms`, `total_cost_usd`, and `usage` with `input_tokens` / `output_tokens` / `cache_*_tokens`.
- The harness adapter spec in `../../harnesses/README.md` is accurate for this version.

## What's blocked

- Running `claude -p` from this Claude Code session inherits the
  parent's `ANTHROPIC_BASE_URL` but not its credentials. Each subprocess
  invocation hits 401.
- `--bare` mode (intended to bypass OAuth) returned "Not logged in ·
  Please run /login" because there's no `ANTHROPIC_API_KEY` set in this
  environment.

## What's needed before the baseline can run

One of:

1. Set `ANTHROPIC_API_KEY` in the environment before invoking the runner.
2. Run `claude /login` interactively once to seed the OAuth tokens that
   subprocess sessions can read.
3. Pass `--settings <path>` pointing at a settings file that includes
   an `apiKeyHelper` script.

Until one of the above is in place, the `claude-p` half of the baseline
comparison is deferred. The `explore-subagent` half can still run (it
uses the parent session's auth) — that smoke run is in
[`../2026-05-18-explore-subagent-smoke/`](../2026-05-18-explore-subagent-smoke/).

## What this confirms about the harness spec

- The dispatch shape is right (see [`../../harnesses/README.md`](../../harnesses/README.md)).
- The trajectory reconstruction from the `result` envelope will work —
  the JSON shape matches what the schema in `../../../schemas/eval-trajectory.ts`
  expects.
- The only delta from the spec is the auth note above; the spec stays
  the same.
