#!/usr/bin/env node
// Live-refresh preview server for the design lookbook (and any static design /
// marketing artifact under docs/product/lookbook/). Node built-ins only — zero
// npm dependencies, matching the repo's hand-rolled node:http / tsx style.
//
// Two jobs:
//   1. Serve the static lookbook files under this directory.
//   2. Extract the REAL app CSS from packages/web/public/index.html (the live
//      <style> block — the single source of truth for the design tokens) and
//      serve it at /app.css, so the lookbook renders against the same CSS the
//      app ships. The lookbook NEVER copies the CSS; it cannot drift.
//   3. Watch this directory AND the app index.html, and push an SSE reload to
//      the browser on any change — so editing the lookbook OR the app CSS
//      reflects instantly with no manual rebuild.
//
// This is a DEV-ONLY tool. It serves files unauthenticated and must never be a
// production surface. It makes ZERO API calls and never touches the agent.
//
// Usage:
//   node docs/product/lookbook/preview.js [port]   (default port 4321)
//   pnpm --filter @offshoreai/web lookbook

import http from "node:http";
import { readFile, readFileSync } from "node:fs";
import { watch } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = HERE; // docs/product/lookbook
const REPO_ROOT = resolve(HERE, "..", "..", "..");
const APP_INDEX = resolve(REPO_ROOT, "packages", "web", "public", "index.html");
const PORT = Number(process.argv[2] ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

// Injected into every HTML response: open an SSE channel, reload on change.
const CLIENT = `<script>new EventSource('/__reload').onmessage=()=>location.reload();</script>`;

// Pull the live <style> block out of the real app index.html. This is the
// single source of truth for the tokens/CSS — we serve exactly what the app
// serves, so the lookbook cannot drift from production.
function extractAppCss() {
  let html;
  try {
    html = readFileSync(APP_INDEX, "utf8");
  } catch {
    return `/* could not read ${APP_INDEX} — is the path right? */`;
  }
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!m) return `/* no <style> block found in ${APP_INDEX} */`;
  return `/* AUTO-EXTRACTED from packages/web/public/index.html <style> block.\n` +
    `   This is the live app CSS — the single source of truth. Do not edit here;\n` +
    `   edit the app CSS (and DESIGN_SYSTEM.md tokens) and this updates on reload. */\n` +
    m[1];
}

/** @type {Set<import('node:http').ServerResponse>} */
const clients = new Set();

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);

  if (url === "/__reload") {
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive",
    });
    res.write("\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  // The real app CSS, extracted live on every request.
  if (url === "/app.css") {
    res.writeHead(200, { "content-type": TYPES[".css"] });
    res.end(extractAppCss());
    return;
  }

  let path = url.endsWith("/") ? url + "index.html" : url;
  const file = join(ROOT, path);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("forbidden");
    return;
  }

  readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404).end("not found");
      return;
    }
    const ext = extname(file).toLowerCase();
    let body = buf;
    if (ext === ".html") body = buf.toString().replace("</body>", CLIENT + "</body>");
    res.writeHead(200, { "content-type": TYPES[ext] ?? "application/octet-stream" });
    res.end(body);
  });
});

function reloadAll() {
  for (const res of clients) res.write("data: reload\n\n");
}

// Watch the lookbook tree (its own files) and the app index.html (the CSS).
watch(ROOT, { recursive: true }, reloadAll);
try {
  watch(APP_INDEX, reloadAll);
} catch {
  /* index.html watch is best-effort; the recursive watch above is the floor */
}

server.listen(PORT, "127.0.0.1", () => {
  process.stderr.write(
    `lookbook preview on http://localhost:${PORT}  ` +
      `(serving ${ROOT}, app CSS from ${APP_INDEX}, live-reload on)\n`,
  );
});
