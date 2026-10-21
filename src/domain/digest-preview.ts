import { displayTag, type I18n } from '@/i18n/i18n';
import type { Tone } from './metrics';
import type { OverviewReport } from './overview';
import { addDays } from './period';
import type { RequestsReport, RouteReport } from './requests';

export const DIGEST_FAILING_ROUTES = 3;
const DAYS_IN_A_WEEK = 7;
const SUNDAY = 0;
const PERCENT = 100;
const NARROW_SPACES = /[\u2009\u202f]/g;
const OFFSET_ZONE_NAME_PREFIX = 'GMT';

export interface DigestWeek {
  readonly from: string;
  readonly to: string;
}

export type DigestTileId = 'visits' | 'identifiedUsers' | 'convertingVisits' | 'failedWrites';

export interface DigestTile {
  readonly id: DigestTileId;
  readonly label: string;
  readonly value: string;
  readonly line: string;
  readonly tone: Tone;
}

export interface DigestDay {
  readonly date: string;
  readonly label: string;
  readonly visits: string;
  readonly share: number;
}

export interface DigestRoute {
  readonly route: string;
  readonly count: string;
}

export interface DigestPreviewView {
  readonly sentOn: string;
  readonly subject: string;
  readonly project: string;
  readonly weekLine: string;
  readonly tiles: readonly DigestTile[];
  readonly days: readonly DigestDay[];
  readonly failingRoutes: readonly DigestRoute[];
}

export interface DigestPreviewReports {
  readonly project: string;
  readonly timeZone: string;
  readonly week: DigestWeek;
  readonly overview: OverviewReport;
  readonly writes: RequestsReport;
}

interface WeekOverWeek {
  readonly current: number;
  readonly previous: number;
}

