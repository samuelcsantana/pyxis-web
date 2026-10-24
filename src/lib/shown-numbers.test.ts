import { afterEach, describe, expect, it, vi } from 'vitest';
import { bestEffortForgetSeenMarks, type SeenMarksStorage } from './seen-marks';
import {
  createShownNumbersStore,
  grewBy,
  MAX_SHOWN_READS,
  nextShownReads,
  parsedShownReads,
  type ShownReads,
  shownNumbersKey,
  shownReadKey,
  startedAfter,
} from './shown-numbers';

const PROJECT = 'p-store';
const TODAY = '2026-10-24';
const KEY = shownReadKey('overview', '2026-09-25', TODAY, 'range=30d');
const FIRST = { readAt: 1_000, values: { 'kpi:visits': 10, 'page:/a': 4 } };
const SECOND = { readAt: 2_000, values: { 'kpi:visits': 13, 'page:/a': 4, 'page:/b': 7 } };

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
    const update = nextShownReads({}, { key: KEY, to: TODAY, read: FIRST, today: TODAY });

    expect(update.comparison).toBeUndefined();
    expect(update.reads).toEqual({ [KEY]: { to: TODAY, current: FIRST } });
  });

  it('compares a newer read with the one before it, as an arrival', () => {
    const reads = { [KEY]: { to: TODAY, current: FIRST } };

    const update = nextShownReads(reads, { key: KEY, to: TODAY, read: SECOND, today: TODAY });

    expect(update.comparison).toEqual({ against: FIRST, arrived: true });
    expect(update.reads[KEY]).toEqual({ to: TODAY, current: SECOND, previous: FIRST });
  });

  it('compares the same read shown again with the one before it, without an arrival', () => {
    const reads = { [KEY]: { to: TODAY, current: SECOND, previous: FIRST } };

    const update = nextShownReads(reads, { key: KEY, to: TODAY, read: SECOND, today: TODAY });

    expect(update.comparison).toEqual({ against: FIRST, arrived: false });
    expect(update.reads).toEqual(reads);
  });

  it('compares nothing for a read older than the kept one, or the same first read again', () => {
    const rotated = { [KEY]: { to: TODAY, current: SECOND, previous: FIRST } };
    const first = { [KEY]: { to: TODAY, current: FIRST } };

    expect(
      nextShownReads(rotated, { key: KEY, to: TODAY, read: FIRST, today: TODAY }).comparison,
    ).toBeUndefined();
    expect(
      nextShownReads(first, { key: KEY, to: TODAY, read: FIRST, today: TODAY }).comparison,
    ).toBeUndefined();
  });

  it('forgets the reads of periods that ended, and keeps only the newest reads', () => {
    const ended = { to: '2026-10-23', current: FIRST };
    const many: ShownReads = Object.fromEntries(
      Array.from({ length: MAX_SHOWN_READS + 5 }, (_, index) => [
        `k${String(index)}`,
        { to: TODAY, current: { readAt: index, values: {} } },
      ]),
    );

    const update = nextShownReads(
      { ...many, ended },
      { key: KEY, to: TODAY, read: SECOND, today: TODAY },
    );

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

    expect(store.compare({ key: KEY, to: TODAY, read: FIRST, today: TODAY })).toBeUndefined();
    expect(
      createShownNumbersStore(PROJECT).compare({ key: KEY, to: TODAY, read: SECOND, today: TODAY }),
    ).toEqual({ against: FIRST, arrived: true });
    expect(window.localStorage.getItem(shownNumbersKey('p-docs'))).toBeNull();

    bestEffortForgetSeenMarks();

    expect(window.localStorage.getItem(shownNumbersKey(PROJECT))).toBeNull();
  });

  it('keeps the reads in memory when the device storage refuses, and says so', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const store = createShownNumbersStore(PROJECT, blockedStorage);

    store.compare({ key: KEY, to: TODAY, read: FIRST, today: TODAY });

    expect(store.compare({ key: KEY, to: TODAY, read: SECOND, today: TODAY })).toEqual({
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
