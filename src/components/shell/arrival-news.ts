import type { ScreenSlug } from './screens';

export interface ScreenNews {
  readonly shown: string;
  readonly label: string;
}

export type ArrivalNews = Readonly<Partial<Record<ScreenSlug, ScreenNews>>>;

export interface OpenScreenNews extends ScreenNews {
  readonly screen: ScreenSlug;
}

export interface ScreenReadNote {
  readonly path: string;
  readonly readAt: number;
}

type Listener = () => void;

interface ValueStore<Value> {
  readonly subscribe: (listener: Listener) => () => void;
  readonly current: () => Value;
  readonly publish: (next: Value) => void;
}

const NO_NEWS: ArrivalNews = {};
const readListeners = new Set<Listener>();
const pendingReads: ScreenReadNote[] = [];

function listenTo(listeners: Set<Listener>, listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(listeners: ReadonlySet<Listener>) {
  for (const listener of listeners) {
    listener();
  }
}

function valueStore<Value>(initial: Value): ValueStore<Value> {
  const listeners = new Set<Listener>();
  let value = initial;
  return {
    subscribe: (listener) => listenTo(listeners, listener),
    current: () => value,
    publish: (next) => {
      value = next;
      notify(listeners);
    },
  };
}

const newsStore = valueStore(NO_NEWS);
const openNewsStore = valueStore<OpenScreenNews | undefined>(undefined);

export const subscribeToArrivalNews = newsStore.subscribe;
export const arrivalNews = newsStore.current;
export const publishArrivalNews = newsStore.publish;

export function noArrivalNews(): ArrivalNews {
  return NO_NEWS;
}

export const subscribeToOpenScreenNews = openNewsStore.subscribe;
export const openScreenNews = openNewsStore.current;
export const publishOpenScreenNews = openNewsStore.publish;

export function noOpenScreenNews(): undefined {
  return undefined;
}

const activeVisitsStore = valueStore<number | undefined>(undefined);

export const subscribeToActiveVisits = activeVisitsStore.subscribe;
export const activeVisits = activeVisitsStore.current;
export const publishActiveVisits = activeVisitsStore.publish;

export function noteScreenRead(note: ScreenReadNote): void {
  pendingReads.push(note);
  notify(readListeners);
}

export function subscribeToScreenReads(listener: Listener): () => void {
  return listenTo(readListeners, listener);
}

export function takeScreenReads(): readonly ScreenReadNote[] {
  return pendingReads.splice(0);
}
