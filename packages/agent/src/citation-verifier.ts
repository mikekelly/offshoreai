// Citation-verifier sub-agent invocation.
//
// Architecture: runs as a post-step after runQuery()'s main loop
// finishes. Loads prompts/sub-agents/citation-verifier.md as system
// prompt, passes the candidate answer + tool-call log, parses the
// structured verdict.
//
// This is the MVP. The PRD §8 + AGENT-BEHAVIOURS #4 design includes a
// Stop hook + retry budget, but those are orthogonal to whether the
// verifier itself works. Ship the verifier first; wire retries later
// once we have eval signal on the verifier's rejection accuracy.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { query } from "@anthropic-ai/claude-agent-sdk";

const VERIFIER_PROMPT_PATH = "prompts/sub-agents/citation-verifier.md";

export type VerifierVerdictKind = "pass" | "reject";

export type RejectIssueKind =
  | "hallucinated_citation"
  | "unsupported_by_cited_file"
  | "no_citation_attached"
  | "wrong_authority_tier"
  | "cite_pattern_violation"
  | "stale_corpus_cited";

export interface VerifierRejectReason {
  readonly claim: string;
  readonly issueKind: RejectIssueKind;
  readonly citedSource: string;
  readonly detail: string;
}

export interface VerifierVerdict {
  readonly kind: VerifierVerdictKind;
  readonly claimsChecked: number;
  readonly claimsWithCitation: number;
  readonly claimsWithPrimarySourceCitation: number;
  readonly notes: string;
  readonly reasons: ReadonlyArray<VerifierRejectReason>;
  readonly remediationHint: string;
  readonly costUsd: number;
  readonly wallClockSeconds: number;
}

export interface VerifyOptions {
  readonly repoRoot: string;
  readonly candidateAnswer: string;
  readonly toolCallLog: ReadonlyArray<{ readonly name: string; readonly inputDigest: string }>;
  readonly model?: string;
}

export async function runCitationVerifier(opts: VerifyOptions): Promise<VerifierVerdict> {
  const t0 = Date.now();
  const systemPrompt = await readFile(resolve(opts.repoRoot, VERIFIER_PROMPT_PATH), "utf8");

  const userPrompt = `Verify the following candidate response per your system-prompt rules.

# Candidate response

${opts.candidateAnswer}

# Session tool-call log

${opts.toolCallLog.length > 0
  ? opts.toolCallLog.map((c, i) => `  ${i + 1}. ${c.name}  ${c.inputDigest}`).join("\n")
  : "(no tool calls captured for this run)"}

# Active bundle

(None — v1 ships without bundles. Apply your default verification rules
without the bundle's citation_pattern; the baseline citation rule is
"every Jersey legal/regulatory/tax claim cites a corpus file path or
statute Article".)

# Output

Emit a single JSON object between \`\`\`json fences. Use the schema
your system prompt specifies. JSON only, no other prose.`;

  let assembled = "";
  let costUsd = 0;
  for await (const msg of query({
    prompt: userPrompt,
    options: {
      systemPrompt: { type: "preset", preset: "claude_code", append: systemPrompt },
      model: opts.model ?? "claude-opus-4-6",
      allowedTools: ["Read", "Grep"],
      maxTurns: 12,
      permissionMode: "bypassPermissions",
      cwd: opts.repoRoot,
    },
  })) {
    if (msg.type === "assistant") {
      const c = (msg as { message?: { content?: Array<{ type: string; text?: string }> } }).message?.content ?? [];
      for (const b of c) if (b.type === "text" && b.text) assembled += b.text;
    } else if (msg.type === "result") {
      const r = msg as { result?: string; total_cost_usd?: number };
      if (r.result && !assembled) assembled = r.result;
      costUsd = r.total_cost_usd ?? 0;
    }
  }
  return parseVerdict(assembled, costUsd, (Date.now() - t0) / 1000);
}

// ---------------------------------------------------------------------------

function parseVerdict(raw: string, costUsd: number, wallClockSeconds: number): VerifierVerdict {
  // Look for JSON inside ```json fences first; fallback to first balanced object.
  const fence = raw.match(/```json\s*([\s\S]*?)```/);
  const fenceBody = fence?.[1] ?? raw;

  let doc: Record<string, unknown>;
  try {
    doc = JSON.parse(fenceBody.trim()) as Record<string, unknown>;
  } catch {
    const extracted = extractFirstJsonObject(fenceBody);
    if (!extracted) {
      return rejectFromParseFailure(`Verifier emitted unparseable JSON; raw head: ${raw.slice(0, 300)}`, costUsd, wallClockSeconds);
    }
    try {
      doc = JSON.parse(extracted) as Record<string, unknown>;
    } catch (e) {
      return rejectFromParseFailure(`Verifier emitted unparseable JSON: ${(e as Error).message}`, costUsd, wallClockSeconds);
    }
  }

  const kind: VerifierVerdictKind = doc["verdict"] === "pass" ? "pass" : "reject";
  const reasonsIn = Array.isArray(doc["reasons"]) ? (doc["reasons"] as Array<Record<string, unknown>>) : [];
  const reasons: VerifierRejectReason[] = reasonsIn.map((r) => ({
    claim: typeof r["claim"] === "string" ? (r["claim"] as string) : "(missing)",
    issueKind: asIssueKind(r["issue_kind"]),
    citedSource: typeof r["cited_source"] === "string" ? (r["cited_source"] as string) : "(missing)",
    detail: typeof r["detail"] === "string" ? (r["detail"] as string) : "(missing)",
  }));

  return {
    kind,
    claimsChecked: asInt(doc["claims_checked"]),
    claimsWithCitation: asInt(doc["claims_with_citation"]),
    claimsWithPrimarySourceCitation: asInt(doc["claims_with_primary_source_citation"]),
    notes: typeof doc["notes"] === "string" ? (doc["notes"] as string).trim() : "",
    reasons,
    remediationHint: typeof doc["remediation_hint"] === "string" ? (doc["remediation_hint"] as string).trim() : "",
    costUsd,
    wallClockSeconds,
  };
}

function asIssueKind(v: unknown): RejectIssueKind {
  const candidates: ReadonlyArray<RejectIssueKind> = [
    "hallucinated_citation",
    "unsupported_by_cited_file",
    "no_citation_attached",
    "wrong_authority_tier",
    "cite_pattern_violation",
    "stale_corpus_cited",
  ];
  if (typeof v === "string" && (candidates as ReadonlyArray<string>).includes(v)) {
    return v as RejectIssueKind;
  }
  return "unsupported_by_cited_file";
}

function asInt(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function rejectFromParseFailure(detail: string, costUsd: number, wallClockSeconds: number): VerifierVerdict {
  return {
    kind: "reject",
    claimsChecked: 0,
    claimsWithCitation: 0,
    claimsWithPrimarySourceCitation: 0,
    notes: detail,
    reasons: [{
      claim: "(verifier parse failure)",
      issueKind: "unsupported_by_cited_file",
      citedSource: "",
      detail,
    }],
    remediationHint: "Verifier output was not parseable. Treat as soft failure — do not gate on this verdict; investigate verifier prompt drift.",
    costUsd,
    wallClockSeconds,
  };
}

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
