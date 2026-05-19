// Minimal TOON renderer.
//
// Per PRD §7.0.2: every tool result's content[0].text is TOON, never
// JSON. AXI-style output discipline: typed list-shaped data uses
// tabular array headers; scalars use key:value; help[] blocks suggest
// next-step tool calls.
//
// Surface kept narrow: this is what the v1 corpus handlers actually
// emit. We don't try to be a general object→TOON converter.

export interface ToonScalarLine {
  readonly kind: "scalar";
  readonly key: string;
  readonly value: string | number | boolean | null;
}

export interface ToonTableLine<Row extends object = Record<string, unknown>> {
  readonly kind: "table";
  readonly name: string;
  readonly fields: ReadonlyArray<keyof Row & string>;
  readonly rows: ReadonlyArray<Row>;
}

export interface ToonHelpLine {
  readonly kind: "help";
  readonly lines: ReadonlyArray<string>;
}

export interface ToonRawLine {
  readonly kind: "raw";
  readonly text: string;
}

export type ToonLine = ToonScalarLine | ToonTableLine | ToonHelpLine | ToonRawLine;

export function toon(lines: ReadonlyArray<ToonLine>): string {
  return lines.map(renderLine).join("\n");
}

function renderLine(line: ToonLine): string {
  switch (line.kind) {
    case "scalar":
      return `${line.key}: ${renderScalarValue(line.value)}`;
    case "table":
      return renderTable(line);
    case "help":
      return renderHelp(line);
    case "raw":
      return line.text;
  }
}

function renderScalarValue(v: string | number | boolean | null): string {
  if (v === null) return "null";
  if (typeof v === "string") return v;
  return String(v);
}

function renderTable<Row extends object>(line: ToonTableLine<Row>): string {
  const fieldList = line.fields.join(",");
  const header = `${line.name}[${line.rows.length}]{${fieldList}}:`;
  const rows = line.rows.map((row) => {
    const cells = line.fields.map((field) => renderCell((row as Record<string, unknown>)[field]));
    return `  ${cells.join(",")}`;
  });
  return [header, ...rows].join("\n");
}

function renderHelp(line: ToonHelpLine): string {
  if (line.lines.length === 0) return "";
  const header = `help[${line.lines.length}]:`;
  const rows = line.lines.map((l) => `  ${l}`);
  return [header, ...rows].join("\n");
}

function renderCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    // Pipe-separated sub-array, per the §7.0.2 example.
    return value.map((v) => renderCell(v)).join("|");
  }
  if (typeof value === "string") return escapeCell(value);
  return String(value);
}

function escapeCell(s: string): string {
  // Cell separator is comma; sub-array separator is pipe; newline breaks rows.
  // Replace any of those with a safe placeholder. This is a narrow shim — for
  // the v1 surface, cells are paths, dates, tag slugs, statuses — none of
  // which legitimately contain these characters. If a title or summary needs
  // to be a cell value, the consumer should use a `raw` line instead.
  return s.replace(/[,|\n]/g, " ");
}

// ---------------------------------------------------------------------------
// Convenience helpers — handlers compose these instead of building ToonLine
// objects by hand.
// ---------------------------------------------------------------------------

export function scalar(key: string, value: string | number | boolean | null): ToonScalarLine {
  return { kind: "scalar", key, value };
}

export function table<Row extends object>(
  name: string,
  fields: ReadonlyArray<keyof Row & string>,
  rows: ReadonlyArray<Row>,
): ToonTableLine<Row> {
  return { kind: "table", name, fields, rows };
}

export function help(lines: ReadonlyArray<string>): ToonHelpLine {
  return { kind: "help", lines };
}

export function raw(text: string): ToonRawLine {
  return { kind: "raw", text };
}
