import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VisitsLink } from './visits-link';

const meta = {
  title: 'UI/Visits link',
  component: VisitsLink,
  tags: ['autodocs'],
  args: { href: '/demo/visits?range=30d&path=%2Fcalculator', label: '/calculator' },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
} satisfies Meta<typeof VisitsLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PropertyValue: Story = {
  args: {
    href: '/demo/visits?range=30d&event=cta_clicked&property=cta%3Dstart_trial',
    label: 'start_trial',
    purpose: ': see the visits where cta is start_trial',
    className: 'font-mono text-xs',
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
