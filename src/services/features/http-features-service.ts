import { type FeatureKind, type FeaturesReport, featuresResponseSchema } from '@/domain/features';
import {
  type PropertyBreakdownReport,
  propertyBreakdownResponseSchema,
} from '@/domain/property-breakdown';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IFeaturesService } from './features-service.interface';

export class HttpFeaturesService implements IFeaturesService {
  constructor(private readonly api: ApiReader) {}

  features(projectId: string, range: DateRange, kind: FeatureKind): Promise<FeaturesReport> {
    const query = new URLSearchParams(rangeQuery(range));
    query.set('kind', kind);
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/features?${query.toString()}`,
      featuresResponseSchema,
    );
  }

  properties(projectId: string, range: DateRange, name: string): Promise<PropertyBreakdownReport> {
    const query = new URLSearchParams(rangeQuery(range));
    query.set('name', name);
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/features/properties?${query.toString()}`,
      propertyBreakdownResponseSchema,
    );
  }
}
