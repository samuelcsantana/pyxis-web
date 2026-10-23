'use server';

import { z } from 'zod';
import { MAX_SCREEN_LENGTH } from '@/domain/requests';
import { REQUEST_KINDS } from '@/domain/requests.schema';
import { type RouteDaysView, routeDaysView } from '@/domain/route-days';
import { isRequestRoute } from '@/domain/visits';
import { getI18n } from '@/i18n/get-messages';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { readRouteDays } from '@/services/requests/requests-report';

const scopeSchema = z.strictObject({
  from: z.iso.date(),
  to: z.iso.date(),
  kind: z.enum(REQUEST_KINDS),
  screen: z.string().startsWith('/').max(MAX_SCREEN_LENGTH).nullable(),
  route: z.string().refine(isRequestRoute),
});

export interface RouteDaysScope {
  readonly from: string;
  readonly to: string;
  readonly kind: string;
  readonly screen: string | null;
}

export async function loadRouteDays(
  projectId: string,
  scope: RouteDaysScope,
  route: string,
): Promise<RouteDaysView | null> {
  const { project } = await projectOrNotFound(projectId);
  const parsed = scopeSchema.safeParse({ ...scope, route });
  if (!parsed.success) {
    throw new Error('The days of a route need a valid range, kind, screen and route.');
  }
  const { from, to, kind, screen } = parsed.data;
  const days = await readOrSignIn(() =>
    readRouteDays(project.id, { from, to }, kind, screen, parsed.data.route),
  );
  return days === null ? null : routeDaysView(days, kind, await getI18n());
}
