import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { LandingFooter } from './landing-footer';

function linksUnder(heading: string): readonly (readonly [string, string | null])[] {
  const column = screen.getByRole('heading', { name: heading }).parentElement ?? document.body;
  return within(column)
    .getAllByRole('link')
    .map((link) => [link.textContent, link.getAttribute('href')] as const);
}

const SELLER = {
  name: 'Ana Exemplo',
  taxId: '000.000.000-00',
  address: 'Rua das Flores, 10, Cidade/UF',
};

describe('LandingFooter', () => {
  it('lists the product, the code and the author, each with its address', () => {
    render(<LandingFooter i18n={english} />);

    expect(linksUnder('Product')).toEqual([
      ['Live demo', 'https://demo.pyxis-analytics.dev'],
      ['Pricing', '#pricing'],
      ['Storybook', 'https://samuelcsantana.github.io/pyxis-web/'],
      ['API reference', 'https://samuelcsantana.github.io/pyxis-api/'],
      ['SDK playground', 'https://samuelcsantana.github.io/pyxis-sdk/'],
    ]);
    expect(linksUnder('Code')).toEqual([
      ['pyxis-api', 'https://github.com/samuelcsantana/pyxis-api'],
      ['pyxis-sdk', 'https://github.com/samuelcsantana/pyxis-sdk'],
      ['pyxis-web', 'https://github.com/samuelcsantana/pyxis-web'],
      ['npm', 'https://www.npmjs.com/package/pyxis-analytics'],
    ]);
    expect(linksUnder('Author')).toEqual([
      ['samuelsantana.dev', 'https://www.samuelsantana.dev'],
      ['hello@pyxis-analytics.dev', 'mailto:hello@pyxis-analytics.dev'],
    ]);
  });

  it('shows the measurement note it is given beside the credits', () => {
    render(<LandingFooter i18n={english} note={<p>Measured by Pyxis</p>} />);

    expect(screen.getByRole('contentinfo')).toHaveTextContent('Measured by Pyxis');
  });

  it('tags the demo and code links for the page measurement', () => {
    render(<LandingFooter i18n={english} />);

    expect(screen.getByRole('link', { name: 'Live demo' })).toHaveAttribute(
      'data-track-from',
      'footer',
    );
    expect(screen.getByRole('link', { name: 'npm' })).toHaveAttribute('data-track-repo', 'npm');
  });

  it('names the product, its promise and who made it', () => {
    render(<LandingFooter i18n={english} />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('Privacy-first product analytics.');
    expect(footer).toHaveTextContent('Made by Samuel Santana · MIT License');
  });

  it('shows no contract and no seller while the seller is not configured', () => {
    render(<LandingFooter i18n={english} />);

    expect(screen.queryByRole('heading', { name: 'Contract' })).toBeNull();
    expect(screen.getByRole('contentinfo')).not.toHaveTextContent('CPF');
  });

  it('links the contract in Portuguese and identifies the seller once configured', () => {
    render(<LandingFooter i18n={english} seller={SELLER} />);

    expect(linksUnder('Contract')).toEqual([
      ['Terms of Use', '/termos'],
      ['Privacy Policy', '/privacidade'],
      ['Data Processing Agreement', '/acordo-de-tratamento'],
    ]);
    expect(screen.getByRole('link', { name: 'Terms of Use' })).toHaveAttribute('hreflang', 'pt-BR');
    expect(screen.getByText('In Portuguese, the language of the contract.')).toBeVisible();
    expect(
      screen.getByText(
        'Sold by Ana Exemplo · CPF 000.000.000-00 · Rua das Flores, 10, Cidade/UF · hello@pyxis-analytics.dev',
      ),
    ).toBeVisible();
  });

  it('needs no note about the language on the Portuguese page', () => {
    render(<LandingFooter i18n={portuguese} seller={SELLER} />);

    expect(linksUnder('Contrato')[0]).toEqual(['Termos de Uso', '/termos']);
    expect(screen.queryByText('Em português, a língua do contrato.')).toBeNull();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Fornecedor: Ana Exemplo');
  });
});
