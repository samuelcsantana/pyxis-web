import { z } from 'zod';
import {
  EVENT_NAME_PATTERN,
  type FunnelSearch,
  MAX_FUNNEL_STEPS,
  MAX_PATH_LENGTH,
  MIN_FUNNEL_STEPS,
  stepsTextOf,
} from './funnel';

export const funnelStepSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('page'),
    path: z.string().startsWith('/').max(MAX_PATH_LENGTH),
  }),
  z.strictObject({ type: z.literal('event'), name: z.string().regex(EVENT_NAME_PATTERN) }),
]);
export type FunnelStep = z.output<typeof funnelStepSchema>;
export type FunnelStepType = FunnelStep['type'];

export const funnelStepsSchema = z
  .array(funnelStepSchema)
  .min(MIN_FUNNEL_STEPS)
  .max(MAX_FUNNEL_STEPS);

const stepsParameterSchema = z
  .string()
  .transform((text, context) => {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      context.addIssue({ code: 'custom', message: 'steps must be JSON' });
      return z.NEVER;
    }
  })
  .pipe(funnelStepsSchema);

export const funnelResponseSchema = z
  .object({
    steps: z.array(
      z.object({
        count: z.number(),
        median_seconds_from_previous: z.number().nullable().optional(),
      }),
    ),
    median_seconds_overall: z.number().nullable().optional(),
  })
  .transform((body) => ({
    steps: body.steps.map((step) => ({
      count: step.count,
      medianSecondsFromPrevious: step.median_seconds_from_previous ?? null,
    })),
    medianSecondsOverall: body.median_seconds_overall ?? null,
  }));
export type FunnelReport = z.output<typeof funnelResponseSchema>;
export type FunnelWire = z.input<typeof funnelResponseSchema>;

export function funnelStepsOf(search: FunnelSearch): readonly FunnelStep[] | null {
  const parsed = stepsParameterSchema.safeParse(stepsTextOf(search));
  return parsed.success ? parsed.data : null;
}
