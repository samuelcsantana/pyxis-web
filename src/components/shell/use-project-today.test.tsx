import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { anchoredClock, useProjectToday } from './use-project-today';

const SAO_PAULO = 'America/Sao_Paulo';
const LATE_EVENING_OF_OCTOBER_5 = Date.parse('2026-10-06T02:30:00.000Z');
const ONE_HOUR = 3_600_000;
const ONE_DAY = 24 * ONE_HOUR;

function Today({ serverNow }: { readonly serverNow: number }) {
  return <span>{useProjectToday(SAO_PAULO, serverNow)}</span>;
}

describe('anchoredClock', () => {
  it('starts at the server time and then follows the device clock', () => {
    const device = vi.fn<() => number>().mockReturnValueOnce(1_000).mockReturnValueOnce(1_500);
    const now = anchoredClock(50_000, device);

    expect(now()).toBe(50_000);
    expect(now()).toBe(50_500);
  });
});

describe('useProjectToday', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the day of the server on the server, in the project time zone', () => {
    vi.setSystemTime(LATE_EVENING_OF_OCTOBER_5 + 3 * ONE_DAY);

    expect(renderToString(<Today serverNow={LATE_EVENING_OF_OCTOBER_5} />)).toBe(
      '<span>2026-10-05</span>',
    );
  });

  it('keeps the day of the server on a device whose clock is a day off', () => {
    vi.setSystemTime(LATE_EVENING_OF_OCTOBER_5 - ONE_DAY);

    const { result } = renderHook(() => useProjectToday(SAO_PAULO, LATE_EVENING_OF_OCTOBER_5));

    expect(result.current).toBe('2026-10-05');
  });

  it('moves to the next day at midnight in the project time zone, on the next render', () => {
    vi.setSystemTime(LATE_EVENING_OF_OCTOBER_5);
    const { result, rerender } = renderHook(() =>
      useProjectToday(SAO_PAULO, LATE_EVENING_OF_OCTOBER_5),
    );
    expect(result.current).toBe('2026-10-05');

    vi.setSystemTime(LATE_EVENING_OF_OCTOBER_5 + ONE_HOUR);
    rerender();

    expect(result.current).toBe('2026-10-06');
  });

  it('starts over from a new server time, after a refresh', () => {
    vi.setSystemTime(LATE_EVENING_OF_OCTOBER_5);
    const { result, rerender } = renderHook(
      ({ serverNow }) => useProjectToday(SAO_PAULO, serverNow),
      { initialProps: { serverNow: LATE_EVENING_OF_OCTOBER_5 } },
    );

    rerender({ serverNow: LATE_EVENING_OF_OCTOBER_5 + 2 * ONE_DAY });

    expect(result.current).toBe('2026-10-07');
  });
});
