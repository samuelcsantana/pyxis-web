import type { AcquisitionReport } from '@/domain/acquisition';
import type { ReportScope } from '../date-range';

export interface IAcquisitionService {
  acquisition(projectId: string, scope: ReportScope): Promise<AcquisitionReport>;
}
