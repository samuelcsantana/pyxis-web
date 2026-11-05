import { withKeptParameters } from '@/components/shell/kept-parameters';
import { type CsvDownload, CsvDownloads } from '@/components/ui/csv-downloads';
import { SECTION_STACK } from '@/components/ui/panel-classes';
import { Reveal } from '@/components/ui/reveal';
import type { EngagementReport } from '@/domain/engagement';
import {
  FEATURE_KINDS,
  type FeatureKind,
  featureRows,
  type FeaturesReport,
} from '@/domain/features';
import { eventLabel } from '@/domain/metrics';
import type { I18n } from '@/i18n/i18n';
import type { RowFilterOf } from '@/lib/row-filters';
import { EngagementPanels } from './engagement-panels';
import type { LoadEventSummary, LoadProperties } from './expandable-feature-row';
import { FeatureSearch } from './feature-search';
import { FeatureTable } from './feature-table';
import { FeatureTabs } from './feature-tabs';

export interface FeaturesReportViewProps {
  readonly kind: FeatureKind;
  readonly query: string;
  readonly report: FeaturesReport;
  readonly engagement: EngagementReport | null;
  readonly basePath: string;
  readonly filteredQuery: string;
  readonly periodLabel: string;
  readonly visitsHref: (name: string) => string | null;
  readonly rowFilter: RowFilterOf;
  readonly loadProperties?: LoadProperties;
  readonly loadSummary?: LoadEventSummary;
  readonly downloads: readonly CsvDownload[];
  readonly i18n: I18n;
}

export function FeaturesReportView({
  kind,
  query,
  report,
  engagement,
  basePath,
  filteredQuery,
  periodLabel,
  visitsHref,
  rowFilter,
  loadProperties,
  loadSummary,
  downloads,
  i18n,
}: FeaturesReportViewProps) {
  const kindHref = (target: FeatureKind) =>
    `${basePath}?${withKeptParameters(filteredQuery, { kind: target })}`;
  return (
    <>
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
          visitsHref={visitsHref}
          filterOf={(name) =>
            kind === 'events'
              ? rowFilter({ event: name }, eventLabel(name))
              : rowFilter({ path: name }, name)
          }
          loadProperties={loadProperties}
          loadSummary={loadSummary}
          i18n={i18n}
        />
        {engagement === null ? null : (
          <EngagementPanels report={engagement} periodLabel={periodLabel} i18n={i18n} />
        )}
      </Reveal>
      {downloads.length === 0 ? null : <CsvDownloads downloads={downloads} i18n={i18n} />}
      <p className="text-xs leading-[18px] text-muted">{i18n.t('features.footnote')}</p>
    </>
  );
}
