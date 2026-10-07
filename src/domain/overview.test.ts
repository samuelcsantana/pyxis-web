import { describe, expect, it } from 'vitest';
import {
  activitySummary,
  activityTotals,
  hasActivity,
  type OverviewReport,
  overviewKpis,
  type OverviewWire,
  previousPeriodNote,
  comparesUnfinishedDayWithWholeOne,
  spokenChange,
} from './overview';
import { overviewResponseSchema } from './overview.schema';

const WIRE: OverviewWire = {
  kpis: {
    visits: { current: 4758, previous: 4233, daily: [2400, 2358] },
    identified_users: { current: 438, previous: 405, daily: [220, 218] },
    conversions: { current: 212, previous: 202, daily: [100, 112] },
    write_errors: {
      current: { failed: 61, total: 2524 },
      previous: { failed: 68, total: 2518 },
      daily: [
        { failed: 30, total: 1200 },
        { failed: 31, total: 1324 },
      ],
    },
  },
  days: [
    { date: '2026-10-04', page_views: 180, events: 96 },
    { date: '2026-10-05', page_views: 174, events: 82 },
  ],
  top_pages: [{ path: '/', views: 1486, visits: 1120 }],
  top_events: [{ name: 'cta_clicked', count: 864, visits: 700 }],
};

function report(wire: OverviewWire = WIRE): OverviewReport {
  return overviewResponseSchema.parse(wire);
}

describe('overviewResponseSchema', () => {
  it('maps the wire names to the dashboard ones', () => {
    const parsed = report();

    expect(parsed.kpis.identifiedUsers.current).toBe(438);
    expect(parsed.kpis.writeErrors.current).toEqual({ failed: 61, total: 2524 });
    expect(parsed.days[0]).toEqual({ date: '2026-10-04', pageViews: 180, events: 96 });
    expect(parsed.topPages[0]?.path).toBe('/');
    expect(parsed.topEvents[0]?.name).toBe('cta_clicked');
  });

  it('knows nothing of the comparison when the API does not say', () => {
    const parsed = report();

    expect(parsed.comparison).toEqual({ kind: 'unknown' });
    expect(parsed.previousDays).toBeNull();
  });

  it('reads whole days from a null cutoff', () => {
    expect(report({ ...WIRE, comparison_cutoff: null }).comparison).toEqual({
      kind: 'whole-days',
    });
  });

  it('keeps the hours and minutes of the local time the previous period stopped at', () => {
    expect(report({ ...WIRE, comparison_cutoff: '10:03:27.250' }).comparison).toEqual({
      kind: 'same-time',
      until: '10:03',
    });
  });

  it('maps the previous days to the dashboard names', () => {
    const parsed = report({
      ...WIRE,
      previous_days: [
        {
          date: '2026-10-03',
          page_views: 170,
          events: 90,
          visits: 2100,
          identified_users: 200,
          conversions: null,
          write_errors: { failed: 2, total: 40 },
        },
      ],
    });

    expect(parsed.previousDays).toEqual([
      {
        date: '2026-10-03',
        pageViews: 170,
        events: 90,
        visits: 2100,
        identifiedUsers: 200,
        conversions: null,
        convertingVisits: null,
        writeErrors: { failed: 2, total: 40 },
      },
    ]);
  });

  it('reads the converting visits when the API counts them, and null when it does not', () => {
    const parsed = report({
      ...WIRE,
      kpis: { ...WIRE.kpis, converting_visits: { current: 200, previous: 190, daily: [95, 105] } },
      previous_days: [
        {
          date: '2026-10-03',
          page_views: 170,
          events: 90,
          visits: 2100,
          identified_users: 200,
          conversions: 101,
          converting_visits: 98,
          write_errors: { failed: 2, total: 40 },
        },
      ],
    });

    expect(parsed.kpis.convertingVisits).toEqual({ current: 200, previous: 190, daily: [95, 105] });
    expect(parsed.previousDays?.[0]?.convertingVisits).toBe(98);
    expect(report().kpis.convertingVisits).toBeNull();
  });
});

