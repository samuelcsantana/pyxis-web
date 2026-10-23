import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readAges, RefreshWhenStale, STALE_AFTER_MS } from './refresh-when-stale';

const router = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

const THREE_HOURS = 3 * 60 * 60 * 1000;
const FIRST_PAGE_READ_AT = Date.parse('2026-10-23T18:00:00.000Z');
const DEVICE_AT_FIRST_PAGE = FIRST_PAGE_READ_AT - THREE_HOURS;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  router.refresh.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('RefreshWhenStale', () => {
  it('measures every read on the server clock, learned from the first screen of the page', () => {
    vi.setSystemTime(DEVICE_AT_FIRST_PAGE);
    render(<RefreshWhenStale readAt={FIRST_PAGE_READ_AT} />).unmount();
    expect(router.refresh).not.toHaveBeenCalled();

    vi.setSystemTime(DEVICE_AT_FIRST_PAGE + 60_000);
    render(<RefreshWhenStale readAt={FIRST_PAGE_READ_AT + 60_000} />).unmount();
    expect(router.refresh).not.toHaveBeenCalled();

    render(<RefreshWhenStale readAt={FIRST_PAGE_READ_AT + 60_000 - STALE_AFTER_MS} />).unmount();
    expect(router.refresh).not.toHaveBeenCalled();

    render(<RefreshWhenStale readAt={FIRST_PAGE_READ_AT + 60_000 - STALE_AFTER_MS - 1} />);
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });
});

describe('readAges', () => {
  it('counts the first read as new, and the others by how long ago the server read them', () => {
    const ageOf = readAges();

    expect(ageOf(1_000_000, 50)).toBe(0);
    expect(ageOf(1_000_000, 30_050)).toBe(30_000);
    expect(ageOf(1_040_000, 40_050)).toBe(0);
  });
});
