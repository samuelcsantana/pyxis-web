import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { AccountOverview } from '@/components/account/account-overview';
import { BrandBackdrop } from '@/components/brand/brand-backdrop';
import { LogoMark } from '@/components/brand/logo-mark';
import { RAISED_CARDS } from '@/components/brand/raised-cards';
import { HelpView } from '@/components/help/help-view';
import { helpHref } from '@/components/shell/screens';
import { AccessTokensPanel } from '@/components/settings/access-tokens-panel';
import { ConnectedAppsPanel } from '@/components/settings/connected-apps-panel';
import { KeysPart } from '@/components/settings/keys-part';
import type { When } from '@/components/settings/part-pieces';
import { PeoplePanel } from '@/components/settings/people-panel';
import { PreferencesPanel } from '@/components/settings/preferences-panel';
import { DeletePart, EmailPart, ExportPart } from '@/components/settings/project-actions-parts';
import { ProjectPart } from '@/components/settings/project-part';
import { SessionsPanel } from '@/components/settings/sessions-panel';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { accessTokensResponseSchema } from '@/domain/access-tokens.schema';
import type { Account, BillingRedirectOutcome, WithdrawOutcome } from '@/domain/accounts';
import { myAccountsResponseSchema } from '@/domain/accounts.schema';
import { connectedAppsResponseSchema } from '@/domain/connections.schema';
import { timeZoneChoices } from '@/domain/project-management';
import { projectPeopleResponseSchema } from '@/domain/project-people.schema';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import { sessionsResponseSchema } from '@/domain/sessions.schema';
import { supportPlanOf } from '@/domain/support';
import type { I18n } from '@/i18n/i18n';
import { DEFAULT_LOCALE, type Locale, parseLocale } from '@/i18n/locales';
import {
  DEMO_CREATED_ACCESS_TOKEN,
  demoAccessTokensWire,
} from '@/services/access-tokens/mock-access-tokens-service';
import { demoAccountsWire, MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { demoConnectionsWire } from '@/services/connections/mock-connections-service';
import { DEMO_STORE, demoProjectNameOf } from '@/services/demo/demo-projects';
import { MockExportsService } from '@/services/exports/mock-exports-service';
import { MockProjectManagementService } from '@/services/project-management/mock-project-management-service';
import {
  demoPeopleWire,
  MockProjectPeopleService,
} from '@/services/project-people/mock-project-people-service';
import { demoProjectSettingsWire } from '@/services/projects/demo-project-settings';
import { DEMO_OWNER_EMAIL } from '@/services/projects/mock-projects-service';
import { demoSessionsWire } from '@/services/sessions/mock-sessions-service';
import { dutch } from '@/test-utils/dutch';
import { english } from '@/test-utils/english';
import { french } from '@/test-utils/french';
import { german } from '@/test-utils/german';
import { italian } from '@/test-utils/italian';
import { portuguese } from '@/test-utils/portuguese';
import { spanish } from '@/test-utils/spanish';
import { SettingsDialog } from './settings-dialog';
import {
  ACCOUNT_SECTIONS,
  accountSectionHref,
  HELP_SECTION,
  projectSectionHref,
  projectSectionsFor,
  SECTION_LOOKS,
  type SettingsSection,
} from './sections';
import { type FrameGroup, SettingsFrame, type SettingsFrameProps } from './settings-frame';

const STORY_NOW = new Date('2026-10-30T12:00:00.000Z');
const DAY_MS = 86_400_000;
const MEMBER_EMAIL = 'analyst@example.com';

const STORE: ProjectSettings = projectSettingsResponseSchema.parse(
  demoProjectSettingsWire(DEMO_STORE.id, STORY_NOW, demoProjectNameOf(DEMO_STORE, english.t)),
);
const MEMBER_VIEW: ProjectSettings = { ...STORE, role: 'member' };
const SESSIONS = sessionsResponseSchema.parse(demoSessionsWire(STORY_NOW));
const TOKENS = accessTokensResponseSchema.parse(demoAccessTokensWire(STORY_NOW));
const APPS = connectedAppsResponseSchema.parse(demoConnectionsWire(STORY_NOW));
const PEOPLE = projectPeopleResponseSchema.parse(demoPeopleWire());
function theDemoAccount(): Account {
  const [account] = myAccountsResponseSchema.parse(demoAccountsWire(STORY_NOW));
  if (account === undefined) {
    throw new Error('The demo has an account.');
  }
  return account;
}

const DEMO_ACCOUNT = theDemoAccount();
const FREE_ACCOUNT: Account = {
  ...DEMO_ACCOUNT,
  status: 'free',
  billingInterval: null,
  trialEndsAt: null,
  currentPeriodEndsAt: null,
  eventsThisMonth: 3_120,
  projectCount: 1,
  peopleCount: 1,
  limits: { eventsPerMonth: 10_000, projects: 1, people: 1, pauseAtEvents: 10_000 },
};
const PAUSED_ACCOUNT: Account = {
  ...FREE_ACCOUNT,
  eventsThisMonth: 10_000,
  ingestionPausedUntil: '2026-11-01T00:00:00.000Z',
};

const MANAGEMENT = new MockProjectManagementService(() => Promise.resolve(english.t));
const PEOPLE_SERVICE = new MockProjectPeopleService(() => STORY_NOW);
const EXPORTS = new MockExportsService(() => STORY_NOW);
const ACCOUNTS = new MockAccountsService(() => STORY_NOW);

const stayOnThePage = (): Promise<BillingRedirectOutcome> =>
  Promise.resolve({ kind: 'noBillingYet' });
const withdrawalWindowClosed = (): Promise<WithdrawOutcome> =>
  Promise.resolve({ kind: 'windowClosed' });

const SERVER_TEXTS: Readonly<Record<Locale, I18n>> = {
  en: english,
  'pt-BR': portuguese,
  es: spanish,
  de: german,
  fr: french,
  it: italian,
  nl: dutch,
};

function serverTextsOf(locale: unknown): I18n {
  return SERVER_TEXTS[
    parseLocale(typeof locale === 'string' ? locale : undefined) ?? DEFAULT_LOCALE
  ];
}

type Who = 'owner' | 'member';

function whenIn(i18n: I18n): When {
  const format = i18n.format.dateTime('eventTime', STORE.timezone);
  return (iso) => format(new Date(iso));
}

function projectFor(who: Who): ProjectSettings {
  return who === 'owner' ? STORE : MEMBER_VIEW;
}

function planPart(accounts: readonly Account[], i18n: I18n): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      {accounts.length === 0 ? (
        <p className="text-sm">{i18n.t('account.noAccount')}</p>
      ) : (
        accounts.map((account) => (
          <AccountOverview
            key={account.id}
            account={account}
            i18n={i18n}
            now={STORY_NOW}
            freePlan="open"
            ownsAnotherFreeAccount={false}
            openCheckout={stayOnThePage}
            subscribe={stayOnThePage}
            openPortal={stayOnThePage}
            withdraw={withdrawalWindowClosed}
            close={(email) => ACCOUNTS.close(account.id, email)}
          />
        ))
      )}
    </div>
  );
}

