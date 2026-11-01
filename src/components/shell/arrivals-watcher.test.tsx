import { act, cleanup } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ArrivalsReport } from '@/domain/arrivals';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { MessagesProvider } from '@/i18n/messages-provider';
import { seenMarksKey } from '@/lib/seen-marks';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { activeVisits, arrivalNews, noteScreenRead, openScreenNews } from './arrival-news';
import { ARRIVALS_POLL_MS, IDLE_STOP_MS, MIN_POLL_GAP_MS } from './arrivals-poller';
import ArrivalsWatcher from './arrivals-watcher';

const navigation = vi.hoisted(() => ({ pathname: '/p-store/overview', search: 'range=7d' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const NOW = Date.parse('2026-10-23T15:00:00.000Z');
const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const NOTHING = { times: [], more: false };

function report(asOf: number, changes: Partial<ArrivalsReport> = {}): ArrivalsReport {
  return {
    asOf,
    activeVisits: 1,
    visits: { times: [NOW - MINUTE], more: false },
    conversions: null,
    namedEvents: NOTHING,
    failedRequests: NOTHING,
    ...changes,
  };
}

const LATER = report(NOW + ARRIVALS_POLL_MS, {
  visits: { times: [NOW + 20 * SECOND, NOW - MINUTE], more: false },
  namedEvents: { times: [NOW + 10 * SECOND], more: false },
  failedRequests: {
    times: Array.from({ length: 100 }, (_, index) => NOW + 25 * SECOND - index),
    more: true,
  },
});

let answers: ArrivalsReport[] = [];
const fetchMock = vi.fn<typeof fetch>(() =>
  Promise.resolve(Response.json(answers.shift() ?? report(Date.now()))),
);

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
}

function watch() {
  return renderWithMessages(
    <ArrivalsWatcher projectId="p-store" timeZone="America/Sao_Paulo" serverNow={NOW} />,
  );
}

async function pass(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function askedUrl(call: number): URL {
  const input = fetchMock.mock.calls[call]?.[0];
  if (typeof input !== 'string') {
    throw new Error(`call ${String(call)} did not ask an address`);
  }
  return new URL(input, 'https://pyxis.example.com');
}

describe('ArrivalsWatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    vi.setSystemTime(NOW);
    vi.stubGlobal('fetch', fetchMock);
    setVisibility('visible');
    navigation.pathname = '/p-store/overview';
    navigation.search = 'range=7d';
    answers = [];
    fetchMock.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('asks the dashboard at once what arrived in the period, without following a redirect', async () => {
    answers = [report(NOW)];
    watch();
    await pass(0);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = askedUrl(0);
    expect(url.pathname).toBe('/p-store/arrivals');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      from: '2026-10-17',
      to: '2026-10-23',
      since: new Date(NOW).toISOString(),
    });
    expect(fetchMock.mock.calls[0]?.[1]).toEqual({ cache: 'no-store', redirect: 'manual' });
  });

  it('shows nothing on a first visit, then counts what arrives after it on every other screen', async () => {
    answers = [report(NOW), LATER];
    watch();
    await pass(0);

    expect(arrivalNews()).toEqual({});
    expect(openScreenNews()).toBeUndefined();

    await pass(ARRIVALS_POLL_MS);

    expect(arrivalNews()).toEqual({
      visits: { shown: '1', label: '1 new visit' },
      devices: { shown: '1', label: '1 new visit' },
      acquisition: { shown: '1', label: '1 new visit' },
      features: { shown: '1', label: '1 new event' },
      requests: { shown: '99+', label: 'More than 99 new failed requests' },
    });
  });

  it('counts apart what arrived for the screen being shown, until its next read', async () => {
    answers = [report(NOW), LATER];
    watch();
    await pass(ARRIVALS_POLL_MS);

    expect(openScreenNews()).toEqual({ screen: 'overview', shown: '1', label: '1 new visit' });

    act(() => {
      noteScreenRead({ path: '/p-store/overview', search: '', readAt: NOW + ARRIVALS_POLL_MS });
    });

    expect(openScreenNews()).toBeUndefined();
  });

  it('pauses the news of the screen being shown while a dashboard filter is on', async () => {
    navigation.search = 'range=7d&device=mobile';
    answers = [report(NOW), LATER];
    watch();
    await pass(ARRIVALS_POLL_MS);

    expect(openScreenNews()).toBeUndefined();
    expect(arrivalNews().features).toEqual({ shown: '1', label: '1 new event' });
    expect(activeVisits()).toBe(1);
  });

  it('publishes the visits on the site now from each answer', async () => {
    answers = [report(NOW), report(NOW + ARRIVALS_POLL_MS, { activeVisits: 3 })];
    watch();
    await pass(0);

    expect(activeVisits()).toBe(1);

    await pass(ARRIVALS_POLL_MS);

    expect(activeVisits()).toBe(3);
  });

  it('keeps the reads of the screens as their marks, and asks since the oldest one', async () => {
    noteScreenRead({ path: '/p-store/overview', search: '', readAt: NOW - 5 * MINUTE });
    noteScreenRead({ path: '/p-store/settings', search: '', readAt: NOW - 10 * MINUTE });
    watch();
    await pass(0);

    expect(askedUrl(0).searchParams.get('since')).toBe(new Date(NOW - 5 * MINUTE).toISOString());

    noteScreenRead({ path: '/p-store/funnel', search: '', readAt: NOW + SECOND });

    expect(JSON.parse(window.localStorage.getItem(seenMarksKey('p-store')) ?? '{}')).toMatchObject({
      overview: NOW - 5 * MINUTE,
      funnel: NOW + SECOND,
    });
  });

  it('asks again soon after a change of screen, never within five seconds', async () => {
    const view = watch();
    await pass(0);

    navigation.pathname = '/p-store/funnel';
    view.rerender(
      <ArrivalsWatcher projectId="p-store" timeZone="America/Sao_Paulo" serverNow={NOW} />,
    );
    await pass(MIN_POLL_GAP_MS - 1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await pass(1);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('asks nothing and shows nothing for a period that does not include today', async () => {
    navigation.search = 'from=2026-09-01&to=2026-09-30';
    watch();
    await pass(ARRIVALS_POLL_MS * 2);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(arrivalNews()).toEqual({});
    expect(openScreenNews()).toBeUndefined();
    expect(activeVisits()).toBeUndefined();
  });

  it('asks nothing while the tab is hidden, and asks at once when it shows', async () => {
    setVisibility('hidden');
    watch();
    await pass(ARRIVALS_POLL_MS * 2);
    expect(fetchMock).not.toHaveBeenCalled();

    setVisibility('visible');
    document.dispatchEvent(new Event('visibilitychange'));
    await pass(0);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('stops asking after thirty idle minutes, and asks at once on the next key', async () => {
    watch();
    await pass(IDLE_STOP_MS + ARRIVALS_POLL_MS);
    const asked = fetchMock.mock.calls.length;
    await pass(ARRIVALS_POLL_MS * 2);
    expect(fetchMock).toHaveBeenCalledTimes(asked);

    window.dispatchEvent(new KeyboardEvent('keydown'));
    await pass(0);

    expect(fetchMock).toHaveBeenCalledTimes(asked + 1);
  });

  it('clears the news and stops listening once it is gone', async () => {
    answers = [report(NOW), LATER];
    const view = watch();
    await pass(ARRIVALS_POLL_MS);
    expect(arrivalNews()).not.toEqual({});
    expect(openScreenNews()).toBeDefined();

    view.unmount();
    document.dispatchEvent(new Event('visibilitychange'));
    await pass(ARRIVALS_POLL_MS * 2);

    expect(arrivalNews()).toEqual({});
    expect(openScreenNews()).toBeUndefined();
    expect(activeVisits()).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('draws nothing on the server', () => {
    expect(
      renderToString(
        <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
          <ArrivalsWatcher projectId="p-store" timeZone="America/Sao_Paulo" serverNow={NOW} />
        </MessagesProvider>,
      ),
    ).toBe('');
  });
});
