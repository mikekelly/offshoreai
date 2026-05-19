// corpus.getArticle — dispatch (statute, article) → canonical file body.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import matter from "gray-matter";
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { getArticleDescription } from "@offshoreai/schemas/corpus";
import { z } from "zod";
import type { CorpusContext } from "../context.js";
import {
  ageDaysBetween,
  getLastVerified,
  getStatus,
  keyOf,
} from "../context.js";
import { errorResult, successResult } from "../error-envelope.js";
import { help, scalar, toon } from "../toon.js";

const inputShape = {
  statute: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).describe('Statute slug as named in TAGS.md, e.g. "trusts-law-1984".'),
  article: z.string().regex(/^[0-9]+[A-Z]*$/).describe('Article identifier as printed in the statute, e.g. "47" or "47A".'),
};

export function makeGetArticleTool(ctx: CorpusContext) {
  return tool(
    "getArticle",
    getArticleDescription,
    inputShape,
    async (args) => {
      const rec = ctx.articleIndex.get(keyOf(args.statute, args.article));
      if (!rec) {
        return errorResult({
          errorKind: "invalid_article",
          message: `No canonical file found for Article ${args.article} of ${args.statute}. Either the article doesn't exist in the statute or no file declares it in articles_covered.`,
          context: { statute: args.statute, article: args.article },
          helpLines: [
            `Call \`findByTag\` with tags=[\"${args.statute}\"] to see all files that cover this statute`,
            `Call \`getFile\` on the statute's articles-index file if you know its path`,
          ],
        });
      }

      let body: string;
      try {
        const abs = resolve(ctx.repoRoot, rec.path);
        const raw = await readFile(abs, "utf8");
        body = matter(raw).content;
      } catch (err) {
        return errorResult({
          errorKind: "internal_error",
          message: `Read failed for ${rec.path}: ${(err as Error).message}`,
        });
      }

      const status = getStatus(rec);
      const lastVerified = getLastVerified(rec);
      const ageDays = ageDaysBetween(lastVerified, new Date());
      const articlesCovered = ((rec.frontmatter as { articles_covered?: string[] }).articles_covered ?? []).join("|");

      const lines = [
        scalar("statute", args.statute),
        scalar("article", args.article),
        scalar("canonical_path", rec.path),
        scalar("covers_articles", articlesCovered),
        scalar("status", status),
        scalar("last_verified", lastVerified),
        scalar("age_days", ageDays),
        scalar("body", ""),
        { kind: "raw" as const, text: body },
        help([
          `Call \`freshnessCheck\` with paths=[\"${rec.path}\"] if the user said 'current' or 'latest'`,
          `Call \`primarySource.fetch\` if you need to verify against the live statute`,
        ]),
      ];

      return successResult(toon(lines));
    },
  );
}