function bodyOf(section: SettingsSection, who: Who, i18n: I18n): ReactNode {
  const settings = projectFor(who);
  const owner = who === 'owner';
  const when = whenIn(i18n);
  switch (section) {
    case 'project':
      return (
        <ProjectPart
          settings={settings}
          i18n={i18n}
          when={when}
          manage={
            owner
              ? {
                  timezones: timeZoneChoices(settings.timezone),
                  save: () => MANAGEMENT.update(),
                  setCity: (cityEnabled) => MANAGEMENT.setCity(settings.id, cityEnabled),
                }
              : null
          }
        />
      );
    case 'keys':
      return (
        <KeysPart
          settings={settings}
          i18n={i18n}
          when={when}
          manage={
            owner
              ? {
                  createKey: (kind) => MANAGEMENT.createKey(settings.id, kind),
                  revokeKey: (keyId) => MANAGEMENT.revokeKey(settings.id, keyId),
                }
              : null
          }
        />
      );
    case 'people':
      return (
        <PeoplePanel
          people={PEOPLE}
          myEmail={owner ? DEMO_OWNER_EMAIL : MEMBER_EMAIL}
          i18n={i18n}
          when={when}
          manage={
            owner
              ? {
                  add: (email) => PEOPLE_SERVICE.add(settings.id, email),
                  remove: (adminUserId) => PEOPLE_SERVICE.remove(settings.id, adminUserId),
                }
              : null
          }
        />
      );
    case 'email':
      return (
        <EmailPart
          settings={settings}
          preferences={{ weeklyDigest: true }}
          choose={(chosen) => Promise.resolve(chosen)}
        />
      );
    case 'export':
      return <ExportPart settings={settings} i18n={i18n} request={() => EXPORTS.request()} />;
    case 'delete':
      return (
        <DeletePart
          settings={settings}
          i18n={i18n}
          remove={(confirmName) => MANAGEMENT.delete(settings.id, confirmName)}
        />
      );
    case 'plan':
      return planPart(owner ? [DEMO_ACCOUNT] : [], i18n);
    case 'preferences':
      return <PreferencesPanel i18n={i18n} choose={() => Promise.resolve()} />;
    case 'sessions':
      return (
        <SessionsPanel sessions={SESSIONS} i18n={i18n} when={when} end={() => Promise.resolve()} />
      );
    case 'tokens':
      return (
        <AccessTokensPanel
          tokens={TOKENS}
          i18n={i18n}
          when={when}
          create={({ name, lifetimeDays }) =>
            Promise.resolve({
              kind: 'created',
              token: {
                id: '3c9e5a7b-4d6f-4e8a-8b3c-5d7e9f1a3b4c',
                name,
                token: DEMO_CREATED_ACCESS_TOKEN,
                createdAt: STORY_NOW.toISOString(),
                lastUsedAt: null,
                expiresAt: new Date(STORY_NOW.getTime() + lifetimeDays * DAY_MS).toISOString(),
              },
            })
          }
          revoke={() => Promise.resolve()}
        />
      );
    case 'help':
      return (
        <HelpView
          projectId={STORE.id}
          email={DEMO_OWNER_EMAIL}
          plan={supportPlanOf([DEMO_ACCOUNT])}
          i18n={i18n}
          headingLevel="h3"
        />
      );
    case 'apps':
      return (
        <ConnectedAppsPanel apps={APPS} i18n={i18n} when={when} revoke={() => Promise.resolve()} />
      );
  }
}

