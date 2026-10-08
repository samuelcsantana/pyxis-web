import { FailureDaysChart } from '@/components/requests/failure-days-chart';
import { RequestFilters } from '@/components/requests/request-filters';
import { RequestsTable } from '@/components/requests/requests-table';
import { MainContent } from '@/components/shell/main-content';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { EmptyState } from '@/components/states/empty-state';
import { CsvDownloads } from '@/components/ui/csv-downloads';
import { LinkTabs } from '@/components/ui/link-tabs';
import { StatCard } from '@/components/ui/stat-card';
import {
  describePeriod,
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
import { requestsTableLabel } from '@/domain/requests-export';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { exportHref } from '@/lib/csv-export';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { readRequestsReport } from '@/services/requests/requests-report';

export const generateMetadata = screenMetadata('requests');

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

function kindNote(kind: RequestKind, i18n: I18n): string {
  return kind === 'writes'
    ? `${i18n.t('glossary.write')} ${i18n.t('glossary.failure')} Failed reads have their own tab; ${COUNTED_TOGETHER} ${SOURCE_NOTE}`
    : `A failed read is a GET sent with trackRequest() that answered 400 or above, or never answered. A site may send its reads only when they fail, so reads have no error rate. ${COUNTED_TOGETHER} ${SOURCE_NOTE}`;
}

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
  const i18n = await getI18n();
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
        i18n={i18n}
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
              {requestFigures(kind, report.routes, i18n).map((figure) => (
                <StatCard
                  key={figure.id}
                  id={figure.id}
                  label={figure.label}
                  value={figure.value}
                  note={figure.note}
                />
              ))}
            </div>
            {report.days.length === 0 ? null : (
              <FailureDaysChart
                days={report.days}
                description={i18n.t(`requests.failureDays.description.${kind}`, {
                  period: describePeriod(period, i18n),
                })}
                periodLabel={describePeriod(period, i18n)}
                i18n={i18n}
              />
            )}
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
                i18n,
              )}
              basePath={basePath}
              query={filterQuery(period, { ...filter, screen: null })}
              timelinePath={screenHref(project.id, 'timeline', periodQuery(period))}
              visitsPath={screenHref(project.id, 'visits', periodQuery(period))}
              emptyMessage={emptyMessage(filter)}
            />
            <CsvDownloads
              downloads={[
                {
                  label: requestsTableLabel(kind, i18n),
                  href: exportHref(project.id, 'requests', filterQuery(period, filter)),
                },
              ]}
            />
            <p className="text-xs leading-[18px] text-muted">{kindNote(kind, i18n)}</p>
          </>
        )}
      </MainContent>
    </>
  );
}
