import { MainContent } from '@/components/shell/main-content';
import { linkWith, screenHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { LookUpPrompt, NoVisitsFound } from '@/components/timeline/timeline-empty-states';
import { TimelineFilters } from '@/components/timeline/timeline-filters';
import { TimelineSearch } from '@/components/timeline/timeline-search';
import { TimelineSummary } from '@/components/timeline/timeline-summary';
import { OlderVisits } from '@/components/timeline/older-visits';
import { VisitCard } from '@/components/timeline/visit-card';
import {
  type Lookup,
  type RejectedLookup,
  lookupOf,
  lookupTitle,
  rejectedLookupOf,
  TIMELINE_FILTERS,
  type TimelineFilter,
  timelineFilterOf,
  type TimelineReport,
  type TimelineSearch as TimelineSearchParameters,
  timelineTotals,
  visitViews,
} from '@/domain/timeline';
import { type PeriodSearch, periodSearchParameters } from '@/domain/period';
import { isDemoMode } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { demoPersonOf } from '@/services/demo/demo-projects';
import { createTimelineService } from '@/services/timeline/timeline-service.factory';
import { loadOlderVisits } from './actions';

export const generateMetadata = screenMetadata('Timeline');

export interface TimelinePageProps {
  readonly params: Promise<{ readonly projectId: string }>;
  readonly searchParams: Promise<TimelineSearchParameters & PeriodSearch>;
}

function searchKey(lookup: Lookup | null, rejected: RejectedLookup | null): string {
  const shown = lookup === null ? rejected : { kind: lookup.kind, value: lookup.id };
  return shown === null ? 'none' : `${shown.kind}:${shown.value}`;
}

function lookupParameters(lookup: Lookup, filter: TimelineFilter): Record<string, string> {
  return filter === 'all'
    ? { [lookup.kind]: lookup.id }
    : { [lookup.kind]: lookup.id, show: filter };
}

interface TimelineViewProps {
  readonly projectId: string;
  readonly lookup: Lookup;
  readonly report: TimelineReport;
  readonly filter: TimelineFilter;
  readonly basePath: string;
  readonly timeZone: string;
  readonly keptPeriod: Readonly<Record<string, string>>;
}

function TimelineView({
  projectId,
  lookup,
  report,
  filter,
  basePath,
  timeZone,
  keptPeriod,
}: TimelineViewProps) {
  if (report.visits.length === 0) {
    return <NoVisitsFound lookupTitle={lookupTitle(lookup)} />;
  }
  return (
    <>
      <TimelineSummary title={lookupTitle(lookup)} totals={timelineTotals(report.visits)} />
      <TimelineFilters
        current={filter}
        links={TIMELINE_FILTERS.map((target) => ({
          filter: target,
          href: linkWith(basePath, { ...keptPeriod, ...lookupParameters(lookup, target) }),
        }))}
      />
      {visitViews(report.visits, timeZone, filter).map((visit) => (
        <VisitCard key={visit.key} visit={visit} />
      ))}
      {report.nextBefore === null ? null : (
        <OlderVisits
          initialBefore={report.nextBefore}
          loadOlder={loadOlderVisits.bind(null, projectId, lookupParameters(lookup, filter))}
        />
      )}
    </>
  );
}

export default async function TimelinePage({ params, searchParams }: TimelinePageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const lookup = lookupOf(search);
  const rejected = rejectedLookupOf(search);
  const filter = timelineFilterOf(search);
  const basePath = screenHref(project.id, 'timeline');
  const demoPerson = isDemoMode() ? demoPersonOf(project.id) : null;
  const keptPeriod = periodSearchParameters(search);
  const demoPersonLink =
    demoPerson === null
      ? null
      : { userId: demoPerson, href: linkWith(basePath, { ...keptPeriod, user: demoPerson }) };
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
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <TimelineSearch
          key={searchKey(lookup, rejected)}
          action={basePath}
          lookup={lookup}
          rejected={rejected}
          hint={demoPerson === null ? null : `Try ${demoPerson}`}
          keep={keptPeriod}
        />
        {lookup === null || report === null ? (
          <LookUpPrompt demoPerson={demoPersonLink} />
        ) : (
          <TimelineView
            projectId={project.id}
            lookup={lookup}
            report={report}
            filter={filter}
            basePath={basePath}
            timeZone={project.timezone}
            keptPeriod={keptPeriod}
          />
        )}
      </MainContent>
    </>
  );
}
