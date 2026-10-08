import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { type ScreenSlug, screenHref } from '@/components/shell/screens';
import type { Project } from '@/domain/admin';
import { type CsvFile, csvDocument, csvFileName } from '@/domain/csv';
import { type Period, resolvePeriod } from '@/domain/period';
import { projectOrNotFound, readOrSignIn } from './current-admin';

export const EXPORT_SEGMENT = 'export';
export const TABLE_PARAMETER = 'table';

export interface CsvExportRequest {
  readonly project: Project;
  readonly period: Period;
  readonly search: Readonly<Record<string, string>>;
}

export type CsvFileReader = (request: CsvExportRequest) => Promise<CsvFile | null>;

export interface CsvExportContext {
  readonly params: Promise<{ readonly projectId: string }>;
}

export function exportHref(projectId: string, slug: ScreenSlug, query: string): string {
  const path = `${screenHref(projectId, slug)}/${EXPORT_SEGMENT}`;
  return query === '' ? path : `${path}?${query}`;
}

export function csvResponse(file: CsvFile): Response {
  return new Response(csvDocument(file.table), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${csvFileName(file.nameParts)}"`,
      'cache-control': 'private, no-store',
    },
  });
}

export function csvExport(read: CsvFileReader) {
  return async function GET(request: NextRequest, context: CsvExportContext): Promise<Response> {
    const { project } = await projectOrNotFound((await context.params).projectId);
    const search = Object.fromEntries(request.nextUrl.searchParams);
    const period = resolvePeriod(search, project.timezone, new Date());
    const file = await readOrSignIn(() => read({ project, period, search }));
    if (file === null) {
      notFound();
    }
    return csvResponse(file);
  };
}
