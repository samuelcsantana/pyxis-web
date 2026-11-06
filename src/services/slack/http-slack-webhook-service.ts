import { ApiNotFoundError, ApiRequestError, PLAN_REQUIRED_CODE } from '@/domain/errors';
import type {
  SaveSlackWebhookOutcome,
  SlackWebhook,
  TestSlackWebhookOutcome,
} from '@/domain/slack-webhook';
import {
  slackTestResponseSchema,
  slackWebhookResponseSchema,
  slackWebhookWire,
} from '@/domain/slack-webhook.schema';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import type { ISlackWebhookService } from './slack-webhook-service.interface';

export const SLACK_ERROR_CODES = {
  invalid: 'invalid_slack_webhook',
  subscriptionRequired: 'subscription_required',
  unavailable: 'slack_unavailable',
} as const;

const TOO_MANY_REQUESTS = 429;

function webhookPath(projectId: string): string {
  return `/v1/projects/${encodeURIComponent(projectId)}/slack-webhook`;
}

function refusedWith(error: unknown, code: string): boolean {
  return error instanceof ApiRequestError && error.code === code;
}

function needsPro(error: unknown): boolean {
  return (
    refusedWith(error, PLAN_REQUIRED_CODE) ||
    refusedWith(error, SLACK_ERROR_CODES.subscriptionRequired)
  );
}

export class HttpSlackWebhookService implements ISlackWebhookService {
  constructor(
    private readonly reader: ApiReader,
    private readonly writer: ApiWriter,
  ) {}

  webhook(projectId: string): Promise<SlackWebhook | null> {
    return this.reader.get(webhookPath(projectId), slackWebhookResponseSchema);
  }

  async save(projectId: string, url: string): Promise<SaveSlackWebhookOutcome> {
    try {
      const webhook = await this.writer.put(
        webhookPath(projectId),
        slackWebhookWire(url),
        slackWebhookResponseSchema,
      );
      return webhook === null ? { kind: 'unavailable' } : { kind: 'saved', webhook };
    } catch (error) {
      if (refusedWith(error, SLACK_ERROR_CODES.invalid)) {
        return { kind: 'invalid' };
      }
      if (needsPro(error)) {
        return { kind: 'planRequired' };
      }
      if (refusedWith(error, SLACK_ERROR_CODES.unavailable)) {
        return { kind: 'unavailable' };
      }
      throw error;
    }
  }

  async test(projectId: string): Promise<TestSlackWebhookOutcome> {
    try {
      const result = await this.writer.post(
        `${webhookPath(projectId)}/test`,
        {},
        slackTestResponseSchema,
      );
      return { kind: 'tested', result };
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === TOO_MANY_REQUESTS) {
        return { kind: 'tooMany' };
      }
      if (needsPro(error)) {
        return { kind: 'planRequired' };
      }
      if (refusedWith(error, SLACK_ERROR_CODES.unavailable)) {
        return { kind: 'unavailable' };
      }
      if (error instanceof ApiNotFoundError) {
        return { kind: 'missing' };
      }
      throw error;
    }
  }

  async remove(projectId: string): Promise<void> {
    try {
      await this.writer.delete(webhookPath(projectId));
    } catch (error) {
      if (!(error instanceof ApiNotFoundError)) {
        throw error;
      }
    }
  }
}
