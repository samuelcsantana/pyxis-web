import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screenOfSegments, useScreenOnView } from './use-screen-on-view';

const navigation = vi.hoisted<{ pathname: string; segment: string | null }>(() => ({
  pathname: '/p1/overview',
  segment: 'overview',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSelectedLayoutSegments: () =>
    navigation.segment === null ? [] : ['(screens)', navigation.segment],
}));

describe('useScreenOnView', () => {
  beforeEach(() => {
    navigation.pathname = '/p1/overview';
    navigation.segment = 'overview';
  });

  it('names the screen of the address, even while the layout still shows the one being left', () => {
    navigation.pathname = '/p1/devices';

    const { result } = renderHook(() => useScreenOnView());

    expect(result.current).toBe('devices');
  });

  it('names the screen the layout shows when the address belongs to a window over it', () => {
    navigation.pathname = '/p1/settings/keys';
    navigation.segment = 'timeline';

    const { result } = renderHook(() => useScreenOnView());

    expect(result.current).toBe('timeline');
  });

  it('names no screen when neither the address nor the layout is a screen', () => {
    navigation.pathname = '/account/sessions';
    navigation.segment = null;

    const { result } = renderHook(() => useScreenOnView());

    expect(result.current).toBeUndefined();
  });
});

describe('screenOfSegments', () => {
  it('finds the screen among the segments of a layout, at any depth', () => {
    expect(screenOfSegments(['overview'])).toBe('overview');
    expect(screenOfSegments(['(screens)', 'requests'])).toBe('requests');
  });

  it('finds no screen among segments that hold none', () => {
    for (const segments of [[], ['settings'], ['(.)settings', 'keys'], ['(screens)'], ['']]) {
      expect(screenOfSegments(segments)).toBeUndefined();
    }
  });
});
