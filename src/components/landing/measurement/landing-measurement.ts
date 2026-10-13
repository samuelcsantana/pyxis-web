import {
  type Batch,
  type BatchEvent,
  init,
  optIn,
  optOut,
  type Properties,
  track,
  trackingStatus,
  type TrackingStatus,
} from 'pyxis-analytics';

export interface RecordedEvent {
  readonly id: string;
  readonly name: string;
  readonly occurredAt: string;
  readonly sessionId: string;
  readonly path: string;
  readonly properties: readonly (readonly [string, string])[];
  readonly referrerHost: string | null | undefined;
}

export interface PyxisSdk {
  readonly init: typeof init;
  readonly track: typeof track;
  readonly optIn: typeof optIn;
  readonly optOut: typeof optOut;
  readonly trackingStatus: typeof trackingStatus;
}

export interface Measurement {
  readonly start: (key: string, endpoint: string) => void;
  readonly events: () => readonly RecordedEvent[];
  readonly status: () => TrackingStatus | null;
  readonly drawerOpen: () => boolean;
  readonly setDrawerOpen: (open: boolean) => void;
  readonly stop: () => void;
  readonly resume: () => void;
  readonly record: (name: string, properties: Properties) => void;
  readonly subscribe: (listener: () => void) => () => void;
}

export function recordedEventOf(event: BatchEvent): RecordedEvent {
  return {
    id: event.id,
    name: event.name,
    occurredAt: event.occurred_at,
    sessionId: event.session_id,
    path: event.path,
    properties: Object.entries(event.properties ?? {}).map(
      ([key, value]) => [key, String(value)] as const,
    ),
    referrerHost:
      event.attribution === undefined ? undefined : (event.attribution.referrer_host ?? null),
  };
}

export function createMeasurement(sdk: PyxisSdk): Measurement {
  let started = false;
  let events: readonly RecordedEvent[] = [];
  let status: TrackingStatus | null = null;
  let open = false;
  const listeners = new Set<() => void>();
  const notify = () => {
    listeners.forEach((listener) => {
      listener();
    });
  };
  const refreshStatus = () => {
    status = sdk.trackingStatus();
    notify();
  };
  const remember = (batch: Batch) => {
    events = [...batch.events.map(recordedEventOf).toReversed(), ...events];
    notify();
  };
  return {
    start: (key, endpoint) => {
      if (started) {
        return;
      }
      started = true;
      sdk.init({ key, endpoint, debug: { onBatch: remember } });
      refreshStatus();
    },
    events: () => events,
    status: () => status,
    drawerOpen: () => open,
    setDrawerOpen: (next) => {
      open = next;
      notify();
    },
    stop: () => {
      sdk.optOut();
      refreshStatus();
    },
    resume: () => {
      sdk.optIn();
      refreshStatus();
    },
    record: (name, properties) => {
      sdk.track(name, properties);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const landingMeasurement = createMeasurement({
  init,
  track,
  optIn,
  optOut,
  trackingStatus,
});

const TRACK_PREFIX = 'track';

function propertyKeyOf(datasetKey: string): string {
  return datasetKey
    .slice(TRACK_PREFIX.length)
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .slice(1);
}

export interface TrackedClick {
  readonly name: string;
  readonly properties: Properties;
}

export function trackedClickOf(element: HTMLElement): TrackedClick | null {
  const name = element.dataset.track;
  if (name === undefined) {
    return null;
  }
  const properties = Object.fromEntries(
    Object.entries(element.dataset)
      .filter(([key]) => key.startsWith(TRACK_PREFIX) && key !== TRACK_PREFIX)
      .map(([key, value]) => [propertyKeyOf(key), String(value)]),
  );
  return { name, properties };
}
