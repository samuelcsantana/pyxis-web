'use server';

import { type PeriodSearch, resolvePeriod } from '@/domain/period';
import {
  isVisitCursor,
  visitFiltersOf,
  visitRows,
  type VisitRowsPage,
  type VisitsSearch,
} from '@/domain/visits';
import { getI18n } from '@/i18n/get-messages';
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
  const i18n = await getI18n();
  const { filters } = visitFiltersOf(search, i18n);
  const report = await readOrSignIn(() =>
    createVisitsService().visits(project.id, { from: period.from, to: period.to }, filters, cursor),
  );
  return {
    rows: visitRows(report.visits, project.timezone, i18n),
    nextCursor: report.nextCursor,
  };
}
