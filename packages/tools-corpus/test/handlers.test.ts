// Handler smoke tests against a small fixture corpus.
// Each handler is the SdkMcpToolDefinition shape; we invoke its
// `handler` function directly without going through the SDK loop.

import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildCorpusContext } from "../src/context.js";
import { makeFindByTagTool } from "../src/handlers/findByTag.js";
import { makeFreshnessCheckTool } from "../src/handlers/freshnessCheck.js";
import { makeGetArticleTool } from "../src/handlers/getArticle.js";
import { makeGetFileTool } from "../src/handlers/getFile.js";

async function makeFixtureRepo(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "tools-corpus-"));
  for (const [relPath, body] of Object.entries(files)) {
    const abs = join(root, relPath);
    await mkdir(join(abs, ".."), { recursive: true });
    await writeFile(abs, body, "utf8");
  }
  return root;
}

const TAGS_MD = `# Tags
- \`trusts\` — Jersey trust law
- \`jersey\` — jurisdiction marker
- \`firewall\` — Article 9 firewall
- \`mistake\` — mistake-based remedies
- \`trusts-law-1984\` — Trusts (Jersey) Law 1984
- \`concept-file\` — concept
- \`stub\` — stub
`;

const FIREWALL = `---
title: Article 9 Firewall
jurisdiction: jersey
category: trusts
status: stable
last_verified: 2026-05-14
tags:
  - trusts
  - jersey
  - firewall
  - trusts-law-1984
  - concept-file
articles_covered:
  - "9"
sources:
  - title: TJL
    url: https://example.com/tjl
    accessed: 2026-05-14
    kind: statute
---

# Firewall body
Some content about Article 9.
`;

const MISTAKE = `---
title: Article 47 — Mistake
jurisdiction: jersey
category: trusts
status: stable
last_verified: 2025-01-01
tags:
  - trusts
  - jersey
  - mistake
  - trusts-law-1984
  - concept-file
articles_covered:
  - "47"
  - "47A"
sources:
  - title: TJL
    url: https://example.com/tjl
    accessed: 2026-05-14
    kind: statute
---

# Mistake body
Older file, deliberately set to test stale.
`;

const STUB = `---
title: Stub thing
jurisdiction: jersey
category: trusts
status: stub
last_verified: 2026-05-14
tags:
  - trusts
  - jersey
  - mistake
  - trusts-law-1984
  - concept-file
---

(stub)
`;

async function makeCtx() {
  const root = await makeFixtureRepo({
    "TAGS.md": TAGS_MD,
    "knowledge/jersey/trusts/firewall.md": FIREWALL,
    "knowledge/jersey/trusts/article-47-mistake.md": MISTAKE,
    "knowledge/jersey/trusts/stub.md": STUB,
  });
  return buildCorpusContext({ repoRoot: root });
}

describe("getFile", () => {
  it("returns body + frontmatter projection", async () => {
    const ctx = await makeCtx();
    const t = makeGetFileTool(ctx);
    const result = await t.handler({ path: "knowledge/jersey/trusts/firewall.md", full: false, fields: undefined }, {});
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    expect(text).toContain("path: knowledge/jersey/trusts/firewall.md");
    expect(text).toContain("status: stable");
    expect(text).toContain("Firewall body");
  });

  it("refuses on stub", async () => {
    const ctx = await makeCtx();
    const t = makeGetFileTool(ctx);
    const result = await t.handler({ path: "knowledge/jersey/trusts/stub.md", full: false, fields: undefined }, {});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("error_kind: stub_file");
  });

  it("errors on missing path", async () => {
    const ctx = await makeCtx();
    const t = makeGetFileTool(ctx);
    const result = await t.handler({ path: "knowledge/jersey/nope.md", full: false, fields: undefined }, {});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("error_kind: missing_file");
  });
});

describe("getArticle", () => {
  it("dispatches (statute, article) → canonical file", async () => {
    const ctx = await makeCtx();
    const t = makeGetArticleTool(ctx);
    const result = await t.handler({ statute: "trusts-law-1984", article: "47A" }, {});
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).toContain("canonical_path: knowledge/jersey/trusts/article-47-mistake.md");
    expect(result.content[0].text).toContain("covers_articles: 47|47A");
  });

  it("errors on unknown article", async () => {
    const ctx = await makeCtx();
    const t = makeGetArticleTool(ctx);
    const result = await t.handler({ statute: "trusts-law-1984", article: "999" }, {});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("error_kind: invalid_article");
  });
});

