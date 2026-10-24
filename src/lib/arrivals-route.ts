import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import { resolvePeriod } from '@/domain/period';
import { createArrivalsService } from '@/services/arrivals/arrivals-service.factory';
import { SINCE_PARAMETER } from './arrivals-href';
import { projectOrNotFound } from './current-admin';

const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;
const STATUS_NOT_FOUND = 404;
const STATUS_TOO_MANY_REQUESTS = 429;
const NOT_STORED = { 'cache-control': 'private, no-store' };
const sinceSchema = z.iso.datetime({ offset: true });

export interface ArrivalsContext {
  readonly params: Promise<{ readonly projectId: string }>;
}

function answer(body: unknown, status?: number): Response {
  return Response.json(body, { status, headers: NOT_STORED });
}

function failure(error: unknown): Response {
  if (error instanceof UnauthenticatedError) {
    return answer({ error: 'unauthenticated' }, STATUS_UNAUTHORIZED);
  }
  if (error instanceof ApiNotFoundError) {
    return answer({ error: 'not_found' }, STATUS_NOT_FOUND);
  }
  if (error instanceof ApiRequestError && error.status === STATUS_TOO_MANY_REQUESTS) {
    return answer({ error: 'rate_limited' }, STATUS_TOO_MANY_REQUESTS);
  }
  throw error;
}

export async function arrivalsAnswer(
  request: NextRequest,
  context: ArrivalsContext,
): Promise<Response> {
  const { project } = await projectOrNotFound((await context.params).projectId);
  const since = sinceSchema.safeParse(request.nextUrl.searchParams.get(SINCE_PARAMETER));
  if (!since.success) {
    return answer({ error: 'invalid_since' }, STATUS_BAD_REQUEST);
  }
  const search = Object.fromEntries(request.nextUrl.searchParams);
  const { from, to } = resolvePeriod(search, project.timezone, new Date());
  try {
    const report = await createArrivalsService().arrivals(
      project.id,
      { from, to },
      new Date(since.data),
    );
    return answer(report);
  } catch (error) {
    return failure(error);
  }
}
