import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { ACCOUNT_MENU_SIGN_OUT_LOOK, AccountMenu } from './account-menu';
import { SignOutButton } from './sign-out-button';

const PROJECT_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';
const LONG_EMAIL = 'analytics.operations+dashboards@a-very-long-company-domain.example';
const PHONE_WIDTH_PX = 320;
const PHONE_TOUCH_TARGET_PX = 44;

const DEMO_USAGE: MonthUsage = {
  events: 41_230,
  limit: 100_000,
  share: 0.4123,
  pausedUntil: null,
  resetsOn: '2026-11-01T00:00:00.000Z',
};

const meta = {
  title: 'Shell/Account menu',
  component: AccountMenu,
  tags: ['autodocs'],
  args: { email: 'owner@example.com', projectId: PROJECT_ID, i18n: english, usage: DEMO_USAGE },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${PROJECT_ID}/overview`, query: { range: '7d' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[30rem] justify-end bg-card px-4 py-2.5 text-ink">
        <div className="relative">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;
type Play = NonNullable<Story['play']>;

function boxOf(element: Element | null): DOMRect {
  if (element === null) {
    throw new Error('The account menu part is missing.');
  }
  return element.getBoundingClientRect();
}

const open: Play = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByText('Account and preferences'));
};

const opensOnEveryChoice: Play = async (context) => {
  await open(context);
  const canvas = within(context.canvasElement);
  for (const name of [/^Account and billing/, 'Theme and language', 'Help and support']) {
    await expect(canvas.getByRole('link', { name })).toBeVisible();
  }
  await expect(canvas.getByRole('button', { name: 'Sign out' })).toBeVisible();
  await expect(canvas.getByText('No cookies, no personal data')).toBeVisible();
  const avatar = canvas.getByText('Account and preferences').closest('summary');
  const panel = canvas.getByRole('link', { name: 'Theme and language' }).closest('details > div');
  await expect(boxOf(panel).top).toBeGreaterThanOrEqual(boxOf(avatar).bottom);
};

export const Closed: Story = {};

export const Member: Story = {
  args: { email: 'member@example.com', usage: null },
  play: async (context) => {
    await opensOnEveryChoice(context);
    await expect(context.canvasElement.querySelector('[data-usage-ring]')).toBeNull();
    await expect(within(context.canvasElement).queryByText(/events this month/)).toBeNull();
  },
};

export const Open: Story = {
  play: async (context) => {
    await opensOnEveryChoice(context);
    await expect(
      within(context.canvasElement).getByText('41,230 of 100,000 events this month', {
        selector: 'a span',
      }),
    ).toBeVisible();
  },
};

export const OpenDark: Story = { globals: { theme: 'dark' }, play: opensOnEveryChoice };

export const NearTheQuota: Story = {
  args: { usage: { ...DEMO_USAGE, events: 82_000, share: 0.82 } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.stroke-usage-warn')).not.toBeNull();
  },
};

export const NearTheQuotaDark: Story = { ...NearTheQuota, globals: { theme: 'dark' } };

export const StartOfTheMonth: Story = {
  args: { usage: { ...DEMO_USAGE, events: 0, share: 0 } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-usage-ring] circle')).toHaveLength(1);
  },
};

const PAUSED: MonthUsage = {
  ...DEMO_USAGE,
  events: 150_000,
  share: 1.5,
  pausedUntil: '2026-11-01T00:00:00.000Z',
};

export const WhileReceptionIsPaused: Story = {
  args: { usage: PAUSED },
  play: async (context) => {
    await expect(context.canvasElement.querySelector('.stroke-usage-paused')).toHaveAttribute(
      'stroke-dasharray',
      '7 3',
    );
    await open(context);
    await expect(
      within(context.canvasElement).getByText(
        /Measuring is paused until Nov 1: the account passed/,
      ),
    ).toBeVisible();
  },
};

export const WhileReceptionIsPausedDark: Story = {
  ...WhileReceptionIsPaused,
  globals: { theme: 'dark' },
};

export const BrazilianPortuguese: Story = {
  args: { i18n: portuguese },
  globals: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Conta e preferências'));
    await expect(canvas.getByRole('link', { name: 'Tema e idioma' })).toHaveAttribute(
      'href',
      '/account/preferences',
    );
    await expect(canvas.getByText('Sem cookies, sem dados pessoais')).toBeVisible();
  },
};

export const LongEmail: Story = {
  args: { email: LONG_EMAIL },
  play: async (context) => {
    await open(context);
    const email = within(context.canvasElement).getByText(LONG_EMAIL);
    await expect(email.scrollWidth).toBeLessThanOrEqual(email.clientWidth);
    await expect(getComputedStyle(email).textOverflow).not.toBe('ellipsis');
  },
};

export const OnAPhone: Story = {
  args: { email: LONG_EMAIL },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async (context) => {
    await expect(window.innerWidth).toBe(PHONE_WIDTH_PX);
    const avatar = within(context.canvasElement)
      .getByText('Account and preferences')
      .closest('summary');
    await expect(boxOf(avatar).width).toBeGreaterThanOrEqual(PHONE_TOUCH_TARGET_PX);
    await opensOnEveryChoice(context);
    const panel = within(context.canvasElement)
      .getByRole('link', { name: 'Theme and language' })
      .closest('details > div');
    await expect(boxOf(panel).left).toBeGreaterThanOrEqual(0);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const OnTheHelpPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${PROJECT_ID}/help`, query: { range: '7d' } },
    },
  },
  play: async (context) => {
    await open(context);
    const help = within(context.canvasElement).getByRole('link', { name: 'Help and support' });
    await expect(help).toHaveAttribute('aria-current', 'page');
    await expect(help.querySelector('svg')).toBeInTheDocument();
  },
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const avatar = within(canvasElement).getByText('Account and preferences').closest('summary');
    avatar?.focus();
    await expect(avatar).toHaveFocus();
  },
};

export const Hovered: Story = { parameters: { pseudo: { hover: ['details'] } } };

export const HoveredDark: Story = { ...Hovered, globals: { theme: 'dark' } };

export const Pressed: Story = { parameters: { pseudo: { active: ['summary'] } } };

export const PressedDark: Story = { ...Pressed, globals: { theme: 'dark' } };

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
  function SignOutInTheAccountMenu() {
    return (
      <div className="w-72 rounded-input border border-line bg-card p-1.5">
        <SignOutButton authService={authService} variant={ACCOUNT_MENU_SIGN_OUT_LOOK} />
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
