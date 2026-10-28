import {
  type FunnelMode,
  type FunnelReport,
  type FunnelStep,
  serializeSteps,
} from '@/domain/funnel';
import type { FunnelSegmentDimension, FunnelSegmentsReport } from '@/domain/funnel-segments';
import { funnelSegmentsResponseSchema } from '@/domain/funnel-segments.schema';
import type { FunnelDrill, FunnelSubjectsPage } from '@/domain/funnel-subjects';
import { funnelResponseSchema, funnelSubjectsResponseSchema } from '@/domain/funnel.schema';
import type { ApiReader } from '../api-reader';
import { type ReportScope, reportQuery } from '../date-range';
import type { IFunnelService } from './funnel-service.interface';

function funnelQuery(scope: ReportScope, mode: FunnelMode, steps: readonly FunnelStep[]) {
  const query = new URLSearchParams(reportQuery(scope));
  query.set('mode', mode);
  query.set('steps', serializeSteps(steps));
  return query;
}

export class HttpFunnelService implements IFunnelService {
  constructor(private readonly api: ApiReader) {}

  segments(
    projectId: string,
    scope: ReportScope,
    steps: readonly FunnelStep[],
    by: FunnelSegmentDimension,
  ): Promise<FunnelSegmentsReport> {
    const query = new URLSearchParams(reportQuery(scope));
    query.set('steps', serializeSteps(steps));
    query.set('by', by);
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/funnel/segments?${query.toString()}`,
      funnelSegmentsResponseSchema,
    );
  }

  funnel(
    projectId: string,
    scope: ReportScope,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
  ): Promise<FunnelReport> {
    const query = funnelQuery(scope, mode, steps);
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/funnel?${query.toString()}`,
      funnelResponseSchema,
    );
  }

  subjects(
    projectId: string,
    scope: ReportScope,
    mode: FunnelMode,
    steps: readonly FunnelStep[],
    drill: FunnelDrill,
  ): Promise<FunnelSubjectsPage> {
    const query = funnelQuery(scope, mode, steps);
    query.set('step', String(drill.step));
    query.set('outcome', drill.outcome);
    if (drill.cursor !== null) {
      query.set('cursor', drill.cursor);
    }
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/funnel/subjects?${query.toString()}`,
      funnelSubjectsResponseSchema,
    );
  }
}
