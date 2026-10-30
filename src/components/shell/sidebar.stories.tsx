import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { Admin } from '@/domain/admin';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { DEMO_EXPORT_ID } from '@/services/exports/mock-exports-service';
import { demoAdminOf } from '@/services/projects/mock-projects-service';
import { english } from '@/test-utils/english';
import { MobileMenu } from './mobile-menu';
import { Sidebar } from './sidebar';
import { SignOutButton } from './sign-out-button';

const DEMO_ADMIN = demoAdminOf(english.t, new Date('2026-10-06T02:30:00.000Z'));
const [STORE] = DEMO_ADMIN.projects;
if (STORE === undefined) {
  throw new Error('The demo admin has no project.');
}

const ONE_PROJECT: Admin = { ...DEMO_ADMIN, projects: [STORE] };

const LONG_PROJECT = {
  ...STORE,
  name: 'Customer Self-Service Portal (Production)',
  timezone: 'America/Argentina/Buenos_Aires',
};

const LONG_VALUES: Admin = {
  email: 'analytics.operations+dashboards@a-very-long-company-domain.example',
  projects: [LONG_PROJECT, ...DEMO_ADMIN.projects.slice(1)],
};

function linesOf(node: Node): DOMRectList {
  const range = document.createRange();
  range.selectNodeContents(node);
  return range.getClientRects();
}

const nothingIsCut: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  for (const text of [LONG_VALUES.email, LONG_PROJECT.name, LONG_PROJECT.timezone]) {
    for (const element of canvas.getAllByText(text)) {
      await expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth);
      await expect(getComputedStyle(element).textOverflow).not.toBe('ellipsis');
    }
  }
  const zoneParts = [...canvas.getByText(LONG_PROJECT.timezone).childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map(linesOf);
  await expect(zoneParts.map((lines) => lines.length)).toEqual([1, 1, 1]);
  await expect(new Set(zoneParts.map((lines) => lines[0]?.top)).size).toBeGreaterThan(1);
};

const meta = {
  title: 'Shell/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    admin: DEMO_ADMIN,
    project: STORE,
    i18n: english,
    chooseLocale: fn(() => Promise.resolve()),
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${STORE.id}/overview`, query: { range: '7d' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[900px] w-[248px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverviewSelected: Story = {};

export const SingleProject: Story = { args: { admin: ONE_PROJECT } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const BrazilianPortuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Sem cookies, sem dados pessoais')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Visão geral' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Configurações' })).toBeVisible();
    await userEvent.click(canvas.getByText('Conta e preferências'));
    await expect(canvas.getByRole('button', { name: 'Português (Brasil)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('group', { name: 'Tema' })).toBeVisible();
  },
};

const openTheAccountMenu: Play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText('Account and preferences'));
  await expect(canvas.getByRole('group', { name: 'Language' })).toBeVisible();
  await expect(canvas.getByRole('group', { name: 'Theme' })).toBeVisible();
  await expect(canvas.getByRole('button', { name: 'Sign out' })).toBeVisible();
};

export const AccountMenuOpen: Story = { play: openTheAccountMenu };

export const AccountMenuOpenDark: Story = { globals: { theme: 'dark' }, play: openTheAccountMenu };

export const LongValues: Story = {
  args: { admin: LONG_VALUES, project: LONG_PROJECT },
  play: nothingIsCut,
};

export const LongValuesDark: Story = {
  args: { admin: LONG_VALUES, project: LONG_PROJECT },
  globals: { theme: 'dark' },
  play: nothingIsCut,
};

const FILTERED_DEVICES_VIEW = { range: '7d', device: 'mobile' };

export const LogoKeepsTheView: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${STORE.id}/devices`, query: FILTERED_DEVICES_VIEW },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      `/${STORE.id}/overview?${new URLSearchParams(FILTERED_DEVICES_VIEW).toString()}`,
    );
  },
};

const onPageOf = (segment: string) => ({
  nextjs: { appDirectory: true, navigation: { pathname: `/${STORE.id}/${segment}` } },
});

const currentLinksOutsideTheMenus = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .queryAllByRole('link', { current: 'page' })
    .filter((link) => link.closest('details') === null);

const standsForThePage =
  (name: string): Play =>
  async ({ canvasElement }) => {
    const current = currentLinksOutsideTheMenus(canvasElement);
    await expect(current).toHaveLength(1);
    await expect(current[0]).toHaveAccessibleName(name);
    await expect(canvasElement.querySelector('summary[data-current]')).toBeNull();
  };

export const OnInstall: Story = {
  parameters: onPageOf('install'),
  play: standsForThePage('Install'),
};