describe("findByTag did-you-mean", () => {
  it("suggests the closest valid tag when input is a near-miss", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/firewall.md": FIREWALL,
      "knowledge/jersey/trusts/article-47-mistake.md": MISTAKE,
      "knowledge/jersey/trusts/stub.md": STUB,
    });
    // We need a tag-index for the suggestion path — write one synthesised
    // from the fixture and pass it through buildCorpusContext.
    const tagIndex = {
      schemaVersion: "tag_index_v1",
      tagToFiles: {
        "firewall": ["knowledge/jersey/trusts/firewall.md"],
        "setting-aside": ["knowledge/jersey/trusts/article-47-mistake.md"],
        "mistake": ["knowledge/jersey/trusts/article-47-mistake.md"],
      },
      coOccurrence: {},
      stats: { uniqueTags: 3, totalTagApplications: 3, filesIndexed: 3 },
    };
    await writeFile(join(root, "tag-index.json"), JSON.stringify(tagIndex), "utf8");

    const ctx = await buildCorpusContext({ repoRoot: root, tagIndexPath: "tag-index.json" });
    const t = makeFindByTagTool(ctx);
    // Agent guesses "set-aside" — the canonical is "setting-aside".
    const result = await t.handler({ tags: ["set-aside"], mode: "and", section: undefined, status: undefined, limit: 20 }, {});
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("error_kind: invalid_tag");
    expect(result.content[0].text).toContain("setting-aside");
    expect(result.content[0].text).toContain("did you mean");
  });
});

describe("findByTag", () => {
  it("returns AND-intersection by default", async () => {
    const ctx = await makeCtx();
    const t = makeFindByTagTool(ctx);
    const result = await t.handler({ tags: ["mistake", "concept-file"], mode: "and", section: undefined, status: undefined, limit: 20 }, {});
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).toContain("knowledge/jersey/trusts/article-47-mistake.md");
    expect(result.content[0].text).toContain("knowledge/jersey/trusts/stub.md"); // stub still in findByTag — it's getFile that refuses on stub
  });

  it("OR-unions when mode=or", async () => {
    const ctx = await makeCtx();
    const t = makeFindByTagTool(ctx);
    const result = await t.handler({ tags: ["firewall"], mode: "or", section: undefined, status: undefined, limit: 20 }, {});
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).toContain("knowledge/jersey/trusts/firewall.md");
  });

  it("filters by status", async () => {
    const ctx = await makeCtx();
    const t = makeFindByTagTool(ctx);
    const result = await t.handler({ tags: ["trusts"], mode: "and", section: undefined, status: ["stable"], limit: 20 }, {});
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).not.toContain("knowledge/jersey/trusts/stub.md");
  });

  it("returns definitive empty state on zero matches", async () => {
    const ctx = await makeCtx();
    const t = makeFindByTagTool(ctx);
    const result = await t.handler({ tags: ["mistake", "firewall"], mode: "and", section: undefined, status: undefined, limit: 20 }, {});
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).toContain("count: 0");
    expect(result.content[0].text).toContain("No files matched");
  });
});

describe("freshnessCheck", () => {
  it("classifies fresh / warn / stale per default thresholds", async () => {
    const ctx = await makeCtx();
    const t = makeFreshnessCheckTool(ctx);
    const result = await t.handler({
      paths: ["knowledge/jersey/trusts/firewall.md", "knowledge/jersey/trusts/article-47-mistake.md"],
      warnDays: 180,
      staleDays: 365,
    }, {});
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    // firewall.md last_verified is 2026-05-14 → fresh (≤180d as of run date 2026-05-19)
    // article-47-mistake.md last_verified is 2025-01-01 → stale (>365d)
    expect(text).toContain("worst_verdict: stale");
    expect(text).toMatch(/jersey\/trusts\/firewall\.md,2026-05-14,\d+,stable,fresh/);
    expect(text).toMatch(/jersey\/trusts\/article-47-mistake\.md,2025-01-01,\d+,stable,stale/);
  });

  it("reports missing paths", async () => {
    const ctx = await makeCtx();
    const t = makeFreshnessCheckTool(ctx);
    const result = await t.handler({ paths: ["knowledge/jersey/nope.md"], warnDays: 180, staleDays: 365 }, {});
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).toContain("missing");
  });
});
