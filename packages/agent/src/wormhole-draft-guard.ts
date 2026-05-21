// Scoped-write sandbox for wormhole drafting (AGENT-BEHAVIOURS #5).
//
// The agent is read-only by default. When wormhole drafting is enabled, it
// gains exactly one narrow write lane: it may create candidate wormhole
// nodes under `wormholes/candidates/`, and nowhere else. This module is the
// `canUseTool` predicate that enforces that — a pure function so the
// allow/deny logic can be unit-tested without invoking the live agent.

import { isAbsolute, relative, resolve } from "node:path";
import type { CanUseTool, PermissionResult } from "@anthropic-ai/claude-agent-sdk";

/** Repo-relative directory the agent may write candidate wormholes into. */
export const WORMHOLE_STAGING_SUBDIR = "wormholes/candidates";

// Filesystem-mutating tools. All of these are gated to the staging dir;
// every other tool (the read-only corpus tools + Read/Glob/Grep) is allowed.
const FILE_WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);

/**
 * Pure permission decision. Non-write tools are always allowed (they are
 * already constrained by the runtime's allowedTools whitelist). Write-class
 * tools are allowed only if their target resolves to a path strictly inside
 * `<repoRoot>/wormholes/candidates/`.
 */
export function evaluateToolPermission(
  toolName: string,
  input: Record<string, unknown>,
  repoRoot: string,
): PermissionResult {
  if (!FILE_WRITE_TOOLS.has(toolName)) {
    return { behavior: "allow" };
  }

  const raw =
    typeof input.file_path === "string"
      ? input.file_path
      : typeof input.path === "string"
        ? input.path
        : undefined;

  if (!raw) {
    return {
      behavior: "deny",
      message: `${toolName} denied: no file path in input; writes are restricted to ${WORMHOLE_STAGING_SUBDIR}/.`,
    };
  }

  const targetAbs = isAbsolute(raw) ? resolve(raw) : resolve(repoRoot, raw);
  const stagingAbs = resolve(repoRoot, WORMHOLE_STAGING_SUBDIR);
  const rel = relative(stagingAbs, targetAbs);
  // Strictly inside: non-empty (not the dir itself), not escaping via "..",
  // not an absolute path (different root). Guards against prefix tricks like
  // "wormholes/candidates-evil" because relative() yields "../candidates-evil".
  const inside = rel.length > 0 && !rel.startsWith("..") && !isAbsolute(rel);

  if (!inside) {
    return {
      behavior: "deny",
      message: `${toolName} denied: this agent may only write under ${WORMHOLE_STAGING_SUBDIR}/ (attempted "${raw}").`,
    };
  }

  return { behavior: "allow" };
}

/** Build the SDK `canUseTool` callback bound to a repo root. */
export function makeWormholeDraftCanUseTool(repoRoot: string): CanUseTool {
  return async (toolName, input) => evaluateToolPermission(toolName, input, repoRoot);
}
