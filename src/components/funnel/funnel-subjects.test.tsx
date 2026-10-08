import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { funnelSubjectsView } from '@/domain/funnel-subjects';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { FunnelSubjects } from './funnel-subjects';

function timeline(lookup: Readonly<Record<string, string>>): string {
  return `/p1/timeline?${new URLSearchParams(lookup).toString()}`;
}

function view(ids: readonly string[]) {
  return funnelSubjectsView(
    {
      subjects: ids.map((id) => ({ id, lastStepAt: '2026-10-04T15:20:00.000Z' })),
      nextCursor: null,
    },
    '2 visits reached step 3',
    'visit',
    'UTC',
    timeline,
    english,
  );
}

describe('FunnelSubjects', () => {
  it('lists each visit with the time of its last step, without paging when one page holds all', () => {
    renderWithMessages(
      <FunnelSubjects
        view={view([
          '7e2b9c14-0000-4000-8000-000000000001',
          '19c2e5f6-0000-4000-8000-000000000002',
        ])}
        olderHref={null}
        newestHref={null}
        closeHref="/p1/funnel"
      />,
    );

    const list = screen.getByRole('region', { name: '2 visits reached step 3' });
    const table = within(list).getByRole('table', { name: '2 visits reached step 3' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(
      within(table).getByRole('link', { name: '19c2e5f6, open this visit in the timeline' }),
    ).toHaveAttribute('href', '/p1/timeline?visit=19c2e5f6-0000-4000-8000-000000000002');
    expect(within(table).getAllByText('Oct 4, 15:20', { exact: false })).toHaveLength(2);
    expect(within(list).getByRole('link', { name: 'Close the list' })).toHaveAttribute(
      'href',
      '/p1/funnel',
    );
    expect(within(list).queryByRole('link', { name: 'Show older' })).not.toBeInTheDocument();
    expect(
      within(list).queryByRole('link', { name: 'Back to the newest' }),
    ).not.toBeInTheDocument();
  });

  it('says nobody is behind a step without an empty table', () => {
    renderWithMessages(
      <FunnelSubjects view={view([])} olderHref={null} newestHref={null} closeHref="/p1/funnel" />,
    );

    expect(screen.getByText('Nobody in this period.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
