import { screen, within } from '@testing-library/react';
import { NO_DASHBOARD_FILTERS } from '@/domain/dashboard-filters';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import { ApiNotFoundError, ApiRequestError, UnauthenticatedError } from '@/domain/errors';
import type { OverviewReport } from '@/domain/overview';
import { NO_UNIQUE_VISITORS } from '@/domain/unique-visitors';
import type { Goal } from '@/domain/goals';
import type { ReportScope } from '@/services/date-range';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { MockOverviewService } from '@/services/overview/mock-overview-service';
import type { IOverviewService } from '@/services/overview/overview-service.interface';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import ProjectError from './error';
import ProjectLayout from './layout';
import ScreensLayout from './(screens)/layout';
import OverviewPage from './(screens)/overview/page';

const state = vi.hoisted<{
  admin: unknown;
  failure: Error | undefined;
  overview: IOverviewService['overview'];
  accounts: () => Promise<readonly Account[]>;
  goals: readonly Goal[];
}>(() => ({
  admin: undefined,
  failure: undefined,
  overview: () => Promise.reject(new Error('overview not set')),
  accounts: () => Promise.resolve([]),
  goals: [],
}));

vi.mock('@/services/goals/goals-service.factory', async () => {
  const { MockGoalsService } = await import('@/services/goals/mock-goals-service');
  return {
    createGoalsService: () => ({
      list: () => Promise.resolve(state.goals),
      summary: (projectId: string, scope: ReportScope) =>
        new MockGoalsService().summary(projectId, scope),
    }),
  };
});

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
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
  usePathname: () => '/p-store/overview',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/overview/overview-service.factory', () => ({
  createOverviewService: (): IOverviewService => ({
    overview: (projectId, range) => state.overview(projectId, range),
    timeOfDay: (projectId, range) => new MockOverviewService().timeOfDay(projectId, range),
  }),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({
    currentAdmin: () =>
      state.failure === undefined ? Promise.resolve(state.admin) : Promise.reject(state.failure),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@example.com',
  projects: [
    {
      id: 'p-store',
      name: 'Demo Store',
      timezone: 'America/Sao_Paulo',
      conversionEvent: 'signup_completed',
    },
  ],
};

beforeEach(() => {
  state.admin = ADMIN;
  state.failure = undefined;
  state.overview = (projectId, range) => new MockOverviewService().overview(projectId, range);
  state.accounts = () => Promise.resolve([]);
  state.goals = DEMO_STORE.goals;
});

const LATE_EVENING_IN_SAO_PAULO = new Date('2026-10-06T02:30:00.000Z');

function renderOverview(search: Record<string, string> = { range: '7d' }) {
  return OverviewPage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve(search),
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('ProjectLayout', () => {
  it('frames the screen with the sidebar and the demo banner in demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(
      await ProjectLayout({
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    const links = screen.getAllByRole('link', { hidden: true });

    expect(links[0]).toHaveAccessibleName('Skip to content');
    expect(links[0]).toHaveAttribute('href', '#content');
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(navigation).getByText('Account menu')).toBeInTheDocument();
    expect(document.querySelector('dialog')).toBeNull();
    expect(within(navigation).getByRole('link', { name: 'Pyxis', hidden: true })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/',
    );
    expect(
      within(navigation).getByRole('link', { name: 'Overview · Demo Store', hidden: true }),
    ).toHaveAttribute('href', '/p-store/overview');
    expect(
      within(navigation).getByRole('link', { name: 'Exit the demo', hidden: true }),
    ).toHaveAttribute('href', 'https://pyxis-analytics.dev/');
    expect(screen.getByRole('complementary', { name: 'Demo notice' })).toHaveClass('top-14');
    expect(screen.getByRole('note')).toHaveTextContent('Demo data');
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('shows no demo banner with a real API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(
      await ProjectLayout({
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(navigation).getByRole('link', { name: 'Pyxis', hidden: true })).toHaveAttribute(
      'href',
      '/p-store/overview',
    );
    expect(
      within(navigation).queryByRole('link', { name: 'Exit the demo', hidden: true }),
    ).not.toBeInTheDocument();
  });

  it("shows the owner the month's usage of the account that holds the project", async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    state.admin = {
      ...ADMIN,
      projects: ADMIN.projects.map((project) => ({ ...project, accountId: 'a1' })),
    };
    state.accounts = () =>
      Promise.resolve([
        {
          id: 'a1',
          role: 'owner',
          status: 'active',
          billingInterval: 'month',
          trialEndsAt: null,
          currentPeriodEndsAt: null,
          accessEndsAt: null,
          ingestionPausedUntil: null,
          suspendedAt: null,
          suspensionReason: null,
          deletionHeldAt: null,
          quotaPauseExemptUntil: null,
          freeWaitlistedAt: null,
          freePlanFitDueAt: null,
          projectCount: 1,
          peopleCount: 1,
          boundByFreePlanTerms: true,
          mailboxHasAnotherFreeAccount: null,
          month: '2026-10',
          eventsThisMonth: 41_230,
          measuredAt: null,
          limits: { eventsPerMonth: 100_000, projects: 3, people: 3, pauseAtEvents: 150_000 },
        },
      ]);

    renderWithMessages(
      await ProjectLayout({
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    expect(screen.getByText('41%')).toBeInTheDocument();
    expect(screen.getByText('· Pro')).toBeInTheDocument();
  });

  it("warns about an owned account's failed payment, linking to billing", async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    state.accounts = () =>
      Promise.resolve([
        {
          id: 'a1',
          role: 'owner',
          status: 'past_due',
          billingInterval: 'month',
          trialEndsAt: null,
          currentPeriodEndsAt: null,
          accessEndsAt: null,
          ingestionPausedUntil: null,
          suspendedAt: null,
          suspensionReason: null,
          deletionHeldAt: null,
          quotaPauseExemptUntil: null,
          freeWaitlistedAt: null,
          freePlanFitDueAt: null,
          projectCount: 1,
          peopleCount: 1,
          boundByFreePlanTerms: true,
          mailboxHasAnotherFreeAccount: null,
          month: '2026-10',
          eventsThisMonth: 10,
          measuredAt: null,
          limits: { eventsPerMonth: 100_000, projects: 3, people: 3, pauseAtEvents: 150_000 },
        },
      ]);

    renderWithMessages(
      await ProjectLayout({
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    expect(screen.getByRole('note')).toHaveTextContent('The last charge failed.');
    expect(screen.getByRole('link', { name: 'Open billing' })).toHaveAttribute('href', '/account');
  });

  it('says a project whose event reception is suspended is not measuring, on every screen', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    state.admin = {
      ...ADMIN,
      projects: ADMIN.projects.map((project) => ({
        ...project,
        ingestionSuspendedAt: '2026-11-19T10:00:00.000Z',
        ingestionSuspensionReason: 'Events carried e-mail addresses.',
      })),
    };

    renderWithMessages(
      await ProjectLayout({
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    expect(screen.getByRole('note')).toHaveTextContent(
      "Pyxis suspended this project's event reception on Nov 19, 2026",
    );
    expect(screen.getByRole('note')).toHaveTextContent('Reason: Events carried e-mail addresses.');
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(
      ProjectLayout({ children: null, params: Promise.resolve({ projectId: 'p-other' }) }),
    ).rejects.toThrow('not-found');
  });
});

describe('ScreensLayout', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(LATE_EVENING_IN_SAO_PAULO);
  });

  it('puts the top bar of the screen above it, in the calendar of the project', async () => {
    renderWithMessages(
      await ScreensLayout({
        filters: null,
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('How Demo Store was used in the period')).toBeInTheDocument();
    expect(screen.getByText('Sep 6 – Oct 5, 2026')).toBeInTheDocument();
    expect(screen.getByText('screen')).toBeInTheDocument();
  });

  it('keeps a loading placeholder right before the screen, for a screen whose content has not arrived', async () => {
    renderWithMessages(
      await ScreensLayout({
        filters: null,
        children: <p>screen</p>,
        params: Promise.resolve({ projectId: 'p-store' }),
      }),
    );

    const placeholder = screen.getByRole('status');
    expect(placeholder).toHaveTextContent('Loading…');
    expect(placeholder.parentElement).toHaveAttribute('aria-busy', 'true');
    expect(placeholder.parentElement?.nextElementSibling).toBe(screen.getByText('screen'));
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(
      ScreensLayout({
        children: null,
        filters: null,
        params: Promise.resolve({ projectId: 'p-other' }),
      }),
    ).rejects.toThrow('not-found');
  });
});

describe('OverviewPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(LATE_EVENING_IN_SAO_PAULO);
  });

  it('asks the overview of the period in the project time zone', async () => {
    const overview = vi.fn<IOverviewService['overview']>((projectId, range) =>
      new MockOverviewService().overview(projectId, range),
    );
    state.overview = overview;

    renderWithMessages(await renderOverview());

    expect(overview).toHaveBeenCalledWith('p-store', {
      from: '2026-09-29',
      to: '2026-10-05',
      filters: NO_DASHBOARD_FILTERS,
      goal: null,
    });
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows the figures, the daily chart and the top pages and events', async () => {
    renderWithMessages(await renderOverview());

    for (const name of ['Visits', 'Identified users', 'Conversions', 'Write error rate']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getAllByText('vs. previous 7 days, until 23:30')).toHaveLength(4);
    expect(screen.getByRole('group', { name: 'Conversions' })).toHaveTextContent(
      /% of [\d,]+ visits reached Sign-up · [\d,]+ times/,
    );
    expect(screen.getByRole('region', { name: 'Activity per day' })).toHaveTextContent(
      'Page views and named events, last 7 days',
    );
    expect(screen.getByRole('region', { name: 'Top pages' })).toHaveTextContent('/calculator');
    expect(screen.getByRole('region', { name: 'Top events' })).toHaveTextContent(
      'Calculator result shown',
    );
    expect(screen.queryByText(/This project has no goals yet/)).not.toBeInTheDocument();
  });

  it('counts each goal in a Goals table, each row opening its converting visits', async () => {
    const pricing = 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703';

    renderWithMessages(await renderOverview());

    const table = screen.getByRole('region', { name: 'Goals' });
    expect(table).toHaveTextContent(
      /Visits that reached each goal, out of [\d,]+ visits, last 7 days/,
    );
    expect(within(table).getAllByRole('row')).toHaveLength(DEMO_STORE.goals.length + 1);
    expect(
      within(table).getByRole('link', { name: 'Saw the pricing: see its visits' }),
    ).toHaveAttribute('href', `/p-store/visits?range=7d&reached_goal=${pricing}`);
    expect(within(table).getByRole('link', { name: 'Filter by Saw the pricing' })).toHaveAttribute(
      'href',
      `/p-store/overview?range=7d&reached_goal=${pricing}`,
    );
  });

  it('counts the goal the address names, picked on the Conversions card', async () => {
    const overview = vi.fn<IOverviewService['overview']>((projectId, range) =>
      new MockOverviewService().overview(projectId, range),
    );
    state.overview = overview;
    const pricing = 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703';

    renderWithMessages(await renderOverview({ range: '7d', goal: pricing }));

    expect(overview).toHaveBeenCalledWith('p-store', expect.objectContaining({ goal: pricing }));
    const card = screen.getByRole('group', { name: 'Conversions' });
    expect(within(card).getByRole('combobox', { name: 'Goal counted as conversions' })).toHaveValue(
      pricing,
    );
    expect(card).toHaveTextContent(/visits reached Saw the pricing/);
    const downloads = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => href.includes('/export'));
    expect(downloads.length).toBeGreaterThan(0);
    for (const href of downloads) {
      expect(href).toContain(`goal=${pricing}`);
    }
  });

  it('counts the first goal and says so when the address names a goal the project lost', async () => {
    renderWithMessages(
      await renderOverview({ range: '7d', goal: '0f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b' }),
    );

    expect(
      screen.getByText('The goal in the address no longer exists, so the first goal is counted.'),
    ).toHaveAttribute('role', 'status');
    expect(screen.getByRole('group', { name: 'Conversions' })).toHaveTextContent(/reached Sign-up/);
  });

  it('names the only goal on the card instead of offering a choice', async () => {
    state.goals = DEMO_STORE.goals.slice(0, 1);

    renderWithMessages(await renderOverview());

    const card = screen.getByRole('group', { name: 'Conversions' });
    expect(within(card).queryByRole('combobox')).not.toBeInTheDocument();
    expect(within(card).getByText('Sign-up')).toBeInTheDocument();
  });

  it('keeps a reached goal the project has, and leaves out one it lost', async () => {
    const overview = vi.fn<IOverviewService['overview']>((projectId, range) =>
      new MockOverviewService().overview(projectId, range),
    );
    state.overview = overview;
    const pricing = 'b1e2c3d4-5f60-4a71-8b92-a3c4d5e6f703';

    await renderOverview({ range: '7d', reached_goal: pricing });
    await renderOverview({ range: '7d', reached_goal: '0f0c2a4e-1b3d-4e5f-8a6b-9c0d1e2f3a4b' });

    expect(overview.mock.calls.map(([, scope]) => scope.filters.reachedGoal)).toEqual([
      pricing,
      null,
    ]);
  });

  it('defines its words in a footnote', async () => {
    renderWithMessages(await renderOverview());

    const footnote = screen.getByText(/^A visit is one browser tab/);
    for (const word of [
      'An identified user is',
      'A conversion is a visit',
      'A write is a POST',
      'A failure is a status of 400',
      'A change is green or red only when the previous period counted at least 20 and it moved by 1.0% or more (0.5 points for the write error rate).',
    ]) {
      expect(footnote).toHaveTextContent(word);
    }
  });

  it('says why conversions are missing when the project has no goal', async () => {
    state.goals = [];

    renderWithMessages(await renderOverview());

    expect(screen.getByText(/This project has no goals yet/)).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Conversions' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Goals' })).not.toBeInTheDocument();
  });

  it('shows the figures of a single day instead of a chart of one point', async () => {
    renderWithMessages(await renderOverview({ range: 'today' }));

    expect(screen.getByRole('region', { name: 'Activity of the day' })).toHaveTextContent(
      'Page views and named events, today',
    );
    expect(screen.queryByRole('region', { name: 'Activity per day' })).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('group', { name: 'Visits' })).queryByRole('button'),
    ).not.toBeInTheDocument();
  });

  it('shows the unique visitors after the chart and before the top pages', async () => {
    renderWithMessages(await renderOverview());

    const card = screen.getByRole('region', { name: 'Unique visitors' });
    expect(card).toHaveTextContent('New and returning visitors per day, last 7 days');
    expect(card).toHaveTextContent('Sum of daily unique visitors');
    expect(
      screen.getByRole('region', { name: 'Activity per day' }).compareDocumentPosition(card) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      card.compareDocumentPosition(screen.getByRole('region', { name: 'Top pages' })) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('counts the unique visitors of the month so far exactly, from its first day to today', async () => {
    renderWithMessages(await renderOverview({ from: '2026-10-01', to: '2026-10-05' }));

    expect(screen.getByRole('region', { name: 'Unique visitors' })).toHaveTextContent(
      'Unique visitors in October 2026 so far',
    );
  });

  it('leaves the unique visitors out for a project that does not count them', async () => {
    state.overview = async (projectId, range) => ({
      ...(await new MockOverviewService().overview(projectId, range)),
      visitors: NO_UNIQUE_VISITORS,
    });

    renderWithMessages(await renderOverview());

    expect(screen.queryByRole('region', { name: 'Unique visitors' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Top pages' })).toBeInTheDocument();
  });

  it('plots the figure the address names', async () => {
    renderWithMessages(await renderOverview({ range: '7d', metric: 'visits' }));

    expect(screen.getByRole('region', { name: 'Visits per day' })).toHaveTextContent(
      'Visits, last 7 days',
    );
    expect(screen.getByRole('button', { name: 'Visits' })).toHaveAttribute('aria-pressed');
  });

  it('plots the activity for a figure without a card', async () => {
    state.goals = [];

    renderWithMessages(await renderOverview({ range: '7d', metric: 'conversions' }));

    expect(screen.getByRole('region', { name: 'Activity per day' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Conversions per day' })).not.toBeInTheDocument();
  });

  it('links the top pages and events to their visits in the same period', async () => {
    renderWithMessages(await renderOverview({ from: '2026-09-01', to: '2026-09-30' }));

    expect(screen.getByRole('link', { name: '/calculator: see its visits' })).toHaveAttribute(
      'href',
      '/p-store/visits?from=2026-09-01&to=2026-09-30&path=%2Fcalculator',
    );
    expect(
      screen.getByRole('link', { name: 'Calculator result shown: see its visits' }),
    ).toHaveAttribute(
      'href',
      '/p-store/visits?from=2026-09-01&to=2026-09-30&event=calculator_result_shown',
    );
  });

  it('offers its tables as CSV files of the same period', async () => {
    renderWithMessages(await renderOverview({ from: '2026-09-01', to: '2026-09-30' }));

    expect(screen.getByRole('link', { name: 'Activity per day as CSV' })).toHaveAttribute(
      'href',
      '/p-store/overview/export?from=2026-09-01&to=2026-09-30&table=daily',
    );
    expect(screen.getByRole('link', { name: 'Top pages as CSV' })).toHaveAttribute(
      'href',
      '/p-store/overview/export?from=2026-09-01&to=2026-09-30&table=pages',
    );
    expect(screen.getByRole('link', { name: 'Top events as CSV' })).toHaveAttribute(
      'href',
      '/p-store/overview/export?from=2026-09-01&to=2026-09-30&table=events',
    );
  });

  it('shows how to install the SDK when nothing arrived in the period', async () => {
    const empty = await new MockOverviewService().overview('p-store', {
      from: '2026-10-05',
      to: '2026-10-05',
      filters: NO_DASHBOARD_FILTERS,
    });
    state.overview = (): Promise<OverviewReport> =>
      Promise.resolve({
        ...empty,
        days: empty.days.map((day) => ({ ...day, pageViews: 0, events: 0 })),
      });

    renderWithMessages(await renderOverview({ range: 'today' }));

    expect(
      screen.getByRole('heading', { name: 'No events in this period yet' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Visits' })).not.toBeInTheDocument();
  });

  it('says no visit matches the filters when a filtered period is empty', async () => {
    const empty = await new MockOverviewService().overview('p-store', {
      from: '2026-10-05',
      to: '2026-10-05',
      filters: NO_DASHBOARD_FILTERS,
    });
    state.overview = (): Promise<OverviewReport> =>
      Promise.resolve({
        ...empty,
        days: empty.days.map((day) => ({ ...day, pageViews: 0, events: 0 })),
      });

    renderWithMessages(await renderOverview({ range: 'today', identity: 'identified' }));

    expect(
      screen.getByRole('heading', { name: 'No visits match these filters' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Remove filters' })).toHaveAttribute(
      'href',
      '/p-store/overview?range=today',
    );
  });

  it('compares with the previous period under the same filters, and keeps them in its links', async () => {
    renderWithMessages(await renderOverview({ range: '7d', os: 'android' }));

    expect(screen.getAllByText(/same filters/).length).toBeGreaterThan(0);
    for (const link of screen.getAllByRole('link', { name: /as CSV$/ })) {
      expect(link.getAttribute('href')).toContain('os=android');
    }
    expect(screen.getAllByText(/filtered to System: Android/).length).toBeGreaterThan(0);
  });

  it('calls an empty period quiet once the project has received events', async () => {
    const empty = await new MockOverviewService().overview('p-store', {
      from: '2026-10-05',
      to: '2026-10-05',
      filters: NO_DASHBOARD_FILTERS,
    });
    state.overview = (): Promise<OverviewReport> =>
      Promise.resolve({
        ...empty,
        days: empty.days.map((day) => ({ ...day, pageViews: 0, events: 0 })),
      });
    state.admin = {
      ...ADMIN,
      projects: ADMIN.projects.map((project) => ({
        ...project,
        firstEventAt: '2026-03-02T12:00:00.000Z',
        lastEventAt: '2026-09-20T01:30:00.000Z',
      })),
    };

    renderWithMessages(await renderOverview({ range: 'today' }));

    expect(screen.getByRole('heading', { name: 'Nothing in this period' })).toBeInTheDocument();
    expect(screen.getByText(/The latest one arrived on Sep 19, 2026, 22:30\./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the last 30 days' })).toHaveAttribute(
      'href',
      '/p-store/overview?range=30d',
    );
    expect(screen.queryByText(/npm install/)).not.toBeInTheDocument();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.overview = () => Promise.reject(new UnauthenticatedError());

    await expect(renderOverview()).rejects.toThrow('redirect:/sign-in?expired=1');
  });

  it('answers not found when the API knows no such project', async () => {
    state.overview = () => Promise.reject(new ApiNotFoundError('/v1/projects/p-store/overview'));

    await expect(renderOverview()).rejects.toThrow('not-found');
  });

  it('lets any other failure reach the error screen', async () => {
    state.overview = () =>
      Promise.reject(new ApiRequestError('/v1/projects/p-store/overview', 503));

    await expect(renderOverview()).rejects.toThrow(ApiRequestError);
  });
});

describe('error state', () => {
  it('offers a retry and the error id when the screen fails', () => {
    const retry = vi.fn();
    const error = Object.assign(new Error('boom'), { digest: 'abc123' });
    renderWithMessages(<ProjectError error={error} retry={retry} />);

    screen.getByRole('button', { name: 'Try again' }).click();

    expect(screen.getByText('error id abc123')).toBeInTheDocument();
    expect(retry).toHaveBeenCalledOnce();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Could not load this data' }),
    ).toBeInTheDocument();
  });

  it('shows no error id when there is none', () => {
    renderWithMessages(<ProjectError error={new Error('boom')} retry={vi.fn()} />);

    expect(screen.queryByText(/error id/)).not.toBeInTheDocument();
  });
});
