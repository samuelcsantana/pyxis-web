import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { fakeSdk, SAMPLE_BATCH, startedMeasurement } from '@/test-utils/fake-measurement';
import { portuguese } from '@/test-utils/portuguese';
import { LANDING_EVENTS, trackAttributes } from './landing-events';
import {
  createMeasurement,
  landingMeasurement,
  recordedEventOf,
  trackedClickOf,
} from './landing-measurement';
import { measurementLabelsOf, recordedLabelsOf } from './measurement-labels';

const PAGE_VIEW = {
  id: 'event-1',
  name: 'page_view',
  occurred_at: '2026-10-13T18:00:00.000Z',
  session_id: '9ec8bf39-1111-4222-8333-944455556666',
  path: '/',
  attribution: { from_ad_click: false },
};

describe('createMeasurement', () => {
  it('starts the tracker once, with the key, the endpoint and a hook on every batch', () => {
    const sdk = fakeSdk();
    const measurement = createMeasurement(sdk);
    const listener = vi.fn();
    measurement.subscribe(listener);

    measurement.start('pyxis_pk_home', 'https://api.pyxis-analytics.dev');
    measurement.start('pyxis_pk_other', 'https://elsewhere.example');

    expect(sdk.calls.init).toHaveLength(1);
    expect(sdk.calls.init[0]).toMatchObject({
      key: 'pyxis_pk_home',
      endpoint: 'https://api.pyxis-analytics.dev',
    });
    expect(measurement.status()).toBe('on');
    expect(listener).toHaveBeenCalledOnce();
  });

  it('starts with the referrer carried from the page that moved the visitor here', () => {
    const sdk = fakeSdk();
    const measurement = createMeasurement(sdk, () => 'https://www.linkedin.com/');

    measurement.start('pyxis_pk_home', 'https://api.pyxis-analytics.dev');

    expect(sdk.calls.init[0]).toMatchObject({ referrer: 'https://www.linkedin.com/' });
  });

  it("leaves the document's referrer to the tracker when nothing was carried", () => {
    const sdk = fakeSdk();
    const measurement = createMeasurement(sdk, () => undefined);

    measurement.start('pyxis_pk_home', 'https://api.pyxis-analytics.dev');

    expect(sdk.calls.init[0]).not.toHaveProperty('referrer');
  });

  it('keeps every event the tracker sends, newest first', () => {
    const sdk = fakeSdk();
    const measurement = startedMeasurement(sdk);

    sdk.sendBatch(SAMPLE_BATCH);
    sdk.sendBatch({ ...SAMPLE_BATCH, events: [{ ...PAGE_VIEW, id: 'event-3' }] });

    expect(measurement.events().map((event) => event.id)).toEqual([
      'event-3',
      'event-2',
      'event-1',
    ]);
  });

  it('stops and resumes measuring, telling its listeners each time', () => {
    const sdk = fakeSdk();
    const measurement = startedMeasurement(sdk);
    const listener = vi.fn();
    const unsubscribe = measurement.subscribe(listener);

    measurement.stop();
    expect(measurement.status()).toBe('opted-out');
    measurement.resume();
    expect(measurement.status()).toBe('on');
    unsubscribe();
    measurement.stop();

    expect(sdk.calls.optOut).toBe(2);
    expect(sdk.calls.optIn).toBe(1);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('opens and closes the list of what was recorded, and records a named event', () => {
    const sdk = fakeSdk();
    const measurement = startedMeasurement(sdk);

    measurement.setDrawerOpen(true);
    expect(measurement.drawerOpen()).toBe(true);
    measurement.record('demo_opened', { from: 'hero' });

    expect(sdk.calls.track).toEqual([['demo_opened', { from: 'hero' }]]);
  });

  it('is shared by the page, starting with nothing known', () => {
    expect(landingMeasurement.status()).toBeNull();
    expect(landingMeasurement.events()).toEqual([]);
  });
});

describe('recordedEventOf', () => {
  it('keeps the name, the path and the properties as text', () => {
    expect(
      recordedEventOf({
        id: 'e',
        name: 'snippet_copied',
        occurred_at: '2026-10-13T18:00:00.000Z',
        session_id: 's',
        path: '/pt-br',
        properties: { snippet: 'install-command', count: 2, first: true },
      }),
    ).toEqual({
      id: 'e',
      name: 'snippet_copied',
      occurredAt: '2026-10-13T18:00:00.000Z',
      sessionId: 's',
      path: '/pt-br',
      properties: [
        ['snippet', 'install-command'],
        ['count', '2'],
        ['first', 'true'],
      ],
      referrerHost: undefined,
    });
  });

  it('says where the visit came from only on the event that carries it', () => {
    expect(recordedEventOf(PAGE_VIEW).referrerHost).toBeNull();
    expect(
      recordedEventOf({
        ...PAGE_VIEW,
        attribution: { from_ad_click: false, referrer_host: 'www.linkedin.com' },
      }).referrerHost,
    ).toBe('www.linkedin.com');
  });
});

describe('trackedClickOf', () => {
  it('reads the event and its properties from the data-track attributes', () => {
    const link = document.createElement('a');
    for (const [name, value] of Object.entries(
      trackAttributes(LANDING_EVENTS.demoOpened, { from: 'screens', screen: 'funnel' }),
    )) {
      link.setAttribute(name, value);
    }
    link.dataset.trackScreenName = 'Funnel';

    expect(trackedClickOf(link)).toEqual({
      name: 'demo_opened',
      properties: { from: 'screens', screen: 'funnel', screen_name: 'Funnel' },
    });
  });

  it('reads nothing from an element that names no event', () => {
    expect(trackedClickOf(document.createElement('a'))).toBeNull();
  });
});

describe('trackAttributes', () => {
  it('writes the event and each property as data attributes', () => {
    expect(trackAttributes(LANDING_EVENTS.postOpened)).toEqual({ 'data-track': 'post_opened' });
    expect(trackAttributes(LANDING_EVENTS.languageSwitched, { to: 'pt-BR' })).toEqual({
      'data-track': 'language_switched',
      'data-track-to': 'pt-BR',
    });
  });
});

describe('measurement labels', () => {
  it('words the footer note and the recorded list, leaving the per-visit parts to fill', () => {
    expect(measurementLabelsOf(english)).toMatchObject({
      optOut: 'Don’t measure my visits',
      see: 'See what it recorded',
    });
    expect(recordedLabelsOf(portuguese)).toMatchObject({
      visit: 'Visita {id}… · só esta aba',
      referrer: 'origem: {host}',
      close: 'Fechar',
    });
  });
});
