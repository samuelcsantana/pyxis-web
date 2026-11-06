import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ApiNotFoundError,
  ApiRequestError,
  PLAN_REQUIRED_CODE,
  UnauthenticatedError,
} from '@/domain/errors';
import type { ApiReader } from '../api-reader';
import type { ApiWriter } from '../api-writer';
import { HttpSlackWebhookService, SLACK_ERROR_CODES } from './http-slack-webhook-service';
import { demoSlackWebhookWire, MockSlackWebhookService } from './mock-slack-webhook-service';
import { createSlackWebhookService } from './slack-webhook-service.factory';

const NOW = new Date('2026-11-06T12:00:00.000Z');
const PROJECT = 'p/1';
const PATH = '/v1/projects/p%2F1/slack-webhook';
const WEBHOOK_URL = 'https://hooks.slack.com/services/T0001/B0002/abcdefghijklWXYZ';
const WEBHOOK = {
  maskedUrl: 'hooks.slack.com/…/WXYZ',
  connectedAt: NOW.toISOString(),
  brokenAt: null,
  brokenReason: null,
};

function serviceWith(writer: Partial<ApiWriter>, reader: Partial<ApiReader> = {}) {
  return new HttpSlackWebhookService(reader as ApiReader, writer as ApiWriter);
}

function refusal(status: number, code: string | null = null) {
  return new ApiRequestError(PATH, status, code);
}

describe('HttpSlackWebhookService', () => {
  it('reads the masked webhook of the project', async () => {
    const get = vi.fn<(path: string, schema: unknown) => Promise<unknown>>(() =>
      Promise.resolve<unknown>(WEBHOOK),
    );

    await expect(serviceWith({}, { get } as Partial<ApiReader>).webhook(PROJECT)).resolves.toEqual(
      WEBHOOK,
    );
    expect(get.mock.calls[0]?.[0]).toBe(PATH);
  });

  it('puts the address trimmed and answers what was saved', async () => {
    const put = vi.fn<(path: string, body: unknown, schema: unknown) => Promise<unknown>>(() =>
      Promise.resolve<unknown>(WEBHOOK),
    );

    await expect(
      serviceWith({ put } as Partial<ApiWriter>).save(PROJECT, ` ${WEBHOOK_URL} `),
    ).resolves.toEqual({ kind: 'saved', webhook: WEBHOOK });
    expect(put.mock.calls[0]?.slice(0, 2)).toEqual([PATH, { url: WEBHOOK_URL }]);
  });

  it('treats a save that answers no webhook as unavailable', async () => {
    const put = vi.fn(() => Promise.resolve(null));

    await expect(
      serviceWith({ put } as Partial<ApiWriter>).save(PROJECT, WEBHOOK_URL),
    ).resolves.toEqual({
      kind: 'unavailable',
    });
  });

  it.each([
    ['invalid', refusal(400, SLACK_ERROR_CODES.invalid)],
    ['planRequired', refusal(403, PLAN_REQUIRED_CODE)],
    ['planRequired', refusal(409, SLACK_ERROR_CODES.subscriptionRequired)],
    ['unavailable', refusal(503, SLACK_ERROR_CODES.unavailable)],
  ] as const)('answers %s when the API refuses the address', async (kind, failure) => {
    const put = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ put }).save(PROJECT, WEBHOOK_URL)).resolves.toEqual({ kind });
  });

  it('lets any other failure of a save through', async () => {
    const failure = new UnauthenticatedError();
    const put = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ put }).save(PROJECT, WEBHOOK_URL)).rejects.toBe(failure);
  });

  it.each(['sent', 'broken', 'failed'] as const)(
    'posts a test and answers that Slack %s it',
    async (result) => {
      const post = vi.fn<(path: string, body: unknown, schema: unknown) => Promise<unknown>>(() =>
        Promise.resolve<unknown>(result),
      );

      await expect(serviceWith({ post } as Partial<ApiWriter>).test(PROJECT)).resolves.toEqual({
        kind: 'tested',
        result,
      });
      expect(post.mock.calls[0]?.slice(0, 2)).toEqual([`${PATH}/test`, {}]);
    },
  );

  it.each([
    ['tooMany', refusal(429, 'rate_limited')],
    ['planRequired', refusal(403, PLAN_REQUIRED_CODE)],
    ['planRequired', refusal(409, SLACK_ERROR_CODES.subscriptionRequired)],
    ['unavailable', refusal(503, SLACK_ERROR_CODES.unavailable)],
    ['missing', new ApiNotFoundError(PATH)],
  ] as const)('answers %s when the API refuses the test', async (kind, failure) => {
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).test(PROJECT)).resolves.toEqual({ kind });
  });

  it('lets any other failure of a test through', async () => {
    const failure = refusal(500);
    const post = vi.fn(() => Promise.reject(failure));

    await expect(serviceWith({ post }).test(PROJECT)).rejects.toBe(failure);
  });

  it('removes the webhook, a missing one counting as removed', async () => {
    const remove = vi.fn<ApiWriter['delete']>(() => Promise.resolve());
    const gone = vi.fn(() => Promise.reject(new ApiNotFoundError(PATH)));
    const failure = new UnauthenticatedError();
    const ended = vi.fn(() => Promise.reject(failure));

    await serviceWith({ delete: remove }).remove(PROJECT);
    await expect(serviceWith({ delete: gone }).remove(PROJECT)).resolves.toBeUndefined();
    await expect(serviceWith({ delete: ended }).remove(PROJECT)).rejects.toBe(failure);
    expect(remove).toHaveBeenCalledWith(PATH);
  });
});

describe('MockSlackWebhookService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows an invented working webhook, connected twelve days ago', async () => {
    await expect(new MockSlackWebhookService(() => NOW).webhook()).resolves.toEqual({
      maskedUrl: 'hooks.slack.com/…/9XQZ',
      connectedAt: '2026-10-25T12:00:00.000Z',
      brokenAt: null,
      brokenReason: null,
    });
    expect(demoSlackWebhookWire(NOW).webhook.masked_url).toBe('hooks.slack.com/…/9XQZ');
  });

  it('saves only the masked form of a pasted address, tests as sent and removes nothing', async () => {
    const service = new MockSlackWebhookService(() => NOW);

    await expect(service.save(PROJECT, ` ${WEBHOOK_URL} `)).resolves.toEqual({
      kind: 'saved',
      webhook: WEBHOOK,
    });
    await expect(service.test()).resolves.toEqual({ kind: 'tested', result: 'sent' });
    await expect(service.remove()).resolves.toBeUndefined();
  });

  it('reads the current time when given no clock', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);

    await expect(new MockSlackWebhookService().webhook()).resolves.toMatchObject({
      connectedAt: '2026-10-25T12:00:00.000Z',
    });
  });
});

describe('createSlackWebhookService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('talks to the API when its WEBHOOK_URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(createSlackWebhookService()).toBeInstanceOf(HttpSlackWebhookService);
  });

  it('uses the demo service without an API WEBHOOK_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    expect(createSlackWebhookService()).toBeInstanceOf(MockSlackWebhookService);
  });
});
