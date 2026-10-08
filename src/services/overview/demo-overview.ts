import { type OverviewReport, type OverviewWire } from '@/domain/overview';
import { overviewResponseSchema } from '@/domain/overview.schema';
import { todayIn } from '@/domain/period';
import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoEventRecord, DemoVisitRecord } from '../demo/demo-records';
import {
  countWhere,
  demoRanking,
  type DemoScope,
  demoVisitsIn,
  distinctCount,
  groupedBy,
  groupOf,
  hasFailed,
  hasPageView,
  isNamedEvent,
  isPageView,
  isWrite,
  visitDate,
} from '../demo/demo-scope';
import { demoDays, previousRange } from '../demo/demo-series';

export const TOP_ITEMS = 10;

interface Figures {
  readonly visits: number;
  readonly identifiedUsers: number;
  readonly conversions: number;
  readonly convertingVisits: number;
  readonly writes: number;
  readonly failedWrites: number;
  readonly pageViews: number;
  readonly events: number;
}

interface DayFigures extends Figures {
  readonly date: string;
}

function figuresOf(visits: readonly DemoVisitRecord[], conversionEvent: string | null): Figures {
  const events = visits.flatMap((visit) => visit.events);
  const isConversion = (event: DemoEventRecord) => event.name === conversionEvent;
  return {
    visits: countWhere(visits, hasPageView),
    identifiedUsers: distinctCount(visits.map((visit) => visit.userId)),
    conversions: countWhere(events, isConversion),
    convertingVisits: countWhere(visits, (visit) => visit.events.some(isConversion)),
    writes: countWhere(events, isWrite),
    failedWrites: countWhere(events, (event) => isWrite(event) && hasFailed(event)),
    pageViews: countWhere(events, isPageView),
    events: countWhere(events, isNamedEvent),
  };
}

function dailyFigures(
  visits: readonly DemoVisitRecord[],
  range: DateRange,
  conversionEvent: string | null,
): readonly DayFigures[] {
  const byDate = groupedBy(visits, visitDate);
  return demoDays(range).map((date) => ({
    date,
    ...figuresOf(groupOf(byDate, date), conversionEvent),
  }));
}

function comparisonCutoff(range: DateRange, timeZone: string, now: Date): string | null {
  if (range.to !== todayIn(timeZone, now)) {
    return null;
  }
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  }).format(now);
}

function kpi(current: Figures, previous: Figures, days: readonly Figures[], key: keyof Figures) {
  return { current: current[key], previous: previous[key], daily: days.map((day) => day[key]) };
}

function writeErrors(figures: Figures) {
  return { failed: figures.failedWrites, total: figures.writes };
}

export function demoOverviewWire(projectId: string, range: DateRange, now: Date): OverviewWire {
  const project = demoProjectOf(projectId);
  const { conversionEvent } = project;
  const cutoff = comparisonCutoff(range, project.timezone, now);
  const currentScope: DemoScope = { range, now, until: null };
  const previousScope: DemoScope = { range: previousRange(range), now, until: cutoff };
  const visits = demoVisitsIn(project, currentScope);
  const previousVisits = demoVisitsIn(project, previousScope);
  const current = figuresOf(visits, conversionEvent);
  const previous = figuresOf(previousVisits, conversionEvent);
  const days = dailyFigures(visits, range, conversionEvent);
  const previousDays = dailyFigures(previousVisits, previousScope.range, conversionEvent);
  const counts = conversionEvent !== null;
  return {
    kpis: {
      visits: kpi(current, previous, days, 'visits'),
      identified_users: kpi(current, previous, days, 'identifiedUsers'),
      conversions: counts ? kpi(current, previous, days, 'conversions') : null,
      converting_visits: counts ? kpi(current, previous, days, 'convertingVisits') : null,
      write_errors: {
        current: writeErrors(current),
        previous: writeErrors(previous),
        daily: days.map(writeErrors),
      },
    },
    days: days.map((day) => ({ date: day.date, page_views: day.pageViews, events: day.events })),
    top_pages: demoRanking(visits, isPageView, (event) => event.path)
      .slice(0, TOP_ITEMS)
      .map((page) => ({ path: page.name, views: page.count, visits: page.visits })),
    top_events: demoRanking(visits, isNamedEvent, (event) => event.name)
      .slice(0, TOP_ITEMS)
      .map((event) => ({ name: event.name, count: event.count, visits: event.visits })),
    comparison_cutoff: cutoff,
    previous_days: previousDays.map((day) => ({
      date: day.date,
      page_views: day.pageViews,
      events: day.events,
      visits: day.visits,
      identified_users: day.identifiedUsers,
      conversions: counts ? day.conversions : null,
      converting_visits: counts ? day.convertingVisits : null,
      write_errors: writeErrors(day),
    })),
  };
}

export function demoOverviewReport(projectId: string, range: DateRange, now: Date): OverviewReport {
  return overviewResponseSchema.parse(demoOverviewWire(projectId, range, now));
}
