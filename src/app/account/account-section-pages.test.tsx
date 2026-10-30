import { screen, within } from '@testing-library/react';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AccountWindow, {
  type AccountWindowProps,
  generateMetadata as accountWindowMetadata,
} from '@/app/[projectId]/@modal/(..)account/[section]/page';
import {
  type AccountPageProps,
  type AccountSectionPageProps,
  type AccountSectionWindowProps,
  AccountSectionPage,
  AccountSectionWindow,
  DASHBOARD_HOME,
  type PageSearch,
  type ProjectPageProps,
} from '@/app/[projectId]/settings/settings-sections';
import { FrameViewProvider } from '@/components/settings-window/frame-view';
import type { AccountSection } from '@/components/settings-window/sections';
import type { AccessToken } from '@/domain/access-tokens';
import type { Admin } from '@/domain/admin';
import type { ConnectedApps } from '@/domain/connections';
import { UnauthenticatedError } from '@/domain/errors';
import type { AdminSession } from '@/domain/sessions';
import { MockAccessTokensService } from '@/services/access-tokens/mock-access-tokens-service';
import { MockConnectionsService } from '@/services/connections/mock-connections-service';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { MockSessionsService } from '@/services/sessions/mock-sessions-service';
import { englishTranslator } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import AccountAppsPage, { generateMetadata as appsPageMetadata } from './apps/page';
import AccountSessionsPage, { generateMetadata as sessionsPageMetadata } from './sessions/page';
import AccountTokensPage, { generateMetadata as tokensPageMetadata } from './tokens/page';

const state = vi.hoisted<{
  admin: unknown;
  sessions: () => Promise<readonly AdminSession[]>;
  tokens: () => Promise<readonly AccessToken[]>;
  apps: () => Promise<ConnectedApps>;
}>(() => ({
  admin: undefined,
  sessions: () => Promise.reject(new Error('sessions not set')),
  tokens: () => Promise.reject(new Error('tokens not set')),
  apps: () => Promise.reject(new Error('apps not set')),
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
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/account/sessions',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () => Promise.resolve(state.admin),
    settings: (projectId: string) => new MockProjectsService(englishTranslator).settings(projectId),
  }),
}));

vi.mock('@/services/sessions/sessions-service.factory', () => ({
  createSessionsService: () => ({ list: () => state.sessions() }),
}));

vi.mock('@/services/access-tokens/access-tokens-service.factory', () => ({
  createAccessTokensService: () => ({ list: () => state.tokens() }),
}));

vi.mock('@/services/connections/connections-service.factory', () => ({
  createConnectionsService: () => ({ list: () => state.apps() }),
}));

const STORE = {
  id: DEMO_STORE.id,
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'signup_completed',
};
const ADMIN: Admin = { email: 'owner@example.com', projects: [STORE] };
const SETTINGS_PATH = `/${STORE.id}/settings`;
const ACCOUNT_LINKS = ['/account/sessions', '/account/tokens', '/account/apps'];
const PROJECT_LINKS = [
  SETTINGS_PATH,
  `${SETTINGS_PATH}/keys`,
  `${SETTINGS_PATH}/people`,
  `${SETTINGS_PATH}/email`,
  `${SETTINGS_PATH}/export`,
  `${SETTINGS_PATH}/delete`,
];

type WindowProps = AccountSectionWindowProps;
type PageProps = AccountSectionPageProps;

function inTheWindow(props: ProjectPageProps, section: string): AccountWindowProps {
  return {
    params: props.params.then((params) => ({ ...params, section })),
    searchParams: props.searchParams,
  };
}

function windowOf(section: AccountSection) {
  return (props: ProjectPageProps) => AccountWindow(inTheWindow(props, section));
}

function windowTitleOf(section: AccountSection) {
  return (props: ProjectPageProps) => accountWindowMetadata(inTheWindow(props, section));
}

const AccountSessionsWindow = windowOf('sessions');
const AccountTokensWindow = windowOf('tokens');
const AccountAppsWindow = windowOf('apps');
const sessionsWindowMetadata = windowTitleOf('sessions');
const tokensWindowMetadata = windowTitleOf('tokens');
const appsWindowMetadata = windowTitleOf('apps');

