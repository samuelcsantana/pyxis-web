import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { AUDIENCES, WHO_IT_IS_FOR_ID, WhoItIsForSection } from './who-it-is-for-section';

function cardLink(name: string): HTMLElement {
  const card = screen.getByRole('heading', { level: 3, name }).closest('a');
  if (card === null) {
    throw new Error(`No card is titled ${name}.`);
  }
  return card;
}

describe('WhoItIsForSection', () => {
  it('names itself by its title, under the for-whom anchor, with one card per audience', () => {
    render(<WhoItIsForSection i18n={english} />);

    const section = screen.getByRole('region', {
      name: 'For anyone who needs to know where people stop',
    });
    expect(section).toHaveAttribute('id', WHO_IT_IS_FOR_ID);
    expect(section).toHaveTextContent('The same dashboard, three ways to use it.');
    const titles = within(section)
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual([
      'An online shop or business',
      'A developer or an agency',
      'A product or SaaS',
    ]);
    expect(titles).toHaveLength(AUDIENCES.length);
  });

  it('opens the demo’s funnel from the shop card', () => {
    render(<WhoItIsForSection i18n={english} />);

    const store = cardLink('An online shop or business');
    expect(store).toHaveAttribute(
      'href',
      'https://demo.pyxis-analytics.dev/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/funnel',
    );
    expect(store).toHaveAttribute('data-track', 'demo_opened');
    expect(store).toHaveAttribute('data-track-from', 'for-whom');
    expect(store).toHaveAttribute('data-track-screen', 'funnel');
    expect(store).toHaveTextContent('cart, delivery or payment');
  });

  it('leads the agency card to the pricing, and the product card to the dashboard’s screens', () => {
    render(<WhoItIsForSection i18n={english} />);

    const agency = cardLink('A developer or an agency');
    expect(agency).toHaveAttribute('href', '#pricing');
    expect(agency).toHaveAttribute('data-track', 'pricing_opened');
    expect(agency).toHaveAttribute('data-track-from', 'for-whom');
    expect(agency).toHaveTextContent('Up to 3 sites and 3 people per account');
    const product = cardLink('A product or SaaS');
    expect(product).toHaveAttribute('href', '#dashboard');
    expect(product).not.toHaveAttribute('data-track');
  });

  it('tells whoever does not code who can install it, and where', () => {
    render(<WhoItIsForSection i18n={english} />);

    expect(screen.getByText(/The install can be done by an AI agent/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'How to install' })).toHaveAttribute(
      'href',
      '#install',
    );
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    render(<WhoItIsForSection i18n={portuguese} />);

    expect(
      screen.getByRole('region', { name: 'Para quem precisa saber onde as pessoas param' }),
    ).toBeInTheDocument();
    expect(cardLink('Dev ou agência')).toHaveTextContent('Ver preço');
    expect(screen.getByRole('link', { name: 'Como instalar' })).toBeInTheDocument();
  });
});
