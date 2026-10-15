import { z } from 'zod';
import { EXPORT_STATUSES, type ProjectExport } from './exports';

const exportWireSchema = z.object({
  id: z.string(),
  status: z.enum(EXPORT_STATUSES),
  requested_at: z.string(),
  finished_at: z.string().nullable(),
  event_count: z.number().int().nullable(),
  available_until: z.string().nullable(),
  download_url: z.string().nullable(),
});

function fromWire(body: z.infer<typeof exportWireSchema>): ProjectExport {
  return {
    id: body.id,
    status: body.status,
    requestedAt: body.requested_at,
    finishedAt: body.finished_at,
    eventCount: body.event_count,
    availableUntil: body.available_until,
    downloadUrl: body.download_url,
  };
}

export const projectExportResponseSchema = exportWireSchema.transform(fromWire);

export const requestedExportResponseSchema = z
  .object({ export: exportWireSchema, requested: z.boolean() })
  .transform((body) => ({ export: fromWire(body.export), requested: body.requested }));
