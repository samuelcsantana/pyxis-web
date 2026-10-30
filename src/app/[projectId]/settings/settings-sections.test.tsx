import { screen, within } from '@testing-library/react';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsDeleteWindow, {
  generateMetadata as deleteWindowMetadata,
} from '@/app/[projectId]/@modal/(.)settings/delete/page';
import SettingsEmailWindow, {
  generateMetadata as emailWindowMetadata,
} from '@/app/[projectId]/@modal/(.)settings/email/page';
import SettingsExportWindow, {
  generateMetadata as exportWindowMetadata,
} from '@/app/[projectId]/@modal/(.)settings/export/page';
import SettingsKeysWindow, {
  generateMetadata as keysWindowMetadata,
} from '@/app/[projectId]/@modal/(.)settings/keys/page';
import SettingsProjectWindow, {
  generateMetadata as projectWindowMetadata,
} from '@/app/[projectId]/@modal/(.)settings/page';
import SettingsPeopleWindow, {
  generateMetadata as peopleWindowMetadata,
} from '@/app/[projectId]/@modal/(.)settings/people/page';
import { FrameViewProvider } from '@/components/settings-window/frame-view';
import type { ProjectSection } from '@/components/settings-window/sections';
import type { Admin } from '@/domain/admin';
import type { EmailPreferences } from '@/domain/email-preferences';
import { UnauthenticatedError } from '@/domain/errors';
import type { ProjectPerson } from '@/domain/project-people';
import type { ProjectSettings } from '@/domain/project-settings';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockProjectPeopleService } from '@/services/project-people/mock-project-people-service';
import { MockProjectsService } from '@/services/projects/mock-projects-service';
import { englishTranslator } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import SettingsDeletePage, { generateMetadata as deletePageMetadata } from './delete/page';
import SettingsEmailPage, { generateMetadata as emailPageMetadata } from './email/page';
import SettingsExportPage, { generateMetadata as exportPageMetadata } from './export/page';
import SettingsKeysPage, { generateMetadata as keysPageMetadata } from './keys/page';
import SettingsProjectPage, { generateMetadata as projectPageMetadata } from './page';
import SettingsPeoplePage, { generateMetadata as peoplePageMetadata } from './people/page';
import {
  type PageSearch,
  type ProjectPageProps,
  type ProjectSectionProps,
  ProjectSectionPage,
  ProjectSectionWindow,
  searchReaderOf,
} from './settings-sections';

const state = vi.hoisted<{
  admin: unknown;
  settings: (projectId: string) => Promise<ProjectSettings>;
  people: (projectId: string) => Promise<readonly ProjectPerson[]>;
  preferences: (projectId: string) => Promise<EmailPreferences>;
}>(() => ({
  admin: undefined,
  settings: () => Promise.reject(new Error('settings not set')),
  people: () => Promise.reject(new Error('people not set')),
  preferences: () => Promise.reject(new Error('preferences not set')),
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
  usePathname: () => `/${DEMO_STORE.id}/settings`,
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () => Promise.resolve(state.admin),
    settings: (projectId: string) => state.settings(projectId),
  }),
}));

vi.mock('@/services/project-people/project-people-service.factory', () => ({
  createProjectPeopleService: () => ({ list: (projectId: string) => state.people(projectId) }),
}));

