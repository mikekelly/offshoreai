// offshoreai web UI server.
//
// A small dependency-free Node http server in front of the streaming
// agent factory (packages/agent/src/web-agent.ts). It does two things:
//
//   GET  /            → serve the single-page frontend (public/index.html)
//   POST /api/ask     → { question } in; application/x-ndjson out, one
//                       JSON AgentEvent per line, flushed as the agent
//                       streams (text deltas, tool calls, citations with
//                       freshness badges, the citation-verifier verdict).
//
// The agent — corpus tools server + freshness-lookup corpus context +
// taxonomy block — is built ONCE at startup and reused across requests
// (createOffshoreaiAgent does the heavy lifting; stream() is per-question).
//
// No framework, no bundler: the frontend is a static vanilla-JS file and
// the transport is newline-delimited JSON the browser reads from a fetch
// stream. This is the whole server.

import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createOffshoreaiAgent, type OffshoreaiAgent } from "@offshoreai/agent/web-agent";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..", "..");
const INDEX_HTML = resolve(HERE, "..", "public", "index.html");
const TAG_INDEX = resolve(REPO_ROOT, "packages", "build", "dist", "tag-index.json");
const PORT = Number(process.env.PORT ?? 3104);

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolvePromise(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleAsk(agent: OffshoreaiAgent, req: IncomingMessage, res: ServerResponse): Promise<void> {
  let question = "";
  try {
    const body = await readBody(req);
    question = (JSON.parse(body) as { question?: unknown }).question as string;
  } catch {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "invalid JSON body" }));
    return;
  }
  if (typeof question !== "string" || question.trim().length === 0) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "missing 'question'" }));
    return;
  }

  res.writeHead(200, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
  });

  try {
    for await (const ev of agent.stream(question)) {
      res.write(`${JSON.stringify(ev)}\n`);
    }
  } catch (err) {
    res.write(`${JSON.stringify({ type: "error", message: (err as Error)?.message ?? String(err) })}\n`);
  } finally {
    res.end();
  }
}

async function handleIndex(res: ServerResponse): Promise<void> {
  try {
    const html = await readFile(INDEX_HTML, "utf8");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  } catch {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("index.html not found");
  }
}

const agent = await createOffshoreaiAgent({ repoRoot: REPO_ROOT, tagIndexPath: TAG_INDEX });

const server = createServer((req, res) => {
  const url = req.url ?? "/";
  if (req.method === "POST" && url === "/api/ask") {
    void handleAsk(agent, req, res);
    return;
  }
  if (req.method === "GET" && (url === "/" || url === "/index.html")) {
    void handleIndex(res);
    return;
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
});

server.listen(PORT, () => {
  process.stderr.write(`offshoreai web UI on http://localhost:${PORT}  (repoRoot=${REPO_ROOT})\n`);
});
