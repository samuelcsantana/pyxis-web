import { afterEach, describe, expect, it, vi } from 'vitest';
import { bestEffortForgetSeenMarks, type SeenMarksStorage, seenMarksKey } from './seen-marks';
import { createSeenStore, SEEN_MARK_LIFETIME_MS } from './seen-store';

const PROJECT = 'p-store';
const NOW = Date.parse('2026-10-23T12:00:00Z');
const MINUTE = 60_000;

function blockedStorage(): SeenMarksStorage {
  throw new DOMException('The operation is insecure.', 'SecurityError');
}

function storedMarks(): unknown {
  return JSON.parse(window.localStorage.getItem(seenMarksKey(PROJECT)) ?? 'null');
}

describe('createSeenStore', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('keeps the moment each screen was read, per project, on this device', () => {
    const store = createSeenStore(PROJECT);

    store.record('overview', NOW - MINUTE, NOW);
    store.record('funnel', NOW, NOW);

    expect(store.marks(NOW)).toEqual({ overview: NOW - MINUTE, funnel: NOW });
    expect(storedMarks()).toEqual({ overview: NOW - MINUTE, funnel: NOW });
    expect(createSeenStore('p-docs').marks(NOW)).toEqual({});
  });

  it('never moves a mark back, so a screen shown again from the cache changes nothing', () => {
    const store = createSeenStore(PROJECT);
    const listener = vi.fn();
    store.subscribe(listener);
    store.record('overview', NOW, NOW);
    listener.mockClear();

    store.record('overview', NOW - MINUTE, NOW);
    store.record('overview', NOW, NOW);

    expect(store.marks(NOW)).toEqual({ overview: NOW });
    expect(listener).not.toHaveBeenCalled();
  });

  it('gives the screens without a mark the moment of the first answer, and only them', () => {
    const store = createSeenStore(PROJECT);
    store.record('overview', NOW - MINUTE, NOW);

    store.adopt(['overview', 'visits', 'requests'], NOW, NOW);

    expect(store.marks(NOW)).toEqual({ overview: NOW - MINUTE, visits: NOW, requests: NOW });
  });

  it('writes nothing when every screen already has a mark', () => {
    const store = createSeenStore(PROJECT);
    store.record('overview', NOW, NOW);
    const versionBefore = store.version();

    store.adopt(['overview'], NOW + MINUTE, NOW + MINUTE);

    expect(store.version()).toBe(versionBefore);
  });

  it('lets a mark older than seven days start over', () => {
    const store = createSeenStore(PROJECT);
    store.record('overview', NOW, NOW);
    const later = NOW + SEEN_MARK_LIFETIME_MS + 1;

    expect(store.marks(NOW + SEEN_MARK_LIFETIME_MS)).toEqual({ overview: NOW });
    expect(store.marks(later)).toEqual({});

    store.adopt(['overview'], later, later);

    expect(store.marks(later)).toEqual({ overview: later });
  });

  it('ignores what is stored under its key when it is not a set of marks', () => {
    const store = createSeenStore(PROJECT);

    window.localStorage.setItem(seenMarksKey(PROJECT), '"text"');
    expect(store.marks(NOW)).toEqual({});

    window.localStorage.setItem(
      seenMarksKey(PROJECT),
      JSON.stringify({ overview: NOW, funnel: 'yesterday', visits: null }),
    );
    expect(store.marks(NOW)).toEqual({ overview: NOW });
  });

  it('follows the marks another tab writes for the same project', () => {
    const store = createSeenStore(PROJECT);
    const listener = vi.fn();
    const stop = store.subscribe(listener);

    window.dispatchEvent(new StorageEvent('storage', { key: seenMarksKey(PROJECT) }));
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
    window.dispatchEvent(new StorageEvent('storage', { key: seenMarksKey('p-docs') }));

    expect(listener).toHaveBeenCalledTimes(2);

    stop();
    window.dispatchEvent(new StorageEvent('storage', { key: seenMarksKey(PROJECT) }));

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('listens to the other tabs once, however many readers it has', () => {
    const events = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const store = createSeenStore(PROJECT, { events });

    const stopFirst = store.subscribe(() => undefined);
    const stopSecond = store.subscribe(() => undefined);
    stopFirst();

    expect(events.addEventListener).toHaveBeenCalledTimes(1);
    expect(events.removeEventListener).not.toHaveBeenCalled();

    stopSecond();

    expect(events.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('keeps the marks in memory when the browser blocks storage, saying why', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const store = createSeenStore(PROJECT, { storage: blockedStorage });

    store.record('overview', NOW, NOW);

    expect(store.marks(NOW)).toEqual({ overview: NOW });
    expect(warn).toHaveBeenCalledWith(
      'seen marks: could not keep the marks on this device',
      expect.any(DOMException),
    );
    expect(warn).toHaveBeenCalledWith(
      'seen marks: could not read the marks on this device',
      expect.any(DOMException),
    );
  });

  it('falls back to memory when what is stored is not JSON', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const store = createSeenStore(PROJECT);
    store.record('overview', NOW, NOW);

    window.localStorage.setItem(seenMarksKey(PROJECT), '{broken');

    expect(store.marks(NOW)).toEqual({ overview: NOW });
  });
});

describe('bestEffortForgetSeenMarks', () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('forgets the marks of every project and nothing else', () => {
    window.localStorage.setItem(seenMarksKey('p-store'), '{}');
    window.localStorage.setItem(seenMarksKey('p-docs'), '{}');
    window.localStorage.setItem('pyxis:theme', 'dark');

    bestEffortForgetSeenMarks();

    expect(window.localStorage.length).toBe(1);
    expect(window.localStorage.getItem('pyxis:theme')).toBe('dark');
  });

  it('says why when the browser blocks storage', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    bestEffortForgetSeenMarks(blockedStorage);

    expect(warn).toHaveBeenCalledWith(
      'seen marks: could not forget the marks on this device',
      expect.any(DOMException),
    );
  });
});