vi.mock('@/services/preferences/email-preferences-service.factory', () => ({
  createEmailPreferencesService: () => ({
    preferences: (projectId: string) => state.preferences(projectId),
  }),
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
const OWNER_LINKS = [
  SETTINGS_PATH,
  `${SETTINGS_PATH}/keys`,
  `${SETTINGS_PATH}/people`,
  `${SETTINGS_PATH}/email`,
  `${SETTINGS_PATH}/export`,
  `${SETTINGS_PATH}/delete`,
  ...ACCOUNT_LINKS,
];
const MEMBER_LINKS = [
  SETTINGS_PATH,
  `${SETTINGS_PATH}/keys`,
  `${SETTINGS_PATH}/people`,
  `${SETTINGS_PATH}/email`,
  ...ACCOUNT_LINKS,
];

type SectionProps = ProjectSectionProps;

interface SectionRoutes {
  readonly section: ProjectSection;
  readonly title: string;
  readonly path: string;
  readonly control: { readonly role: 'textbox' | 'button' | 'switch'; readonly name: string };
  readonly page: (props: ProjectPageProps) => ReactElement<SectionProps>;
  readonly pageMetadata: (props: ProjectPageProps) => Promise<Metadata>;
  readonly window: (props: ProjectPageProps) => ReactElement<SectionProps>;
  readonly windowMetadata: (props: ProjectPageProps) => Promise<Metadata>;
}

const ROUTES: readonly SectionRoutes[] = [
  {
    section: 'project',
    title: 'Project',
    path: SETTINGS_PATH,
    control: { role: 'textbox', name: 'Name' },
    page: SettingsProjectPage,
    pageMetadata: projectPageMetadata,
    window: SettingsProjectWindow,
    windowMetadata: projectWindowMetadata,
  },
  {
    section: 'keys',
    title: 'Keys',
    path: `${SETTINGS_PATH}/keys`,
    control: { role: 'button', name: 'New public key' },
    page: SettingsKeysPage,
    pageMetadata: keysPageMetadata,
    window: SettingsKeysWindow,
    windowMetadata: keysWindowMetadata,
  },
  {
    section: 'people',
    title: 'People',
    path: `${SETTINGS_PATH}/people`,
    control: { role: 'button', name: 'Add person' },
    page: SettingsPeoplePage,
    pageMetadata: peoplePageMetadata,
    window: SettingsPeopleWindow,
    windowMetadata: peopleWindowMetadata,
  },
  {
    section: 'email',
    title: 'E-mail',
    path: `${SETTINGS_PATH}/email`,
    control: { role: 'switch', name: 'Weekly digest' },
    page: SettingsEmailPage,
    pageMetadata: emailPageMetadata,
    window: SettingsEmailWindow,
    windowMetadata: emailWindowMetadata,
  },
  {
    section: 'export',
    title: 'Export events',
    path: `${SETTINGS_PATH}/export`,
    control: { role: 'button', name: 'Export events' },
    page: SettingsExportPage,
    pageMetadata: exportPageMetadata,
    window: SettingsExportWindow,
    windowMetadata: exportWindowMetadata,
  },
  {
    section: 'delete',
    title: 'Delete project',
    path: `${SETTINGS_PATH}/delete`,
    control: { role: 'textbox', name: 'Type My site to confirm' },
    page: SettingsDeletePage,
    pageMetadata: deletePageMetadata,
    window: SettingsDeleteWindow,
    windowMetadata: deleteWindowMetadata,
  },
];

function routesOf(section: ProjectSection): SectionRoutes {
  const routes = ROUTES.find((candidate) => candidate.section === section);
  if (routes === undefined) {
    throw new Error(`No routes for ${section}.`);
  }
  return routes;
}

function propsFor(search: PageSearch = {}, projectId = STORE.id): ProjectPageProps {
  return { params: Promise.resolve({ projectId }), searchParams: Promise.resolve(search) };
}

async function fullPage(element: ReactElement<SectionProps>) {
  expect(element.type).toBe(ProjectSectionPage);
  return ProjectSectionPage(element.props);
}

async function windowed(element: ReactElement<SectionProps>) {
  expect(element.type).toBe(ProjectSectionWindow);
  const frame = await ProjectSectionWindow(element.props);
  return <FrameViewProvider initial="section">{frame}</FrameViewProvider>;
}

function settingsWithRole(role: ProjectSettings['role']) {
  return async (projectId: string): Promise<ProjectSettings> => ({
    ...(await new MockProjectsService(englishTranslator).settings(projectId)),
    role,
  });
}

function menuLinks() {
  return within(screen.getByRole('navigation', { name: 'Sections' }))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'));
}

function sectionRegion(title: string) {
  return screen.getByRole('region', { name: title });
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
  state.admin = ADMIN;
  state.settings = (projectId) => new MockProjectsService(englishTranslator).settings(projectId);
  state.people = () => new MockProjectPeopleService().list();
  state.preferences = () => Promise.resolve({ weeklyDigest: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('a project section as a full page', () => {
  it.each(ROUTES)(
    'shows the $section section under the Settings title, with every section in the menu',
    async ({ page, title, path, control }) => {
      renderWithMessages(await fullPage(page(propsFor())));

      expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { name: 'Settings' })).toHaveLength(1);
      expect(
        screen.getByText('How My site is set up, its keys, and the e-mails you get about it.'),
      ).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: title })).toHaveAttribute(
        'tabindex',
        '-1',
      );
      expect(
        within(sectionRegion(title)).getByRole(control.role, { name: control.name }),
      ).toBeInTheDocument();
      expect(menuLinks()).toEqual(OWNER_LINKS);
      expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute('href', path);
      expect(screen.getByRole('main')).toBeInTheDocument();
    },
  );

  it('groups the menu under the project name and You, beside the e-mail of the admin', async () => {
    renderWithMessages(await fullPage(SettingsKeysPage(propsFor())));

    const menu = screen.getByRole('navigation', { name: 'Sections' });
    expect(within(menu).getByText('My site')).toBeInTheDocument();
    expect(within(menu).getByText('You')).toBeInTheDocument();
    expect(within(menu).getByText('owner@example.com')).toBeInTheDocument();
    expect(within(menu).getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('writes the dates of a section in the time zone of the project', async () => {
    renderWithMessages(await fullPage(SettingsKeysPage(propsFor())));

    expect(sectionRegion('Keys')).toHaveTextContent('Created Feb 3, 2025, 07:00');
  });

  it.each([
    [
      'someone the owner added',
      'member',
      'How My site is set up, and the e-mails you get about it. Only the owner of its account changes the project.',
    ],
    [
      'the operator',
      null,
      'How My site is set up, and the e-mails you get about it. Project settings change through the command line.',
    ],
  ] as const)(
    'tells %s who changes the project, without the owner controls',
    async (_, role, subtitle) => {
      state.settings = settingsWithRole(role);

      renderWithMessages(await fullPage(SettingsProjectPage(propsFor())));

      expect(screen.getByText(subtitle)).toBeInTheDocument();
      expect(within(sectionRegion('Project')).queryByRole('textbox')).not.toBeInTheDocument();
      expect(sectionRegion('Project')).toHaveTextContent('https://www.store.example.com');
      expect(menuLinks()).toEqual(MEMBER_LINKS);
    },
  );

  it('shows someone the owner added the keys without a way to create or revoke one', async () => {
    state.settings = settingsWithRole('member');

    renderWithMessages(await fullPage(SettingsKeysPage(propsFor())));

    const keys = sectionRegion('Keys');
    expect(keys).toHaveTextContent('pyxis_pk_');
    expect(within(keys).queryByRole('button', { name: 'New public key' })).not.toBeInTheDocument();
    expect(within(keys).queryByRole('button', { name: 'Revoke' })).not.toBeInTheDocument();
  });

  it('shows someone the owner added the people without a way to add or remove one', async () => {
    state.settings = settingsWithRole('member');

    renderWithMessages(await fullPage(SettingsPeoplePage(propsFor())));

    const people = sectionRegion('People');
    expect(people).toHaveTextContent('Who can open this project.');
    expect(people).toHaveTextContent('analyst@example.com');
    expect(within(people).queryByRole('button', { name: 'Add person' })).not.toBeInTheDocument();
    expect(within(people).queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  it.each(['export', 'delete'] as const)(
    'answers not found to someone the owner added on the %s section, page and window',
    async (section) => {
      state.settings = settingsWithRole('member');
      const routes = routesOf(section);

      await expect(fullPage(routes.page(propsFor()))).rejects.toThrow('not-found');
      await expect(windowed(routes.window(propsFor()))).rejects.toThrow('not-found');
    },
  );

  it('loads the people of the project and marks the admin among them', async () => {
    const people = vi.fn<(projectId: string) => Promise<readonly ProjectPerson[]>>(() =>
      Promise.resolve([
        {
          adminUserId: 'b14d6f80-0c2e-4d5f-8a7b-9c1d3e5f7a9b',
          email: 'ana@example.com',
          role: 'member',
          addedAt: '2026-09-10T08:00:00.000Z',
        },
        {
          adminUserId: 'c25e7a91-1d3f-4e6a-9b8c-0d2e4f6a8b0c',
          email: 'owner@example.com',
          role: 'owner',
          addedAt: '2026-09-01T08:00:00.000Z',
        },
      ]),
    );
    state.people = people;

    renderWithMessages(await fullPage(SettingsPeoplePage(propsFor())));

    expect(people).toHaveBeenCalledWith(STORE.id);
    const rows = within(sectionRegion('People')).getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('owner@example.com (you)');
    expect(rows[1]).toHaveTextContent('ana@example.com');
    expect(rows[1]).toHaveTextContent('Member · Added Sep 10, 2026, 05:00');
    expect(
      within(sectionRegion('People')).getByRole('button', { name: 'Remove' }),
    ).toBeInTheDocument();
  });

  it('loads the e-mail choices of the admin for the project', async () => {
    const preferences = vi.fn<(projectId: string) => Promise<EmailPreferences>>(() =>
      Promise.resolve({ weeklyDigest: false }),
    );
    state.preferences = preferences;

    renderWithMessages(await fullPage(SettingsEmailPage(propsFor())));

    expect(preferences).toHaveBeenCalledWith(STORE.id);
    expect(
      within(sectionRegion('E-mail')).getByRole('switch', { name: 'Weekly digest' }),
    ).not.toBeChecked();
  });

  it('keeps the period and the filters of the screen behind in every menu link', async () => {
    renderWithMessages(
      await fullPage(
        SettingsEmailPage(
          propsFor({
            range: '30d',
            channel: ['search', 'social'],
            device: '',
            from: undefined,
            utm: 'kept-out',
          }),
        ),
      ),
    );

    expect(menuLinks()).toEqual(OWNER_LINKS.map((link) => `${link}?range=30d&channel=search`));
  });

  it('sends a signed-out admin to sign in again', async () => {
    state.settings = () => Promise.reject(new UnauthenticatedError());

    await expect(fullPage(SettingsProjectPage(propsFor()))).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(fullPage(SettingsProjectPage(propsFor({}, 'p-unknown')))).rejects.toThrow(
      'not-found',
    );
  });
});

describe('a project section as a window', () => {
  it.each(ROUTES)(
    'shows the $section section under a Settings window title, with every section in the menu',
    async ({ window, title, path, control }) => {
      renderWithMessages(await windowed(window(propsFor())));

      const windowTitle = screen.getByRole('heading', { level: 2, name: 'Settings' });
      expect(windowTitle).toHaveAttribute('id', 'settings-window-title');
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
      expect(screen.queryByRole('main')).not.toBeInTheDocument();
      expect(
        within(sectionRegion(title)).getByRole(control.role, { name: control.name }),
      ).toBeInTheDocument();
      expect(menuLinks()).toEqual(OWNER_LINKS);
      expect(screen.getByRole('link', { current: 'page' })).toHaveAttribute('href', path);
    },
  );

  it('leaves the owner-only sections out of the menu of someone the owner added', async () => {
    state.settings = settingsWithRole('member');

    renderWithMessages(await windowed(SettingsKeysWindow(propsFor())));

    expect(menuLinks()).toEqual(MEMBER_LINKS);
    expect(
      within(sectionRegion('Keys')).queryByRole('button', { name: 'New public key' }),
    ).not.toBeInTheDocument();
  });

  it('keeps the period and the filters of the screen behind in every menu link', async () => {
    renderWithMessages(
      await windowed(
        SettingsProjectWindow(
          propsFor({ range: 'custom', from: '2026-09-01', to: '2026-09-30', path: '/pricing' }),
        ),
      ),
    );

    expect(menuLinks()).toEqual(
      OWNER_LINKS.map(
        (link) => `${link}?range=custom&from=2026-09-01&to=2026-09-30&path=%2Fpricing`,
      ),
    );
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(windowed(SettingsProjectWindow(propsFor({}, 'p-unknown')))).rejects.toThrow(
      'not-found',
    );
  });
});

describe('the titles of the project sections', () => {
  it.each(ROUTES)(
    'titles the $section page and window with the section and the project',
    async ({ pageMetadata, windowMetadata, title }) => {
      await expect(pageMetadata(propsFor())).resolves.toMatchObject({
        title: `${title} · Demo Store`,
      });
      await expect(windowMetadata(propsFor())).resolves.toMatchObject({
        title: `${title} · Demo Store`,
      });
    },
  );

  it.each(ROUTES)(
    'gives the demo $section section its live demo address as the canonical one',
    async ({ pageMetadata, windowMetadata, path }) => {
      const canonical = `https://demo.pyxis-analytics.dev${path}`;

      expect((await pageMetadata(propsFor())).alternates?.canonical).toBe(canonical);
      expect((await windowMetadata(propsFor())).alternates?.canonical).toBe(canonical);
    },
  );

  it('gives the sections of a dashboard with a real API no canonical address', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const metadata = await keysPageMetadata(propsFor());

    expect(metadata.title).toBe('Keys · Demo Store');
    expect(metadata.alternates).toBeUndefined();
  });

  it('answers not found when titling a project the admin may not read', async () => {
    await expect(projectPageMetadata(propsFor({}, 'p-unknown'))).rejects.toThrow('not-found');
  });
});

describe('searchReaderOf', () => {
  const reader = searchReaderOf({
    range: '7d',
    channel: ['search', 'social'],
    device: [],
    from: undefined,
  });

  it('reads a parameter given once as its value', () => {
    expect(reader.get('range')).toBe('7d');
  });

  it('reads a parameter given several times as its first value', () => {
    expect(reader.get('channel')).toBe('search');
  });

  it('reads a missing or empty parameter as null', () => {
    expect(reader.get('to')).toBeNull();
    expect(reader.get('from')).toBeNull();
    expect(reader.get('device')).toBeNull();
  });
});
