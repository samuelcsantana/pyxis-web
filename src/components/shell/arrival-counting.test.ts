import { describe, expect, it } from 'vitest';
import type { ArrivalKind, ArrivalsReport } from '@/domain/arrivals';
import { arrivalNewsOf, COUNTED_SCREENS, oldestMark } from './arrival-counting';

const AT_NOON = Date.parse('2026-10-23T12:00:00Z');
const MINUTE = 60_000;

function times(count: number): number[] {
  return Array.from({ length: count }, (_, index) => AT_NOON - index * MINUTE);
}

const REPORT: ArrivalsReport = {
  asOf: AT_NOON,
  activeVisits: 2,
  visits: { times: times(3), more: false },
  conversions: { times: times(1), more: false },
  namedEvents: { times: times(100), more: true },
  failedRequests: { times: [], more: false },
};

const label = (kind: ArrivalKind, count: number) => `${String(count)} ${kind}`;
const EARLY = AT_NOON - 10 * MINUTE;
const EVERY_SCREEN_EARLY = Object.fromEntries(COUNTED_SCREENS.map((screen) => [screen, EARLY]));

describe('arrivalNewsOf', () => {
  it('counts for each screen what arrived after its own mark, by the kind it shows', () => {
    const news = arrivalNewsOf({
      report: REPORT,
      marks: { ...EVERY_SCREEN_EARLY, visits: AT_NOON - MINUTE, features: 0 },
      current: undefined,
      label,
    });

    expect(news).toEqual({
      overview: { shown: '3', label: '3 visits' },
      visits: { shown: '1', label: '1 visits' },
      devices: { shown: '3', label: '3 visits' },
      acquisition: { shown: '3', label: '3 visits' },
      funnel: { shown: '1', label: '1 conversions' },
      features: { shown: '99+', label: '101 namedEvents' },
    });
  });

  it('never counts for the screen being shown, nor for a screen with nothing new', () => {
    const news = arrivalNewsOf({
      report: REPORT,
      marks: EVERY_SCREEN_EARLY,
      current: 'overview',
      label,
    });

    expect(news.overview).toBeUndefined();
    expect(news.requests).toBeUndefined();
    expect(news.timeline).toBeUndefined();
  });

  it('counts nothing for a screen without a mark yet', () => {
    expect(arrivalNewsOf({ report: REPORT, marks: {}, current: undefined, label })).toEqual({});
  });

  it('leaves the funnel without a count when the project has no conversion event', () => {
    const news = arrivalNewsOf({
      report: { ...REPORT, conversions: null },
      marks: EVERY_SCREEN_EARLY,
      current: undefined,
      label,
    });

    expect(news.funnel).toBeUndefined();
  });

  it('counts failed requests for the requests screen', () => {
    const news = arrivalNewsOf({
      report: { ...REPORT, failedRequests: { times: times(2), more: false } },
      marks: EVERY_SCREEN_EARLY,
      current: undefined,
      label,
    });

    expect(news.requests).toEqual({ shown: '2', label: '2 failedRequests' });
  });
});

describe('oldestMark', () => {
  it('takes the oldest mark of the counted screens', () => {
    expect(oldestMark({ overview: AT_NOON, funnel: EARLY, timeline: 0 })).toBe(EARLY);
  });

  it('has none when no counted screen has a mark', () => {
    expect(oldestMark({ timeline: EARLY })).toBeUndefined();
  });
});
