import { type Lookup, type TimelineReport, timelineResponseSchema } from '@/domain/timeline';
import type { ApiReader } from '../api-reader';
import type { ITimelineService } from './timeline-service.interface';

const LOOKUP_PARAMETERS: Readonly<Record<Lookup['kind'], string>> = {
  user: 'user_id',
  visit: 'session_id',
};

export class HttpTimelineService implements ITimelineService {
  constructor(private readonly api: ApiReader) {}

  timeline(projectId: string, lookup: Lookup, before: string | null): Promise<TimelineReport> {
    const query = new URLSearchParams({ [LOOKUP_PARAMETERS[lookup.kind]]: lookup.id });
    if (before !== null) {
      query.set('before', before);
    }
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/timeline?${query.toString()}`,
      timelineResponseSchema,
    );
  }
}
