import { z } from 'zod';
import { FUNNEL_SEGMENT_DIMENSIONS, type FunnelSegmentsReport } from './funnel-segments';

export const funnelSegmentsResponseSchema = z
  .object({
    by: z.enum(FUNNEL_SEGMENT_DIMENSIONS),
    segments: z.array(z.object({ segment: z.string(), steps: z.array(z.number().int()) })),
  })
  .transform((body): FunnelSegmentsReport => body);
