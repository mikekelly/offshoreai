// Empirical auth test. Calls the simplest possible query() and reports
// what happens. No system prompt, no tools, no MCP — just "say hi".
//
// Run with each of these in turn:
//   1. pnpm --filter @offshoreai/agent auth-test                              (whatever auth the env defaults to)
//   2. unset ANTHROPIC_API_KEY; unset ANTHROPIC_BASE_URL; pnpm ... auth-test  (no env vars at all — does it pick up keychain?)
//   3. ANTHROPIC_API_KEY=<fake> pnpm ... auth-test                            (bad key — does it fail or fall back to keychain?)

import { query } from "@anthropic-ai/claude-agent-sdk";

const started = Date.now();
console.log("env:");
console.log("  ANTHROPIC_API_KEY:  ", process.env["ANTHROPIC_API_KEY"] ? `set (${process.env["ANTHROPIC_API_KEY"].slice(0, 8)}...)` : "unset");
console.log("  ANTHROPIC_BASE_URL: ", process.env["ANTHROPIC_BASE_URL"] ?? "unset");
console.log("  CLAUDE_CODE_*:      ", Object.keys(process.env).filter((k) => k.startsWith("CLAUDE_")).join(", ") || "none");
console.log();

let assistantTextChunks = 0;
let lastResult: unknown = null;

try {
  for await (const message of query({
    prompt: 'Reply with exactly the four characters "okok" and nothing else.',
    options: {
      allowedTools: [], // no tools — pure model call
    },
  })) {
    if (message.type === "system" && message.subtype === "init") {
      console.log("init.session_id:", message.session_id);
      // The init message includes a `model` field — useful for confirming which model is in play.
      console.log("init.model:     ", (message as unknown as { model?: string }).model);
      console.log("init.cwd:       ", (message as unknown as { cwd?: string }).cwd);
    } else if (message.type === "assistant") {
      const content = (message as unknown as { message?: { content?: Array<{ type: string; text?: string }> } }).message?.content ?? [];
      for (const block of content) {
        if (block.type === "text" && block.text) {
          console.log("assistant.text: ", JSON.stringify(block.text.slice(0, 200)));
          assistantTextChunks += 1;
        }
      }
    } else if (message.type === "result") {
      lastResult = message;
      console.log("result.subtype: ", (message as unknown as { subtype?: string }).subtype);
      console.log("result.num_turns:", (message as unknown as { num_turns?: number }).num_turns);
      console.log("result.duration_ms:", (message as unknown as { duration_ms?: number }).duration_ms);
      const usage = (message as unknown as { usage?: Record<string, unknown> }).usage;
      console.log("result.usage:    ", usage ? JSON.stringify(usage) : "(none)");
      const cost = (message as unknown as { total_cost_usd?: number }).total_cost_usd;
      console.log("result.cost_usd: ", cost);
    }
  }
} catch (err) {
  console.error("\nQUERY THREW:");
  console.error(err);
  process.exit(1);
}

console.log();
console.log(`elapsed: ${((Date.now() - started) / 1000).toFixed(2)}s; assistant chunks: ${assistantTextChunks}; got result: ${lastResult !== null}`);
