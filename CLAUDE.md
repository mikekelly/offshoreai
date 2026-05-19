# CLAUDE.md

This file is the Claude Code project-instructions adapter. The substantive content — cold-start reading order, repo conventions, what's deliberately not yet documented — lives in [`AGENTS.md`](./AGENTS.md) so it's shared across every coding agent that follows the [agentsmd.net](https://agentsmd.net) convention (Cursor, Codex, Aider, and others).

The line below @-references `AGENTS.md` so Claude Code transcludes it into the session context automatically. Don't duplicate content here — make changes in `AGENTS.md` and they propagate.

@AGENTS.md

The Jersey corpus's agent-facing entry point is also @-transcluded so
sessions arrive with jurisdiction orientation (section index, headline
facts, where-to-start guidance) already in context — the corpus is
already a "land here, read cold" surface, so the agent should land here
too. ~10K tokens, paid once per session as a cache write.

@jersey/index.md
