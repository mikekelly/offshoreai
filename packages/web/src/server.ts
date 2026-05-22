// offshoreai web UI server.
//
// A small dependency-free Node http server in front of the streaming agent
// factory (packages/agent/src/web-agent.ts) plus a thin conversation store
// (./store.ts) so the UI supports threaded, resumable conversations.
//
//   GET    /                       → the single-page frontend
//   POST   /api/ask                → { question, conversationId? } in;
//                                     application/x-ndjson out (one JSON
//                                     event per line). A `conversation`
//                                     event is emitted first so the client
//                                     learns the conversation id; the agent
//                                     events (text / reasoning / tool /
//                                     citation / verify_start / verdict /
//                                     done) follow. The turn is persisted on
//                                     completion and the SDK session resumed
//                                     for context continuity.
//   GET    /api/conversations      → sidebar list
//   GET    /api/conversations/:id  → full conversation (turns) for history
//   DELETE /api/conversations/:id  → remove a conversation
//
// The agent is built ONCE at startup and reused; only the per-question
// stream() (and the resume handle) varies per request.

import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createOffshoreaiAgent, type OffshoreaiAgent } from "@offshoreai/agent/web-agent";
import { ConversationStore, type StoredCitation, type StoredVerdict } from "./store.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..", "..");
const INDEX_HTML = resolve(HERE, "..", "public", "index.html");
const TAG_INDEX = resolve(REPO_ROOT, "packages", "build", "dist", "tag-index.json");
const DATA_FILE = process.env.OFFSHOREAI_WEB_DATA ?? resolve(HERE, "..", ".data", "conversations.json");
const PORT = Number(process.env.PORT ?? 3104);

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolvePromise(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function handleAsk(
  agent: OffshoreaiAgent,
  store: ConversationStore,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  let question = "";
  let conversationId: string | undefined;
  try {
    const body = JSON.parse(await readBody(req)) as { question?: unknown; conversationId?: unknown };
    question = body.question as string;
    if (typeof body.conversationId === "string") conversationId = body.conversationId;
  } catch {
    sendJson(res, 400, { error: "invalid JSON body" });
    return;
  }
  if (typeof question !== "string" || question.trim().length === 0) {
    sendJson(res, 400, { error: "missing 'question'" });
    return;
  }

  // Resolve (or create) the conversation; resume its SDK session for context.
  const existing = conversationId ? await store.get(conversationId) : undefined;
  const convo = existing ?? (await store.create(question));
  const resume = convo.sessionId ?? undefined;

  res.writeHead(200, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
  });
  const write = (obj: unknown) => res.write(`${JSON.stringify(obj)}\n`);

  // Tell the client which conversation this is (esp. for a freshly created one).
  write({ type: "conversation", id: convo.id, title: convo.title, isNew: !existing });

  // Accumulate the turn for persistence as events stream by.
  const citations: StoredCitation[] = [];
  let verdict: StoredVerdict | null = null;
  let answer = "";
  let sessionId: string | null = convo.sessionId;

  try {
    for await (const ev of agent.stream(question, resume ? { resume } : undefined)) {
      write(ev);
      if (ev.type === "citation") {
        citations.push({
          path: ev.path,
          exists: ev.exists,
          title: ev.title,
          status: ev.status,
          lastVerified: ev.lastVerified,
          ageDays: ev.ageDays,
          freshness: ev.freshness,
        });
      } else if (ev.type === "verdict") {
        verdict = {
          kind: ev.kind,
          claimsChecked: ev.claimsChecked,
          claimsWithCitation: ev.claimsWithCitation,
          rejectCount: ev.rejectCount,
          notes: ev.notes,
          reasons: ev.reasons,
        };
      } else if (ev.type === "session") {
        sessionId = ev.sessionId;
      } else if (ev.type === "done") {
        answer = ev.answer;
        if (ev.sessionId) sessionId = ev.sessionId;
      }
    }
  } catch (err) {
    write({ type: "error", message: (err as Error)?.message ?? String(err) });
  } finally {
    if (answer.trim().length > 0) {
      await store.appendTurn(convo.id, { question, answer, citations, verdict }, sessionId);
    }
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

const store = new ConversationStore(DATA_FILE);
const agent = await createOffshoreaiAgent({ repoRoot: REPO_ROOT, tagIndexPath: TAG_INDEX });

const server = createServer((req, res) => {
  const method = req.method ?? "GET";
  const url = (req.url ?? "/").split("?")[0] ?? "/";

  if (method === "POST" && url === "/api/ask") {
    void handleAsk(agent, store, req, res);
    return;
  }
  if (method === "GET" && url === "/api/conversations") {
    void store.list().then((list) => sendJson(res, 200, list));
    return;
  }
  const convoMatch = url.match(/^\/api\/conversations\/([^/]+)$/);
  if (convoMatch) {
    const id = decodeURIComponent(convoMatch[1] ?? "");
    if (method === "GET") {
      void store.get(id).then((c) => (c ? sendJson(res, 200, c) : sendJson(res, 404, { error: "not found" })));
      return;
    }
    if (method === "DELETE") {
      void store.remove(id).then((ok) => sendJson(res, ok ? 200 : 404, { ok }));
      return;
    }
  }
  if (method === "GET" && (url === "/" || url === "/index.html")) {
    void handleIndex(res);
    return;
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
});

server.listen(PORT, () => {
  process.stderr.write(`offshoreai web UI on http://localhost:${PORT}  (repoRoot=${REPO_ROOT})\n`);
});
