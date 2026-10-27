import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { showcasePreview } from '@/test-utils/landing-preview';
import { portuguese } from '@/test-utils/portuguese';
import { LandingHero } from './landing-hero';

describe('LandingHero', () => {
  it('states what Pyxis finds out in the page title, over the brand backdrop', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} offer="trial" />);

    expect(
      screen.getByRole('region', {
        name: 'Find out what converts and what fails on your site, without collecting personal data.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('brand-backdrop')).toBeInTheDocument();
    expect(screen.getByText('No cookies · no IP · a connector for Claude')).toBeInTheDocument();
    expect(
      screen.getByText(
        /the funnel step where people stop and which of your site’s requests failed/,
      ),
    ).toBeInTheDocument();
  });

  it('leads to the free trial first and to the live demo second, while sign-up is open', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} offer="trial" />);

    const hero = screen.getByRole('region');
    const [trial, demo] = within(hero).getAllByRole('link');
    expect(trial).toHaveAccessibleName('Start your free trial');
    expect(trial).toHaveAttribute('href', 'https://app.pyxis-analytics.dev/sign-up');
    expect(trial).toHaveAttribute('data-track', 'sign_up_opened');
    expect(trial).toHaveAttribute('data-track-from', 'hero');
    expect(demo).toHaveAccessibleName('Open the live demo');
    expect(demo).toHaveAttribute('href', 'https://demo.pyxis-analytics.dev');
    expect(demo).toHaveAttribute('data-track', 'demo_opened');
    expect(demo).toHaveAttribute('data-track-from', 'hero');
    expect(screen.getByText(/the card is only charged on day 15\. The demo opens/)).toBeVisible();
    expect(screen.queryByRole('link', { name: 'See pricing' })).not.toBeInTheDocument();
  });

  it('leads to the live demo first and to the pricing second while sign-up is closed', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} offer="byInvitation" />);

    const hero = screen.getByRole('region');
    const [demo, pricing] = within(hero).getAllByRole('link');
    expect(demo).toHaveAccessibleName('Open the live demo');
    expect(demo).toHaveAttribute('href', 'https://demo.pyxis-analytics.dev');
    expect(pricing).toHaveAccessibleName('See pricing');
    expect(pricing).toHaveAttribute('href', '#pricing');
    expect(pricing).toHaveAttribute('data-track', 'pricing_opened');
    expect(pricing).toHaveAttribute('data-track-from', 'hero');
    expect(screen.getByText(/No sign-up\. Invented data\./)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Start your free trial' })).not.toBeInTheDocument();
  });

  it('announces the connector in Claude’s directory, leading to its section', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} offer="trial" />);

    const claude = screen.getByRole('link', {
      name: 'In Claude’s directory Ask Claude about your numbers',
    });
    expect(claude).toHaveAttribute('href', '#ask-claude');
    expect(claude).toHaveAttribute('data-track', 'ask_claude_opened');
    expect(claude).toHaveAttribute('data-track-from', 'hero');
  });

  it('shows the product beside the title and the checkable numbers below', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} offer="trial" />);

    expect(
      screen.getByRole('figure', { name: 'Preview of the Overview screen' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'under 5 KB of Pyxis code, gzipped' }),
    ).toBeInTheDocument();
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    render(<LandingHero i18n={portuguese} preview={showcasePreview(portuguese)} offer="trial" />);

    expect(screen.getByRole('link', { name: 'Começar o teste grátis' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir a demonstração' })).toBeInTheDocument();
    expect(screen.getByText(/o cartão só é cobrado no 15º dia/)).toBeInTheDocument();
  });
});
