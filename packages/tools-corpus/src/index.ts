// @offshoreai/tools-corpus — public surface.

export { createCorpusToolsServer, corpusAllowedToolNames } from "./register.js";
export type { CorpusToolsServerOptions } from "./register.js";

export { buildCorpusContext } from "./context.js";
export type { CorpusContext, BuildContextOptions } from "./context.js";

export * from "./toon.js";
export type { ErrorKind, ErrorPayload, SdkCallToolResult } from "./error-envelope.js";
export { errorResult, successResult } from "./error-envelope.js";

// Individual handler factories — useful for tests that want to call a
// handler without spinning up the SDK MCP server.
export { makeGetFileTool } from "./handlers/getFile.js";
export { makeGetArticleTool } from "./handlers/getArticle.js";
export { makeFindByTagTool } from "./handlers/findByTag.js";
export { makeFreshnessCheckTool } from "./handlers/freshnessCheck.js";
