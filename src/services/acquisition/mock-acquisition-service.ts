import type { AcquisitionReport } from '@/domain/acquisition';
import type { ReportScope } from '../date-range';
import type { IAcquisitionService } from './acquisition-service.interface';
import { demoAcquisitionReport } from './demo-acquisition';

export class MockAcquisitionService implements IAcquisitionService {
  acquisition(projectId: string, scope: ReportScope): Promise<AcquisitionReport> {
    return Promise.resolve(demoAcquisitionReport(projectId, scope, new Date()));
  }
}
