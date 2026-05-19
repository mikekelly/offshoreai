// Small Levenshtein-distance "did you mean" helper.
//
// Used by findByTag (and any other typed tool whose input is an
// enum-shaped string) to suggest the closest valid candidate when the
// agent supplies one that isn't in the index. Per PRD §7.0.1 row 3,
// this is the named mitigation for the "wrong parameter" failure mode.

export function suggestClosest(input: string, candidates: ReadonlyArray<string>, maxResults = 3): ReadonlyArray<string> {
  if (candidates.length === 0) return [];
  const scored = candidates
    .map((c) => ({ c, d: distance(input, c) }))
    // Filter out hopelessly distant suggestions — typo recovery only,
    // not semantic search.
    .filter(({ d, c }) => d <= Math.max(2, Math.floor(c.length / 3)))
    .sort((a, b) => a.d - b.d || a.c.localeCompare(b.c));
  return scored.slice(0, maxResults).map(({ c }) => c);
}

function distance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  // Standard Levenshtein with a flat 1D rolling row — O(min(|a|,|b|)) memory.
  if (a.length > b.length) [a, b] = [b, a];
  let prev = new Array<number>(a.length + 1);
  let cur = new Array<number>(a.length + 1);
  for (let i = 0; i <= a.length; i++) prev[i] = i;
  for (let j = 1; j <= b.length; j++) {
    cur[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[i] = Math.min(
        cur[i - 1]! + 1,
        prev[i]! + 1,
        prev[i - 1]! + cost,
      );
    }
    [prev, cur] = [cur, prev];
  }
  return prev[a.length]!;
}