interface AccountRoutes {
  readonly section: AccountSection;
  readonly title: string;
  readonly path: string;
  readonly content: string;
  readonly page: (props: AccountPageProps) => ReactElement<PageProps>;
  readonly pageMetadata: () => Promise<Metadata>;
  readonly window: (props: ProjectPageProps) => Promise<ReactElement<WindowProps>>;
  readonly windowMetadata: (props: ProjectPageProps) => Promise<Metadata>;
}

const ROUTES: readonly AccountRoutes[] = [
  {
    section: 'sessions',
    title: 'Sessions',
    path: '/account/sessions',
    content: 'Chrome on Windows',
    page: AccountSessionsPage,
    pageMetadata: sessionsPageMetadata,
    window: AccountSessionsWindow,
    windowMetadata: sessionsWindowMetadata,
  },
  {
    section: 'tokens',
    title: 'Access tokens',
    path: '/account/tokens',
    content: 'Monthly report script',
    page: AccountTokensPage,
    pageMetadata: tokensPageMetadata,
    window: AccountTokensWindow,
    windowMetadata: tokensWindowMetadata,
  },
  {
    section: 'apps',
    title: 'Connected apps',
    path: '/account/apps',
    content: 'Claude Code',
    page: AccountAppsPage,
    pageMetadata: appsPageMetadata,
    window: AccountAppsWindow,
    windowMetadata: appsWindowMetadata,
  },
];

function windowProps(search: PageSearch = {}, projectId = STORE.id): ProjectPageProps {
  return { params: Promise.resolve({ projectId }), searchParams: Promise.resolve(search) };
}

function pageProps(search: PageSearch = {}): AccountPageProps {
  return { searchParams: Promise.resolve(search) };
}

async function fullPage(element: ReactElement<PageProps>) {
  expect(element.type).toBe(AccountSectionPage);
  return AccountSectionPage(element.props);
}

async function windowed(opening: Promise<ReactElement<WindowProps>>) {
  const element = await opening;
  expect(element.type).toBe(AccountSectionWindow);
  const frame = await AccountSectionWindow(element.props);
  return <FrameViewProvider initial="section">{frame}</FrameViewProvider>;
}

