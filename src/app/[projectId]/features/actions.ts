'use server';

import { z } from 'zod';
import { EVENT_NAME_PATTERN } from '@/domain/funnel';
import { type PropertyKeyView, propertyKeyViews } from '@/domain/property-breakdown';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { createFeaturesService } from '@/services/features/features-service.factory';

const requestSchema = z.strictObject({
  from: z.iso.date(),
  to: z.iso.date(),
  name: z.string().regex(EVENT_NAME_PATTERN),
});

export async function loadPropertyBreakdown(
  projectId: string,
  range: { readonly from: string; readonly to: string },
  name: string,
): Promise<readonly PropertyKeyView[]> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = requestSchema.safeParse({ ...range, name });
  if (!parsed.success) {
    throw new Error('A property breakdown needs a valid range and event name.');
  }
  const { from, to } = parsed.data;
  const report = await readOrSignIn(() =>
    createFeaturesService().properties(project.id, { from, to }, parsed.data.name),
  );
  return propertyKeyViews(report);
}
