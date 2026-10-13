import type {
  Batch,
  Properties,
  PyxisDebugOptions,
  PyxisOptions,
  TrackingStatus,
} from 'pyxis-analytics';
import {
  createMeasurement,
  type Measurement,
  type PyxisSdk,
} from '@/components/landing/measurement/landing-measurement';

export interface FakeSdkCalls {
  readonly init: PyxisOptions[];
  readonly track: (readonly [string, Properties | undefined])[];
  optIn: number;
  optOut: number;
}

export interface FakeSdk extends PyxisSdk {
  readonly calls: FakeSdkCalls;
  readonly sendBatch: (batch: Batch) => void;
}

export function fakeSdk(initialStatus: TrackingStatus = 'on'): FakeSdk {
  let status = initialStatus;
  const receivers: ((batch: Batch) => void)[] = [];
  const calls: FakeSdkCalls = { init: [], track: [], optIn: 0, optOut: 0 };
  return {
    calls,
    init: (options) => {
      calls.init.push(options);
      receivers.push((options.debug as Required<PyxisDebugOptions>).onBatch);
    },
    track: (name, properties) => {
      calls.track.push([name, properties]);
    },
    optIn: () => {
      calls.optIn += 1;
      status = 'on';
    },
    optOut: () => {
      calls.optOut += 1;
      status = 'opted-out';
    },
    trackingStatus: () => status,
    sendBatch: (batch) => {
      receivers.forEach((receive) => {
        receive(batch);
      });
    },
  };
}

export function startedMeasurement(sdk: FakeSdk): Measurement {
  const measurement = createMeasurement(sdk);
  measurement.start('pyxis_pk_home', 'https://api.pyxis-analytics.dev');
  return measurement;
}

export const SAMPLE_BATCH: Batch = {
  key: 'pyxis_pk_home',
  sent_at: '2026-10-13T18:00:05.000Z',
  events: [
    {
      id: 'event-1',
      name: 'page_view',
      occurred_at: '2026-10-13T18:00:00.000Z',
      session_id: '9ec8bf39-1111-4222-8333-944455556666',
      path: '/',
      attribution: { from_ad_click: false },
    },
    {
      id: 'event-2',
      name: 'demo_opened',
      occurred_at: '2026-10-13T18:00:03.000Z',
      session_id: '9ec8bf39-1111-4222-8333-944455556666',
      path: '/',
      properties: { from: 'hero' },
    },
  ],
};
