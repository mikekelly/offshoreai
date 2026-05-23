// Thin conversation store for the web UI.
//
// We deliberately keep our OWN conversation index rather than listing SDK
// sessions directly: the SDK's session store for this project directory also
// contains every Claude Code / eval session run against this repo, which we
// don't want in the sidebar. Here a conversation records its turns (question
// + answer + citations + verdict) for history rendering, plus the SDK
// `sessionId` we resume to continue the agent's context. The SDK session is
// purely the context-carrier; this file is the source of truth for the UI.
//
// Persistence is a single JSON file (a local single-user tool); writes are
// serialized through an in-memory map.

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export interface StoredCitation {
  readonly path: string;
  readonly exists: boolean;
  readonly title: string | null;
  readonly status: string | null;
  readonly lastVerified: string | null;
  readonly ageDays: number | null;
  readonly freshness: string;
  readonly sources: ReadonlyArray<{ title: string; url: string; kind: string }>;
  readonly articles: ReadonlyArray<string>;
}

export interface StoredVerdict {
  readonly kind: string;
  readonly claimsChecked: number;
  readonly claimsWithCitation: number;
  readonly rejectCount: number;
  readonly notes: string;
  readonly reasons: ReadonlyArray<{ claim: string; issueKind: string; citedSource: string; detail: string }>;
}

export type DraftStatus = "verified" | "rejected" | "unavailable";

export interface Draft {
  readonly answer: string;
  readonly citations: StoredCitation[];
  readonly verdict: StoredVerdict | null;
  readonly verifyError: string | null;
  readonly status: DraftStatus;
}

export interface Turn {
  readonly question: string;
  readonly drafts: Draft[];
  readonly createdAt: string;
}

/**
 * Legacy single-answer turn shape — migrated to drafts[] on read so old
 * conversations keep rendering after the schema change.
 */
interface LegacyTurn {
  question?: string;
  answer?: string;
  citations?: StoredCitation[];
  verdict?: StoredVerdict | null;
  createdAt?: string;
}

export interface Conversation {
  readonly id: string;
  sessionId: string | null;
  title: string;
  readonly createdAt: string;
  updatedAt: string;
  turns: Turn[];
}

export interface ConversationSummary {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly turnCount: number;
}

const titleFrom = (question: string): string => {
  const t = question.trim().replace(/\s+/g, " ");
  return t.length > 60 ? t.slice(0, 57) + "…" : t;
};

export class ConversationStore {
  readonly #file: string;
  readonly #convos = new Map<string, Conversation>();
  #loaded = false;

  constructor(file: string) {
    this.#file = file;
  }

  async #load(): Promise<void> {
    if (this.#loaded) return;
    try {
      const raw = await readFile(this.#file, "utf8");
      const arr = JSON.parse(raw) as Conversation[];
      for (const c of arr) {
        c.turns = c.turns.map(migrateTurn);
        this.#convos.set(c.id, c);
      }
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") throw err;
    }
    this.#loaded = true;
  }

  async #save(): Promise<void> {
    await mkdir(dirname(this.#file), { recursive: true });
    const arr = [...this.#convos.values()];
    await writeFile(this.#file, JSON.stringify(arr, null, 2), "utf8");
  }

  async list(): Promise<ConversationSummary[]> {
    await this.#load();
    return [...this.#convos.values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((c) => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        turnCount: c.turns.length,
      }));
  }

  async get(id: string): Promise<Conversation | undefined> {
    await this.#load();
    return this.#convos.get(id);
  }

  async create(question: string): Promise<Conversation> {
    await this.#load();
    const now = new Date().toISOString();
    const convo: Conversation = {
      id: randomUUID(),
      sessionId: null,
      title: titleFrom(question),
      createdAt: now,
      updatedAt: now,
      turns: [],
    };
    this.#convos.set(convo.id, convo);
    await this.#save();
    return convo;
  }

  async appendTurn(
    id: string,
    turn: Omit<Turn, "createdAt">,
    sessionId: string | null,
  ): Promise<void> {
    await this.#load();
    const convo = this.#convos.get(id);
    if (!convo) return;
    convo.turns.push({ ...turn, createdAt: new Date().toISOString() });
    if (sessionId) convo.sessionId = sessionId;
    convo.updatedAt = new Date().toISOString();
    await this.#save();
  }

  async remove(id: string): Promise<boolean> {
    await this.#load();
    const existed = this.#convos.delete(id);
    if (existed) await this.#save();
    return existed;
  }
}

// ---------------------------------------------------------------------------
// Legacy migration: single-answer turn → drafts[]
// ---------------------------------------------------------------------------

function migrateTurn(t: Turn | LegacyTurn): Turn {
  if (Array.isArray((t as Turn).drafts)) return t as Turn;
  const legacy = t as LegacyTurn;
  const verdict = legacy.verdict ?? null;
  const status: DraftStatus = verdict ? (verdict.rejectCount > 0 ? "rejected" : "verified") : "verified";
  return {
    question: legacy.question ?? "",
    createdAt: legacy.createdAt ?? new Date().toISOString(),
    drafts: [{
      answer: legacy.answer ?? "",
      citations: legacy.citations ?? [],
      verdict,
      verifyError: null,
      status,
    }],
  };
}
