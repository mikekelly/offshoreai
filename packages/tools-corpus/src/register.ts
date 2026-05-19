// Register the four v1 corpus tools.
//
// On naming: this calls `createSdkMcpServer` but the result is NOT a
// separate process and there is no JSON-RPC. The SDK's in-process
// custom-tool API is shaped as an "MCP server" because that's the
// uniform interface the SDK exposes — but the McpServer instance
// lives in the same Node event loop and each tool call is a direct
// function invocation. This is exactly what PRD Appendix C endorses:
//
//   > The Claude Agent SDK supports in-process custom tool
//   > registration directly — a function with a Zod input schema,
//   > returning a CallToolResult whose content[0].text reaches the
//   > agent verbatim.
//
// What Appendix C forbids — and what AGENT-PRINCIPLES Principle 9
// calls "MCP wrapping of our own functions" — is the cross-process
// kind, where you'd spawn a separate server process that the agent
// talks to over JSON-RPC. We're not doing that. The "MCP" in
// createSdkMcpServer is a protocol-shape label, not a deployment
// topology.
//
// The server name `corpus` is the shortest name that's still
// unambiguous. The agent sees tools as mcp__corpus__getFile etc.
// — short, readable, no infrastructure leak.

import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { buildCorpusContext } from "./context.js";
import { makeFindByTagTool } from "./handlers/findByTag.js";
import { makeFreshnessCheckTool } from "./handlers/freshnessCheck.js";
import { makeGetArticleTool } from "./handlers/getArticle.js";
import { makeGetFileTool } from "./handlers/getFile.js";

export const CORPUS_SERVER_NAME = "corpus";

export interface CorpusToolsServerOptions {
  readonly repoRoot: string;
  readonly tagIndexPath?: string;
  /** Override the default server name. Use only when integrating with another tenant's MCP namespace. */
  readonly serverName?: string;
}

export async function createCorpusToolsServer(opts: CorpusToolsServerOptions) {
  const ctx = await buildCorpusContext(
    opts.tagIndexPath
      ? { repoRoot: opts.repoRoot, tagIndexPath: opts.tagIndexPath }
      : { repoRoot: opts.repoRoot },
  );

  return createSdkMcpServer({
    name: opts.serverName ?? CORPUS_SERVER_NAME,
    version: "0.0.0",
    tools: [
      makeGetFileTool(ctx),
      makeGetArticleTool(ctx),
      makeFindByTagTool(ctx),
      makeFreshnessCheckTool(ctx),
    ],
    // Always-resident per PRD §5.7 — these four are in the high-frequency set.
    alwaysLoad: true,
  });
}

// Convenience for the agent runtime: returns the full `allowedTools`
// names the agent should pre-approve for the corpus toolset.
export function corpusAllowedToolNames(serverName: string = CORPUS_SERVER_NAME): ReadonlyArray<string> {
  return [
    `mcp__${serverName}__getFile`,
    `mcp__${serverName}__getArticle`,
    `mcp__${serverName}__findByTag`,
    `mcp__${serverName}__freshnessCheck`,
  ];
}
