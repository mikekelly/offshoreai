// Compose the agent's full system prompt from prompts/system.md +
// the runtime tag taxonomy block + the orientation surfaces.
//
// Shared by runtime.ts (offshoreai-agent harness, via SDK) and the
// claude-p control harness (via --system-prompt-file). Both
// harnesses produce byte-identical system prompts so the eval
// comparison isolates the tool-surface / verifier delta and is not
// contaminated by context-asymmetry.
//
// Orientation surfaces are inlined here rather than left as
// "fetch when relevant" pointers because:
//   1. Pre-cleanup, the offshoreai-agent's SDK preset may have been
//      auto-loading CLAUDE.md (and thus the @-transclusions).
//      Removing CLAUDE.md auto-loading without replacing the
//      orientation context could regress behaviour.
//   2. The claude-p control needs the same orientation as the
//      production agent for the eval comparison to be valid.
//      @-references in --system-prompt-file are NOT expanded by
//      Claude Code (verified empirically), so we can't lean on
//      that mechanism.
//   3. Inlining is cache-friendly: the orientation block is part
//      of the per-session cache write and is reused on every turn.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildTaxonomyBlock } from "./taxonomy-block.js";

export const SYSTEM_PROMPT_RELATIVE_PATH = "prompts/system.md";

/** Orientation files inlined into the system prompt. Their content
 *  was previously reaching the agent via CLAUDE.md `@`-transclusion;
 *  after the prompt cleanup we inline them here so both harnesses
 *  see the same context. */
export const ORIENTATION_FILES: ReadonlyArray<string> = [
  "TAGS.md",
  "knowledge/jersey/index.md",
  "knowledge/CROSS-JURISDICTIONAL-MAP.md",
  "knowledge/jersey/history/finance/trajectory.md",
];

export interface ComposedSystemPrompt {
  /** The composed system prompt to send to the model. */
  readonly text: string;
  /** Size of `text` in UTF-8 bytes — for trajectory provenance. */
  readonly bytes: number;
  /** First 16 hex chars of sha256(text) — for trajectory provenance. */
  readonly sha256: string;
  /** Which orientation files were inlined. */
  readonly orientationFilesIncluded: ReadonlyArray<string>;
  /** Whether the runtime taxonomy block was appended (tag-index present). */
  readonly taxonomyIncluded: boolean;
}

export interface ComposeOptions {
  readonly repoRoot: string;
  /** Path (relative to repoRoot) to tag-index.json. Skip taxonomy block if omitted. */
  readonly tagIndexPath?: string;
  /** Override the orientation file list — used by tests to keep fixtures small. */
  readonly orientationFiles?: ReadonlyArray<string>;
}

export async function composeSystemPrompt(opts: ComposeOptions): Promise<ComposedSystemPrompt> {
  const base = readFileSync(resolve(opts.repoRoot, SYSTEM_PROMPT_RELATIVE_PATH), "utf8");

  const taxonomy = opts.tagIndexPath
    ? await buildTaxonomyBlock(opts.repoRoot, opts.tagIndexPath)
    : "";

  const orientationList = opts.orientationFiles ?? ORIENTATION_FILES;
  const orientationBlocks: string[] = [];
  for (const rel of orientationList) {
    const abs = resolve(opts.repoRoot, rel);
    const body = readFileSync(abs, "utf8");
    orientationBlocks.push(`\n\n---\n\n# Orientation surface — ${rel}\n\n${body}`);
  }

  const text = base + taxonomy + orientationBlocks.join("");
  return {
    text,
    bytes: Buffer.byteLength(text, "utf8"),
    sha256: createHash("sha256").update(text).digest("hex").slice(0, 16),
    orientationFilesIncluded: orientationList,
    taxonomyIncluded: Boolean(taxonomy),
  };
}
