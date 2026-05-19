// Register the four v1 corpus tools as an in-process MCP server.
// The agent runtime mounts the returned server config into query()'s
// mcpServers option; tools are reachable as mcp__offshoreai_corpus__<name>.

import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { buildCorpusContext } from "./context.js";
import { makeFindByTagTool } from "./handlers/findByTag.js";
import { makeFreshnessCheckTool } from "./handlers/freshnessCheck.js";
import { makeGetArticleTool } from "./handlers/getArticle.js";
import { makeGetFileTool } from "./handlers/getFile.js";

export interface CorpusToolsServerOptions {
  readonly repoRoot: string;
  readonly tagIndexPath?: string;
  /** Tool-set name as it appears in mcp__<name>__<tool>. Defaults to offshoreai_corpus. */
  readonly serverName?: string;
}

export async function createCorpusToolsServer(opts: CorpusToolsServerOptions) {
  const ctx = await buildCorpusContext(
    opts.tagIndexPath
      ? { repoRoot: opts.repoRoot, tagIndexPath: opts.tagIndexPath }
      : { repoRoot: opts.repoRoot },
  );

  return createSdkMcpServer({
    name: opts.serverName ?? "offshoreai_corpus",
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
export function corpusAllowedToolNames(serverName = "offshoreai_corpus"): ReadonlyArray<string> {
  return [
    `mcp__${serverName}__getFile`,
    `mcp__${serverName}__getArticle`,
    `mcp__${serverName}__findByTag`,
    `mcp__${serverName}__freshnessCheck`,
  ];
}
