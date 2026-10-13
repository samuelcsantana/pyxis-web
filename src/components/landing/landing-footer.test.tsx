import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { LandingFooter } from './landing-footer';

function linksUnder(heading: string): readonly (readonly [string, string | null])[] {
  const column = screen.getByRole('heading', { name: heading }).parentElement ?? document.body;
  return within(column)
    .getAllByRole('link')
    .map((link) => [link.textContent, link.getAttribute('href')] as const);
}

describe('LandingFooter', () => {
  it('lists the product, the code and the author, each with its address', () => {
    render(<LandingFooter i18n={english} />);

    expect(linksUnder('Product')).toEqual([
      ['Live demo', 'https://demo.pyxis-analytics.dev'],
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
    expect(linksUnder('Author')).toEqual([['samuelsantana.dev', 'https://www.samuelsantana.dev']]);
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
});
