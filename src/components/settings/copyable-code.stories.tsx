import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DEMO_CONNECTOR_URL } from '@/services/connections/mock-connections-service';
import { CopyableCode } from './copyable-code';

const meta = {
  title: 'Settings/Copyable code',
  component: CopyableCode,
  tags: ['autodocs'],
  args: { text: DEMO_CONNECTOR_URL, what: 'connector address' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CopyableCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ACommand: Story = {
  args: { text: `claude mcp add --transport http pyxis ${DEMO_CONNECTOR_URL}` },
};

export const Clicked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { description: DEMO_CONNECTOR_URL }));
    await expect(
      await canvas.findByRole('button', { name: /Copied|Selected, press Ctrl\+C/ }),
    ).toBeInTheDocument();
  },
};

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
