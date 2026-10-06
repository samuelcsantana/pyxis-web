import type { Lookup, TimelineReport } from '@/domain/timeline';
import { demoTimelinePage } from './demo-timeline';
import type { ITimelineService } from './timeline-service.interface';

export class MockTimelineService implements ITimelineService {
  timeline(_projectId: string, lookup: Lookup, before: string | null): Promise<TimelineReport> {
    return Promise.resolve(demoTimelinePage(lookup, new Date(), before));
  }
}
