import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { PROPERTY_RUN } from '@/test-utils/property-run';
import { csvDocument, csvField, type CsvValue } from './csv';

const FORMULA_TRIGGERS = ['=', '+', '-', '@', '\t', '\r'] as const;
const FORMULA_GUARD = "'";
const CSV_SPECIALS = [...FORMULA_TRIGGERS, '\n', '"', ',', FORMULA_GUARD] as const;
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);
const RECORD_END = '\r\n';
const QUOTE = '"';
const ESCAPED_QUOTE = '""';
const CSV_FIELD = /(?:"((?:[^"]|"")*)"|([^",\r\n]*))(,|\r\n)/gy;
const MAX_COLUMNS = 6;
const MAX_ROWS = 8;

interface Reading {
  readonly records: readonly (readonly string[])[];
  readonly fields: readonly string[];
}

function fieldOf(match: RegExpMatchArray): string {
  const [, quoted, plain = ''] = match;
  return quoted === undefined ? plain : quoted.replaceAll(ESCAPED_QUOTE, QUOTE);
}

function readRecords(body: string): readonly (readonly string[])[] {
  const matches = [...body.matchAll(CSV_FIELD)];
  const consumed = matches.reduce((length, match) => length + match[0].length, 0);
  if (consumed !== body.length) {
    throw new Error(`Not CSV from character ${String(consumed)} of ${JSON.stringify(body)}`);
  }
  const reading = matches.reduce<Reading>(
    (state, match) => {
      const fields = [...state.fields, fieldOf(match)];
      return match[3] === RECORD_END
        ? { records: [...state.records, fields], fields: [] }
        : { records: state.records, fields };
    },
    { records: [], fields: [] },
  );
  if (reading.fields.length > 0) {
    throw new Error(`The last record of ${JSON.stringify(body)} has no line break`);
  }
  return reading.records;
}

function readDocument(document: string): readonly (readonly string[])[] {
  expect(document.startsWith(BYTE_ORDER_MARK)).toBe(true);
  return readRecords(document.slice(BYTE_ORDER_MARK.length));
}

function readCell(field: string): string | undefined {
  return readRecords(`${field}${RECORD_END}`)[0]?.[0];
}

function startsLikeFormula(text: string): boolean {
  return FORMULA_TRIGGERS.some((trigger) => text.startsWith(trigger));
}

function expectedText(value: CsvValue): string {
  if (value === null) {
    return '';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return startsLikeFormula(value) ? `${FORMULA_GUARD}${value}` : value;
}

const anyCodePoint = fc.string({ unit: 'binary', minLength: 1, maxLength: 1 });
const textWithSpecials = fc.string({
  unit: fc.oneof(fc.constantFrom(...CSV_SPECIALS), anyCodePoint),
});
const cellText = fc.oneof(
  textWithSpecials,
  fc
    .tuple(fc.constantFrom(...FORMULA_TRIGGERS), textWithSpecials)
    .map(([trigger, rest]) => `${trigger}${rest}`),
);
const cellValue = fc.oneof(cellText, fc.double(), fc.constant(null));
const table = fc.integer({ min: 1, max: MAX_COLUMNS }).chain((width) =>
  fc.record({
    columns: fc.array(cellText, { minLength: width, maxLength: width }),
    rows: fc.array(fc.array(cellValue, { minLength: width, maxLength: width }), {
      maxLength: MAX_ROWS,
    }),
  }),
);

describe('csvField over generated text', () => {
  it('reads every text cell back as the text, behind a quote mark when it starts like a formula', () => {
    fc.assert(
      fc.property(cellText, (text) => {
        expect(readCell(csvField(text))).toBe(expectedText(text));
      }),
      PROPERTY_RUN,
    );
  });

  it('never hands a spreadsheet a text cell that starts with a formula trigger', () => {
    fc.assert(
      fc.property(cellText, (text) => {
        expect(startsLikeFormula(readCell(csvField(text)) ?? '')).toBe(false);
      }),
      PROPERTY_RUN,
    );
  });
});

describe('csvDocument over generated tables', () => {
  it('reads back as the header and one record per row, each with one field per column', () => {
    fc.assert(
      fc.property(table, ({ columns, rows }) => {
        expect(readDocument(csvDocument({ columns, rows }))).toEqual(
          [columns, ...rows].map((row) => row.map(expectedText)),
        );
      }),
      PROPERTY_RUN,
    );
  });
});
