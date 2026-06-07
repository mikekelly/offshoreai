---
# Design tokens — the normative WHAT.
#
# Transcribed verbatim from the de-facto system already in code:
# packages/web/public/index.html, :root block (~lines 16-40). These are
# the live values; this front-matter is the source-of-truth for them, not
# a fresh invention. If the CSS and this block diverge, the CSS is the bug
# or this is stale — reconcile, don't fork.

colors:
  # 8-step ink ramp — darkest text to faintest hairline/decoration.
  ink:          "#141414"   # --ink        primary text, focus ring, selection bg
  ink-2:        "#2c2c2a"   # --ink-2      body copy, answer body, verdict headline
  ink-3:        "#5a5955"   # --ink-3      secondary text, source pinpoints
  ink-mute:     "#82817b"   # --ink-mute   muted meta, provenance, stat lines
  ink-faint:    "#b0aea8"   # --ink-faint  faintest — dot separators, neutral state dot
  # Background / border ramp — warm off-white paper, not cold #fff.
  bg:           "#fafaf8"   # --bg         page surface
  bg-inset:     "#f3f2ee"   # --bg-inset   inline code background, inset panels
  bg-soft:      "#f6f5f1"   # --bg-soft    soft fill
  border:       "#e6e4df"   # --border     standard hairline
  border-soft:  "#efedea"   # --border-soft softer hairline
  # Four semantic state accents — verifier states ONLY. Used as a small
  # coloured dot and inline text colour. Never a panel, never a fill.
  c-pass:       "#1f7a4d"   # --c-pass     fresh / verified (muted green)
  c-warn:       "#a8650f"   # --c-warn     caution / ageing (amber)
  c-reject:     "#b13a3a"   # --c-reject   stale / failed (muted red)
  c-missing:    "#8a4a78"   # --c-missing  not in corpus / unknown (plum)

typography:
  # One typographic voice. Native system sans for all prose.
  sans: >-
    -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif
  # Monospace is reserved — file paths, source pinpoints, provenance
  # paths, inline code. Never body prose.
  mono: >-
    ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace
  base-size: "15px"          # body
  answer-size: "15.5px"      # answer body (slightly larger — it does the work)
  line-height: "1.55"        # body
  meta-size: "11px–13.5px"   # provenance / pinpoints / verdict / badges (small)

spacing:
  # No formal numeric scale is encoded in :root; spacing is applied
  # ad hoc per component. The load-bearing rule is generous whitespace
  # and an uncluttered surface, not a token grid. Capture a scale here
  # only if/when one is actually introduced in the CSS.

radius:
  focus: "2px"               # :focus-visible outline-offset / radius
  dot:   "50%"               # verifier dot (7px circle)
  # Components otherwise sit near-square; no global radius token.

motion:
  ease: "cubic-bezier(0.2, 0.7, 0.2, 1)"   # --ease, the single shared curve
  # Subtle and purposeful only. Motion is never decorative.
---

# Design System — Offshore AI web UI

The design source-of-truth for the answering-agent web surface (the
"editorial Briefings Desk" UI in
[`packages/web`](../../packages/web/README.md)). Tokens are in the
front-matter above (the normative *what*); the rationale below is the
*why* — the judgement calls tokens cannot encode.

This doc **traces up to [`PERSONAS.md`](./PERSONAS.md)**. Every restraint
here serves users who are *sceptical of hype and quietly impressed by
precision*. The system is not a style preference; it is the visual
discharge of those personas' one shared need — **answers they can verify,
limits they can see** — so the interface earns trust by recession rather
than persuasion.

The values are **transcribed from code, not designed fresh.** They already
live as CSS custom properties in
[`packages/web/public/index.html`](../../packages/web/public/index.html)
(`:root`, ~lines 16-40). The guiding intent is stated in a comment at the
top of that file (~lines 8-14):

> OFFSHORE AI — quiet substance. One typographic voice (system-ui).
> Monospace only for file paths. Verifier states use a single coloured
> dot, not a panel. The chrome recedes; the answer body is the surface
> that does the work.

That comment is the design thesis. Everything below elaborates it.

## Overview

The product is an agentic assistant for the offshore Crown Dependencies
whose credibility rests on cited, dated sources and on admitting where it
stops. The UI is the frame around that substance. The design intent, in
one sentence: **the chrome recedes so the answer body — and the evidence
under it — is the surface that does the work.**

## Colors

A warm, sober, near-monochrome palette. The base is a **warm off-white
paper** (`--bg #fafaf8`), deliberately not cold `#fff` — it reads as
considered and expensive rather than clinical. Text sits on an
**8-step ink ramp** from near-black (`--ink #141414`) down to a faint
hairline grey (`--ink-faint #b0aea8`), giving fine-grained typographic
hierarchy without a single coloured heading.

