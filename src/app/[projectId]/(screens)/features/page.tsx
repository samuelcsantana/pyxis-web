import { EngagementPanels } from '@/components/features/engagement-panels';
import { screenRowFilters } from '@/lib/row-filters';
import { eventLabel } from '@/domain/metrics';
import { FeatureSearch } from '@/components/features/feature-search';
import { FeatureTable } from '@/components/features/feature-table';
import { FeatureTabs } from '@/components/features/feature-tabs';
import { ScreenContent } from '@/components/shell/screen-content';
import { withKeptParameters } from '@/components/shell/kept-parameters';
import { linkWith, screenHref } from '@/components/shell/screens';
import { CsvDownloads } from '@/components/ui/csv-downloads';
import {
  FEATURE_KINDS,
  type FeatureKind,
  featureKindOf,
  featureRows,
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
import { SECTION_STACK } from '@/components/ui/panel-classes';
import { Reveal } from '@/components/ui/reveal';
import { exportHref } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { createFeaturesService } from '@/services/features/features-service.factory';
import { loadPropertyBreakdown, loadPropertySummary } from './actions';

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
  const { filters } = dashboardFiltersOf(search, i18n);
  const scope = { from: period.from, to: period.to, filters };
  const [report, engagement] = await readOrSignIn(() => {
    const service = createFeaturesService();
    return Promise.all([
      service.features(project.id, scope, kind),
      kind === 'screens' ? service.engagement(project.id, scope) : Promise.resolve(null),
    ]);
  });
  const filteredQuery = withDashboardFilters(periodQuery(period), filters);
  const rowFilter = screenRowFilters(project.id, 'features', search, filters, i18n);
  const basePath = screenHref(project.id, 'features');
  const kindHref = (target: FeatureKind) =>
    `${basePath}?${withKeptParameters(filteredQuery, { kind: target })}`;
  const kept: Readonly<Record<string, string>> = query === '' ? { kind } : { kind, q: query };
  return (
    <ScreenContent
      readAt={now.getTime()}
      filtered={hasDashboardFilters(filters)}
      className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <FeatureTabs
          current={kind}
          tabs={FEATURE_KINDS.map((target) => ({
            kind: target,
            label: i18n.t(`features.kinds.${target}`),
            href: kindHref(target),
          }))}
          i18n={i18n}
        />
        <FeatureSearch
          action={basePath}
          keep={{ ...Object.fromEntries(new URLSearchParams(filteredQuery)), kind }}
          query={query}
          label={i18n.t(`features.search.${kind}`)}
          clearHref={kindHref(kind)}
          i18n={i18n}
        />
      </div>
      <Reveal show={kind} className={SECTION_STACK}>
        <FeatureTable
          kind={kind}
          rows={featureRows(report.items, kind, query, i18n)}
          query={query}
          visitsHref={(name) =>
            linkWith(
              screenHref(project.id, 'visits', filteredQuery),
              kind === 'events' ? { event: name } : { path: name },
            )
          }
          filterOf={(name) =>
            kind === 'events'
              ? rowFilter({ event: name }, eventLabel(name))
              : rowFilter({ path: name }, name)
          }
          loadProperties={
            kind === 'events'
              ? loadPropertyBreakdown.bind(
                  null,
                  project.id,
                  { from: period.from, to: period.to },
                  dashboardFilterParameters(filters),
                )
              : undefined
          }
          loadSummary={
            kind === 'events'
              ? loadPropertySummary.bind(
                  null,
                  project.id,
                  { from: period.from, to: period.to },
                  dashboardFilterParameters(filters),
                )
              : undefined
          }
          i18n={i18n}
        />
        {engagement === null ? null : (
          <EngagementPanels
            report={engagement}
            periodLabel={filteredPeriodLabel(describePeriod(period, i18n), filters, i18n)}
            i18n={i18n}
          />
        )}
      </Reveal>
      <CsvDownloads
        downloads={[
          {
            label: featuresTableLabel(kind, i18n),
            href: exportHref(project.id, 'features', withKeptParameters(filteredQuery, kept)),
          },
        ]}
        i18n={i18n}
      />
      <p className="text-xs leading-[18px] text-muted">{i18n.t('features.footnote')}</p>
    </ScreenContent>
  );
}
