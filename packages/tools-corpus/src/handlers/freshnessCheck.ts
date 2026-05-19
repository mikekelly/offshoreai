// corpus.freshnessCheck — age verdict per path against configurable thresholds.
// No primary-source fetch yet; that lands when @offshoreai/tools-primary-source ships.

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { freshnessCheckDescription } from "@offshoreai/schemas/corpus";
import { z } from "zod";
import type { CorpusContext } from "../context.js";
import { ageDaysBetween, getLastVerified, getStatus } from "../context.js";
import { successResult } from "../error-envelope.js";
import { help, scalar, table, toon } from "../toon.js";

const inputShape = {
  paths: z.array(z.string().min(1)).min(1).max(50).describe("Repo-relative corpus paths to check."),
  warnDays: z.number().int().min(1).default(180).describe("Threshold above which the file is 'warn'."),
  staleDays: z.number().int().min(1).default(365).describe("Threshold above which the file is 'stale'."),
};

type Verdict = "fresh" | "warn" | "stale" | "unknown" | "missing";

function classify(ageDays: number | null, warnDays: number, staleDays: number): Verdict {
  if (ageDays === null) return "unknown";
  if (ageDays >= staleDays) return "stale";
  if (ageDays >= warnDays) return "warn";
  return "fresh";
}

const verdictRank: Record<Verdict, number> = {
  fresh: 0,
  warn: 1,
  stale: 2,
  unknown: 1,
  missing: 2,
};

export function makeFreshnessCheckTool(ctx: CorpusContext) {
  return tool(
    "freshnessCheck",
    freshnessCheckDescription,
    inputShape,
    async (args) => {
      const now = new Date();
      const rows: Array<{
        path: string;
        last_verified: string;
        age_days: number | string;
        status: string;
        verdict: Verdict;
      }> = [];
      let worst: Verdict = "fresh";

      for (const path of args.paths) {
        const rec = ctx.byPath.get(path);
        if (!rec) {
          rows.push({
            path,
            last_verified: "(missing)",
            age_days: "(missing)",
            status: "(missing)",
            verdict: "missing",
          });
          worst = rankWorst(worst, "missing");
          continue;
        }
        const lastVerified = getLastVerified(rec);
        const ageDays = ageDaysBetween(lastVerified, now);
        const verdict = classify(ageDays, args.warnDays, args.staleDays);
        worst = rankWorst(worst, verdict);
        rows.push({
          path,
          last_verified: lastVerified ?? "(unknown)",
          age_days: ageDays ?? "(unknown)",
          status: getStatus(rec),
          verdict,
        });
      }

      return successResult(toon([
        scalar("count", rows.length),
        scalar("worst_verdict", worst),
        scalar("warn_threshold_days", args.warnDays),
        scalar("stale_threshold_days", args.staleDays),
        table("paths", ["path", "last_verified", "age_days", "status", "verdict"] as const, rows),
        help(buildHelp(worst)),
      ]));
    },
  );
}

function rankWorst(current: Verdict, candidate: Verdict): Verdict {
  return verdictRank[candidate] > verdictRank[current] ? candidate : current;
}

function buildHelp(worst: Verdict): ReadonlyArray<string> {
  switch (worst) {
    case "stale":
      return [
        "Do NOT cite stale files as authority; fetch the primary source via `primarySource.fetch` (when available) or refuse with citation-of-gap",
        "Flag the stale verdict to the user explicitly in your answer",
      ];
    case "warn":
      return [
        "Caveat the user: this file is within tolerance but older than the soft threshold",
        "Consider calling `primarySource.fetch` for high-stakes claims",
      ];
    case "missing":
      return [
        "One or more paths don't exist in the corpus — re-check the path or call `findByTag`",
      ];
    default:
      return [
        "All paths are within the freshness window — proceed normally",
      ];
  }
}