function menuLinks() {
  return within(screen.getByRole('navigation', { name: 'Sections' }))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'));
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
  state.admin = ADMIN;
  state.sessions = () => new MockSessionsService().list();
  state.tokens = () => new MockAccessTokensService().list();
  state.apps = () => new MockConnectionsService().list();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('an account section as a window over a project screen', () => {
  it.each(ROUTES)(
    'shows the $section section under a Settings window title, the project sections above You',
    async ({ window, title, path, content }) => {
      renderWithMessages(await windowed(window(windowProps())));

      expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toHaveAttribute(
        'id',
        'settings-window-title',
      );
      expect(screen.getByRole('region', { name: title })).toHaveTextContent(content);
      const menu = screen.getByRole('navigation', { name: 'Sections' });
      expect(within(menu).getByText('My site')).toBeInTheDocument();
      expect(within(menu).getByText('You')).toBeInTheDocument();
      expect(menuLinks()).toEqual([...PROJECT_LINKS, ...ACCOUNT_LINKS]);
      expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute('href', path);
    },
  );

  it('writes the dates in the time zone of the project behind the window', async () => {
    renderWithMessages(await windowed(AccountTokensWindow(windowProps())));

    expect(screen.getByRole('region', { name: 'Access tokens' })).toHaveTextContent(
      'Sep 23, 2026, 23:30',
    );
  });

  it('keeps the period and the filters of the screen behind in every menu link', async () => {
    renderWithMessages(
      await windowed(
        AccountSessionsWindow(windowProps({ range: '7d', city: ['Lisbon', 'Porto'] })),
      ),
    );

    expect(menuLinks()).toEqual(
      [...PROJECT_LINKS, ...ACCOUNT_LINKS].map((link) => `${link}?range=7d&city=Lisbon`),
    );
  });

  it('answers not found over a project the admin may not read', async () => {
    await expect(windowed(AccountSessionsWindow(windowProps({}, 'p-unknown')))).rejects.toThrow(
      'not-found',
    );
  });
});

describe('an account section as a full page', () => {
  it.each(ROUTES)(
    'shows the $section section under a Settings title, with only the You sections in the menu',
    async ({ page, title, path, content }) => {
      renderWithMessages(await fullPage(page(pageProps())));

      expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: title })).toHaveTextContent(content);
      const menu = screen.getByRole('navigation', { name: 'Sections' });
      expect(within(menu).getByText('You')).toBeInTheDocument();
      expect(within(menu).queryByText('My site')).not.toBeInTheDocument();
      expect(menuLinks()).toEqual(ACCOUNT_LINKS);
      expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute('href', path);
      expect(screen.getByRole('link', { name: 'Back to the dashboard' })).toHaveAttribute(
        'href',
        DASHBOARD_HOME,
      );
      expect(screen.getByRole('main')).toBeInTheDocument();
    },
  );

  it('writes the dates in the time zone of the first project of the admin', async () => {
    renderWithMessages(await fullPage(AccountTokensPage(pageProps())));

    expect(screen.getByRole('region', { name: 'Access tokens' })).toHaveTextContent(
      'Sep 23, 2026, 23:30',
    );
  });

  it('writes the dates in UTC for an admin with no project yet', async () => {
    state.admin = { ...ADMIN, projects: [] };

    renderWithMessages(await fullPage(AccountTokensPage(pageProps())));

    expect(screen.getByRole('region', { name: 'Access tokens' })).toHaveTextContent(
      'Sep 24, 2026, 02:30',
    );
  });

  it('loads the sessions, the access tokens and the connected apps of the admin', async () => {
    const sessions = vi.fn(() => new MockSessionsService().list());
    const tokens = vi.fn(() => Promise.resolve<readonly AccessToken[]>([]));
    const apps = vi.fn(() =>
      Promise.resolve<ConnectedApps>({ connectorUrl: null, connections: [] }),
    );
    state.sessions = sessions;
    state.tokens = tokens;
    state.apps = apps;

    renderWithMessages(await fullPage(AccountSessionsPage(pageProps())));
    await fullPage(AccountTokensPage(pageProps()));
    await fullPage(AccountAppsPage(pageProps()));

    expect(screen.getByRole('region', { name: 'Sessions' })).toHaveTextContent('This device');
    expect(sessions).toHaveBeenCalledOnce();
    expect(tokens).toHaveBeenCalledOnce();
    expect(apps).toHaveBeenCalledOnce();
  });

  it('keeps the period and the filters it was opened with in every menu link', async () => {
    renderWithMessages(
      await fullPage(AccountAppsPage(pageProps({ range: '30d', device: 'mobile', to: [] }))),
    );

    expect(menuLinks()).toEqual(ACCOUNT_LINKS.map((link) => `${link}?range=30d&device=mobile`));
  });

  it('sends a signed-out admin to sign in again', async () => {
    state.sessions = () => Promise.reject(new UnauthenticatedError());

    await expect(fullPage(AccountSessionsPage(pageProps()))).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });
});

describe('the titles of the account sections', () => {
  it.each(ROUTES)(
    'titles the $section window with the section and the project, and the page with the section',
    async ({ pageMetadata, windowMetadata, title }) => {
      await expect(windowMetadata(windowProps())).resolves.toEqual({
        title: `${title} · Demo Store`,
      });
      await expect(pageMetadata()).resolves.toEqual({ title });
    },
  );

  it('answers not found when titling a window over a project the admin may not read', async () => {
    await expect(sessionsWindowMetadata(windowProps({}, 'p-unknown'))).rejects.toThrow('not-found');
  });

  it('answers not found for a part of the account that does not exist, as a window and its title', async () => {
    await expect(AccountWindow(inTheWindow(windowProps(), 'billing'))).rejects.toThrow('not-found');
    await expect(accountWindowMetadata(inTheWindow(windowProps(), 'billing'))).rejects.toThrow(
      'not-found',
    );
  });
});
