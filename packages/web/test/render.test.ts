// Tests for the pure rendering helpers in ../public/render.js. Imports the
// same module the SPA loads, so what's tested is exactly what ships.

import { describe, expect, it } from "vitest";
// @ts-expect-error — render.js is plain JS, no .d.ts shim
import { esc, escAttr, isSafeUrl, inlineMd, mdToHtml, stripProvenance } from "../public/render.js";

describe("esc", () => {
  it("escapes &, <, > but not quotes", () => {
    expect(esc("a & b < c > d \"e' f")).toBe("a &amp; b &lt; c &gt; d \"e' f");
  });
  it("coerces non-strings", () => {
    expect(esc(42)).toBe("42");
    expect(esc(null)).toBe("null");
  });
});

describe("escAttr (attribute-safe)", () => {
  it("escapes quotes too so attribute values can't break out", () => {
    expect(escAttr('" onclick="bad()" "')).toBe("&quot; onclick=&quot;bad()&quot; &quot;");
    expect(escAttr("a&b<c>d\"e'f")).toBe("a&amp;b&lt;c&gt;d&quot;e&#39;f");
  });
});

describe("isSafeUrl (URL scheme allow-list)", () => {
  it("allows http(s), mailto, relative, anchor", () => {
    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("http://example.com")).toBe(true);
    expect(isSafeUrl("mailto:x@y.z")).toBe(true);
    expect(isSafeUrl("/local")).toBe(true);
    expect(isSafeUrl("./rel")).toBe(true);
    expect(isSafeUrl("../rel")).toBe(true);
    expect(isSafeUrl("#anchor")).toBe(true);
  });
  it("blocks javascript:, data:, file:, vbscript:, etc.", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("JAVASCRIPT:alert(1)")).toBe(false);
    expect(isSafeUrl(" javascript:alert(1)")).toBe(false); // leading whitespace
    expect(isSafeUrl("data:text/html,<script>")).toBe(false);
    expect(isSafeUrl("file:///etc/passwd")).toBe(false);
    expect(isSafeUrl("vbscript:msgbox")).toBe(false);
    expect(isSafeUrl("")).toBe(false);
    expect(isSafeUrl(null)).toBe(false);
  });
});

describe("inlineMd (links + code + emphasis)", () => {
  it("renders a safe markdown link with target=_blank rel=noopener", () => {
    const out = inlineMd("see [Article 9](https://www.jerseylaw.je/laws/current/l_11_1984)");
    expect(out).toBe(
      'see <a href="https://www.jerseylaw.je/laws/current/l_11_1984" target="_blank" rel="noopener noreferrer">Article 9</a>',
    );
  });
  it("XSS — does NOT render javascript: as a link; falls back to escaped literal", () => {
    const out = inlineMd("[click](javascript:alert(1))");
    expect(out).not.toContain("<a ");      // no anchor tag at all
    expect(out).not.toMatch(/href=/i);     // no href anywhere
    expect(out).toBe("[click](javascript:alert(1))"); // shown as literal text
  });
  it("XSS — blocks data: URIs", () => {
    const out = inlineMd("[x](data:text/html,<script>alert(1)</script>)");
    expect(out).not.toContain("<a ");
    expect(out).not.toMatch(/href=/i);
    expect(out).not.toContain("<script");  // the <script> tag must be escaped
  });
  it("attribute-escapes quotes in URLs even when scheme is safe", () => {
    const out = inlineMd('[x](https://a.com/?q="ok)');
    expect(out).toContain('href="https://a.com/?q=&quot;ok"');
  });
  it("renders inline code and bold", () => {
    expect(inlineMd("`Article 9(4)` is **load-bearing**")).toBe(
      "<code>Article 9(4)</code> is <strong>load-bearing</strong>",
    );
  });
  it("escapes HTML in plain text", () => {
    expect(inlineMd("<img onerror=...>")).toBe("&lt;img onerror=...&gt;");
  });
});

describe("mdToHtml (block-level)", () => {
  it("headings", () => {
    expect(mdToHtml("# h1\n## h2\n### h3")).toBe("<h1>h1</h1><h2>h2</h2><h3>h3</h3>");
  });
  it("ordered + unordered lists with inline formatting", () => {
    expect(mdToHtml("1. one\n2. **two**\n\n- a\n- b")).toBe(
      "<ol><li>one</li><li><strong>two</strong></li></ol><ul><li>a</li><li>b</li></ul>",
    );
  });
  it("blockquote and paragraph", () => {
    expect(mdToHtml("> a quote\n\nplain para")).toBe("<blockquote>a quote</blockquote><p>plain para</p>");
  });
  it("fenced code preserves content and escapes html", () => {
    expect(mdToHtml("```\n<script>x</script>\n```")).toBe("<pre><code>&lt;script&gt;x&lt;/script&gt;\n</code></pre>");
  });
  it("returns balanced open/close tags on a mixed input", () => {
    const html = mdToHtml("## Title\n\nA *para* with `code` and a [link](https://a.com).\n\n- one\n- two");
    for (const tag of ["h2", "p", "ul", "li", "em", "code", "a"]) {
      // open tag allows attributes (e.g. <a href="…">), close is bare
      const o = (html.match(new RegExp(`<${tag}(?:\\s[^>]*)?>`, "g")) || []).length;
      const c = (html.match(new RegExp(`</${tag}>`, "g")) || []).length;
      expect(o, `<${tag}> open vs close`).toBe(c);
    }
  });
});

describe("stripProvenance", () => {
  it("strips a trailing 'Cited files' list of knowledge/*.md paths", () => {
    const md =
      "The answer body.\n\n## Cited files\n1. `knowledge/jersey/trusts/firewall.md`\n2. `knowledge/jersey/index.md`\n";
    expect(stripProvenance(md)).toBe("The answer body.\n");
  });
  it("strips 'Corpus provenance' heading too", () => {
    const md = "Body.\n\n### Corpus provenance\n- knowledge/jersey/tax/gst.md\n";
    expect(stripProvenance(md)).toBe("Body.\n");
  });
  it("does NOT strip a 'Sources' heading whose section has no knowledge/*.md paths", () => {
    const md = "Body.\n\n## Sources\nA list of external citations only.\n";
    expect(stripProvenance(md)).toBe(md);
  });
  it("returns input unchanged when no provenance heading present", () => {
    const md = "Just a plain answer.\n";
    expect(stripProvenance(md)).toBe(md);
  });
  it("uses the LAST matching provenance heading", () => {
    const md =
      "## Cited files\n(early reference)\n\nMore body.\n\n## Cited files\n1. knowledge/x.md\n";
    const out = stripProvenance(md);
    expect(out).toContain("(early reference)");
    expect(out).not.toContain("knowledge/x.md");
  });
});
