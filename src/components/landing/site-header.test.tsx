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
      onHomePage
      language={<LandingLanguageSelect current={DEFAULT_LANDING_PAGE} label="Language" />}
      theme={<ThemeToggle remember="device" />}
      withSignIn
    />
  );
}

function headerNavigations(): { readonly row: HTMLElement; readonly menu: HTMLElement } {
  const [row, menu] = within(screen.getByRole('banner')).getAllByRole('navigation', {
    name: 'Main',
  });
  if (row === undefined || menu === undefined) {
    throw new Error('the header lists its links once only');
  }
  return { row, menu };
}

function expectTheHomeLinksIn(navigation: HTMLElement) {
  const links = within(navigation);
  expect(links.getByRole('link', { name: 'Live demo' })).toHaveAttribute(
    'href',
    'https://demo.pyxis-analytics.dev',
  );
  expect(links.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '#never-stored');
  const claude = links.getByRole('link', { name: 'Ask Claude' });
  expect(claude).toHaveAttribute('href', '#ask-claude');
  expect(claude).toHaveAttribute('data-track', 'ask_claude_opened');
  expect(claude).toHaveAttribute('data-track-from', 'header');
  const install = links.getByRole('link', { name: 'Install' });
  expect(install).toHaveAttribute('href', '#install');
  expect(install).toHaveAttribute('data-track', 'install_opened');
  expect(install).toHaveAttribute('data-track-from', 'header');
  const pricing = links.getByRole('link', { name: 'Pricing' });
  expect(pricing).toHaveAttribute('href', '#pricing');
  expect(pricing).toHaveAttribute('data-track', 'pricing_opened');
  expect(pricing).toHaveAttribute('data-track-from', 'header');
  expect(links.getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Live demo',
    'Privacy',
    'Ask Claude',
    'Install',
    'Pricing',
  ]);
}

describe('SiteHeader', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    window.localStorage.clear();
  });

  it('links the brand home, the demo, and the sections of the home page in place, in the row and in the menu', () => {
    renderWithMessages(homeHeader());

    expect(within(screen.getByRole('banner')).getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      '/',
    );
    const { row, menu } = headerNavigations();
    expectTheHomeLinksIn(row);
    expectTheHomeLinksIn(menu);
  });

  it('shows the links in a row from a laptop, and in a menu on a tablet', () => {
    renderWithMessages(homeHeader());

    const { row, menu } = headerNavigations();
    expect(row).toHaveClass('hidden', 'lg:flex');
    const disclosure = menu.closest('details');
    expect(disclosure).toHaveClass('hidden', 'md:block', 'lg:hidden');
    expect(disclosure?.querySelector('summary')).toHaveTextContent('Menu');
  });

  it('closes the menu once one of its links is chosen', async () => {
    renderWithMessages(homeHeader());
    const { menu } = headerNavigations();
    const disclosure = menu.closest('details');

    await userEvent.click(within(screen.getByRole('banner')).getByText('Menu'));
    expect(disclosure).toHaveAttribute('open');
    await userEvent.click(within(menu).getByRole('link', { name: 'Pricing' }));

    expect(disclosure).not.toHaveAttribute('open');
  });

  it('offers the dashboard sign-in on the home page', () => {
    renderWithMessages(homeHeader());

    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      'https://app.pyxis-analytics.dev/sign-in',
    );
  });

  it('leads back to the home page and its sections from another address, without a sign-in link', () => {
    renderWithMessages(
      <SiteHeader
        i18n={english}
        homeHref="https://pyxis-analytics.dev/pt-br"
        onHomePage={false}
        language={<p>languages</p>}
        theme={<p>theme</p>}
        withSignIn={false}
      />,
    );

    expect(screen.getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/pt-br',
    );
    const { row, menu } = headerNavigations();
    for (const navigation of [row, menu]) {
      const links = within(navigation);
      expect(links.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
        'href',
        'https://pyxis-analytics.dev/pt-br#never-stored',
      );
      expect(links.getByRole('link', { name: 'Install' })).toHaveAttribute(
        'href',
        'https://pyxis-analytics.dev/pt-br#install',
      );
      expect(links.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
        'href',
        'https://pyxis-analytics.dev/pt-br#pricing',
      );
    }
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
