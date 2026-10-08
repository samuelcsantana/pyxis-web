import { devicesCsvTable } from '@/domain/devices-export';
import { csvExport } from '@/lib/csv-export';
import { createDevicesService } from '@/services/devices/devices-service.factory';

export const GET = csvExport(async ({ project, period }) => {
  const report = await createDevicesService().devices(project.id, {
    from: period.from,
    to: period.to,
  });
  return {
    nameParts: ['devices', period.from, period.to],
    table: devicesCsvTable(report),
  };
});