export const OnAnExport: Story = {
  parameters: onPageOf(`exports/${DEMO_EXPORT_ID}`),
  play: standsForThePage('Settings'),
};

const NO_EVENTS_YET = { ...STORE, firstEventAt: null };

function spokenWithItsTag(label: string, tag: string): RegExp {
  return new RegExp(`^${label}\\s*, ${tag}$`);
}

const theInstallGuideIsPending: Play = async ({ canvasElement }) => {
  const install = within(canvasElement).getByRole('link', {
    name: spokenWithItsTag('Install', 'Pending'),
  });
  const tag = within(install).getByText('Pending');
  await expect(tag).toBeVisible();
  await expect(tag.parentElement?.getBoundingClientRect().right).toBeLessThanOrEqual(
    install.getBoundingClientRect().right,
  );
};

export const NoEventsYet: Story = {
  args: { project: NO_EVENTS_YET, admin: { ...DEMO_ADMIN, projects: [NO_EVENTS_YET] } },
  play: theInstallGuideIsPending,
};

export const NoEventsYetDark: Story = {
  args: { project: NO_EVENTS_YET, admin: { ...DEMO_ADMIN, projects: [NO_EVENTS_YET] } },
  globals: { theme: 'dark' },
  play: theInstallGuideIsPending,
};

const pendingTagFitsIn =
  (install: string, pending: string): Play =>
  async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: spokenWithItsTag(install, pending),
    });
    const tag = within(link).getByText(pending);
    const pill = boxOf(tag.parentElement);
    const box = link.getBoundingClientRect();
    await expect(pill.height).toBeLessThanOrEqual(TAG_LINE_HEIGHT_PX);
    await expect(pill.left).toBeGreaterThanOrEqual(box.left);
    await expect(pill.right).toBeLessThanOrEqual(box.right);
    await expect(pill.bottom).toBeLessThanOrEqual(box.bottom);
    await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth);
  };

const TAG_LINE_HEIGHT_PX = 20;
const NO_EVENTS_YET_ARGS = {
  project: NO_EVENTS_YET,
  admin: { ...DEMO_ADMIN, projects: [NO_EVENTS_YET] },
};
const NARROWED_BY_A_SCROLLBAR: NonNullable<Story['decorators']> = [
  (Story) => (
    <div className="w-[233px]">
      <Story />
    </div>
  ),
];

export const NoEventsYetInDutch: Story = {
  args: NO_EVENTS_YET_ARGS,
  globals: { locale: 'nl' },
  play: pendingTagFitsIn('Installeren', 'In afwachting'),
};

export const NoEventsYetInGerman: Story = {
  args: NO_EVENTS_YET_ARGS,
  globals: { locale: 'de' },
  play: pendingTagFitsIn('Installieren', 'Ausstehend'),
};

export const NoEventsYetOnInstallInDutch: Story = {
  args: NO_EVENTS_YET_ARGS,
  parameters: onPageOf('install'),
  globals: { locale: 'nl' },
  play: pendingTagFitsIn('Installeren', 'In afwachting'),
};

export const NoEventsYetNarrowedInDutch: Story = {
  args: NO_EVENTS_YET_ARGS,
  parameters: onPageOf('install'),
  globals: { locale: 'nl' },
  decorators: NARROWED_BY_A_SCROLLBAR,
  play: pendingTagFitsIn('Installeren', 'In afwachting'),
};

export const NoEventsYetNarrowedInGerman: Story = {
  args: NO_EVENTS_YET_ARGS,
  parameters: onPageOf('install'),
  globals: { locale: 'de' },
  decorators: NARROWED_BY_A_SCROLLBAR,
  play: pendingTagFitsIn('Installieren', 'Ausstehend'),
};

export const OnHelp: Story = {
  parameters: onPageOf('help'),
  play: standsForThePage('Help and support'),
};

export const OnHelpDark: Story = {
  parameters: onPageOf('help'),
  globals: { theme: 'dark' },
  play: standsForThePage('Help and support'),
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const funnel = within(canvasElement).getByRole('link', { name: 'Funnel' });
    funnel.focus();
    await expect(funnel).toHaveFocus();
  },
};

export const Hovered: Story = {
  parameters: {
    pseudo: { hover: ['a[href*="/funnel"]', 'summary', 'button'] },
  },
};

export const Pressed: Story = {
  parameters: { pseudo: { active: ['a[href*="/devices"]'] } },
};

type Play = NonNullable<Story['play']>;

const openTheSwitcher: Play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByText('Switch project. Current project:'));
  for (const project of DEMO_ADMIN.projects) {
    await expect(canvas.getByRole('link', { name: project.name })).toBeVisible();
  }
  await expect(canvas.getByRole('link', { name: STORE.name })).toHaveAttribute(
    'aria-current',
    'page',
  );
};

