import type { AcquisitionReport } from '@/domain/acquisition';
import type { DateRange } from '../date-range';
import type { IAcquisitionService } from './acquisition-service.interface';
import { demoAcquisitionReport } from './demo-acquisition';

export class MockAcquisitionService implements IAcquisitionService {
  acquisition(projectId: string, range: DateRange): Promise<AcquisitionReport> {
    return Promise.resolve(demoAcquisitionReport(projectId, range, new Date()));
  }
}
