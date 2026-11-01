import { describe, expect, it } from 'vitest';
import {
  CAPPED_ARRIVAL_COUNT,
  countNewerThan,
  isCappedArrivalCount,
  shownArrivalCount,
} from './arrivals';
import { arrivalsResponseSchema } from './arrivals.schema';

const AT_NOON = Date.parse('2026-10-23T12:00:00Z');
const SECOND = 1_000;

function timesBefore(count: number): number[] {
  return Array.from({ length: count }, (_, index) => AT_NOON - index * SECOND);
}

describe('countNewerThan', () => {
  it('counts only the arrivals after the mark, newest first', () => {
    const arrivals = { times: timesBefore(5), more: false };

    expect(countNewerThan(arrivals, AT_NOON - 2 * SECOND)).toBe(2);
  });

  it('does not count an arrival at the very moment of the mark', () => {
    expect(countNewerThan({ times: [AT_NOON], more: false }, AT_NOON)).toBe(0);
  });

  it('counts every arrival when the mark is older than all of them', () => {
    expect(countNewerThan({ times: timesBefore(3), more: false }, 0)).toBe(3);
  });

  it('counts past the list when the API says more arrived than it listed', () => {
    const count = countNewerThan({ times: timesBefore(100), more: true }, 0);

    expect(count).toBe(101);
    expect(isCappedArrivalCount(count)).toBe(true);
  });

  it('counts nothing when nothing arrived', () => {
    expect(countNewerThan({ times: [], more: false }, AT_NOON)).toBe(0);
  });
});

describe('shownArrivalCount', () => {
  it('shows the count up to 99', () => {
    expect(shownArrivalCount(1)).toBe('1');
    expect(shownArrivalCount(99)).toBe('99');
    expect(isCappedArrivalCount(99)).toBe(false);
  });

  it('shows 99+ from 100 on', () => {
    expect(shownArrivalCount(100)).toBe(CAPPED_ARRIVAL_COUNT);
    expect(shownArrivalCount(250)).toBe('99+');
  });
});

describe('arrivalsResponseSchema', () => {
  const answer = {
    as_of: '2026-10-23T12:00:05Z',
    active_visits: 4,
    visits: { times: ['2026-10-23T12:00:01Z', '2026-10-23T11:59:30Z'], more: false },
    conversions: null,
    named_events: { times: ['2026-10-23T12:00:02Z'], more: true },
    failed_requests: { times: [], more: false },
  };

  it('reads the times as instants and the keys in camel case', () => {
    expect(arrivalsResponseSchema.parse(answer)).toEqual({
      asOf: Date.parse('2026-10-23T12:00:05Z'),
      activeVisits: 4,
      visits: {
        times: [Date.parse('2026-10-23T12:00:01Z'), Date.parse('2026-10-23T11:59:30Z')],
        more: false,
      },
      conversions: null,
      namedEvents: { times: [Date.parse('2026-10-23T12:00:02Z')], more: true },
      failedRequests: { times: [], more: false },
    });
  });

  it('reads the conversions of a project that has a conversion event', () => {
    const report = arrivalsResponseSchema.parse({
      ...answer,
      conversions: { times: ['2026-10-23T11:00:00Z'], more: false },
    });

    expect(report.conversions).toEqual({
      times: [Date.parse('2026-10-23T11:00:00Z')],
      more: false,
    });
  });

  it('refuses a time that is not an instant', () => {
    expect(() =>
      arrivalsResponseSchema.parse({ ...answer, visits: { times: ['yesterday'], more: false } }),
    ).toThrow();
  });
});