function youGroup(i18n: I18n): FrameGroup {
  const row = (section: SettingsSection, href: string) => ({
    section,
    href,
    label: i18n.t(SECTION_LOOKS[section].label),
    icon: SECTION_LOOKS[section].icon,
  });
  return {
    label: i18n.t('settings.you'),
    rows: [
      ...ACCOUNT_SECTIONS.map((section) => row(section, accountSectionHref(section))),
      row(HELP_SECTION, helpHref(STORE.id)),
    ],
  };
}

function projectGroup(i18n: I18n, who: Who): FrameGroup {
  const settings = projectFor(who);
  return {
    label: settings.name,
    rows: projectSectionsFor(who === 'owner').map((section) => ({
      section,
      href: projectSectionHref(settings.id, section),
      label: i18n.t(SECTION_LOOKS[section].label),
      icon: SECTION_LOOKS[section].icon,
    })),
  };
}

function frameSection(i18n: I18n, section: SettingsSection): SettingsFrameProps['section'] {
  return {
    key: section,
    title: i18n.t(SECTION_LOOKS[section].label),
    titleId: SECTION_LOOKS[section].titleId,
  };
}

function frameTexts(i18n: I18n): SettingsFrameProps['texts'] {
  return {
    title: i18n.t('nav.settings'),
    sections: i18n.t('settings.sections'),
    backToList: i18n.t('nav.settings'),
  };
}

