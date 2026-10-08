import { RequestFilters } from '@/components/requests/request-filters';
import { RequestsTable } from '@/components/requests/requests-table';
import { MainContent } from '@/components/shell/main-content';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { EmptyState } from '@/components/states/empty-state';
import { LinkTabs } from '@/components/ui/link-tabs';
import { StatCard } from '@/components/ui/stat-card';
import { FAILURE_DEFINITION, WRITE_DEFINITION } from '@/domain/glossary';
import {
  type Period,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import {
  FAILED_READS,
  FAILING_ONLY,
  failingOnlyOf,
  type RequestKind,
  type RequestsSearch,
  requestFigures,
  requestKindOf,
  routeRows,
  screenFilterOf,
  visibleRoutes,
} from '@/domain/requests';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { readRequestsReport } from '@/services/requests/requests-report';

export const generateMetadata = screenMetadata('Requests');

export interface RequestsPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & RequestsSearch>;
}

interface RequestFilter {
  readonly kind: RequestKind;
  readonly failingOnly: boolean;
  readonly screen: string | null;
}

const KIND_TABS: readonly { readonly kind: RequestKind; readonly label: string }[] = [
  { kind: 'writes', label: 'Writes' },
  { kind: FAILED_READS, label: 'Failed reads' },
];

const SOURCE_NOTE = "Only the route template is kept, never the URL's values or the body.";
const COUNTED_TOGETHER = 'Visits and the Timeline count failed reads and writes together.';

const NOTES: Readonly<Record<RequestKind, string>> = {
  writes: `${WRITE_DEFINITION} ${FAILURE_DEFINITION} Failed reads have their own tab; ${COUNTED_TOGETHER} ${SOURCE_NOTE}`,
  reads: `A failed read is a GET sent with trackRequest() that answered 400 or above, or never answered. A site may send its reads only when they fail, so reads have no error rate. ${COUNTED_TOGETHER} ${SOURCE_NOTE}`,
};

function filterParameters(filter: RequestFilter): Readonly<Record<string, string>> {
  return {
    ...(filter.kind === FAILED_READS ? { kind: FAILED_READS } : {}),
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

function subtitle(kind: RequestKind, projectName: string): string {
  return kind === FAILED_READS
    ? `The reads ${projectName} made that failed`
    : `Every write ${projectName} made, and how it ended`;
}

function emptyMessage(filter: RequestFilter): string {
  if (filter.kind === FAILED_READS) {
    return filter.screen === null
      ? 'No read failed in this period. GET calls sent with trackRequest() show up here when they fail.'
      : `No failed reads from ${filter.screen} in this period.`;
  }
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
  const kind = requestKindOf(search);
  const filter: RequestFilter = {
    kind,
    failingOnly: kind !== FAILED_READS && failingOnlyOf(search),
    screen: screenFilterOf(search),
  };
  const report = await readOrSignIn(() =>
    readRequestsReport(project.id, { from: period.from, to: period.to }, kind, filter.screen),
  );
  const basePath = screenHref(project.id, 'requests');
  const hrefFor = (target: RequestFilter) => `${basePath}?${filterQuery(period, target)}`;
  return (
    <>
      <Topbar
        title="Requests"
        subtitle={subtitle(kind, project.name)}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
        keep={filterParameters(filter)}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <LinkTabs
          label="Request kind"
          current={kind}
          tabs={KIND_TABS.map((tab) => ({
            key: tab.kind,
            label: tab.label,
            href: hrefFor({ kind: tab.kind, failingOnly: false, screen: filter.screen }),
          }))}
        />
        {report === null ? (
          <EmptyState title="Failed reads need a newer Pyxis API">
            <p>
              This API reports writes only. Update pyxis-api to list the GET calls that failed; the
              writes are on the Writes tab.
            </p>
          </EmptyState>
        ) : (
          <>
            <div className="grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(13.75rem,1fr))] sm:gap-4">
              {requestFigures(kind, report.routes).map((figure) => (
                <StatCard
                  key={figure.id}
                  id={figure.id}
                  label={figure.label}
                  value={figure.value}
                  note={figure.note}
                />
              ))}
            </div>
            <RequestFilters
              kind={kind}
              allHref={hrefFor({ ...filter, failingOnly: false })}
              failingHref={hrefFor({ ...filter, failingOnly: true })}
              failingOnly={filter.failingOnly}
              screen={filter.screen}
              clearScreenHref={hrefFor({ ...filter, screen: null })}
            />
            <RequestsTable
              key={`${kind}|${String(filter.failingOnly)}|${filter.screen ?? ''}`}
              kind={kind}
              rows={routeRows(
                visibleRoutes(report.routes, filter.failingOnly),
                project.timezone,
                kind,
              )}
              basePath={basePath}
              query={filterQuery(period, { ...filter, screen: null })}
              timelinePath={screenHref(project.id, 'timeline', periodQuery(period))}
              emptyMessage={emptyMessage(filter)}
            />
            <p className="text-xs leading-[18px] text-muted">{NOTES[kind]}</p>
          </>
        )}
      </MainContent>
    </>
  );
}
