import { afterEach, describe, expect, it, vi } from 'vitest';
import { bestEffortForgetSeenMarks, type SeenMarksStorage } from './seen-marks';
import {
  createShownNumbersStore,
  grewBy,
  MAX_SHOWN_READS,
  nextShownReads,
  type NumbersRead,
  parsedShownReads,
  SAME_LOOK_MS,
  type ShownReads,
  type ShownRequest,
  shownNumbersKey,
  shownReadKey,
  startedAfter,
} from './shown-numbers';

const PROJECT = 'p-store';
const TODAY = '2026-10-24';
const KEY = shownReadKey('overview', '2026-09-25', TODAY, 'range=30d');
const FIRST = { readAt: 1_000, values: { 'kpi:visits': 10, 'page:/a': 4 } };
const SECOND = { readAt: 2_000, values: { 'kpi:visits': 13, 'page:/a': 4, 'page:/b': 7 } };

function requestFor(read: NumbersRead, visitStarts: readonly number[] = []): ShownRequest {
  return { key: KEY, to: TODAY, read, visitStarts, today: TODAY };
}

function blockedStorage(): SeenMarksStorage {
  throw new DOMException('The operation is insecure.', 'SecurityError');
}

describe('shownReadKey', () => {
  it('names a read by its screen, its days and every parameter, in a stable order', () => {
    expect(shownReadKey('requests', '2026-10-01', TODAY, 'kind=reads&range=30d')).toBe(
      shownReadKey('requests', '2026-10-01', TODAY, '?range=30d&kind=reads'),
    );
    expect(shownReadKey('requests', '2026-10-01', TODAY, 'kind=reads')).not.toBe(
      shownReadKey('requests', '2026-10-01', TODAY, 'kind=writes'),
    );
    expect(shownReadKey('overview', '2026-09-25', TODAY, 'range=30d')).not.toBe(
      shownReadKey('overview', '2026-09-26', '2026-10-25', 'range=30d'),
    );
  });
});

describe('nextShownReads', () => {
  it('compares nothing on the first read of a screen and period, and keeps it', () => {
    const update = nextShownReads({}, requestFor(FIRST));

    expect(update.comparison).toBeUndefined();
    expect(update.reads).toEqual({ [KEY]: { to: TODAY, current: FIRST } });
  });

  it('compares a newer read with the one before it, as an arrival', () => {
    const reads = { [KEY]: { to: TODAY, current: FIRST } };

    const update = nextShownReads(reads, requestFor(SECOND));

    expect(update.comparison).toEqual({ against: FIRST, arrived: true });
    expect(update.reads[KEY]).toEqual({ to: TODAY, current: SECOND, previous: FIRST });
  });

  it('compares the same read shown again with the one before it, without an arrival', () => {
    const reads = { [KEY]: { to: TODAY, current: SECOND, previous: FIRST } };

    const update = nextShownReads(reads, requestFor(SECOND));

    expect(update.comparison).toEqual({ against: FIRST, arrived: false });
    expect(update.reads).toEqual(reads);
  });

  it('compares nothing for a read older than the kept one, or the same first read again', () => {
    const rotated = { [KEY]: { to: TODAY, current: SECOND, previous: FIRST } };
    const first = { [KEY]: { to: TODAY, current: FIRST } };

    expect(nextShownReads(rotated, requestFor(FIRST)).comparison).toBeUndefined();
    expect(nextShownReads(first, requestFor(FIRST)).comparison).toBeUndefined();
  });

  it('keeps the look of a read with nothing new a few minutes later, against the read before it', () => {
    const reads = { [KEY]: { to: TODAY, current: SECOND, previous: FIRST } };
    const toggled = {
      readAt: SECOND.readAt + SAME_LOOK_MS,
      values: { 'kpi:visits': 13, 'event:signup': 2 },
    };

    const update = nextShownReads(reads, requestFor(toggled, [SECOND.readAt]));

    expect(update.comparison).toEqual({ against: FIRST, arrived: false });
    expect(update.reads[KEY]).toEqual({
      to: TODAY,
      current: { readAt: toggled.readAt, values: { ...SECOND.values, 'event:signup': 2 } },
      previous: FIRST,
    });
  });

  it('keeps a look with nothing to compare when no read came before it', () => {
    const reads = { [KEY]: { to: TODAY, current: FIRST } };
    const again = { readAt: FIRST.readAt + 1, values: FIRST.values };

    const update = nextShownReads(reads, requestFor(again));

    expect(update.comparison).toBeUndefined();
    expect(update.reads[KEY]).toEqual({ to: TODAY, current: again });
  });

  it('starts a new look when a count went up, even a moment later', () => {
    const reads = { [KEY]: { to: TODAY, current: SECOND, previous: FIRST } };
    const grown = { readAt: SECOND.readAt + 1, values: { ...SECOND.values, 'page:/b': 8 } };

    const update = nextShownReads(reads, requestFor(grown));

    expect(update.comparison).toEqual({ against: SECOND, arrived: true });
    expect(update.reads[KEY]).toEqual({ to: TODAY, current: grown, previous: SECOND });
  });

  it('starts a new look when a visit started after the last read, even with no count shown', () => {
    const visits = { readAt: 2_000, values: {} };
    const reads = { [KEY]: { to: TODAY, current: visits, previous: FIRST } };
    const later = { readAt: 2_500, values: {} };

    expect(nextShownReads(reads, requestFor(later, [1_500, 2_001])).comparison).toEqual({
      against: visits,
      arrived: true,
    });
    expect(nextShownReads(reads, requestFor(later, [1_500])).comparison).toEqual({
      against: FIRST,
      arrived: false,
    });
  });

  it('starts a new look when the same numbers are read more than a few minutes later', () => {
    const reads = { [KEY]: { to: TODAY, current: SECOND, previous: FIRST } };
    const later = { readAt: SECOND.readAt + SAME_LOOK_MS + 1, values: SECOND.values };

    const update = nextShownReads(reads, requestFor(later));

    expect(update.comparison).toEqual({ against: SECOND, arrived: true });
    expect(update.reads[KEY]).toEqual({ to: TODAY, current: later, previous: SECOND });
  });

  it('compares a read from earlier in the look, back from the cache, with the read before it', () => {
    const look = { readAt: 3_000, values: SECOND.values };
    const reads = { [KEY]: { to: TODAY, current: look, previous: FIRST } };

    const update = nextShownReads(reads, requestFor(SECOND));

    expect(update.comparison).toEqual({ against: FIRST, arrived: false });
    expect(update.reads).toEqual(reads);
  });

  it('forgets the reads of periods that ended, and keeps only the newest reads', () => {
    const ended = { to: '2026-10-23', current: FIRST };
    const many: ShownReads = Object.fromEntries(
      Array.from({ length: MAX_SHOWN_READS + 5 }, (_, index) => [
        `k${String(index)}`,
        { to: TODAY, current: { readAt: index, values: {} } },
      ]),
    );

    const update = nextShownReads({ ...many, ended }, requestFor(SECOND));

    expect(update.reads.ended).toBeUndefined();
    expect(Object.keys(update.reads)).toHaveLength(MAX_SHOWN_READS + 1);
    expect(update.reads.k0).toBeUndefined();
    expect(update.reads[`k${String(MAX_SHOWN_READS + 4)}`]).toBeDefined();
  });
});

