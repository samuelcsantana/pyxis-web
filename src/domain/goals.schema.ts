import { z } from 'zod';
import { GOAL_KINDS, type Goal, type GoalChanges, type GoalsSummary } from './goals';

const goalWireSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(GOAL_KINDS),
  event: z.string().nullable(),
  path: z.string().nullable(),
  position: z.number().int(),
  created_at: z.string(),
});

type GoalWire = z.infer<typeof goalWireSchema>;

function goalOf(body: GoalWire): Goal {
  return {
    id: body.id,
    name: body.name,
    kind: body.type,
    target: (body.type === 'event' ? body.event : body.path) ?? '',
    position: body.position,
  };
}

export const goalResponseSchema = goalWireSchema.transform(goalOf);

export const goalListSchema = z
  .array(goalWireSchema)
  .transform((goals): readonly Goal[] => goals.map(goalOf));

export const goalsResponseSchema = z
  .object({ goals: goalListSchema })
  .transform((body): readonly Goal[] => body.goals);

export const goalsSummaryResponseSchema = z
  .object({
    visits: z.number().int(),
    goals: z.array(
      goalWireSchema.extend({
        conversions: z.number().int(),
        converting_visits: z.number().int(),
        conversion_rate: z.number().nullable(),
        revenue: z.number().nullable(),
      }),
    ),
  })
  .transform((body): GoalsSummary => ({
    visits: body.visits,
    goals: body.goals.map((goal) => ({
      ...goalOf(goal),
      conversions: goal.conversions,
      convertingVisits: goal.converting_visits,
      conversionRate: goal.conversion_rate,
      revenue: goal.revenue,
    })),
  }));

export function goalChangesWire(changes: GoalChanges) {
  const name = changes.name.trim();
  const target = changes.target.trim();
  return changes.kind === 'event' ? { name, event: target } : { name, path: target };
}
