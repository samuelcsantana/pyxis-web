import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { LandingHero } from './landing-hero';

describe('LandingHero', () => {
  it('states what Pyxis is in the page title, over the brand backdrop', () => {
    render(<LandingHero i18n={english} />);

    expect(
      screen.getByRole('region', {
        name: 'Product analytics without cookies, IP addresses or personal data.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('brand-backdrop')).toBeInTheDocument();
    expect(screen.getByText('Open-source product analytics')).toBeInTheDocument();
  });

  it('leads to the live demo first and to the code second, promising no sign-up', () => {
    render(<LandingHero i18n={english} />);

    const [demo, code] = screen.getAllByRole('link');
    expect(demo).toHaveAccessibleName('Open the live demo');
    expect(demo).toHaveAttribute('href', 'https://demo.pyxis-analytics.dev');
    expect(code).toHaveAccessibleName('Read the code');
    expect(code).toHaveAttribute('href', 'https://github.com/samuelcsantana/pyxis-api');
    expect(screen.getByText(/No sign-up\. Invented data\./)).toBeInTheDocument();
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    render(<LandingHero i18n={portuguese} />);

    expect(screen.getByRole('link', { name: 'Abrir a demonstração' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver o código' })).toBeInTheDocument();
  });
});
