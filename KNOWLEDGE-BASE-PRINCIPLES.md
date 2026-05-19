# Knowledge Base Principles

Region-non-specific principles for the offshoreai corpus. The corpus is a hand-curated, source-cited, agent-readable knowledge base for offshore jurisdictions; each jurisdiction is internally self-contained under `knowledge/<jurisdiction>/` and mirrors the same taxonomy where it makes sense, so an agent answering a cross-jurisdiction comparison question finds parallel files at predictable paths.

These principles are the strategic commitments behind the operational rules in [`CONVENTIONS.md`](CONVENTIONS.md). The principles travel across jurisdictions (currently Jersey, Guernsey, Bermuda, BVI, Cayman, and Isle of Man; Gibraltar, Malta, Mauritius, Singapore-IFC and others to follow) and across consumer agents. For the agent-side counterpart — how agents on top of this corpus are designed — see [`AGENT-PRINCIPLES.md`](AGENT-PRINCIPLES.md).

The structure draws from Karpathy's [*LLM Wiki*](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) sketch and from the load-bearing observation that LLM agents are now the primary readers of reference material in our domain. The corpus is built for them first, for humans second.

---

## Shape & organisation

**1. One concept per file.** A "concept" is something a user might reasonably ask a self-contained question about ("what is this jurisdiction's economic-substance regime?", "how is a foundation different from a trust?"). Files are typically 200-800 lines. If a file starts splitting into clearly separable concepts, split it. This is the unit a retrieval primitive can hand to the agent and have the agent answer from.

**2. Agent-orientation principle: every file readable cold.** A reader arriving cold — an agent that followed a search hit, jumped in via a tag, or was sent here by a cross-link — must be able to make sense of the file without having read the parent index or the parent section. Concept files self-contextualise in the first one or two sentences ("Article 47 of the [jurisdiction] Trusts Law governs the mistake-based set-aside regime, which..."). Index files set the scene with what / why / when / where-to-start, not a flat list of links. *Where you can land determines what the agent can read.*

**3. Heavy cross-linking with meaningful link text.** Every concept that has its own file is linked, every time it's referenced, with link text that tells a cold reader what they will find if they click. `[Article 9](./knowledge/jersey/trusts/firewall.md)` is a footgun; `[the firewall — Article 9 — which makes [jurisdiction] law govern validity of a [jurisdiction] trust and disapplies foreign forced-heirship rules](./knowledge/jersey/trusts/firewall.md)` is what the agent and the human both need.

**4. No duplication. One canonical home per fact.** If a fact appears in two places, one is the canonical home and the other links to it. Keeps updates cheap; keeps citations unambiguous; keeps the agent from picking up two slightly-different versions of the same rule.

---

## Navigation

**5. Tags are the primary navigation layer for an agent; folders are convenience for humans.** The folder tree is convenient when you know which subject you're looking in. An agent searching for cross-cutting material ("firewall AND forced-heirship AND US grantor trust") finds nothing useful by walking folders alone — tags are how related material clusters across folders. Every substantive content file carries 5-10 tags from across the categories of the taxonomy.

**6. The tag taxonomy is closed.** Tags come from the canonical [`TAGS.md`](TAGS.md) list only. Adding a new tag requires editing the taxonomy first, with a one-line description, and applying the tag to obviously-related existing files in the same commit. This is what makes tag-driven retrieval reliable — an agent searching for `firewall` doesn't need to also try `firewall-rule` or `art-9-firewall` to be safe.

**7. Hierarchical structure (section index → topic file → article) is the retrieval primitive.** The corpus is already a tree: `knowledge/` → jurisdiction `index.md` → section `index.md` → topic file → per-article statute-wiki file. This tree is what a PageIndex-style hierarchical retrieval primitive walks. Build the corpus structure as if it will be navigated by reasoning over summaries of nodes — because it will be. Alongside the doctrinal tree, the corpus operates **three further content layers** — cross-jurisdictional synthesis at [`knowledge/CROSS-JURISDICTIONAL-MAP.md`](knowledge/CROSS-JURISDICTIONAL-MAP.md), decay-managed frontier content under `knowledge/frontier/` and `knowledge/<jurisdiction>/frontier/`, and per-jurisdiction history under `knowledge/<jurisdiction>/history/` (see [`AGENTS.md`](AGENTS.md) "The corpus has four layers" for the full description).

---

## Frontmatter & freshness

**8. Every content file carries YAML frontmatter** — title, jurisdiction, category, status, last_verified, tags, sources, see_also, plus statute-specific fields (`articles_covered`) where applicable. Frontmatter is the structured surface the build pipeline indexes, the freshness checker reads, the bundle compiler joins on, and the agent uses to weight authority. Files without frontmatter are invisible to the system.

**9. `last_verified` is the freshness contract between the corpus and the agent.** Every content file is dated; the date represents the last time a human checked it against the cited primary sources. Agents enforce age gates against this date — stale content is refused or warned, never silently served. When primary sources move (a statute is amended, a regulator publishes new guidance), the corresponding files get a re-verification pass and a fresh `last_verified` date. Offshore rules change frequently; a stale file is worse than no file.

**10. Status enum drives readiness; stubs are valid files.** `stub | draft | review | stable`. Stubs are full frontmatter and a one-line description of intended coverage — they declare commitment without committing to content quality. Drafts have content but haven't been source-verified end-to-end. Reviews are verified, waiting on a second pass. Stable files are verified, cross-linked, and considered current as of `last_verified`. Agents treat status as a hard gate (refuse on stub for an answer they're being asked to authoritatively cite) or a soft signal (warn on draft).

---

