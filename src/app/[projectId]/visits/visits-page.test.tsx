import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import { shortId } from '@/domain/timeline';
import { NO_VISIT_FILTERS, type VisitsReport } from '@/domain/visits';
import { MockVisitsService } from '@/services/visits/mock-visits-service';
import type { IVisitsService } from '@/services/visits/visits-service.interface';
import { loadOlderVisitRows } from './actions';
import VisitsPage from './page';
import { renderWithMessages } from '@/test-utils/render-with-messages';

const state = vi.hoisted<{ admin: unknown; visits: IVisitsService['visits'] }>(() => ({
  admin: undefined,
  visits: () => Promise.reject(new Error('visits not set')),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/p-store/visits',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/visits/visits-service.factory', () => ({
  createVisitsService: (): IVisitsService => ({
    visits: (projectId, range, filters, cursor) => state.visits(projectId, range, filters, cursor),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    {
      id: 'p-store',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};
const NOW = new Date('2026-10-06T02:30:00.000Z');
const CURSOR = '2026-10-03T12:12:04.000Z~2a81c3d4-5e6f-4a70-8b91-0c1d2e3f4a02';

function renderVisits(search: Record<string, string> = { range: '30d' }) {
  return VisitsPage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve(search),
  });
}

function mockVisits() {
  const visits = vi.fn<IVisitsService['visits']>((projectId, range, filters, cursor) =>
    new MockVisitsService().visits(projectId, range, filters, cursor),
  );
  state.visits = visits;
  return visits;
}

beforeEach(() => {
  state.admin = ADMIN;
  mockVisits();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

describe('VisitsPage', () => {
  it('lists the visits of the period, newest first, each opening its timeline in the period', async () => {
    const visits = mockVisits();

    renderWithMessages(await renderVisits());

    expect(visits).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      NO_VISIT_FILTERS,
      null,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Visits' })).toBeInTheDocument();
    const table = within(screen.getByRole('table', { name: 'Visits' }));
    expect(table.getAllByRole('row')).toHaveLength(9);
    expect(
      table.getByRole('link', { name: 'Mon, Oct 5, 18:40, open visit 3c07a1b2' }),
    ).toHaveAttribute(
      'href',
      '/p-store/timeline?range=30d&visit=3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01',
    );
    expect(screen.getByRole('button', { name: 'Load older visits' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Clear filters' })).not.toBeInTheDocument();
    expect(screen.getByText(/A failed request is a read or a write/)).toBeInTheDocument();
    expect(screen.getByText(/^\d+ visits$/)).toBeInTheDocument();
  });

  it('passes the filters to the API and keeps them in the period links', async () => {
    const visits = mockVisits();

    renderWithMessages(
      await renderVisits({
        range: '30d',
        path: '/calculator',
        path2: '',
        path3: '',
        event: 'calculator_result_shown',
        property: 'calculator=shipping',
        channel: 'paid',
        device: '',
        identity: 'identified',
      }),
    );

    expect(visits).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      {
        ...NO_VISIT_FILTERS,
        paths: ['/calculator'],
        event: 'calculator_result_shown',
        property: 'calculator=shipping',
        channel: 'paid',
        identity: 'identified',
      },
      null,
    );
    expect(screen.getByRole('link', { name: '7 days' })).toHaveAttribute(
      'href',
      '/p-store/visits?range=7d&path=%2Fcalculator&event=calculator_result_shown&property=calculator%3Dshipping&channel=paid&identity=identified',
    );
    expect(screen.getByRole('link', { name: 'Clear filters' })).toHaveAttribute(
      'href',
      '/p-store/visits?range=30d',
    );
    expect(screen.getByRole('textbox', { name: 'Viewed page' })).toHaveValue('/calculator');
    expect(screen.getByRole('link', { name: 'Newest 1,000 visits as CSV' })).toHaveAttribute(
      'href',
      '/p-store/visits/export?range=30d&path=%2Fcalculator&event=calculator_result_shown&property=calculator%3Dshipping&channel=paid&identity=identified',
    );
    expect(within(screen.getByRole('table', { name: 'Visits' })).getAllByRole('row')).toHaveLength(
      2,
    );
    expect(screen.getByText('1 matching visit')).toBeInTheDocument();
  });

  it('passes where a visit came from and the request it made, and counts what matches', async () => {
    const visits = mockVisits();

    renderWithMessages(
      await renderVisits({
        range: '30d',
        country: 'pt',
        source: 'www.google.com',
        campaign: '',
        route: 'GET /plans',
        failed: 'true',
      }),
    );

    expect(visits).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      {
        ...NO_VISIT_FILTERS,
        country: 'PT',
        source: 'www.google.com',
        route: 'GET /plans',
        failed: true,
      },
      null,
    );
    expect(screen.getByRole('link', { name: '7 days' })).toHaveAttribute(
      'href',
      '/p-store/visits?range=7d&country=PT&source=www.google.com&route=GET+%2Fplans&failed=true',
    );
    expect(screen.getByText('0 matching visits')).toBeInTheDocument();
  });

  it('says so when no visit matches the filters', async () => {
    renderWithMessages(await renderVisits({ range: '30d', channel: 'email' }));

    expect(screen.getByText('No visit matches these filters in this period.')).toBeInTheDocument();
  });

  it('names the filters it left out and lists the period without them', async () => {
    const visits = mockVisits();

    renderWithMessages(await renderVisits({ range: '7d', path: 'pricing', property: 'plan=pro' }));

    expect(visits).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-29', to: '2026-10-05' },
      NO_VISIT_FILTERS,
      null,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('A page path starts with "/".');
    expect(screen.getByRole('alert')).toHaveTextContent('A property filter needs an event.');
  });

  it('says so when the period has no visit', async () => {
    state.visits = (): Promise<VisitsReport> =>
      Promise.resolve({ visits: [], nextCursor: null, total: null });

    renderWithMessages(await renderVisits());

    expect(
      screen.getByText(
        'No visits in this period. A visit shows up here once your site sends its first event.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load older visits' })).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d+ (matching )?visits?$/)).not.toBeInTheDocument();
  });

  it('loads the older visits of the same period and filters through the server action', async () => {
    const visits = mockVisits();
    vi.useRealTimers();
    vi.useFakeTimers({ toFake: ['Date'], shouldAdvanceTime: true });
    vi.setSystemTime(NOW);
    renderWithMessages(await renderVisits({ range: '30d', identity: 'identified' }));

    await userEvent.click(screen.getByRole('button', { name: 'Load older visits' }));

    expect(await screen.findByText('That is every visit of this period.')).toBeInTheDocument();
    expect(visits).toHaveBeenLastCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      { ...NO_VISIT_FILTERS, identity: 'identified' },
      '2026-10-02T11:44:04.000Z~930c9810-9f74-4071-8fab-a9a84e220a9f',
    );
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.visits = () => Promise.reject(new UnauthenticatedError());

    await expect(renderVisits()).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});

describe('loadOlderVisitRows', () => {
  it('reads the page older than the cursor and shapes it for the table', async () => {
    const visits = mockVisits();

    const page = await loadOlderVisitRows('p-store', { range: '30d' }, CURSOR);

    expect(visits).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      NO_VISIT_FILTERS,
      CURSOR,
    );
    expect(page.rows.map((row) => shortId(row.key))).toEqual([
      '19c2e5f6',
      '94810767',
      '930c9810',
      '6d4ebf3d',
      '5b8d2e7a',
      '5cd5f0e2',
      'bd0f5992',
      '22477bd4',
    ]);
    expect(page.nextCursor).toMatch(/~22477bd4-/);
  });

  it('refuses a cursor the API would refuse, without asking it', async () => {
    const visits = mockVisits();

    await expect(loadOlderVisitRows('p-store', {}, 'yesterday')).rejects.toThrow(
      'Older visits need a valid cursor.',
    );
    expect(visits).not.toHaveBeenCalled();
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(loadOlderVisitRows('p-other', {}, CURSOR)).rejects.toThrow('not-found');
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.visits = () => Promise.reject(new UnauthenticatedError());

    await expect(loadOlderVisitRows('p-store', {}, CURSOR)).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });
});
