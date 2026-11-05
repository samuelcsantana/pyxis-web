import { AcquisitionReportView } from '@/components/acquisition/acquisition-report-view';
import { screenRowFilters } from '@/lib/row-filters';
import { ScreenContent } from '@/components/shell/screen-content';
import { withKeptParameters } from '@/components/shell/kept-parameters';
import { linkWith, screenHref } from '@/components/shell/screens';
import { EmptyPeriod } from '@/components/states/empty-period';
import { FilteredPeriodEmpty } from '@/components/states/filtered-period-empty';
import { type CsvDownload } from '@/components/ui/csv-downloads';
import { emptyPeriodView, WIDER_PERIOD_QUERY } from '@/domain/empty-period';
import { visitsTotal } from '@/domain/acquisition';
import { ACQUISITION_TABLES, acquisitionTableLabel } from '@/domain/acquisition-export';
import { describePeriod, type PeriodSearch, periodQuery, resolvePeriod } from '@/domain/period';
import { filteredPeriodLabel } from '@/domain/applied-visit-filters';
import {
  type DashboardSearch,
  dashboardFiltersOf,
  hasDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import { projectCurrency } from '@/domain/currency';
import { getI18n } from '@/i18n/get-messages';
import { withGoalsWhenFiltered } from '@/lib/project-goals';
import type { I18n } from '@/i18n/i18n';
import { apiBaseUrl } from '@/lib/api-config';
import { exportHref, TABLE_PARAMETER } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { createAcquisitionService } from '@/services/acquisition/acquisition-service.factory';
import { SCREEN_WIDTH } from '@/components/shell/screen-width';

export const generateMetadata = screenMetadata('acquisition');

export interface AcquisitionPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & DashboardSearch>;
}

function acquisitionDownloads(
  projectId: string,
  query: string,
  i18n: I18n,
): readonly CsvDownload[] {
  return ACQUISITION_TABLES.map((table) => ({
    label: acquisitionTableLabel(table, i18n),
    href: exportHref(
      projectId,
      'acquisition',
      withKeptParameters(query, { [TABLE_PARAMETER]: table }),
    ),
  }));
}

export default async function AcquisitionPage({ params, searchParams }: AcquisitionPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const i18n = await getI18n();
  const {
    reading: { filters },
    goals,
  } = await withGoalsWhenFiltered(project.id, dashboardFiltersOf(search, i18n), i18n);
  const report = await readOrSignIn(() =>
    createAcquisitionService().acquisition(project.id, {
      from: period.from,
      to: period.to,
      filters,
    }),
  );
  const filtered = hasDashboardFilters(filters);
  const query = withDashboardFilters(periodQuery(period), filters);
  const visitsPath = screenHref(project.id, 'visits', query);
  return (
    <ScreenContent
      readAt={now.getTime()}
      filtered={filtered}
      className={`flex ${SCREEN_WIDTH} flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12`}
    >
      {visitsTotal(report.days) > 0 ? (
        <AcquisitionReportView
          report={report}
          currency={projectCurrency(project)}
          periodLabel={filteredPeriodLabel(describePeriod(period, i18n), filters, goals, i18n)}
          downloads={acquisitionDownloads(project.id, query, i18n)}
          channelVisitsHref={(channel) => linkWith(visitsPath, { channel })}
          sourceVisitsHref={(source) => linkWith(visitsPath, { source })}
          campaignVisitsHref={({ campaign, source }) => linkWith(visitsPath, { campaign, source })}
          rowFilter={screenRowFilters(project.id, 'acquisition', search, filters, i18n)}
          i18n={i18n}
        />
      ) : filtered ? (
        <FilteredPeriodEmpty
          periodLabel={describePeriod(period, i18n)}
          removeFiltersHref={screenHref(project.id, 'acquisition', periodQuery(period))}
          i18n={i18n}
        />
      ) : (
        <EmptyPeriod
          view={emptyPeriodView(project, period, i18n)}
          widerPeriodHref={screenHref(project.id, 'acquisition', WIDER_PERIOD_QUERY)}
          endpoint={apiBaseUrl()}
          i18n={i18n}
        />
      )}
    </ScreenContent>
  );
}