describe('hasActivity', () => {
  it('is true when a day has a page view or an event', () => {
    expect(hasActivity(report())).toBe(true);
    expect(
      hasActivity(report({ ...WIRE, days: [{ date: '2026-10-05', page_views: 0, events: 3 }] })),
    ).toBe(true);
  });

  it('is false when every day is empty', () => {
    expect(
      hasActivity(report({ ...WIRE, days: [{ date: '2026-10-05', page_views: 0, events: 0 }] })),
    ).toBe(false);
  });
});

describe('activityTotals and activitySummary', () => {
  it('add the days up', () => {
    expect(activityTotals(report().days)).toEqual({ pageViews: 354, events: 178 });
  });

  it('describe the chart in words for screen readers', () => {
    expect(activitySummary(report().days)).toBe(
      'Area chart of 2 days. Page views: 354 in total, between 174 and 180 a day. ' +
        'Named events: 178 in total, between 82 and 96 a day.',
    );
  });
});

const ENDED = { endsToday: false } as const;
const ENDS_TODAY = { endsToday: true } as const;
const SAME_TIME = { kind: 'same-time', until: '10:03' } as const;
const WHOLE_DAYS = { kind: 'whole-days' } as const;
const UNKNOWN = { kind: 'unknown' } as const;

describe('previousPeriodNote', () => {
  it('names the period the change is measured against', () => {
    expect(previousPeriodNote(WHOLE_DAYS, { ...ENDED, days: 30 })).toBe('vs. previous 30 days');
    expect(previousPeriodNote(WHOLE_DAYS, { ...ENDED, days: 1 })).toBe('vs. the day before');
  });

  it('says until when the previous period was counted when today is not over', () => {
    expect(previousPeriodNote(SAME_TIME, { ...ENDS_TODAY, days: 1 })).toBe(
      'vs. yesterday until 10:03',
    );
    expect(previousPeriodNote(SAME_TIME, { ...ENDS_TODAY, days: 7 })).toBe(
      'vs. previous 7 days, until 10:03',
    );
  });

  it('says the previous period is whole when the API does not cut it and today is not over', () => {
    expect(previousPeriodNote(UNKNOWN, { ...ENDS_TODAY, days: 1 })).toBe(
      'so far today vs. all of yesterday',
    );
    expect(previousPeriodNote(UNKNOWN, { ...ENDS_TODAY, days: 30 })).toBe(
      'vs. previous 30 full days',
    );
  });

  it('keeps the plain note for a range that is over, whatever the API says', () => {
    expect(previousPeriodNote(UNKNOWN, { ...ENDED, days: 7 })).toBe('vs. previous 7 days');
    expect(previousPeriodNote(UNKNOWN, { ...ENDED, days: 1 })).toBe('vs. the day before');
  });
});

describe('spokenChange', () => {
  it('tells a screen reader whether the change is good news, not only the colour', () => {
    expect(spokenChange('+12.4% (+525)', 'good')).toBe(' change, better than the previous period');
    expect(spokenChange('+2 pt', 'bad')).toBe(' change, worse than the previous period');
    expect(spokenChange('+25% (+1)', 'neutral')).toBe(' change');
  });

  it('adds nothing to "no change"', () => {
    expect(spokenChange('no change', 'neutral')).toBe('');
  });
});

describe('comparesUnfinishedDayWithWholeOne', () => {
  it('is true only for today against all of yesterday', () => {
    expect(comparesUnfinishedDayWithWholeOne(UNKNOWN, { ...ENDS_TODAY, days: 1 })).toBe(true);
    expect(comparesUnfinishedDayWithWholeOne(UNKNOWN, { ...ENDS_TODAY, days: 7 })).toBe(false);
    expect(comparesUnfinishedDayWithWholeOne(UNKNOWN, { ...ENDED, days: 1 })).toBe(false);
    expect(comparesUnfinishedDayWithWholeOne(SAME_TIME, { ...ENDS_TODAY, days: 1 })).toBe(false);
  });
});

