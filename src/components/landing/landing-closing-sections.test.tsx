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
    expect(within(practices ?? section).getAllByRole('listitem')).toHaveLength(6);
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

  it('opens with the two real sites it measures, each a tracked link', () => {
    render(<BuiltInPublicSection i18n={english} />);

    const section = screen.getByRole('region');
    const [practices] = within(section).getAllByRole('list');
    const [first] = within(practices ?? section).getAllByRole('listitem');
    expect(first).toHaveTextContent(
      'Measuring real sites since October 2026, bolsoverde.com and the author’s blog, neither with a cookie.',
    );
    const sites = within(first ?? section).getAllByRole('link');
    expect(
      sites.map((site) => [
        site.textContent,
        site.getAttribute('href'),
        site.getAttribute('data-track'),
        site.getAttribute('data-track-site'),
      ]),
    ).toEqual([
      ['bolsoverde.com', 'https://bolsoverde.com', 'site_opened', 'bolsoverde.com'],
      ['the author’s blog', 'https://www.samuelsantana.dev', 'site_opened', 'samuelsantana.dev'],
    ]);
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
    expect(screen.getAllByRole('rowheader')).toHaveLength(8);
    const agentsRow = screen.getByRole('row', { name: /Ask an AI agent about the numbers/ });
    expect(agentsRow).toHaveTextContent('Yes: a connector for Claude, only reading');
    expect(screen.getByText(/not any one product/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Comparison table' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('table')).toHaveAccessibleName('Pyxis and a typical cookie-based tag');
  });
});

describe('ComparisonSection capabilities', () => {
  it('compares the failed requests of each visit and the size of the code a site loads, before the source code', () => {
    render(<ComparisonSection i18n={english} />);

    const aspects = screen.getAllByRole('rowheader').map((header) => header.textContent);
    expect(aspects.slice(-3)).toEqual([
      'The site’s requests that failed, in each visit',
      'Size of the code the site loads, gzipped',
      'Source code',
    ]);
    const cellsOf = (name: RegExp) =>
      within(screen.getByRole('row', { name }))
        .getAllByRole('cell')
        .map((cell) => cell.textContent);
    expect(cellsOf(/requests that failed/)).toEqual([
      'Yes: route, status and duration',
      'Depends on the tool',
    ]);
    expect(cellsOf(/Size of the code the site loads/)).toEqual([
      'Under 5 KB',
      'Usually 30 to 150 KB',
    ]);
  });
});

describe('FaqSection', () => {
  it('opens the first question and keeps the others folded', () => {
    const { container } = render(<FaqSection i18n={english} signUpOpen={false} />);

    const items = container.querySelectorAll('details');
    expect(items).toHaveLength(15);
    expect([...items].map((item) => item.open)).toEqual([
      true,
      ...Array.from({ length: 14 }, () => false),
    ]);
    expect(screen.getByText('Does Pyxis set cookies on my visitors?')).toBeInTheDocument();
    expect(items[0]?.parentElement).toHaveClass('landing-faq');
    expect(items[0]).toHaveClass('landing-reveal');
  });

  it('answers what the hosted plan costs and how to leave it', () => {
    render(<FaqSection i18n={english} signUpOpen={false} />);

    expect(screen.getByText('How much does it cost?')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 39 a month or R\$ 390 a year/)).toBeInTheDocument();
    expect(screen.getByText(/deleted 30 days after access ends/)).toBeInTheDocument();
    expect(screen.getByText(/request access at hello@pyxis-analytics\.dev/)).toBeInTheDocument();
  });

  it('answers agencies, people who do not code and people who want an AI to install it', () => {
    const { container } = render(<FaqSection i18n={english} signUpOpen={false} />);

    const questions = [...container.querySelectorAll('summary')].map((summary) =>
      summary.textContent.replace('+', ''),
    );
    const afterUse = questions.indexOf('Can I use it on my site?') + 1;
    expect(questions.slice(afterUse, afterUse + 3)).toEqual([
      'Can I use Pyxis on my clients’ sites?',
      'I don’t code. Can I install it?',
      'Can I ask an AI to install it?',
    ]);
    expect(screen.getByText(/is not reselling\./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms of Use' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/en/terms',
    );
    expect(screen.getByText('https://pyxis-analytics.dev/llms.txt').tagName).toBe('CODE');
  });

  it('sets the names of code in code type', () => {
    render(<FaqSection i18n={english} signUpOpen={false} />);

    expect(screen.getByText('sessionStorage').tagName).toBe('CODE');
    expect(screen.getByText('optOut()').tagName).toBe('CODE');
  });

  it('never says the dashboard has a single cookie', () => {
    render(<FaqSection i18n={portuguese} signUpOpen={false} />);

    expect(screen.getByRole('region', { name: 'Perguntas frequentes' })).toHaveTextContent(
      'Cookies só existem no próprio painel do Pyxis',
    );
  });

  it('states the monthly limit as the terms do: warnings, then a pause, never a charge', () => {
    render(<FaqSection i18n={english} signUpOpen={false} />);

    expect(screen.getByText(/At 150%, the account stops taking events/)).toBeInTheDocument();
    expect(screen.getByText(/Nothing is ever charged beyond the price/)).toBeInTheDocument();
    expect(screen.getByText(/14 days without paying, once per customer/)).toBeInTheDocument();
  });

  it('invites anyone in Brazil to sign up and links the terms once sign-up is open', () => {
    render(<FaqSection i18n={english} signUpOpen />);

    expect(screen.getByText(/Anyone in Brazil can sign up/)).toBeInTheDocument();
    expect(screen.queryByText(/request access at hello@pyxis-analytics\.dev/)).toBeNull();
    const cancel = screen.getByText(/have the details\./);
    const terms = within(cancel).getByRole('link', { name: 'Terms of Use' });
    expect(terms).toHaveAttribute('href', 'https://pyxis-analytics.dev/en/terms');
    expect(terms).toHaveAttribute('hreflang', 'en');
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
