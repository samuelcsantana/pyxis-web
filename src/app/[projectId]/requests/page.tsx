import { RequestFilters } from '@/components/requests/request-filters';
import { RequestsTable } from '@/components/requests/requests-table';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { StatCard } from '@/components/ui/stat-card';
import {
  type Period,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import {
  errorRateFigure,
  FAILING_ONLY,
  failingOnlyOf,
  type RequestsSearch,
  routeRows,
  screenFilterOf,
  slowestRouteFigure,
  visibleRoutes,
  writesFigure,
} from '@/domain/requests';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createRequestsService } from '@/services/requests/requests-service.factory';

export const generateMetadata = screenMetadata('Requests');

export interface RequestsPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & RequestsSearch>;
}

interface RequestFilter {
  readonly failingOnly: boolean;
  readonly screen: string | null;
}

function filterParameters(filter: RequestFilter): Readonly<Record<string, string>> {
  return {
    ...(filter.failingOnly ? { show: FAILING_ONLY } : {}),
    ...(filter.screen === null ? {} : { screen: filter.screen }),
  };
}

function filterQuery(period: Period, filter: RequestFilter): string {
  const query = new URLSearchParams(periodQuery(period));
  for (const [name, value] of Object.entries(filterParameters(filter))) {
    query.set(name, value);
  }
  return query.toString();
}

function emptyMessage(filter: RequestFilter): string {
  if (filter.screen !== null) {
    return `No writes from ${filter.screen} in this period.`;
  }
  return filter.failingOnly
    ? 'No route failed in this period.'
    : 'No writes in this period. Calls sent with trackRequest() show up here.';
}

export default async function RequestsPage({ params, searchParams }: RequestsPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const filter: RequestFilter = {
    failingOnly: failingOnlyOf(search),
    screen: screenFilterOf(search),
  };
  const report = await readOrSignIn(() =>
    createRequestsService().requests(
      project.id,
      { from: period.from, to: period.to },
      filter.screen,
    ),
  );
  const basePath = screenHref(project.id, 'requests');
  const hrefFor = (target: RequestFilter) => `${basePath}?${filterQuery(period, target)}`;
  const writes = writesFigure(report.routes);
  const errors = errorRateFigure(report.routes);
  const slowest = slowestRouteFigure(report.routes);
  return (
    <>
      <Topbar
        title="Requests"
        subtitle={`Every write ${project.name} made, and how it ended`}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
        keep={filterParameters(filter)}
      />
      <main className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <div className="grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
          <StatCard id="writes" label="Writes" value={writes.value} note={writes.note} />
          <StatCard id="error-rate" label="Error rate" value={errors.value} note={errors.note} />
          <StatCard
            id="slowest-route"
            label="Slowest route"
            value={slowest.value}
            note={slowest.note}
          />
        </div>
        <RequestFilters
          allHref={hrefFor({ ...filter, failingOnly: false })}
          failingHref={hrefFor({ ...filter, failingOnly: true })}
          failingOnly={filter.failingOnly}
          screen={filter.screen}
          clearScreenHref={hrefFor({ ...filter, screen: null })}
        />
        <RequestsTable
          key={`${String(filter.failingOnly)}|${filter.screen ?? ''}`}
          rows={routeRows(visibleRoutes(report.routes, filter.failingOnly), project.timezone)}
          basePath={basePath}
          query={filterQuery(period, { ...filter, screen: null })}
          timelinePath={screenHref(project.id, 'timeline', periodQuery(period))}
          emptyMessage={emptyMessage(filter)}
        />
        <p className="text-xs leading-[18px] text-muted">
          A write is a POST, PUT, PATCH or DELETE sent with trackRequest(). A failure is a status of
          400 or above, or no response at all. Only the route template is kept, never the URL&apos;s
          values or the body.
        </p>
      </main>
    </>
  );
}
