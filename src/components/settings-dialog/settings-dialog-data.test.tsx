import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadSettingsDialog } from '@/app/[projectId]/settings/dialog-actions';
import type { Account } from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import type { ProjectSettings } from '@/domain/project-settings';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { english, englishTranslator } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { readSettingsDialogData } from './settings-dialog-data';
import { type SettingsDialogContent, settingsDialogContentOf } from './settings-section-content';
import type { SettingsSection } from './settings-sections';

const state = vi.hoisted<{
  admin: unknown;
  role: 'owner' | 'member' | null;
  accounts: () => Promise<readonly Account[]>;
}>(() => ({
  admin: undefined,
  role: null,
  accounts: () => Promise.reject(new Error('accounts not set')),
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
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => `/${DEMO_STORE.id}/overview`,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () => Promise.resolve(state.admin),
    settings: async (projectId: string): Promise<ProjectSettings> => {
      const settings = await new MockProjectsService(englishTranslator).settings(projectId);
      return state.role === null ? settings : { ...settings, role: state.role };
    },
  }),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
}));

const STORE = {
  id: DEMO_STORE.id,
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'signup_completed',
};
const ADMIN: Admin = { email: 'owner@example.com', projects: [STORE] };

beforeEach(() => {
  state.admin = ADMIN;
  state.role = null;
  state.accounts = () => new MockAccountsService(() => new Date()).list();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

async function renderSettingsDialog(projectId: string): Promise<SettingsDialogContent> {
  return settingsDialogContentOf(await readSettingsDialogData(projectId), english);
}

function show(content: SettingsDialogContent, section: SettingsSection) {
  return renderWithMessages(<>{content.content[section]}</>);
}

describe('the settings of the dialog', () => {
  it('gives the owner every section, the export and the deletion included', async () => {
    const content = await renderSettingsDialog(DEMO_STORE.id);

    expect(content.sections).toContain('data');
    expect(content.sections).toContain('share');
    expect(content.sections).toHaveLength(15);
  });

  it('shows the email, the appearance and the language in General', async () => {
    const content = await renderSettingsDialog(DEMO_STORE.id);

    show(content, 'general');

    expect(screen.getByText('owner@example.com')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Theme' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /English/ })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
  });

  it('lets the owner change the project, with its activity next to it', async () => {
    const content = await renderSettingsDialog(DEMO_STORE.id);

    show(content, 'project');
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('My site');
    expect(screen.getByRole('region', { name: 'Activity' })).toBeInTheDocument();
  });

  it('lets the owner manage the goals', async () => {
    const content = await renderSettingsDialog(DEMO_STORE.id);

    show(content, 'goals');
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(DEMO_STORE.goals.length);
    expect(screen.getByRole('button', { name: 'Add a goal' })).toBeInTheDocument();
  });

  it('gives every section its own content', async () => {
    const content = await renderSettingsDialog(DEMO_STORE.id);
    const expectations: Readonly<Record<SettingsSection, RegExp>> = {
      general: /Appearance/,
      billing: /Events this month/,
      security: /Sessions/,
      tokens: /Access tokens/,
      apps: /Connected apps/,
      install: /Install Pyxis on your site/,
      project: /Activity/,
      goals: /Sign-upFirstEvent signup_completed/,
      share: /Monthly board report/,
      privacy: /Visitor’s city/,
      keys: /New public key/,
      people: /People/,
      email: /Weekly digest/,
      data: /Export events/,
      help: /hello@pyxis-analytics\.dev/,
    };

    for (const [section, text] of Object.entries(expectations)) {
      const { container, unmount } = show(content, section as SettingsSection);
      expect(container).toHaveTextContent(text);
      unmount();
    }
  });

  it('shows a member the project, its keys and its privacy without changing them', async () => {
    state.role = 'member';

    const content = await renderSettingsDialog(DEMO_STORE.id);

    expect(content.sections).not.toContain('data');
    expect(content.sections).not.toContain('share');
    show(content, 'project').unmount();
    show(content, 'privacy');
    expect(screen.queryByRole('switch')).toBeNull();
    show(content, 'privacy').unmount();
    show(content, 'people');
    expect(screen.queryByRole('button', { name: /Add/ })).toBeNull();
    show(content, 'people').unmount();
    show(content, 'keys');
    expect(screen.queryByRole('button', { name: 'New public key' })).toBeNull();
    expect(screen.getByText(/pyxis_pk_/)).toBeInTheDocument();
    show(content, 'keys').unmount();
    show(content, 'goals');
    expect(screen.getByText('Sign-up')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull();
  });

  it('tells someone who owns no account that the billing is with the owner', async () => {
    state.accounts = () => Promise.resolve([]);

    const content = await renderSettingsDialog(DEMO_STORE.id);

    show(content, 'billing');
    expect(screen.getByText(/You do not own a Pyxis account/)).toBeInTheDocument();
  });

  it('are read by the server action of the dialog as plain data', async () => {
    const data = await loadSettingsDialog(DEMO_STORE.id);

    expect(data.projectId).toBe(DEMO_STORE.id);
    expect(data.email).toBe('owner@example.com');
    expect(data.owner).toBe(true);
    expect(JSON.parse(JSON.stringify(data))).toEqual(data);
  });
});