export const SwitcherOpen: Story = { play: openTheSwitcher };

export const SwitcherOpenDark: Story = { globals: { theme: 'dark' }, play: openTheSwitcher };

class PendingSignOut extends MockAuthService {
  override signOut(): Promise<void> {
    return new Promise(() => undefined);
  }
}

class FailingSignOut extends MockAuthService {
  override signOut(): Promise<void> {
    return Promise.reject(new Error('The API answered 503'));
  }
}

const signOutWith = (authService: MockAuthService): Story['render'] =>
  function SignOutOnTheNav() {
    return (
      <div className="flex flex-wrap gap-1 bg-nav p-4">
        <SignOutButton authService={authService} />
      </div>
    );
  };

const clickSignOut = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Sign out' }));
  return canvas;
};

const showsSigningOut: Play = async ({ canvasElement }) => {
  const canvas = await clickSignOut(canvasElement);
  const button = await canvas.findByRole('button', { name: 'Signing out…' });
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
};

const showsTheSignOutError: Play = async ({ canvasElement }) => {
  const canvas = await clickSignOut(canvasElement);
  await expect(await canvas.findByRole('alert')).toHaveTextContent(
    'Could not sign out. Try again.',
  );
  await expect(await canvas.findByRole('button', { name: 'Sign out' })).toBeEnabled();
};

export const SignOutIdle: Story = { render: signOutWith(new MockAuthService()) };

export const SigningOut: Story = {
  render: signOutWith(new PendingSignOut()),
  play: showsSigningOut,
};

export const SigningOutDark: Story = {
  render: signOutWith(new PendingSignOut()),
  globals: { theme: 'dark' },
  play: showsSigningOut,
};

export const SignOutFailed: Story = {
  render: signOutWith(new FailingSignOut()),
  play: showsTheSignOutError,
};

export const SignOutFailedDark: Story = {
  render: signOutWith(new FailingSignOut()),
  globals: { theme: 'dark' },
  play: showsTheSignOutError,
};

const insideTheMobileMenu: NonNullable<Story['decorators']> = [
  (Story, { args }) => (
    <div className="w-[390px]">
      <MobileMenu projectId={args.project.id}>
        <Story />
      </MobileMenu>
    </div>
  ),
];

export const OnAPhone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
};

const SHORT_LAPTOP_WINDOW = { width: 1366, height: 650 } as const;
const SHORT_LAPTOP = 'shortLaptop';

function boxOf(element: Element | null): DOMRect {
  if (element === null) {
    throw new Error('The sidebar part is missing.');
  }
  return element.getBoundingClientRect();
}

export const ShortWindow: Story = {
  parameters: {
    viewport: {
      options: {
        [SHORT_LAPTOP]: {
          name: 'Laptop window, 1366×650',
          styles: {
            width: `${String(SHORT_LAPTOP_WINDOW.width)}px`,
            height: `${String(SHORT_LAPTOP_WINDOW.height)}px`,
          },
        },
      },
    },
  },
  globals: { viewport: { value: SHORT_LAPTOP, isRotated: false } },
  decorators: [
    (Story, { args }) => (
      <MobileMenu projectId={args.project.id}>
        <Story />
      </MobileMenu>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(window.innerHeight).toBe(SHORT_LAPTOP_WINDOW.height);
    const screens = canvas.getByText('Analytics').parentElement;
    await expect(screens?.scrollHeight).toBeGreaterThan(screens?.clientHeight ?? Infinity);
    for (const part of ['Switch project. Current project:', 'Account and preferences']) {
      const box = boxOf(canvas.getByText(part).closest('summary'));
      await expect(box.top).toBeGreaterThanOrEqual(0);
      await expect(box.bottom).toBeLessThanOrEqual(SHORT_LAPTOP_WINDOW.height);
    }
  },
};

const openTheMenu: Play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
  await expect(canvas.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(canvas.getByRole('link', { name: 'Funnel' })).toBeVisible();
};

export const MenuOpenOnAPhone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
  play: openTheMenu,
};

export const MenuOpenOnAPhoneDark: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  globals: { theme: 'dark' },
  decorators: insideTheMobileMenu,
  play: openTheMenu,
};

export const SwitcherOpenInTheMenuOnAPhone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
  play: async (context) => {
    await openTheMenu(context);
    await openTheSwitcher(context);
  },
};

export const MenuClosedWithEscape: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('button', { name: 'Open menu' })).toHaveFocus();
  },
};

export const MenuButtonPressed: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    pseudo: { active: ['button[aria-controls="main-navigation"]'] },
  },
  decorators: insideTheMobileMenu,
};
