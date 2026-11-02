import type { I18n } from '@/i18n/i18n';
import { formatCount } from './metrics';

export interface VisitorDay {
  readonly date: string;
  readonly firstVisit: number;
  readonly firstThisMonth: number;
  readonly firstToday: number;
  readonly againToday: number;
}

export interface VisitorMonth {
  readonly month: string;
  readonly firstVisit: number;
  readonly firstThisMonth: number;
  readonly exact: boolean;
}

export interface UniqueVisitors {
  readonly enabled: boolean;
  readonly daily: readonly VisitorDay[];
  readonly months: readonly VisitorMonth[];
}

export const NO_UNIQUE_VISITORS: UniqueVisitors = { enabled: false, daily: [], months: [] };

export const VISITOR_KINDS = ['newVisitors', 'returning'] as const;
export type VisitorKind = (typeof VISITOR_KINDS)[number];

export const WARMING_UP_NEW_SHARE = 0.9;

export interface VisitorFigures {
  readonly unique: number;
  readonly newVisitors: number;
  readonly returning: number;
}

export type VisitorsHeadline =
  | (VisitorFigures & { readonly span: 'day' | 'sumOfDays' })
  | (VisitorFigures & { readonly span: 'month' | 'monthSoFar'; readonly month: string });

export interface VisitorDayRow extends VisitorFigures {
  readonly date: string;
}

function dayFigures(day: VisitorDay): VisitorFigures {
  const returning = day.firstThisMonth + day.firstToday;
  return { unique: day.firstVisit + returning, newVisitors: day.firstVisit, returning };
}

export function visitorDayRow(day: VisitorDay): VisitorDayRow {
  return { date: day.date, ...dayFigures(day) };
}

export function visitorDayRows(visitors: UniqueVisitors): readonly VisitorDayRow[] {
  return visitors.daily.map(visitorDayRow);
}

export function hasCountedVisits(visitors: UniqueVisitors): boolean {
  return visitors.daily.some(
    (day) => day.firstVisit + day.firstThisMonth + day.firstToday + day.againToday > 0,
  );
}

function onlyOne<Item>(items: readonly Item[]): Item | undefined {
  return items.length === 1 ? items[0] : undefined;
}

function sumOfDays(rows: readonly VisitorDayRow[]): VisitorFigures {
  return rows.reduce(
    (sum, row) => ({
      unique: sum.unique + row.unique,
      newVisitors: sum.newVisitors + row.newVisitors,
      returning: sum.returning + row.returning,
    }),
    { unique: 0, newVisitors: 0, returning: 0 },
  );
}

export function visitorsHeadline(visitors: UniqueVisitors, endsToday: boolean): VisitorsHeadline {
  const day = onlyOne(visitors.daily);
  if (day !== undefined) {
    return { span: 'day', ...dayFigures(day) };
  }
  const month = onlyOne(visitors.months);
  if (month?.exact === true) {
    return {
      span: endsToday ? 'monthSoFar' : 'month',
      month: month.month,
      unique: month.firstVisit + month.firstThisMonth,
      newVisitors: month.firstVisit,
      returning: month.firstThisMonth,
    };
  }
  return { span: 'sumOfDays', ...sumOfDays(visitorDayRows(visitors)) };
}

export function isWarmingUp(figures: VisitorFigures): boolean {
  return figures.unique > 0 && figures.newVisitors / figures.unique >= WARMING_UP_NEW_SHARE;
}

function monthName(month: string, i18n: I18n): string {
  return i18n.format.monthWithYear(new Date(`${month}-01T00:00:00.000Z`));
}

export function headlineLabel(headline: VisitorsHeadline, i18n: I18n): string {
  switch (headline.span) {
    case 'day':
      return i18n.t('uniqueVisitors.unique');
    case 'month':
    case 'monthSoFar':
      return i18n.t(`uniqueVisitors.headline.${headline.span}`, {
        month: monthName(headline.month, i18n),
      });
    case 'sumOfDays':
      return i18n.t('uniqueVisitors.headline.sumOfDays');
  }
}

export function headlineNote(headline: VisitorsHeadline, i18n: I18n): string | null {
  switch (headline.span) {
    case 'day':
      return null;
    case 'month':
    case 'monthSoFar':
      return i18n.t('uniqueVisitors.daysInMonth');
    case 'sumOfDays':
      return i18n.t('uniqueVisitors.sumOfDays');
  }
}

export function visitorKindLabel(kind: VisitorKind, i18n: I18n): string {
  return i18n.t(`uniqueVisitors.${kind}`);
}

export function visitorDaysSummary(rows: readonly VisitorDayRow[], i18n: I18n): string {
  const daily = rows.map((row) => row.unique);
  return [
    i18n.t('uniqueVisitors.summary.bars', { days: i18n.t('counts.day', { count: rows.length }) }),
    i18n.t('uniqueVisitors.summary.range', {
      lowest: formatCount(Math.min(...daily), i18n),
      highest: formatCount(Math.max(...daily), i18n),
    }),
  ].join(' ');
}
