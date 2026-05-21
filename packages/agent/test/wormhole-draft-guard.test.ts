import { describe, expect, it } from "vitest";
import { evaluateToolPermission, WORMHOLE_STAGING_SUBDIR } from "../src/wormhole-draft-guard.js";

const REPO = "/repo";

describe("wormhole draft guard", () => {
  it("allows non-write tools unconditionally", () => {
    for (const tool of ["Read", "Glob", "Grep", "mcp__corpus__getFile", "mcp__corpus__findByTag"]) {
      expect(evaluateToolPermission(tool, { path: "anything" }, REPO).behavior).toBe("allow");
    }
  });

  it("allows a Write inside the staging dir (repo-relative path)", () => {
    const r = evaluateToolPermission(
      "Write",
      { file_path: `${WORMHOLE_STAGING_SUBDIR}/trust-officer/x.md` },
      REPO,
    );
    expect(r.behavior).toBe("allow");
  });

  it("allows a Write inside the staging dir (absolute path)", () => {
    const r = evaluateToolPermission(
      "Write",
      { file_path: `${REPO}/${WORMHOLE_STAGING_SUBDIR}/funds/y.md` },
      REPO,
    );
    expect(r.behavior).toBe("allow");
  });

  it("denies a Write into the curated corpus", () => {
    const r = evaluateToolPermission(
      "Write",
      { file_path: "knowledge/jersey/trusts/firewall.md" },
      REPO,
    );
    expect(r.behavior).toBe("deny");
  });

  it("denies a Write escaping via ..", () => {
    const r = evaluateToolPermission(
      "Write",
      { file_path: `${WORMHOLE_STAGING_SUBDIR}/../../knowledge/jersey/evil.md` },
      REPO,
    );
    expect(r.behavior).toBe("deny");
  });

  it("denies a prefix-trick sibling dir (candidates-evil)", () => {
    const r = evaluateToolPermission(
      "Write",
      { file_path: "wormholes/candidates-evil/x.md" },
      REPO,
    );
    expect(r.behavior).toBe("deny");
  });

  it("denies writing the staging dir itself (no file)", () => {
    const r = evaluateToolPermission("Write", { file_path: WORMHOLE_STAGING_SUBDIR }, REPO);
    expect(r.behavior).toBe("deny");
  });

  it("denies a Write with no path", () => {
    expect(evaluateToolPermission("Write", {}, REPO).behavior).toBe("deny");
  });

  it("gates Edit/MultiEdit/NotebookEdit the same way", () => {
    for (const tool of ["Edit", "MultiEdit", "NotebookEdit"]) {
      expect(evaluateToolPermission(tool, { file_path: "knowledge/x.md" }, REPO).behavior).toBe("deny");
      expect(
        evaluateToolPermission(tool, { file_path: `${WORMHOLE_STAGING_SUBDIR}/x.md` }, REPO).behavior,
      ).toBe("allow");
    }
  });
});
