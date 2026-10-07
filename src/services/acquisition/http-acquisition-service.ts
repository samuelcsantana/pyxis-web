import { type AcquisitionReport } from '@/domain/acquisition';
import { acquisitionResponseSchema } from '@/domain/acquisition.schema';
import type { ApiReader } from '../api-reader';
import { type DateRange, rangeQuery } from '../date-range';
import type { IAcquisitionService } from './acquisition-service.interface';

export class HttpAcquisitionService implements IAcquisitionService {
  constructor(private readonly api: ApiReader) {}

  acquisition(projectId: string, range: DateRange): Promise<AcquisitionReport> {
    return this.api.get(
      `/v1/projects/${encodeURIComponent(projectId)}/acquisition?${rangeQuery(range)}`,
      acquisitionResponseSchema,
    );
  }
}
