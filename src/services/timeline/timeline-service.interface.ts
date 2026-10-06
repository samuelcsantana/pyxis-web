import type { Lookup, TimelineReport } from '@/domain/timeline';

export interface ITimelineService {
  timeline(projectId: string, lookup: Lookup, before: string | null): Promise<TimelineReport>;
}