Colour is **rationed**. There are exactly **four semantic accents**, and
they exist *only* for verifier state: pass (muted green `#1f7a4d`), warn
(amber `#a8650f`), reject (muted red `#b13a3a`), missing (plum `#8a4a78`).
These are the only saturated colours in the system, and they appear at the
smallest possible scale — a 7px dot or a single line of inline text. This
is the deliberate inverse of the "generic tech-startup gradient-purple"
look the brief bans outright. One disciplined palette; one considered
accent role; nothing else.

Why this serves the personas: a sceptical senior partner reads restraint
as seriousness. Saturated chrome would signal *startup*; the muted paper-
and-ink palette signals *specialist professional firm crossed with a
well-made product*.

## Typography

**One typographic voice.** All prose is the native system sans stack
(`--sans`), at 15px body / 15.5px for the answer body (the answer is set
slightly larger because it is the surface that does the work). Hierarchy
is built from the ink ramp and weight, not from typeface switching or
colour.

**Monospace is reserved, not stylistic.** `--mono` appears *only* where a
literal machine string must be read precisely: file paths, source
pinpoints, provenance paths, and inline code (see
[`index.html`](../../packages/web/public/index.html) `.source .pinpoint`,
`.source .provpath`, `.answer code`). Using mono for prose, labels, or
decoration is off-system — it dilutes the one signal mono is supposed to
carry: *this is a verifiable artifact you can open*. Typography does most
of the work; let it.

## States — the verifier signal

The single most load-bearing interaction decision in the system, and the
one most directly traceable to [`PERSONAS.md`](./PERSONAS.md) (the MLRO and
trust-officer need to *see* freshness and sourcing): **a verifier state is
a single small coloured dot and an inline text colour — never a panel,
banner, or filled box.**

- The four states map one-to-one to the four accent tokens: fresh →
  `--c-pass`, warn → `--c-warn`, stale → `--c-reject`, missing →
  `--c-missing` (see `.badge.*` ~lines 462-466).
- The verdict line is a 7px circle plus a short headline; its default
  (neutral) dot is `--ink-faint`, colouring up only when a verdict applies
  (see `.verdict .headline::before` and `.verdict.pass/.warn/.reject`
  ~lines 477-504).
- Badges separate with a faint middle-dot (`·` in `--ink-faint`), not
  borders or pills (`.badge::before` ~lines 467-472).

The freshness/sourcing signal is therefore *present and legible* without
ever shouting. A coloured panel would pull rank over the answer; a quiet
dot informs without dominating. This is "the chrome recedes" made
concrete, and it is how the product shows "it knows where it stops"
without a disclaimer banner.

## Layout

Generous whitespace; an uncluttered, reading-first surface. The assistant
message strips its own chrome — the assistant card has transparent
background, no border, no padding (`.msg.assistant .card` ~lines 254-258)
— and the redundant status bar is suppressed and folded into the verdict
line instead (`.msg.assistant .statusbar { display: none }` ~lines
260-262). The effect: the answer body and its sources sit directly on the
paper, with nothing competing for attention. Focus states are honoured
(2px `--ink` outline, 2px offset) for accessibility, consistent with the
brief's WCAG-conscious requirement.

## Motion

One shared easing curve (`--ease`, `cubic-bezier(0.2, 0.7, 0.2, 1)`).
Motion is subtle and purposeful or absent — never decorative for its own
sake. The same restraint principle: an interface that animates to impress
undermines the audience it is trying to convince.

## Do's and Don'ts

**Do**
- Build hierarchy from the ink ramp and weight — eight greys are plenty.
- Keep the answer body and its cited sources the visual focus; let chrome
  recede.
- Use the four accents *only* for verifier state, at dot/inline-text
  scale.
- Reserve monospace strictly for paths, pinpoints, provenance, and code.
- Keep whitespace generous and the surface calm.

**Don't**
- Don't introduce a fifth accent, a gradient, or any saturated brand
  colour. The palette is closed (mirror of the closed-taxonomy discipline
  the corpus uses for tags).
- Don't render a verifier state as a panel, banner, pill, or filled box —
  it is a dot and a colour, full stop.
- Don't set prose, labels, or buttons in monospace.
- Don't add a second typeface or a coloured heading style.
- Don't add decorative motion.
- Don't reach for the generic tech-startup aesthetic the
  [brief](./PERSONAS.md) and the personas explicitly reject — when a
  choice is between impressive and credible, choose credible.

## Provenance

This system was de-facto established in code before it was written down.
If you change a token, change it in
[`packages/web/public/index.html`](../../packages/web/public/index.html)
*and* here in the same commit — the CSS is where it runs, this doc is
where it is decided and explained.

This system is rendered in the **lookbook** at
[`lookbook/index.html`](./lookbook/index.html) — every discrete UI state
(verdict pass/warn/reject, the four freshness badges, disclosures, the
reject-and-revise flow, message variants, landing cards, composer) mounted
against the *live* app CSS so it can't drift, with no API call required. A
dependency-light live-refresh server gives that lookbook (and any static
design/marketing artifact) an instant edit→see loop — see
[`lookbook/README.md`](./lookbook/README.md); run
`pnpm --filter @offshoreai/web lookbook`.
