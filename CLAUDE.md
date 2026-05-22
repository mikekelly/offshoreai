# CLAUDE.md

This file is the Claude Code project-instructions adapter. The substantive content — cold-start reading order, repo conventions, what's deliberately not yet documented — lives in [`AGENTS.md`](./AGENTS.md) so it's shared across every coding agent that follows the [agentsmd.net](https://agentsmd.net) convention (Cursor, Codex, Aider, and others).

The line below @-references `AGENTS.md` so Claude Code transcludes it into the session context automatically. Don't duplicate content here — make changes in `AGENTS.md` and they propagate.

@AGENTS.md

The four corpus orientation surfaces are @-transcluded so sessions
arrive with jurisdiction, cross-jurisdictional, and strategic-narrative
context already loaded — the corpus is already a "land here, read cold"
surface and the agent should land here too.

1. **`knowledge/jersey/index.md`** — the agent-facing front door for
   the doctrinal Jersey corpus: section index, headline facts,
   where-to-start guidance. ~10K tokens.
2. **`knowledge/CROSS-JURISDICTIONAL-MAP.md`** — the comparison surface
   across the six jurisdictions. Without it the agent has no synthesis
   layer for "Jersey vs Cayman vs BVI" style questions and falls back
   on tag-by-tag retrieval that under-performs grep — confirmed by the
   v3 cohort eval where claude-p with Read+Grep beat us on
   show-trusts-comparison. ~5K tokens.
3. **`knowledge/jersey/history/finance/trajectory.md`** — the strategic-
   narrative layer: "four acts" synthesis of how Jersey reached its
   current state, with five structural through-lines. Gives the agent
   the historical context behind doctrinal substance. ~3K tokens.

All three paid once per session as cache writes; subsequent turns
read from cache.

@knowledge/jersey/index.md
@knowledge/CROSS-JURISDICTIONAL-MAP.md
@knowledge/jersey/history/finance/trajectory.md
