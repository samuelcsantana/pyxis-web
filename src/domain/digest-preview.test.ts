import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import {
  barHeight,
  type DigestPreviewReports,
  digestPreviewOf,
  lastClosedWeek,
} from './digest-preview';
import type { OverviewReport } from './overview';
import type { RouteReport } from './requests';

const WEEK = { from: '2026-10-12', to: '2026-10-18' } as const;

function kpi(current: number, previous: number, daily: number[] = []) {
  return { current, previous, daily };
}

const OVERVIEW: OverviewReport = {
  kpis: {
    visits: kpi(642, 617, [98, 104, 96, 91, 87, 79, 87]),
    identifiedUsers: kpi(84, 78),
    conversions: kpi(31, 30),
    convertingVisits: kpi(29, 27),
    writeErrors: {
      current: { failed: 9, total: 447 },
      previous: { failed: 6, total: 430 },
      daily: [],
    },
  },
  days: [],
  topPages: [],
  topEvents: [],
  comparison: { kind: 'whole-days' },
  previousDays: null,
};

function route(path: string, total: number, failed: number): RouteReport {
  return {
    method: 'POST',
    route: path,
    total,
    failed,
    statuses: [],
    medianDurationMs: 140,
    p95DurationMs: null,
    screens: [],
    recentFailures: [],
  };
}

const REPORTS: DigestPreviewReports = {
  project: 'My site',
  timeZone: 'America/Sao_Paulo',
  week: WEEK,
  overview: OVERVIEW,
  writes: {
    routes: [route('/orders', 162, 4), route('/payouts', 14, 3), route('/auth/sign-up', 59, 2)],
    days: [],
    routeDays: null,
  },
};

function withOverview(kpis: Partial<OverviewReport['kpis']>): DigestPreviewReports {
  return { ...REPORTS, overview: { ...OVERVIEW, kpis: { ...OVERVIEW.kpis, ...kpis } } };
}

describe('lastClosedWeek', () => {
  it.each([
    ['a Wednesday', '2026-10-21', { from: '2026-10-12', to: '2026-10-18' }],
    ['a Monday', '2026-10-19', { from: '2026-10-12', to: '2026-10-18' }],
    ['a Sunday, whose week is not over', '2026-10-18', { from: '2026-10-05', to: '2026-10-11' }],
  ])('closes on the Sunday before %s, as the API does', (_day, today, week) => {
    expect(lastClosedWeek(today)).toEqual(week);
  });
});

