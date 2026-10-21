import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { DashboardAnswersSection, demoScreenUrl, SCREENS_SHOWN } from './dashboard-answers-section';
import {
  AGENT_PROMPT_ID,
  codeTextOf,
  FIRST_EVENT,
  INSTALL_COMMAND,
  InstallSection,
  START_STEPS,
} from './install-section';
import { LandingSection } from './landing-section';
import { NeverStoredSection } from './never-stored-section';
import { ScreenGlyph } from './screen-glyph';

describe('LandingSection', () => {
  it('names itself by its title, with an eyebrow and an optional lead', () => {
    render(
      <>
        <LandingSection id="one" eyebrow="First" title="With a lead" lead="The lead">
          <p>Body</p>
        </LandingSection>
        <LandingSection id="two" eyebrow="Second" title="Without a lead">
          <p>Body</p>
        </LandingSection>
      </>,
    );

    const first = screen.getByRole('region', { name: 'With a lead' });
    expect(first).toHaveAttribute('id', 'one');
    expect(first).toHaveTextContent('The lead');
    expect(
      screen.getByRole('region', { name: 'Without a lead' }).querySelectorAll('p'),
    ).toHaveLength(2);
  });
});

describe('NeverStoredSection', () => {
  it('shows what an ordinary tag would send and what is left, step by step', () => {
    render(<NeverStoredSection i18n={english} />);

    const section = screen.getByRole('region', { name: 'What never gets stored' });
    expect(section).toHaveAttribute('id', 'never-stored');
    const rows = within(section).getAllByRole('listitem');
    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveTextContent(
      'An ordinary tag would send:https://shop.example/orders/48213?email=ana@example.com&utm_source=news',
    );
    expect(rows[0]).toHaveTextContent('What is left:/orders/:id · utm_source=news');
    expect(rows[1]).toHaveTextContent('BR · BR-BA');
    expect(within(rows[3] ?? section).getByText('dropped')).toHaveClass('border-dashed');
    expect(within(rows[0] ?? section).getByText('/orders/:id · utm_source=news')).toHaveClass(
      'bg-accent/10',
    );
    expect(section).toHaveTextContent('Events are deleted after 13 months.');
  });

  it('uses a Portuguese example on the Portuguese page', () => {
    render(<NeverStoredSection i18n={portuguese} />);

    expect(screen.getByRole('region', { name: 'O que nunca é guardado' })).toHaveTextContent(
      '/pedidos/:id · utm_source=news',
    );
  });
});

