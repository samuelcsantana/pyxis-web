import type { EngagementReport } from '@/domain/engagement';
import { engagementResponseSchema } from '@/domain/engagement.schema';
import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { PropertyBreakdownReport } from '@/domain/property-breakdown';
import type { ReportScope } from '../date-range';
import { demoEngagementWire } from './demo-engagement';
import { demoFeaturesReport } from './demo-features';
import { demoPropertyBreakdownReport } from './demo-properties';
import type { IFeaturesService } from './features-service.interface';

export class MockFeaturesService implements IFeaturesService {
  features(projectId: string, scope: ReportScope, kind: FeatureKind): Promise<FeaturesReport> {
    return Promise.resolve(demoFeaturesReport(projectId, scope, kind, new Date()));
  }

  properties(
    projectId: string,
    scope: ReportScope,
    name: string,
  ): Promise<PropertyBreakdownReport> {
    return Promise.resolve(demoPropertyBreakdownReport(projectId, scope, name, new Date()));
  }

  engagement(projectId: string, scope: ReportScope): Promise<EngagementReport> {
    return Promise.resolve(
      engagementResponseSchema.parse(demoEngagementWire(projectId, scope, new Date())),
    );
  }
}
