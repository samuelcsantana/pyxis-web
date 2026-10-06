import { type Admin, meResponseSchema } from '@/domain/admin';
import type { ApiReader } from '../api-reader';
import type { IProjectsService } from './projects-service.interface';

export class HttpProjectsService implements IProjectsService {
  constructor(private readonly api: ApiReader) {}

  currentAdmin(): Promise<Admin> {
    return this.api.get('/v1/me', meResponseSchema);
  }
}
