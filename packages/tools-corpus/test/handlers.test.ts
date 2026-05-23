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
import { makeTreeTool } from "../src/handlers/tree.js";

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

  it("filters by section under knowledge/<jurisdiction>/<section>", async () => {
    const ctx = await makeCtx();
    const t = makeFindByTagTool(ctx);
    const result = await t.handler({ tags: ["trusts"], mode: "and", section: "trusts", status: undefined, limit: 20 }, {});
    expect(result.isError).toBeFalsy();
    expect(result.content[0].text).toContain("knowledge/jersey/trusts/firewall.md");
    expect(result.content[0].text).toContain("knowledge/jersey/trusts/article-47-mistake.md");
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

const JERSEY_INDEX = `---
title: Jersey
jurisdiction: jersey
category: index
status: stable
last_verified: 2026-05-14
---

# Jersey

Some opening prose about Jersey.

### [Trusts](./trusts/index.md)
The Jersey trusts section.

### [Tax](./tax/index.md)
The Jersey tax section.
`;

const TRUSTS_INDEX = `---
title: Trusts
jurisdiction: jersey
category: trusts
status: stable
last_verified: 2026-05-14
---

# Trusts

Opening prose about the trusts section.

## Sections

- [Firewall](./firewall.md) — Article 9 firewall
- [Mistake](./article-47-mistake.md) — Article 47 set-aside

## Cross-references

- [Tax index](../tax/index.md) — only a cross-reference, not a structural child
`;

const TAX_INDEX = `---
title: Tax
jurisdiction: jersey
category: tax
status: stable
last_verified: 2026-05-14
---

# Tax

Opening prose about the tax section.
`;

async function makeInclusionCtx() {
  const root = await makeFixtureRepo({
    "TAGS.md": TAGS_MD,
    "knowledge/jersey/index.md": JERSEY_INDEX,
    "knowledge/jersey/trusts/index.md": TRUSTS_INDEX,
    "knowledge/jersey/trusts/firewall.md": FIREWALL,
    "knowledge/jersey/trusts/article-47-mistake.md": MISTAKE,
    "knowledge/jersey/tax/index.md": TAX_INDEX,
  });
  return buildCorpusContext({ repoRoot: root });
}

describe("inclusion-link graph (precomputed on context)", () => {
  it("populates inclusionChildren for index files", async () => {
    const ctx = await makeInclusionCtx();
    expect(ctx.inclusionChildren.get("knowledge/jersey/index.md")).toEqual([
      "knowledge/jersey/trusts/index.md",
      "knowledge/jersey/tax/index.md",
    ]);
    expect(ctx.inclusionChildren.get("knowledge/jersey/trusts/index.md")).toEqual([
      "knowledge/jersey/trusts/firewall.md",
      "knowledge/jersey/trusts/article-47-mistake.md",
    ]);
  });

  it("excludes links under '## Cross-references' from the structural graph", async () => {
    const ctx = await makeInclusionCtx();
    const trustsChildren = ctx.inclusionChildren.get("knowledge/jersey/trusts/index.md");
    expect(trustsChildren).not.toContain("knowledge/jersey/tax/index.md");
  });

  it("populates inclusionParents inversely", async () => {
    const ctx = await makeInclusionCtx();
    expect(ctx.inclusionParents.get("knowledge/jersey/trusts/index.md")).toEqual([
      "knowledge/jersey/index.md",
    ]);
    expect(ctx.inclusionParents.get("knowledge/jersey/trusts/firewall.md")).toEqual([
      "knowledge/jersey/trusts/index.md",
    ]);
  });
});

describe("getFile with inclusion-graph params", () => {
  it("returns just the file when depth=0", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeGetFileTool(ctx);
    const result = await t.handler(
      { path: "knowledge/jersey/trusts/index.md", full: false, fields: undefined, depth: 0, parentContext: 0 },
      {},
    );
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    expect(text).toContain("path: knowledge/jersey/trusts/index.md");
    expect(text).not.toContain("included_children_count");
  });

  it("includes immediate structural children when depth=1", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeGetFileTool(ctx);
    const result = await t.handler(
      { path: "knowledge/jersey/trusts/index.md", full: false, fields: undefined, depth: 1, parentContext: 0 },
      {},
    );
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    expect(text).toContain("included_children_count: 2");
    expect(text).toContain("child path=knowledge/jersey/trusts/firewall.md depth=1");
    expect(text).toContain("child path=knowledge/jersey/trusts/article-47-mistake.md depth=1");
  });

  it("includes structural parents when parentContext=1", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeGetFileTool(ctx);
    const result = await t.handler(
      { path: "knowledge/jersey/trusts/firewall.md", full: false, fields: undefined, depth: 0, parentContext: 1 },
      {},
    );
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    expect(text).toContain("included_parents_count: 1");
    expect(text).toContain("parent path=knowledge/jersey/trusts/index.md level=1");
  });

  it("walks both parents (level=2) when parentContext=2", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeGetFileTool(ctx);
    const result = await t.handler(
      { path: "knowledge/jersey/trusts/firewall.md", full: false, fields: undefined, depth: 0, parentContext: 2 },
      {},
    );
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    expect(text).toContain("included_parents_count: 2");
    expect(text).toContain("parent path=knowledge/jersey/trusts/index.md level=1");
    expect(text).toContain("parent path=knowledge/jersey/index.md level=2");
  });
});

describe("tree", () => {
  it("walks the inclusion-link graph from a root", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeTreeTool(ctx);
    const result = await t.handler(
      { root: "knowledge/jersey/index.md", depth: 2, includeSummaries: false },
      {},
    );
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    expect(text).toContain("root: knowledge/jersey/index.md");
    expect(text).toContain("node_count: 4");
    expect(text).toContain("knowledge/jersey/trusts/index.md");
    expect(text).toContain("knowledge/jersey/trusts/firewall.md");
    expect(text).toContain("knowledge/jersey/trusts/article-47-mistake.md");
    expect(text).toContain("knowledge/jersey/tax/index.md");
  });

  it("respects depth=1 (only direct children)", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeTreeTool(ctx);
    const result = await t.handler(
      { root: "knowledge/jersey/index.md", depth: 1, includeSummaries: false },
      {},
    );
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    expect(text).toContain("node_count: 2");
    expect(text).toContain("truncated_at_depth: true");
    expect(text).not.toContain("knowledge/jersey/trusts/firewall.md");
  });

  it("returns heuristic summaries when includeSummaries=true", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeTreeTool(ctx);
    const result = await t.handler(
      { root: "knowledge/jersey/index.md", depth: 1, includeSummaries: true },
      {},
    );
    expect(result.isError).toBeFalsy();
    const text = result.content[0].text;
    // Summary is the first prose paragraph after the H1, stripped of markdown.
    expect(text).toContain("Opening prose about the trusts section");
  });

  it("errors when the root path is missing", async () => {
    const ctx = await makeInclusionCtx();
    const t = makeTreeTool(ctx);
    const result = await t.handler(
      { root: "knowledge/jersey/nope.md", depth: 2, includeSummaries: false },
      {},
    );
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("error_kind: missing_file");
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
