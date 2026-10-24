import type { ArrivalsReport } from '@/domain/arrivals';
import type { DateRange } from '../date-range';

export interface IArrivalsService {
  arrivals(projectId: string, range: DateRange, since: Date): Promise<ArrivalsReport>;
}
