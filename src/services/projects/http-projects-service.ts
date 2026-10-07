import { type Admin } from '@/domain/admin';
import { meResponseSchema } from '@/domain/admin.schema';
import type { ApiReader } from '../api-reader';
import type { IProjectsService } from './projects-service.interface';

export class HttpProjectsService implements IProjectsService {
  constructor(private readonly api: ApiReader) {}

  currentAdmin(): Promise<Admin> {
    return this.api.get('/v1/me', meResponseSchema);
  }
}
