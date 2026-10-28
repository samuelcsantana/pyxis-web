import { ACQUISITION_TABLES, acquisitionCsvTable } from '@/domain/acquisition-export';
import { chosenTable } from '@/domain/csv';
import { csvExport, filteredNameParts, TABLE_PARAMETER } from '@/lib/csv-export';
import { createAcquisitionService } from '@/services/acquisition/acquisition-service.factory';

export const GET = csvExport(async ({ project, period, filters, search }) => {
  const table = chosenTable(ACQUISITION_TABLES, search[TABLE_PARAMETER]);
  if (table === null) {
    return null;
  }
  const report = await createAcquisitionService().acquisition(project.id, {
    from: period.from,
    to: period.to,
    filters,
  });
  return {
    nameParts: filteredNameParts(['acquisition', table, period.from, period.to], filters),
    table: acquisitionCsvTable(report, table),
  };
});
