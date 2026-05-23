// corpus.tree — walk the inclusion-link graph from a root.
//
// Returns a flat list of every reachable node under the given root,
// with depth, parent, child count, and a 1-3 sentence summary. The
// traversal mechanism is the inclusion-link convention from
// CONVENTIONS.md — a markdown link on its own line is a structural
// parent → child relationship. Index files express their sections as
// inclusion links, so calling tree on an index.md walks the
// agent-readable hierarchy below it.

import { tool } from "@anthropic-ai/claude-agent-sdk";
import { treeDescription } from "@offshoreai/schemas/corpus";
import { z } from "zod";
import type { CorpusContext } from "../context.js";
import { getLastVerified, getStatus, getTitle } from "../context.js";
import { errorResult, successResult } from "../error-envelope.js";
import { help, scalar, table, toon, type ToonLine } from "../toon.js";

const DEFAULT_ROOT = "knowledge/jersey/index.md";
const SUMMARY_MAX_CHARS = 240;

const inputShape = {
  root: z.string().optional().describe("Subtree root path — usually an index.md, e.g. knowledge/jersey/trusts/index.md. Omit for the corpus-wide root (knowledge/jersey/index.md)."),
  depth: z.number().int().min(1).max(5).default(2).describe("How many inclusion-link levels to descend from the root."),
  includeSummaries: z.boolean().default(true).describe("Include a 1-3 sentence summary per node (heuristic-derived from the file's opening prose if no pre-computed summary is available)."),
};

interface TreeNode {
  path: string;
  parent: string;
  depth: number;
  title: string;
  status: string;
  lastVerified: string | null;
  childCount: number;
  summary?: string;
}

/** Heuristic summary: the file's first non-heading, non-blank prose
 *  block, trimmed of markdown link syntax and bold/italic markers,
 *  truncated to SUMMARY_MAX_CHARS with a trailing ellipsis. */
function heuristicSummary(body: string): string {
  const lines = body.split(/\r?\n/);
  const paragraph: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (paragraph.length > 0) break;
      continue;
    }
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("---")) continue;
    if (trimmed.startsWith("```")) continue;
    paragraph.push(trimmed);
  }
  let text = paragraph.join(" ");
  // Strip markdown link syntax: [text](url) → text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // Strip reference-style link markers: [text][label] → text
  text = text.replace(/\[([^\]]+)\]\[[^\]]+\]/g, "$1");
  // Strip bold/italic markers
  text = text.replace(/\*\*?([^*]+)\*\*?/g, "$1");
  text = text.replace(/__?([^_]+)__?/g, "$1");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  if (text.length > SUMMARY_MAX_CHARS) {
    return text.slice(0, SUMMARY_MAX_CHARS - 1).trimEnd() + "…";
  }
  return text;
}

export function makeTreeTool(ctx: CorpusContext) {
  return tool(
    "tree",
    treeDescription,
    inputShape,
    async (args) => {
      const root = args.root ?? DEFAULT_ROOT;
      const rec = ctx.byPath.get(root);
      if (!rec) {
        return errorResult({
          errorKind: "missing_file",
          message: `No corpus file at ${root} to walk from.`,
          context: { root },
          helpLines: [
            "Call `tree` without a root for the corpus-wide default (knowledge/jersey/index.md)",
            "Call `findByTag` to discover index.md candidates for the topic",
          ],
        });
      }

      const visited = new Set<string>([root]);
      const nodes: TreeNode[] = [];
      let truncatedAtDepth = false;
      let frontier: ReadonlyArray<{ path: string; depth: number }> = [{ path: root, depth: 0 }];
      while (frontier.length > 0) {
        const next: { path: string; depth: number }[] = [];
        for (const cur of frontier) {
          if (cur.depth >= args.depth) {
            // If this node had children we didn't descend into, mark
            // truncated.
            const children = ctx.inclusionChildren.get(cur.path) ?? [];
            if (children.length > 0) truncatedAtDepth = true;
            continue;
          }
          const children = ctx.inclusionChildren.get(cur.path) ?? [];
          for (const childPath of children) {
            if (visited.has(childPath)) continue;
            visited.add(childPath);
            const childRec = ctx.byPath.get(childPath);
            if (!childRec) continue;
            const grandchildren = ctx.inclusionChildren.get(childPath) ?? [];
            const node: TreeNode = {
              path: childPath,
              parent: cur.path,
              depth: cur.depth + 1,
              title: getTitle(childRec),
              status: getStatus(childRec),
              lastVerified: getLastVerified(childRec),
              childCount: grandchildren.length,
            };
            if (args.includeSummaries) {
              node.summary = heuristicSummary(childRec.body);
            }
            nodes.push(node);
            next.push({ path: childPath, depth: cur.depth + 1 });
          }
        }
        frontier = next;
      }

      const lines: ToonLine[] = [
        scalar("root", root),
        scalar("root_title", getTitle(rec)),
        scalar("depth_limit", args.depth),
        scalar("node_count", nodes.length),
        scalar("truncated_at_depth", truncatedAtDepth),
      ];

      if (args.includeSummaries) {
        lines.push(table(
          "nodes",
          ["path", "depth", "parent", "title", "status", "last_verified", "child_count", "summary"] as const,
          nodes.map((n) => ({
            path: n.path,
            depth: n.depth,
            parent: n.parent,
            title: n.title,
            status: n.status,
            last_verified: n.lastVerified ?? "",
            child_count: n.childCount,
            summary: n.summary ?? "",
          })),
        ));
      } else {
        lines.push(table(
          "nodes",
          ["path", "depth", "parent", "title", "status", "last_verified", "child_count"] as const,
          nodes.map((n) => ({
            path: n.path,
            depth: n.depth,
            parent: n.parent,
            title: n.title,
            status: n.status,
            last_verified: n.lastVerified ?? "",
            child_count: n.childCount,
          })),
        ));
      }

      lines.push(help([
        "Call `getFile` on the most promising node to read it",
        truncatedAtDepth
          ? "Re-call `tree` with a deeper node as the root to descend further"
          : "All children visible at this depth; pick a node and read with `getFile`",
        "Call `findByTag` if you need cross-cutting matches that the inclusion graph doesn't cover",
      ]));

      return successResult(toon(lines));
    },
  );
}