describe('grewBy and startedAfter', () => {
  it('counts only what went up for an item both reads showed', () => {
    expect(grewBy('kpi:visits', 13, FIRST)).toBe(3);
    expect(grewBy('page:/a', 4, FIRST)).toBe(0);
    expect(grewBy('page:/a', 2, FIRST)).toBe(0);
    expect(grewBy('page:/b', 7, FIRST)).toBe(0);
  });

  it('calls a visit new when it started after the read it is compared with', () => {
    expect(startedAfter(1_001, FIRST)).toBe(true);
    expect(startedAfter(1_000, FIRST)).toBe(false);
  });
});

describe('parsedShownReads', () => {
  it('keeps only well formed reads and numbers', () => {
    const stored = JSON.stringify({
      good: { to: TODAY, current: { readAt: 1, values: { a: 1, b: 'x' } } },
      rotated: { to: TODAY, current: FIRST, previous: { readAt: 'x' } },
      kept: { to: TODAY, current: SECOND, previous: FIRST },
      noTo: { current: FIRST },
      noCurrent: { to: TODAY, current: { readAt: 1, values: null } },
      notAnObject: 3,
    });

    expect(parsedShownReads(stored)).toEqual({
      good: { to: TODAY, current: { readAt: 1, values: { a: 1 } } },
      rotated: { to: TODAY, current: FIRST },
      kept: { to: TODAY, current: SECOND, previous: FIRST },
    });
    expect(parsedShownReads(null)).toEqual({});
    expect(parsedShownReads('7')).toEqual({});
  });
});

describe('createShownNumbersStore', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('keeps the reads on this device, per project, and forgets them on sign-out', () => {
    const store = createShownNumbersStore(PROJECT);

    expect(store.compare(requestFor(FIRST))).toBeUndefined();
    expect(createShownNumbersStore(PROJECT).compare(requestFor(SECOND))).toEqual({
      against: FIRST,
      arrived: true,
    });
    expect(window.localStorage.getItem(shownNumbersKey('p-docs'))).toBeNull();

    bestEffortForgetSeenMarks();

    expect(window.localStorage.getItem(shownNumbersKey(PROJECT))).toBeNull();
  });

  it('keeps the reads in memory when the device storage refuses, and says so', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const store = createShownNumbersStore(PROJECT, blockedStorage);

    store.compare(requestFor(FIRST));

    expect(store.compare(requestFor(SECOND))).toEqual({
      against: FIRST,
      arrived: true,
    });
    expect(warn).toHaveBeenCalledWith(
      'shown numbers: could not read the numbers kept on this device',
      expect.any(DOMException),
    );
    expect(warn).toHaveBeenCalledWith(
      'shown numbers: could not keep the numbers on this device',
      expect.any(DOMException),
    );
  });
});
