import { describe, expect, it } from 'vitest';
import type { OverviewWire } from './overview';
import {
  ACTIVITY,
  chartCaption,
  chartColumns,
  chartDays,
  chartMetric,
  chartRows,
  chartSummary,
  chartValues,
  formatChartValue,
  keptMetric,
  overviewChart,
  withChartMetric,
} from './overview-chart';
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
        { failed: 0, total: 0 },
        { failed: 61, total: 2524 },
      ],
    },
  },
  days: [
    { date: '2026-10-04', page_views: 180, events: 96 },
    { date: '2026-10-05', page_views: 174, events: 82 },
  ],
  top_pages: [],
  top_events: [],
};

const PREVIOUS_DAYS: NonNullable<OverviewWire['previous_days']> = [
  {
    date: '2026-10-02',
    page_views: 150,
    events: 70,
    visits: 2100,
    identified_users: 200,
    conversions: 90,
    converting_visits: 80,
    write_errors: { failed: 8, total: 400 },
  },
  {
    date: '2026-10-03',
    page_views: 160,
    events: 75,
    visits: 2133,
    identified_users: 205,
    conversions: 112,
    converting_visits: 100,
    write_errors: { failed: 0, total: 0 },
  },
];

const WITH_PREVIOUS: OverviewWire = { ...WIRE, previous_days: PREVIOUS_DAYS };

function chartOf(wire: OverviewWire, metric: Parameters<typeof overviewChart>[1]) {
  return overviewChart(overviewResponseSchema.parse(wire), metric);
}

describe('chartMetric', () => {
  const available = ['visits', 'identified-users', 'write-errors'] as const;

  it('plots the figure the address names when its card is on the screen', () => {
    expect(chartMetric('visits', available)).toBe('visits');
    expect(chartMetric('write-errors', available)).toBe('write-errors');
  });

  it('plots the activity for no name, an unknown name or a figure without a card', () => {
    expect(chartMetric(null, available)).toBe(ACTIVITY);
    expect(chartMetric(undefined, available)).toBe(ACTIVITY);
    expect(chartMetric('bounces', available)).toBe(ACTIVITY);
    expect(chartMetric('conversions', available)).toBe(ACTIVITY);
  });
});

describe('the metric in the address', () => {
  it('names the plotted figure beside the period, and leaves it out for the activity', () => {
    expect(withChartMetric('range=7d', 'visits')).toBe('range=7d&metric=visits');
    expect(withChartMetric('range=7d&metric=visits', 'write-errors')).toBe(
      'range=7d&metric=write-errors',
    );
    expect(withChartMetric('metric=visits&range=7d', ACTIVITY)).toBe('range=7d');
    expect(withChartMetric('metric=visits', ACTIVITY)).toBe('');
  });

  it('is kept by the period links only when a figure is plotted', () => {
    expect(keptMetric('conversions')).toEqual({ metric: 'conversions' });
    expect(keptMetric(ACTIVITY)).toEqual({});
  });

  it('ignores a repeated parameter', () => {
    expect(chartMetric(['visits', 'visits'], ['visits'])).toBe(ACTIVITY);
  });
});

describe('formatChartValue', () => {
  it('writes counts with separators and rates as percentages, and a dash for no value', () => {
    expect(formatChartValue(4758, 'count')).toBe('4,758');
    expect(formatChartValue(2.5, 'percent')).toBe('2.5%');
    expect(formatChartValue(null, 'percent')).toBe('—');
  });
});

