import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { type RouteDay, routeDaysText, routeDaysView } from './route-days';

const QUIET_DAY: RouteDay = {
  date: '2026-10-03',
  total: 0,
  failed: 0,
  medianDurationMs: null,
  p95DurationMs: null,
};

const BUSY_DAY: RouteDay = {
  date: '2026-10-04',
  total: 1240,
  failed: 3,
  medianDurationMs: 152,
  p95DurationMs: 1410,
};

const CLEAN_DAY: RouteDay = {
  date: '2026-10-05',
  total: 18,
  failed: 0,
  medianDurationMs: 140,
  p95DurationMs: null,
};

describe('routeDaysView', () => {
  it('lists the days with calls in order, with their figures formatted', () => {
    expect(routeDaysView([BUSY_DAY, CLEAN_DAY], 'writes', english)).toEqual({
      rows: [
        {
          date: '2026-10-04',
          day: 'Oct 4',
          total: '1,240',
          failed: '3',
          hasFailures: true,
          median: '152 ms',
          p95: '1,410 ms',
        },
        {
          date: '2026-10-05',
          day: 'Oct 5',
          total: '18',
          failed: '0',
          hasFailures: false,
          median: '140 ms',
          p95: '—',
        },
      ],
      note: null,
    });
  });

  it('leaves the quiet days out and says how many, for writes and for failed reads', () => {
    const writes = routeDaysView([QUIET_DAY, BUSY_DAY], 'writes', english);
    const reads = routeDaysView(
      [QUIET_DAY, { ...QUIET_DAY, date: '2026-10-04' }, BUSY_DAY],
      'reads',
      english,
    );

    expect(writes.rows.map((row) => row.date)).toEqual(['2026-10-04']);
    expect(writes.note).toBe('1 day without a call is not listed.');
    expect(reads.note).toBe('2 days without a failed read are not listed.');
  });

  it('has no rows and no note when the route had no call at all', () => {
    expect(routeDaysView([QUIET_DAY], 'writes', english)).toEqual({ rows: [], note: null });
    expect(routeDaysView([], 'reads', english)).toEqual({ rows: [], note: null });
  });
});

describe('routeDaysText', () => {
  it('names a total column for writes and counts failed reads alone', () => {
    const writes = routeDaysText('writes', english);
    const reads = routeDaysText('reads', english);

    expect(writes).toEqual({
      heading: 'Day by day',
      loading: 'Loading the days of this route…',
      failed: 'Could not load the days of this route.',
      retry: 'Try again',
      unavailable: 'Day-by-day figures need a newer Pyxis API.',
      none: 'No calls to this route in this period.',
      columns: { day: 'Day', total: 'Total', failed: 'Failed', median: 'Median', p95: 'p95' },
    });
    expect(reads.columns.total).toBeNull();
    expect(reads.none).toBe('No failed reads of this route in this period.');
  });
});
