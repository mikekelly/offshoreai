# Demo-Readiness Assessment — 2026-05-26

Cross-references the 2026-05-26 showcase batch result against the
[`DEMO-CHEAT-SHEET-KPMG-PE-PARTNER.md`](../../../DEMO-CHEAT-SHEET-KPMG-PE-PARTNER.md)
demo plan. Tells you which lead-with questions still demonstrate
at the bar the cheat sheet promises, and which need attention
before showing to a senior commercial advisor.

## Headline

**22/28 showcase questions PASS (79%). 0 FAIL.** Zero
hallucinated citations across all 28 answers. The corpus is
broadly demo-ready, with **two specific risks** worth addressing
before a high-stakes demo.

## Lead-with questions — readiness map

The cheat sheet's "What to lead with — questions the corpus
answers strongly" maps to specific showcase IDs. Status now:

| Demo block | Question ID | Result | Demo-ready? |
|---|---|---|---|
| Frontier (5 min) | `show-uk-carry-reform` | **PASS** 7/7 | ✅ |
| Frontier (5 min) | `show-continuation-funds` | **PARTIAL** 3/6 | ⚠️ **REGRESSION** |
| Frontier (5 min) | `show-aifmd-ii` | **PASS** 5/6 | ✅ |
| Cross-jurisdictional | `show-fund-routes` | **PASS** 5/5 | ✅ |
| Cross-jurisdictional | `show-bermuda-captive` | **PASS** 5/5 | ✅ |
| Cross-jurisdictional | `show-cell-companies` | **PASS** 5/5 | ✅ |
| Cross-jurisdictional | `show-iom-portfolio-bond` | **PASS** 4/4 | ⚠️ Citation-recall soft |
| Cross-jurisdictional | `show-image-rights` | **PASS** 5/5 | ✅ |
| Sophisticated structural | `show-article-47` | **PASS** 6/6 | ✅ Strong |
| Sophisticated structural | `show-trusts-firewall` | **PARTIAL** 4/5 | ⚠️ **REGRESSION** |
| Sophisticated structural | `show-trusts-comparison` | **PASS** 4/4 | ✅ |
| Worked examples | `show-worked-topco-listing` | **PASS** 8/8 | ✅ |
| Worked examples | `show-worked-family-wealth` | **PASS** 6/7 | ✅ |

## Two regressions worth fixing before demo

### 1. `show-trusts-firewall` — citation-recall regression

**The risk for demo:** This is the corpus's flagship trust
content. The KPMG partner will probe it — it's the "ironclad
Article 9" pitch. The substance still holds (4/5 Article 9
mechanics, foreign-law-term examples like *réserve héréditaire*,
freshness discipline), but the agent cited **1 file** vs the
prior baseline's **6**. The "visibly traversed the graph" demo
bar is weaker — and the missed anti-suit-injunctions fact + the
Crociani case (which is *in* the cited file's body, just not
surfaced) take the answer from "comprehensive" to "narrow".

**Likely cause:** the retrieval-path discipline introduced today
(whole-file reads after one good landing) may be over-suppressing
follow-on reads on this question type, where the corpus has
multiple complementary files (`firewall.md`,
`article-9-reserved-powers.md`, the case-law files) all worth
surfacing.

**Pre-demo fix:** investigate why the retrieval stops at one file
on this question class. Likely either a system-prompt nudge ("for
flagship-topic questions, after the canonical file, also read the
case-law files cited in its frontmatter") or a stronger
cross-reference in `firewall.md` that names the cases inline
rather than only in the body.

### 2. `show-continuation-funds` — substance regression

**The risk for demo:** Continuation funds + GP-led secondaries
is exactly the "of-the-moment frontier" the cheat sheet leads
with — the partner is here specifically because they want to see
this content. The candidate landed the headline market data and
PIF treatment but **missed the mechanics walkthrough** that the
cited frontier file contains: multi-asset / strip-sale /
tender-offer mechanics, carry crystallisation, fairness opinions
/ conflicts-of-interest committees / LPAC.

**Likely cause:** same as above — retrieval stopped at the
landing file's surface without descending into its detailed
sections.

**Pre-demo fix:** strengthen the frontier file's TL;DR / opening
section to surface the mechanics as a numbered list, so an agent
reading the first chunk extracts the full operational
substance.

## Soft signals worth noting

- **`show-iom-portfolio-bond` citation recall**: cited 1 file vs
  baseline 4. Substance still 4/4 PASS, but the demo-friendly
  "graph visible" property weakened. Same pattern as
  trusts-firewall.

- **`show-aifmd-nppr` partial** (3/5): unchanged from May 19.
  Article 42 + AIF (Jersey) Regulations 2012 not surfaced. Both
  in cited file frontmatter / body but the agent doesn't promote
  them. If the demo plan to lead with NPPR depth, this is worth
  a corpus-content tweak (more prominent Article 42 named in the
  opening paragraph of `aifmd-nppr.md`).

- **`show-eviction` partial**: missed the 2025 Amendment Law.
  Resident-facing content has grown since May 19; this is one
  example of an answer that didn't reach the newer content.

- **`show-friday-passing` voice slip**: "Let me search..."
  planning fragment leaked into the answer. First time we've seen
  this pattern in production output. Worth investigating once.

- **Two rubric staleness flags** from graders:
  - `show-listing-vehicle`: rubric still says "BVI no equivalent
    yet" — outdated; BVI MTT 2025 now in corpus.
  - `show-pillar-two`: rubric says "MCIT Law 2025"; corpus says
    "2024" (with 1 January 2025 effective date). Worth one human
    check on which is the enacted year.

## Compared to 2026-05-19 baseline (the 14 questions that ran then)

Same 14 questions, then vs now:

| | 2026-05-19 | 2026-05-26 |
|---|---|---|
| PASS | 11 | 12 |
| PARTIAL | 3 | 2 |
| FAIL | 0 | 0 |

Net within those 14: +1 PASS. Three crossovers:
- `show-eviction` went PASS → PARTIAL (missed amendment).
- `show-trusts-firewall` went PASS → PARTIAL (citation-recall).
- `show-aifmd-nppr` stayed PARTIAL (same blemish — not a
  regression nor a fix).
- `show-voisinage` was PARTIAL → PARTIAL (different miss; not a
  regression).
- `show-friday-passing` was PARTIAL → PARTIAL (different misses).
- Of the originally PARTIAL questions, none flipped to PASS.

**Demo-impact net:** roughly steady. The shape of the suite has
expanded (14 → 28 questions); the new questions added since May
19 (continuation funds, AIFMD II, fund-routes, captives, listing
vehicle, worked-topco/family-wealth, …) introduce material the
cheat sheet relies on for the "demonstrate currency" and
"demonstrate depth" demo segments.

## Recommended demo prep priority

1. **Land the two regression fixes** (trusts-firewall retrieval
   depth + continuation-funds mechanics surfacing). These are
   demo-blocking-quality issues, not demo-killers — but worth
   fixing for confidence.
2. **Refresh the rubric** on `show-listing-vehicle` (BVI MTT
   2025) and `show-pillar-two` (MCIT Law year). 10 min editorial.
3. **Update the cheat-sheet** with current scores — section
   "Showcase question ..., PASS" lines need re-anchoring against
   today's results. The cheat-sheet's 11/14 PASS framing is
   superseded.
4. **Practice run** — read 3–5 candidate answers out loud to
   surface any voice slips like the show-friday-passing
   incident. If reproducible, investigate once.

Time estimate to fully demo-ready: ~2–4 hours of focused work.
