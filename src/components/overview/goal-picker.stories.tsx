import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { ErrorPanel } from '@/components/states/error-panel';
import { errorTexts } from '@/components/states/error-texts';
import { NoGoals } from '@/components/states/no-goals';
import { SkeletonCards } from '@/components/states/screen-skeleton';
import { type KpiDrillDown, overviewKpis } from '@/domain/overview';
import { demoCountedGoal } from '@/services/demo/demo-goals';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { demoOverviewReport } from '@/services/overview/demo-overview';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { GoalPicker } from './goal-picker';
import { KpiGrid } from './kpi-grid';
import { MetricSelection } from './metric-selection';

const STORY_PERIOD = { from: '2026-09-06', to: '2026-10-05' } as const;
const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const LAST_30_DAYS = { days: 30, endsToday: false } as const;
const [FIRST, , PRICING] = DEMO_STORE.goals;
const CHOICES = DEMO_STORE.goals.map(({ id, name }) => ({ id, name }));

function drillDownHref({ screen, filter }: KpiDrillDown): string {
  return `/demo/${screen}?${new URLSearchParams({ range: '30d', ...filter }).toString()}`;
}

const meta = {
  title: 'Overview/Goal picker',
  component: GoalPicker,
  tags: ['autodocs'],
  args: {
    goals: CHOICES,
    selected: String(PRICING?.id),
    first: String(FIRST?.id),
    label: 'Goal counted as conversions',
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  render: (args) => {
    const goal = demoCountedGoal(DEMO_STORE, args.selected);
    const report = demoOverviewReport(
      DEMO_STORE.id,
      { ...STORY_PERIOD, goal: args.selected },
      STORY_NOW,
    );
    return (
      <MetricSelection available={['visits', 'conversions']}>
        <KpiGrid
          kpis={overviewKpis(report, LAST_30_DAYS, goal, 'BRL', english)}
          drillDownHref={drillDownHref}
          controls={{ conversions: <GoalPicker {...args} /> }}
          i18n={english}
        />
      </MetricSelection>
    );
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GoalPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTheConversionsCard: Story = {
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('group', { name: 'Conversions' });
    await expect(
      within(card).getByRole('combobox', { name: 'Goal counted as conversions' }),
    ).toHaveValue(PRICING?.id);
    await expect(card).toHaveTextContent('reached Saw the pricing');
  },
};

export const FirstGoal: Story = { args: { selected: String(FIRST?.id) } };

export const Loading: Story = { render: () => <SkeletonCards count={4} /> };

export const NoGoalsYet: Story = {
  render: () => <NoGoals projectId={DEMO_STORE.id} i18n={english} />,
};

export const Failed: Story = {
  render: () => (
    <ErrorPanel
      texts={errorTexts(
        Object.assign(new Error('GET /v1/projects/demo/overview failed'), { digest: '2861547093' }),
        english.t,
      )}
      onRetry={fn()}
    />
  ),
};

export const InPortuguese: Story = {
  args: { label: portuguese.t('goals.picker') },
  globals: { locale: 'pt-BR' },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };

export const OnAPhone: Story = {
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
};
