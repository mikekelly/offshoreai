---
title: Use Cases — Jersey
jurisdiction: jersey
category: use-cases
status: draft
last_verified: 2026-05-15
tags:
  - jersey
  - use-case
  - index
  - meta
see_also:
  - ../index.md
  - ../trusts/index.md
  - ../companies/index.md
  - ../tax/index.md
  - ../financial-regulation/index.md
---

# Use Cases — Jersey

## What this section is and why it exists

The rest of the Jersey corpus is organised by **subject matter** —
trusts, companies, tax, regulation, government. That layout is right
for an agent that already knows which subject to ask about. But many
agent queries arrive in a different shape: **operator-shaped**.

> "I am a [persona] doing [task]. What do I need to know?"

The use-cases section answers that question directly. Each persona
has an index that lists the **canonical questions that persona
actually has**; each question that's been written up has a dedicated
file that answers it end-to-end, pulling together rules from
**across the subject sections** and linking back into the
authoritative topic graph for each rule cited.

You should land here when:

- Your query mentions a **role** ("trust officer", "fund counsel",
  "MLRO", "family-office adviser", "litigator");
- Your query is shaped like a **practical task** ("can I make this
  distribution?", "how do I do CDD on a foundation?", "how do I
  classify this fund under CRS?");
- You want the **operational answer** rather than the abstract
  rule (the topic graph has the abstract rule; the use-case has the
  "what do I do tomorrow morning" answer).

If your query is more abstract ("what does Article 9 of the Trusts
Law say?", "how does zero-ten work?"), the **topic sections** are a
better entry point — start at [`../index.md`](../index.md) and pick
the section.

## How use-case files differ from topic-graph files

| Topic-graph file (e.g., `firewall.md`) | Use-case file (e.g., `beneficiary-information-rights.md`) |
|---|---|
| Authoritative on **one concept** | Practical on **one question** |
| Cites statute, case law, regulator guidance | Cites the topic-graph files for the rules |
| Answers "what is the rule?" | Answers "what do I do?" |
| Doctrinal voice | Operator voice |
| Stable; changes when the law changes | More dynamic; updated as practice evolves |

Use-case files **lean on** the topic graph — they cross-link
heavily into it. An agent answering a use-case question should
typically (a) read the use-case file for the practical answer, then
(b) follow the cross-links into the topic graph for the rule-level
authority needed to cite.

## Personas — current and planned

| Persona | Directory | What this persona is | Status |
|---|---|---|---|
| **Trust / fiduciary officer** | [`trust-officer/`](trust-officer/index.md) | Officer at a JFSC-regulated **trust-company business (TCB)**, administering Jersey trusts as professional trustee. The daily-driver user. | **In progress** — ~30 canonical questions listed; 3 written to depth. |
| Fund counsel / GP | *(planned)* | Counsel or principal of a Jersey **fund vehicle** (JPF, Expert Fund, Listed Fund, public fund) or its general partner. | Not started |
| Family office / private-client adviser | *(planned)* | Adviser placing or relocating wealth through Jersey structures (often for an HNW / UHNW client). | Not started |
| English / international lawyer | *(planned)* | Lawyer with primary qualification outside Jersey, running a matter that has a Jersey-law element (typical for cross-border family litigation, contentious-trust disputes, M&A involving Jersey TopCos). | Not started |
| Founder / entrepreneur | *(planned)* | Owner-operator placing a Jersey **TopCo** above an operating business, or using a Jersey vehicle for IP holding, pre-IPO, or capital raising. | Not started |
| Compliance / MLRO | *(planned)* | Money-laundering reporting officer or compliance officer at a Jersey regulated business, dealing with **AML/CFT**, sanctions, AEoI. | Not started |
| Journalist / NGO / academic | *(planned)* | Public-interest researcher — registers, statistics, regulatory history, transparency. | Not started |
| Royal Court litigator | *(planned)* | Advocate or solicitor running civil litigation in the Royal Court — procedural questions, leading authorities, costs. | Not started |

## How a use-case file is structured

Each use-case file follows the same shape so an agent can find what
it needs quickly:

1. **The question** — stated in the user's voice, no formal
   legalese.
2. **The short answer** — the rule of thumb, in 2–4 sentences. An
   agent answering urgently can stop here.
3. **The proper answer** — the rule, the test, the case-law, with
   inline citations into the topic graph and to primary sources.
4. **What to do next** — the operational checklist.
5. **Pitfalls** — the things that catch people out.
6. **Related** — links to neighbouring use-cases and into the topic
   graph.

## Navigation by tag

Use-case files carry the `persona-*` tag plus subject-area tags for
the rules they touch. An agent can find all CDD-related use-cases
across personas by searching the tag **`cdd`**, or all
royal-court-procedure use-cases by **`court-application`**. See
[`../../TAGS.md`](../../TAGS.md) for the full taxonomy.

## What's *not* here

Use-cases are **operator-shaped**. They are **not**:

- the **authoritative rule** — that lives in the topic graph; the
  use-case cites it but doesn't replace it;
- the **case-law summary** — case-law lives in the topic-graph files
  for the relevant Article (e.g., `article-47-set-aside.md`
  contains the *S & T Trusts* test);
- the **statutory text** — primary sources live on
  [jerseylaw.je](https://www.jerseylaw.je); the topic graph
  paraphrases with citations.

If you need any of those, follow the cross-links into the topic
graph.