describe('overviewKpis', () => {
  it('gives the four figures with their change, tone and totals', () => {
    const [visits, users, conversions, errors] = overviewKpis(report(), { ...ENDED, days: 30 });

    expect(visits).toEqual({
      id: 'visits',
      label: 'Visits',
      value: '4,758',
      change: '+12.4% (+525)',
      tone: 'good',
      note: 'vs. previous 30 days',
      series: [2400, 2358],
    });
    expect(users?.note).toBe('signed in at least once');
    expect(conversions?.value).toBe('212');
    expect(conversions?.note).toBe('4.5% of 4,758 visits');
    expect(errors).toEqual({
      id: 'write-errors',
      label: 'Write error rate',
      value: '2.4%',
      change: '−0.3 pt',
      tone: 'neutral',
      note: '61 of 2,524 writes failed',
      series: [0.025, 31 / 1324],
    });
  });

  it('leaves out conversions when the project has no conversion event', () => {
    const kpis = overviewKpis(report({ ...WIRE, kpis: { ...WIRE.kpis, conversions: null } }), {
      ...ENDED,
      days: 7,
    });

    expect(kpis.map((kpi) => kpi.id)).toEqual(['visits', 'identified-users', 'write-errors']);
  });

  it('marks a rise of the error rate as bad and a fall of visits as bad', () => {
    const [visits, , , errors] = overviewKpis(
      report({
        ...WIRE,
        kpis: {
          ...WIRE.kpis,
          visits: { current: 90, previous: 100, daily: [90] },
          write_errors: {
            current: { failed: 10, total: 100 },
            previous: { failed: 1, total: 100 },
            daily: [{ failed: 10, total: 100 }],
          },
        },
      }),
      { ...ENDED, days: 1 },
    );

    expect(visits?.tone).toBe('bad');
    expect(errors?.tone).toBe('bad');
    expect(errors?.change).toBe('+9 pt');
  });

  it('calls a change that rounds to zero neither good nor bad news', () => {
    const [visits, , , errors] = overviewKpis(
      report({
        ...WIRE,
        kpis: {
          ...WIRE.kpis,
          visits: { current: 10001, previous: 10000, daily: [10001] },
          write_errors: {
            current: { failed: 30001, total: 1000000 },
            previous: { failed: 30000, total: 1000000 },
            daily: [{ failed: 30001, total: 1000000 }],
          },
        },
      }),
      { ...ENDED, days: 1 },
    );

    expect(visits).toMatchObject({ change: '0% (+1)', tone: 'neutral' });
    expect(errors).toMatchObject({ change: 'no change', tone: 'neutral' });
  });

  it('shows the difference alone, or a dash, and a neutral tone with nothing to compare', () => {
    const [visits, , , errors] = overviewKpis(
      report({
        ...WIRE,
        kpis: {
          ...WIRE.kpis,
          visits: { current: 5, previous: 0, daily: [5] },
          write_errors: {
            current: { failed: 0, total: 0 },
            previous: { failed: 0, total: 0 },
            daily: [{ failed: 0, total: 0 }],
          },
        },
      }),
      { ...ENDED, days: 1 },
    );

    expect(visits?.change).toBe('+5');
    expect(visits?.tone).toBe('neutral');
    expect(errors?.value).toBe('—');
    expect(errors?.change).toBe('—');
    expect(errors?.tone).toBe('neutral');
    expect(errors?.note).toBe('0 of 0 writes failed');
    expect(errors?.series).toEqual([null]);
  });

  it('judges no change while today is compared with all of yesterday', () => {
    const kpis = overviewKpis(report(), { ...ENDS_TODAY, days: 1 });

    expect(kpis.map((kpi) => kpi.tone)).toEqual(['neutral', 'neutral', 'neutral', 'neutral']);
    expect(kpis[0]?.note).toBe('so far today vs. all of yesterday');
  });

  it('judges the change when the API compared the same hours', () => {
    const [visits] = overviewKpis(report({ ...WIRE, comparison_cutoff: '10:03:00.000' }), {
      ...ENDS_TODAY,
      days: 1,
    });

    expect(visits).toMatchObject({ tone: 'good', note: 'vs. yesterday until 10:03' });
  });
});
