import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { DateRange } from '../date-range';
import { demoFeaturesReport } from './demo-features';
import type { IFeaturesService } from './features-service.interface';

export class MockFeaturesService implements IFeaturesService {
  features(_projectId: string, range: DateRange, kind: FeatureKind): Promise<FeaturesReport> {
    return Promise.resolve(demoFeaturesReport(range, kind));
  }
}
