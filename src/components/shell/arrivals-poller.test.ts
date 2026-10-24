import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ArrivalsReport } from '@/domain/arrivals';
import type { ArrivalsAnswer } from './arrivals-answer';
import {
  ARRIVALS_POLL_MS,
  IDLE_STOP_MS,
  isIdle,
  MAX_RETRY_MS,
  MIN_POLL_GAP_MS,
  retryDelay,
  startArrivalsPoller,
  waitBeforeAsking,
} from './arrivals-poller';

const START = Date.parse('2026-10-23T12:00:00Z');
const REPORT: ArrivalsReport = {
  asOf: START,
  activeVisits: 1,
  visits: { times: [], more: false },
  conversions: null,
  namedEvents: { times: [], more: false },
  failedRequests: { times: [], more: false },
};
const ANSWERED: ArrivalsAnswer = { kind: 'report', report: REPORT };

async function pass(milliseconds: number) {
  await vi.advanceTimersByTimeAsync(milliseconds);
}

describe('the polling rules', () => {
  it('doubles the wait after a failure, up to five minutes', () => {
    expect(retryDelay(ARRIVALS_POLL_MS)).toBe(60_000);
    expect(retryDelay(240_000)).toBe(MAX_RETRY_MS);
    expect(retryDelay(MAX_RETRY_MS)).toBe(MAX_RETRY_MS);
  });

  it('never asks twice within five seconds', () => {
    expect(waitBeforeAsking(undefined, START)).toBe(0);
    expect(waitBeforeAsking(START, START + 2_000)).toBe(3_000);
    expect(waitBeforeAsking(START, START + MIN_POLL_GAP_MS + 1)).toBe(0);
  });

  it('calls the dashboard idle after thirty minutes without a touch', () => {
    expect(isIdle(START, START + IDLE_STOP_MS - 1)).toBe(false);
    expect(isIdle(START, START + IDLE_STOP_MS)).toBe(true);
  });
});

describe('startArrivalsPoller', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    vi.setSystemTime(START);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('asks at once, then every thirty seconds, handing over each report', async () => {
    const ask = vi.fn(() => Promise.resolve(ANSWERED));
    const onReport = vi.fn();
    const poller = startArrivalsPoller({ ask, onReport, visible: true });

    await pass(0);
    expect(ask).toHaveBeenCalledTimes(1);
    expect(onReport).toHaveBeenCalledWith(REPORT);

    await pass(ARRIVALS_POLL_MS - 1);
    expect(ask).toHaveBeenCalledTimes(1);
    await pass(1);
    expect(ask).toHaveBeenCalledTimes(2);

    poller.stop();
    await pass(ARRIVALS_POLL_MS * 3);
    expect(ask).toHaveBeenCalledTimes(2);
  });

  it('asks nothing while the tab is hidden, and asks at once when it shows again', async () => {
    const ask = vi.fn(() => Promise.resolve(ANSWERED));
    const poller = startArrivalsPoller({ ask, onReport: vi.fn(), visible: false });

    await pass(ARRIVALS_POLL_MS * 4);
    expect(ask).not.toHaveBeenCalled();

    poller.setVisible(true);
    await pass(0);
    expect(ask).toHaveBeenCalledTimes(1);

    poller.setVisible(false);
    await pass(ARRIVALS_POLL_MS * 4);
    expect(ask).toHaveBeenCalledTimes(1);
  });

  it('asks again soon after a change of screen, but never closer than five seconds', async () => {
    const ask = vi.fn(() => Promise.resolve(ANSWERED));
    const poller = startArrivalsPoller({ ask, onReport: vi.fn(), visible: true });
    await pass(0);

    await pass(2_000);
    poller.askSoon();
    await pass(2_999);
    expect(ask).toHaveBeenCalledTimes(1);
    await pass(1);
    expect(ask).toHaveBeenCalledTimes(2);
  });

  it('asks once more after an answer that was still on its way when the screen changed', async () => {
    let answer: (value: ArrivalsAnswer) => void = () => undefined;
    const ask = vi.fn(
      () =>
        new Promise<ArrivalsAnswer>((resolve) => {
          answer = resolve;
        }),
    );
    const poller = startArrivalsPoller({ ask, onReport: vi.fn(), visible: true });
    await pass(0);

    poller.askSoon();
    await pass(MIN_POLL_GAP_MS);
    expect(ask).toHaveBeenCalledTimes(1);

    answer(ANSWERED);
    await pass(0);
    expect(ask).toHaveBeenCalledTimes(2);
  });

  it('stops after thirty minutes without a touch, and asks at once on the next one', async () => {
    const ask = vi.fn(() => Promise.resolve(ANSWERED));
    const poller = startArrivalsPoller({ ask, onReport: vi.fn(), visible: true });
    await pass(0);

    await pass(IDLE_STOP_MS + ARRIVALS_POLL_MS * 4);
    const askedWhileIdle = ask.mock.calls.length;
    expect(askedWhileIdle).toBe(IDLE_STOP_MS / ARRIVALS_POLL_MS);

    await pass(ARRIVALS_POLL_MS * 4);
    expect(ask).toHaveBeenCalledTimes(askedWhileIdle);

    poller.noteActivity();
    await pass(0);
    expect(ask).toHaveBeenCalledTimes(askedWhileIdle + 1);

    poller.noteActivity();
    await pass(0);
    expect(ask).toHaveBeenCalledTimes(askedWhileIdle + 1);
  });

  it('stops for good once the session is gone', async () => {
    const ask = vi.fn(() => Promise.resolve<ArrivalsAnswer>({ kind: 'signed-out' }));
    const poller = startArrivalsPoller({ ask, onReport: vi.fn(), visible: true });
    await pass(0);

    poller.askSoon();
    poller.setVisible(true);
    poller.noteActivity();
    await pass(ARRIVALS_POLL_MS * 4);

    expect(ask).toHaveBeenCalledTimes(1);
  });

  it('waits twice as long after each refusal or failure, logging what it swallowed', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const answers: (() => Promise<ArrivalsAnswer>)[] = [
      () => Promise.resolve({ kind: 'refused', status: 429 }),
      () => Promise.reject(new TypeError('Failed to fetch')),
      () => Promise.resolve(ANSWERED),
    ];
    const ask = vi.fn(() => (answers.shift() ?? (() => Promise.resolve(ANSWERED)))());
    startArrivalsPoller({ ask, onReport: vi.fn(), visible: true });
    await pass(0);

    expect(warn).toHaveBeenCalledWith('arrivals: the dashboard answered 429; asking again later');
    await pass(60_000 - 1);
    expect(ask).toHaveBeenCalledTimes(1);
    await pass(1);
    expect(ask).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledWith(
      'arrivals: could not ask what arrived; asking again later',
      expect.any(TypeError),
    );

    await pass(120_000);
    expect(ask).toHaveBeenCalledTimes(3);
    await pass(ARRIVALS_POLL_MS);
    expect(ask).toHaveBeenCalledTimes(4);
  });

  it('drops an answer that arrives after it was stopped', async () => {
    let answer: (value: ArrivalsAnswer) => void = () => undefined;
    const ask = vi.fn(
      () =>
        new Promise<ArrivalsAnswer>((resolve) => {
          answer = resolve;
        }),
    );
    const onReport = vi.fn();
    const poller = startArrivalsPoller({ ask, onReport, visible: true });
    await pass(0);

    poller.stop();
    answer(ANSWERED);
    await pass(ARRIVALS_POLL_MS);

    expect(onReport).not.toHaveBeenCalled();
  });
});
