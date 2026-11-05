import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ErrorPanel } from '@/components/states/error-panel';
import { errorTexts } from '@/components/states/error-texts';
import { SkeletonRows } from '@/components/states/screen-skeleton';
import { goalRows, type GoalRow, type GoalsSummary } from '@/domain/goals';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import { goalsSummaryResponseSchema } from '@/domain/goals.schema';
import { demoGoalsSummaryWire } from '@/services/demo/demo-goals';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { GoalsTable } from './goals-table';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const SUMMARY: GoalsSummary = goalsSummaryResponseSchema.parse(
  demoGoalsSummaryWire(
    DEMO_STORE.id,
    { from: '2026-09-06', to: '2026-10-05', filters: NO_DASHBOARD_FILTERS },
    STORY_NOW,
  ),
);
const NOBODY_REACHED: GoalsSummary = {
  visits: SUMMARY.visits,
  goals: SUMMARY.goals.map((goal) => ({
    ...goal,
    conversions: 0,
    convertingVisits: 0,
    conversionRate: 0,
  })),
};

function visitsHref(goalId: string): string {
  return `/demo/visits?${new URLSearchParams({ range: '30d', reached_goal: goalId }).toString()}`;
}

function filterOf(row: GoalRow) {
  return {
    href: `/demo/overview?${new URLSearchParams({ range: '30d', reached_goal: row.id }).toString()}`,
    active: false,
    label: `Filter by ${row.name}`,
    title: `Filter every screen by ${row.name}`,
  };
}

const meta = {
  title: 'Overview/Goals table',
  component: GoalsTable,
  tags: ['autodocs'],
  args: {
    rows: goalRows(SUMMARY, english),
    visits: english.t('counts.visit', { count: SUMMARY.visits }),
    periodLabel: 'last 30 days',
    visitsHref,
    filterOf,
    i18n: english,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,56rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GoalsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoVisitReachedAGoal: Story = { args: { rows: goalRows(NOBODY_REACHED, english) } };

export const Loading: Story = { render: () => <SkeletonRows count={4} /> };

export const Failed: Story = {
  render: () => (
    <ErrorPanel
      texts={errorTexts(
        Object.assign(new Error('GET /v1/projects/demo/goals/summary failed'), {
          digest: '2861547093',
        }),
        english.t,
      )}
      onRetry={fn()}
    />
  ),
};

export const InPortuguese: Story = {
  args: {
    rows: goalRows(SUMMARY, portuguese),
    visits: portuguese.t('counts.visit', { count: SUMMARY.visits }),
    periodLabel: 'últimos 30 dias',
    i18n: portuguese,
  },
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
