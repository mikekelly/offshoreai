// corpus.findByTag — inverted-index lookup with AND/OR + section/status filters.

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { findByTagDescription } from "@offshoreai/schemas/corpus";
import { z } from "zod";
import type { CorpusContext } from "../context.js";
import { getLastVerified, getStatus, getTags, getTitle } from "../context.js";
import { errorResult, successResult } from "../error-envelope.js";
import { suggestClosest } from "../levenshtein.js";
import { help, scalar, table, toon } from "../toon.js";

const inputShape = {
  tags: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)).min(1).max(8).describe("Tags drawn from TAGS.md. Server rejects unknown tags with a 'did you mean' hint."),
  mode: z.enum(["and", "or"]).default("and").describe("AND intersects all tags; OR unions them."),
  section: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional().describe("Restrict to a single section like 'trusts' or 'tax'."),
  status: z.array(z.enum(["stub", "draft", "review", "stable"])).optional().describe("Filter by status; omit to include all."),
  limit: z.number().int().min(1).max(100).default(20),
};

export function makeFindByTagTool(ctx: CorpusContext) {
  return tool(
    "findByTag",
    findByTagDescription,
    inputShape,
    async (args) => {
      // Compute candidate set from in-memory records — works whether
      // or not tag-index.json was loaded.
      const tagSet = new Set(args.tags);
      const matches = ctx.records.filter((rec) => {
        const recTags = new Set(getTags(rec));
        if (args.mode === "and") {
          for (const t of tagSet) if (!recTags.has(t)) return false;
          return true;
        } else {
          for (const t of tagSet) if (recTags.has(t)) return true;
          return false;
        }
      });

      const filtered = matches.filter((rec) => {
        if (args.section) {
          // Section is the second path segment under jurisdiction (e.g. jersey/<section>/...)
          const parts = rec.path.split("/");
          if (parts[1] !== args.section) return false;
        }
        if (args.status && args.status.length > 0) {
          if (!args.status.includes(getStatus(rec) as never)) return false;
        }
        return true;
      });

      filtered.sort((a, b) => a.path.localeCompare(b.path));
      const rows = filtered.slice(0, args.limit).map((rec) => ({
        path: rec.path,
        title: getTitle(rec),
        status: getStatus(rec),
        last_verified: getLastVerified(rec) ?? "",
        tags: getTags(rec),
      }));

      if (rows.length === 0) {
        // Definitive empty state with a useful hint.
        const knownTags = ctx.tagIndex ? Object.keys(ctx.tagIndex.tagToFiles) : null;
        const unknown = knownTags
          ? args.tags.filter((t) => !knownTags.includes(t))
          : [];
        if (unknown.length > 0) {
          // "Did you mean" recovery per PRD §7.0.1 row 3.
          const suggestionPairs = unknown.map((t) => {
            const closest = knownTags ? suggestClosest(t, knownTags, 3) : [];
            return { input: t, suggestions: closest };
          });
          const helpLines: string[] = [];
          const concrete = suggestionPairs.filter((p) => p.suggestions.length > 0);
          if (concrete.length > 0) {
            for (const { input, suggestions } of concrete) {
              helpLines.push(`For "${input}", did you mean: ${suggestions.join(", ")}? Re-run findByTag with the corrected tag.`);
            }
          } else {
            helpLines.push("No close match in the compiled tag-index. Scan the corpus tag taxonomy in your system prompt or call `getFile path=TAGS.md` to see the canonical list.");
          }
          return errorResult({
            errorKind: "invalid_tag",
            message: `Tag(s) not found in compiled tag-index: ${unknown.join(", ")}.`,
            context: {
              unknown_tags: unknown.join("|"),
              suggestions: suggestionPairs
                .map((p) => `${p.input}→${p.suggestions.join(",") || "(no near match)"}`)
                .join("|"),
            },
            helpLines,
          });
        }
        return successResult(toon([
          scalar("count", 0),
          scalar("total_matches", 0),
          scalar("query_tags", args.tags.join("|")),
          scalar("query_mode", args.mode),
          { kind: "raw" as const, text: `\nNo files matched tags [${args.tags.join(", ")}] with mode=${args.mode}.` },
          help([
            args.mode === "and"
              ? `Try mode="or" to union the tags instead of intersecting`
              : `Narrow the tag set or pick more discriminating tags`,
            "Call `tree` to orient on which section's index.md the user's question lives in",
          ]),
        ]));
      }

      return successResult(toon([
        scalar("count", rows.length),
        scalar("total_matches", filtered.length),
        scalar("query_tags", args.tags.join("|")),
        scalar("query_mode", args.mode),
        table("files", ["path", "title", "status", "last_verified", "tags"] as const, rows),
        help([
          "Call `getFile` with the most relevant path to read its body",
          `Call \`findByTag\` again with a narrower tag set if too many matches`,
          "Call `freshnessCheck` on the top candidates if the user said 'current'",
        ]),
      ]));
    },
  );
}
