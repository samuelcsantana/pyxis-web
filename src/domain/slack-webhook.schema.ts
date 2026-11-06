import { z } from 'zod';
import type { SlackTestResult, SlackWebhook } from './slack-webhook';

const slackWebhookWireSchema = z.object({
  masked_url: z.string(),
  connected_at: z.string(),
  broken_at: z.string().nullable(),
  broken_reason: z.string().nullable(),
});

export const slackWebhookResponseSchema = z
  .object({ webhook: slackWebhookWireSchema.nullable() })
  .transform(
    ({ webhook }): SlackWebhook | null =>
      webhook && {
        maskedUrl: webhook.masked_url,
        connectedAt: webhook.connected_at,
        brokenAt: webhook.broken_at,
        brokenReason: webhook.broken_reason,
      },
  );

export const slackTestResponseSchema = z
  .object({ outcome: z.enum(['sent', 'broken', 'failed']) })
  .transform(({ outcome }): SlackTestResult => outcome);

export function slackWebhookWire(url: string) {
  return { url: url.trim() };
}
