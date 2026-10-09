import type { DateRange } from '../date-range';
import { demoProjectOf } from '../demo/demo-projects';
import type { DemoVisitRecord } from '../demo/demo-records';
import {
  byKeys,
  countWhere,
  demoScopeOf,
  demoVisitsIn,
  groupedBy,
  isPageView,
  roundedPercentile,
} from '../demo/demo-scope';

const TOP_PAGES = 10;
const VISIT_LENGTH_BOUNDS_SECONDS: readonly number[] = [10, 30, 60, 180, 600, 1800];
const MILLISECONDS_PER_SECOND = 1000;
const MEDIAN = 0.5;

interface VisitShape {
  readonly entryPath: string;
  readonly exitPath: string;
  readonly pageViews: number;
  readonly seconds: number;
}

function shapeOf(visit: DemoVisitRecord): readonly VisitShape[] {
  const pages = visit.events.filter(isPageView).toSorted((left, right) => left.at - right.at);
  const times = visit.events.map((event) => event.at);
  return pages.slice(0, 1).flatMap((entry) =>
    pages.slice(-1).map((exit) => ({
      entryPath: entry.path,
      exitPath: exit.path,
      pageViews: pages.length,
      seconds: (Math.max(...times) - Math.min(...times)) / MILLISECONDS_PER_SECOND,
    })),
  );
}

function ranked<Row extends { readonly path: string; readonly visits: number }>(
  rows: readonly Row[],
): readonly Row[] {
  return rows.toSorted(byKeys((row) => [-row.visits, row.path])).slice(0, TOP_PAGES);
}

function bucketOf(seconds: number): number {
  return countWhere(VISIT_LENGTH_BOUNDS_SECONDS, (bound) => seconds >= bound);
}

export function demoEngagementWire(projectId: string, range: DateRange, now: Date) {
  const shapes = demoVisitsIn(demoProjectOf(projectId), demoScopeOf(range, now)).flatMap(shapeOf);
  const isSinglePage = (shape: VisitShape) => shape.pageViews === 1;
  const byEntry = groupedBy(shapes, (shape) => shape.entryPath);
  const byExit = groupedBy(shapes, (shape) => shape.exitPath);
  const byBucket = groupedBy(shapes, (shape) => String(bucketOf(shape.seconds)));
  return {
    visits: shapes.length,
    single_page_visits: countWhere(shapes, isSinglePage),
    median_visit_seconds: roundedPercentile(
      shapes.map((shape) => shape.seconds),
      MEDIAN,
    ),
    visit_lengths: [...VISIT_LENGTH_BOUNDS_SECONDS, null].map((upToSeconds, bucket) => ({
      up_to_seconds: upToSeconds,
      visits: byBucket.get(String(bucket))?.length ?? 0,
    })),
    entry_pages: ranked(
      [...byEntry].map(([path, visits]) => ({
        path,
        visits: visits.length,
        single_page_visits: countWhere(visits, isSinglePage),
      })),
    ),
    exit_pages: ranked([...byExit].map(([path, visits]) => ({ path, visits: visits.length }))),
  };
}
