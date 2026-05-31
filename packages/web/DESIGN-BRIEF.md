# Design brief — Offshore AI web UI

You are redesigning the front-end of a small bespoke chat interface
for a corpus-cited answering agent. A previous attempt over-decorated
the chrome and felt noisy; the owner wants it replaced. This brief
tells you what the product is, who it is for, what the functional
contract is, and what direction to take. The aesthetic is yours —
these are guardrails, not specs.

---

## What this product is

**Offshore AI** is a corpus-cited answering agent for the offshore-
finance jurisdictions (Jersey, Guernsey, Isle of Man, Cayman, BVI,
Bermuda). It answers questions of trust, fund, tax, regulatory, AML,
substance, and cross-border structuring law. Every answer is grounded
in a hand-curated, source-cited knowledge base. An independent
verifier sub-agent passes (or rejects) every draft before it reaches
the user — a rejected draft is replaced by a corrected one, and the
rejected draft stays visible in the thread as a transparent record.

The interface is a single-page web app: a chat thread with a sidebar
of past conversations and a composer at the bottom. The page streams
the agent's answer, then its citations, then a verifier verdict, all
in real time.

## Who it is for, right now

A **senior KPMG Crown Dependencies Private Equity partner**. A senior
commercial advisor — not a generalist. Reads *Financial Times*
longform and KPMG thought-leadership decks all day. Values
**operational depth**, **currency**, **practitioner voice**, and
**quiet authority**. Will resent any whiff of "AI demo theatre".

The substance of the product (cited statutes, freshness dates,
verifier verdicts, source-quality discipline) is the differentiation.
The UI's job is to **lift the substance, not perform around it**.

## What the demo needs to do

1. Land on a screen that presents a small set of pre-prepared
   questions the partner can click to drive a streaming answer. The
   curated set is:
   1. UK carried interest reform from 6 April 2026 — Crown
      Dependencies response (frontier)
   2. AIFMD II for Jersey AIFMs marketing into Germany via NPPR
      (frontier)
   3. JPF vs Cayman ELP vs BVI Approved Fund vs Guernsey PIF for an
      emerging PE manager (cross-jurisdictional)
   4. Bermuda SAC vs Cayman SPC vs Guernsey PCC vs Guernsey ICC
      (cross-jurisdictional)
   5. Jersey TopCo above UK Opco — LSE listing, step by step
      (worked transaction)
   6. Italian-domiciled HNW family wealth via Jersey trust
      (worked transaction)
   7. Jersey's strategic trajectory — "how did we get here" (narrative)
2. Stream the answer token-by-token with proper markdown structure
   (h2/h3, lists, bold, italic, code, blockquote, links).
3. Render the citations the agent surfaces — each citation has a
   corpus path, a freshness badge (`fresh` / `warn` / `stale` /
   `missing`), optional per-article pinpoint deep-links, and optional
   linked primary source.
4. Render the verifier verdict — pass / partial / reject with claim
   count and reason list. While the verifier is running, show that
   work is in flight. A reject triggers a *revise*: the rejected
   draft stays in the thread as a rejected card, and a new corrected
   draft begins below.
5. Persist conversations to a sidebar; clicking a sidebar entry
   replays that conversation cleanly.

## Functional contract you must preserve

The streaming + state-management JS that drives the page queries
against specific class names and ids in your markup. If your HTML
keeps the hooks below, the streaming pipeline keeps working without
JS changes. Style and reorganise freely — just don't rename.

| Hook | Role |
|---|---|
| `#transcriptInner` | Container the JS appends messages to |
| `#placeholder` | Landing surface — removed when an enquiry starts, re-attached on "new chat" |
| `#convList` | Sidebar conversation list |
| `#ask` (form) / `#q` (textarea) / `#go` (submit) | Composer |
| `#newChat` | Button to start a new enquiry |
| `.msg.user .bubble` | A user question |
| `.msg.assistant .card` | An assistant draft card |
| `.msg.assistant.drafting / .verified / .rejected / .unavailable` | The four draft states (set as classes on the message root) |
| `.statusbar / .statuslabel` | Status strip on each draft card |
| `.answer` | The streamed markdown body — toggles `.cursor` mid-stream |
| `details.reasoningBox / .reasoning-body` | Optional collapsed agent reasoning |
| `details.toolsBox / .tools / .toolCount` | Optional collapsed tool-call list |
| `.sourcesWrap / .sources / .source` | Citations panel |
| `.pinpoint` | Per-article deep-link chips |
| `.badge.fresh / .warn / .stale / .missing / .status` | Freshness badges |
| `.verdictWrap / .verdict.pass / .warn / .reject / .headline / .stat / .reason / .detail` | Verifier verdict |
| `.pulse` | Indicator while verifier is in flight |
| `.disclaimer` | Card-level fallback disclaimer (hidden when the model emits its own) |
| `.brief-card[data-q]` | Canned-question buttons; click populates the composer and submits |

### The streaming event types you are rendering

The server emits a sequence of JSON events per question. Your design
needs to accommodate all of them visibly:

- `text` — incremental answer tokens; append to `.answer`
- `reasoning` — incremental reasoning text into the (collapsed) reasoning panel
- `tool` — a tool call (name + input); append to the tools list
- `citation` — a corpus source with freshness + optional primary URL + optional pinpoints
- `verify_start` — verifier is running on this draft; show a "checking" affordance
- `verdict` — pass/partial/reject + claim count + reasons; the card's state class flips to `verified` or `rejected`
- `verify_error` → state class flips to `unavailable`
- `revise` — verifier rejected this draft and the agent is producing a new one; the current draft becomes a rejected card and a fresh draft card appears below
- `done` — final canonical answer; the cursor stops blinking; the disclaimer may appear
- `error` — surface an inline error message in the answer body