function windowArgs(who: Who, section: SettingsSection, i18n: I18n = english): SettingsFrameProps {
  return {
    mode: 'window',
    titleLevel: 2,
    texts: frameTexts(i18n),
    email: who === 'owner' ? DEMO_OWNER_EMAIL : MEMBER_EMAIL,
    groups: [projectGroup(i18n, who), youGroup(i18n)],
    section: frameSection(i18n, section),
    children: bodyOf(section, who, i18n),
  };
}

function fullPageArgs(section: SettingsSection): SettingsFrameProps {
  return {
    mode: 'page',
    titleLevel: null,
    texts: frameTexts(english),
    email: DEMO_OWNER_EMAIL,
    groups: [youGroup(english)],
    section: frameSection(english, section),
    children: bodyOf(section, 'owner', english),
  };
}

const FULL_PAGE_FRAME =
  'flex overflow-hidden bg-card lg:min-h-[min(44rem,calc(100dvh-12rem))] lg:rounded-card lg:border lg:border-line';

interface FullPageProps {
  readonly i18n: I18n;
  readonly children: ReactNode;
}

function FullPage({ i18n, children }: FullPageProps) {
  return (
    <div className="relative isolate">
      <BrandBackdrop />
      <div
        className={`mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center gap-6 px-4 py-16 text-ink ${RAISED_CARDS}`}
      >
        <p className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <LogoMark size={32} />
          Pyxis
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{i18n.t('nav.settings')}</h1>
        <div className={FULL_PAGE_FRAME}>{children}</div>
        <Link href="/" className={`self-start text-sm ${TEXT_LINK}`}>
          {i18n.t('account.back')}
        </Link>
      </div>
    </div>
  );
}

const LAPTOP = 'settingsLaptop';
const LAPTOP_WINDOW = { width: 1280, height: 800 } as const;
const PHONE = { viewport: { value: 'mobile1', isRotated: false } } as const;

const meta = {
  title: 'Settings/Settings window',
  component: SettingsFrame,
  tags: ['autodocs'],
  args: windowArgs('owner', 'project'),
  argTypes: { children: { control: false } },
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    viewport: {
      options: {
        [LAPTOP]: {
          name: 'Laptop window, 1280×800',
          styles: {
            width: `${String(LAPTOP_WINDOW.width)}px`,
            height: `${String(LAPTOP_WINDOW.height)}px`,
          },
        },
      },
    },
  },
  globals: { viewport: { value: LAPTOP, isRotated: false } },
  decorators: [
    (Story, { args, globals, parameters }) =>
      args.mode === 'window' ? (
        <SettingsDialog
          closeLabel={serverTextsOf(globals.locale).t('settings.close')}
          initialView={parameters.frameView === 'list' ? 'list' : 'section'}
        >
          <Story />
        </SettingsDialog>
      ) : (
        <FullPage i18n={serverTextsOf(globals.locale)}>
          <Story />
        </FullPage>
      ),
  ],
} satisfies Meta<typeof SettingsFrame>;

export default meta;
type Story = StoryObj<typeof meta>;
type Play = NonNullable<Story['play']>;

function sectionsMenu(canvasElement: HTMLElement): HTMLElement {
  return within(canvasElement).getByRole('navigation', { name: 'Sections' });
}

function currentRow(canvasElement: HTMLElement): HTMLElement {
  return within(sectionsMenu(canvasElement)).getByRole('link', { current: 'page' });
}

async function listsTheRows(canvasElement: HTMLElement, rows: readonly string[]) {
  const links = within(sectionsMenu(canvasElement)).getAllByRole('link');
  await expect(links.map((link) => link.textContent)).toEqual(rows);
}

async function showsTheMenuBesideTheSection(canvasElement: HTMLElement, title: string) {
  const canvas = within(canvasElement);
  await expect(window.innerWidth).toBe(LAPTOP_WINDOW.width);
  await expect(sectionsMenu(canvasElement)).toBeVisible();
  await expect(canvas.getByRole('region', { name: title })).toBeVisible();
  await expect(currentRow(canvasElement)).toHaveAccessibleName(title);
  await expect(canvas.queryByRole('button', { name: 'Settings' })).toBeNull();
}

