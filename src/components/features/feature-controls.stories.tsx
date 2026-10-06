import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeatureSearch } from './feature-search';
import { FeatureTabs } from './feature-tabs';

function Controls({ query }: { readonly query: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <FeatureTabs
        current="events"
        tabs={[
          { kind: 'events', label: 'Events', href: '/demo/features?range=30d&kind=events' },
          { kind: 'screens', label: 'Screens', href: '/demo/features?range=30d&kind=screens' },
        ]}
      />
      <FeatureSearch
        action="/demo/features"
        keep={{ range: '30d', kind: 'events' }}
        query={query}
        label="Search events"
        clearHref="/demo/features?range=30d&kind=events"
      />
    </div>
  );
}

const meta = {
  title: 'Features/Tabs and search',
  component: Controls,
  args: { query: '' },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithASearch: Story = { args: { query: 'signup' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
