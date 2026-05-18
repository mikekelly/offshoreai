// primarySource.* — cached, version-aware fetcher for primary-source
// hosts (PRD §7.2).
//
// The corpus is not the source of truth for Jersey law; jerseylaw.je
// is. This tool is the trust amplifier — the agent calls it when the
// corpus is stale relative to the live source, or when the user
// explicitly asks for the current statutory text.

import { z } from "zod";
import { helpBlock, isoDate } from "./common.js";

// Allowlisted hosts. The handler rejects URLs outside this set with
// errorKind: "denied" — the WebFetch lane is for the general web, this
// lane is for Jersey-government and Jersey-regulator hosts only.
export const allowedPrimarySourceHosts = [
  "jerseylaw.je",
  "www.jerseylaw.je",
  "gov.je",
  "www.gov.je",
  "jerseyfsc.org",
  "www.jerseyfsc.org",
  "statesassembly.je",
  "www.statesassembly.je",
] as const;

// ===========================================================================
// primarySource.fetch
// ===========================================================================

export const fetchInput = z.object({
  url: z.string().url().describe("Must resolve to an allowlisted primary-source host."),
  forceRefresh: z.boolean().default(false).describe("Bypass the cache and re-fetch."),
  selector: z.string().optional().describe("Optional CSS selector to narrow to a specific section of a page (e.g. an Article)."),
});

export const fetchResult = z.object({
  url: z.string().url(),
  host: z.string(),
  fetchedAt: isoDate,
  lastModified: isoDate.nullable().describe("HTTP Last-Modified header value, or null when unavailable."),
  etag: z.string().nullable(),
  cacheHit: z.boolean(),
  contentType: z.string(),
  text: z.string().describe("Plain text extracted from the response body; HTML stripped via readability heuristics."),
  excerptHash: z.string().describe("SHA256 of the returned text — for change-detection across calls."),
  help: helpBlock,
});
export type FetchResultType = z.infer<typeof fetchResult>;

export const fetchDescription = `
Fetch the live text of a primary-source URL (jerseylaw.je, gov.je,
jerseyfsc.org, statesassembly.je), with a Last-Modified-header-aware
cache. The agent uses this when the corpus is stale relative to the
upstream source, or when the user explicitly asks for the current
statutory or regulator text rather than the corpus paraphrase.

Use when: a freshnessCheck verdict was "stale" or "warn" and the
user's question depends on current text; the user said "the current
text of Article X", "as of today", "the latest version of the
handbook"; you're constructing a citation that must point to live
upstream rather than the corpus.

Do NOT use this for content the corpus already covers freshly —
that's wasted upstream bandwidth and adds latency. Do NOT use this
for general web content — that's the WebFetch lane, and the
PreToolUse hook denies WebFetch on allowlisted hosts to force this
tool instead. Do NOT use this when the user's question is
conceptual rather than text-exact; getFile + getArticle on the
corpus is more efficient.

Relationships: paired with corpus.freshnessCheck — freshnessCheck
decides "is the corpus stale", primarySource.fetch retrieves the
live text when it is. Used by the freshness-checker sub-agent on
every PreToolUse on corpus content-returning tools. Pairs with
corpus.getArticle — fetch the live text, compare against the
corpus body, surface drift to the user.

Returns: live text plus lastModified header, etag, cacheHit flag,
and an excerpt hash. If the excerpt hash differs from a previous
call's hash for the same URL, the upstream has changed — flag the
change to the user and (if material) file a corpus-stale signal for
the editorial backlog.
`.trim();
