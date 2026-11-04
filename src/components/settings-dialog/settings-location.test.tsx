import { act, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const navigation = vi.hoisted(() => ({ pathname: '/p1/overview', search: '' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

type Location = typeof import('./settings-location');

let store: Location;

function Probe() {
  const location = store.useSettingsLocation();
  store.useAddressBarShowingSettings();
  return <output>{location.kind === 'section' ? location.section : location.kind}</output>;
}

function shown(): string {
  return screen.getByRole('status').textContent;
}

beforeEach(async () => {
  window.history.replaceState(null, '', '/p1/overview');
  navigation.pathname = '/p1/overview';
  navigation.search = '';
  vi.resetModules();
  store = await import('./settings-location');
});

afterEach(() => {
  window.history.replaceState(null, '', '/p1/overview');
});

describe('the settings address', () => {
  it('reads nothing on the server, where there is no address bar', () => {
    expect(renderToString(<Probe />)).toContain('closed');
  });

  it('opens a section in a new step of the history and remembers who opened it', () => {
    const opener = document.createElement('button');
    render(<Probe />);
    const steps = window.history.length;

    act(() => {
      store.openSettings('keys', opener);
    });

    expect(shown()).toBe('keys');
    expect(window.location.hash).toBe('#settings/keys');
    expect(window.history.length).toBe(steps + 1);
    expect(store.takeTheSettingsOpener()).toBe(opener);
    expect(store.takeTheSettingsOpener()).toBeNull();
  });

  it('opens without an opener, and moves between sections in the same step', () => {
    render(<Probe />);
    act(() => {
      store.openSettings();
    });
    const steps = window.history.length;

    act(() => {
      store.openSettings('people');
    });
    expect(shown()).toBe('people');
    act(() => {
      store.showSettingsList();
    });

    expect(shown()).toBe('list');
    expect(window.location.hash).toBe('#settings');
    expect(window.history.length).toBe(steps);
    expect(store.takeTheSettingsOpener()).toBeNull();
  });

  it('closes by stepping back when this page opened it, out of the router’s sight', async () => {
    const router = vi.fn();
    window.addEventListener('popstate', router);
    render(<Probe />);
    act(() => {
      store.openSettings('general');
    });

    act(() => {
      store.closeSettings();
    });

    await waitFor(() => {
      expect(shown()).toBe('closed');
    });
    expect(window.location.hash).toBe('');
    expect(router).not.toHaveBeenCalled();
    window.removeEventListener('popstate', router);
  });

  it('closes in place when the address already asked for it', () => {
    window.history.replaceState(null, '', '/p1/overview#settings/help');
    render(<Probe />);
    expect(shown()).toBe('help');
    const steps = window.history.length;

    act(() => {
      store.closeSettings();
    });

    expect(shown()).toBe('closed');
    expect(window.location.pathname).toBe('/p1/overview');
    expect(window.history.length).toBe(steps);
  });

  it('closes in place once the way it was opened is forgotten', () => {
    render(<Probe />);
    act(() => {
      store.openSettings('general');
    });
    const steps = window.history.length;
    store.forgetHowSettingsOpened();

    act(() => {
      store.closeSettings();
    });

    expect(shown()).toBe('closed');
    expect(window.history.length).toBe(steps);
  });

  it('lets the router see a step back to another page', async () => {
    const router = vi.fn();
    window.addEventListener('popstate', router);
    render(<Probe />);
    window.history.pushState(null, '', '/p1/visits');

    act(() => {
      window.history.back();
    });

    await waitFor(() => {
      expect(router).toHaveBeenCalled();
    });
    expect(shown()).toBe('closed');
    window.removeEventListener('popstate', router);
  });

  it('follows a section typed in the address bar', () => {
    render(<Probe />);

    act(() => {
      window.history.replaceState(null, '', '/p1/overview#settings/apps');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(shown()).toBe('apps');
  });

  it('closes when the router goes to another page', () => {
    const { rerender } = render(<Probe />);
    act(() => {
      store.openSettings('help');
    });

    window.history.pushState(null, '', '/p1/install');
    navigation.pathname = '/p1/install';
    rerender(<Probe />);

    expect(shown()).toBe('closed');
  });

  it('puts the section back in the address when something else dropped it', () => {
    const { rerender } = render(<Probe />);
    act(() => {
      store.openSettings('general');
    });

    window.history.pushState(null, '', '/p1/overview');
    rerender(<Probe />);

    expect(window.location.hash).toBe('#settings/general');
    expect(shown()).toBe('general');
  });

  it('leaves other anchors in the address alone while the settings are closed', () => {
    const { rerender } = render(<Probe />);

    window.history.pushState(null, '', '/p1/overview#main');
    rerender(<Probe />);

    expect(window.location.hash).toBe('#main');
  });
});