## Sourcing & trust

**11. Source hierarchy. Cite in this order of preference:** (a) statute / order / regulation, (b) regulator handbooks and codes, (c) government department pages, (d) court judgments, (e) reputable secondary sources (Big-4 tax summaries, established law-firm client briefings) — only where they fill gaps and only marked as secondary. The agent uses the source `kind` field to weight authority when surfacing conflicts.

**12. Every non-obvious claim is cited inline to a primary source.** State the rule, then the source: *"Companies resident in [jurisdiction] are taxed at a standard rate of 0% under Article 123C of the [Income Tax Law][itl]."* The source URL lives in the frontmatter `sources` block; the inline citation uses a reference-style link. This is what makes the corpus citation-mandatory for agents: there is nothing for the agent to cite if the corpus itself doesn't cite anything.

**13. Stale-relative-to-primary-source is a first-class signal.** The corpus tracks its own staleness against the primary sources it cites. When an agent fetches a primary source via its primary-source tool, the tool returns the live content plus the last-modified header; if the corpus file's `last_verified` predates the primary source's last-modified, the agent gets a "corpus is stale relative to primary source" signal and surfaces it to the user. The corpus is not the source of truth for the law; the primary source is. We are the layer that knows which Article to fetch and what it means.

---

## Persona vs doctrinal layers

**14. Concept files answer "what is the rule?"; use-case files answer "what do I do?"** Concept files are doctrinal — authoritative on one concept, citing statute and case law, written in the voice of a treatise. Use-case files are operational — practical on one question, written in the voice of an operator, leaning on the concept files for the underlying rule rather than restating it. An agent answering a use-case question reads the use-case file for the practical answer and follows cross-links into the doctrinal graph for the rule-level authority it needs to cite.

**15. Persona × task pairs become the agent's retrieval contracts (bundles).** Each use-case file is a natural compile target for a bundle — its referenced concept files, statute articles, tags, and freshness windows define what the agent needs to have in context to answer questions of that operator shape. Writing use-case files is the editorial activity that most directly shapes the agent's per-task performance.

---

## Layer separation

**16. Canonical knowledge is read-only to agents.** Agent inferences never become corpus content. The corpus is one-way upstream from the agent. This is the architectural firewall against the reflective-memory failure mode (an agent that stores its own previous conclusions as confirmed facts and quietly poisons future runs). Updates flow through the editorial process — PRs to the repo, explicit `last_verified` dating, changelog entries — never through agent writes.

**17. Per-tenant memory lives separately from canonical knowledge and never gets authoritative weight for legal claims.** Tenant agents accumulate internal precedents, house views, client matters, and recurring context in a separate per-tenant memory store. That memory influences retrieval and framing — it can flag "this firm typically uses Article 9A reserved-powers structures for this client profile" — but it never substitutes for a corpus citation. Every legal / regulatory assertion in a tenant agent's final answer still cites a canonical corpus file.

**18. Editorial process owns the corpus. The corpus is not crowd-sourced from agent runs.** Updates flow through humans editing markdown with explicit dating. Tenant agents do not write to canonical files. Friendly users of an agent who spot an error file a corpus correction request, which goes through the same editorial process — review, source check, `last_verified` bump, changelog entry. The corpus stays a curated, dated, source-cited artefact, not a wiki accumulating drift.

---

## Style discipline that holds the above together

**19. Write for an LLM consumer first, a human consumer second.** Short paragraphs. Lots of headings. Explicit names rather than pronouns. Numbers and dates spelled out ("the standard rate is 0%", not "the standard rate is nil"). State the rule, then the source. Flag uncertainty — say so and link the competing sources rather than presenting a contested point as settled.

**20. No marketing voice.** The corpus is a reference, not a brochure. No "[Jurisdiction] is a world-leading offshore centre for…". The agent must be able to read the corpus and produce a sober legal/regulatory answer, not a service-provider sales pitch.

**21. Multi-jurisdiction parallelism.** All corpus content lives under `knowledge/`; each jurisdiction lives in its own subdirectory under `knowledge/` (e.g. `knowledge/jersey/`, `knowledge/guernsey/`, `knowledge/bermuda/`, `knowledge/bvi/`, `knowledge/cayman/`, `knowledge/isle-of-man/`) and is internally self-contained. Where the same concept exists across jurisdictions (a foundations regime, a CRS implementation, a Royal/Supreme/High Court), mirror the path structure so the agent answering a comparison question finds parallel files at predictable paths (`knowledge/<jurisdiction>/trusts/firewall.md`, `knowledge/<jurisdiction>/tax/economic-substance.md`). This parallelism is what makes cross-jurisdiction agents feasible without a separate harmonisation layer. Cross-jurisdictional synthesis lives at [`knowledge/CROSS-JURISDICTIONAL-MAP.md`](knowledge/CROSS-JURISDICTIONAL-MAP.md).

---

## What this document is *not*

These are strategic commitments behind the corpus. They do not cover:

- **The operational rules for writing files** (frontmatter syntax, filename rules, link style, source citation format) — see [`CONVENTIONS.md`](CONVENTIONS.md).
- **The canonical tag taxonomy** — see [`TAGS.md`](TAGS.md).
- **How agents read and reason over the corpus** — see [`AGENT-PRINCIPLES.md`](AGENT-PRINCIPLES.md).
- **Jurisdiction-specific editorial plans** — see each jurisdiction's `README.md` and `changelog.md`.

When these principles conflict with a downstream operational rule in `CONVENTIONS.md`, the principle is load-bearing and the operational rule should be amended. New principles or amendments require a written rationale and updates to both this document and any downstream docs they change.
