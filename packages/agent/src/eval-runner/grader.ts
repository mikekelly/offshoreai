// LLM-as-judge grader. Wraps the Opus 4.7 sub-agent defined by
// prompts/eval/grader.md.
//
// Implementation: a separate query() with the grader prompt as system
// prompt + Read/Grep tools so it can verify citations against the
// actual corpus files. Returns the structured verdict.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { stringify as yamlStringify } from "yaml";
import { query } from "@anthropic-ai/claude-agent-sdk";
import type { DimensionScore, EvalQuestion, GraderVerdict, HarnessOutput, Verdict } from "./types.js";

const GRADER_PROMPT_PATH = "prompts/eval/grader.md";

export interface GraderOptions {
  readonly repoRoot: string;
  readonly model?: string;
  readonly maxTurns?: number;
}

export async function gradeAnswer(
  question: EvalQuestion,
  harnessOutput: HarnessOutput,
  opts: GraderOptions,
): Promise<GraderVerdict> {
  if (harnessOutput.error) {
    // Don't waste a grader call on a dispatch error.
    return failVerdict(question.id, harnessOutput.harness, `Harness dispatched but errored: ${harnessOutput.error}`);
  }

  const systemPrompt = await readFile(resolve(opts.repoRoot, GRADER_PROMPT_PATH), "utf8");

  const userPrompt = `Grade the following candidate answer.

# Question

id: ${question.id}
harness: ${harnessOutput.harness}

text:
${question.question}

rubric:
${yamlStringify(question.rubric)}

# Candidate answer

${harnessOutput.answer}

# Trajectory summary

turns: ${harnessOutput.turns}
tool_calls: ${harnessOutput.toolCalls.length}
input_tokens: ${harnessOutput.usage.inputTokens}
output_tokens: ${harnessOutput.usage.outputTokens}
wall_clock_seconds: ${harnessOutput.wallClockSeconds}
cost_usd: ${harnessOutput.costUsd}
${harnessOutput.toolCalls.length > 0
  ? "tool sequence:\n" + harnessOutput.toolCalls.map((c, i) => `  ${i + 1}. ${c.name}  ${c.inputDigest}`).join("\n")
  : "(tool sequence unobservable for this harness)"}

# Your job

Read the rubric and the answer. Verify the candidate's citations against the actual corpus files using Read. Emit the structured verdict as a JSON object exactly as your system prompt specifies, between two \`\`\`json fences. JSON only — not YAML. Do not include any other prose.`;

  let assembled = "";
  for await (const msg of query({
    prompt: userPrompt,
    options: {
      systemPrompt: { type: "preset", preset: "claude_code", append: systemPrompt },
      model: opts.model ?? "claude-opus-4-6",
      allowedTools: ["Read", "Grep"],
      maxTurns: opts.maxTurns ?? 12,
      permissionMode: "bypassPermissions",
      cwd: opts.repoRoot,
    },
  })) {
    if (msg.type === "assistant") {
      const content = (msg as { message?: { content?: Array<{ type: string; text?: string }> } }).message?.content ?? [];
      for (const block of content) if (block.type === "text" && block.text) assembled += block.text;
    } else if (msg.type === "result") {
      const r = msg as { result?: string };
      if (r.result && !assembled) assembled = r.result;
    }
  }

  return parseGraderVerdict(question.id, harnessOutput.harness, assembled);
}

// ---------------------------------------------------------------------------

