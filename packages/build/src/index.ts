// @offshoreai/build — corpus build pipeline entrypoint.
//
// Programmatic API. The CLI in ./cli.ts dispatches to these functions.
// Per IMPLEMENTATION-PLAN.md weeks 1-2: validate, hier-tree, tag-index
// shipping now; auto-summaries (Sonnet 4.6) follow when
// ANTHROPIC_API_KEY is available.

export { validateCorpus } from "./validate/run.js";
export type {
  ValidationResult,
  ValidationViolation,
  ViolationKind,
} from "./validate/types.js";

export { compileHierTree } from "./compile/hier-tree.js";
export type { HierTree, HierTreeNode } from "./compile/hier-tree.js";

export { compileTagIndex } from "./compile/tag-index.js";
export type { TagIndex } from "./compile/tag-index.js";

export { loadCorpus } from "./compile/loader.js";
export type { CorpusRecord, CorpusKind } from "./compile/loader.js";
