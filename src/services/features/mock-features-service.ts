import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { PropertyBreakdownReport } from '@/domain/property-breakdown';
import type { DateRange } from '../date-range';
import { demoFeaturesReport } from './demo-features';
import { demoPropertyBreakdownReport } from './demo-properties';
import type { IFeaturesService } from './features-service.interface';

export class MockFeaturesService implements IFeaturesService {
  features(projectId: string, range: DateRange, kind: FeatureKind): Promise<FeaturesReport> {
    return Promise.resolve(demoFeaturesReport(projectId, range, kind));
  }

  properties(projectId: string, range: DateRange, name: string): Promise<PropertyBreakdownReport> {
    return Promise.resolve(demoPropertyBreakdownReport(projectId, range, name));
  }
}
