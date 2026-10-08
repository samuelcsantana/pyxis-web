import { ApiRequestError } from '@/domain/errors';
import { FAILED_READS, type RequestKind, type RequestsReport } from '@/domain/requests';
import type { RouteDay } from '@/domain/route-days';
import type { DateRange } from '../date-range';
import { createRequestsService } from './requests-service.factory';

const STATUS_BAD_REQUEST = 400;

async function nullOnBadRequest<Result>(read: () => Promise<Result>): Promise<Result | null> {
  try {
    return await read();
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === STATUS_BAD_REQUEST) {
      return null;
    }
    throw error;
  }
}

export async function readRequestsReport(
  projectId: string,
  range: DateRange,
  kind: RequestKind,
  screen: string | null,
): Promise<RequestsReport | null> {
  const service = createRequestsService();
  if (kind !== FAILED_READS) {
    return service.requests(projectId, range, screen);
  }
  return nullOnBadRequest(() => service.failedReads(projectId, range, screen));
}

export async function readRouteDays(
  projectId: string,
  range: DateRange,
  kind: RequestKind,
  screen: string | null,
  route: string,
): Promise<readonly RouteDay[] | null> {
  return nullOnBadRequest(() =>
    createRequestsService().routeDays(projectId, range, kind, screen, route),
  );
}
