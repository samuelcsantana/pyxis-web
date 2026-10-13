import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_LANDING_PAGE } from '@/lib/landing-pages';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { LandingHeader } from './landing-header';

describe('LandingHeader', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

  it('links the brand to this page and the main links to the demo and the code', () => {
    renderWithMessages(<LandingHeader i18n={english} page={DEFAULT_LANDING_PAGE} />);

    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('link', { name: 'Pyxis' })).toHaveAttribute('href', '/');
    const main = within(banner).getByRole('navigation', { name: 'Main' });
    expect(within(main).getByRole('link', { name: 'Live demo' })).toHaveAttribute(
      'href',
      'https://demo.pyxis-analytics.dev',
    );
    expect(within(main).getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '#never-stored',
    );
    expect(within(main).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-api',
    );
  });

  it('offers the dashboard sign-in for the people who have access', () => {
    renderWithMessages(<LandingHeader i18n={english} page={DEFAULT_LANDING_PAGE} />);

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      'https://app.pyxis-analytics.dev/sign-in',
    );
  });

  it('switches the theme without setting a cookie', async () => {
    document.documentElement.dataset.theme = 'light';
    renderWithMessages(<LandingHeader i18n={english} page={DEFAULT_LANDING_PAGE} />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.cookie).not.toContain('pyxis_theme');
  });
});
