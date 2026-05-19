// Read a Claude Code session JSONL from ~/.claude/projects/<encoded-cwd>/<session_id>.jsonl
// and extract the tool_use sequence. Used by the claude-p harness to
// populate trajectory.toolCalls (which the result envelope alone
// doesn't expose).
//
// The project-dir encoding rule observed empirically on macOS 25:
//   / → -    (path separator)
//   . → -    (dot)
// e.g. /Users/mike/code/foo/.claude → -Users-mike-code-foo--claude

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve } from "node:path";

export function projectDirNameForCwd(cwd: string): string {
  return cwd.replace(/[/.]/g, "-");
}

export function sessionFilePath(cwd: string, sessionId: string): string {
  return resolve(homedir(), ".claude", "projects", projectDirNameForCwd(cwd), `${sessionId}.jsonl`);
}

export interface SessionToolUse {
  readonly name: string;
  readonly inputDigest: string;
  readonly isError: boolean;
}

interface SessionLine {
  type?: string;
  message?: {
    content?: Array<{
      type?: string;
      name?: string;
      input?: unknown;
      tool_use_id?: string;
      is_error?: boolean;
    }>;
  };
}

export async function readSessionToolCalls(
  cwd: string,
  sessionId: string,
): Promise<ReadonlyArray<SessionToolUse>> {
  const path = sessionFilePath(cwd, sessionId);
  let body: string;
  try {
    body = await readFile(path, "utf8");
  } catch {
    return [];
  }

  const errorIds = new Set<string>();
  // First pass — collect tool_result entries that flagged is_error.
  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    let obj: SessionLine;
    try { obj = JSON.parse(line) as SessionLine; } catch { continue; }
    if (obj.type !== "user") continue;
    for (const block of obj.message?.content ?? []) {
      if (block.type === "tool_result" && block.is_error && block.tool_use_id) {
        errorIds.add(block.tool_use_id);
      }
    }
  }

  // Second pass — collect tool_use entries in order.
  const out: SessionToolUse[] = [];
  for (const line of body.split(/\r?\n/)) {
    if (!line) continue;
    let obj: SessionLine;
    try { obj = JSON.parse(line) as SessionLine; } catch { continue; }
    if (obj.type !== "assistant") continue;
    for (const block of obj.message?.content ?? []) {
      if (block.type === "tool_use" && block.name) {
        const id = block.tool_use_id ?? "";
        out.push({
          name: block.name,
          inputDigest: JSON.stringify(block.input ?? {}).slice(0, 200),
          isError: errorIds.has(id),
        });
      }
    }
  }
  return out;
}
