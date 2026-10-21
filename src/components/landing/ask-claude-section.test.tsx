import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { claudeCodeCommand } from '@/domain/connections';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import {
  AskClaudeSection,
  CLAUDE_CODE_COMMAND,
  CLAUDE_DIRECTORY_ID,
  CONNECTOR_ADDRESS,
  CONVERSATION_TOOLS,
  PROMISES,
} from './ask-claude-section';
import { codeTextOf } from './install-section';
import { ASK_CLAUDE_ID, HOSTED_CONNECTOR_URL } from './landing-links';

describe('AskClaudeSection', () => {
  it('names itself by its title, under the ask-claude anchor', () => {
    render(<AskClaudeSection i18n={english} />);

    const section = screen.getByRole('region', {
      name: 'Ask Claude instead of digging through charts',
    });
    expect(section).toHaveAttribute('id', ASK_CLAUDE_ID);
    expect(section).toHaveTextContent('It comes with the plan, at no extra cost.');
  });

  it('plays an invented conversation, naming the tools Claude read', () => {
    render(<AskClaudeSection i18n={english} />);

    const example = screen.getByRole('figure', { name: 'An example conversation' });
    expect(example).toHaveTextContent(
      'How did last week go, and where does the sign-up lose people?',
    );
    expect(example).toHaveTextContent('MCP connected');
    expect(within(example).getByRole('button', { name: 'Replay' })).toBeInTheDocument();
    expect([...example.querySelectorAll('code')].map((tool) => tool.textContent)).toEqual(
      CONVERSATION_TOOLS.map((tool) => tool),
    );
    expect(example).toHaveTextContent('Invented conversation and numbers, like the live demo.');
  });

  it('leads with Claude’s connector directory, before the custom connector', () => {
    const { container } = render(<AskClaudeSection i18n={english} />);

    const directory = container.querySelector(`#${CLAUDE_DIRECTORY_ID}`);
    expect(directory).toHaveTextContent('New Pyxis is in Claude’s connector directory');
    expect(directory).toHaveTextContent(
      'It works in Claude on the web, on your computer and on your phone.',
    );
    const open = within(directory as HTMLElement).getByRole('link', {
      name: 'Open in Claude’s directory',
    });
    expect(open).toHaveAttribute('href', 'https://claude.ai/directory/pyxis');
    expect(open).toHaveAttribute('data-track', 'claude_directory_opened');
    expect(open).toHaveAttribute('data-track-from', 'ask-claude');
    const custom = screen.getByText('Or add it as a custom connector:');
    expect(directory?.compareDocumentPosition(custom)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getAllByText(/It works in Claude on the web/)).toHaveLength(1);
  });

  it('gives the steps of the dashboard, the address and the Claude Code command to copy', () => {
    const { container } = render(<AskClaudeSection i18n={english} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Connect in a minute' })).toBeVisible();
    expect(screen.getByText(/open Customize, then Connectors/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Copy' })).toHaveLength(2);
    expect(container.querySelector('#ask-claude-address')).toHaveTextContent(
      'https://api.pyxis-analytics.dev/mcp',
    );
    expect(container.querySelector('#ask-claude-command')).toHaveTextContent(
      'claude mcp add --transport http pyxis https://api.pyxis-analytics.dev/mcp',
    );
  });

  it('copies exactly the address and the command the dashboard gives', () => {
    expect(codeTextOf(CONNECTOR_ADDRESS)).toBe(HOSTED_CONNECTOR_URL);
    expect(codeTextOf(CLAUDE_CODE_COMMAND)).toBe(claudeCodeCommand(HOSTED_CONNECTOR_URL));
  });

  it('promises it only reads, can be revoked and hands over nothing personal', () => {
    render(<AskClaudeSection i18n={english} />);

    const promises = screen.getAllByRole('heading', { level: 3 }).slice(1);
    expect(promises.map((heading) => heading.textContent)).toEqual([
      'Only reads',
      'Yours to revoke',
      'Nothing personal to hand over',
    ]);
    expect(promises).toHaveLength(PROMISES.length);
  });

  it('links to the full guide and says where the data goes', () => {
    render(<AskClaudeSection i18n={english} />);

    const guide = screen.getByRole('link', { name: 'The full guide' });
    expect(guide).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-mcp#connect-from-claude',
    );
    expect(guide).toHaveAttribute('data-track', 'docs_opened');
    expect(guide).toHaveAttribute('data-track-doc', 'mcp');
    expect(screen.getByText(/goes from the Pyxis API to Anthropic/)).toBeInTheDocument();
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    render(<AskClaudeSection i18n={portuguese} />);

    expect(
      screen.getByRole('region', { name: 'Pergunte ao Claude em vez de garimpar gráficos' }),
    ).toBeInTheDocument();
    const example = screen.getByRole('figure', { name: 'Um exemplo de conversa' });
    expect(example).toHaveTextContent('Como foi a semana passada');
    expect(screen.getByRole('link', { name: 'Abrir no diretório do Claude' })).toBeInTheDocument();
    expect(within(example).getByRole('button', { name: 'Repetir' })).toBeInTheDocument();
  });
});
