import { DevicesReportView, devicesLinksOf } from '@/components/devices/devices-report-view';
import { screenRowFilters } from '@/lib/row-filters';
import { ScreenContent } from '@/components/shell/screen-content';
import { linkWith, screenHref } from '@/components/shell/screens';
import { EmptyPeriod } from '@/components/states/empty-period';
import { FilteredPeriodEmpty } from '@/components/states/filtered-period-empty';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { hasVisits } from '@/domain/devices';
import { describePeriod, type PeriodSearch, periodQuery, resolvePeriod } from '@/domain/period';
import {
  type DashboardSearch,
  dashboardFiltersOf,
  hasDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import { getI18n } from '@/i18n/get-messages';
import { withKnownReachedGoal } from '@/domain/goals';
import { projectGoals } from '@/lib/project-goals';
import { apiBaseUrl } from '@/lib/api-config';
import { exportHref } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { createDevicesService } from '@/services/devices/devices-service.factory';
import { createProjectsService } from '@/services/projects/projects-service.factory';
import { SCREEN_WIDTH } from '@/components/shell/screen-width';

export const generateMetadata = screenMetadata('devices');

export interface DevicesPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & DashboardSearch>;
}

export default async function DevicesPage({ params, searchParams }: DevicesPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const i18n = await getI18n();
  const goals = await projectGoals(project.id);
  const { filters } = withKnownReachedGoal(dashboardFiltersOf(search, i18n), goals, i18n);
  const [report, settings] = await Promise.all([
    readOrSignIn(() =>
      createDevicesService().devices(project.id, { from: period.from, to: period.to, filters }),
    ),
    readOrSignIn(() => createProjectsService().settings(project.id)),
  ]);
  const filtered = hasDashboardFilters(filters);
  const query = withDashboardFilters(periodQuery(period), filters);
  const visitsHref = screenHref(project.id, 'visits', query);
  const links = devicesLinksOf(
    (filter) => linkWith(visitsHref, filter),
    screenRowFilters(project.id, 'devices', search, filters, i18n),
    i18n,
  );
  return (
    <ScreenContent
      readAt={now.getTime()}
      filtered={filtered}
      className={`flex ${SCREEN_WIDTH} flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12`}
    >
      {hasVisits(report) ? (
        <DevicesReportView
          report={report}
          projectId={project.id}
          countedGoal={goals[0] ?? null}
          cityEnabled={settings.cityEnabled}
          exportPath={exportHref(project.id, 'devices', query)}
          links={links}
          i18n={i18n}
        />
      ) : filtered ? (
        <FilteredPeriodEmpty
          periodLabel={describePeriod(period, i18n)}
          removeFiltersHref={screenHref(project.id, 'devices', periodQuery(period))}
          i18n={i18n}
        />
      ) : (
        <EmptyPeriod
          view={emptyPeriodView(project, period, i18n)}
          widerPeriodHref={screenHref(project.id, 'devices', WIDER_PERIOD_QUERY)}
          endpoint={apiBaseUrl()}
          i18n={i18n}
        />
      )}
    </ScreenContent>
  );
}
