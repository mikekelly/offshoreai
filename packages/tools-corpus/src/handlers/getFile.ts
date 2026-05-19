// corpus.getFile — read one corpus file's body + frontmatter.
//
// Per PRD §7.1 / schemas/corpus.ts getFileDescription. v1 implementation:
// - Truncate to 120 lines by default with a size hint.
// - Project a minimal frontmatter (path, status, lastVerified, tags) by
//   default; opt-in to additional fields via `fields`.
// - Refuse on missing file; warn on stub.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import matter from "gray-matter";
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { getFileDescription } from "@offshoreai/schemas/corpus";
import { z } from "zod";
import type { CorpusContext } from "../context.js";
import { ageDaysBetween, getLastVerified, getStatus, getTags, getTitle } from "../context.js";
import { errorResult, successResult } from "../error-envelope.js";
import { help, raw, scalar, table, toon, type ToonLine } from "../toon.js";

const DEFAULT_LINE_BUDGET = 120;

// SDK tool() wants a raw Zod shape (not z.object). We declare it inline
// here rather than importing the z.object from @offshoreai/schemas
// because that import would still be useful — we want the same
// constraints. Using `.shape` on the existing schema would couple
// us tightly; the input surface is small enough to repeat.
const inputShape = {
  path: z.string().describe("Repo-relative markdown path, e.g. knowledge/jersey/trusts/article-47-set-aside.md."),
  full: z.boolean().default(false).describe("If true, return the entire file; default returns the first ~120 lines with a truncation hint."),
  fields: z.array(z.enum(["title", "tags", "sources", "articlesCovered", "seeAlso"])).optional().describe("Opt-in extra frontmatter fields. Default projection: path, status, lastVerified, tags."),
};

export function makeGetFileTool(ctx: CorpusContext) {
  return tool(
    "getFile",
    getFileDescription,
    inputShape,
    async (args) => {
      const rec = ctx.byPath.get(args.path);
      if (!rec) {
        return errorResult({
          errorKind: "missing_file",
          message: `No corpus file at ${args.path}.`,
          context: { path: args.path },
          helpLines: [
            "Call `findByTag` with relevant tags to discover candidate paths",
            "Call `tree` to walk the section's index.md and surrounding files",
          ],
        });
      }
      const status = getStatus(rec);
      if (status === "stub") {
        return errorResult({
          errorKind: "stub_file",
          message: `File is a stub — declared coverage but no content yet.`,
          context: { path: args.path, status },
          helpLines: [
            "Surface the gap to the user; do not claim coverage that doesn't exist",
            "Call `findByTag` with the same tags to find adjacent files with real content",
          ],
        });
      }

      let body: string;
      try {
        const abs = resolve(ctx.repoRoot, args.path);
        const raw = await readFile(abs, "utf8");
        const parsed = matter(raw);
        body = parsed.content;
      } catch (err) {
        return errorResult({
          errorKind: "internal_error",
          message: `Read failed for ${args.path}: ${(err as Error).message}`,
        });
      }

      const allLines = body.split(/\r?\n/);
      const truncated = !args.full && allLines.length > DEFAULT_LINE_BUDGET;
      const renderedBody = truncated
        ? allLines.slice(0, DEFAULT_LINE_BUDGET).join("\n")
        : body;

      const lastVerified = getLastVerified(rec);
      const ageDays = ageDaysBetween(lastVerified, new Date());

      const lines: ToonLine[] = [
        scalar("path", rec.path),
        scalar("status", status),
        scalar("last_verified", lastVerified),
        scalar("age_days", ageDays),
        scalar("title", getTitle(rec)),
      ];

      const requestedFields = args.fields ?? [];
      if (requestedFields.includes("tags")) {
        lines.push(scalar("tags", getTags(rec).join("|")));
      }
      if (requestedFields.includes("articlesCovered")) {
        const articles = (rec.frontmatter as { articles_covered?: string[] }).articles_covered ?? [];
        lines.push(scalar("articles_covered", articles.join("|")));
      }
      if (requestedFields.includes("seeAlso")) {
        const seeAlso = (rec.frontmatter as { see_also?: string[] }).see_also ?? [];
        lines.push(scalar("see_also", seeAlso.join("|")));
      }
      if (requestedFields.includes("sources")) {
        const sources = ((rec.frontmatter as { sources?: Array<{ title: string; url: string; kind?: string }> }).sources ?? [])
          .map((s) => ({ title: s.title, url: s.url, kind: s.kind ?? "(unmarked)" }));
        lines.push(table("sources", ["title", "url", "kind"] as const, sources));
      }

      lines.push(scalar("body_truncated", truncated));
      lines.push(scalar("total_lines", allLines.length));
      lines.push(scalar("body", "")); // separator marker before raw body block
      lines.push(raw(renderedBody));
      if (truncated) {
        lines.push(raw(`\n(truncated at ${DEFAULT_LINE_BUDGET} of ${allLines.length} lines — call again with full=true to see the rest)`));
      }

      lines.push(help([
        "Call `freshnessCheck` with paths=[<this-path>] if the user said 'current' or 'latest'",
        "Call `getFile` with full=true on this path to read the entire file",
        "Call `findByTag` with one of this file's tags to discover related files",
      ]));

      return successResult(toon(lines));
    },
  );
}
