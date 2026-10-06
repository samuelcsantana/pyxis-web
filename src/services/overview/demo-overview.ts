import { type OverviewReport, overviewResponseSchema, type OverviewWire } from '@/domain/overview';
import {
  demoCount,
  demoDays,
  demoPageViewsOn,
  demoVisitsOn,
  noise,
  previousRange,
} from '../demo/demo-series';
import { demoCountsConversions } from '../demo/demo-projects';
import type { DateRange } from '../date-range';

const TOP_PAGES = [
  { path: '/', share: 0.31 },
  { path: '/calculator', share: 0.23 },
  { path: '/pricing', share: 0.16 },
  { path: '/sign-up', share: 0.1 },
  { path: '/orders/:id', share: 0.08 },
  { path: '/blog/:slug', share: 0.06 },
] as const;

const TOP_EVENTS = [
  { name: 'calculator_result_shown', share: 0.34 },
  { name: 'cta_clicked', share: 0.24 },
  { name: 'login_completed', share: 0.11 },
  { name: 'order_created', share: 0.1 },
  { name: 'signup_submitted', share: 0.08 },
  { name: 'signup_completed', share: 0.06 },
] as const;

interface DemoDay {
  readonly date: string;
  readonly pageViews: number;
  readonly events: number;
  readonly visits: number;
  readonly identifiedUsers: number;
  readonly conversions: number;
  readonly writes: number;
  readonly failedWrites: number;
}

function demoDay(date: string): DemoDay {
  const pageViews = demoPageViewsOn(date);
  const visits = demoVisitsOn(date);
  const writes = demoCount(date, 84, 3);
  return {
    date,
    pageViews,
    events: demoCount(date, 80, 2),
    visits,
    identifiedUsers: Math.round(visits * 0.09),
    conversions: Math.round(visits * 0.045),
    writes,
    failedWrites: Math.round(writes * (0.01 + 0.04 * noise(date, 4))),
  };
}

function total(days: readonly DemoDay[], key: keyof Omit<DemoDay, 'date'>): number {
  return days.reduce((sum, day) => sum + day[key], 0);
}

function kpi(
  current: readonly DemoDay[],
  previous: readonly DemoDay[],
  key: keyof Omit<DemoDay, 'date'>,
) {
  return {
    current: total(current, key),
    previous: total(previous, key),
    daily: current.map((day) => day[key]),
  };
}

export function demoOverviewWire(projectId: string, range: DateRange): OverviewWire {
  const current = demoDays(range).map(demoDay);
  const previous = demoDays(previousRange(range)).map(demoDay);
  const pageViews = total(current, 'pageViews');
  const events = total(current, 'events');
  return {
    kpis: {
      visits: kpi(current, previous, 'visits'),
      identified_users: kpi(current, previous, 'identifiedUsers'),
      conversions: demoCountsConversions(projectId) ? kpi(current, previous, 'conversions') : null,
      write_errors: {
        current: { failed: total(current, 'failedWrites'), total: total(current, 'writes') },
        previous: { failed: total(previous, 'failedWrites'), total: total(previous, 'writes') },
        daily: current.map((day) => ({ failed: day.failedWrites, total: day.writes })),
      },
    },
    days: current.map((day) => ({ date: day.date, page_views: day.pageViews, events: day.events })),
    top_pages: TOP_PAGES.map((page) => {
      const views = Math.round(pageViews * page.share);
      return { path: page.path, views, visits: Math.round(views * 0.75) };
    }),
    top_events: TOP_EVENTS.map((event) => {
      const count = Math.round(events * event.share);
      return { name: event.name, count, visits: Math.round(count * 0.8) };
    }),
  };
}

export function demoOverviewReport(projectId: string, range: DateRange): OverviewReport {
  return overviewResponseSchema.parse(demoOverviewWire(projectId, range));
}
