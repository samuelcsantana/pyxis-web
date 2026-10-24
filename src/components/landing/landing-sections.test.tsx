import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { DashboardAnswersSection, demoScreenUrl, SCREENS_SHOWN } from './dashboard-answers-section';
import {
  AGENT_PROMPT_ID,
  AGENT_ROBOT_ID_PREFIX,
  CODING_AGENTS,
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
    expect(section.querySelector('#install-command')?.parentElement).toHaveClass('py-4.5', 'pr-24');
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
    expect(prompt?.parentElement).toHaveClass('pt-13', 'pr-5', 'sm:pt-4.5', 'sm:pr-24');
    expect(within(agent).getByText('llms.txt').tagName).toBe('CODE');
    expect(agent).toHaveTextContent(
      'After you create the account and the project, the dashboard’s Install screen has a request like this one ready, with your project’s key in place of pyxis_pk_….',
    );
    expect(within(agent).getByText('pyxis_pk_…').tagName).toBe('CODE');
    expect(prompt?.compareDocumentPosition(within(agent).getByText('pyxis_pk_…'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
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

    const agent = screen.getByRole('group', { name: 'Ou peça ao seu agente de IA' });
    expect(agent).toHaveTextContent(
      'Instale o Pyxis neste site seguindo https://pyxis-analytics.dev/llms.txt.',
    );
    expect(agent).toHaveTextContent(
      'Depois de criar a conta e o projeto, a tela Instalação do painel traz um pedido como este já pronto, com a chave do seu projeto no lugar de pyxis_pk_….',
    );
    expect(within(agent).getByText('Instale sem escrever código')).toBeInTheDocument();
    expect(
      within(agent).getByRole('list', { name: 'Funciona com agentes de código como' }),
    ).toHaveTextContent('e outros que leem o llms.txt');
    expect(
      within(agent).getByRole('button', { name: 'Copiar o pedido para o agente' }),
    ).toBeInTheDocument();
  });

  it('highlights the agent card with a badge above its title and a robot in its corner', () => {
    render(<InstallSection i18n={english} signUpOpen />);

    const agent = screen.getByRole('group', { name: 'Or ask your AI agent' });
    const badge = within(agent).getByText('Install without writing code');
    const title = within(agent).getByRole('heading', { name: 'Or ask your AI agent' });
    expect(agent).toHaveClass('landing-agent-card');
    expect(badge).toHaveClass('landing-agent-badge');
    expect(badge.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(title).toHaveClass('text-[1.6rem]', 'sm:text-[2rem]');
    const robot = agent.querySelector('.landing-agent-robot');
    expect(robot).toHaveAttribute('aria-hidden', 'true');
    expect(robot?.querySelector(`#${AGENT_ROBOT_ID_PREFIX}-head`)).not.toBeNull();
  });

  it('names the coding agents it works with, in plain text with no brand logo', () => {
    render(<InstallSection i18n={english} signUpOpen />);

    const agents = screen.getByRole('list', { name: 'Works with coding agents such as' });
    const chips = within(agents).getAllByRole('listitem');
    expect(chips.map((chip) => chip.textContent)).toEqual([
      'Claude Code',
      'Cursor',
      'Codex',
      'GitHub Copilot',
      'Gemini CLI',
      'Windsurf',
      'and others that read llms.txt',
    ]);
    expect(chips).toHaveLength(CODING_AGENTS.length + 1);
    expect(agents.querySelector('svg, img')).toBeNull();
    expect(chips.at(-1)).toHaveClass('border-dashed');
  });

  it('copies the same request from a large button under it, counted apart', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<InstallSection i18n={english} signUpOpen />);

    const agent = screen.getByRole('group', { name: 'Or ask your AI agent' });
    const button = within(agent).getByRole('button', { name: 'Copy the request for your agent' });
    expect(button).toHaveClass('landing-copy-prominent');
    expect(button).toHaveAttribute('data-track', 'snippet_copied');
    expect(button).toHaveAttribute('data-track-snippet', AGENT_PROMPT_ID);
    expect(button).toHaveAttribute('data-track-button', 'prominent');
    expect(agent.querySelector(`#${AGENT_PROMPT_ID}`)?.compareDocumentPosition(button)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );

    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledWith(agent.querySelector(`#${AGENT_PROMPT_ID}`)?.textContent);
    expect(
      within(agent).getByRole('button', { name: 'Request copied. Paste it into your agent' }),
    ).toBeInTheDocument();
  });

  it('points to trackRequest under the code, so the failing calls the hero promises have a way in', () => {
    render(<InstallSection i18n={english} signUpOpen={false} />);

    const sentence = screen.getByText(/To see which calls to your API fail/);
    const link = within(sentence).getByRole('link', { name: 'See the example' });
    expect(sentence).toHaveTextContent(
      'To see which calls to your API fail, wrap your HTTP client once with trackRequest(). See the example',
    );
    expect(within(sentence).getByText('trackRequest()').tagName).toBe('CODE');
    expect(link).toHaveAttribute('href', 'https://github.com/samuelcsantana/pyxis-sdk#api');
    expect(link).toHaveAttribute('data-track', 'docs_opened');
    expect(link).toHaveAttribute('data-track-doc', 'track_request');
    expect(screen.getByText('npm install pyxis-analytics').compareDocumentPosition(sentence)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('points to trackRequest in the reader’s language', () => {
    render(<InstallSection i18n={portuguese} signUpOpen />);

    expect(screen.getByText(/Para ver quais chamadas à sua API falham/)).toHaveTextContent(
      'Para ver quais chamadas à sua API falham, envolva o seu cliente HTTP uma vez com trackRequest(). Ver o exemplo',
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
