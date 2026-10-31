import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { HelpMenuRow } from './help-menu-row';

const PROJECT_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const onPage = (segment: string) => ({
  nextjs: {
    appDirectory: true,
    navigation: { pathname: `/${PROJECT_ID}/${segment}`, query: { range: '7d' } },
  },
});

const meta = {
  title: 'Shell/HelpMenuRow',
  component: HelpMenuRow,
  tags: ['autodocs'],
  args: { projectId: PROJECT_ID, label: 'Help and support' },
  parameters: onPage('overview'),
  decorators: [
    (Story) => (
      <div className="w-56 rounded-input border border-nav-border bg-nav-raised p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HelpMenuRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverAScreen: Story = {
  play: async ({ canvasElement }) => {
    const row = within(canvasElement).getByRole('link', { name: 'Help and support' });
    await expect(row).toHaveAttribute('href', `/${PROJECT_ID}/help?range=7d`);
    await expect(row).not.toHaveAttribute('aria-current');
  },
};

export const OnTheHelpPage: Story = {
  parameters: onPage('help'),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Help and support' }),
    ).toHaveAttribute('aria-current', 'page');
  },
};

export const OnTheHelpPageDark: Story = { ...OnTheHelpPage, globals: { theme: 'dark' } };
