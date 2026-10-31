import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import {
  type AccountSectionWindowProps,
  AccountSectionWindow,
  type ProjectSectionProps,
  ProjectSectionWindow,
} from '@/app/[projectId]/settings/settings-sections';
import type { Admin } from '@/domain/admin';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { englishTranslator } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import AccountWindow from './(..)account/[[...section]]/page';
import SettingsKeysWindow from './(.)settings/keys/page';
import ModalDefault from './default';
import ModalLayout from './layout';

const KEYS_PATH = `/${DEMO_STORE.id}/settings/keys`;

const state = vi.hoisted<{
  admin: unknown;
  segments: readonly string[];
  pathname: string;
  back: () => void;
}>(() => ({
  admin: undefined,
  segments: [],
  pathname: '',
  back: () => undefined,
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
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn(), back: state.back }),
  usePathname: () => state.pathname,
  useSearchParams: () => new URLSearchParams(),
  useSelectedLayoutSegments: () => state.segments,
}));

const ADMIN: Admin = {
  email: 'owner@example.com',
  projects: [
    {
      id: DEMO_STORE.id,
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () => Promise.resolve(state.admin),
    settings: (projectId: string) => new MockProjectsService(englishTranslator).settings(projectId),
  }),
}));

function windowProps() {
  return {
    params: Promise.resolve({ projectId: DEMO_STORE.id }),
    searchParams: Promise.resolve({}),
  };
}

async function keysWindow() {
  const element: ReactElement<ProjectSectionProps> = SettingsKeysWindow(windowProps());
  expect(element.type).toBe(ProjectSectionWindow);
  return ProjectSectionWindow(element.props);
}

async function bareAccountWindow() {
  const element: ReactElement<AccountSectionWindowProps> = await AccountWindow(windowProps());
  expect(element.type).toBe(AccountSectionWindow);
  return AccountSectionWindow(element.props);
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
  state.admin = ADMIN;
  state.segments = [];
  state.pathname = KEYS_PATH;
  state.back = () => undefined;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the modal slot', () => {
  it('draws nothing while no window is open', () => {
    expect(ModalDefault()).toBeNull();
  });
});

describe('ModalLayout', () => {
  it('opens a project section as a dialog named Settings, with a way to close it', async () => {
    state.segments = ['(.)settings', 'keys'];

    renderWithMessages(await ModalLayout({ children: await keysWindow() }));

    const dialog = await screen.findByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveAttribute('open');
    expect(within(dialog).getByRole('region', { name: 'Keys' })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('closes the window by going back to the screen behind it', async () => {
    const back = vi.fn();
    state.back = back;
    state.segments = ['(.)settings', 'keys'];
    renderWithMessages(await ModalLayout({ children: await keysWindow() }));

    await userEvent.click(await screen.findByRole('button', { name: 'Close' }));

    expect(back).toHaveBeenCalledOnce();
  });

  it('opens an account section as a dialog too', async () => {
    state.segments = ['(..)account', 'sessions'];
    state.pathname = '/account/sessions';

    renderWithMessages(
      await ModalLayout({ children: <h2 id="settings-window-title">Settings</h2> }),
    );

    expect(await screen.findByRole('dialog', { name: 'Settings' })).toHaveAttribute('open');
  });

  it('opens the bare account address as a dialog on the plan part of the account', async () => {
    state.segments = ['(..)account'];
    state.pathname = '/account';

    renderWithMessages(await ModalLayout({ children: await bareAccountWindow() }));

    const dialog = await screen.findByRole('dialog', { name: 'Settings' });
    expect(within(dialog).getByRole('region', { name: 'Account and billing' })).toHaveTextContent(
      /Free trial until/,
    );
    expect(within(dialog).getByRole('link', { current: 'page' })).toHaveAttribute(
      'href',
      '/account',
    );
  });

  it('leaves what the slot holds outside any dialog when no window is open', async () => {
    state.segments = ['__DEFAULT__'];

    renderWithMessages(await ModalLayout({ children: <p>nothing open</p> }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('nothing open')).toBeInTheDocument();
  });
});
