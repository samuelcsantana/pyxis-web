import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { timelineTotals, visitViews } from '@/domain/timeline';
import { DEMO_USER_ID, demoTimelineReport } from '@/services/timeline/demo-timeline';
import { TimelineFilters } from './timeline-filters';
import { TimelineSearch } from './timeline-search';
import { TimelineSummary } from './timeline-summary';
import { VisitCard } from './visit-card';

const REPORT = demoTimelineReport(
  'demo',
  { kind: 'user', id: DEMO_USER_ID },
  new Date('2026-10-06T02:30:00.000Z'),
);

describe('TimelineSearch', () => {
  it('looks a person up by user id unless one visit is chosen', async () => {
    render(<TimelineSearch action="/p1/timeline" lookup={null} hint="Try u_7f3a" />);
    const field = screen.getByRole('textbox', { name: 'User id' });

    expect(field).toHaveAttribute('name', 'user');
    expect(screen.getByRole('search')).toHaveAccessibleDescription('Try u_7f3a');

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Look up' }), 'visit');

    expect(screen.getByRole('textbox', { name: 'Visit id' })).toHaveAttribute('name', 'visit');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Look up' }), 'user');
    expect(screen.getByRole('textbox', { name: 'User id' })).toBeInTheDocument();
  });

  it('starts from the lookup in the URL, without a hint outside the demo', () => {
    render(
      <TimelineSearch
        action="/p1/timeline"
        lookup={{ kind: 'visit', id: '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01' }}
        hint={null}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Visit id' })).toHaveValue(
      '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01',
    );
    expect(screen.getByRole('search')).not.toHaveAttribute('aria-describedby');
  });
});

describe('TimelineSearch with an id it did not use', () => {
  it('keeps the id, marks it invalid and says what an id looks like', async () => {
    render(
      <TimelineSearch
        action="/p1/timeline"
        lookup={null}
        hint={null}
        rejected={{
          kind: 'visit',
          value: 'not-a-visit-id',
          hint: 'A visit id looks like 94810767-edf6-4c2b-9a1d-2e3f4a5b6c01.',
        }}
      />,
    );
    const field = screen.getByRole('textbox', { name: 'Visit id' });

    expect(field).toHaveValue('not-a-visit-id');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription(
      'Nothing was looked up. A visit id looks like 94810767-edf6-4c2b-9a1d-2e3f4a5b6c01.',
    );

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Look up' }), 'user');

    expect(screen.getByRole('textbox', { name: 'User id' })).toHaveAttribute(
      'aria-invalid',
      'false',
    );
    expect(screen.queryByText(/Nothing was looked up/)).not.toBeInTheDocument();
  });
});

describe('TimelineFilters', () => {
  it('links every filter and marks the current one', () => {
    render(
      <TimelineFilters
        current="errors"
        links={[
          { filter: 'all', href: '/p1/timeline?user=u' },
          { filter: 'errors', href: '/p1/timeline?user=u&show=errors' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Failing only' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Everything' })).not.toHaveAttribute('aria-current');
  });
});

describe('TimelineSummary', () => {
  it('names who was looked up and counts what was found, failures in red', () => {
    const { rerender } = render(
      <TimelineSummary title="User u_7f3a" totals={timelineTotals(REPORT.visits)} />,
    );

    expect(screen.getByRole('heading', { name: 'User u_7f3a' })).toBeInTheDocument();
    expect(screen.getByText(/^\d+ items$/)).toBeInTheDocument();
    expect(screen.getByText('2 failed requests')).toHaveClass('text-bad');

    rerender(<TimelineSummary title="User u_7f3a" totals={timelineTotals([])} />);
    expect(screen.getByText('0 failed requests')).toHaveClass('text-muted');
  });
});

describe('VisitCard', () => {
  it('tells a visit in order, with a status on each request', () => {
    const [, , signUp] = visitViews(REPORT.visits, 'America/Sao_Paulo', 'all');
    if (signUp === undefined) {
      throw new Error('no sign-up visit in the demo');
    }
    const { container } = render(<VisitCard visit={signUp} />);

    const items = within(screen.getByRole('region', { name: /^Visit 19c2e5f6/ })).getAllByRole(
      'listitem',
    );
    expect(items).toHaveLength(11);
    expect(items[0]).toHaveTextContent('14:03:10Opened /calculator');
    expect(items[6]).toHaveTextContent('POST /auth/verify-code');
    expect(items[6]).toHaveTextContent('invalid_code400');
    expect(items[6]).not.toHaveTextContent('error_code=');
    expect(container.querySelectorAll('path[d^="M12 3l9 16"]')).toHaveLength(1);
  });

  it('says so when the filter leaves nothing in a visit', () => {
    const [quiet] = visitViews(REPORT.visits, 'UTC', 'errors').filter(
      (visit) => visit.items.length === 0,
    );
    if (quiet === undefined) {
      throw new Error('every demo visit has an error');
    }

    render(<VisitCard visit={quiet} />);

    expect(screen.getByText('Nothing of this kind in this visit.')).toBeInTheDocument();
  });
});
