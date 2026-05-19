// Eval-runner shared types.

export type HarnessName = "offshoreai-agent" | "claude-p" | "explore-subagent";

export interface EvalQuestion {
  readonly id: string;
  readonly question: string;
  readonly category?: string;
  /** Raw rubric block (showcase_bar or expected_facts/expected_files) — passed to the grader verbatim. */
  readonly rubric: Record<string, unknown>;
}

export interface HarnessOutput {
  readonly questionId: string;
  readonly harness: HarnessName;
  readonly answer: string;
  readonly turns: number;
  readonly wallClockSeconds: number;
  readonly toolCalls: ReadonlyArray<{
    readonly name: string;
    readonly inputDigest: string;
    readonly isError: boolean;
  }>;
  readonly usage: {
    readonly inputTokens: number;
    readonly outputTokens: number;
    readonly cacheReadTokens: number;
    readonly cacheWriteTokens: number;
  };
  readonly costUsd: number;
  readonly error?: string;
}

export type Verdict = "pass" | "partial" | "fail";

export type DimensionScore = "pass" | "partial" | "fail" | "n/a";

export interface GraderVerdict {
  readonly questionId: string;
  readonly harness: HarnessName;
  readonly overall: Verdict;
  readonly dimensions: {
    readonly substance: DimensionScore;
    readonly jerseySpecific: DimensionScore;
    readonly citationPrecision: DimensionScore;
    readonly citationRecall: DimensionScore;
    readonly freshnessHandling: DimensionScore;
    readonly voice: DimensionScore;
  };
  readonly factsCovered: number;
  readonly factsExpected: number;
  readonly citationsTotal: number;
  readonly hallucinatedCitations: number;
  readonly summary: string;
}
