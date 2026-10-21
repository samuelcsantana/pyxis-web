import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { showcasePreview } from '@/test-utils/landing-preview';
import { portuguese } from '@/test-utils/portuguese';
import { LandingHero } from './landing-hero';

describe('LandingHero', () => {
  it('states what Pyxis finds out in the page title, over the brand backdrop', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} />);

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

  it('leads to the live demo first and to the pricing second, promising no sign-up', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} />);

    const hero = screen.getByRole('region');
    const [demo, pricing] = within(hero).getAllByRole('link');
    expect(demo).toHaveAccessibleName('Open the live demo');
    expect(demo).toHaveAttribute('href', 'https://demo.pyxis-analytics.dev');
    expect(pricing).toHaveAccessibleName('See pricing');
    expect(pricing).toHaveAttribute('href', '#pricing');
    expect(pricing).toHaveAttribute('data-track', 'pricing_opened');
    expect(pricing).toHaveAttribute('data-track-from', 'hero');
    expect(screen.getByText(/No sign-up\. Invented data\./)).toBeInTheDocument();
  });

  it('announces the connector in Claude’s directory, leading to its section', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} />);

    const claude = screen.getByRole('link', {
      name: 'In Claude’s directory Ask Claude about your numbers',
    });
    expect(claude).toHaveAttribute('href', '#ask-claude');
    expect(claude).toHaveAttribute('data-track', 'ask_claude_opened');
    expect(claude).toHaveAttribute('data-track-from', 'hero');
  });

  it('shows the product beside the title and the checkable numbers below', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} />);

    expect(
      screen.getByRole('figure', { name: 'Preview of the Overview screen' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'under 5 KB tracker, gzipped' })).toBeInTheDocument();
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    render(<LandingHero i18n={portuguese} preview={showcasePreview(portuguese)} />);

    expect(screen.getByRole('link', { name: 'Abrir a demonstração' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver preço' })).toBeInTheDocument();
  });
});
