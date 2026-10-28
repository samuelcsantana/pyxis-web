import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { PropertySummaryView } from '@/domain/property-summary';
import { NumericSummary } from './numeric-summary';

const OVERALL: PropertySummaryView = {
  overall: { median: '33', middleHalf: '15 to 39', events: '42 events' },
  groups: [],
  other: null,
};

const BY_POST: PropertySummaryView = {
  ...OVERALL,
  groups: [
    {
      value: 'estrutura-de-pastas-angular-features-lazy-fronteiras',
      median: '27',
      middleHalf: '15 to 39',
      events: '12 events',
    },
    { value: 'signals-sem-mito', median: '48.5', middleHalf: '31 to 66', events: '9 events' },
    { value: 'testes-que-valem', median: '21', middleHalf: '12 to 30', events: '4 events' },
  ],
  other: '17',
};

function answering(view: PropertySummaryView) {
  return (_key: string, by: string | null) => Promise.resolve(by === null ? OVERALL : view);
}

const meta = {
  title: 'Features/Median of a property',
  component: NumericSummary,
  tags: ['autodocs'],
  args: {
    propertyKey: 'seconds',
    otherKeys: ['post', 'lang'],
    loadSummary: answering(BY_POST),
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,36rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumericSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { loadSummary: () => new Promise(() => undefined) } };

export const NoNumber: Story = {
  args: {
    loadSummary: () => Promise.resolve({ overall: null, groups: [], other: null }),
  },
};

export const Failed: Story = {
  args: { loadSummary: () => Promise.reject(new Error('The API is unreachable.')) },
};

export const WithoutAnotherKey: Story = { args: { otherKeys: [] } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
