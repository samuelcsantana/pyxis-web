import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { SegmentedLinks } from './segmented-links';

const meta = {
  title: 'UI/Segmented links',
  component: SegmentedLinks,
  tags: ['autodocs'],
  args: {
    label: 'Show',
    current: 'all',
    links: [
      { key: 'all', label: 'All routes', href: '/demo/requests?range=7d' },
      { key: 'failing', label: 'Failing only', href: '/demo/requests?range=7d&show=failing' },
    ],
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof SegmentedLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondLinkCurrent: Story = { args: { current: 'failing' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

export const SlidesToAClickedLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const failing = canvas.getByRole('link', { name: 'Failing only' });

    await userEvent.click(failing);

    const thumb = canvas.getByTestId('sliding-indicator');
    await waitFor(() => {
      const thumbBox = thumb.getBoundingClientRect();
      const linkBox = failing.getBoundingClientRect();
      void expect(Math.abs(thumbBox.left - linkBox.left)).toBeLessThan(1);
      void expect(Math.abs(thumbBox.width - linkBox.width)).toBeLessThan(1);
    });
  },
};
