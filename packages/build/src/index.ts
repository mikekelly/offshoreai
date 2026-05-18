// @offshoreai/build — corpus build pipeline entrypoint.
//
// Programmatic API. The CLI in ./cli.ts dispatches to these functions.
// Per IMPLEMENTATION-PLAN.md week 1: validate is the first verb to ship.
// Week 2 adds tree + tags + all.

export { validateCorpus } from "./validate/run.js";
export type {
  ValidationResult,
  ValidationViolation,
  ViolationKind,
} from "./validate/types.js";
