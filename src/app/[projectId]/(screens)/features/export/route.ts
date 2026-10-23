import { featureKindOf, searchQueryOf } from '@/domain/features';
import { featuresCsvTable } from '@/domain/features-export';
import { csvExport } from '@/lib/csv-export';
import { createFeaturesService } from '@/services/features/features-service.factory';

export const GET = csvExport(async ({ project, period, search }) => {
  const kind = featureKindOf(search);
  const report = await createFeaturesService().features(
    project.id,
    { from: period.from, to: period.to },
    kind,
  );
  return {
    nameParts: ['features', kind, period.from, period.to],
    table: featuresCsvTable(report.items, kind, searchQueryOf(search)),
  };
});
