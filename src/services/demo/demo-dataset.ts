import type { FunnelMode, FunnelStep } from '@/domain/funnel';
import { addDays, todayIn } from '@/domain/period';
import type { DateRange } from '../date-range';
import type {
  DemoEvent,
  DemoFailedRead,
  DemoPage,
  DemoProject,
  DemoRoute,
  DemoShare,
} from './demo-catalog';
import { apportion, demoCount, demoDays, noise, textSalt } from './demo-series';
import { type DemoFailedRequest, demoFailedRequests } from './demo-visits';

export const RECENT_FAILURE_DAYS = 7;
const DEFAULT_CONTINUATION = 0.5;
const WILDCARD = '*';
const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g;
const PEOPLE_PER_VISIT: Readonly<Record<FunnelMode, number>> = { visit: 1, user: 0.8 };

export interface DemoTotal {
  readonly name: string;
  readonly count: number;
  readonly visits: number;
  readonly daily: readonly number[];
}

export interface DemoFailure {
  readonly date: string;
  readonly method: string;
  readonly route: string;
  readonly status: number;
  readonly path: string;
  readonly count: number;
  readonly request: DemoFailedRequest | null;
}

export interface DemoDay {
  readonly date: string;
  readonly pageViews: number;
  readonly events: number;
  readonly visits: number;
  readonly identifiedUsers: number;
  readonly conversions: number;
  readonly writes: number;
  readonly failedWrites: number;
}

export interface DemoShareCount {
  readonly value: string;
  readonly visits: number;
  readonly conversions: number | null;
}