describe('ScreenGlyph', () => {
  it.each(SCREENS_SHOWN)('draws a small picture of the %s screen, hidden from readers', (slug) => {
    const { container } = render(<ScreenGlyph screen={slug} />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('data-screen', slug);
    expect(svg?.childElementCount).toBeGreaterThan(0);
  });
});

describe('DashboardAnswersSection', () => {
  it('opens each of the eight screens of the demo store from a card with its question', () => {
    render(<DashboardAnswersSection i18n={english} />);

    const region = screen.getByRole('region', { name: 'What the dashboard answers' });
    const links = within(within(region).getByRole('list'))
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(links).toEqual(SCREENS_SHOWN.map(demoScreenUrl));
    expect(links[0]).toBe(
      'https://demo.pyxis-analytics.dev/6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d/overview',
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Funnel' })).toBeInTheDocument();
    expect(
      screen.getByText('Which routes of your API fail, how often and how slowly?'),
    ).toBeInTheDocument();
  });

  it('points to asking Claude further down, for those who would rather ask', () => {
    render(<DashboardAnswersSection i18n={english} />);

    const link = screen.getByRole('link', { name: 'How to connect' });
    expect(link).toHaveAttribute('href', '#ask-claude');
    expect(link).toHaveAttribute('data-track', 'ask_claude_opened');
    expect(link).toHaveAttribute('data-track-from', 'screens');
  });
});

describe('InstallSection', () => {
  it('shows the install command and the first lines, each with a copy button', () => {
    render(<InstallSection i18n={english} signUpOpen={false} />);

    const section = screen.getByRole('region', { name: 'What a site adds' });
    expect(within(section).getAllByRole('button', { name: 'Copy' })).toHaveLength(2);
    expect(section.querySelector('#install-command')).toHaveTextContent(
      'npm install pyxis-analytics',
    );
    expect(section.querySelector('#install-first-event')).toHaveTextContent(
      "track('signup_completed', { method: 'email_code' });",
    );
    expect(section).toHaveTextContent('there is no public sign-up today');
  });

  it('says the keys come with an account once sign-up is open', () => {
    render(<InstallSection i18n={english} signUpOpen />);

    expect(screen.getByRole('region', { name: 'What a site adds' })).toHaveTextContent(
      'Your keys come with your account: start the free trial below, or run your own Pyxis.',
    );
  });

  it('walks through the three steps to a first number before the code, once sign-up is open', () => {
    render(<InstallSection i18n={english} signUpOpen />);

    const steps = screen.getByRole('list', { name: 'How to start, in 3 steps' });
    const items = within(steps).getAllByRole('listitem');
    expect(items.map((item) => within(item).getByRole('heading').textContent)).toEqual([
      'Create the account and the project',
      'Install it, yourself or with an AI agent',
      'Ask',
    ]);
    expect(items).toHaveLength(START_STEPS.length);
    expect(items[0]).toHaveTextContent('1Create the account and the project');
    expect(items[0]).toHaveTextContent('14 days free');
    expect(steps.compareDocumentPosition(screen.getByText('npm install pyxis-analytics'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('leaves the steps out while sign-up is closed, since the first one is signing up', () => {
    render(<InstallSection i18n={english} signUpOpen={false} />);

    expect(screen.queryByRole('list', { name: 'How to start, in 3 steps' })).toBeNull();
  });

  it('offers a prompt to paste into an AI agent, after the code, once sign-up is open', () => {
    render(<InstallSection i18n={english} signUpOpen />);

    const agent = screen.getByRole('group', { name: 'Or ask your AI agent' });
    const prompt = agent.querySelector(`#${AGENT_PROMPT_ID}`);
    expect(agent).toHaveTextContent(
      'Open the site’s repository in Claude Code, Cursor or another agent and paste:',
    );
    expect(prompt).toHaveTextContent(
      'Install Pyxis on this site following https://pyxis-analytics.dev/llms.txt. My project’s public key is pyxis_pk_… and the endpoint is https://api.pyxis-analytics.dev. Measure the pages and record an event at each step of the order, with no personal data.',
    );
    expect(prompt).toHaveClass('whitespace-pre-wrap', 'wrap-anywhere');
    expect(prompt).not.toHaveClass('break-all');
    expect(within(agent).getByText('llms.txt').tagName).toBe('CODE');
    expect(agent).toHaveTextContent('Then connect Claude to Pyxis to check');
    expect(within(agent).getByRole('button', { name: 'Copy' })).toHaveAttribute(
      'data-track-snippet',
      AGENT_PROMPT_ID,
    );
    expect(screen.getByText('npm install pyxis-analytics').compareDocumentPosition(agent)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('leaves the agent prompt out while sign-up is closed, since it needs a project key', () => {
    render(<InstallSection i18n={english} signUpOpen={false} />);

    expect(screen.queryByRole('group', { name: 'Or ask your AI agent' })).toBeNull();
  });

  it('writes the agent prompt in the reader’s language', () => {
    render(<InstallSection i18n={portuguese} signUpOpen />);

    expect(screen.getByRole('group', { name: 'Ou peça ao seu agente de IA' })).toHaveTextContent(
      'Instale o Pyxis neste site seguindo https://pyxis-analytics.dev/llms.txt.',
    );
  });

  it('copies exactly the text it shows', () => {
    expect(codeTextOf(INSTALL_COMMAND)).toBe('npm install pyxis-analytics');
    expect(codeTextOf(FIRST_EVENT)).toBe(
      [
        "import { init, track } from 'pyxis-analytics';",
        '',
        "init({ key: 'pyxis_pk_…', endpoint: 'https://api.pyxis-analytics.dev' });",
        "track('signup_completed', { method: 'email_code' });",
      ].join('\n'),
    );
  });
});
