import { describe, expect, it } from 'vitest';
import { chosenTable, csvDocument, csvField, csvFileName } from './csv';

const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);

describe('csvField', () => {
  it('leaves an empty cell for a missing value', () => {
    expect(csvField(null)).toBe('');
  });

  it('writes numbers as they are, negative ones included', () => {
    expect(csvField(1234)).toBe('1234');
    expect(csvField(0.25)).toBe('0.25');
    expect(csvField(-3)).toBe('-3');
  });

  it('writes plain text without quotes', () => {
    expect(csvField('/orders/:id')).toBe('/orders/:id');
  });

  it('quotes text with a separator, a quote or a line break, doubling the quotes', () => {
    expect(csvField('a,b')).toBe('"a,b"');
    expect(csvField('say "hi"')).toBe('"say ""hi"""');
    expect(csvField('two\nlines')).toBe('"two\nlines"');
  });

  it.each(['=SUM(A1:A2)', '+1', '-1', '@cmd', '\tindent'])(
    'keeps a spreadsheet from reading %j as a formula',
    (text) => {
      expect(csvField(text)).toBe(`'${text}`);
    },
  );

  it('guards and quotes text that starts with a carriage return', () => {
    expect(csvField('\r=1')).toBe(`"'\r=1"`);
  });

  it('guards a formula that also needs quotes', () => {
    expect(csvField('=HYPERLINK("x","y")')).toBe(`"'=HYPERLINK(""x"",""y"")"`);
  });
});

describe('csvDocument', () => {
  it('starts with a byte order mark and ends every line with CRLF', () => {
    const document = csvDocument({
      columns: ['path', 'visits'],
      rows: [
        ['/pricing', 12],
        ['/=bad', null],
      ],
    });

    expect(document).toBe(`${BYTE_ORDER_MARK}path,visits\r\n/pricing,12\r\n/=bad,\r\n`);
  });

  it('writes only the header when there are no rows', () => {
    expect(csvDocument({ columns: ['event', 'count'], rows: [] })).toBe(
      `${BYTE_ORDER_MARK}event,count\r\n`,
    );
  });
});

describe('csvFileName', () => {
  it('joins the parts after the product name', () => {
    expect(csvFileName(['overview', 'pages', '2026-09-08', '2026-10-07'])).toBe(
      'pyxis-overview-pages-2026-09-08-2026-10-07.csv',
    );
  });
});

describe('chosenTable', () => {
  const tables = ['daily', 'pages'] as const;

  it('takes the first table when none is asked', () => {
    expect(chosenTable(tables, undefined)).toBe('daily');
  });

  it('takes the table asked for', () => {
    expect(chosenTable(tables, 'pages')).toBe('pages');
  });

  it('refuses a table the screen does not have', () => {
    expect(chosenTable(tables, 'secrets')).toBeNull();
  });
});
