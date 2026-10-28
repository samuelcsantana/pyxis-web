import { devicesCsvTable } from '@/domain/devices-export';
import { csvExport, filteredNameParts } from '@/lib/csv-export';
import { createDevicesService } from '@/services/devices/devices-service.factory';

export const GET = csvExport(async ({ project, period, filters }) => {
  const report = await createDevicesService().devices(project.id, {
    from: period.from,
    to: period.to,
    filters,
  });
  return {
    nameParts: filteredNameParts(['devices', period.from, period.to], filters),
    table: devicesCsvTable(report),
  };
});
