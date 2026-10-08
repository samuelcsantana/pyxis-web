import { ApiRequestError } from '@/domain/errors';
import { FAILED_READS, type RequestKind, type RequestsReport } from '@/domain/requests';
import type { DateRange } from '../date-range';
import { createRequestsService } from './requests-service.factory';

const STATUS_BAD_REQUEST = 400;

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
  try {
    return await service.failedReads(projectId, range, screen);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === STATUS_BAD_REQUEST) {
      return null;
    }
    throw error;
  }
}
