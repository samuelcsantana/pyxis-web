import { featureKindOf, searchQueryOf } from '@/domain/features';
import { featuresCsvTable } from '@/domain/features-export';
import { csvExport, filteredNameParts } from '@/lib/csv-export';
import { createFeaturesService } from '@/services/features/features-service.factory';

export const GET = csvExport(async ({ project, period, filters, search }) => {
  const kind = featureKindOf(search);
  const report = await createFeaturesService().features(
    project.id,
    { from: period.from, to: period.to, filters },
    kind,
  );
  return {
    nameParts: filteredNameParts(['features', kind, period.from, period.to], filters),
    table: featuresCsvTable(report.items, kind, searchQueryOf(search)),
  };
});
