import { withKeptParameters } from '@/components/shell/period-selector';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { VisitFiltersForm } from '@/components/visits/visit-filters-form';
import { VisitsTable } from '@/components/visits/visits-table';
import { type PeriodSearch, periodQuery, resolvePeriod, todayIn } from '@/domain/period';
import {
  hasVisitFilters,
  visitFilterParameters,
  visitFiltersOf,
  visitRows,
  type VisitsSearch,
} from '@/domain/visits';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createVisitsService } from '@/services/visits/visits-service.factory';
import { loadOlderVisitRows } from './actions';

export const generateMetadata = screenMetadata('Visits');

export interface VisitsPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<PeriodSearch & VisitsSearch>;
}

function emptyMessage(filtered: boolean): string {
  return filtered
    ? 'No visit matches these filters in this period.'
    : 'No visits in this period. A visit shows up here once your site sends its first event.';
}

export default async function VisitsPage({ params, searchParams }: VisitsPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const now = new Date();
  const period = resolvePeriod(search, project.timezone, now);
  const { filters, problems } = visitFiltersOf(search);
  const report = await readOrSignIn(() =>
    createVisitsService().visits(project.id, { from: period.from, to: period.to }, filters, null),
  );
  const basePath = screenHref(project.id, 'visits');
  const kept = visitFilterParameters(filters);
  const filtered = hasVisitFilters(filters);
  const listQuery = withKeptParameters(periodQuery(period), kept);
  return (
    <>
      <Topbar
        title="Visits"
        subtitle={`Every visit to ${project.name} in the period, newest first`}
        basePath={basePath}
        period={period}
        today={todayIn(project.timezone, now)}
        theme={await chosenTheme()}
        keep={kept}
      />
      <main className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <VisitFiltersForm
          key={`filters?${listQuery}`}
          action={basePath}
          period={period}
          filters={filters}
          problems={problems}
          clearHref={filtered ? `${basePath}?${periodQuery(period)}` : null}
        />
        <VisitsTable
          key={`visits?${listQuery}`}
          rows={visitRows(report.visits, project.timezone)}
          nextCursor={report.nextCursor}
          timelinePath={screenHref(project.id, 'timeline', periodQuery(period))}
          emptyMessage={emptyMessage(filtered)}
          loadOlder={loadOlderVisitRows.bind(
            null,
            project.id,
            Object.fromEntries(new URLSearchParams(listQuery)),
          )}
        />
        <p className="text-xs leading-[18px] text-muted">
          A visit is one browser tab, from its first event to its last; two tabs are never linked.
          Highlights are its first five named events, in order. A failed request is a read or a
          write sent with trackRequest() that answered 400 or above, or never answered; Requests
          lists the writes and the failed reads on separate tabs.
        </p>
      </main>
    </>
  );
}
