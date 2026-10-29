export const EXPORT_STATUSES = ['pending', 'done', 'failed'] as const;
export const MAX_EXPORTS_PER_DAY = 3;
export const EXPORT_FILE_DAYS = 7;

export type ExportStatus = (typeof EXPORT_STATUSES)[number];

export interface ProjectExport {
  readonly id: string;
  readonly status: ExportStatus;
  readonly requestedAt: string;
  readonly finishedAt: string | null;
  readonly eventCount: number | null;
  readonly availableUntil: string | null;
  readonly downloadUrl: string | null;
}

export type RequestExportOutcome =
  | { readonly kind: 'requested'; readonly export: ProjectExport; readonly alreadyWaiting: boolean }
  | { readonly kind: 'limitReached' }
  | { readonly kind: 'unavailable' };

export const EXPORTS_SEGMENT = 'exports';

export function exportHref(projectId: string, exportId: string): string {
  return `/${encodeURIComponent(projectId)}/${EXPORTS_SEGMENT}/${encodeURIComponent(exportId)}`;
}

export function exportDownloadHref(projectId: string, exportId: string): string {
  return `${exportHref(projectId, exportId)}/download`;
}

export function isDownloadable(found: ProjectExport, now: Date): boolean {
  return (
    found.status === 'done' &&
    found.downloadUrl !== null &&
    found.availableUntil !== null &&
    new Date(found.availableUntil).getTime() > now.getTime()
  );
}
