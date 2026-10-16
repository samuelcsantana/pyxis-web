import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { NUDGE_DISMISSED_KEY } from '@/lib/nudge-dismissal';
import { AskClaudeNudge } from './ask-claude-nudge';

const meta = {
  title: 'Landing/AskClaudeNudge',
  component: AskClaudeNudge,
  parameters: { layout: 'fullscreen' },
  args: {
    labels: {
      label: 'News: Pyxis in Claude',
      message: 'Pyxis now answers in Claude. Ask about your numbers.',
      cta: 'See how to connect',
      dismiss: 'Dismiss',
    },
    revealAfterScroll: 0,
  },
  beforeEach: () => {
    window.localStorage.removeItem(NUDGE_DISMISSED_KEY);
  },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AskClaudeNudge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('complementary', { name: 'News: Pyxis in Claude' }),
    ).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'See how to connect' })).toBeVisible();
  },
};

export const Dismissed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(canvas.queryByRole('complementary')).not.toBeInTheDocument();
  },
};

export const Portuguese: Story = {
  args: {
    labels: {
      label: 'Novidade: o Pyxis no Claude',
      message: 'Agora o Pyxis responde no Claude. Pergunte sobre seus números.',
      cta: 'Ver como conectar',
      dismiss: 'Dispensar',
    },
  },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
