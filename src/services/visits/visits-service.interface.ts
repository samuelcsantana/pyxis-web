import type { VisitFilters, VisitsReport } from '@/domain/visits';
import type { DateRange } from '../date-range';

export interface IVisitsService {
  visits(
    projectId: string,
    range: DateRange,
    filters: VisitFilters,
    cursor: string | null,
  ): Promise<VisitsReport>;
}
