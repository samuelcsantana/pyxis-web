import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { DemoBanner } from './demo-banner';
import { EmptyState } from './empty-state';
import { ErrorPanel } from './error-panel';
import { NoConversionEvent } from './no-conversion-event';

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

export const EmptyDarkTheme: Story = { ...Empty, globals: { theme: 'dark' } };

export const Demo: Story = {
  render: () => <DemoBanner />,
  play: async ({ canvasElement }) => {
    const notice = within(canvasElement).getByRole('complementary', { name: 'Demo notice' });
    await expect(within(notice).getByRole('note')).toHaveTextContent('Demo data');
  },
};

export const DemoDarkTheme: Story = { ...Demo, globals: { theme: 'dark' } };

export const NoConversionEventSet: Story = {
  render: () => <NoConversionEvent />,
};

export const DarkTheme: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ErrorPanel detail="GET /v1/me · 503" onRetry={fn()} />
      <NoConversionEvent />
    </div>
  ),
  globals: { theme: 'dark' },
};
