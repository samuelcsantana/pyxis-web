import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DEMO_FUNNEL_STEPS } from '@/services/funnel/demo-funnel';
import { FunnelEditor } from './funnel-editor';

const meta = {
  title: 'Funnel/Step editor',
  component: FunnelEditor,
  tags: ['autodocs'],
  args: {
    initialSteps: DEMO_FUNNEL_STEPS.slice(0, 4),
    action: '/demo/funnel',
    keep: { range: '30d', mode: 'visit' },
    startOpen: true,
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,56rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FunnelEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Editing: Story = {};

export const Closed: Story = { args: { startOpen: false } };

export const NewFunnel: Story = {
  args: {
    initialSteps: [
      { type: 'page', path: '/' },
      { type: 'event', name: '' },
    ],
  },
};

export const WithAProblem: Story = {
  args: {
    initialSteps: [
      { type: 'page', path: 'pricing' },
      { type: 'event', name: 'Signed Up' },
    ],
  },
};

export const MovedWithTheKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Move step 1 down' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Move step 2 down' })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Step 2 page path' })).toHaveValue(
      '/calculator',
    );
  },
};

export const EightSteps: Story = {
  args: {
    initialSteps: [
      ...DEMO_FUNNEL_STEPS,
      { type: 'page', path: '/orders/*' },
      { type: 'event', name: 'report_exported' },
    ],
  },
};

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  args: {
    initialSteps: [
      { type: 'page', path: 'pricing' },
      { type: 'event', name: 'cta_clicked' },
    ],
  },
  globals: { theme: 'dark' },
};
