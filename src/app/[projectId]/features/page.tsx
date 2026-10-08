import { FeatureSearch } from '@/components/features/feature-search';
import { FeatureTable } from '@/components/features/feature-table';
import { FeatureTabs } from '@/components/features/feature-tabs';
import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { screenHref } from '@/components/shell/screens';
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
import { FEATURES_TABLE_LABELS } from '@/domain/features-export';
import { type PeriodSearch, periodQuery, resolvePeriod, todayIn } from '@/domain/period';
import { exportHref } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createFeaturesService } from '@/services/features/features-service.factory';
import { loadPropertyBreakdown } from './actions';

export const generateMetadata = screenMetadata('Features');

export interface FeaturesPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & FeatureSearchParameters>;
}

const KIND_LABELS: Readonly<Record<FeatureKind, string>> = { events: 'Events', screens: 'Screens' };
const SEARCH_LABELS: Readonly<Record<FeatureKind, string>> = {
  events: 'Search events',
  screens: 'Search screens',
};

export default async function FeaturesPage({ params, searchParams }: FeaturesPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const kind = featureKindOf(search);
  const query = searchQueryOf(search);
  const report = await readOrSignIn(() =>
    createFeaturesService().features(project.id, { from: period.from, to: period.to }, kind),
  );
  const basePath = screenHref(project.id, 'features');
  const kindHref = (target: FeatureKind) =>
    `${basePath}?${withKeptParameters(periodQuery(period), { kind: target })}`;
  const kept: Readonly<Record<string, string>> = query === '' ? { kind } : { kind, q: query };
  return (
    <>
      <Topbar
        title="Features"
        subtitle={`What people use the most in ${project.name}`}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
        keep={kept}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <FeatureTabs
            current={kind}
            tabs={FEATURE_KINDS.map((target) => ({
              kind: target,
              label: KIND_LABELS[target],
              href: kindHref(target),
            }))}
          />
          <FeatureSearch
            action={basePath}
            keep={{ ...Object.fromEntries(new URLSearchParams(periodQuery(period))), kind }}
            query={query}
            label={SEARCH_LABELS[kind]}
            clearHref={kindHref(kind)}
          />
        </div>
        <FeatureTable
          kind={kind}
          rows={featureRows(report.items, kind, query)}
          query={query}
          loadProperties={
            kind === 'events'
              ? loadPropertyBreakdown.bind(null, project.id, { from: period.from, to: period.to })
              : undefined
          }
        />
        <CsvDownloads
          downloads={[
            {
              label: FEATURES_TABLE_LABELS[kind],
              href: exportHref(
                project.id,
                'features',
                withKeptParameters(periodQuery(period), kept),
              ),
            },
          ]}
        />
        <p className="text-xs leading-[18px] text-muted">
          Events are sent by the site with the Pyxis SDK; open one to see how its property values
          break down. Screens are page views grouped by path template, so /orders/8213 and
          /orders/8214 count as /orders/:id.
        </p>
      </MainContent>
    </>
  );
}
