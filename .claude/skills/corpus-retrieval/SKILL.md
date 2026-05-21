---
name: corpus-retrieval
description: |
  The step-by-step retrieval workflow for answering a substantive
  offshoreai corpus question: how to search (parallel tag lookups first),
  when to fall back to grep, how to read a grep hit, and how much of a
  cluster to read. Load this at the start of the retrieval phase of any
  question that needs corpus evidence — i.e. almost every legal /
  regulatory / tax question. Skip it only for pure meta or clarifying
  questions that touch no corpus content.
---

# Corpus retrieval — numbered workflow

Follow these steps in order. For a multi-part or comparative question,
sketch the steps you'll take as a short task list first, then work them;
for a narrow single-fact question, steps 1–2 usually suffice.

1. **Comparative question? Read the synthesis surface first.** If the
   question is "X vs Y" across jurisdictions or vehicles, read
   `knowledge/CROSS-JURISDICTIONAL-MAP.md` before per-jurisdiction
   searches — it has the comparison matrices and decision frameworks. Do
   not try to assemble a comparison from tag-by-tag retrieval.

2. **Search by tag — in parallel.** Fire all `findByTag` calls for every
   facet of the question in a single turn (a comparison, a
   statute+regulation question, a multi-jurisdiction query). Parallel
   calls are supported and roughly halve wall-clock on multi-tag
   questions. Then read the top hits with `getFile` / `getArticle`.

3. **No tag hits? Grep — do not assume silence.** `findByTag` indexes
   primary-subject files; it misses facts that appear *incidentally* in a
   file whose core topic is something else (a lease file mentioning the
   Friday-afternoon Royal Court passing; a road-traffic file mentioning a
   sentencing detail). When `findByTag` returns nothing and `mode="or"`
   also fails, run:

   ```
   Grep "key term" knowledge/<jurisdiction>/ --include="*.md" -rl
   ```

   A tag miss is a *vocabulary* gap, not a *corpus* gap. Only assert "the
   corpus does not cover this" after a grep sweep comes back empty.

4. **A grep hit is a pointer, not a citation.** A bare `grep -n` shows one
   line; the fact you need is often in the lines *around* it. Before
   citing any file you found by grep, read its surrounding context
   (`Grep -n -C 3 "term" path`, or open it at that line). Citing from the
   one-line snippet is how you miss the adjacent fact and under-cite a
   file you correctly found.

5. **Read the on-topic siblings on a multi-part question.** Corpus content
   is one-concept-per-file, so your landing file is usually one of a
   cluster — a worked example beside its explainer and mechanics files in
   the same `use-cases/<persona>/` folder; a topic file beside related
   concepts in a section. For a multi-part / worked-example / "what do I
   need to know about X" question, list the cluster
   (`Glob knowledge/<jurisdiction>/<section>/*.md`, or scan the
   section / `findByTag` results in hand) and read the two or three
   on-topic siblings before answering. Two or three on-topic siblings
   beats one file read in full. (A narrow single-fact question needs only
   the one file.)

6. **Before you answer**, confirm each claim you'll make traces to a file
   you actually read, and apply the resident citation / freshness / status
   discipline. If a cited file is `draft`/`stub` or stale, flag it.
