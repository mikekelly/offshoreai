import { describe, expect, it } from "vitest";
import { help, raw, scalar, table, toon } from "../src/toon.js";

describe("toon renderer", () => {
  it("emits scalar key:value lines", () => {
    const out = toon([scalar("count", 8), scalar("status", "stable")]);
    expect(out).toBe("count: 8\nstatus: stable");
  });

  it("emits a tabular array with header + rows", () => {
    const out = toon([
      table(
        "files",
        ["path", "status", "tags"] as const,
        [
          { path: "jersey/trusts/firewall.md", status: "stable", tags: ["firewall", "trusts-law-1984"] },
          { path: "jersey/trusts/article-9.md", status: "stable", tags: ["firewall"] },
        ],
      ),
    ]);
    expect(out).toBe(
      "files[2]{path,status,tags}:\n" +
      "  jersey/trusts/firewall.md,stable,firewall|trusts-law-1984\n" +
      "  jersey/trusts/article-9.md,stable,firewall",
    );
  });

  it("emits a help block with leading count header", () => {
    const out = toon([
      help([
        "Call `getFile` with path=<path>",
        "Call `freshnessCheck` with paths=[<path>]",
      ]),
    ]);
    expect(out).toBe(
      "help[2]:\n" +
      "  Call `getFile` with path=<path>\n" +
      "  Call `freshnessCheck` with paths=[<path>]",
    );
  });

  it("escapes commas, pipes, and newlines in cells", () => {
    const out = toon([
      table("rows", ["title"] as const, [{ title: "Some, title | with newlines" }]),
    ]);
    expect(out).toContain("Some  title   with newlines");
  });

  it("passes raw text through unchanged", () => {
    const out = toon([scalar("k", "v"), raw("# Markdown body\n\nParagraph.")]);
    expect(out).toBe("k: v\n# Markdown body\n\nParagraph.");
  });
});
