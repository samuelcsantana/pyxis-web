import type { EngagementReport } from '@/domain/engagement';
import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { PropertyBreakdownReport } from '@/domain/property-breakdown';
import type { PropertySummaryReport } from '@/domain/property-summary';
import type { ReportScope } from '../date-range';

export interface IFeaturesService {
  features(projectId: string, scope: ReportScope, kind: FeatureKind): Promise<FeaturesReport>;
  properties(projectId: string, scope: ReportScope, name: string): Promise<PropertyBreakdownReport>;
  summary(
    projectId: string,
    scope: ReportScope,
    request: PropertySummaryRequest,
  ): Promise<PropertySummaryReport>;
  engagement(projectId: string, scope: ReportScope): Promise<EngagementReport>;
}

export interface PropertySummaryRequest {
  readonly name: string;
  readonly key: string;
  readonly by: string | null;
}
