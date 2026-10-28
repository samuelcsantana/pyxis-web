import type { EngagementReport } from '@/domain/engagement';
import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { PropertyBreakdownReport } from '@/domain/property-breakdown';
import type { ReportScope } from '../date-range';

export interface IFeaturesService {
  features(projectId: string, scope: ReportScope, kind: FeatureKind): Promise<FeaturesReport>;
  properties(projectId: string, scope: ReportScope, name: string): Promise<PropertyBreakdownReport>;
  engagement(projectId: string, scope: ReportScope): Promise<EngagementReport>;
}
