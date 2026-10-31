import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProjectSettings } from '@/domain/project-settings';
import { english } from '@/test-utils/english';
import { InstallGuide } from './install-guide';

const navigation = vi.hoisted(() => ({ search: '' }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const SETTINGS: ProjectSettings = {
  id: 'p-store',
  accountId: 'a1',
  role: 'owner',
  name: 'Demo Store',
  timezone: 'UTC',
  conversionEvent: null,
  cityEnabled: false,
  allowedOrigins: ['https://store.example.com'],
  createdAt: '2026-11-20T12:00:00.000Z',
  firstEventAt: null,
  lastEventAt: null,
  eventRetentionMonths: 13,
  publicKeys: [{ id: 'k1', key: 'pyxis_pk_store', createdAt: '2026-11-20T12:00:00.000Z' }],
  secretKeys: [],
  deletionHeldAt: null,
};

const RECEIVING: ProjectSettings = {
  ...SETTINGS,
  firstEventAt: '2026-11-20T12:01:00.000Z',
  lastEventAt: '2026-11-20T12:01:00.000Z',
};

const WITHOUT_KEY: ProjectSettings = { ...SETTINGS, publicKeys: [], allowedOrigins: [] };

function showGuide(settings: ProjectSettings) {
  return render(
    <InstallGuide settings={settings} endpoint="https://api.example.com" i18n={english} />,
  );
}

function firstStep() {
  return screen.getByRole('region', { name: '1. Install Pyxis on your site' });
}

function thirdStep() {
  return screen.getByRole('region', { name: '3. Check with Claude (optional)' });
}

describe('InstallGuide', () => {
  beforeEach(() => {
    navigation.search = '';
  });

  it('shows the snippets with the key, both ways to install, and waits for the first event', async () => {
    showGuide(SETTINGS);

    expect(within(firstStep()).getByRole('tabpanel', { name: 'Yourself' })).toHaveTextContent(
      'npm install pyxis-analytics',
    );
    expect(document.getElementById('install-module')).toHaveTextContent('pyxis_pk_store');
    const second = screen.getByRole('region', { name: '2. Open a page of your site' });
    expect(second).toHaveTextContent('Page views from https://store.example.com show up here');
    expect(within(second).getByRole('status')).toHaveTextContent('Waiting for the first event…');
    expect(screen.queryByRole('link', { name: 'Open the dashboard' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'With an AI agent' }));

    expect(document.getElementById('install-agent-prompt')).toHaveTextContent(
      'The project’s public key is pyxis_pk_store, the endpoint is https://api.example.com and the site is at https://store.example.com.',
    );
  });

  it('titles its steps as h2 on its own page, with what the agent changes as h3 under them', async () => {
    showGuide(SETTINGS);

    expect(
      screen.getByRole('heading', { level: 2, name: '1. Install Pyxis on your site' }),
    ).toHaveAttribute('id', 'install-step-1');
    await userEvent.click(screen.getByRole('tab', { name: 'With an AI agent' }));
    expect(
      screen.getByRole('heading', { level: 3, name: 'What the agent will change' }),
    ).toHaveAttribute('id', 'install-agent-changes');
  });

  it('sends the Claude connection to the connected apps of the account, a window away', () => {
    showGuide(SETTINGS);

    expect(within(thirdStep()).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/account/apps',
    );
    expect(document.getElementById('install-claude-code')).toHaveTextContent(
      'claude mcp add --transport http pyxis https://api.example.com/mcp',
    );
  });

  it('sends the owner of a project without a live key to the keys of the settings', () => {
    showGuide(WITHOUT_KEY);

    expect(firstStep()).toHaveTextContent(
      'This project has no live public key, so it is not measuring.',
    );
    expect(within(firstStep()).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings/keys',
    );
    expect(within(firstStep()).queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: '2. Open a page of your site' })).toHaveTextContent(
      'Page views from show up here',
    );
  });

  it("tells someone else that only the account's owner creates a key, with no link", () => {
    showGuide({ ...SETTINGS, role: 'member', publicKeys: [] });

    expect(firstStep()).toHaveTextContent("Only the account's owner can create one.");
    expect(within(firstStep()).queryByRole('link')).not.toBeInTheDocument();
  });

  it('opens the dashboard and suggests a first question once the first event arrived', () => {
    showGuide(RECEIVING);

    expect(screen.getByRole('status')).toHaveTextContent('The first event arrived.');
    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toHaveAttribute(
      'href',
      '/p-store/overview',
    );
    expect(document.getElementById('install-first-question')).toHaveTextContent(
      'How many visits did Demo Store get today, and where did they come from?',
    );
  });

  it('keeps the period and the filters it was opened with in its links to the windows and the dashboard', () => {
    navigation.search = 'range=today&device=mobile';
    const { unmount } = showGuide(WITHOUT_KEY);

    expect(within(firstStep()).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p-store/settings/keys?range=today&device=mobile',
    );
    expect(within(thirdStep()).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/account/apps?range=today&device=mobile',
    );
    unmount();

    showGuide(RECEIVING);

    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toHaveAttribute(
      'href',
      '/p-store/overview?range=today&device=mobile',
    );
  });
});
