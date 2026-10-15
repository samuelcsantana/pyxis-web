import type { ProjectExport, RequestExportOutcome } from '@/domain/exports';

export interface IExportsService {
  request(projectId: string): Promise<RequestExportOutcome>;
  get(projectId: string, exportId: string): Promise<ProjectExport>;
}
