import { NextResponse } from 'next/server';
import { exportHref, isDownloadable } from '@/domain/exports';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createExportsService } from '@/services/exports/exports-service.factory';

export interface ExportDownloadContext {
  readonly params: Promise<{ readonly projectId: string; readonly exportId: string }>;
}

const SEE_OTHER = 303;

export async function GET(request: Request, { params }: ExportDownloadContext) {
  const { projectId, exportId } = await params;
  const { project } = await projectOrNotFound(projectId);
  const found = await readOrSignIn(() => createExportsService().get(project.id, exportId));
  const target =
    isDownloadable(found, new Date()) && found.downloadUrl !== null
      ? found.downloadUrl
      : exportHref(project.id, found.id);
  return NextResponse.redirect(new URL(target, request.url), SEE_OTHER);
}
