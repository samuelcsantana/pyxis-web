export type CsvValue = string | number | null;

export interface CsvTable {
  readonly columns: readonly string[];
  readonly rows: readonly (readonly CsvValue[])[];
}

export interface CsvFile {
  readonly nameParts: readonly string[];
  readonly table: CsvTable;
}

const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);
const LINE_BREAK = '\r\n';
const SEPARATOR = ',';
const QUOTE = '"';
const ESCAPED_QUOTE = '""';
const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'] as const;
const FORMULA_GUARD = "'";
const NEEDS_QUOTES = /[",\r\n]/;
const FILE_PREFIX = 'pyxis';
const FILE_EXTENSION = '.csv';

function withoutFormula(text: string): string {
  return FORMULA_TRIGGERS.some((trigger) => text.startsWith(trigger))
    ? `${FORMULA_GUARD}${text}`
    : text;
}

export function csvField(value: CsvValue): string {
  if (value === null) {
    return '';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  const text = withoutFormula(value);
  return NEEDS_QUOTES.test(text)
    ? `${QUOTE}${text.replaceAll(QUOTE, ESCAPED_QUOTE)}${QUOTE}`
    : text;
}

export function csvDocument(table: CsvTable): string {
  const lines = [table.columns, ...table.rows].map((row) => row.map(csvField).join(SEPARATOR));
  return `${BYTE_ORDER_MARK}${lines.join(LINE_BREAK)}${LINE_BREAK}`;
}

export function csvFileName(nameParts: readonly string[]): string {
  return `${[FILE_PREFIX, ...nameParts].join('-')}${FILE_EXTENSION}`;
}

export function chosenTable<Table extends string>(
  tables: readonly [Table, ...Table[]],
  requested: string | undefined,
): Table | null {
  if (requested === undefined) {
    return tables[0];
  }
  return tables.find((table) => table === requested) ?? null;
}
