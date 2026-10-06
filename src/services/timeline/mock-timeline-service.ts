import type { Lookup, TimelineReport } from '@/domain/timeline';
import { demoTimelineReport } from './demo-timeline';
import type { ITimelineService } from './timeline-service.interface';

export class MockTimelineService implements ITimelineService {
  timeline(_projectId: string, lookup: Lookup): Promise<TimelineReport> {
    return Promise.resolve(demoTimelineReport(lookup, new Date()));
  }
}
