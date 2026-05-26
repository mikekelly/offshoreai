// Compose the agent's full system prompt from prompts/system.md +
// the runtime tag taxonomy block.
//
// Shared by runtime.ts (offshoreai-agent harness, via SDK) and the
// claude-p control harness (via --system-prompt-file). Both
// harnesses produce byte-identical system prompts so the eval
// comparison isolates the tool-surface / verifier delta and is not
// contaminated by context-asymmetry.
//
// What's NOT here, deliberately: corpus content. The corpus is
// available via the agent's read tools (corpus.getFile / Read /
// Grep), and the agent's job is query-time retrieval (PRD §6.4
// Principle 5). Pre-loading orientation files would privilege some
// corpus content over others without a principled reason — see
// jersey/index.md vs trusts/firewall.md: both are corpus content,
// neither has more claim on ambient context than the other.
//
// The runtime taxonomy block IS included because it is not corpus
// content but a runtime-derived index (the closed tag list with
// frequency counts, used to make findByTag callable without
// guessing). It's analogous to a search index, not a corpus file.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildTaxonomyBlock } from "./taxonomy-block.js";

export const SYSTEM_PROMPT_RELATIVE_PATH = "prompts/system.md";

export interface ComposedSystemPrompt {
  /** The composed system prompt to send to the model. */
  readonly text: string;
  /** Size of `text` in UTF-8 bytes — for trajectory provenance. */
  readonly bytes: number;
  /** First 16 hex chars of sha256(text) — for trajectory provenance. */
  readonly sha256: string;
  /** Whether the runtime taxonomy block was appended (tag-index present). */
  readonly taxonomyIncluded: boolean;
}

export interface ComposeOptions {
  readonly repoRoot: string;
  /** Path (relative to repoRoot) to tag-index.json. Skip taxonomy block if omitted. */
  readonly tagIndexPath?: string;
}

export async function composeSystemPrompt(opts: ComposeOptions): Promise<ComposedSystemPrompt> {
  const base = readFileSync(resolve(opts.repoRoot, SYSTEM_PROMPT_RELATIVE_PATH), "utf8");

  const taxonomy = opts.tagIndexPath
    ? await buildTaxonomyBlock(opts.repoRoot, opts.tagIndexPath)
    : "";

  const text = base + taxonomy;
  return {
    text,
    bytes: Buffer.byteLength(text, "utf8"),
    sha256: createHash("sha256").update(text).digest("hex").slice(0, 16),
    taxonomyIncluded: Boolean(taxonomy),
  };
}
