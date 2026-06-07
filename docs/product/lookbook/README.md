# Design Lookbook + live-refresh loop

The rendered companion to [`../DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md). It freezes
every discrete UI state of the answering-agent web surface (the "editorial
Briefings Desk") so you can see each one — verdict pass/warn/reject, the four
freshness badges, reasoning/tool disclosures, the reject-and-revise flow, message
variants, landing cards, composer — **without a live, API-billed agent
round-trip.**

This is the visual analogue of the operator-seam test loop: it crystallises the
design taste captured in `DESIGN_SYSTEM.md` into a deterministic, replayable
reference. Seeing a verdict-reject style today otherwise costs a live API call.

## What's here

| File | Role |
|---|---|
| `index.html` | The lookbook. Static markup exercising the real app CSS. **Zero API calls.** |
| `lookbook.css` | Scaffolding for the lookbook frame only — *not* a design decision. |
| `preview.js` | Dependency-light live-refresh server (Node built-ins only). |

## How the lookbook can't drift

The lookbook **does not copy the app CSS.** The preview server reads the live
`<style>` block out of [`packages/web/public/index.html`](../../../packages/web/public/index.html)
on every request and serves it at `/app.css`, which `index.html` links. Change a
token in the app CSS (and in `DESIGN_SYSTEM.md`, per the provenance rule) and the
lookbook reflects it on the next reload. There is one source of truth for the CSS,
and it is the app.

`DESIGN_SYSTEM.md` is the normative source-of-truth (tokens + rationale); the app
CSS is where those tokens run; this lookbook is them rendered. The chain is
`PERSONAS.md → DESIGN_SYSTEM.md → app CSS → lookbook`.

## Run the live-refresh loop

```bash
pnpm --filter @offshoreai/web lookbook      # → http://localhost:4321
# or directly:
node docs/product/lookbook/preview.js [port] # default port 4321
```

Open <http://localhost:4321>. The server watches this directory **and** the app's
`index.html`; editing the lookbook *or* the app CSS pushes an SSE reload to the
browser — no manual rebuild. Edit → see, instantly.

The reload client is *injected* into the HTML response by the server, so
`index.html` stays plain markup with no reload plumbing in source. If you open
`index.html` directly via `file://` (no server), `/app.css` 404s and specimens
render unstyled — run the preview server so the real CSS is mounted.

## Dev-only, zero API

`preview.js` serves static files unauthenticated on loopback. It is a dev tool,
never a production surface. It makes **no API calls** and never touches the agent
or the corpus tools — the whole point is a feedback loop that costs nothing.

## When you add a UI state

If you add a new component state to the app, add a labelled specimen here too
(group by component, label the state and its class names) so the lookbook stays a
complete catalogue. Keep specimens as the *exact* class structure `render.js`
emits, so they trace faithfully to the real UI.