A single thread can contain multiple drafts (revise loops). The user
sees the rejected draft above the corrected one — this transparency
is a feature, not a bug.

## Why the previous attempt isn't working

The previous version committed hard to a *Paper · Ink · Stamp*
editorial direction — warm-paper background, a serif display face
paired with a small-caps mono, an SVG paper-grain overlay, hairline
rules everywhere, a monogram nameplate, a "Vol. I · No. 001" issue
line, a drop-cap on the intro, four numbered briefing categories,
oxblood verdict stamps, italic decks.

The failure mode: **the chrome performs**. Every surface is
decorated. Mono small-caps stack on hairlines stack on grain stack
on monogram. The frame competes with the answer for attention. It
reads as a costume rather than a working desk. The senior
practitioner is being asked to admire the design before they can get
to the answer.

Your redesign should resolve this. **The answer body, the citations,
and the verifier verdict are the product. The rest should recede.**

## Aesthetic direction — guardrails, not a prescription

You bring the visual language. These are the constraints around it.

**Aim for:**

- *Quiet authority.* The UI trusts the user and trusts the substance.
  Restraint signals confidence.
- *One typographic voice.* One face for prose, one for chrome (or one
  face across optical sizes). Make every type choice carry weight.
- *Generous space.* The transcript is the reading surface; let it
  breathe.
- *Signal hierarchy without colour-panel theatre.* The verifier
  verdict and citation block should be visually scoped to the answer
  they belong to. They should not need bright panels to do it.
- *Restraint in colour.* Near-neutral surface; *one* semantic accent
  reserved for verifier states (and even that should be quiet).

**Avoid:**

- Editorial pastiche — monograms, issue lines, vol-numbers, masthead
  lockups, mock-newspaper typography, drop-caps, italic decks,
  hairlines used decoratively, paper-grain textures, small-caps
  everywhere.
- Generic AI dashboard aesthetics — gradient cards, glass blur,
  purple-on-dark, glowing accents, Inter / Space Grotesk / Manrope,
  rounded everything.
- Coloured "verdict" panels that fight the answer body for attention.
- Anything that reads as a costume.

**Open choices:**

- Light or dark — your call. Both can be made calm.
- Typography — pick what serves quiet authority; avoid over-used
  faces (Inter, Space Grotesk, Manrope, Söhne-imitators).
  Free-licence preferred.
- Layout — sidebar, collapsed sidebar, drawer, or no sidebar.
  Conversation history must be reachable but does not need to be
  always-visible.
- The canned-question surface — must be a clickable affordance on
  the landing screen; the visual treatment is open. A plain list
  works. A 2-column grid works. Categories or no categories — open.
- Whether to introduce an empty/landing illustration or accept that
  the landing is purely typographic — open.

## Hard constraints

- **Two files**: a complete HTML page and (optionally) one external
  CSS file. No build step. No frameworks (React, Vue, Tailwind,
  Bootstrap, etc.). Plain HTML, CSS, ES modules.
- **External CSS is fine**: Google Fonts via `<link>` is fine.
- **The HTML must preserve an inline `<script type="module">`** that
  imports from a sibling `./render.js`. You can leave that script
  block intact; the only constraint is that the page-level
  interactions described in the streaming-event section above all
  still fire.
- **WCAG 2.1 AA**: 4.5:1 contrast for body text, 3:1 for UI controls,
  visible `:focus-visible`, 44×44 minimum touch targets, keyboard
  access to the sidebar conversation rows. The conversation rows
  should be reachable via Tab, openable with Enter or Space.
- **Markdown output to style**: the streaming layer emits semantic
  HTML inside the `.answer` scope: `<h2>`, `<h3>`, `<p>`, `<ul>`,
  `<ol>`, `<li>`, `<code>`, `<pre>`, `<blockquote>`, `<a>`,
  `<strong>`, `<em>`. Style these.
- **Responsive**: must work at 1440 (the demo machine) and degrade
  reasonably at 768 / 375.

## UX copy direction

- The product is **Offshore AI** — drop any "OFFSHORE / AI" two-line
  lockup and any monogram.
- The landing can be unlabelled; if a label helps, something quiet
  like "Suggested questions" is fine.
- Composer placeholder is enough — drop any standalone prompt label
  ("ASK ·" etc.).
- Verifier state strings — sentence case, drop the stamp theatre:
  *Verified* / *Checking citations*… / *Rejected* / *Verifier
  unavailable*.
- A short fallback disclaimer (one sentence) accompanies answers
  when the model has not included its own.

## Deliverables

- A complete HTML page that demonstrates the redesigned UI in its
  landing state, with the canned-question affordances visible, and
  the markup hooks listed above wired in.
- A CSS file (or inline `<style>` block) that styles all the states
  described above: the landing surface; the user question bubble;
  the four assistant draft states (`drafting`, `verified`,
  `rejected`, `unavailable`); citation rows with badges and
  pinpoints; the verifier-running indicator; pass / warn / reject
  verdict panels; the disclaimer; the sidebar list and its empty
  state; the composer.
- A short note (3–5 sentences) describing the design direction and
  the *why*, so a future reader understands the intent.
- A representative "filled" view — a static example of an assistant
  card with a full streamed answer, a citation row or two, and a
  passed verdict — so the layout in flight can be assessed without
  running the streaming server.

## Out of scope

- Backend changes
- New product features
- Marketing copy on the landing
- Mobile-first redesign
- Theming or multiple themes
- Internationalisation
- Custom illustrations or bespoke iconography (icons from a quiet
  free-licence set are acceptable if needed; not encouraged)