function parseGraderVerdict(qid: string, harness: HarnessOutput["harness"], raw: string): GraderVerdict {
  // Prefer ```json fence; fall back to ```yaml for backward compat with older grader runs.
  const jsonFence = raw.match(/```json\s*([\s\S]*?)```/);
  const yamlFence = raw.match(/```yaml\s*([\s\S]*?)```/);
  const fenceBody = jsonFence?.[1] ?? yamlFence?.[1] ?? raw;

  let doc: Record<string, unknown>;
  try {
    doc = JSON.parse(fenceBody.trim()) as Record<string, unknown>;
  } catch (jsonErr) {
    // Fallback: if it parses as JSON-with-trailing-text or a YAML envelope
    // somehow slipped through, try to extract the first balanced JSON object.
    const extracted = extractFirstJsonObject(fenceBody);
    if (extracted) {
      try {
        doc = JSON.parse(extracted) as Record<string, unknown>;
      } catch (e2) {
        return failVerdict(qid, harness, `Grader emitted unparseable output. JSON attempt: ${(jsonErr as Error).message}. Extracted-JSON attempt: ${(e2 as Error).message}\n\nRaw:\n${raw.slice(0, 600)}`);
      }
    } else {
      return failVerdict(qid, harness, `Grader emitted unparseable output (no JSON object found): ${(jsonErr as Error).message}\n\nRaw:\n${raw.slice(0, 600)}`);
    }
  }

  const dims = (doc["dimensions"] as Record<string, unknown> | undefined) ?? {};
  const dim = (key: string): DimensionScore => {
    const v = (dims[key] as Record<string, unknown> | undefined)?.["score"];
    if (typeof v === "string" && (v === "pass" || v === "partial" || v === "fail" || v === "n/a")) return v;
    return "n/a";
  };

  const factsCoveredRaw = (dims["substance"] as Record<string, unknown> | undefined)?.["facts_covered"];
  const [factsCovered, factsExpected] = parseFactsCovered(factsCoveredRaw);

  const citationPrecision = (dims["citation_precision"] as Record<string, unknown> | undefined) ?? {};
  const citationsTotal =
    asInt(citationPrecision["claims_with_citation"]) +
    asInt(citationPrecision["claims_without_citation"]);
  const hallucinated = asInt(citationPrecision["hallucinated_citations"]);

  return {
    questionId: qid,
    harness,
    overall: asVerdict(doc["overall"]),
    dimensions: {
      substance: dim("substance"),
      jerseySpecific: dim("jersey_specific"),
      citationPrecision: dim("citation_precision"),
      citationRecall: dim("citation_recall"),
      freshnessHandling: dim("freshness_handling"),
      voice: dim("voice"),
    },
    factsCovered,
    factsExpected,
    citationsTotal,
    hallucinatedCitations: hallucinated,
    summary: typeof doc["summary"] === "string" ? (doc["summary"] as string).trim() : "(no summary)",
  };
}

// Best-effort extraction of the first balanced { ... } JSON object from a
// string, ignoring braces inside JSON strings. Used as a fallback when the
// grader emits some prose before/after the JSON block.
function extractFirstJsonObject(s: string): string | null {
  let depth = 0;
  let start = -1;
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === "{") {
      if (start < 0) start = i;
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) return s.slice(start, i + 1);
    }
  }
  return null;
}

function asVerdict(v: unknown): Verdict {
  if (v === "pass" || v === "partial" || v === "fail") return v;
  return "fail";
}

function asInt(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function parseFactsCovered(v: unknown): [number, number] {
  // Grader emits e.g. "5 of 7" — best-effort parse.
  if (typeof v === "string") {
    const m = v.match(/(\d+)\s*of\s*(\d+)/);
    if (m) return [parseInt(m[1]!, 10), parseInt(m[2]!, 10)];
  }
  if (typeof v === "object" && v !== null) {
    const o = v as { covered?: number; expected?: number };
    if (typeof o.covered === "number" && typeof o.expected === "number") return [o.covered, o.expected];
  }
  return [0, 0];
}

function failVerdict(qid: string, harness: HarnessOutput["harness"], reason: string): GraderVerdict {
  return {
    questionId: qid,
    harness,
    overall: "fail",
    dimensions: {
      substance: "fail",
      jerseySpecific: "n/a",
      citationPrecision: "fail",
      citationRecall: "n/a",
      freshnessHandling: "n/a",
      voice: "n/a",
    },
    factsCovered: 0,
    factsExpected: 0,
    citationsTotal: 0,
    hallucinatedCitations: 0,
    summary: reason,
  };
}
