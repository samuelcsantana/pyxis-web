import { screen, within } from '@testing-library/react';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AccountWindow, {
  type AccountWindowProps,
  generateMetadata as accountWindowMetadata,
} from '@/app/[projectId]/@modal/(..)account/[[...section]]/page';
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
import type { Account } from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import type { ConnectedApps } from '@/domain/connections';
import { UnauthenticatedError } from '@/domain/errors';
import type { AdminSession } from '@/domain/sessions';
import { MockAccessTokensService } from '@/services/access-tokens/mock-access-tokens-service';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { MockConnectionsService } from '@/services/connections/mock-connections-service';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { MockSessionsService } from '@/services/sessions/mock-sessions-service';
import { englishTranslator } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import AccountAppsPage, { generateMetadata as appsPageMetadata } from './apps/page';
import AccountPlanPage, { generateMetadata as planPageMetadata } from './page';
import AccountPreferencesPage, {
  generateMetadata as preferencesPageMetadata,
} from './preferences/page';
import AccountSessionsPage, { generateMetadata as sessionsPageMetadata } from './sessions/page';
import AccountTokensPage, { generateMetadata as tokensPageMetadata } from './tokens/page';

const state = vi.hoisted<{
  admin: unknown;
  accounts: () => Promise<readonly Account[]>;
  sessions: () => Promise<readonly AdminSession[]>;
  tokens: () => Promise<readonly AccessToken[]>;
  apps: () => Promise<ConnectedApps>;
}>(() => ({
  admin: undefined,
  accounts: () => Promise.reject(new Error('accounts not set')),
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

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
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
const ACCOUNT_LINKS = [
  '/account',
  '/account/preferences',
  '/account/sessions',
  '/account/tokens',
  '/account/apps',
];
const PROJECT_LINKS = [
  SETTINGS_PATH,
  `${SETTINGS_PATH}/keys`,
  `${SETTINGS_PATH}/people`,
  `${SETTINGS_PATH}/email`,
  `${SETTINGS_PATH}/export`,
  `${SETTINGS_PATH}/delete`,
];
const PLAN_TITLE = 'Account and billing';
const YEARLY_ACCOUNT_ID = 'a8c2e4f6-1b3d-4e5f-8a9b-0c1d2e3f4a5b';
const MEMBER_ACCOUNT_ID = 'b9d3f5a7-2c4e-4f6a-9b0c-1d2e3f4a5b6c';

type WindowProps = AccountSectionWindowProps;
type PageProps = AccountSectionPageProps;

function inTheWindow(props: ProjectPageProps, segments: readonly string[]): AccountWindowProps {
  return {
    params: props.params.then((params) => ({ ...params, section: segments })),
    searchParams: props.searchParams,
  };
}

function windowOf(section: Exclude<AccountSection, 'plan'>) {
  return (props: ProjectPageProps) => AccountWindow(inTheWindow(props, [section]));
}

function windowTitleOf(section: Exclude<AccountSection, 'plan'>) {
  return (props: ProjectPageProps) => accountWindowMetadata(inTheWindow(props, [section]));
}

const AccountPlanWindow = (props: ProjectPageProps) => AccountWindow(props);
const AccountPreferencesWindow = windowOf('preferences');
const AccountSessionsWindow = windowOf('sessions');
const AccountTokensWindow = windowOf('tokens');
const AccountAppsWindow = windowOf('apps');
const planWindowMetadata = (props: ProjectPageProps) => accountWindowMetadata(props);
const preferencesWindowMetadata = windowTitleOf('preferences');
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
    section: 'plan',
    title: PLAN_TITLE,
    path: '/account',
    content: 'Free trial until',
    page: AccountPlanPage,
    pageMetadata: planPageMetadata,
    window: AccountPlanWindow,
    windowMetadata: planWindowMetadata,
  },
  {
    section: 'preferences',
    title: 'Theme and language',
    path: '/account/preferences',
    content: 'These apply to this browser.',
    page: AccountPreferencesPage,
    pageMetadata: preferencesPageMetadata,
    window: AccountPreferencesWindow,
    windowMetadata: preferencesWindowMetadata,
  },
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

async function demoAccount(): Promise<Account> {
  const [account] = await new MockAccountsService().list();
  if (account === undefined) {
    throw new Error('The demo has an account.');
  }
  return account;
}

async function ownedAndSharedAccounts(): Promise<readonly Account[]> {
  const trialing = await demoAccount();
  return [
    trialing,
    {
      ...trialing,
      id: YEARLY_ACCOUNT_ID,
      status: 'active',
      billingInterval: 'year',
      trialEndsAt: null,
      currentPeriodEndsAt: '2027-09-30T12:00:00.000Z',
    },
    {
      ...trialing,
      id: MEMBER_ACCOUNT_ID,
      role: 'member',
      status: 'comped',
      billingInterval: null,
      trialEndsAt: null,
      currentPeriodEndsAt: null,
    },
  ];
}

async function sharedAccountsOnly(): Promise<readonly Account[]> {
  return (await ownedAndSharedAccounts()).map((account) => ({ ...account, role: 'member' }));
}

function planRegion() {
  return screen.getByRole('region', { name: PLAN_TITLE });
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
  state.admin = ADMIN;
  state.accounts = () => new MockAccountsService().list();
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

describe('the plan part of the account', () => {
  it('opens at the bare account address, first in the You group, marked as the current part', async () => {
    renderWithMessages(await windowed(AccountPlanWindow(windowProps())));

    const you = within(screen.getByRole('navigation', { name: 'Sections' }))
      .getAllByRole('link')
      .slice(PROJECT_LINKS.length);
    expect(you[0]).toHaveAccessibleName(PLAN_TITLE);
    expect(you[0]).toHaveAttribute('href', '/account');
    expect(you[0]).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { level: 2, name: PLAN_TITLE })).toHaveAttribute(
      'id',
      'account-plan-heading',
    );
  });

  it('lists each account the admin owns under its plan and status, and none of the others', async () => {
    state.accounts = ownedAndSharedAccounts;

    renderWithMessages(await windowed(AccountPlanWindow(windowProps())));

    const plan = planRegion();
    expect(within(plan).getByRole('region', { name: 'Plan: Monthly' })).toHaveTextContent(
      /Free trial until/,
    );
    expect(within(plan).getByRole('region', { name: 'Plan: Yearly' })).toHaveTextContent(
      'Active. It renews on Sep 30, 2027.',
    );
    expect(within(plan).queryByRole('region', { name: 'Plan' })).not.toBeInTheDocument();
    expect(plan).not.toHaveTextContent('A complimentary account, given by Pyxis.');
    expect(within(plan).getAllByRole('button', { name: 'Manage billing' })).toHaveLength(2);
    expect(within(plan).getAllByRole('region', { name: 'Close the account' })).toHaveLength(2);
    expect(plan).not.toHaveTextContent('You do not own a Pyxis account.');
  });

  it('tells an admin who owns no account that the billing belongs to the owner', async () => {
    state.accounts = sharedAccountsOnly;

    renderWithMessages(await windowed(AccountPlanWindow(windowProps())));

    const plan = planRegion();
    expect(plan).toHaveTextContent(
      'You do not own a Pyxis account. The billing of the projects you open belongs to their owner.',
    );
    expect(within(plan).queryByRole('region', { name: /^Plan/ })).not.toBeInTheDocument();
    expect(within(plan).queryByRole('button', { name: 'Manage billing' })).not.toBeInTheDocument();
    expect(
      within(plan).queryByRole('region', { name: 'Close the account' }),
    ).not.toBeInTheDocument();
  });

  it('ends with the support address and reply time, for the e-mail of the admin', async () => {
    renderWithMessages(await windowed(AccountPlanWindow(windowProps())));

    const support = within(planRegion()).getByRole('region', { name: 'Support' });
    expect(within(support).getByText('hello@pyxis-analytics.dev')).toBeInTheDocument();
    expect(support).toHaveTextContent(
      'On the paid plan, we confirm that your message arrived and reply within 2 business days.',
    );
    expect(support).toHaveTextContent('Write from owner@example.com, so we know which account');
  });

  it('keeps the support block for an admin who owns no account', async () => {
    state.accounts = sharedAccountsOnly;

    renderWithMessages(await windowed(AccountPlanWindow(windowProps())));

    expect(within(planRegion()).getByRole('region', { name: 'Support' })).toHaveTextContent(
      'Write from owner@example.com',
    );
  });

  it('shows the same part as a full page, with only the You group in the menu', async () => {
    state.accounts = ownedAndSharedAccounts;

    renderWithMessages(await fullPage(AccountPlanPage(pageProps())));

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
    expect(menuLinks()).toEqual(ACCOUNT_LINKS);
    expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute('href', '/account');
    expect(within(planRegion()).getByRole('region', { name: 'Plan: Yearly' })).toBeInTheDocument();
    expect(within(planRegion()).getByRole('region', { name: 'Support' })).toBeInTheDocument();
  });

  it('sends a signed-out admin to sign in again, as a window and as a page', async () => {
    state.accounts = () => Promise.reject(new UnauthenticatedError());

    await expect(windowed(AccountPlanWindow(windowProps()))).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
    await expect(fullPage(AccountPlanPage(pageProps()))).rejects.toThrow(
      'redirect:/sign-in?expired=1',
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

  it('loads the accounts, the sessions, the access tokens and the connected apps of the admin', async () => {
    const accounts = vi.fn(() => new MockAccountsService().list());
    const sessions = vi.fn(() => new MockSessionsService().list());
    const tokens = vi.fn(() => Promise.resolve<readonly AccessToken[]>([]));
    const apps = vi.fn(() =>
      Promise.resolve<ConnectedApps>({ connectorUrl: null, connections: [] }),
    );
    state.accounts = accounts;
    state.sessions = sessions;
    state.tokens = tokens;
    state.apps = apps;

    renderWithMessages(await fullPage(AccountSessionsPage(pageProps())));
    await fullPage(AccountPlanPage(pageProps()));
    await fullPage(AccountTokensPage(pageProps()));
    await fullPage(AccountAppsPage(pageProps()));

    expect(screen.getByRole('region', { name: 'Sessions' })).toHaveTextContent('This device');
    expect(accounts).toHaveBeenCalledOnce();
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

  it.each([
    ['a part of the account that does not exist', ['billing']],
    ['the plan, which lives at the bare account address', ['plan']],
    ['a part followed by another segment', ['sessions', 'tokens']],
  ])('answers not found for %s, as a window and its title', async (_, segments) => {
    await expect(AccountWindow(inTheWindow(windowProps(), segments))).rejects.toThrow('not-found');
    await expect(accountWindowMetadata(inTheWindow(windowProps(), segments))).rejects.toThrow(
      'not-found',
    );
  });
});