const OWNER_ROWS = [
  'Project',
  'Keys',
  'People',
  'E-mail',
  'Export events',
  'Delete project',
  'Account and billing',
  'Theme and language',
  'Sessions',
  'Access tokens',
  'Connected apps',
  'Help and support',
] as const;
const OWNER_ONLY_ROWS: ReadonlySet<string> = new Set(['Export events', 'Delete project']);
const MEMBER_ROWS = OWNER_ROWS.filter((row) => !OWNER_ONLY_ROWS.has(row));
const YOU_ROWS = [
  'Account and billing',
  'Theme and language',
  'Sessions',
  'Access tokens',
  'Connected apps',
  'Help and support',
] as const;

const ownerWindow =
  (title: string): Play =>
  async ({ canvasElement }) => {
    await showsTheMenuBesideTheSection(canvasElement, title);
    await listsTheRows(canvasElement, OWNER_ROWS);
  };

const memberWindow =
  (title: string): Play =>
  async ({ canvasElement }) => {
    await showsTheMenuBesideTheSection(canvasElement, title);
    await listsTheRows(canvasElement, MEMBER_ROWS);
  };

function sectionNamed(canvasElement: HTMLElement, title: string): HTMLElement {
  return within(canvasElement).getByRole('region', { name: title });
}

export const OwnerProject: Story = { play: ownerWindow('Project') };

export const OwnerKeys: Story = { args: windowArgs('owner', 'keys'), play: ownerWindow('Keys') };

export const OwnerPeople: Story = {
  args: windowArgs('owner', 'people'),
  play: ownerWindow('People'),
};

export const OwnerEmail: Story = {
  args: windowArgs('owner', 'email'),
  play: ownerWindow('E-mail'),
};

export const OwnerExportEvents: Story = {
  args: windowArgs('owner', 'export'),
  play: ownerWindow('Export events'),
};

export const OwnerDeleteProject: Story = {
  args: windowArgs('owner', 'delete'),
  play: ownerWindow('Delete project'),
};

export const MemberProject: Story = {
  args: windowArgs('member', 'project'),
  play: async (context) => {
    await memberWindow('Project')(context);
    const canvas = within(context.canvasElement);
    for (const origin of STORE.allowedOrigins) {
      await expect(canvas.getByText(origin)).toBeVisible();
    }
  },
};

export const MemberKeys: Story = {
  args: windowArgs('member', 'keys'),
  play: async (context) => {
    await memberWindow('Keys')(context);
    await expect(
      within(sectionNamed(context.canvasElement, 'Keys')).queryAllByRole('button'),
    ).toHaveLength(0);
  },
};

export const MemberPeople: Story = {
  args: windowArgs('member', 'people'),
  play: async (context) => {
    await memberWindow('People')(context);
    await expect(
      within(sectionNamed(context.canvasElement, 'People')).queryAllByRole('button'),
    ).toHaveLength(0);
  },
};

export const MemberEmail: Story = {
  args: windowArgs('member', 'email'),
  play: memberWindow('E-mail'),
};

export const Sessions: Story = {
  args: windowArgs('owner', 'sessions'),
  play: ownerWindow('Sessions'),
};

export const AccessTokens: Story = {
  args: windowArgs('owner', 'tokens'),
  play: ownerWindow('Access tokens'),
};

export const ConnectedApps: Story = {
  args: windowArgs('owner', 'apps'),
  play: ownerWindow('Connected apps'),
};

const ACCOUNT_AND_BILLING = 'Account and billing';

function planWindowWith(account: Account): SettingsFrameProps {
  return { ...windowArgs('owner', 'plan'), children: planPart([account], english) };
}

