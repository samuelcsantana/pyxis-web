import type {
  SaveSlackWebhookOutcome,
  SlackWebhook,
  TestSlackWebhookOutcome,
} from '@/domain/slack-webhook';

export interface ISlackWebhookService {
  webhook(projectId: string): Promise<SlackWebhook | null>;
  save(projectId: string, url: string): Promise<SaveSlackWebhookOutcome>;
  test(projectId: string): Promise<TestSlackWebhookOutcome>;
  remove(projectId: string): Promise<void>;
}
