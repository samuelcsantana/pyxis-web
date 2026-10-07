import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { PropertyBreakdownReport } from '@/domain/property-breakdown';
import type { DateRange } from '../date-range';

export interface IFeaturesService {
  features(projectId: string, range: DateRange, kind: FeatureKind): Promise<FeaturesReport>;
  properties(projectId: string, range: DateRange, name: string): Promise<PropertyBreakdownReport>;
}
