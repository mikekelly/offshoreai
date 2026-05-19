// Load eval YAML files. Accepts evals/showcase.yaml and
// evals/coverage-questions.yaml; normalises into EvalQuestion shape.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import type { EvalQuestion } from "./types.js";

interface ShowcaseQuestion {
  id: string;
  category?: string;
  question: string;
  showcase_bar?: Record<string, unknown>;
}

interface CoverageQuestion {
  id: string;
  persona?: string;
  asked_by?: string;
  question: string;
  expected_facts?: string[];
  expected_files?: string[];
  score?: Record<string, unknown>;
}

export async function loadEvalSuite(repoRoot: string, suitePath: string): Promise<ReadonlyArray<EvalQuestion>> {
  const raw = await readFile(resolve(repoRoot, suitePath), "utf8");
  const doc = parseYaml(raw) as { questions?: Array<ShowcaseQuestion | CoverageQuestion> };
  if (!doc.questions || !Array.isArray(doc.questions)) {
    throw new Error(`Eval suite ${suitePath} has no top-level "questions" array.`);
  }
  return doc.questions.map((q) => {
    const isShowcase = "showcase_bar" in q;
    const category = (q as ShowcaseQuestion).category;
    return {
      id: q.id,
      question: q.question,
      ...(category ? { category } : {}),
      rubric: isShowcase
        ? { showcase_bar: (q as ShowcaseQuestion).showcase_bar ?? {} }
        : {
            expected_facts: (q as CoverageQuestion).expected_facts ?? [],
            expected_files: (q as CoverageQuestion).expected_files ?? [],
          },
    };
  });
}
