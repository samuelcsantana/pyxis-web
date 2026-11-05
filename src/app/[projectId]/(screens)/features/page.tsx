import { FeaturesReportView } from '@/components/features/features-report-view';
import { screenRowFilters } from '@/lib/row-filters';
import { ScreenContent } from '@/components/shell/screen-content';
import { withKeptParameters } from '@/components/shell/kept-parameters';
import { linkWith, screenHref } from '@/components/shell/screens';
import {
  featureKindOf,
  type FeatureSearch as FeatureSearchParameters,
  searchQueryOf,
} from '@/domain/features';
import { featuresTableLabel } from '@/domain/features-export';
import { describePeriod, type PeriodSearch, periodQuery, resolvePeriod } from '@/domain/period';
import { filteredPeriodLabel } from '@/domain/applied-visit-filters';
import {
  dashboardFilterParameters,
  type DashboardSearch,
  dashboardFiltersOf,
  hasDashboardFilters,
  withDashboardFilters,
} from '@/domain/dashboard-filters';
import { getI18n } from '@/i18n/get-messages';
import { withGoalsWhenFiltered } from '@/lib/project-goals';
import { exportHref } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { createFeaturesService } from '@/services/features/features-service.factory';
import { loadPropertyBreakdown, loadPropertySummary } from './actions';
import { SCREEN_WIDTH } from '@/components/shell/screen-width';

export const generateMetadata = screenMetadata('features');

export interface FeaturesPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & FeatureSearchParameters & DashboardSearch>;
}

export default async function FeaturesPage({ params, searchParams }: FeaturesPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const kind = featureKindOf(search);
  const query = searchQueryOf(search);
  const i18n = await getI18n();
  const {
    reading: { filters },
    goals,
  } = await withGoalsWhenFiltered(project.id, dashboardFiltersOf(search, i18n), i18n);
  const scope = { from: period.from, to: period.to, filters };
  const [report, engagement] = await readOrSignIn(() => {
    const service = createFeaturesService();
    return Promise.all([
      service.features(project.id, scope, kind),
      kind === 'screens' ? service.engagement(project.id, scope) : Promise.resolve(null),
    ]);
  });
  const filteredQuery = withDashboardFilters(periodQuery(period), filters);
  const basePath = screenHref(project.id, 'features');
  const kept: Readonly<Record<string, string>> = query === '' ? { kind } : { kind, q: query };
  const range = { from: period.from, to: period.to };
  return (
    <ScreenContent
      readAt={now.getTime()}
      filtered={hasDashboardFilters(filters)}
      className={`flex ${SCREEN_WIDTH} flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12`}
    >
      <FeaturesReportView
        kind={kind}
        query={query}
        report={report}
        engagement={engagement}
        basePath={basePath}
        filteredQuery={filteredQuery}
        periodLabel={filteredPeriodLabel(describePeriod(period, i18n), filters, goals, i18n)}
        visitsHref={(name) =>
          linkWith(
            screenHref(project.id, 'visits', filteredQuery),
            kind === 'events' ? { event: name } : { path: name },
          )
        }
        rowFilter={screenRowFilters(project.id, 'features', search, filters, i18n)}
        loadProperties={
          kind === 'events'
            ? loadPropertyBreakdown.bind(
                null,
                project.id,
                range,
                dashboardFilterParameters(filters),
              )
            : undefined
        }
        loadSummary={
          kind === 'events'
            ? loadPropertySummary.bind(null, project.id, range, dashboardFilterParameters(filters))
            : undefined
        }
        downloads={[
          {
            label: featuresTableLabel(kind, i18n),
            href: exportHref(project.id, 'features', withKeptParameters(filteredQuery, kept)),
          },
        ]}
        i18n={i18n}
      />
    </ScreenContent>
  );
}
