import {
  FAILED_READS,
  failingOnlyOf,
  requestKindOf,
  screenFilterOf,
  visibleRoutes,
} from '@/domain/requests';
import { REQUESTS_FILE_SUBJECTS, requestsCsvTable } from '@/domain/requests-export';
import { csvExport } from '@/lib/csv-export';
import { readRequestsReport } from '@/services/requests/requests-report';

export const GET = csvExport(async ({ project, period, search }) => {
  const kind = requestKindOf(search);
  const report = await readRequestsReport(
    project.id,
    { from: period.from, to: period.to },
    kind,
    screenFilterOf(search),
  );
  if (report === null) {
    return null;
  }
  const failingOnly = kind !== FAILED_READS && failingOnlyOf(search);
  return {
    nameParts: ['requests', REQUESTS_FILE_SUBJECTS[kind], period.from, period.to],
    table: requestsCsvTable(visibleRoutes(report.routes, failingOnly), kind),
  };
});
