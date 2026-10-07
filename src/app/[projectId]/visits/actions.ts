'use server';

import { type PeriodSearch, resolvePeriod } from '@/domain/period';
import {
  isVisitCursor,
  visitFiltersOf,
  visitRows,
  type VisitRowsPage,
  type VisitsSearch,
} from '@/domain/visits';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createVisitsService } from '@/services/visits/visits-service.factory';

export async function loadOlderVisitRows(
  projectId: string,
  search: PeriodSearch & VisitsSearch,
  cursor: string,
): Promise<VisitRowsPage> {
  const { project } = await projectOrNotFound(projectId);
  if (!isVisitCursor(cursor)) {
    throw new Error('Older visits need a valid cursor.');
  }
  const period = resolvePeriod(search, project.timezone, new Date());
  const { filters } = visitFiltersOf(search);
  const report = await readOrSignIn(() =>
    createVisitsService().visits(project.id, { from: period.from, to: period.to }, filters, cursor),
  );
  return { rows: visitRows(report.visits, project.timezone), nextCursor: report.nextCursor };
}