describe('digestPreviewOf', () => {
  it('writes the subject, the week and the sending Monday as the e-mail does', () => {
    const view = digestPreviewOf(REPORTS, english);

    expect(view.subject).toBe('My site · Oct 12 – 18 · 642 visits');
    expect(view.sentOn).toBe('Mon, Oct 19');
    expect(view.project).toBe('My site');
    expect(view.weekLine).toMatch(/^Monday, October 12 – Sunday, October 18, 2026 · Brasilia /);
  });

  it('compares each figure with the week before, in the e-mail’s own words', () => {
    const view = digestPreviewOf(REPORTS, english);

    expect(view.tiles.map((tile) => [tile.label, tile.value, tile.line, tile.tone])).toEqual([
      ['Visits', '642', '+4% vs. the week before (617)', 'good'],
      ['Identified users', '84', '+8% vs. the week before (78)', 'good'],
      ['Converting visits', '29', '4.5% of visits', 'neutral'],
      ['Failed writes', '9', 'of 447 writes, 2.0%', 'bad'],
    ]);
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    const view = digestPreviewOf({ ...REPORTS, project: 'Meu site' }, portuguese);

    expect(view.subject).toBe('Meu site · 12 – 18 de out. · 642 visitas');
    expect(view.weekLine).toMatch(/^segunda-feira, 12 de outubro – .* · Horário .*Brasília$/);
    expect(view.tiles[0]?.line).toBe('+4% vs. a semana anterior (617)');
    expect(view.failingRoutes[0]).toEqual({ route: 'POST /orders', count: '4 de 162 falharam' });
    expect(view.days[0]?.label).toBe('seg.');
  });

  it('says when a figure did not change, fell, or had nothing the week before', () => {
    const view = digestPreviewOf(
      withOverview({
        visits: kpi(642, 640, []),
        identifiedUsers: kpi(70, 84),
        convertingVisits: kpi(3, 0),
      }),
      english,
    );

    expect(view.tiles.map((tile) => [tile.line, tile.tone])).toEqual([
      ['no change vs. the week before (640)', 'good'],
      ['-17% vs. the week before (84)', 'bad'],
      ['0.5% of visits', 'neutral'],
      ['of 447 writes, 2.0%', 'bad'],
    ]);
  });

  it('keeps an even figure neutral', () => {
    const view = digestPreviewOf(withOverview({ identifiedUsers: kpi(84, 84) }), english);

    expect(view.tiles[1]).toMatchObject({
      line: 'no change vs. the week before (84)',
      tone: 'neutral',
    });
  });

  it('compares the converting visits instead of sharing them when no visit arrived', () => {
    const view = digestPreviewOf(
      withOverview({ visits: kpi(0, 0, []), convertingVisits: kpi(0, 0) }),
      english,
    );

    expect(view.tiles[2]).toMatchObject({
      label: 'Converting visits',
      line: '0 the week before',
    });
    expect(view.subject).toMatch(/· 0 visits$/);
  });

  it('leaves out the converting visits of a project without a conversion event', () => {
    const view = digestPreviewOf(withOverview({ convertingVisits: null }), english);

    expect(view.tiles.map((tile) => tile.id)).toEqual([
      'visits',
      'identifiedUsers',
      'failedWrites',
    ]);
  });

  it('says there were no writes, and keeps a week without failures neutral', () => {
    const none = digestPreviewOf(
      withOverview({
        writeErrors: {
          current: { failed: 0, total: 0 },
          previous: { failed: 0, total: 0 },
          daily: [],
        },
      }),
      english,
    );
    const clean = digestPreviewOf(
      withOverview({
        writeErrors: {
          current: { failed: 0, total: 300 },
          previous: { failed: 1, total: 290 },
          daily: [],
        },
      }),
      english,
    );

    expect(none.tiles.at(-1)).toMatchObject({ value: '0', line: 'no writes', tone: 'neutral' });
    expect(clean.tiles.at(-1)).toMatchObject({ line: 'of 300 writes, 0.0%', tone: 'neutral' });
  });

  it('draws the seven days of the week, each against the busiest', () => {
    const view = digestPreviewOf(REPORTS, english);

    expect(view.days.map((day) => [day.date, day.label, day.visits])).toEqual([
      ['2026-10-12', 'Mon', '98'],
      ['2026-10-13', 'Tue', '104'],
      ['2026-10-14', 'Wed', '96'],
      ['2026-10-15', 'Thu', '91'],
      ['2026-10-16', 'Fri', '87'],
      ['2026-10-17', 'Sat', '79'],
      ['2026-10-18', 'Sun', '87'],
    ]);
    expect(view.days[1]?.share).toBe(1);
    expect(barHeight(view.days[0]?.share ?? 0)).toBe('94%');
  });

  it('draws empty days for a week without visits', () => {
    const view = digestPreviewOf(withOverview({ visits: kpi(0, 0, [0, 0]) }), english);

    expect(view.days).toHaveLength(7);
    expect(view.days.every((day) => day.share === 0 && day.visits === '0')).toBe(true);
  });

  it('lists the first three failing writes, as the e-mail asks the API for them', () => {
    const view = digestPreviewOf(
      {
        ...REPORTS,
        writes: {
          routes: [
            route('/orders', 162, 4),
            route('/payouts', 14, 0),
            route('/auth/sign-up', 59, 2),
            route('/settings', 20, 1),
          ],
          days: [],
          routeDays: null,
        },
      },
      english,
    );

    expect(view.failingRoutes).toEqual([
      { route: 'POST /orders', count: '4 of 162 failed' },
      { route: 'POST /auth/sign-up', count: '2 of 59 failed' },
    ]);
  });

  it('names a time zone without a readable name by its id', () => {
    const view = digestPreviewOf({ ...REPORTS, timeZone: 'Etc/GMT+3' }, english);

    expect(view.weekLine).toMatch(/· Etc\/GMT\+3$/);
  });
});
