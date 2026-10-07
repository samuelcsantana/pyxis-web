import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TIMELINE_FILTERS, timelineTotals, visitViews } from '@/domain/timeline';
import { DEMO_USER_ID, demoTimelineReport } from '@/services/timeline/demo-timeline';
import { TimelineFilters } from './timeline-filters';
import { TimelineSearch } from './timeline-search';
import { TimelineSummary } from './timeline-summary';
import { VisitCard } from './visit-card';

const REPORT = demoTimelineReport('demo', { kind: 'user', id: DEMO_USER_ID }, new Date());

function Story({ filter }: { readonly filter: (typeof TIMELINE_FILTERS)[number] }) {
  return (
    <div className="flex flex-col gap-4">
      <TimelineSearch
        action="/demo/timeline"
        lookup={{ kind: 'user', id: DEMO_USER_ID }}
        hint={`Try ${DEMO_USER_ID}`}
      />
      <TimelineSummary title={`User ${DEMO_USER_ID}`} totals={timelineTotals(REPORT.visits)} />
      <TimelineFilters
        current={filter}
        links={TIMELINE_FILTERS.map((target) => ({
          filter: target,
          href: `/demo/timeline?user=${DEMO_USER_ID}&show=${target}`,
        }))}
      />
      {visitViews(REPORT.visits, 'America/Sao_Paulo', filter).map((visit) => (
        <VisitCard key={visit.key} visit={visit} />
      ))}
    </div>
  );
}

const meta = {
  title: 'Timeline/Person',
  component: Story,
  args: { filter: 'all' },
  parameters: { layout: 'padded', nextjs: { appDirectory: true } },
  decorators: [
    (Inner) => (
      <div className="w-[min(100%,62rem)]">
        <Inner />
      </div>
    ),
  ],
} satisfies Meta<typeof Story>;

export default meta;
type StoryEntry = StoryObj<typeof meta>;

export const Everything: StoryEntry = {};

export const ErrorsOnly: StoryEntry = { args: { filter: 'errors' } };

export const PageViews: StoryEntry = { args: { filter: 'pages' } };

export const OnAPhone: StoryEntry = {
  decorators: [
    (Inner) => (
      <div className="w-[358px]">
        <Inner />
      </div>
    ),
  ],
};

export const DarkTheme: StoryEntry = { globals: { theme: 'dark' } };
