import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LinkPreferencesReceiver } from './link-preferences-receiver';
import { PreferenceCarrier } from './preference-carrier';

function links() {
  return (
    <>
      <a href="https://app.pyxis-analytics.dev/sign-in">Sign in</a>
      <a href="https://pyxis-analytics.dev/pt-br#never-stored">Privacy</a>
      <a href="https://github.com/samuelcsantana/pyxis-api">GitHub</a>
      <a href="#faq">Same page</a>
    </>
  );
}

describe('PreferenceCarrier', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
  });

  it('adds the language to links to the other Pyxis addresses, and the theme once chosen', async () => {
    render(
      <>
        {links()}
        <PreferenceCarrier locale="pt-BR" />
      </>,
    );

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      'https://app.pyxis-analytics.dev/sign-in?lang=pt-BR',
    );
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/pt-br#never-stored',
    );

    await act(async () => {
      document.documentElement.dataset.theme = 'dark';
      await Promise.resolve();
    });

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      'https://app.pyxis-analytics.dev/sign-in?lang=pt-BR&theme=dark',
    );
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/pt-br?theme=dark#never-stored',
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-api',
    );
    expect(screen.getByRole('link', { name: 'Same page' })).toHaveAttribute('href', '#faq');
  });

  it('stops following the theme when it leaves the page', async () => {
    const { unmount } = render(
      <>
        <a href="https://demo.pyxis-analytics.dev/">Demo</a>
        <PreferenceCarrier locale="en" />
      </>,
    );
    const demo = screen.getByRole('link', { name: 'Demo' });
    unmount();
    document.body.append(demo);

    await act(async () => {
      document.documentElement.dataset.theme = 'light';
      await Promise.resolve();
    });

    expect(demo).toHaveAttribute('href', 'https://demo.pyxis-analytics.dev/?lang=en');
    demo.remove();
  });
});

describe('LinkPreferencesReceiver', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('wears and remembers the theme a link brought, then cleans the address', () => {
    window.history.replaceState(null, '', '/pt-br?utm_source=x&lang=pt-BR&theme=dark#faq');

    render(<LinkPreferencesReceiver />);

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('pyxis:theme')).toBe('dark');
    expect(window.location.pathname + window.location.search + window.location.hash).toBe(
      '/pt-br?utm_source=x#faq',
    );
  });

  it('cleans an address that brought only a language or an unknown theme', () => {
    window.history.replaceState(null, '', '/?lang=en&theme=neon');

    render(<LinkPreferencesReceiver />);

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(window.localStorage.getItem('pyxis:theme')).toBeNull();
    expect(window.location.search).toBe('');
  });

  it('leaves an address without preferences alone', () => {
    window.history.replaceState(null, '', '/?utm_source=linkedin');

    render(<LinkPreferencesReceiver />);

    expect(window.location.search).toBe('?utm_source=linkedin');
  });
});
