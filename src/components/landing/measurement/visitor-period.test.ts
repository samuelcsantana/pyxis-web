import { afterEach, describe, expect, it, vi } from 'vitest';
import { bestEffortReadVisitorPeriod, VISITOR_PERIOD_KEY, visitorPeriodOf } from './visitor-period';

const STORED = {
  day_ends_at: '2026-10-14T03:00:00.000Z',
  month_ends_at: '2026-11-01T03:00:00.000Z',
};

const PERIOD = {
  dayEndsAt: '2026-10-14T03:00:00.000Z',
  monthEndsAt: '2026-11-01T03:00:00.000Z',
};

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('visitorPeriodOf', () => {
  it('reads when the day and the month end from the stored marker', () => {
    expect(visitorPeriodOf(STORED)).toEqual(PERIOD);
  });

  it('reads nothing from a value that is not a marker with two instants', () => {
    expect(visitorPeriodOf(null)).toBeNull();
    expect(visitorPeriodOf('2026-10-14T03:00:00.000Z')).toBeNull();
    expect(visitorPeriodOf({ day_ends_at: STORED.day_ends_at })).toBeNull();
    expect(visitorPeriodOf({ month_ends_at: STORED.month_ends_at })).toBeNull();
    expect(visitorPeriodOf({ ...STORED, day_ends_at: 'tomorrow' })).toBeNull();
    expect(visitorPeriodOf({ ...STORED, month_ends_at: 42 })).toBeNull();
  });
});

describe('bestEffortReadVisitorPeriod', () => {
  it('reads the marker the tracker keeps in this browser', () => {
    window.localStorage.setItem(VISITOR_PERIOD_KEY, JSON.stringify(STORED));

    expect(bestEffortReadVisitorPeriod()).toEqual(PERIOD);
  });

  it('reads nothing when the browser keeps no marker', () => {
    expect(bestEffortReadVisitorPeriod()).toBeNull();
  });

  it('reads nothing, and says why, from a marker that is not JSON', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(bestEffortReadVisitorPeriod(() => ({ getItem: () => '{not json' }))).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
  });

  it('reads nothing, and says why, when the browser refuses its storage', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const refused = () => {
      throw new DOMException('denied', 'SecurityError');
    };

    expect(bestEffortReadVisitorPeriod(refused)).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      'landing: could not read the unique visitors marker',
      expect.any(DOMException),
    );
  });
});
