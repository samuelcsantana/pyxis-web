'use server';

import type { AllowConnectionOutcome, DenyConnectionOutcome } from '@/domain/connection-requests';
import { connectionRequestIdSchema } from '@/domain/connection-requests.schema';
import { readOrSignIn } from '@/lib/current-admin';
import { createConnectionRequestsService } from '@/services/connection-requests/connection-requests-service.factory';

function requestIdOf(requestId: string): string {
  const parsed = connectionRequestIdSchema.safeParse(requestId);
  if (!parsed.success) {
    throw new Error('A connection request is answered by its id.');
  }
  return parsed.data;
}

export async function allowConnection(requestId: string): Promise<AllowConnectionOutcome> {
  const id = requestIdOf(requestId);
  return readOrSignIn(() => createConnectionRequestsService().allow(id));
}

export async function denyConnection(requestId: string): Promise<DenyConnectionOutcome> {
  const id = requestIdOf(requestId);
  return readOrSignIn(() => createConnectionRequestsService().deny(id));
}
