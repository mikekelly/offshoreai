// corpus.getFile — read one corpus file's body + frontmatter.
//
// Per PRD §7.1 / schemas/corpus.ts getFileDescription. v1 implementation:
// - Truncate to 120 lines by default with a size hint.
// - Project a minimal frontmatter (path, status, lastVerified, tags) by
//   default; opt-in to additional fields via `fields`.
// - Refuse on missing file; warn on stub.
// - Optional depth and parentContext params follow the inclusion-link
//   graph (per CONVENTIONS.md "Inclusion links — the third navigation
//   axis").

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
// Included files (parents/children) are truncated to a tighter budget
// — they're context, not the primary read.
const INCLUDED_LINE_BUDGET = 40;

const inputShape = {
  path: z.string().describe("Repo-relative markdown path, e.g. knowledge/jersey/trusts/article-47-set-aside.md."),
  full: z.boolean().default(false).describe("If true, return the entire file; default returns the first ~120 lines with a truncation hint."),
  fields: z.array(z.enum(["title", "tags", "sources", "articlesCovered", "seeAlso"])).optional().describe("Opt-in extra frontmatter fields. Default projection: path, status, lastVerified, tags."),
  depth: z.number().int().min(0).max(3).default(0).describe("Follow inclusion links N levels into children (per CONVENTIONS.md). 0 returns only the requested file. 1 also returns the bodies of its structural children. Capped at 3."),
  parentContext: z.number().int().min(0).max(2).default(0).describe("Include N levels of structural parents (files that include this one via a bare-line inclusion link). 0 omits parents (default). Capped at 2."),
};

interface IncludedFile {
  path: string;
  level: number; // depth from origin (positive for children, positive for parents — context distinguishes)
  body: string;
  truncated: boolean;
  totalLines: number;
}

function truncateBody(body: string, budget: number, full: boolean): { body: string; truncated: boolean; totalLines: number } {
  const allLines = body.split(/\r?\n/);
  const totalLines = allLines.length;
  if (full || totalLines <= budget) return { body, truncated: false, totalLines };
  return { body: allLines.slice(0, budget).join("\n"), truncated: true, totalLines };
}

async function readBody(ctx: CorpusContext, path: string): Promise<string | null> {
  try {
    const abs = resolve(ctx.repoRoot, path);
    const raw = await readFile(abs, "utf8");
    return matter(raw).content;
  } catch {
    return null;
  }
}

async function walkChildren(
  ctx: CorpusContext,
  rootPath: string,
  maxDepth: number,
): Promise<IncludedFile[]> {
  if (maxDepth <= 0) return [];
  const visited = new Set<string>([rootPath]);
  const out: IncludedFile[] = [];
  // BFS so depth is consistent.
  let frontier: ReadonlyArray<{ path: string; depth: number }> = [{ path: rootPath, depth: 0 }];
  while (frontier.length > 0) {
    const next: { path: string; depth: number }[] = [];
    for (const cur of frontier) {
      if (cur.depth >= maxDepth) continue;
      const children = ctx.inclusionChildren.get(cur.path) ?? [];
      for (const childPath of children) {
        if (visited.has(childPath)) continue;
        visited.add(childPath);
        const body = await readBody(ctx, childPath);
        if (body === null) continue;
        const { body: rendered, truncated, totalLines } = truncateBody(body, INCLUDED_LINE_BUDGET, false);
        out.push({ path: childPath, level: cur.depth + 1, body: rendered, truncated, totalLines });
        next.push({ path: childPath, depth: cur.depth + 1 });
      }
    }
    frontier = next;
  }
  return out;
}

async function walkParents(
  ctx: CorpusContext,
  rootPath: string,
  maxLevels: number,
): Promise<IncludedFile[]> {
  if (maxLevels <= 0) return [];
  const visited = new Set<string>([rootPath]);
  const out: IncludedFile[] = [];
  let frontier: ReadonlyArray<{ path: string; level: number }> = [{ path: rootPath, level: 0 }];
  while (frontier.length > 0) {
    const next: { path: string; level: number }[] = [];
    for (const cur of frontier) {
      if (cur.level >= maxLevels) continue;
      const parents = ctx.inclusionParents.get(cur.path) ?? [];
      for (const parentPath of parents) {
        if (visited.has(parentPath)) continue;
        visited.add(parentPath);
        const body = await readBody(ctx, parentPath);
        if (body === null) continue;
        const { body: rendered, truncated, totalLines } = truncateBody(body, INCLUDED_LINE_BUDGET, false);
        out.push({ path: parentPath, level: cur.level + 1, body: rendered, truncated, totalLines });
        next.push({ path: parentPath, level: cur.level + 1 });
      }
    }
    frontier = next;
  }
  return out;
}

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

      const { body: renderedBody, truncated, totalLines } = truncateBody(body, DEFAULT_LINE_BUDGET, args.full);

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
      lines.push(scalar("total_lines", totalLines));
      lines.push(scalar("body", "")); // separator marker before raw body block
      lines.push(raw(renderedBody));
      if (truncated) {
        lines.push(raw(`\n(truncated at ${DEFAULT_LINE_BUDGET} of ${totalLines} lines — call again with full=true to see the rest)`));
      }

      if (args.depth > 0) {
        const children = await walkChildren(ctx, args.path, args.depth);
        lines.push(scalar("included_children_count", children.length));
        if (children.length > 0) {
          lines.push(table(
            "included_children",
            ["path", "depth", "lines", "truncated"] as const,
            children.map((c) => ({ path: c.path, depth: c.level, lines: c.totalLines, truncated: c.truncated })),
          ));
          for (const child of children) {
            lines.push(raw(`\n--- child path=${child.path} depth=${child.level} ---`));
            lines.push(raw(child.body));
            if (child.truncated) {
              lines.push(raw(`\n(truncated at ${INCLUDED_LINE_BUDGET} of ${child.totalLines} lines)`));
            }
          }
        }
      }

      if (args.parentContext > 0) {
        const parents = await walkParents(ctx, args.path, args.parentContext);
        lines.push(scalar("included_parents_count", parents.length));
        if (parents.length > 0) {
          lines.push(table(
            "included_parents",
            ["path", "level", "lines", "truncated"] as const,
            parents.map((p) => ({ path: p.path, level: p.level, lines: p.totalLines, truncated: p.truncated })),
          ));
          for (const parent of parents) {
            lines.push(raw(`\n--- parent path=${parent.path} level=${parent.level} ---`));
            lines.push(raw(parent.body));
            if (parent.truncated) {
              lines.push(raw(`\n(truncated at ${INCLUDED_LINE_BUDGET} of ${parent.totalLines} lines)`));
            }
          }
        }
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
