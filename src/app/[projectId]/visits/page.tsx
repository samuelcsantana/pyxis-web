import { MainContent } from '@/components/shell/main-content';
import { withKeptParameters } from '@/components/shell/period-selector';
import { screenHref, screenLabelKey } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { CsvDownloads } from '@/components/ui/csv-downloads';
import { AppliedVisitFilters } from '@/components/visits/applied-visit-filters';
import { VisitFiltersForm } from '@/components/visits/visit-filters-form';
import { appliedVisitFilters } from '@/domain/applied-visit-filters';
import { VisitsTable } from '@/components/visits/visits-table';
import { type PeriodSearch, periodQuery, resolvePeriod, todayIn } from '@/domain/period';
import {
  hasVisitFilters,
  visitFilterParameters,
  visitFiltersOf,
  visitRows,
  type VisitsSearch,
  visitsTableText,
  visitsTotalLabel,
} from '@/domain/visits';
import { visitsTableLabel } from '@/domain/visits-export';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { exportHref } from '@/lib/csv-export';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { createVisitsService } from '@/services/visits/visits-service.factory';
import { loadOlderVisitRows } from './actions';

export const generateMetadata = screenMetadata('visits');

export interface VisitsPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & VisitsSearch>;
}

const SENTENCE_JOINER = ' ';

function footnote(i18n: I18n): string {
  return [i18n.t('glossary.visit'), i18n.t('visits.page.footnote')].join(SENTENCE_JOINER);
}

export default async function VisitsPage({ params, searchParams }: VisitsPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const i18n = await getI18n();
  const { filters, problems } = visitFiltersOf(search, i18n);
  const report = await readOrSignIn(() =>
    createVisitsService().visits(project.id, { from: period.from, to: period.to }, filters, null),
  );
  const basePath = screenHref(project.id, 'visits');
  const kept = visitFilterParameters(filters);
  const filtered = hasVisitFilters(filters);
  const listQuery = withKeptParameters(periodQuery(period), kept);
  const totalLabel = visitsTotalLabel(report.total, filtered, i18n);
  return (
    <>
      <Topbar
        title={i18n.t(screenLabelKey('visits'))}
        subtitle={i18n.t('visits.page.subtitle', { project: project.name })}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        keep={kept}
        i18n={i18n}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <VisitFiltersForm
          key={`filters?${listQuery}`}
          action={basePath}
          period={period}
          filters={filters}
          problems={problems}
          clearHref={filtered ? `${basePath}?${periodQuery(period)}` : null}
          i18n={i18n}
        />
        <AppliedVisitFilters
          applied={appliedVisitFilters(filters, i18n)}
          removeHref={(without) =>
            `${basePath}?${withKeptParameters(periodQuery(period), visitFilterParameters(without))}`
          }
          clearHref={`${basePath}?${periodQuery(period)}`}
          i18n={i18n}
        />
        {totalLabel === null ? null : (
          <p className="-mb-1 text-sm font-medium text-muted sm:-mb-2">{totalLabel}</p>
        )}
        <VisitsTable
          key={`visits?${listQuery}`}
          rows={visitRows(report.visits, project.timezone, i18n)}
          nextCursor={report.nextCursor}
          timelinePath={screenHref(project.id, 'timeline', periodQuery(period))}
          emptyMessage={
            filtered ? i18n.t('visits.page.empty.filtered') : i18n.t('visits.page.empty.all')
          }
          loadOlder={loadOlderVisitRows.bind(
            null,
            project.id,
            Object.fromEntries(new URLSearchParams(listQuery)),
          )}
          text={visitsTableText(i18n)}
        />
        <CsvDownloads
          downloads={[
            { label: visitsTableLabel(i18n), href: exportHref(project.id, 'visits', listQuery) },
          ]}
          i18n={i18n}
        />
        <p className="text-xs leading-[18px] text-muted">{footnote(i18n)}</p>
      </MainContent>
    </>
  );
}
