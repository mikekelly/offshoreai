#!/usr/bin/env node
// Standalone stdio MCP server exposing the four corpus tools to Claude
// Agent SDK hosts that load tools via a project-scoped `.mcp.json` rather
// than in-process registration — e.g. the `claude-agent-ui` web UI
// (github.com/ninehills/claude-agent-ui), which runs the SDK with
// `cwd: <agent-dir>` + `settingSources: ['project']` and has no hook for
// passing in-process SDK tools.
//
// Architectural note: AGENT-PRINCIPLES #9 / PRD Appendix C prefer in-process
// SDK tool registration for our own runtime (register.ts keeps it). This
// file is the delivery adapter for the case where the host harness only
// consumes a project `.mcp.json` (a generic SDK UI / Claude Code / Cowork):
// a cross-process boundary we don't control. It reuses the SAME tool
// definitions (makeXTool) over a stdio transport — no logic is duplicated,
// and register.ts's in-process path is untouched.
//
// stdout carries the JSON-RPC stream; never write to it. Diagnostics → stderr.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildCorpusContext } from "./context.js";
import { makeFindByTagTool } from "./handlers/findByTag.js";
import { makeFreshnessCheckTool } from "./handlers/freshnessCheck.js";
import { makeGetArticleTool } from "./handlers/getArticle.js";
import { makeGetFileTool } from "./handlers/getFile.js";
import { makeTreeTool } from "./handlers/tree.js";
import { CORPUS_SERVER_NAME } from "./register.js";

// The MCP client launches this process with cwd = the project root it
// opened. Allow an explicit override for non-standard launches.
const repoRoot = process.env.OFFSHOREAI_REPO_ROOT ?? process.cwd();

const ctx = await buildCorpusContext({ repoRoot });

const server = new McpServer({ name: CORPUS_SERVER_NAME, version: "0.0.0" });

const defs = [
  makeGetFileTool(ctx),
  makeGetArticleTool(ctx),
  makeFindByTagTool(ctx),
  makeFreshnessCheckTool(ctx),
  makeTreeTool(ctx),
];

for (const def of defs) {
  server.registerTool(
    def.name,
    { description: def.description, inputSchema: def.inputSchema },
    // The SDK tool handler and the MCP ToolCallback are the same shape
    // ((args, extra) => Promise<CallToolResult>); the cast bridges the
    // two libraries' nominal types.
    def.handler as never,
  );
}

await server.connect(new StdioServerTransport());

process.stderr.write(
  `[offshoreai corpus MCP] ready — ${defs.length} tools (${defs
    .map((d) => d.name)
    .join(", ")}); repoRoot=${repoRoot}\n`,
);
