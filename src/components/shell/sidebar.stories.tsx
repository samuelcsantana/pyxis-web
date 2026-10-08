import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { Admin } from '@/domain/admin';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { DEMO_ADMIN } from '@/services/projects/mock-projects-service';
import { english } from '@/test-utils/english';
import { MobileMenu } from './mobile-menu';
import { Sidebar } from './sidebar';
import { SignOutButton } from './sign-out-button';

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

const nothingIsCut: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  for (const text of [LONG_VALUES.email, LONG_PROJECT.name, LONG_PROJECT.timezone]) {
    for (const element of canvas.getAllByText(text)) {
      await expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth);
      await expect(getComputedStyle(element).textOverflow).not.toBe('ellipsis');
    }
  }
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
    await expect(canvas.getByRole('button', { name: 'Português (Brasil)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};

export const LongValues: Story = {
  args: { admin: LONG_VALUES, project: LONG_PROJECT },
  play: nothingIsCut,
};

export const LongValuesDark: Story = {
  args: { admin: LONG_VALUES, project: LONG_PROJECT },
  globals: { theme: 'dark' },
  play: nothingIsCut,
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
  (Story) => (
    <div className="w-[390px]">
      <MobileMenu barActions={<ThemeToggle surface="nav" />}>
        <Story />
      </MobileMenu>
    </div>
  ),
];

export const OnAPhone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
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
