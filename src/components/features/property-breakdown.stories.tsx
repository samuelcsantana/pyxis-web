import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { propertyKeyViews } from '@/domain/property-breakdown';
import { demoPropertyBreakdownReport } from '@/services/features/demo-properties';
import { PropertyBreakdown } from './property-breakdown';

const PERIOD = { from: '2026-09-22', to: '2026-10-05' };

function demoKeys(name: string) {
  return propertyKeyViews(demoPropertyBreakdownReport(PERIOD, name));
}

const meta = {
  title: 'Features/Property breakdown',
  component: PropertyBreakdown,
  tags: ['autodocs'],
  args: {
    eventLabel: 'Calculator result shown',
    state: { status: 'ready', keys: demoKeys('calculator_result_shown') },
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PropertyBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithOtherValues: Story = {
  args: {
    eventLabel: 'Report exported',
    state: { status: 'ready', keys: demoKeys('report_exported') },
  },
};

export const PartlyCarried: Story = {
  args: {
    eventLabel: 'Order created',
    state: { status: 'ready', keys: demoKeys('order_created') },
  },
};

export const Loading: Story = { args: { state: { status: 'loading' } } };

export const Failed: Story = { args: { state: { status: 'error' } } };

export const NoProperties: Story = {
  args: { eventLabel: 'Product created', state: { status: 'ready', keys: [] } },
};

export const OnAPhone: Story = {
  args: WithOtherValues.args,
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { args: WithOtherValues.args, globals: { theme: 'dark' } };

export const DarkThemeFailed: Story = { ...Failed, globals: { theme: 'dark' } };
