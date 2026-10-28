import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { isNumberText, isNumericKey, propertySummaryView } from './property-summary';
import { propertySummaryResponseSchema } from './property-summary.schema';

describe('isNumericKey', () => {
  it('reads plain, decimal, negative and exponent numbers, nothing else', () => {
    expect(['12', '12.5', '-3', '1e3'].every(isNumberText)).toBe(true);
    expect(['true', '', '12px', '1,5', 'Infinity', '1e999'].some(isNumberText)).toBe(false);
  });

  it('needs every value to be a number, and at least one value', () => {
    expect(isNumericKey(['12', '30.5'])).toBe(true);
    expect(isNumericKey(['12', 'true'])).toBe(false);
    expect(isNumericKey([])).toBe(false);
  });
});

describe('propertySummaryView', () => {
  it('formats the median, the middle half and the events, overall and per value', () => {
    const view = propertySummaryView(
      propertySummaryResponseSchema.parse({
        name: 'article_read_100',
        key: 'seconds',
        by: 'post',
        overall: { events: 6, median: 33, p25: 15.25, p75: 39 },
        groups: [
          { value: 'a', events: 2, median: 27, p25: 15, p75: 39 },
          { value: 'b', events: 0, median: null, p25: null, p75: null },
        ],
        other_count: 1,
      }),
      english,
    );

    expect(view).toEqual({
      overall: { median: '33', middleHalf: '15.3 to 39', events: '6 events' },
      groups: [{ value: 'a', median: '27', middleHalf: '15 to 39', events: '2 events' }],
      other: '1',
    });
  });

  it('has no figures when no event carries a number, and no rest without one', () => {
    expect(
      propertySummaryView(
        propertySummaryResponseSchema.parse({
          name: 'article_read_100',
          key: 'seconds',
          by: null,
          overall: { events: 0, median: null, p25: null, p75: null },
          groups: [],
          other_count: 0,
        }),
        english,
      ),
    ).toEqual({ overall: null, groups: [], other: null });
  });
});
