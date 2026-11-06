export const SLACK_WEBHOOK_PATTERN =
  /^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]{2,32}\/[A-Z0-9]{2,32}\/[A-Za-z0-9]{8,64}$/;
export const MAX_SLACK_WEBHOOK_LENGTH = 256;
export const SLACK_WEBHOOK_DOCS_URL = 'https://api.slack.com/messaging/webhooks';

export interface SlackWebhook {
  readonly maskedUrl: string;
  readonly connectedAt: string;
  readonly brokenAt: string | null;
  readonly brokenReason: string | null;
}

export type SlackWebhookProblem = 'missing' | 'invalid';

export type SaveSlackWebhookOutcome =
  | { readonly kind: 'saved'; readonly webhook: SlackWebhook }
  | { readonly kind: 'invalid' }
  | { readonly kind: 'planRequired' }
  | { readonly kind: 'unavailable' };

export type SlackTestResult = 'sent' | 'broken' | 'failed';

export type TestSlackWebhookOutcome =
  | { readonly kind: 'tested'; readonly result: SlackTestResult }
  | { readonly kind: 'tooMany' }
  | { readonly kind: 'planRequired' }
  | { readonly kind: 'missing' }
  | { readonly kind: 'unavailable' };

export function slackWebhookProblem(candidate: string): SlackWebhookProblem | null {
  const url = candidate.trim();
  if (url === '') {
    return 'missing';
  }
  return url.length <= MAX_SLACK_WEBHOOK_LENGTH && SLACK_WEBHOOK_PATTERN.test(url)
    ? null
    : 'invalid';
}
