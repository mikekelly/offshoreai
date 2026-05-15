# Offshore AI

A research-grade, agent-readable knowledge base for **offshore jurisdictions** —
small jurisdictions with their own legal systems, financial regulators, tax
regimes, and corporate vehicles. The knowledge base is consumed by an LLM
agent that answers questions and produces analysis for paying users (lawyers,
trust officers, fund managers, founders, family-office staff, journalists).

Coverage starts with **Jersey** (Channel Islands) and will expand to other
jurisdictions over time (Guernsey, Isle of Man, BVI, Cayman, Bermuda, Gibraltar,
Malta, Mauritius, Singapore-as-IFC, etc.). Each jurisdiction lives in its own
top-level directory and is internally self-contained, with cross-jurisdiction
links where appropriate.

---

## Why a knowledge base, and not just retrieval against the web?

General web search and RAG over arbitrary PDFs gives shallow, often wrong
answers on offshore law and tax. The corpus is full of marketing copy from
service providers that misstates the law, blog posts that are years out of
date, and primary sources written in dense legislative prose. We want an
agent that:

- distinguishes between **primary law** (statute, regulation, case law),
  **regulator guidance**, and **secondary commentary**, and weighs them
  accordingly;
- knows the **current** state of the law and flags where it has changed;
- can answer questions that require **stitching across topics** (e.g. "can a
  Jersey foundation hold a UK property without triggering Jersey economic
  substance?");
- cites its sources and gives the user something they can verify themselves.

That requires a curated, structured, dated, and cross-linked corpus — not a
pile of scraped HTML. This repo is that corpus.

---

## The LLM Wiki approach

We follow the structure sketched by Andrej Karpathy in
[*LLM Wiki*](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f):
markdown organised as a **graph**, optimised for LLM consumption rather than
human browsing.

The shape:

- **One concept per file.** Files are small and focused (typically 200–800
  lines). The agent should be able to load any single file and have a
  complete, self-contained answer on that concept, with links to related
  concepts for deeper reading.
- **A central entry point per jurisdiction** (`<jurisdiction>/index.md`) that
  branches out to the major sections. Each section has its own `index.md`
  that branches further. The agent traverses this graph the same way a
  researcher would — entry → section → topic → detail.
- **Heavy cross-linking.** Every concept that has its own file is linked,
  every time it is referenced. Backlinks emerge naturally from this.
- **No duplication.** If a fact appears in two places, one is the canonical
  home and the other links to it. This keeps updates cheap.
- **Sources are first-class.** Every non-obvious claim is cited inline to a
  primary source (legislation, regulator publication, official government
  page). A jurisdiction-level `sources.md` lists the canonical source roots.
- **Dated.** Every file's frontmatter carries a `last_verified` date.
  Offshore rules change — substance rules, beneficial-ownership registers,
  CRS, sanctions — and a stale file is worse than no file.

---

## Repository layout

```
offshoreai/
├── README.md                  ← you are here
├── CONVENTIONS.md             ← file conventions, frontmatter spec, link style
├── jersey/
│   ├── README.md              ← Jersey build plan (human-readable)
│   ├── index.md               ← LLM entry point for Jersey
│   ├── glossary.md
│   ├── sources.md
│   ├── changelog.md
│   ├── government/
│   ├── legal-system/
│   ├── financial-regulation/
│   ├── tax/
│   ├── companies/
│   ├── trusts/
│   ├── foundations/
│   ├── funds/
│   ├── banking/
│   ├── insurance/
│   ├── immigration-residency/
│   ├── aml-cft/
│   ├── international/
│   └── registries/
└── <future-jurisdictions>/
```

Each jurisdiction mirrors the same top-level taxonomy where it makes sense,
which means an agent answering a comparison question
("trust law in Jersey vs Guernsey") finds parallel files at predictable paths.

---

## File conventions

See [CONVENTIONS.md](CONVENTIONS.md) for the full spec. Summary:

**Frontmatter** (YAML) on every content file:

```yaml
---
title: Zero-Ten Corporate Income Tax
jurisdiction: jersey
category: tax
status: stable          # stub | draft | review | stable
last_verified: 2026-05-14
sources:
  - title: Income Tax (Jersey) Law 1961
    url: https://www.jerseylaw.je/laws/current/l_29_1961
    accessed: 2026-05-14
  - title: Revenue Jersey — Company tax information
    url: https://www.gov.je/TaxesMoney/IncomeTax/Companies/Pages/default.aspx
    accessed: 2026-05-14
see_also:
  - ../companies/economic-substance.md
  - ./international-tax.md
---
```

**Link style.** Always use relative paths (`../tax/gst.md`), never bare titles.
Anchor links target stable section headings.

**Source hierarchy.** Cite in this order of preference:
1. Statute / order / regulation (jerseylaw.je for Jersey)
2. Regulator handbooks and codes (e.g. JFSC handbooks)
3. Government pages on gov.je (Revenue Jersey, Customs, etc.)
4. Court judgments (jerseylaw.je judgments database)
5. Reputable secondary sources (Big-4 country tax summaries, established
   law-firm client briefings) — only where they fill gaps and only with a
   note that they are secondary.

**Currency.** If a file describes a rule that is time-bound (e.g. a Budget
measure for a particular year), say so explicitly in the prose, not just in
the frontmatter.

---

## Status

This is an actively built knowledge base, not a finished product. File
statuses:

- `stub` — frontmatter and headings only, no real content.
- `draft` — content written but not source-verified end-to-end.
- `review` — verified but waiting for a second pass.
- `stable` — verified, cross-linked, and considered current as of
  `last_verified`.

A jurisdiction's `changelog.md` records what has been added or re-verified.

---

## Disclaimer

This repository is a research and reference resource. It is **not legal,
tax, or investment advice**. Offshore jurisdictions update their statutes
and regulator guidance frequently; even a `stable` file can be wrong by the
time you read it. Verify against primary sources before acting.