function salt(project: DemoProject, ...parts: readonly (string | number)[]): number {
  return textSalt([project.id, ...parts].join(' '));
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function demoPageViewsOn(project: DemoProject, page: DemoPage, date: string): number {
  return demoCount(date, page.perDay, salt(project, 'page', page.path));
}

export function demoEventCountOn(project: DemoProject, event: DemoEvent, date: string): number {
  return demoCount(date, event.perDay, salt(project, 'event', event.name));
}

export function demoSuccessfulWritesOn(
  project: DemoProject,
  route: DemoRoute,
  date: string,
): number {
  return demoCount(date, route.perDay, salt(project, 'route', route.method, route.route));
}

export function demoFailedReadsOn(
  project: DemoProject,
  read: DemoFailedRead,
  date: string,
): number {
  return demoCount(date, read.perDay, salt(project, 'read', read.route));
}

function pageViewsOn(project: DemoProject, date: string): number {
  return sum(project.pages.map((page) => demoPageViewsOn(project, page, date)));
}

export function demoVisitsOn(project: DemoProject, date: string): number {
  return Math.round(pageViewsOn(project, date) * project.visitsPerPageView);
}

function conversionsOn(project: DemoProject, date: string): number {
  return sum(
    project.events
      .filter((event) => event.name === project.conversionEvent)
      .map((event) => demoEventCountOn(project, event, date)),
  );
}

function ranked(totals: readonly DemoTotal[]): readonly DemoTotal[] {
  return totals
    .filter((total) => total.count > 0)
    .toSorted(
      (first, second) => second.count - first.count || first.name.localeCompare(second.name),
    );
}

function demoTotal(name: string, daily: readonly number[], visitsPerCount: number): DemoTotal {
  const count = sum(daily);
  return { name, count, visits: Math.round(count * visitsPerCount), daily };
}

export function demoPageTotals(project: DemoProject, range: DateRange): readonly DemoTotal[] {
  const dates = demoDays(range);
  return ranked(
    project.pages.map((page) =>
      demoTotal(
        page.path,
        dates.map((date) => demoPageViewsOn(project, page, date)),
        page.visitsPerView,
      ),
    ),
  );
}

export function demoEventTotals(project: DemoProject, range: DateRange): readonly DemoTotal[] {
  const dates = demoDays(range);
  return ranked(
    project.events.map((event) =>
      demoTotal(
        event.name,
        dates.map((date) => demoEventCountOn(project, event, date)),
        event.visitsPerCount,
      ),
    ),
  );
}

export function demoEventCountIn(project: DemoProject, event: DemoEvent, range: DateRange): number {
  return sum(demoDays(range).map((date) => demoEventCountOn(project, event, date)));
}

export function demoVisitsTotal(project: DemoProject, range: DateRange): number {
  return sum(demoDays(range).map((date) => demoVisitsOn(project, date)));
}

export function demoConversionsTotal(project: DemoProject, range: DateRange): number | null {
  return project.conversionEvent === null
    ? null
    : sum(demoDays(range).map((date) => conversionsOn(project, date)));
}

function pickedScreen(project: DemoProject, route: DemoRoute, date: string, status: number) {
  const pick = noise(date, salt(project, 'screen', route.method, route.route, status));
  return route.screens.reduce(
    (choice, [path, share]) => (choice.left < 0 ? choice : { path, left: choice.left - share }),
    { path: '', left: pick * sum(route.screens.map(([, share]) => share)) },
  ).path;
}

function backgroundFailures(
  project: DemoProject,
  route: DemoRoute,
  date: string,
): readonly DemoFailure[] {
  const writes = demoSuccessfulWritesOn(project, route, date);
  return route.failures.flatMap(([status, share]) => {
    const expected = writes * share;
    const chance = noise(date, salt(project, 'failure', route.method, route.route, status));
    const count = Math.floor(expected) + (chance < expected - Math.floor(expected) ? 1 : 0);
    return count === 0
      ? []
      : [
          {
            date,
            method: route.method,
            route: route.route,
            status,
            path: pickedScreen(project, route, date, status),
            count,
            request: null,
          },
        ];
  });
}

function visitFailures(project: DemoProject, now: Date): readonly DemoFailure[] {
  return demoFailedRequests(project.visits, now).map((request) => ({
    date: todayIn(project.timezone, new Date(request.occurredAt)),
    method: request.method,
    route: request.route,
    status: request.status,
    path: request.path,
    count: 1,
    request,
  }));
}

export function demoFailures(
  project: DemoProject,
  range: DateRange,
  now: Date,
): readonly DemoFailure[] {
  const recentFrom = addDays(todayIn(project.timezone, now), 1 - RECENT_FAILURE_DAYS);
  const background = demoDays(range)
    .filter((date) => date < recentFrom)
    .flatMap((date) => project.routes.flatMap((route) => backgroundFailures(project, route, date)));
  const fromVisits = visitFailures(project, now).filter(
    (failure) => range.from <= failure.date && failure.date <= range.to,
  );
  return [...fromVisits, ...background];
}

export function demoDayFigures(
  project: DemoProject,
  range: DateRange,
  now: Date,
): readonly DemoDay[] {
  const failures = demoFailures(project, range, now);
  return demoDays(range).map((date) => {
    const visits = demoVisitsOn(project, date);
    const failedWrites = sum(
      failures.filter((failure) => failure.date === date).map((failure) => failure.count),
    );
    const successfulWrites = sum(
      project.routes.map((route) => demoSuccessfulWritesOn(project, route, date)),
    );
    return {
      date,
      pageViews: pageViewsOn(project, date),
      events: sum(project.events.map((event) => demoEventCountOn(project, event, date))),
      visits,
      identifiedUsers: Math.round(visits * project.identifiedShare),
      conversions: conversionsOn(project, date),
      writes: successfulWrites + failedWrites,
      failedWrites,
    };
  });
}

export function demoShareCounts(
  visits: number,
  conversions: number | null,
  shares: readonly DemoShare[],
): readonly DemoShareCount[] {
  const byVisits = apportion(visits, shares, (share) => share.share);
  if (conversions === null) {
    return byVisits.map(({ item, count }) => ({ value: item.value, visits: count, conversions }));
  }
  return apportion(conversions, byVisits, ({ item, count }) => count * item.conversionWeight).map(
    ({ item: { item, count }, count: converted }) => ({
      value: item.value,
      visits: count,
      conversions: converted,
    }),
  );
}

export function pathPattern(path: string): RegExp {
  const parts = path
    .split(WILDCARD)
    .map((part) => part.replaceAll(REGEX_SPECIAL_CHARACTERS, String.raw`\$&`));
  return new RegExp(`^${parts.join('.*')}$`);
}

function stepReach(
  step: FunnelStep,
  pages: readonly DemoTotal[],
  events: readonly DemoTotal[],
  visits: number,
): number {
  if (step.type === 'event') {
    return sum(events.filter((event) => event.name === step.name).map((event) => event.visits));
  }
  const pattern = pathPattern(step.path);
  return Math.min(
    visits,
    sum(pages.filter((page) => pattern.test(page.name)).map((page) => page.visits)),
  );
}

export function demoFunnelCounts(
  project: DemoProject,
  range: DateRange,
  mode: FunnelMode,
  steps: readonly FunnelStep[],
): readonly number[] {
  const pages = demoPageTotals(project, range);
  const events = demoEventTotals(project, range);
  const visits = demoVisitsTotal(project, range);
  return steps.reduce<readonly number[]>((counts, step, index) => {
    const reach = Math.round(stepReach(step, pages, events, visits) * PEOPLE_PER_VISIT[mode]);
    const before = counts.at(-1);
    if (before === undefined) {
      return [reach];
    }
    const continuation = project.funnelContinuation[index - 1] ?? DEFAULT_CONTINUATION;
    return [...counts, Math.min(reach, Math.round(before * continuation))];
  }, []);
}
