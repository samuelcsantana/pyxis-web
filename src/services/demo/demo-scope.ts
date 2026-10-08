import type { DateRange } from '../date-range';
import { demoAttributedVisits } from './demo-attribution';
import type { DemoProject } from './demo-catalog';
import { demoGeneratedVisits } from './demo-generator';
import { itemAt } from './demo-random';
import {
  API_REQUEST,
  type DemoEventRecord,
  type DemoVisitRecord,
  PAGE_VIEW,
  showcaseRecord,
} from './demo-records';
import { demoDays } from './demo-series';

export const DEMO_FIRST_EVENT_DATE = '2025-01-06';

export interface DemoScope {
  readonly range: DateRange;
  readonly now: Date;
  readonly until: string | null;
}

const IDENTIFY = 'identify';
const UNNAMED_EVENTS: ReadonlySet<string> = new Set([PAGE_VIEW, IDENTIFY, API_REQUEST]);
const NO_RESPONSE_STATUS = 0;
const FIRST_FAILING_STATUS = 400;
const GET = 'GET';
const MAX_CACHED_DAYS = 800;
const WILDCARD = '*';
const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g;

const generatedDays = new Map<string, readonly DemoVisitRecord[]>();

export function demoVisitsOfDay(project: DemoProject, date: string): readonly DemoVisitRecord[] {
  if (date < DEMO_FIRST_EVENT_DATE) {
    return [];
  }
  const key = `${project.id} ${date}`;
  const cached = generatedDays.get(key);
  if (cached !== undefined) {
    return cached;
  }
  if (generatedDays.size >= MAX_CACHED_DAYS) {
    generatedDays.clear();
  }
  const visits = demoGeneratedVisits(project, date);
  generatedDays.set(key, visits);
  return visits;
}

export function demoShowcaseVisits(project: DemoProject, now: Date): readonly DemoVisitRecord[] {
  return demoAttributedVisits({ sources: project.sources, visits: project.showcase }).map(
    ({ visit, attribution }) => showcaseRecord(visit, attribution, project.timezone, now),
  );
}

function isInScope(event: DemoEventRecord, scope: DemoScope): boolean {
  const { range, until } = scope;
  return (
    range.from <= event.date &&
    event.date <= range.to &&
    event.at <= scope.now.getTime() &&
    (until === null || event.date !== range.to || event.time < until)
  );
}

function withinScope(visit: DemoVisitRecord, scope: DemoScope): readonly DemoVisitRecord[] {
  const events = visit.events.filter((event) => isInScope(event, scope));
  return events.length === 0 ? [] : [{ ...visit, events }];
}

export function demoVisitsIn(project: DemoProject, scope: DemoScope): readonly DemoVisitRecord[] {
  return [
    ...demoShowcaseVisits(project, scope.now),
    ...demoDays(scope.range).flatMap((date) => demoVisitsOfDay(project, date)),
  ].flatMap((visit) => withinScope(visit, scope));
}

export function demoScopeOf(range: DateRange, now: Date): DemoScope {
  return { range, now, until: null };
}

export function isPageView(event: DemoEventRecord): boolean {
  return event.name === PAGE_VIEW;
}

export function isNamedEvent(event: DemoEventRecord): boolean {
  return !UNNAMED_EVENTS.has(event.name);
}

export function hasPageView(visit: DemoVisitRecord): boolean {
  return visit.events.some(isPageView);
}

export function isFailedStatus(status: number): boolean {
  return status === NO_RESPONSE_STATUS || status >= FIRST_FAILING_STATUS;
}

export function isWrite(event: DemoEventRecord): boolean {
  return event.request !== null && event.request.method !== GET;
}

export function isFailedRead(event: DemoEventRecord): boolean {
  return event.request?.method === GET && isFailedStatus(event.request.status);
}

export function hasFailed(event: DemoEventRecord): boolean {
  return event.request !== null && isFailedStatus(event.request.status);
}

export function countWhere<Item>(items: readonly Item[], test: (item: Item) => boolean): number {
  return items.reduce((count, item) => count + (test(item) ? 1 : 0), 0);
}

export function percentile(values: readonly number[], fraction: number): number | null {
  const sorted = values.toSorted((first, second) => first - second);
  if (sorted.length === 0) {
    return null;
  }
  const rank = fraction * (sorted.length - 1);
  const lower = Math.floor(rank);
  const lowerValue = itemAt(sorted, lower);
  return lowerValue + (itemAt(sorted, Math.ceil(rank)) - lowerValue) * (rank - lower);
}

export function roundedPercentile(values: readonly number[], fraction: number): number | null {
  const value = percentile(values, fraction);
  return value === null ? null : Math.round(value);
}

export function groupedBy<Item>(
  items: readonly Item[],
  keyOf: (item: Item) => string,
): ReadonlyMap<string, readonly Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const key = keyOf(item);
    const group = groups.get(key);
    if (group === undefined) {
      groups.set(key, [item]);
    } else {
      group.push(item);
    }
  }
  return groups;
}

export function groupOf<Item>(
  groups: ReadonlyMap<string, readonly Item[]>,
  key: string,
): readonly Item[] {
  return groups.get(key) ?? [];
}

export function visitDate(visit: DemoVisitRecord): string {
  return itemAt(visit.events, 0).date;
}

export function distinctCount(values: readonly (string | null)[]): number {
  return new Set(values.filter((value) => value !== null)).size;
}

export function pathPattern(path: string): RegExp {
  const parts = path
    .split(WILDCARD)
    .map((part) => part.replaceAll(REGEX_SPECIAL_CHARACTERS, String.raw`\$&`));
  return new RegExp(`^${parts.join('.*')}$`);
}

export interface DemoRanked {
  readonly name: string;
  readonly count: number;
  readonly visits: number;
}

export function demoRanking(
  visits: readonly DemoVisitRecord[],
  matches: (event: DemoEventRecord) => boolean,
  nameOf: (event: DemoEventRecord) => string,
): readonly DemoRanked[] {
  const occurrences = visits.flatMap((visit) =>
    visit.events
      .filter(matches)
      .map((event) => ({ name: nameOf(event), session: visit.sessionId })),
  );
  return [...groupedBy(occurrences, (occurrence) => occurrence.name)]
    .map(([name, group]) => ({
      name,
      count: group.length,
      visits: distinctCount(group.map((occurrence) => occurrence.session)),
    }))
    .toSorted(byKeys((ranked) => [-ranked.count, ranked.name]));
}

export type SortKey = readonly (number | string)[];

function compareKeys(first: SortKey, second: SortKey): number {
  for (const [index, value] of first.entries()) {
    const other = itemAt(second, index);
    if (value !== other) {
      return typeof value === 'number' && typeof other === 'number'
        ? value - other
        : String(value).localeCompare(String(other));
    }
  }
  return 0;
}

export function byKeys<Item>(keyOf: (item: Item) => SortKey) {
  return (first: Item, second: Item): number => compareKeys(keyOf(first), keyOf(second));
}
