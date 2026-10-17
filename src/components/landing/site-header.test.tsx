import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DEFAULT_LANDING_PAGE } from '@/lib/landing-pages';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { LandingLanguageSelect } from './landing-language-select';
import { SiteHeader } from './site-header';

function homeHeader() {
  return (
    <SiteHeader
      i18n={english}
      homeHref="/"
      language={<LandingLanguageSelect current={DEFAULT_LANDING_PAGE} label="Language" />}
      theme={<ThemeToggle remember="device" />}
      withSignIn
    />
  );
}

describe('SiteHeader', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

  it('links the brand home and the main links to the demo, privacy, Claude and pricing', () => {
    renderWithMessages(homeHeader());

    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('link', { name: 'Pyxis' })).toHaveAttribute('href', '/');
    const main = within(banner).getByRole('navigation', { name: 'Main' });
    expect(within(main).getByRole('link', { name: 'Live demo' })).toHaveAttribute(
      'href',
      'https://demo.pyxis-analytics.dev',
    );
    expect(within(main).getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/#never-stored',
    );
    const claude = within(main).getByRole('link', { name: 'Ask Claude' });
    expect(claude).toHaveAttribute('href', '/#ask-claude');
    expect(claude).toHaveAttribute('data-track', 'ask_claude_opened');
    expect(claude).toHaveAttribute('data-track-from', 'header');
    const pricing = within(main).getByRole('link', { name: 'Pricing' });
    expect(pricing).toHaveAttribute('href', '/#pricing');
    expect(pricing).toHaveAttribute('data-track', 'pricing_opened');
    expect(pricing).toHaveAttribute('data-track-from', 'header');
    expect(within(main).queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument();
  });

  it('offers the dashboard sign-in on the home page', () => {
    renderWithMessages(homeHeader());

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      'https://app.pyxis-analytics.dev/sign-in',
    );
  });

  it('leads back to the home page from another address, without a sign-in link', () => {
    renderWithMessages(
      <SiteHeader
        i18n={english}
        homeHref="https://pyxis-analytics.dev/pt-br"
        language={<p>languages</p>}
        theme={<p>theme</p>}
        withSignIn={false}
      />,
    );

    expect(screen.getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/pt-br',
    );
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/pt-br#never-stored',
    );
    expect(screen.queryByRole('link', { name: 'Sign in' })).toBeNull();
    expect(screen.getByRole('banner')).toHaveTextContent('languagestheme');
  });

  it('switches the theme without setting a cookie on the home page', async () => {
    document.documentElement.dataset.theme = 'light';
    renderWithMessages(homeHeader());

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.cookie).not.toContain('pyxis_theme');
  });
});
