import { ApiRequestError } from '@/domain/errors';
import type { ProjectExport, RequestExportOutcome } from '@/domain/exports';
import {
  projectExportResponseSchema,
  requestedExportResponseSchema,
} from '@/domain/exports.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { IExportsService } from './exports-service.interface';

export const EXPORT_ERROR_CODES = {
  limitReached: 'export_limit_reached',
  unavailable: 'exports_unavailable',
} as const;

function exportsPath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}/exports`;
}

function refusedWith(error: unknown, code: string): boolean {
  return error instanceof ApiRequestError && error.code === code;
}

export class HttpExportsService implements IExportsService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  async request(projectId: string): Promise<RequestExportOutcome> {
    try {
      const answer = await this.writer.post(
        exportsPath(projectId),
        {},
        requestedExportResponseSchema,
      );
      return { kind: 'requested', export: answer.export, alreadyWaiting: !answer.requested };
    } catch (error) {
      if (refusedWith(error, EXPORT_ERROR_CODES.limitReached)) {
        return { kind: 'limitReached' };
      }
      if (refusedWith(error, EXPORT_ERROR_CODES.unavailable)) {
        return { kind: 'unavailable' };
      }
      throw error;
    }
  }

  get(projectId: string, exportId: string): Promise<ProjectExport> {
    return this.reader.get(
      `${exportsPath(projectId)}/${encodeURIComponent(exportId)}`,
      projectExportResponseSchema,
    );
  }
}