async function showsThePlanCard(canvasElement: HTMLElement, plan: string, usage: string) {
  const part = sectionNamed(canvasElement, ACCOUNT_AND_BILLING);
  const card = within(part).getByRole('region', { name: plan });
  await expect(within(card).getByRole('heading', { level: 3, name: plan })).toBeVisible();
  await expect(within(card).getByText(usage)).toBeVisible();
  await expect(within(part).getByRole('button', { name: 'Close the account' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(within(part).queryByRole('textbox')).toBeNull();
}

export const AccountAndBilling: Story = {
  args: windowArgs('owner', 'plan'),
  play: async (context) => {
    await ownerWindow(ACCOUNT_AND_BILLING)(context);
    await showsThePlanCard(context.canvasElement, 'Plan: Monthly', '41,230 of 100,000');
    await expect(
      within(sectionNamed(context.canvasElement, ACCOUNT_AND_BILLING)).getByRole('button', {
        name: 'Manage billing',
      }),
    ).toBeVisible();
  },
};

export const AccountAndBillingOnTheFreePlan: Story = {
  args: planWindowWith(FREE_ACCOUNT),
  play: async (context) => {
    await ownerWindow(ACCOUNT_AND_BILLING)(context);
    await showsThePlanCard(context.canvasElement, 'Plan', '3,120 of 10,000');
    const part = sectionNamed(context.canvasElement, ACCOUNT_AND_BILLING);
    await expect(
      within(part).getByRole('heading', { level: 4, name: 'The paid plan' }),
    ).toBeVisible();
    await expect(within(part).getByRole('button', { name: 'Subscribe now' })).toBeVisible();
  },
};

export const AccountAndBillingPaused: Story = {
  args: planWindowWith(PAUSED_ACCOUNT),
  play: async (context) => {
    await ownerWindow(ACCOUNT_AND_BILLING)(context);
    await showsThePlanCard(context.canvasElement, 'Plan', '10,000 of 10,000');
    const part = sectionNamed(context.canvasElement, ACCOUNT_AND_BILLING);
    await expect(within(part).getByText(/^Measuring is paused until /)).toBeVisible();
    await expect(
      within(part).getByText('Measuring resumes within a minute of subscribing.'),
    ).toBeVisible();
  },
};

export const AccountAndBillingWithoutAnAccount: Story = {
  args: windowArgs('member', 'plan'),
  play: async (context) => {
    await memberWindow(ACCOUNT_AND_BILLING)(context);
    const part = sectionNamed(context.canvasElement, ACCOUNT_AND_BILLING);
    await expect(within(part).getByText(/^You do not own a Pyxis account\./)).toBeVisible();
    await expect(within(part).queryByRole('region', { name: /^Plan/ })).toBeNull();
    await expect(within(part).queryByRole('button', { name: 'Close the account' })).toBeNull();
  },
};

export const AccountAndBillingDark: Story = {
  args: windowArgs('owner', 'plan'),
  globals: { theme: 'dark' },
  play: async (context) => {
    await ownerWindow(ACCOUNT_AND_BILLING)(context);
    await showsThePlanCard(context.canvasElement, 'Plan: Monthly', '41,230 of 100,000');
  },
};

export const AccountAndBillingOnAPhone: Story = {
  args: windowArgs('owner', 'plan'),
  globals: PHONE,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('navigation', { name: 'Sections' })).toBeNull();
    await expect(sectionNamed(canvasElement, ACCOUNT_AND_BILLING)).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Settings' })).toBeVisible();
    await showsThePlanCard(canvasElement, 'Plan: Monthly', '41,230 of 100,000');
  },
};

export const AccountAndBillingOnAPhoneDark: Story = {
  ...AccountAndBillingOnAPhone,
  globals: { ...PHONE, theme: 'dark' },
};

export const AccountAndBillingFullPage: Story = {
  args: fullPageArgs('plan'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await listsTheRows(canvasElement, YOU_ROWS);
    await expect(currentRow(canvasElement)).toHaveAccessibleName(ACCOUNT_AND_BILLING);
    await showsThePlanCard(canvasElement, 'Plan: Monthly', '41,230 of 100,000');
  },
};

const THEME_AND_LANGUAGE = 'Theme and language';

async function showsTheChoicesOfThisBrowser(
  canvasElement: HTMLElement,
  title: string,
  language: { readonly label: string; readonly name: string },
) {
  const part = within(sectionNamed(canvasElement, title));
  const themes = part.getByRole('group');
  await expect(within(themes).getAllByRole('button')).toHaveLength(3);
  await expect(within(themes).getAllByRole('button', { pressed: true })).toHaveLength(1);
  await expect(part.getByRole('combobox', { name: language.label })).toHaveDisplayValue(
    language.name,
  );
}

export const ThemeAndLanguage: Story = {
  args: windowArgs('owner', 'preferences'),
  play: async (context) => {
    await ownerWindow(THEME_AND_LANGUAGE)(context);
    await expect(
      within(sectionNamed(context.canvasElement, THEME_AND_LANGUAGE)).getByText(
        'These apply to this browser.',
      ),
    ).toBeVisible();
    await showsTheChoicesOfThisBrowser(context.canvasElement, THEME_AND_LANGUAGE, {
      label: 'Language',
      name: 'English',
    });
  },
};

export const ThemeAndLanguageDark: Story = {
  ...ThemeAndLanguage,
  globals: { theme: 'dark' },
};

export const ThemeAndLanguageOnAPhone: Story = {
  args: windowArgs('owner', 'preferences'),
  globals: PHONE,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('navigation', { name: 'Sections' })).toBeNull();
    await showsTheChoicesOfThisBrowser(canvasElement, THEME_AND_LANGUAGE, {
      label: 'Language',
      name: 'English',
    });
  },
};

