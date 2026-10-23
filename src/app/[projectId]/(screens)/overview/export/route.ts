import { chosenTable } from '@/domain/csv';
import { OVERVIEW_TABLES, overviewCsvTable } from '@/domain/overview-export';
import { csvExport, TABLE_PARAMETER } from '@/lib/csv-export';
import { createOverviewService } from '@/services/overview/overview-service.factory';

export const GET = csvExport(async ({ project, period, search }) => {
  const table = chosenTable(OVERVIEW_TABLES, search[TABLE_PARAMETER]);
  if (table === null) {
    return null;
  }
  const report = await createOverviewService().overview(project.id, {
    from: period.from,
    to: period.to,
  });
  return {
    nameParts: ['overview', table, period.from, period.to],
    table: overviewCsvTable(report, table),
  };
});
