import type { Metadata } from 'next';
import Link from 'next/link';
import { screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { EmptyState } from '@/components/states/empty-state';
import { TimelineFilters } from '@/components/timeline/timeline-filters';
import { TimelineSearch } from '@/components/timeline/timeline-search';
import { TimelineSummary } from '@/components/timeline/timeline-summary';
import { OlderVisits } from '@/components/timeline/older-visits';
import { VisitCard } from '@/components/timeline/visit-card';
import {
  type Lookup,
  lookupOf,
  lookupTitle,
  TIMELINE_FILTERS,
  type TimelineFilter,
  timelineFilterOf,
  type TimelineReport,
  type TimelineSearch as TimelineSearchParameters,
  timelineTotals,
  visitViews,
} from '@/domain/timeline';
import { isDemoMode } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { chosenTheme } from '@/lib/theme-cookie';
import { demoPersonOf } from '@/services/demo/demo-projects';
import { createTimelineService } from '@/services/timeline/timeline-service.factory';
import { FOCUS_RING } from '@/components/ui/control-classes';
import { loadOlderVisits } from './actions';

export const metadata: Metadata = { title: 'Timeline · Pyxis' };

export interface TimelinePageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<TimelineSearchParameters>;
}

function lookupQuery(lookup: Lookup, filter: TimelineFilter): string {
  const query = new URLSearchParams({ [lookup.kind]: lookup.id });
  if (filter !== 'all') {
    query.set('show', filter);
  }
  return query.toString();
}

interface TimelineViewProps {
  readonly projectId: string;
  readonly lookup: Lookup;
  readonly report: TimelineReport;
  readonly filter: TimelineFilter;
  readonly basePath: string;
  readonly timeZone: string;
}

function TimelineView({
  projectId,
  lookup,
  report,
  filter,
  basePath,
  timeZone,
}: TimelineViewProps) {
  if (report.visits.length === 0) {
    return (
      <EmptyState title={`No visits found for ${lookupTitle(lookup)}`}>
        <p>
          The id may be mistyped, the visits may be older than the retention period, or the
          person&apos;s data may have been erased.
        </p>
      </EmptyState>
    );
  }
  return (
    <>
      <TimelineSummary title={lookupTitle(lookup)} totals={timelineTotals(report.visits)} />
      <TimelineFilters
        current={filter}
        links={TIMELINE_FILTERS.map((target) => ({
          filter: target,
          href: `${basePath}?${lookupQuery(lookup, target)}`,
        }))}
      />
      {visitViews(report.visits, timeZone, filter).map((visit) => (
        <VisitCard key={visit.key} visit={visit} />
      ))}
      {report.nextBefore === null ? null : (
        <OlderVisits
          initialBefore={report.nextBefore}
          loadOlder={loadOlderVisits.bind(
            null,
            projectId,
            Object.fromEntries(new URLSearchParams(lookupQuery(lookup, filter))),
          )}
        />
      )}
    </>
  );
}

export default async function TimelinePage({ params, searchParams }: TimelinePageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const lookup = lookupOf(search);
  const filter = timelineFilterOf(search);
  const basePath = screenHref(project.id, 'timeline');
  const demoPerson = isDemoMode() ? demoPersonOf(project.id) : null;
  const report =
    lookup === null
      ? null
      : await readOrSignIn(() => createTimelineService().timeline(project.id, lookup, null));
  return (
    <>
      <Topbar
        title="Timeline"
        subtitle={`Everything one person or one visit did in ${project.name}, in order`}
        theme={await chosenTheme()}
      />
      <main className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <TimelineSearch
          key={lookup === null ? 'none' : `${lookup.kind}:${lookup.id}`}
          action={basePath}
          lookup={lookup}
          hint={demoPerson === null ? null : `Try ${demoPerson}`}
        />
        {lookup === null || report === null ? (
          <EmptyState title="Look up a person or a visit">
            <p>
              Type a user id, the one your site passes to identify(), to see every visit of that
              person, or a visit id to see one visit. Events, page views and requests show in the
              order they happened, in the project&apos;s time zone.
            </p>
            {demoPerson === null ? null : (
              <p>
                <Link
                  href={`${basePath}?${new URLSearchParams({ user: demoPerson }).toString()}`}
                  className={`text-sky-ink underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
                >
                  Open the timeline of the demo person {demoPerson}
                </Link>
              </p>
            )}
          </EmptyState>
        ) : (
          <TimelineView
            projectId={project.id}
            lookup={lookup}
            report={report}
            filter={filter}
            basePath={basePath}
            timeZone={project.timezone}
          />
        )}
      </main>
    </>
  );
}
