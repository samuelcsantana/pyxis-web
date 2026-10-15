import type { ProjectExport, RequestExportOutcome } from '@/domain/exports';
import { EXPORT_FILE_DAYS } from '@/domain/exports';
import { projectExportResponseSchema } from '@/domain/exports.schema';
import type { IExportsService } from './exports-service.interface';

export const DEMO_EXPORT_ID = '5e1b3d7f-9a2c-4e6d-8f1b-3c5d7e9f1a2b';
export const DEMO_EXPORT_FILE = '/demo/events-export.csv';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_EVENT_COUNT = 12_480;
const PREPARING_MS = 90_000;

export function demoExportWire(now: Date, status: 'pending' | 'done') {
  const done = status === 'done';
  return {
    id: DEMO_EXPORT_ID,
    status,
    requested_at: new Date(now.getTime() - (done ? PREPARING_MS : 0)).toISOString(),
    finished_at: done ? now.toISOString() : null,
    event_count: done ? DEMO_EVENT_COUNT : null,
    available_until: done
      ? new Date(now.getTime() + EXPORT_FILE_DAYS * DAY_MS).toISOString()
      : null,
    download_url: done ? DEMO_EXPORT_FILE : null,
  };
}

export class MockExportsService implements IExportsService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  request(): Promise<RequestExportOutcome> {
    return Promise.resolve({
      kind: 'requested',
      alreadyWaiting: false,
      export: projectExportResponseSchema.parse(demoExportWire(this.now(), 'pending')),
    });
  }

  get(): Promise<ProjectExport> {
    return Promise.resolve(projectExportResponseSchema.parse(demoExportWire(this.now(), 'done')));
  }
}
