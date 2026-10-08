import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { Admin } from '@/domain/admin';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { DEMO_ADMIN } from '@/services/projects/mock-projects-service';
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
  args: { admin: DEMO_ADMIN, project: STORE },
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

export const SigningOut: Story = {
  render: () => (
    <div className="bg-nav p-4">
      <SignOutButton authService={new MockAuthService()} />
    </div>
  ),
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

export const MenuOpenOnAPhone: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  decorators: insideTheMobileMenu,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await expect(canvas.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByRole('link', { name: 'Funnel' })).toBeVisible();
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
