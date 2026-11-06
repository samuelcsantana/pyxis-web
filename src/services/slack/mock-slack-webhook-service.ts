import type {
  SaveSlackWebhookOutcome,
  SlackWebhook,
  TestSlackWebhookOutcome,
} from '@/domain/slack-webhook';
import { slackWebhookResponseSchema } from '@/domain/slack-webhook.schema';
import type { ISlackWebhookService } from './slack-webhook-service.interface';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_CONNECTED_DAYS_AGO = 12;
const MASK_PREFIX = 'hooks.slack.com/…/';
const HINT_LENGTH = 4;

export function demoSlackWebhookWire(now: Date) {
  return {
    webhook: {
      masked_url: `${MASK_PREFIX}9XQZ`,
      connected_at: new Date(now.getTime() - DEMO_CONNECTED_DAYS_AGO * DAY_MS).toISOString(),
      broken_at: null,
      broken_reason: null,
    },
  };
}

export class MockSlackWebhookService implements ISlackWebhookService {
  constructor(private readonly now: () => Date = () => new Date()) {}

  webhook(): Promise<SlackWebhook | null> {
    return Promise.resolve(slackWebhookResponseSchema.parse(demoSlackWebhookWire(this.now())));
  }

  save(_projectId: string, url: string): Promise<SaveSlackWebhookOutcome> {
    return Promise.resolve({
      kind: 'saved',
      webhook: {
        maskedUrl: `${MASK_PREFIX}${url.trim().slice(-HINT_LENGTH)}`,
        connectedAt: this.now().toISOString(),
        brokenAt: null,
        brokenReason: null,
      },
    });
  }

  test(): Promise<TestSlackWebhookOutcome> {
    return Promise.resolve({ kind: 'tested', result: 'sent' });
  }

  remove(): Promise<void> {
    return Promise.resolve();
  }
}
