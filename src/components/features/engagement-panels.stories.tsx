import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { engagementResponseSchema } from '@/domain/engagement.schema';
import { DEMO_DOCS, DEMO_STORE } from '@/services/demo/demo-projects';
import { demoEngagementWire } from '@/services/features/demo-engagement';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { EngagementPanels } from './engagement-panels';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const RANGE = { from: '2026-09-06', to: '2026-10-05' };

function demoReport(projectId: string) {
  return engagementResponseSchema.parse(demoEngagementWire(projectId, RANGE, STORY_NOW));
}

const STORE = demoReport(DEMO_STORE.id);

const meta = {
  title: 'Features/Engagement',
  component: EngagementPanels,
  tags: ['autodocs'],
  args: { report: STORE, periodLabel: 'last 30 days', i18n: english },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EngagementPanels>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AnotherProject: Story = { args: { report: demoReport(DEMO_DOCS.id) } };

export const Empty: Story = {
  args: {
    report: {
      ...STORE,
      visits: 0,
      singlePageVisits: 0,
      medianVisitSeconds: null,
      visitLengths: STORE.visitLengths.map((bucket) => ({ ...bucket, visits: 0 })),
      entryPages: [],
      exitPages: [],
    },
  },
};

export const InPortuguese: Story = { args: { i18n: portuguese, periodLabel: 'últimos 30 dias' } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
