import type { AcquisitionReport } from '@/domain/acquisition';
import type { DateRange } from '../date-range';

export interface IAcquisitionService {
  acquisition(projectId: string, range: DateRange): Promise<AcquisitionReport>;
}
