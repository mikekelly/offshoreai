// Smoke tests for hier-tree and tag-index compilers.

import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { compileHierTree } from "../src/compile/hier-tree.js";
import { compileTagIndex } from "../src/compile/tag-index.js";

async function makeFixtureRepo(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "offshoreai-compile-"));
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
- \`firewall\` — Article 9 firewall protection
- \`mistake\` — mistake-based remedies
- \`royal-court\` — Royal Court procedure
- \`trusts-law-1984\` — Trusts (Jersey) Law 1984
- \`concept-file\` — concept-driven content file
- \`case-law\` — file is primarily about case law
- \`tax\` — Jersey tax
- \`zero-ten\` — Jersey corporate income tax structure
- \`index\` — section orientation document
`;

const TRUSTS_INDEX = `---
title: Trusts (section)
jurisdiction: jersey
category: trusts
status: stable
last_verified: 2026-05-14
tags:
  - trusts
  - jersey
  - index
---

# Trusts

Section index.
`;

const FIREWALL_FILE = `---
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
  - case-law
articles_covered:
  - "9"
sources:
  - title: TJL 1984
    url: https://example.com
    accessed: 2026-05-14
    kind: statute
---

# Firewall body.
`;

const MISTAKE_FILE = `---
title: Article 47 — Mistake
jurisdiction: jersey
category: trusts
status: draft
last_verified: 2026-05-14
tags:
  - trusts
  - jersey
  - mistake
  - royal-court
  - trusts-law-1984
articles_covered:
  - "47"
  - "47A"
sources:
  - title: TJL 1984
    url: https://example.com
    accessed: 2026-05-14
    kind: statute
---

# Mistake body.
`;

const TAX_INDEX = `---
title: Tax (section)
jurisdiction: jersey
category: tax
status: stable
last_verified: 2026-05-14
tags:
  - tax
  - jersey
  - index
---

# Tax index.
`;

const ZERO_TEN = `---
title: Zero-ten
jurisdiction: jersey
category: tax
status: stable
last_verified: 2026-05-14
tags:
  - tax
  - jersey
  - zero-ten
  - concept-file
sources:
  - title: ITL 1961
    url: https://example.com
    accessed: 2026-05-14
    kind: statute
---

# Zero-ten body.
`;

describe("compileTagIndex", () => {
  it("emits an inverted index and a co-occurrence matrix", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/index.md": TRUSTS_INDEX,
      "knowledge/jersey/trusts/firewall.md": FIREWALL_FILE,
      "knowledge/jersey/trusts/article-47.md": MISTAKE_FILE,
      "knowledge/jersey/tax/index.md": TAX_INDEX,
      "knowledge/jersey/tax/zero-ten.md": ZERO_TEN,
    });
    const index = await compileTagIndex({ repoRoot: root });

    // jersey tag is on all 5 fixture files (counting index files).
    expect(index.tagToFiles["jersey"]?.length).toBe(5);

    // trusts tag on 3 files (index + 2 concept).
    expect(index.tagToFiles["trusts"]?.length).toBe(3);

    // firewall tag only on firewall.md.
    expect(index.tagToFiles["firewall"]).toEqual(["knowledge/jersey/trusts/firewall.md"]);

    // Co-occurrence: trusts and trusts-law-1984 should co-occur on 2 files.
    expect(index.coOccurrence["trusts"]?.["trusts-law-1984"]).toBe(2);

    // Sorted, deterministic.
    const tagKeys = Object.keys(index.tagToFiles);
    expect(tagKeys).toEqual([...tagKeys].sort());
  });
});

describe("compileHierTree", () => {
  it("builds a tree with section indexes as parents of concept files", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/index.md": TRUSTS_INDEX,
      "knowledge/jersey/trusts/firewall.md": FIREWALL_FILE,
      "knowledge/jersey/trusts/article-47.md": MISTAKE_FILE,
      "knowledge/jersey/tax/index.md": TAX_INDEX,
      "knowledge/jersey/tax/zero-ten.md": ZERO_TEN,
    });
    const tree = await compileHierTree({
      repoRoot: root,
      asOf: new Date("2026-05-18T00:00:00Z"),
    });

    expect(tree.roots.length).toBe(1); // knowledge/jersey
    expect(tree.roots[0]?.path.startsWith("knowledge/jersey")).toBe(true);

    const jersey = tree.roots[0]!;
    // Two section children: trusts and tax.
    expect(jersey.children.length).toBe(2);

    const trusts = jersey.children.find((c) => c.path.includes("trusts"));
    expect(trusts).toBeDefined();
    expect(trusts!.path).toBe("knowledge/jersey/trusts/index.md");
    expect(trusts!.title).toBe("Trusts (section)");
    expect(trusts!.children.length).toBe(2); // firewall + article-47
    expect(trusts!.children.map((c) => c.path).sort()).toEqual([
      "knowledge/jersey/trusts/article-47.md",
      "knowledge/jersey/trusts/firewall.md",
    ]);

    // ageDays computed against asOf 2026-05-18; last_verified 2026-05-14 → 4 days.
    const fw = trusts!.children.find((c) => c.path.endsWith("firewall.md"))!;
    expect(fw.ageDays).toBe(4);
    expect(fw.articlesCovered).toEqual(["9"]);
  });
});
