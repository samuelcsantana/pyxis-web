import { EngagementPanels } from '@/components/features/engagement-panels';
import { FeatureSearch } from '@/components/features/feature-search';
import { FeatureTable } from '@/components/features/feature-table';
import { FeatureTabs } from '@/components/features/feature-tabs';
import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { linkWith, screenHref, screenLabelKey } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
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
import {
  describePeriod,
  type PeriodSearch,
  periodQuery,
  resolvePeriod,
  todayIn,
} from '@/domain/period';
import { getI18n } from '@/i18n/get-messages';
import { exportHref } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { createFeaturesService } from '@/services/features/features-service.factory';
import { loadPropertyBreakdown } from './actions';

export const generateMetadata = screenMetadata('features');

export interface FeaturesPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & FeatureSearchParameters>;
}

export default async function FeaturesPage({ params, searchParams }: FeaturesPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const kind = featureKindOf(search);
  const query = searchQueryOf(search);
  const range = { from: period.from, to: period.to };
  const [report, engagement] = await readOrSignIn(() => {
    const service = createFeaturesService();
    return Promise.all([
      service.features(project.id, range, kind),
      kind === 'screens' ? service.engagement(project.id, range) : Promise.resolve(null),
    ]);
  });
  const basePath = screenHref(project.id, 'features');
  const kindHref = (target: FeatureKind) =>
    `${basePath}?${withKeptParameters(periodQuery(period), { kind: target })}`;
  const kept: Readonly<Record<string, string>> = query === '' ? { kind } : { kind, q: query };
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title={i18n.t(screenLabelKey('features'))}
        subtitle={i18n.t('features.subtitle', { project: project.name })}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        i18n={i18n}
        keep={kept}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
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
            keep={{ ...Object.fromEntries(new URLSearchParams(periodQuery(period))), kind }}
            query={query}
            label={i18n.t(`features.search.${kind}`)}
            clearHref={kindHref(kind)}
            i18n={i18n}
          />
        </div>
        <FeatureTable
          kind={kind}
          rows={featureRows(report.items, kind, query, i18n)}
          query={query}
          visitsHref={(name) =>
            linkWith(
              screenHref(project.id, 'visits', periodQuery(period)),
              kind === 'events' ? { event: name } : { path: name },
            )
          }
          loadProperties={
            kind === 'events'
              ? loadPropertyBreakdown.bind(null, project.id, { from: period.from, to: period.to })
              : undefined
          }
          i18n={i18n}
        />
        {engagement === null ? null : (
          <EngagementPanels
            report={engagement}
            periodLabel={describePeriod(period, i18n)}
            i18n={i18n}
          />
        )}
        <CsvDownloads
          downloads={[
            {
              label: featuresTableLabel(kind, i18n),
              href: exportHref(
                project.id,
                'features',
                withKeptParameters(periodQuery(period), kept),
              ),
            },
          ]}
          i18n={i18n}
        />
        <p className="text-xs leading-[18px] text-muted">{i18n.t('features.footnote')}</p>
      </MainContent>
    </>
  );
}
