import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { DemoBanner } from './demo-banner';
import { EmptyState } from './empty-state';
import { ErrorPanel } from './error-panel';
import { LoadingPanel } from './loading-panel';

const meta = {
  title: 'States/Panels',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,26rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render: () => <LoadingPanel label="Loading the last 30 days" />,
};

export const Empty: Story = {
  render: () => (
    <EmptyState title="No projects yet">
      <p>Your email can sign in, but no project was granted to it yet.</p>
    </EmptyState>
  ),
};

export const Failure: Story = {
  render: () => <ErrorPanel detail="GET /v1/me · 503" onRetry={fn()} />,
};

export const FailureWithoutRetry: Story = {
  render: () => <ErrorPanel />,
};

export const Demo: Story = {
  render: () => <DemoBanner />,
};

export const DarkTheme: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <LoadingPanel label="Loading the last 30 days" />
      <ErrorPanel detail="GET /v1/me · 503" onRetry={fn()} />
    </div>
  ),
  globals: { theme: 'dark' },
};
