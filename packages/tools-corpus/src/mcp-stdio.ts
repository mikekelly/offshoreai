#!/usr/bin/env node
// Standalone stdio MCP server exposing the four corpus tools to
// *third-party* Claude clients (Claude Code, Claude Cowork) via a
// project-root `.mcp.json` connector.
//
// Architectural note: AGENT-PRINCIPLES #9 / PRD Appendix C forbid wrapping
// our own functions in a cross-process MCP server *for our own agent* —
// register.ts keeps the in-process registration the SDK runtime uses. This
// file is the explicitly-permitted exception: the cross-org / third-party-
// MCP-client *delivery adapter*. It reuses the SAME tool definitions
// (makeXTool) over a stdio transport — no logic is duplicated.
//
// stdout carries the JSON-RPC stream; never write to it. Diagnostics → stderr.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildCorpusContext } from "./context.js";
import { makeFindByTagTool } from "./handlers/findByTag.js";
import { makeFreshnessCheckTool } from "./handlers/freshnessCheck.js";
import { makeGetArticleTool } from "./handlers/getArticle.js";
import { makeGetFileTool } from "./handlers/getFile.js";
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
