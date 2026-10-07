import type { VisitFilters, VisitsReport } from '@/domain/visits';
import type { DateRange } from '../date-range';
import { demoVisitsReport } from './demo-visit-list';
import type { IVisitsService } from './visits-service.interface';

export class MockVisitsService implements IVisitsService {
  visits(
    projectId: string,
    range: DateRange,
    filters: VisitFilters,
    cursor: string | null,
  ): Promise<VisitsReport> {
    return Promise.resolve(demoVisitsReport(projectId, range, filters, cursor, new Date()));
  }
}
