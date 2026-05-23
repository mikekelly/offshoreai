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
import { ConversationStore, type Draft, type DraftStatus, type StoredCitation, type StoredVerdict } from "./store.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..", "..");
const INDEX_HTML = resolve(HERE, "..", "public", "index.html");
const RENDER_JS = resolve(HERE, "..", "public", "render.js");
const TAG_INDEX = resolve(REPO_ROOT, "packages", "build", "dist", "tag-index.json");
const DATA_FILE = process.env["OFFSHOREAI_WEB_DATA"] ?? resolve(HERE, "..", ".data", "conversations.json");
const PORT = Number(process.env["PORT"] ?? 3104);
// Default to loopback only — this UI ships without auth (local dev tool;
// see README.md). Set OFFSHOREAI_BIND=0.0.0.0 to opt out, but then add
// auth/origin checks at the perimeter.
const BIND = process.env["OFFSHOREAI_BIND"] ?? "127.0.0.1";
const IS_LOCAL_BIND = BIND === "127.0.0.1" || BIND === "localhost" || BIND.startsWith("127.");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);

/**
 * When bound to loopback, reject requests whose Host header isn't a localhost
 * name — closes the DNS-rebinding vector where a malicious page on another
 * domain (resolved to 127.0.0.1) tries to talk to this server from a victim
 * browser. With an explicit non-local bind, the operator is opting in.
 */
function hostAllowed(req: IncomingMessage): boolean {
  if (!IS_LOCAL_BIND) return true;
  const raw = (req.headers["host"] ?? "").toString().toLowerCase();
  const host = raw.split(":")[0] ?? "";
  return LOCAL_HOSTS.has(host);
}

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

// Per-conversation in-flight lock. Two near-simultaneous asks on the same
// conversation would otherwise race on `sessionId`: each resumes the value
// it loaded, advances the SDK session independently, and the store ends up
// pinned to whichever finishes last — losing one branch silently. Streams
// on DIFFERENT conversations still run concurrently.
const inflight = new Map<string, Promise<void>>();

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
  if (conversationId !== undefined && !UUID_RE.test(conversationId)) {
    sendJson(res, 400, { error: "invalid conversationId" });
    return;
  }

  // Resolve (or create) the conversation; resume its SDK session for context.
  const existing = conversationId ? await store.get(conversationId) : undefined;
  const convo = existing ?? (await store.create(question));
  const resume = convo.sessionId ?? undefined;

  // Serialise streams on the same conversation. Different conversations are
  // independent and can run in parallel.
  const prior = inflight.get(convo.id);
  if (prior) await prior.catch(() => undefined);
  let releaseLock!: () => void;
  const lockHeld = new Promise<void>((r) => { releaseLock = r; });
  inflight.set(convo.id, lockHeld);

  res.writeHead(200, {
    "content-type": "application/x-ndjson; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
  });
  const write = (obj: unknown) => res.write(`${JSON.stringify(obj)}\n`);

  // Tell the client which conversation this is (esp. for a freshly created one).
  write({ type: "conversation", id: convo.id, title: convo.title, isNew: !existing });

  // Accumulate each draft of the turn as events stream by. A `revise` event
  // finalizes the current draft as rejected and starts a new one; `verdict`
  // and `verify_error` finalize the current draft. `done` pushes the final
  // (live) draft. Every attempt is preserved in history.
  type DraftAccum = {
    answer: string;
    citations: StoredCitation[];
    verdict: StoredVerdict | null;
    verifyError: string | null;
    status: DraftStatus;
    superseded: boolean;
  };
  const newDraft = (): DraftAccum => ({ answer: "", citations: [], verdict: null, verifyError: null, status: "verified", superseded: false });
  const drafts: Draft[] = [];
  let cur: DraftAccum = newDraft();
  let sessionId: string | null = convo.sessionId;

  try {
    for await (const ev of agent.stream(question, resume ? { resume } : undefined)) {
      write(ev);
      if (ev.type === "citation") {
        cur.citations.push({
          path: ev.path,
          exists: ev.exists,
          title: ev.title,
          status: ev.status,
          lastVerified: ev.lastVerified,
          ageDays: ev.ageDays,
          freshness: ev.freshness,
          sources: ev.sources,
          articles: ev.articles,
          pinpoints: ev.pinpoints,
        });
      } else if (ev.type === "verdict") {
        cur.verdict = {
          kind: ev.kind,
          claimsChecked: ev.claimsChecked,
          claimsWithCitation: ev.claimsWithCitation,
          rejectCount: ev.rejectCount,
          notes: ev.notes,
          reasons: ev.reasons,
        };
        cur.status = ev.rejectCount > 0 ? "rejected" : "verified";
      } else if (ev.type === "verify_error") {
        cur.verifyError = ev.message;
        cur.status = "unavailable";
      } else if (ev.type === "revise") {
        // Finalize the rejected draft and open a fresh one for the correction.
        cur.answer = ev.answer;
        cur.status = "rejected";
        cur.superseded = true;
        cur.verdict = {
          kind: "reject",
          claimsChecked: 0,
          claimsWithCitation: 0,
          rejectCount: ev.rejectCount,
          notes: "Superseded by the next draft.",
          reasons: ev.reasons,
        };
        drafts.push(cur);
        cur = newDraft();
      } else if (ev.type === "session") {
        sessionId = ev.sessionId;
      } else if (ev.type === "done") {
        if (ev.answer) cur.answer = ev.answer;
        if (ev.sessionId) sessionId = ev.sessionId;
      }
    }
  } catch (err) {
    write({ type: "error", message: (err as Error)?.message ?? String(err) });
  } finally {
    // Push the live (final) draft if it has content.
    if (cur.answer.trim().length > 0) drafts.push(cur);
    if (drafts.length > 0) {
      await store.appendTurn(convo.id, { question, drafts }, sessionId);
    }
    res.end();
    // Release the per-conversation lock — only if WE still own the slot
    // (another request may have taken it after us; rare but possible).
    if (inflight.get(convo.id) === lockHeld) inflight.delete(convo.id);
    releaseLock();
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

async function handleRenderJs(res: ServerResponse): Promise<void> {
  try {
    const js = await readFile(RENDER_JS, "utf8");
    res.writeHead(200, { "content-type": "application/javascript; charset=utf-8" });
    res.end(js);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("render.js not found");
  }
}

const store = new ConversationStore(DATA_FILE);
let agent: OffshoreaiAgent;
try {
  agent = await createOffshoreaiAgent({ repoRoot: REPO_ROOT, tagIndexPath: TAG_INDEX });
} catch (err) {
  process.stderr.write(`offshoreai web UI: failed to initialise agent — ${(err as Error)?.message ?? String(err)}\n`);
  process.exit(2);
}

const server = createServer((req, res) => {
  // Reject DNS-rebinding-style requests when we're loopback-only.
  if (!hostAllowed(req)) {
    res.writeHead(403, { "content-type": "text/plain" });
    res.end("forbidden host");
    return;
  }

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
    if (!UUID_RE.test(id)) {
      sendJson(res, 400, { error: "invalid conversation id" });
      return;
    }
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
  if (method === "GET" && url === "/render.js") {
    void handleRenderJs(res);
    return;
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
});

server.listen(PORT, BIND, () => {
  process.stderr.write(
    `offshoreai web UI on http://${IS_LOCAL_BIND ? "localhost" : BIND}:${PORT}  ` +
      `(bind=${BIND}, repoRoot=${REPO_ROOT})\n`,
  );
});
