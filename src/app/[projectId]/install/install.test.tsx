import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InstallGuide } from '@/components/install/install-guide';
import type { Admin } from '@/domain/admin';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import InstallPage, { generateMetadata } from './page';

const SETTINGS: ProjectSettings = {
  id: 'p-store',
  accountId: 'a1',
  role: 'owner',
  name: 'Demo Store',
  timezone: 'UTC',
  conversionEvent: null,
  allowedOrigins: ['https://store.example.com'],
  createdAt: '2026-11-20T12:00:00.000Z',
  firstEventAt: null,
  lastEventAt: null,
  eventRetentionMonths: 13,
  publicKeys: [{ id: 'k1', key: 'pyxis_pk_store', createdAt: '2026-11-20T12:00:00.000Z' }],
  secretKeys: [],
  deletionHeldAt: null,
};

const state = vi.hoisted<{ settings: () => Promise<ProjectSettings> }>(() => ({
  settings: () => Promise.reject(new Error('settings not set')),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: (): Promise<Admin> =>
      Promise.resolve({
        email: 'owner@example.com',
        projects: [{ id: 'p-store', name: 'Demo Store', timezone: 'UTC', conversionEvent: null }],
      }),
    settings: () => state.settings(),
  }),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ refresh: vi.fn() }),
}));

const PARAMS = { params: Promise.resolve({ projectId: 'p-store' }) };

describe('InstallPage', () => {
  beforeEach(() => {
    state.settings = () => Promise.resolve(SETTINGS);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows the snippets with the key and the API it talks to', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await InstallPage(PARAMS));

    expect(screen.getByRole('heading', { level: 1, name: 'Install' })).toBeInTheDocument();
    expect(
      screen.getByText(
        /init\(\{ key: 'pyxis_pk_store', endpoint: 'https:\/\/api\.pyxis\.example\.com' \}\);$/m,
      ),
    ).toBeInTheDocument();
  });

  it('points the demo at the hosted API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await InstallPage(PARAMS));

    expect(screen.getAllByText(/https:\/\/api\.pyxis-analytics\.dev/).length).toBeGreaterThan(0);
  });

  it('is titled after the step and the project', async () => {
    await expect(generateMetadata(PARAMS)).resolves.toEqual({ title: 'Install · Demo Store' });
  });
});

describe('InstallGuide', () => {
  it('waits for the first event from the allowed origin', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const second = screen.getByRole('region', { name: '2. Open a page of your site' });
    expect(second).toHaveTextContent('Page views from https://store.example.com show up here');
    expect(within(second).getByRole('status')).toHaveTextContent('Waiting for the first event…');
    expect(screen.getAllByRole('button', { name: 'Copy' })).toHaveLength(4);
    expect(screen.queryByText(/Already connected Claude/)).not.toBeInTheDocument();
  });

  it('opens on installing it yourself, with the agent one tab away', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(within(first).getByRole('tablist', { name: 'How to install' })).toBeInTheDocument();
    expect(within(first).getByRole('tab', { name: 'Yourself' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(within(first).getByRole('tabpanel', { name: 'Yourself' })).toHaveTextContent(
      'npm install pyxis-analytics',
    );
    expect(within(first).queryByRole('tabpanel', { name: 'With an AI agent' })).toBeNull();
  });

  it("hands an AI agent a request with the project's key, API and site, and says what it changes", async () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    await userEvent.click(screen.getByRole('tab', { name: 'With an AI agent' }));

    const agent = screen.getByRole('tabpanel', { name: 'With an AI agent' });
    expect(document.getElementById('install-agent-prompt')).toHaveTextContent(
      'Install Pyxis on this site following https://pyxis-analytics.dev/llms.txt. The project’s public key is pyxis_pk_store, the endpoint is https://api.example.com and the site is at https://store.example.com.',
    );
    expect(document.getElementById('install-agent-prompt')).toHaveTextContent(
      'list the files you changed and each event you created, with its name and properties, for me to review.',
    );
    expect(
      within(agent)
        .getAllByRole('listitem')
        .slice(0, 4)
        .map((item) => item.textContent),
    ).toEqual([
      '1Open your site’s repository in Claude Code, Cursor or another coding agent.',
      '2Paste the request above and let the agent work.',
      '3Review what it changed: the package, the init and the events it lists. Remove or rename what you do not want.',
      '4Publish the site and open one of its pages. Step 2, below, says when the first event arrives.',
    ]);
    const changes = within(agent).getByRole('group', { name: 'What the agent will change' });
    expect(within(changes).getAllByRole('listitem')).toHaveLength(4);
    expect(changes).toHaveTextContent(
      'The agent only changes the site’s code. It writes nothing to Pyxis.',
    );
    expect(within(agent).getByText('llms.txt').tagName).toBe('CODE');
    expect(within(agent).getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('suggests checking the first events with Claude, read-only and revocable in Settings', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const third = screen.getByRole('region', { name: '3. Check with Claude (optional)' });
    expect(within(third).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings#settings-connections-heading',
    );
    expect(within(third).getByText('claude.ai/directory/pyxis').tagName).toBe('CODE');
    expect(document.getElementById('install-claude-code')).toHaveTextContent(
      'claude mcp add --transport http pyxis https://api.example.com/mcp',
    );
  });

  it('tells someone on a phone that installing happens on a computer, with the address to send', () => {
    render(<InstallGuide settings={SETTINGS} endpoint="https://api.example.com" i18n={english} />);

    const notice = screen.getByRole('group', { name: 'Installing happens on a computer' });
    expect(notice).toHaveClass('md:hidden');
    expect(notice).toHaveTextContent(window.location.href);
    expect(within(notice).getByRole('button', { name: 'Copy the address' })).toBeInTheDocument();
  });

  it('opens the dashboard once the first event arrived', () => {
    render(
      <InstallGuide
        settings={{
          ...SETTINGS,
          firstEventAt: '2026-11-20T12:01:00.000Z',
          lastEventAt: '2026-11-20T12:01:00.000Z',
        }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('The first event arrived.');
    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toHaveAttribute(
      'href',
      '/p-store/overview',
    );
    expect(screen.getByText('Already connected Claude? Ask it:')).toBeInTheDocument();
    expect(document.getElementById('install-first-question')).toHaveTextContent(
      'How many visits did Demo Store get today, and where did they come from?',
    );
  });

  it('sends the owner of a project without a live key to Settings instead of a snippet', () => {
    render(
      <InstallGuide
        settings={{ ...SETTINGS, publicKeys: [], allowedOrigins: [] }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(first).toHaveTextContent('This project has no live public key, so it is not measuring.');
    expect(first).toHaveTextContent('A revoked key never works again.');
    expect(within(first).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings#settings-keys-heading',
    );
    expect(within(first).queryByRole('tablist')).not.toBeInTheDocument();
    expect(within(first).queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: '2. Open a page of your site' })).toHaveTextContent(
      'Page views from show up here',
    );
  });

  it("tells someone else that only the account's owner creates a key", () => {
    render(
      <InstallGuide
        settings={{ ...SETTINGS, role: 'member', publicKeys: [] }}
        endpoint="https://api.example.com"
        i18n={english}
      />,
    );

    const first = screen.getByRole('region', { name: '1. Install Pyxis on your site' });
    expect(first).toHaveTextContent("Only the account's owner can create one.");
    expect(within(first).queryByRole('link')).not.toBeInTheDocument();
  });
});
