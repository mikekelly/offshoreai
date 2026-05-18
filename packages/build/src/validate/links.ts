// Link-integrity check for relative markdown links in see_also and in
// the file body. Only checks **relative** paths; external URLs are not
// validated here (the eval/primary-source layer handles those).

import { access } from "node:fs/promises";
import { dirname, resolve } from "node:path";

// Matches markdown inline links to relative paths: [text](relative/path.md#anchor)
// We deliberately exclude URLs (anything with a scheme).
const relativeLinkPattern = /\[(?:[^\]]+)\]\((?!https?:|mailto:|#)([^)]+)\)/g;

export interface BodyLink {
  readonly target: string;
  readonly line: number;
}

export function extractRelativeLinks(body: string): ReadonlyArray<BodyLink> {
  const out: BodyLink[] = [];
  const lines = body.split(/\r?\n/);
  lines.forEach((line, i) => {
    let m: RegExpExecArray | null;
    relativeLinkPattern.lastIndex = 0;
    while ((m = relativeLinkPattern.exec(line)) !== null) {
      if (m[1]) out.push({ target: m[1], line: i + 1 });
    }
  });
  return out;
}

export async function resolveTargetExists(
  fileAbsPath: string,
  linkTarget: string,
): Promise<boolean> {
  // Strip URL anchor; we don't validate anchors yet (would require AST).
  const noAnchor = linkTarget.split("#")[0] ?? "";
  if (noAnchor.length === 0) return true; // pure anchor link, in-file — accept
  const targetAbs = resolve(dirname(fileAbsPath), noAnchor);
  try {
    await access(targetAbs);
    return true;
  } catch {
    return false;
  }
}
