import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { ArchitectureSection } from './architecture-section';
import { BuiltInPublicSection } from './built-in-public-section';
import { ComparisonSection } from './comparison-section';
import { FaqSection } from './faq-section';
import { StorySection } from './story-section';

describe('BuiltInPublicSection', () => {
  it('lists how the code is made and links to the public documentation', () => {
    render(<BuiltInPublicSection i18n={english} />);

    const section = screen.getByRole('region', { name: 'Built in public' });
    expect(section).toHaveAttribute('id', 'built-in-public');
    const [practices, documents] = within(section).getAllByRole('list');
    expect(within(practices ?? section).getAllByRole('listitem')).toHaveLength(5);
    expect(practices).toHaveTextContent('CI fails below that.');
    expect(
      within(documents ?? section)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([
      'https://samuelcsantana.github.io/pyxis-web/',
      'https://samuelcsantana.github.io/pyxis-api/',
      'https://samuelcsantana.github.io/pyxis-sdk/',
    ]);
    expect(screen.getByRole('link', { name: /^API reference/ })).toHaveTextContent(
      'Generated from the routes’ own schemas',
    );
  });
});

describe('ArchitectureSection', () => {
  it('follows an event from the site to the database, with the parts beside it', () => {
    render(<ArchitectureSection i18n={english} />);

    const section = screen.getByRole('region', { name: 'How the pieces fit' });
    const [flow, beside] = within(section).getAllByRole('list');
    expect(
      within(flow ?? section)
        .getAllByRole('listitem')
        .map((step) => step.firstChild?.textContent),
    ).toEqual(['Your site', 'CloudFront', 'API', 'Postgres']);
    expect(flow?.tagName).toBe('OL');
    expect(beside).toHaveTextContent('Deletes events after 13 months');
  });
});

describe('ComparisonSection', () => {
  it('compares row by row, with headers for each column and each row', () => {
    render(<ComparisonSection i18n={english} />);

    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Aspect',
      'Pyxis',
      'Typical cookie-based tag',
    ]);
    const cookieRow = screen.getByRole('row', { name: /Cookie on your visitors/ });
    expect(
      within(cookieRow)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['None', 'An id cookie, usually kept for months']);
    expect(screen.getAllByRole('rowheader')).toHaveLength(5);
    expect(screen.getByText(/not any one product/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Comparison table' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('table')).toHaveAccessibleName('Pyxis and a typical cookie-based tag');
  });
});

describe('FaqSection', () => {
  it('opens the first question and keeps the others folded', () => {
    const { container } = render(<FaqSection i18n={english} />);

    const items = container.querySelectorAll('details');
    expect(items).toHaveLength(11);
    expect([...items].map((item) => item.open)).toEqual([
      true,
      ...Array.from({ length: 10 }, () => false),
    ]);
    expect(screen.getByText('Does Pyxis set cookies on my visitors?')).toBeInTheDocument();
    expect(items[0]?.parentElement).toHaveClass('landing-faq');
    expect(items[0]).toHaveClass('landing-reveal');
  });

  it('answers what the hosted plan costs and how to leave it', () => {
    render(<FaqSection i18n={english} />);

    expect(screen.getByText('How much does it cost?')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 39 a month or R\$ 390 a year/)).toBeInTheDocument();
    expect(screen.getByText(/deleted 30 days later/)).toBeInTheDocument();
    expect(screen.getByText(/request access at hello@pyxis-analytics\.dev/)).toBeInTheDocument();
  });

  it('sets the names of code in code type', () => {
    render(<FaqSection i18n={english} />);

    expect(screen.getByText('sessionStorage').tagName).toBe('CODE');
    expect(screen.getByText('optOut()').tagName).toBe('CODE');
  });

  it('never says the dashboard has a single cookie', () => {
    render(<FaqSection i18n={portuguese} />);

    expect(screen.getByRole('region', { name: 'Perguntas frequentes' })).toHaveTextContent(
      'Cookies só existem no próprio painel do Pyxis',
    );
  });
});

describe('StorySection', () => {
  it('links to the introduction post in the language of the page', () => {
    const { unmount } = render(<StorySection i18n={english} />);

    expect(screen.getByRole('region', { name: 'Why Pyxis exists' })).toHaveAttribute('id', 'story');
    expect(screen.getByRole('link', { name: 'Read the post' })).toHaveAttribute(
      'href',
      'https://www.samuelsantana.dev/en/blog/pyxis-analytics-without-cookies-ip-or-personal-data',
    );
    unmount();

    render(<StorySection i18n={portuguese} />);

    expect(screen.getByRole('link', { name: 'Ler o post' })).toHaveAttribute(
      'href',
      'https://www.samuelsantana.dev/blog/pyxis-analytics-sem-cookie-sem-ip-sem-dado-pessoal',
    );
  });
});
