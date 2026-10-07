import { type OverviewReport, type OverviewWire } from '@/domain/overview';
import { overviewResponseSchema } from '@/domain/overview.schema';
import { todayIn } from '@/domain/period';
import type { DateRange } from '../date-range';
import {
  type DemoDay,
  demoDayFigures,
  demoEventTotals,
  demoPageTotals,
} from '../demo/demo-dataset';
import { demoProjectOf } from '../demo/demo-projects';
import { demoConvertingVisits, previousRange } from '../demo/demo-series';

export const TOP_ITEMS = 10;

type CountedFigure = keyof Omit<DemoDay, 'date'>;

function total(days: readonly DemoDay[], key: CountedFigure): number {
  return days.reduce((sum, day) => sum + day[key], 0);
}

function kpi(current: readonly DemoDay[], previous: readonly DemoDay[], key: CountedFigure) {
  return {
    current: total(current, key),
    previous: total(previous, key),
    daily: current.map((day) => day[key]),
  };
}

function convertingVisitsKpi(current: readonly DemoDay[], previous: readonly DemoDay[]) {
  const daily = current.map((day) => demoConvertingVisits(day.conversions));
  return {
    current: daily.reduce((sum, value) => sum + value, 0),
    previous: previous.reduce((sum, day) => sum + demoConvertingVisits(day.conversions), 0),
    daily,
  };
}

function failureCount(days: readonly DemoDay[]) {
  return { failed: total(days, 'failedWrites'), total: total(days, 'writes') };
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

export function demoOverviewWire(projectId: string, range: DateRange, now: Date): OverviewWire {
  const project = demoProjectOf(projectId);
  const current = demoDayFigures(project, range, now);
  const previous = demoDayFigures(project, previousRange(range), now);
  const countsConversions = project.conversionEvent !== null;
  return {
    kpis: {
      visits: kpi(current, previous, 'visits'),
      identified_users: kpi(current, previous, 'identifiedUsers'),
      conversions: countsConversions ? kpi(current, previous, 'conversions') : null,
      converting_visits: countsConversions ? convertingVisitsKpi(current, previous) : null,
      write_errors: {
        current: failureCount(current),
        previous: failureCount(previous),
        daily: current.map((day) => ({ failed: day.failedWrites, total: day.writes })),
      },
    },
    days: current.map((day) => ({ date: day.date, page_views: day.pageViews, events: day.events })),
    top_pages: demoPageTotals(project, range)
      .slice(0, TOP_ITEMS)
      .map((page) => ({ path: page.name, views: page.count, visits: page.visits })),
    top_events: demoEventTotals(project, range)
      .slice(0, TOP_ITEMS)
      .map((event) => ({ name: event.name, count: event.count, visits: event.visits })),
    comparison_cutoff: comparisonCutoff(range, project.timezone, now),
    previous_days: previous.map((day) => ({
      date: day.date,
      page_views: day.pageViews,
      events: day.events,
      visits: day.visits,
      identified_users: day.identifiedUsers,
      conversions: countsConversions ? day.conversions : null,
      converting_visits: countsConversions ? demoConvertingVisits(day.conversions) : null,
      write_errors: { failed: day.failedWrites, total: day.writes },
    })),
  };
}

export function demoOverviewReport(projectId: string, range: DateRange, now: Date): OverviewReport {
  return overviewResponseSchema.parse(demoOverviewWire(projectId, range, now));
}
