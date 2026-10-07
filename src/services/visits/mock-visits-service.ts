import type { VisitFilters, VisitsReport } from '@/domain/visits';
import type { DateRange } from '../date-range';
import { demoTimeZone } from '../demo/demo-projects';
import { demoVisitsReport } from './demo-visit-list';
import type { IVisitsService } from './visits-service.interface';

export class MockVisitsService implements IVisitsService {
  visits(
    projectId: string,
    range: DateRange,
    filters: VisitFilters,
    cursor: string | null,
  ): Promise<VisitsReport> {
    return Promise.resolve(
      demoVisitsReport(range, filters, cursor, new Date(), demoTimeZone(projectId)),
    );
  }
}