describe('overviewChart', () => {
  it('plots page views and named events by default, with their totals', () => {
    const chart = chartOf(WIRE, ACTIVITY);

    expect(chart).toMatchObject({
      metric: ACTIVITY,
      title: 'Activity per day',
      subject: 'Page views and named events',
      format: 'count',
      dates: ['2026-10-04', '2026-10-05'],
      previousDates: null,
    });
    expect(chart.series).toEqual([
      {
        key: 'pageViews',
        label: 'Page views',
        color: 'sky',
        values: [180, 174],
        previous: [],
        total: '354',
      },
      {
        key: 'events',
        label: 'Named events',
        color: 'violet',
        values: [96, 82],
        previous: [],
        total: '178',
      },
    ]);
    expect(chart.previousTotal).toBeNull();
  });

  it('adds the same days of the previous period when the API sends them', () => {
    const chart = chartOf(WITH_PREVIOUS, ACTIVITY);

    expect(chart.previousDates).toEqual(['2026-10-02', '2026-10-03']);
    expect(chart.series.map((series) => series.previous)).toEqual([
      [150, 160],
      [70, 75],
    ]);
    expect(chart.previousTotal).toBeNull();
  });

  it('plots the visits of each day against the previous period, totalled like the card', () => {
    const chart = chartOf(WITH_PREVIOUS, 'visits');

    expect(chart).toMatchObject({ title: 'Visits per day', subject: 'Visits', additive: true });
    expect(chart.series).toEqual([
      {
        key: 'visits',
        label: 'Visits',
        color: 'sky',
        values: [2400, 2358],
        previous: [2100, 2133],
        total: '4,758',
      },
    ]);
    expect(chart.previousTotal).toBe('4,233');
    expect(chartOf(WIRE, 'visits')).toMatchObject({ previousDates: null, previousTotal: null });
  });

  it('does not add identified users up, since one person signs in on several days', () => {
    const chart = chartOf(WITH_PREVIOUS, 'identified-users');

    expect(chart).toMatchObject({ title: 'Identified users per day', additive: false });
    expect(chart.series[0]).toMatchObject({
      color: 'violet',
      values: [220, 218],
      previous: [200, 205],
      total: '438',
    });
  });

  it('plots converting visits when the API counts them, and conversion events otherwise', () => {
    const converting = chartOf(
      {
        ...WITH_PREVIOUS,
        kpis: {
          ...WIRE.kpis,
          converting_visits: { current: 190, previous: 180, daily: [95, 95] },
        },
      },
      'conversions',
    );
    const events = chartOf(WITH_PREVIOUS, 'conversions');

    expect(converting.series[0]).toMatchObject({
      color: 'accent',
      values: [95, 95],
      previous: [80, 100],
      total: '190',
    });
    expect(events.series[0]).toMatchObject({ values: [100, 112], previous: [90, 112] });
  });

  it('falls back to the activity when the project counts no conversion', () => {
    expect(chartOf({ ...WIRE, kpis: { ...WIRE.kpis, conversions: null } }, 'conversions')).toEqual(
      chartOf(WIRE, ACTIVITY),
    );
  });

  it('plots the write error rate in percent, with a gap on a day without writes', () => {
    const chart = chartOf(WITH_PREVIOUS, 'write-errors');

    expect(chart).toMatchObject({ format: 'percent', gapLabel: 'no writes' });
    expect(chart.series[0]).toMatchObject({
      color: 'bad',
      values: [null, (61 / 2524) * 100],
      previous: [2, null],
      total: '2.4%',
    });
    expect(chart.previousTotal).toBe('2.7%');
  });
});

describe('chartValues', () => {
  it('lists every value drawn, the previous period included, so the scale fits them all', () => {
    expect(chartValues(chartOf(WITH_PREVIOUS, 'visits'))).toEqual([2400, 2358, 2100, 2133]);
    expect(chartValues(chartOf(WITH_PREVIOUS, 'write-errors'))).toEqual([(61 / 2524) * 100, 2]);
  });
});

