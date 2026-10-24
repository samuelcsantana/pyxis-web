import { browserSeenMarksStorage, type SeenMarksStorage, seenMarksKey } from './seen-marks';

export const SEEN_MARK_LIFETIME_MS = 7 * 24 * 60 * 60 * 1_000;

export type SeenMarks = Readonly<Record<string, number>>;

export interface SeenStore {
  readonly version: () => number;
  readonly subscribe: (listener: () => void) => () => void;
  readonly marks: (now: number) => SeenMarks;
  readonly record: (screen: string, readAt: number, now: number) => void;
  readonly adopt: (screens: readonly string[], asOf: number, now: number) => void;
}

export interface SeenStoreOptions {
  readonly storage?: () => SeenMarksStorage;
  readonly events?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
}

function parsedMarks(stored: string | null): SeenMarks {
  if (stored === null) {
    return {};
  }
  const value: unknown = JSON.parse(stored);
  if (typeof value !== 'object' || value === null) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] =>
        typeof entry[1] === 'number' && Number.isFinite(entry[1]),
    ),
  );
}

function liveMarks(marks: SeenMarks, now: number): SeenMarks {
  return Object.fromEntries(
    Object.entries(marks).filter(([, mark]) => now - mark <= SEEN_MARK_LIFETIME_MS),
  );
}

export function createSeenStore(
  projectId: string,
  { storage = browserSeenMarksStorage, events = window }: SeenStoreOptions = {},
): SeenStore {
  const key = seenMarksKey(projectId);
  const listeners = new Set<() => void>();
  let memory: SeenMarks = {};
  let version = 0;

  const changed = () => {
    version += 1;
    for (const listener of listeners) {
      listener();
    }
  };

  const read = (): SeenMarks => {
    try {
      return parsedMarks(storage().getItem(key));
    } catch (error) {
      console.warn('seen marks: could not read the marks on this device', error);
      return memory;
    }
  };

  const write = (marks: SeenMarks) => {
    memory = marks;
    try {
      storage().setItem(key, JSON.stringify(marks));
    } catch (error) {
      console.warn('seen marks: could not keep the marks on this device', error);
    }
    changed();
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      changed();
    }
  };

  return {
    version: () => version,
    subscribe(listener) {
      if (listeners.size === 0) {
        events.addEventListener('storage', onStorage);
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          events.removeEventListener('storage', onStorage);
        }
      };
    },
    marks: (now) => liveMarks(read(), now),
    record(screen, readAt, now) {
      const marks = liveMarks(read(), now);
      const current = marks[screen];
      if (current !== undefined && current >= readAt) {
        return;
      }
      write({ ...marks, [screen]: readAt });
    },
    adopt(screens, asOf, now) {
      const marks = liveMarks(read(), now);
      const unmarked = screens.filter((screen) => marks[screen] === undefined);
      if (unmarked.length === 0) {
        return;
      }
      write({ ...marks, ...Object.fromEntries(unmarked.map((screen) => [screen, asOf])) });
    },
  };
}
