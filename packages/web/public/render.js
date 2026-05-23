// Pure rendering helpers for the web UI — the single source of truth.
//
// Loaded by the SPA as an ES module (`<script type="module">` in index.html)
// AND imported directly by vitest tests in ../test/render.test.ts. The same
// code runs in both places so the tests are real (no copy-paste drift).
//
// All functions are pure and DOM-free.

export const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Attribute-safe escape — extends esc() with " and ' so the value can sit
// inside an HTML attribute (e.g. href="…") without breaking out.
export const escAttr = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

// URL scheme allow-list — block javascript:/data:/file: etc. coming from
// model output or corpus frontmatter before we ever set href.
export const isSafeUrl = (u) =>
  /^(https?:\/\/|mailto:|\/|\.\/|\.\.\/|#)/i.test(String(u || "").trim());

// Inline-level markdown: code spans, links, bold, italic. Links to unsafe
// schemes render as plain text (already-escaped from esc()).
export function inlineMd(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, (_m, c) => "<code>" + c + "</code>");
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, u) => {
    if (!isSafeUrl(u)) return _m;
    return `<a href="${escAttr(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  return s;
}

// Minimal markdown → HTML renderer covering what the agent emits:
// headings, fenced code, blockquote, ordered/unordered lists, paragraphs.
export function mdToHtml(md) {
  const lines = String(md).split("\n");
  let html = "",
    i = 0,
    inUl = false,
    inOl = false;
  const closeLists = () => {
    if (inUl) {
      html += "</ul>";
      inUl = false;
    }
    if (inOl) {
      html += "</ol>";
      inOl = false;
    }
  };
  const isBlock = (l) => /^(#{1,6}\s|>|```|\s*[-*]\s|\s*\d+\.\s)/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      closeLists();
      i++;
      let code = "";
      while (i < lines.length && !/^```/.test(lines[i])) {
        code += lines[i] + "\n";
        i++;
      }
      i++;
      html += "<pre><code>" + esc(code) + "</code></pre>";
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists();
      const lvl = h[1].length;
      html += `<h${lvl}>` + inlineMd(h[2]) + `</h${lvl}>`;
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      closeLists();
      let bq = "";
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        bq += lines[i].replace(/^>\s?/, "") + " ";
        i++;
      }
      html += "<blockquote>" + inlineMd(bq.trim()) + "</blockquote>";
      continue;
    }
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ol) {
      if (inUl) {
        html += "</ul>";
        inUl = false;
      }
      if (!inOl) {
        html += "<ol>";
        inOl = true;
      }
      html += "<li>" + inlineMd(ol[1]) + "</li>";
      i++;
      continue;
    }
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ul) {
      if (inOl) {
        html += "</ol>";
        inOl = false;
      }
      if (!inUl) {
        html += "<ul>";
        inUl = true;
      }
      html += "<li>" + inlineMd(ul[1]) + "</li>";
      i++;
      continue;
    }
    if (/^\s*$/.test(line)) {
      closeLists();
      i++;
      continue;
    }
    closeLists();
    let para = line;
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlock(lines[i])) {
      para += " " + lines[i];
      i++;
    }
    html += "<p>" + inlineMd(para) + "</p>";
  }
  closeLists();
  return html;
}

// Strip a trailing "Cited files" / "Corpus provenance" / "Sources" list of
// internal knowledge/*.md paths from a rendered answer — the Sources &
// freshness panel replaces it and the user shouldn't see corpus paths.
// (The verifier already ran server-side against the full text.)
export function stripProvenance(md) {
  const lines = String(md).split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^#{1,6}\s+(cited files|corpus provenance|sources)\b/i.test(lines[i])) {
      const tail = lines.slice(i).join("\n");
      if (/knowledge\/[A-Za-z0-9._/-]+\.md/.test(tail)) {
        return lines.slice(0, i).join("\n").replace(/\s+$/, "") + "\n";
      }
    }
  }
  return md;
}
