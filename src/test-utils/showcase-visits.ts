import type { VisitFilters, VisitsReport } from '@/domain/visits';
import { visitsResponseSchema } from '@/domain/visits.schema';
import type { DateRange } from '@/services/date-range';
import { demoProjectOf } from '@/services/demo/demo-projects';
import { demoShowcaseVisits, visitDate } from '@/services/demo/demo-scope';
import { demoVisitsPage } from '@/services/visits/demo-visit-list';

export function showcaseVisitsReport(
  projectId: string,
  range: DateRange,
  filters: VisitFilters,
  cursor: string | null,
  now: Date,
): VisitsReport {
  const visits = demoShowcaseVisits(demoProjectOf(projectId), now).filter(
    (visit) => range.from <= visitDate(visit) && visitDate(visit) <= range.to,
  );
  return visitsResponseSchema.parse(demoVisitsPage(visits, filters, cursor));
}
