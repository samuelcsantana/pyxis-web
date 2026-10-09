import { MainContent } from '@/components/shell/main-content';
import { linkWith, screenHref, screenLabelKey } from '@/components/shell/screens';
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
  olderVisitsText,
  rejectedLookupOf,
  TIMELINE_FILTERS,
  type TimelineFilter,
  timelineFilterOf,
  type TimelineReport,
  type TimelineSearch as TimelineSearchParameters,
  timelineSearchText,
  timelineTotals,
  visitViews,
} from '@/domain/timeline';
import { type PeriodSearch, periodSearchParameters } from '@/domain/period';
import { getI18n } from '@/i18n/get-messages';
import type { I18n } from '@/i18n/i18n';
import { isDemoMode } from '@/lib/api-config';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { screenMetadata } from '@/lib/screen-metadata';
import { demoPersonOf } from '@/services/demo/demo-projects';
import { createTimelineService } from '@/services/timeline/timeline-service.factory';
import { loadOlderVisits } from './actions';

export const generateMetadata = screenMetadata('timeline');

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
  readonly i18n: I18n;
}

function TimelineView({
  projectId,
  lookup,
  report,
  filter,
  basePath,
  timeZone,
  keptPeriod,
  i18n,
}: TimelineViewProps) {
  if (report.visits.length === 0) {
    return <NoVisitsFound lookupTitle={lookupTitle(lookup, i18n)} i18n={i18n} />;
  }
  return (
    <>
      <TimelineSummary
        title={lookupTitle(lookup, i18n)}
        totals={timelineTotals(report.visits, i18n)}
      />
      <TimelineFilters
        current={filter}
        i18n={i18n}
        links={TIMELINE_FILTERS.map((target) => ({
          filter: target,
          href: linkWith(basePath, { ...keptPeriod, ...lookupParameters(lookup, target) }),
        }))}
      />
      {visitViews(report.visits, timeZone, filter, i18n).map((visit) => (
        <VisitCard
          key={visit.key}
          visit={visit}
          emptyText={i18n.t('timeline.card.nothingOfThisKind')}
          person={
            lookup.kind === 'visit' && visit.personId !== null
              ? {
                  label: i18n.t('timeline.card.allVisitsOf', { user: visit.personId }),
                  href: linkWith(basePath, { ...keptPeriod, user: visit.personId }),
                }
              : null
          }
        />
      ))}
      {report.nextBefore === null ? null : (
        <OlderVisits
          initialBefore={report.nextBefore}
          loadOlder={loadOlderVisits.bind(null, projectId, lookupParameters(lookup, filter))}
          text={olderVisitsText(i18n)}
        />
      )}
    </>
  );
}

export default async function TimelinePage({ params, searchParams }: TimelinePageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const search = await searchParams;
  const i18n = await getI18n();
  const lookup = lookupOf(search);
  const rejected = rejectedLookupOf(search, i18n);
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
        title={i18n.t(screenLabelKey('timeline'))}
        subtitle={i18n.t('timeline.page.subtitle', { project: project.name })}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <TimelineSearch
          key={searchKey(lookup, rejected)}
          action={basePath}
          lookup={lookup}
          rejected={rejected}
          hint={
            demoPerson === null ? null : i18n.t('timeline.page.tryPerson', { user: demoPerson })
          }
          keep={keptPeriod}
          text={timelineSearchText(i18n)}
        />
        {lookup === null || report === null ? (
          <LookUpPrompt demoPerson={demoPersonLink} i18n={i18n} />
        ) : (
          <TimelineView
            projectId={project.id}
            lookup={lookup}
            report={report}
            filter={filter}
            basePath={basePath}
            timeZone={project.timezone}
            keptPeriod={keptPeriod}
            i18n={i18n}
          />
        )}
      </MainContent>
    </>
  );
}
