import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { InstallCall } from './install-call';

const PROJECT_ID = '6f1d3c2a-8b4e-4f7a-9c1d-2e3f4a5b6c7d';

const meta = {
  title: 'Shell/InstallCall',
  component: InstallCall,
  tags: ['autodocs'],
  args: { projectId: PROJECT_ID, waiting: 'Waiting for the first event' },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: `/${PROJECT_ID}/overview`, query: { range: '7d' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-wrap items-center gap-x-2.5 bg-card px-8 py-5 text-ink">
        <h1 className="text-title leading-7 font-semibold tracking-tight">Overview</h1>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InstallCall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WaitingForTheFirstEvent: Story = {
  play: async ({ canvasElement }) => {
    const call = within(canvasElement).getByRole('link', {
      name: /^Install Pyxis\s*, Waiting for the first event$/,
    });
    await expect(call).toHaveAttribute('href', `/${PROJECT_ID}/install?range=7d`);
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

const focusTheCall: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const call = within(canvasElement).getByRole('link', { name: /^Install Pyxis/ });
  call.focus();
  await expect(call).toHaveFocus();
};

export const KeyboardFocus: Story = { play: focusTheCall };

export const KeyboardFocusDark: Story = { globals: { theme: 'dark' }, play: focusTheCall };

const PHONE_TARGET_PX = 44;

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  play: async ({ canvasElement }) => {
    const call = within(canvasElement).getByRole('link', { name: /^Install Pyxis/ });
    await expect(call.getBoundingClientRect().height).toBeGreaterThanOrEqual(PHONE_TARGET_PX);
  },
};
