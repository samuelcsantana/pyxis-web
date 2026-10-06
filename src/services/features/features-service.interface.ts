import type { FeatureKind, FeaturesReport } from '@/domain/features';
import type { DateRange } from '../date-range';

export interface IFeaturesService {
  features(projectId: string, range: DateRange, kind: FeatureKind): Promise<FeaturesReport>;
}