describe('chartSummary', () => {
  it('describes the chart in words for screen readers', () => {
    expect(chartSummary(chartOf(WIRE, ACTIVITY))).toBe(
      'Line chart of 2 days. Page views: 354 in total, between 174 and 180 a day. ' +
        'Named events: 178 in total, between 82 and 96 a day.',
    );
  });

  it('describes the dashed previous period too', () => {
    expect(chartSummary(chartOf(WITH_PREVIOUS, 'visits'))).toBe(
      'Line chart of 2 days. Visits: 4,758 in total, between 2,358 and 2,400 a day. ' +
        'Dashed, the previous period. Visits: 4,233 in total, between 2,100 and 2,133 a day.',
    );
  });

  it('gives no total for a figure that does not add up, and counts the days without a value', () => {
    expect(chartSummary(chartOf(WITH_PREVIOUS, 'write-errors'))).toBe(
      'Line chart of 2 days. Write error rate: between 2.4% and 2.4% a day, ' +
        'no writes on 1 day. Dashed, the previous period. ' +
        'Write error rate: between 2% and 2% a day, no writes on 1 day.',
    );
  });

  it('says so when no day has a value', () => {
    const quiet = chartOf(
      {
        ...WIRE,
        kpis: {
          ...WIRE.kpis,
          write_errors: { ...WIRE.kpis.write_errors, daily: [{ failed: 0, total: 0 }] },
        },
        days: [{ date: '2026-10-05', page_views: 1, events: 0 }],
      },
      'write-errors',
    );

    expect(chartSummary(quiet)).toBe(
      'Line chart of 1 day. Write error rate: no writes on any day.',
    );
  });
});

describe('the table of the chart', () => {
  it('has a column per series, and the compared day and values when there is a previous period', () => {
    expect(chartColumns(chartOf(WIRE, ACTIVITY))).toEqual([
      { label: 'Page views', numeric: true },
      { label: 'Named events', numeric: true },
    ]);
    expect(chartColumns(chartOf(WITH_PREVIOUS, 'visits'))).toEqual([
      { label: 'Visits', numeric: true },
      { label: 'Compared with', numeric: false },
      { label: 'Visits then', numeric: true },
    ]);
  });

  it('names the period and says whether the previous one is in it', () => {
    expect(chartCaption(chartOf(WIRE, ACTIVITY), 'last 2 days')).toBe(
      'Page views and named events per day, last 2 days',
    );
    expect(chartCaption(chartOf(WITH_PREVIOUS, 'visits'), 'last 2 days')).toBe(
      'Visits per day, last 2 days, with the previous period',
    );
  });

  it('writes one row per day, beside the same day of the previous period', () => {
    expect(chartRows(chartOf(WIRE, ACTIVITY))).toEqual([
      { day: 'Oct 4', cells: ['180', '96'] },
      { day: 'Oct 5', cells: ['174', '82'] },
    ]);
    expect(chartRows(chartOf(WITH_PREVIOUS, 'write-errors'))).toEqual([
      { day: 'Oct 4', cells: ['—', 'Oct 2', '2%'] },
      { day: 'Oct 5', cells: ['2.4%', 'Oct 3', '—'] },
    ]);
  });

  it('writes a dash where the previous period has fewer days', () => {
    const shorter = chartOf({ ...WIRE, previous_days: PREVIOUS_DAYS.slice(0, 1) }, 'visits');

    expect(chartRows(shorter)).toEqual([
      { day: 'Oct 4', cells: ['2,400', 'Oct 2', '2,100'] },
      { day: 'Oct 5', cells: ['2,358', '—', '—'] },
    ]);
  });
});

describe('chartDays', () => {
  it('lists the values of each day under the pointer, the previous period after them', () => {
    expect(chartDays(chartOf(WITH_PREVIOUS, 'visits'))[1]).toEqual({
      day: 'Oct 5',
      points: [
        { label: 'Visits', value: '2,358', color: 'sky', previous: false },
        { label: 'Visits, Oct 3', value: '2,133', color: 'sky', previous: true },
      ],
    });
  });

  it('lists only the current values without a previous period', () => {
    expect(chartDays(chartOf(WIRE, ACTIVITY))[0]).toEqual({
      day: 'Oct 4',
      points: [
        { label: 'Page views', value: '180', color: 'sky', previous: false },
        { label: 'Named events', value: '96', color: 'violet', previous: false },
      ],
    });
  });
});
