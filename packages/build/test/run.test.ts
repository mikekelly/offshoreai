// Smoke tests for the convention validator.
//
// These test the validator against small fixture corpora rather than
// the real Jersey content — the real-content baseline lives at
// evals/conformance-baseline.yaml and is regenerated separately.

import { describe, expect, it } from "vitest";
import { mkdtemp, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateCorpus } from "../src/validate/run.js";

async function makeFixtureRepo(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "offshoreai-validate-"));
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
- \`fiduciary-duty\` — duties owed by trustees
- \`case-law\` — file is primarily about case law
- \`cross-border-tax\` — international tax interaction
- \`hastings-bass\` — pre-2013 doctrine
- \`setting-aside\` — set-aside / rescission application
`;

const VALID_FRONTMATTER = `---
title: Test Concept
jurisdiction: jersey
category: trusts
status: stable
last_verified: 2026-05-14
tags:
  - trusts
  - jersey
  - firewall
  - mistake
  - royal-court
  - trusts-law-1984
sources:
  - title: Trusts Law
    url: https://example.com/trusts
    accessed: 2026-05-14
    kind: statute
see_also:
  - ./other.md
---

# Body

Some content.
`;

describe("validateCorpus", () => {
  it("passes a well-formed concept file", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": VALID_FRONTMATTER,
      "knowledge/jersey/trusts/other.md": VALID_FRONTMATTER,
    });
    const result = await validateCorpus({ repoRoot: root });
    expect(result.violations).toEqual([]);
    expect(result.filesScanned).toBe(2);
    expect(result.filesWithFrontmatter).toBe(2);
  });

  it("flags an invented tag", async () => {
    const file = VALID_FRONTMATTER.replace("  - firewall", "  - made-up-tag");
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": file,
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    const kinds = result.violations.map((v) => v.kind);
    expect(kinds).toContain("unknown_tag");
  });

  it("flags missing frontmatter on a non-meta file", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/no-frontmatter.md": "# Just a heading, no frontmatter.\n",
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    expect(result.violations[0]?.kind).toBe("missing_frontmatter");
  });

  it("skips README.md as a meta file", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/README.md": "# Jersey README — no frontmatter expected.\n",
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    expect(result.violations).toEqual([]);
  });

  it("flags too few tags", async () => {
    const file = VALID_FRONTMATTER.replace(
      `tags:
  - trusts
  - jersey
  - firewall
  - mistake
  - royal-court
  - trusts-law-1984`,
      `tags:
  - trusts
  - jersey`,
    );
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": file,
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    expect(result.violations.some((v) => v.kind === "too_few_tags")).toBe(true);
  });

  it("flags broken see_also", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": VALID_FRONTMATTER,
      // no other.md created
    });
    const result = await validateCorpus({ repoRoot: root });
    expect(result.violations.some((v) => v.kind === "broken_see_also")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Derived-node (wormhole) rules
// ---------------------------------------------------------------------------

const WORMHOLE_FRONTMATTER = (extra: string) => `---
title: TopCo Listing Wormhole
jurisdiction: jersey
category: trusts
status: draft
last_verified: 2026-05-14
tags:
  - trusts
  - jersey
  - firewall
  - mistake
  - royal-court
  - trusts-law-1984
derived: true
${extra}
---

# Distilled context

Body.
`;

describe("derived-node (wormhole) rules", () => {
  it("passes a well-formed wormhole citing a primary node", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": VALID_FRONTMATTER,
      "knowledge/jersey/trusts/other.md": VALID_FRONTMATTER,
      "knowledge/jersey/trusts/wh.md": WORMHOLE_FRONTMATTER(
        `derived_from:
  - path: knowledge/jersey/trusts/concept.md`,
      ),
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    const derivedViolations = result.violations.filter((v) => v.kind.startsWith("derived_"));
    expect(derivedViolations).toEqual([]);
  });

  it("flags a derived node with no derived_from", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/wh.md": WORMHOLE_FRONTMATTER(""),
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    expect(result.violations.some((v) => v.kind === "derived_missing_sources")).toBe(true);
  });

  it("flags a dangling derived_from source", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/wh.md": WORMHOLE_FRONTMATTER(
        `derived_from:
  - path: knowledge/jersey/trusts/does-not-exist.md`,
      ),
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    expect(result.violations.some((v) => v.kind === "derived_source_missing")).toBe(true);
  });

  it("flags second-order derivation (a wormhole citing another wormhole)", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": VALID_FRONTMATTER,
      // first wormhole — derives from a primary node (valid)
      "knowledge/jersey/trusts/wh1.md": WORMHOLE_FRONTMATTER(
        `derived_from:
  - path: knowledge/jersey/trusts/concept.md`,
      ),
      // second wormhole — derives from the first wormhole (forbidden)
      "knowledge/jersey/trusts/wh2.md": WORMHOLE_FRONTMATTER(
        `derived_from:
  - path: knowledge/jersey/trusts/wh1.md`,
      ),
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    const secondOrder = result.violations.filter((v) => v.kind === "derived_second_order");
    expect(secondOrder.length).toBe(1);
    expect(secondOrder[0]?.path).toBe("knowledge/jersey/trusts/wh2.md");
  });

  it("flags a derived node that is stable without verifier_passed", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": VALID_FRONTMATTER,
      "knowledge/jersey/trusts/wh.md": WORMHOLE_FRONTMATTER(
        `status_override: ignored
derived_from:
  - path: knowledge/jersey/trusts/concept.md`,
      ).replace("status: draft", "status: stable"),
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    expect(result.violations.some((v) => v.kind === "derived_unverified_stable")).toBe(true);
  });

  it("allows a derived node to be stable when verifier_passed is true", async () => {
    const root = await makeFixtureRepo({
      "TAGS.md": TAGS_MD,
      "knowledge/jersey/trusts/concept.md": VALID_FRONTMATTER,
      "knowledge/jersey/trusts/wh.md": WORMHOLE_FRONTMATTER(
        `verifier_passed: true
derived_from:
  - path: knowledge/jersey/trusts/concept.md`,
      ).replace("status: draft", "status: stable"),
    });
    const result = await validateCorpus({ repoRoot: root, checkLinks: false });
    expect(result.violations.some((v) => v.kind === "derived_unverified_stable")).toBe(false);
  });
});
