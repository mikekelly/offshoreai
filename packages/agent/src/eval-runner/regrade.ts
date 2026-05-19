// Re-grade just the questions in an existing batch whose verdict
// summary starts with "Grader emitted unparseable" — i.e. parse-failures
// rather than real content fails.
//
// Reads each <id>.answer.md + <id>.trajectory.json + the question from
// the eval suite, runs the grader again, overwrites <id>.verdict.yaml,
// then rebuilds summary.yaml.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import { gradeAnswer } from "./grader.js";
import { loadEvalSuite } from "./load-eval.js";
import type { EvalQuestion, GraderVerdict, HarnessName, HarnessOutput, Verdict } from "./types.js";

export interface RegradeOptions {
  readonly outputDir: string;
  readonly repoRoot: string;
  readonly evalSuite: string;
  readonly graderModel?: string;
}

export async function regradeParseFailures(opts: RegradeOptions): Promise<void> {
  const questions = await loadEvalSuite(opts.repoRoot, opts.evalSuite);
  const qById = new Map<string, EvalQuestion>(questions.map((q) => [q.id, q]));

  const entries = await readdir(opts.outputDir);
  const verdictFiles = entries.filter((e) => e.endsWith(".verdict.yaml"));

  const candidates: Array<{ id: string; verdictPath: string }> = [];
  for (const vfile of verdictFiles) {
    const id = vfile.replace(".verdict.yaml", "");
    const verdictPath = resolve(opts.outputDir, vfile);
    const text = await readFile(verdictPath, "utf8");
    if (/Grader emitted unparseable/.test(text)) {
      candidates.push({ id, verdictPath });
    }
  }

  if (candidates.length === 0) {
    console.log("No parse-fail verdicts found in this batch.");
    return;
  }

  console.log(`Re-grading ${candidates.length} parse-failed question(s)...`);

  // Read summary.yaml to discover the harness — needed for the grader's
  // contextual notes about which harness produced the answer.
  const summaryPath = resolve(opts.outputDir, "summary.yaml");
  const summaryDoc = yamlParse(await readFile(summaryPath, "utf8")) as {
    run: { harness: HarnessName; questions: number };
    perQuestion: Array<{ id: string; verdict: Verdict; summary: string }>;
  };
  const harness = summaryDoc.run.harness;

  for (const { id, verdictPath } of candidates) {
    const question = qById.get(id);
    if (!question) {
      console.error(`  [${id}] skipped — id not found in ${opts.evalSuite}`);
      continue;
    }
    const answerPath = resolve(opts.outputDir, `${id}.answer.md`);
    const trajPath = resolve(opts.outputDir, `${id}.trajectory.json`);
    const answer = await readFile(answerPath, "utf8");
    const trajectory = JSON.parse(await readFile(trajPath, "utf8")) as {
      turns: number;
      wallClockSeconds: number;
      toolCalls: Array<{ rawName: string; inputDigest: string; isError: boolean }>;
      usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number };
    };
    const usageCost = trajectory.usage as unknown as { totalCostUsd?: number };

    const harnessOutput: HarnessOutput = {
      questionId: id,
      harness,
      answer,
      turns: trajectory.turns,
      wallClockSeconds: trajectory.wallClockSeconds,
      toolCalls: trajectory.toolCalls.map((c) => ({
        name: c.rawName,
        inputDigest: c.inputDigest,
        isError: c.isError,
      })),
      usage: {
        inputTokens: trajectory.usage.inputTokens,
        outputTokens: trajectory.usage.outputTokens,
        cacheReadTokens: trajectory.usage.cacheReadTokens,
        cacheWriteTokens: trajectory.usage.cacheWriteTokens,
      },
      costUsd: usageCost.totalCostUsd ?? 0,
    };

    console.log(`  [${id}] re-grading...`);
    const verdict: GraderVerdict = await gradeAnswer(question, harnessOutput, {
      repoRoot: opts.repoRoot,
      ...(opts.graderModel ? { model: opts.graderModel } : {}),
    });
    await writeFile(verdictPath, yamlStringify(verdict), "utf8");
    console.log(`  [${id}] ${verdict.overall.toUpperCase()} (${verdict.factsCovered}/${verdict.factsExpected} facts; ${verdict.hallucinatedCitations} hallucinated)`);
  }

  // Rebuild summary.yaml's totals and perQuestion lines.
  const newPerQuestion = await Promise.all(
    summaryDoc.perQuestion.map(async (entry) => {
      const verdictPath = resolve(opts.outputDir, `${entry.id}.verdict.yaml`);
      const v = yamlParse(await readFile(verdictPath, "utf8")) as GraderVerdict;
      return { id: v.questionId, verdict: v.overall, summary: v.summary };
    }),
  );
  const totals = {
    pass: newPerQuestion.filter((e) => e.verdict === "pass").length,
    partial: newPerQuestion.filter((e) => e.verdict === "partial").length,
    fail: newPerQuestion.filter((e) => e.verdict === "fail").length,
  };
  const newSummary = { ...summaryDoc, totals, perQuestion: newPerQuestion };
  await writeFile(summaryPath, yamlStringify(newSummary), "utf8");
  console.log(`\nSummary updated: ${totals.pass} pass / ${totals.partial} partial / ${totals.fail} fail`);
}
