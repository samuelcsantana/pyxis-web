import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { showcasePreview } from '@/test-utils/landing-preview';
import { portuguese } from '@/test-utils/portuguese';
import { LandingHero } from './landing-hero';

describe('LandingHero', () => {
  it('states what Pyxis is in the page title, over the brand backdrop', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} />);

    expect(
      screen.getByRole('region', {
        name: 'Product analytics without cookies, IP addresses or personal data.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('brand-backdrop')).toBeInTheDocument();
    expect(screen.getByText('Open-source product analytics')).toBeInTheDocument();
  });

  it('leads to the live demo first and to the code second, promising no sign-up', () => {
    render(<LandingHero i18n={english} preview={showcasePreview(english)} />);

    const hero = screen.getByRole('region');
    const [demo, code] = within(hero).getAllByRole('link');
    expect(demo).toHaveAccessibleName('Open the live demo');
    expect(demo).toHaveAttribute('href', 'https://demo.pyxis-analytics.dev');
    expect(code).toHaveAccessibleName('Read the code');
    expect(code).toHaveAttribute('href', 'https://github.com/samuelcsantana/pyxis-api');
    expect(screen.getByText(/No sign-up\. Invented data\./)).toBeInTheDocument();
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
    expect(screen.getByRole('link', { name: 'Ver o código' })).toBeInTheDocument();
  });
});
