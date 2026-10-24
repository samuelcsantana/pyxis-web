import { browserSeenMarksStorage, SEEN_MARKS_PREFIX, type SeenMarksStorage } from './seen-marks';

export const MAX_SHOWN_READS = 50;

export type NumberValues = Readonly<Record<string, number>>;

export interface NumbersRead {
  readonly readAt: number;
  readonly values: NumberValues;
}

export interface ShownRead {
  readonly to: string;
  readonly current: NumbersRead;
  readonly previous?: NumbersRead;
}

export type ShownReads = Readonly<Record<string, ShownRead>>;

export interface Comparison {
  readonly against: NumbersRead;
  readonly arrived: boolean;
}

export interface ShownReadsUpdate {
  readonly reads: ShownReads;
  readonly comparison: Comparison | undefined;
}

export interface ShownRequest {
  readonly key: string;
  readonly to: string;
  readonly read: NumbersRead;
  readonly today: string;
}

export interface ShownNumbersStore {
  readonly compare: (request: ShownRequest) => Comparison | undefined;
}

type Fields = Readonly<Record<string, unknown>>;

function isObject(value: unknown): value is Fields {
  return typeof value === 'object' && value !== null;
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function shownNumbersKey(projectId: string): string {
  return `${SEEN_MARKS_PREFIX}numbers:${projectId}`;
}

export function shownReadKey(screen: string, from: string, to: string, search: string): string {
  const parameters = new URLSearchParams(search);
  parameters.sort();
  return [screen, from, to, parameters.toString()].join('|');
}

function numbersReadOf(value: unknown): NumbersRead | undefined {
  if (!isObject(value) || !isCount(value.readAt) || !isObject(value.values)) {
    return undefined;
  }
  const values = Object.fromEntries(
    Object.entries(value.values).filter((entry): entry is [string, number] => isCount(entry[1])),
  );
  return { readAt: value.readAt, values };
}

function shownReadOf(value: unknown): ShownRead | undefined {
  if (!isObject(value) || typeof value.to !== 'string') {
    return undefined;
  }
  const current = numbersReadOf(value.current);
  if (current === undefined) {
    return undefined;
  }
  const previous = numbersReadOf(value.previous);
  return previous === undefined ? { to: value.to, current } : { to: value.to, current, previous };
}

export function parsedShownReads(stored: string | null): ShownReads {
  if (stored === null) {
    return {};
  }
  const value: unknown = JSON.parse(stored);
  if (!isObject(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) => {
      const read = shownReadOf(entry);
      return read === undefined ? [] : [[key, read] as const];
    }),
  );
}

function liveReads(reads: ShownReads, today: string): ShownReads {
  const live = Object.entries(reads)
    .filter(([, read]) => read.to >= today)
    .sort(([, later], [, earlier]) => earlier.current.readAt - later.current.readAt)
    .slice(0, MAX_SHOWN_READS);
  return Object.fromEntries(live);
}

export function nextShownReads(reads: ShownReads, request: ShownRequest): ShownReadsUpdate {
  const { key, to, read, today } = request;
  const live = liveReads(reads, today);
  const stored = live[key];
  if (stored === undefined) {
    return { reads: { ...live, [key]: { to, current: read } }, comparison: undefined };
  }
  if (read.readAt > stored.current.readAt) {
    return {
      reads: { ...live, [key]: { to, current: read, previous: stored.current } },
      comparison: { against: stored.current, arrived: true },
    };
  }
  const comparison =
    read.readAt === stored.current.readAt && stored.previous !== undefined
      ? { against: stored.previous, arrived: false }
      : undefined;
  return { reads: live, comparison };
}

export function grewBy(item: string, value: number, against: NumbersRead): number {
  const before = against.values[item];
  return before !== undefined && value > before ? value - before : 0;
}

export function startedAfter(startedAt: number, against: NumbersRead): boolean {
  return startedAt > against.readAt;
}

export function createShownNumbersStore(
  projectId: string,
  storage: () => SeenMarksStorage = browserSeenMarksStorage,
): ShownNumbersStore {
  const key = shownNumbersKey(projectId);
  let memory: ShownReads = {};

  const read = (): ShownReads => {
    try {
      return parsedShownReads(storage().getItem(key));
    } catch (error) {
      console.warn('shown numbers: could not read the numbers kept on this device', error);
      return memory;
    }
  };

  const write = (reads: ShownReads) => {
    memory = reads;
    try {
      storage().setItem(key, JSON.stringify(reads));
    } catch (error) {
      console.warn('shown numbers: could not keep the numbers on this device', error);
    }
  };

  return {
    compare(request) {
      const update = nextShownReads(read(), request);
      write(update.reads);
      return update.comparison;
    },
  };
}
