import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { withProjectChoices } from '@/test-utils/project-choices';
import { Topbar } from './topbar';

const meta = {
  title: 'Shell/Topbar',
  component: Topbar,
  tags: ['autodocs'],
  args: { title: 'Settings' },
  parameters: { layout: 'fullscreen', nextjs: { appDirectory: true } },
  decorators: [(Story) => withProjectChoices(<Story />)],
} satisfies Meta<typeof Topbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

const PHONE_WIDTH_PX = 414;

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('banner');
    const name = within(bar).getByText('Demo Store', { selector: 'summary span' });
    await expect(window.innerWidth).toBe(PHONE_WIDTH_PX);
    await expect(name.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth);
  },
};
