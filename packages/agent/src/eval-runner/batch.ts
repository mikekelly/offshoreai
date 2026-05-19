// Batch orchestrator: dispatch each question through the named
// harness, grade it, persist answer + trajectory + verdict, write a
// summary.yaml at the end.

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { stringify as yamlStringify } from "yaml";
import { gradeAnswer } from "./grader.js";
import { runHarness } from "./harnesses.js";
import type { EvalQuestion, GraderVerdict, HarnessName, HarnessOutput, Verdict } from "./types.js";

export interface BatchOptions {
  readonly harness: HarnessName;
  readonly questions: ReadonlyArray<EvalQuestion>;
  readonly outputDir: string; // absolute path
  readonly repoRoot: string;
  readonly evalSuite: string;
  readonly tagIndexPath?: string;
  readonly graderModel?: string;
  readonly skipGrader?: boolean;
  /** Run the citation-verifier on each answer before grading. */
  readonly verify?: boolean;
  /** Max concurrent dispatch+grade pipelines within the batch. Default 1 (sequential). */
  readonly concurrency?: number;
}

export interface BatchSummary {
  readonly schemaVersion: "eval_batch_summary_v1";
  readonly run: {
    readonly harness: HarnessName;
    readonly evalSuite: string;
    readonly ranAt: string;
    readonly questions: number;
  };
  readonly totals: { readonly pass: number; readonly partial: number; readonly fail: number };
  readonly dimensionAggregates: {
    readonly citationPrecisionPassRate: number;
    readonly jerseySpecificPassRate: number;
    readonly substancePassRate: number;
    readonly medianToolCalls: number;
    readonly medianTokensInput: number;
    readonly medianTokensOutput: number;
    readonly medianWallClockSeconds: number;
    readonly totalCostUsd: number;
    readonly meanHallucinatedCitationsPerAnswer: number;
  };
  readonly perQuestion: ReadonlyArray<{
    readonly id: string;
    readonly verdict: Verdict;
    readonly summary: string;
  }>;
}

export async function runBatch(opts: BatchOptions): Promise<BatchSummary> {
  await mkdir(opts.outputDir, { recursive: true });

  const concurrency = Math.max(1, opts.concurrency ?? 1);
  const verdicts: GraderVerdict[] = [];
  const outputs: HarnessOutput[] = [];

  // Bounded-parallelism pipeline: a pool of `concurrency` workers
  // each pulls the next question and runs dispatch → optional verify
  // (inside runHarness) → write artefacts → grade → write verdict.
  // Order of completion is non-deterministic; output files are
  // independent so this is safe.
  const queue = opts.questions.slice();
  const workers = Array.from({ length: concurrency }, async (_, workerId) => {
    while (queue.length > 0) {
      const q = queue.shift();
      if (!q) break;
      const tag = concurrency > 1 ? `[${opts.harness}/w${workerId}]` : `[${opts.harness}]`;
      console.log(`${tag} ${q.id}: dispatching...`);
      const output = await runHarness(opts.harness, q, {
        repoRoot: opts.repoRoot,
        ...(opts.tagIndexPath ? { tagIndexPath: opts.tagIndexPath } : {}),
        ...(opts.verify ? { verify: true } : {}),
      });
      outputs.push(output);

      await writeFile(
        resolve(opts.outputDir, `${q.id}.answer.md`),
        output.answer + "\n",
        "utf8",
      );
      await writeFile(
        resolve(opts.outputDir, `${q.id}.trajectory.json`),
        JSON.stringify(buildTrajectoryRecord(opts.evalSuite, output), null, 2) + "\n",
        "utf8",
      );
      if (output.verifierVerdict) {
        await writeFile(
          resolve(opts.outputDir, `${q.id}.verifier.json`),
          JSON.stringify(output.verifierVerdict, null, 2) + "\n",
          "utf8",
        );
        console.log(`${tag} ${q.id}: verifier ${output.verifierVerdict.kind.toUpperCase()} (${output.verifierVerdict.claimsChecked} claims; ${output.verifierVerdict.rejectCount} rejections; \$${output.verifierVerdict.costUsd.toFixed(4)})`);
      }

      if (opts.skipGrader) {
        console.log(`${tag} ${q.id}: dispatched (${output.wallClockSeconds.toFixed(1)}s, ${output.toolCalls.length} tools); grading skipped`);
        continue;
      }

      console.log(`${tag} ${q.id}: grading...`);
      const verdict = await gradeAnswer(q, output, {
        repoRoot: opts.repoRoot,
        ...(opts.graderModel ? { model: opts.graderModel } : {}),
      });
      verdicts.push(verdict);

      await writeFile(
        resolve(opts.outputDir, `${q.id}.verdict.yaml`),
        yamlStringify(verdict),
        "utf8",
      );

      console.log(`${tag} ${q.id}: ${verdict.overall.toUpperCase()} (${verdict.factsCovered}/${verdict.factsExpected} facts; ${verdict.hallucinatedCitations} hallucinated citations)`);
    }
  });

  await Promise.all(workers);

  // Restore deterministic order for summary.perQuestion based on the
  // input question order, since parallel completion shuffles outputs.
  const verdictById = new Map(verdicts.map((v) => [v.questionId, v]));
  const orderedVerdicts: GraderVerdict[] = [];
  for (const q of opts.questions) {
    const v = verdictById.get(q.id);
    if (v) orderedVerdicts.push(v);
  }
  verdicts.length = 0;
  verdicts.push(...orderedVerdicts);

  const summary = aggregate(opts, outputs, verdicts);
  await writeFile(
    resolve(opts.outputDir, "summary.yaml"),
    yamlStringify(summary),
    "utf8",
  );

  console.log(`\n[${opts.harness}] batch complete: ${summary.totals.pass} pass / ${summary.totals.partial} partial / ${summary.totals.fail} fail`);
  console.log(`  median tool calls: ${summary.dimensionAggregates.medianToolCalls}`);
  console.log(`  total cost USD:    ${summary.dimensionAggregates.totalCostUsd.toFixed(4)}`);

  return summary;
}

