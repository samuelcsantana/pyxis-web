import { apiBaseUrl } from '@/lib/api-config';
import { createApiReader } from '../api-reader.factory';
import { createApiWriter } from '../api-writer.factory';
import { HttpSlackWebhookService } from './http-slack-webhook-service';
import { MockSlackWebhookService } from './mock-slack-webhook-service';
import type { ISlackWebhookService } from './slack-webhook-service.interface';

export function createSlackWebhookService(): ISlackWebhookService {
  const baseUrl = apiBaseUrl();
  return baseUrl === undefined
    ? new MockSlackWebhookService()
    : new HttpSlackWebhookService(createApiReader(baseUrl), createApiWriter(baseUrl));
}
