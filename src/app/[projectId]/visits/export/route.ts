import { MAX_EXPORTED_VISITS, visitsCsvTable } from '@/domain/visits-export';
import { visitFiltersOf } from '@/domain/visits';
import { csvExport } from '@/lib/csv-export';
import { readNewestVisits } from '@/services/visits/newest-visits';

export const GET = csvExport(async ({ project, period, search }) => {
  const visits = await readNewestVisits(
    project.id,
    { from: period.from, to: period.to },
    visitFiltersOf(search).filters,
    MAX_EXPORTED_VISITS,
  );
  return {
    nameParts: ['visits', period.from, period.to],
    table: visitsCsvTable(visits),
  };
});
