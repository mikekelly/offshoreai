// Unit tests for the inclusion-link parser. Verifies CONVENTIONS.md's
// "link on its own line = structural; inline link = cross-reference"
// rule plus the excluded-heading scopes.

import { describe, expect, it } from "vitest";
import { extractInclusionLinkTargets, resolveInclusionTarget } from "../src/inclusion-links.js";

function targets(body: string): string[] {
  return extractInclusionLinkTargets(body).map((t) => t.rawTarget);
}

describe("extractInclusionLinkTargets", () => {
  it("recognises a bare-line bullet link", () => {
    expect(targets("- [foo](./foo.md)")).toEqual(["./foo.md"]);
  });

  it("recognises a heading-as-link", () => {
    expect(targets("### [Trusts](./trusts/index.md)")).toEqual(["./trusts/index.md"]);
  });

  it("recognises bare bracketed links with no list/heading prefix", () => {
    expect(targets("[plain](./plain.md)")).toEqual(["./plain.md"]);
  });

  it("ignores inline links inside prose", () => {
    expect(targets("See [Article 9](./firewall.md) for detail.")).toEqual([]);
  });

  it("ignores external URLs", () => {
    expect(targets("- [Jersey law](https://www.jerseylaw.je)")).toEqual([]);
  });

  it("strips anchor fragments from the target", () => {
    expect(targets("- [foo](./foo.md#section)")).toEqual(["./foo.md"]);
  });

  it("ignores links under a ## Cross-references heading", () => {
    const body = [
      "Intro prose.",
      "",
      "## Cross-references",
      "",
      "- [foo](./foo.md)",
      "- [bar](./bar.md)",
    ].join("\n");
    expect(targets(body)).toEqual([]);
  });

  it("ignores links under ## Sources, ## See also, ## References", () => {
    for (const heading of ["## Sources", "## See also", "## References", "## Related"]) {
      const body = `${heading}\n\n- [x](./x.md)\n`;
      expect(targets(body)).toEqual([]);
    }
  });

  it("resets exclusion when a new H2 heading appears", () => {
    const body = [
      "## Cross-references",
      "- [skipped](./skipped.md)",
      "",
      "## Next topic",
      "- [counted](./counted.md)",
    ].join("\n");
    expect(targets(body)).toEqual(["./counted.md"]);
  });

  it("propagates exclusion through H3 sub-sections", () => {
    const body = [
      "## Cross-references",
      "### Subsection",
      "- [still-skipped](./still-skipped.md)",
    ].join("\n");
    expect(targets(body)).toEqual([]);
  });

  it("ignores fenced code blocks", () => {
    const body = [
      "```",
      "- [in-code](./in-code.md)",
      "```",
      "",
      "- [counted](./counted.md)",
    ].join("\n");
    expect(targets(body)).toEqual(["./counted.md"]);
  });

  it("ignores reference-style link definitions", () => {
    expect(targets("[tjl]: https://www.jerseylaw.je/laws/current/l_11_1984")).toEqual([]);
  });

  it("accepts a trailing em-dash description after the link", () => {
    expect(targets("- [foo](./foo.md) — some description")).toEqual(["./foo.md"]);
  });

  it("accepts a trailing en-dash and hyphen description", () => {
    expect(targets("- [foo](./foo.md) – an en-dash")).toEqual(["./foo.md"]);
    expect(targets("- [foo](./foo.md) - a hyphen")).toEqual(["./foo.md"]);
  });

  it("treats a heading-as-link inside an excluded section as still excluded", () => {
    const body = [
      "## Cross-references",
      "### [Subitem](./sub.md)",
      "",
      "Some text.",
    ].join("\n");
    expect(targets(body)).toEqual([]);
  });

  it("does NOT match a wrapped bullet continuation as a bare-line link", () => {
    // This is the exact shape that produced a false positive against the
    // real corpus: a bullet whose prose wraps onto the next line with a
    // link plus trailing description.
    const body = [
      "- the trust's **firewall protection** under",
      "  [Article 9](./firewall.md) — though not formally dependent on a",
      "  related entity.",
    ].join("\n");
    expect(targets(body)).toEqual([]);
  });

  it("still matches a bare-line link with no marker and no trailing prose", () => {
    expect(targets("[foo](./foo.md)")).toEqual(["./foo.md"]);
    expect(targets("  [foo](./foo.md)  ")).toEqual(["./foo.md"]);
  });

  it("matches a bullet with a bold-wrapped link (common in index.md files)", () => {
    expect(targets("- **[`firewall.md`](./firewall.md)** — Article 9, the firewall.")).toEqual([
      "./firewall.md",
    ]);
  });

  it("matches a numbered-list inclusion link", () => {
    expect(targets("4. **[`firewall.md`](./firewall.md)** — Article 9, the most…")).toEqual([
      "./firewall.md",
    ]);
  });

  it("matches single-emphasis wrapping", () => {
    expect(targets("- *[foo](./foo.md)*")).toEqual(["./foo.md"]);
    expect(targets("- _[foo](./foo.md)_")).toEqual(["./foo.md"]);
  });

  it("treats a heading-as-link at H1 as the new scope", () => {
    const body = [
      "## Cross-references",
      "- [skipped](./skipped.md)",
      "# [Reset](./reset.md)",
      "- [counted](./counted.md)",
    ].join("\n");
    const out = targets(body);
    // The H1 line itself is an inclusion link AND resets scope to non-excluded.
    expect(out).toContain("./reset.md");
    expect(out).toContain("./counted.md");
    expect(out).not.toContain("./skipped.md");
  });
});

describe("resolveInclusionTarget", () => {
  it("resolves a sibling-relative target", () => {
    expect(resolveInclusionTarget("knowledge/jersey/trusts/index.md", "./firewall.md")).toBe(
      "knowledge/jersey/trusts/firewall.md",
    );
  });

  it("resolves an up-one-level target", () => {
    expect(resolveInclusionTarget("knowledge/jersey/trusts/firewall.md", "../index.md")).toBe(
      "knowledge/jersey/index.md",
    );
  });

  it("resolves an absolute (leading-slash) target", () => {
    expect(resolveInclusionTarget("knowledge/jersey/trusts/firewall.md", "/knowledge/jersey/tax/index.md")).toBe(
      "knowledge/jersey/tax/index.md",
    );
  });

  it("resolves a target with no leading dot", () => {
    expect(resolveInclusionTarget("knowledge/jersey/trusts/firewall.md", "article-47.md")).toBe(
      "knowledge/jersey/trusts/article-47.md",
    );
  });
});
