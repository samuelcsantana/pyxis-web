import { describe, expect, it } from 'vitest';
import { MAX_SLACK_WEBHOOK_LENGTH, slackWebhookProblem } from './slack-webhook';
import {
  slackTestResponseSchema,
  slackWebhookResponseSchema,
  slackWebhookWire,
} from './slack-webhook.schema';

const WEBHOOK = 'https://hooks.slack.com/services/T0001/B0002/abcdefghijklWXYZ';

describe('slackWebhookProblem', () => {
  it('takes a Slack Incoming Webhook address, ignoring the spaces around it', () => {
    expect(slackWebhookProblem(WEBHOOK)).toBeNull();
    expect(slackWebhookProblem(`  ${WEBHOOK}\n`)).toBeNull();
  });

  it('asks for an address when the field is empty', () => {
    expect(slackWebhookProblem('   ')).toBe('missing');
  });

  it.each([
    ['another host', 'https://hooks.slack.com.example.com/services/T0/B0/abcdefghijkl'],
    ['plain HTTP', 'http://hooks.slack.com/services/T0001/B0002/abcdefghijkl'],
    ['a port', 'https://hooks.slack.com:8443/services/T0001/B0002/abcdefghijkl'],
    ['a query', `${WEBHOOK}?x=1`],
    ['another path', 'https://hooks.slack.com/workflows/T0001/B0002/abcdefghijkl'],
    ['a secret too short', 'https://hooks.slack.com/services/T0001/B0002/abc'],
    ['an address too long', `${WEBHOOK}${'x'.repeat(MAX_SLACK_WEBHOOK_LENGTH)}`],
  ])('refuses %s, as the API does', (_, url) => {
    expect(slackWebhookProblem(url)).toBe('invalid');
  });
});

describe('the Slack webhook schemas', () => {
  it('read a masked webhook, a broken one and none', () => {
    expect(
      slackWebhookResponseSchema.parse({
        webhook: {
          masked_url: 'hooks.slack.com/…/WXYZ',
          connected_at: '2026-11-01T12:00:00.000Z',
          broken_at: '2026-11-04T06:00:00.000Z',
          broken_reason: 'channel_not_found',
        },
      }),
    ).toEqual({
      maskedUrl: 'hooks.slack.com/…/WXYZ',
      connectedAt: '2026-11-01T12:00:00.000Z',
      brokenAt: '2026-11-04T06:00:00.000Z',
      brokenReason: 'channel_not_found',
    });
    expect(slackWebhookResponseSchema.parse({ webhook: null })).toBeNull();
  });

  it('read the outcome of a test and write the address trimmed', () => {
    expect(slackTestResponseSchema.parse({ outcome: 'broken' })).toBe('broken');
    expect(slackWebhookWire(` ${WEBHOOK} `)).toEqual({ url: WEBHOOK });
  });
});
