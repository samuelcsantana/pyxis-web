import { ACQUISITION_TABLES, acquisitionCsvTable } from '@/domain/acquisition-export';
import { chosenTable } from '@/domain/csv';
import { csvExport, TABLE_PARAMETER } from '@/lib/csv-export';
import { createAcquisitionService } from '@/services/acquisition/acquisition-service.factory';

export const GET = csvExport(async ({ project, period, search }) => {
  const table = chosenTable(ACQUISITION_TABLES, search[TABLE_PARAMETER]);
  if (table === null) {
    return null;
  }
  const report = await createAcquisitionService().acquisition(project.id, {
    from: period.from,
    to: period.to,
  });
  return {
    nameParts: ['acquisition', table, period.from, period.to],
    table: acquisitionCsvTable(report, table),
  };
});