export const ThemeAndLanguageInPortuguese: Story = {
  args: windowArgs('owner', 'preferences', portuguese),
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    await expect(
      within(sectionNamed(canvasElement, 'Tema e idioma')).getByText('Valem para este navegador.'),
    ).toBeVisible();
    await showsTheChoicesOfThisBrowser(canvasElement, 'Tema e idioma', {
      label: 'Idioma',
      name: 'Português (Brasil)',
    });
  },
};

const HELP_AND_SUPPORT = 'Help and support';

async function showsHowToReachSupport(canvasElement: HTMLElement) {
  const part = within(sectionNamed(canvasElement, HELP_AND_SUPPORT));
  await expect(part.getByText('hello@pyxis-analytics.dev')).toBeVisible();
  await expect(part.getByRole('button', { name: 'Copy' })).toBeVisible();
  await expect(
    part.getByRole('heading', { level: 3, name: 'Found a security flaw?' }),
  ).toBeVisible();
}

export const HelpAndSupport: Story = {
  args: windowArgs('owner', 'help'),
  play: async (context) => {
    await ownerWindow(HELP_AND_SUPPORT)(context);
    await showsHowToReachSupport(context.canvasElement);
  },
};

export const HelpAndSupportDark: Story = {
  ...HelpAndSupport,
  globals: { theme: 'dark' },
};

export const HelpAndSupportOnAPhone: Story = {
  args: windowArgs('owner', 'help'),
  globals: PHONE,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('navigation', { name: 'Sections' })).toBeNull();
    await showsHowToReachSupport(canvasElement);
  },
};

export const FullPageOutsideAProject: Story = {
  args: fullPageArgs('sessions'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await listsTheRows(canvasElement, YOU_ROWS);
  },
};

export const DarkTheme: Story = {
  args: windowArgs('owner', 'keys'),
  globals: { theme: 'dark' },
  play: ownerWindow('Keys'),
};

export const InPortuguese: Story = {
  args: windowArgs('owner', 'project', portuguese),
  globals: { locale: 'pt-BR' },
};

export const OnAPhoneTheListFirst: Story = {
  globals: PHONE,
  parameters: { frameView: 'list' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(sectionsMenu(canvasElement)).toBeVisible();
    await expect(canvas.queryByRole('region', { name: 'Project' })).toBeNull();
    await userEvent.click(currentRow(canvasElement));
    await expect(sectionNamed(canvasElement, 'Project')).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 2, name: 'Project' })).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
    await expect(currentRow(canvasElement)).toHaveFocus();
  },
};

export const OnAPhoneInASection: Story = {
  args: windowArgs('owner', 'keys'),
  globals: PHONE,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('navigation', { name: 'Sections' })).toBeNull();
    await expect(canvas.getByRole('region', { name: 'Keys' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Settings' })).toBeVisible();
  },
};

export const OnAPhoneInASectionDark: Story = {
  ...OnAPhoneInASection,
  globals: { ...PHONE, theme: 'dark' },
};
