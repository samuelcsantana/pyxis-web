import type { EngagementReport } from '@/domain/engagement';
import { engagementResponseSchema } from '@/domain/engagement.schema';
import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { PropertyBreakdownReport } from '@/domain/property-breakdown';
import type { DateRange } from '../date-range';
import { demoEngagementWire } from './demo-engagement';
import { demoFeaturesReport } from './demo-features';
import { demoPropertyBreakdownReport } from './demo-properties';
import type { IFeaturesService } from './features-service.interface';

export class MockFeaturesService implements IFeaturesService {
  features(projectId: string, range: DateRange, kind: FeatureKind): Promise<FeaturesReport> {
    return Promise.resolve(demoFeaturesReport(projectId, range, kind, new Date()));
  }

  properties(projectId: string, range: DateRange, name: string): Promise<PropertyBreakdownReport> {
    return Promise.resolve(demoPropertyBreakdownReport(projectId, range, name, new Date()));
  }

  engagement(projectId: string, range: DateRange): Promise<EngagementReport> {
    return Promise.resolve(
      engagementResponseSchema.parse(demoEngagementWire(projectId, range, new Date())),
    );
  }
}
