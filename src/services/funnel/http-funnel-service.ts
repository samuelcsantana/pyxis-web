import {
  type FunnelMode,
  type FunnelReport,
  funnelResponseSchema,
  type FunnelStep,
  serializeSteps,
} from '@/domain/funnel';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IFunnelService } from './funnel-service.interface';

export class HttpFunnelService implements IFunnelService {
  constructor(private readonly api: ApiReader) {}

  funnel(
    projectId: string,
    range: DateRange,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
  ): Promise<FunnelReport> {
    const query = new URLSearchParams(rangeQuery(range));
    query.set('mode', mode);
    query.set('steps', serializeSteps(steps));
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/funnel?${query.toString()}`,
      funnelResponseSchema,
    );
  }
}