function calendarDay(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function isoWeekday(isoDate: string): number {
  const day = calendarDay(isoDate).getUTCDay();
  return day === SUNDAY ? DAYS_IN_A_WEEK : day;
}

export function lastClosedWeek(today: string): DigestWeek {
  const lastSunday = addDays(today, -isoWeekday(today));
  return { from: addDays(lastSunday, 1 - DAYS_IN_A_WEEK), to: lastSunday };
}

function plainSpaces(text: string): string {
  return text.replace(NARROW_SPACES, ' ');
}

function datesOf(tag: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(tag, { ...options, timeZone: 'UTC' });
}

function zoneName(tag: string, timeZone: string, on: string): string {
  const name = new Intl.DateTimeFormat(tag, { timeZone, timeZoneName: 'longGeneric' })
    .formatToParts(calendarDay(on))
    .filter((part) => part.type === 'timeZoneName')
    .map((part) => part.value)
    .join('');
  return name.startsWith(OFFSET_ZONE_NAME_PREFIX) ? timeZone : name;
}

function changeOf(tag: string, { current, previous }: WeekOverWeek): string | null {
  const ratio = (current - previous) / previous;
  if (Math.round(ratio * PERCENT) === 0) {
    return null;
  }
  return new Intl.NumberFormat(tag, {
    style: 'percent',
    signDisplay: 'exceptZero',
    maximumFractionDigits: 0,
  }).format(ratio);
}

function comparison(pair: WeekOverWeek, i18n: I18n): string {
  const previous = i18n.format.count(pair.previous);
  if (pair.previous === 0) {
    return i18n.t('landing.report.mail.weekBeforeOnly', { previous });
  }
  const change = changeOf(displayTag(i18n.locale), pair);
  return change === null
    ? i18n.t('landing.report.mail.unchangedFromWeekBefore', { previous })
    : i18n.t('landing.report.mail.versusWeekBefore', { change, previous });
}

function trend({ current, previous }: WeekOverWeek): Tone {
  if (current === previous) {
    return 'neutral';
  }
  return current > previous ? 'good' : 'bad';
}

function weekTile(id: DigestTileId, pair: WeekOverWeek, i18n: I18n): DigestTile {
  return {
    id,
    label: i18n.t(`landing.report.mail.${id}`),
    value: i18n.format.count(pair.current),
    line: comparison(pair, i18n),
    tone: trend(pair),
  };
}

function convertingTiles(overview: OverviewReport, i18n: I18n): readonly DigestTile[] {
  const converting = overview.kpis.convertingVisits;
  if (converting === null) {
    return [];
  }
  const visits = overview.kpis.visits.current;
  return [
    {
      ...weekTile('convertingVisits', converting, i18n),
      line:
        visits === 0
          ? comparison(converting, i18n)
          : i18n.t('landing.report.mail.shareOfVisits', {
              share: i18n.format.percent(converting.current / visits),
            }),
      tone: 'neutral',
    },
  ];
}

function failedWritesTile(overview: OverviewReport, i18n: I18n): DigestTile {
  const { current } = overview.kpis.writeErrors;
  return {
    id: 'failedWrites',
    label: i18n.t('landing.report.mail.failedWrites'),
    value: i18n.format.count(current.failed),
    line:
      current.total === 0
        ? i18n.t('landing.report.mail.noWrites')
        : i18n.t('landing.report.mail.ofWrites', {
            writes: i18n.format.count(current.total),
            rate: i18n.format.percent(current.failed / current.total),
          }),
    tone: current.failed === 0 ? 'neutral' : 'bad',
  };
}

function daysOf(week: DigestWeek, daily: readonly number[], i18n: I18n): readonly DigestDay[] {
  const weekday = datesOf(displayTag(i18n.locale), { weekday: 'short' });
  const busiest = Math.max(0, ...daily);
  return Array.from({ length: DAYS_IN_A_WEEK }, (_, index) => {
    const date = addDays(week.from, index);
    const visits = daily[index] ?? 0;
    return {
      date,
      label: weekday.format(calendarDay(date)),
      visits: i18n.format.count(visits),
      share: busiest === 0 ? 0 : visits / busiest,
    };
  });
}

function routesOf(routes: readonly RouteReport[], i18n: I18n): readonly DigestRoute[] {
  return routes
    .slice(0, DIGEST_FAILING_ROUTES)
    .filter((route) => route.failed > 0)
    .map((route) => ({
      route: `${route.method} ${route.route}`,
      count: i18n.t('landing.report.mail.failedOf', {
        failed: i18n.format.count(route.failed),
        total: i18n.format.count(route.total),
      }),
    }));
}

export function digestPreviewOf(reports: DigestPreviewReports, i18n: I18n): DigestPreviewView {
  const { week, overview } = reports;
  const tag = displayTag(i18n.locale);
  const visits = overview.kpis.visits.current;
  const shortWeek = plainSpaces(
    datesOf(tag, { month: 'short', day: 'numeric' }).formatRange(
      calendarDay(week.from),
      calendarDay(week.to),
    ),
  );
  const longWeek = plainSpaces(
    datesOf(tag, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).formatRange(
      calendarDay(week.from),
      calendarDay(week.to),
    ),
  );
  return {
    sentOn: datesOf(tag, { weekday: 'short', month: 'short', day: 'numeric' }).format(
      calendarDay(addDays(week.to, 1)),
    ),
    subject: `${reports.project} · ${shortWeek} · ${i18n.t('counts.visit', { count: visits })}`,
    project: reports.project,
    weekLine: `${longWeek} · ${zoneName(tag, reports.timeZone, week.to)}`,
    tiles: [
      weekTile('visits', overview.kpis.visits, i18n),
      weekTile('identifiedUsers', overview.kpis.identifiedUsers, i18n),
      ...convertingTiles(overview, i18n),
      failedWritesTile(overview, i18n),
    ],
    days: daysOf(week, overview.kpis.visits.daily, i18n),
    failingRoutes: routesOf(reports.writes.routes, i18n),
  };
}

export function barHeight(share: number): string {
  return `${String(Math.round(share * PERCENT))}%`;
}
