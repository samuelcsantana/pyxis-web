import { z } from 'zod';
import type { TimeOfDayReport } from './time-of-day';

export const timeOfDayResponseSchema = z
  .object({
    weekdays: z.array(z.object({ weekday: z.number().int(), hours: z.array(z.number().int()) })),
  })
  .transform((body): TimeOfDayReport => body.weekdays);
