import { FailureDaysChart } from '@/components/requests/failure-days-chart';
import { RequestFilters } from '@/components/requests/request-filters';
import { RequestsTable } from '@/components/requests/requests-table';
import { MainContent } from '@/components/shell/main-content';
import { screenHref, screenLabelKey } from '@/components/shell/screens';
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
  requestsTableText,
  routeRows,
  screenFilterOf,
  visibleRoutes,
} from '@/domain/requests';
import { requestsTableLabel } from '@/domain/requests-export';
import { routeDaysText } from '@/domain/route-days';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { SECTION_STACK } from '@/components/ui/panel-classes';
import { Reveal } from '@/components/ui/reveal';
import { exportHref } from '@/lib/csv-export';
import { screenMetadata } from '@/lib/screen-metadata';
import { readRequestsReport } from '@/services/requests/requests-report';
import { loadRouteDays } from './actions';

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

const KINDS: readonly RequestKind[] = ['writes', FAILED_READS];
const SENTENCE_JOINER = ' ';

function kindNote(kind: RequestKind, i18n: I18n): string {
  const sentences =
    kind === FAILED_READS
      ? [i18n.t('requests.page.footnote.failedRead')]
      : [
          i18n.t('glossary.write'),
          i18n.t('glossary.failure'),
          i18n.t('requests.page.footnote.ownTab'),
        ];
  return [...sentences, i18n.t('requests.page.footnote.source')].join(SENTENCE_JOINER);
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

function emptyMessage(filter: RequestFilter, i18n: I18n): string {
  if (filter.kind === FAILED_READS) {
    return filter.screen === null
      ? i18n.t('requests.page.empty.reads')
      : i18n.t('requests.page.empty.readsFromScreen', { screen: filter.screen });
  }
  if (filter.screen !== null) {
    return i18n.t('requests.page.empty.writesFromScreen', { screen: filter.screen });
  }
  return filter.failingOnly
    ? i18n.t('requests.page.empty.failing')
    : i18n.t('requests.page.empty.writes');
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
        title={i18n.t(screenLabelKey('requests'))}
        subtitle={i18n.t(`requests.page.subtitle.${kind}`, { project: project.name })}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        keep={filterParameters(filter)}
        i18n={i18n}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <LinkTabs
          label={i18n.t('requests.page.kinds.label')}
          current={kind}
          tabs={KINDS.map((tabKind) => ({
            key: tabKind,
            label: i18n.t(`requests.page.kinds.${tabKind}`),
            href: hrefFor({ kind: tabKind, failingOnly: false, screen: filter.screen }),
          }))}
        />
        <Reveal show={kind} className={SECTION_STACK}>
          {report === null ? (
            <EmptyState title={i18n.t('requests.page.readsNeedApi.title')}>
              <p>{i18n.t('requests.page.readsNeedApi.body')}</p>
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
                i18n={i18n}
              />
              <Reveal show={`${String(filter.failingOnly)}|${filter.screen ?? ''}`}>
                <RequestsTable
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
                  emptyMessage={emptyMessage(filter, i18n)}
                  loadRouteDays={loadRouteDays.bind(null, project.id, {
                    from: period.from,
                    to: period.to,
                    kind,
                    screen: filter.screen,
                  })}
                  routeDaysText={routeDaysText(kind, i18n)}
                  text={requestsTableText(i18n)}
                />
              </Reveal>
              <CsvDownloads
                downloads={[
                  {
                    label: requestsTableLabel(kind, i18n),
                    href: exportHref(project.id, 'requests', filterQuery(period, filter)),
                  },
                ]}
                i18n={i18n}
              />
              <p className="text-xs leading-[18px] text-muted">{kindNote(kind, i18n)}</p>
            </>
          )}
        </Reveal>
      </MainContent>
    </>
  );
}
