import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { type FunnelDrill, drillHeading, funnelSubjectsView } from '@/domain/funnel-subjects';
import type { FunnelMode } from '@/domain/funnel';
import { funnelSubjectsResponseSchema } from '@/domain/funnel.schema';
import {
  DEMO_FUNNEL_STEPS,
  demoFunnelReport,
  demoFunnelSubjectsWire,
} from '@/services/funnel/demo-funnel';
import { english } from '@/test-utils/english';
import { FunnelSubjects } from './funnel-subjects';

const STORY_NOW = new Date('2026-10-06T02:30:00.000Z');
const PERIOD = { from: '2026-09-06', to: '2026-10-05' };
const CLOSE = '/demo/funnel?range=30d';

function timeline(lookup: Readonly<Record<string, string>>): string {
  return `/demo/timeline?range=30d&${new URLSearchParams(lookup).toString()}`;
}

function demoView(mode: FunnelMode, drill: FunnelDrill) {
  const counts = demoFunnelReport('demo', PERIOD, mode, DEMO_FUNNEL_STEPS, STORY_NOW).steps.map(
    (step) => step.count,
  );
  const page = funnelSubjectsResponseSchema.parse(
    demoFunnelSubjectsWire('demo', PERIOD, mode, DEMO_FUNNEL_STEPS, drill, STORY_NOW),
  );
  return funnelSubjectsView(
    page,
    drillHeading(counts, drill, mode, english),
    mode,
    'America/Sao_Paulo',
    timeline,
    english,
  );
}

const meta = {
  title: 'Funnel/Who is behind a step',
  component: FunnelSubjects,
  tags: ['autodocs'],
  args: {
    view: demoView('visit', { step: 2, outcome: 'dropped', cursor: null }),
    olderHref: `${CLOSE}&step=2&outcome=dropped&cursor=older#funnel-subjects`,
    newestHref: null,
    closeHref: CLOSE,
  },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,70rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FunnelSubjects>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VisitsThatLeft: Story = {};

export const PeopleOnAnOlderPage: Story = {
  args: {
    view: demoView('user', { step: 1, outcome: 'reached', cursor: null }),
    olderHref: null,
    newestHref: `${CLOSE}&mode=user&step=1&outcome=reached#funnel-subjects`,
  },
};

export const Nobody: Story = {
  args: {
    view: funnelSubjectsView(
      { subjects: [], nextCursor: null },
      drillHeading([12, 12], { step: 2, outcome: 'dropped', cursor: null }, 'visit', english),
      'visit',
      'UTC',
      timeline,
      english,
    ),
    olderHref: null,
  },
};

export const DarkTheme: Story = { globals: { theme: 'dark' } };
