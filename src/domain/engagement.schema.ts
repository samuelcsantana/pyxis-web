import { z } from 'zod';
import type { EngagementReport } from './engagement';

export const engagementResponseSchema = z
  .object({
    visits: z.number().int(),
    single_page_visits: z.number().int(),
    median_visit_seconds: z.number().int().nullable(),
    visit_lengths: z.array(
      z.object({ up_to_seconds: z.number().int().nullable(), visits: z.number().int() }),
    ),
    entry_pages: z.array(
      z.object({
        path: z.string(),
        visits: z.number().int(),
        single_page_visits: z.number().int(),
      }),
    ),
    exit_pages: z.array(z.object({ path: z.string(), visits: z.number().int() })),
  })
  .transform((body): EngagementReport => ({
    visits: body.visits,
    singlePageVisits: body.single_page_visits,
    medianVisitSeconds: body.median_visit_seconds,
    visitLengths: body.visit_lengths.map((bucket) => ({
      upToSeconds: bucket.up_to_seconds,
      visits: bucket.visits,
    })),
    entryPages: body.entry_pages.map((page) => ({
      path: page.path,
      visits: page.visits,
      singlePageVisits: page.single_page_visits,
    })),
    exitPages: body.exit_pages,
  }));
