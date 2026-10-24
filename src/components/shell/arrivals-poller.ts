import type { ArrivalsReport } from '@/domain/arrivals';
import type { ArrivalsAnswer } from './arrivals-answer';

export const ARRIVALS_POLL_MS = 30_000;
export const MIN_POLL_GAP_MS = 5_000;
export const IDLE_STOP_MS = 30 * 60_000;
export const MAX_RETRY_MS = 5 * 60_000;

export interface ArrivalsPollerOptions {
  readonly ask: () => Promise<ArrivalsAnswer>;
  readonly onReport: (report: ArrivalsReport) => void;
  readonly visible: boolean;
  readonly now?: () => number;
}

export interface ArrivalsPoller {
  readonly askSoon: () => void;
  readonly setVisible: (visible: boolean) => void;
  readonly noteActivity: () => void;
  readonly stop: () => void;
}

export function retryDelay(previous: number): number {
  return Math.min(previous * 2, MAX_RETRY_MS);
}

export function waitBeforeAsking(lastAskedAt: number | undefined, now: number): number {
  return lastAskedAt === undefined ? 0 : Math.max(0, lastAskedAt + MIN_POLL_GAP_MS - now);
}

export function isIdle(lastActivityAt: number, now: number): boolean {
  return now - lastActivityAt >= IDLE_STOP_MS;
}

export function startArrivalsPoller({
  ask,
  onReport,
  visible: visibleAtStart,
  now = Date.now,
}: ArrivalsPollerOptions): ArrivalsPoller {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastAskedAt: number | undefined;
  let lastActivityAt = now();
  let wait = ARRIVALS_POLL_MS;
  let visible = visibleAtStart;
  let idle = false;
  let signedOut = false;
  let stopped = false;
  let asking = false;
  let askAgain = false;

  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };

  const schedule = (delay: number) => {
    cancel();
    if (!stopped && !signedOut && visible && !idle) {
      timer = setTimeout(askNow, delay);
    }
  };

  const askSoon = () => {
    if (asking) {
      askAgain = true;
      return;
    }
    schedule(waitBeforeAsking(lastAskedAt, now()));
  };

  const settle = (answer: ArrivalsAnswer) => {
    switch (answer.kind) {
      case 'report':
        wait = ARRIVALS_POLL_MS;
        onReport(answer.report);
        schedule(ARRIVALS_POLL_MS);
        return;
      case 'signed-out':
        signedOut = true;
        return;
      case 'refused':
        wait = retryDelay(wait);
        console.warn(
          `arrivals: the dashboard answered ${String(answer.status)}; asking again later`,
        );
        schedule(wait);
    }
  };

  const tryPollArrivals = async () => {
    asking = true;
    lastAskedAt = now();
    try {
      const answer = await ask();
      if (!stopped) {
        settle(answer);
      }
    } catch (error) {
      wait = retryDelay(wait);
      console.warn('arrivals: could not ask what arrived; asking again later', error);
      schedule(wait);
    } finally {
      asking = false;
      if (askAgain) {
        askAgain = false;
        askSoon();
      }
    }
  };

  function askNow() {
    timer = undefined;
    if (isIdle(lastActivityAt, now())) {
      idle = true;
      return;
    }
    void tryPollArrivals();
  }

  askSoon();

  return {
    askSoon,
    setVisible(nowVisible) {
      visible = nowVisible;
      if (nowVisible) {
        askSoon();
      } else {
        cancel();
      }
    },
    noteActivity() {
      lastActivityAt = now();
      if (idle) {
        idle = false;
        askSoon();
      }
    },
    stop() {
      stopped = true;
      cancel();
    },
  };
}