// ---------------------------------------------------------------------------

function buildTrajectoryRecord(evalSuite: string, output: HarnessOutput) {
  return {
    schemaVersion: "eval_trajectory_v1",
    questionId: output.questionId,
    evalSuite,
    harness: output.harness,
    ranAt: new Date().toISOString(),
    wallClockSeconds: output.wallClockSeconds,
    turns: output.turns,
    toolCalls: output.toolCalls.map((c, i) => ({
      index: i,
      kind: c.name,
      rawName: c.name,
      inputDigest: c.inputDigest,
      inputBytes: c.inputDigest.length,
      resultBytes: 0,
      resultSummary: "",
      isError: c.isError,
      latencyMs: 0,
    })),
    citedPaths: [],
    usage: {
      inputTokens: output.usage.inputTokens,
      outputTokens: output.usage.outputTokens,
      cacheReadTokens: output.usage.cacheReadTokens,
      cacheWriteTokens: output.usage.cacheWriteTokens,
      totalCostUsd: output.costUsd,
    },
    answer: {
      text: output.answer,
      wordCount: output.answer.trim().split(/\s+/).filter(Boolean).length,
    },
    errors: output.error ? [{ where: "dispatch", detail: output.error }] : [],
    meta: { sdkVersion: "0.3.143" },
  };
}

function aggregate(opts: BatchOptions, outputs: HarnessOutput[], verdicts: GraderVerdict[]): BatchSummary {
  const totals = {
    pass: verdicts.filter((v) => v.overall === "pass").length,
    partial: verdicts.filter((v) => v.overall === "partial").length,
    fail: verdicts.filter((v) => v.overall === "fail").length,
  };

  const dimAgg = {
    citationPrecisionPassRate: passRate(verdicts.map((v) => v.dimensions.citationPrecision)),
    jerseySpecificPassRate: passRate(verdicts.map((v) => v.dimensions.jerseySpecific)),
    substancePassRate: passRate(verdicts.map((v) => v.dimensions.substance)),
    medianToolCalls: median(outputs.map((o) => o.toolCalls.length)),
    medianTokensInput: median(outputs.map((o) => o.usage.inputTokens)),
    medianTokensOutput: median(outputs.map((o) => o.usage.outputTokens)),
    medianWallClockSeconds: round2(median(outputs.map((o) => o.wallClockSeconds))),
    totalCostUsd: round4(outputs.reduce((acc, o) => acc + o.costUsd, 0)),
    meanHallucinatedCitationsPerAnswer:
      verdicts.length === 0 ? 0 : round2(verdicts.reduce((acc, v) => acc + v.hallucinatedCitations, 0) / verdicts.length),
  };

  return {
    schemaVersion: "eval_batch_summary_v1",
    run: {
      harness: opts.harness,
      evalSuite: opts.evalSuite,
      ranAt: new Date().toISOString(),
      questions: opts.questions.length,
    },
    totals,
    dimensionAggregates: dimAgg,
    perQuestion: verdicts.map((v) => ({ id: v.questionId, verdict: v.overall, summary: v.summary })),
  };
}

function passRate(scores: ReadonlyArray<"pass" | "partial" | "fail" | "n/a">): number {
  const applicable = scores.filter((s) => s !== "n/a");
  if (applicable.length === 0) return 0;
  return round2(applicable.filter((s) => s === "pass").length / applicable.length);
}

function median(xs: ReadonlyArray<number>): number {
  if (xs.length === 0) return 0;
  const sorted = xs.slice().sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[m - 1]! + sorted[m]!) / 2 : sorted[m]!;
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
