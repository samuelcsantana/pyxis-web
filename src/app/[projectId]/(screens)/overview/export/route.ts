import { chosenTable } from '@/domain/csv';
import { askedGoalId, GOAL_PARAMETER } from '@/domain/goal-parameters';
import { OVERVIEW_TABLES, overviewCsvTable } from '@/domain/overview-export';
import { csvExport, filteredNameParts, TABLE_PARAMETER } from '@/lib/csv-export';
import { createOverviewService } from '@/services/overview/overview-service.factory';

export const GET = csvExport(async ({ project, period, filters, search }) => {
  const table = chosenTable(OVERVIEW_TABLES, search[TABLE_PARAMETER]);
  if (table === null) {
    return null;
  }
  const report = await createOverviewService().overview(project.id, {
    from: period.from,
    to: period.to,
    filters,
    goal: askedGoalId(search[GOAL_PARAMETER]),
  });
  return {
    nameParts: filteredNameParts(['overview', table, period.from, period.to], filters),
    table: overviewCsvTable(report, table),
  };
});
