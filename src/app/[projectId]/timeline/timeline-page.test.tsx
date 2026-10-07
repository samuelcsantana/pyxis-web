import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { TimelineReport } from '@/domain/timeline';
import { DEMO_DOCS } from '@/services/demo/demo-projects';
import { DEMO_USER_ID } from '@/services/timeline/demo-timeline';
import { MockTimelineService } from '@/services/timeline/mock-timeline-service';
import type { ITimelineService } from '@/services/timeline/timeline-service.interface';
import TimelinePage from './page';

const state = vi.hoisted<{ admin: unknown; timeline: ITimelineService['timeline'] }>(() => ({
  admin: undefined,
  timeline: () => Promise.reject(new Error('timeline not set')),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/p-store/timeline',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/timeline/timeline-service.factory', () => ({
  createTimelineService: (): ITimelineService => ({
    timeline: (projectId, lookup, before) => state.timeline(projectId, lookup, before),
  }),
}));

const ADMIN: Admin = {
  email: 'owner@demo-store.example',
  projects: [
    { id: 'p-store', name: 'Demo Store', timezone: 'America/Sao_Paulo', conversionEvent: null },
  ],
};

function renderTimeline(search: Record<string, string>) {
  return TimelinePage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve(search),
  });
}

beforeEach(() => {
  state.admin = ADMIN;
  state.timeline = (projectId, lookup, before) =>
    new MockTimelineService().timeline(projectId, lookup, before);
});

describe('TimelinePage', () => {
  it('explains the lookup, asks nothing and has no period, without an id', async () => {
    const timeline = vi.fn<ITimelineService['timeline']>();
    state.timeline = timeline;
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    render(await renderTimeline({ user: 'not an id' }));

    expect(timeline).not.toHaveBeenCalled();
    expect(
      screen.getByRole('heading', { name: 'Look up a person or a visit' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Period' })).not.toBeInTheDocument();
    expect(screen.getByText(`Try ${DEMO_USER_ID}`)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: `Open the timeline of the demo person ${DEMO_USER_ID}` }),
    ).toHaveAttribute('href', `/p-store/timeline?user=${DEMO_USER_ID}`);
  });

  it('offers no demo person outside the demo', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    render(await renderTimeline({}));

    expect(screen.queryByRole('link', { name: /demo person/ })).not.toBeInTheDocument();
  });

  it('offers no demo person in a demo project that has none', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    state.admin = {
      ...ADMIN,
      projects: [
        {
          id: DEMO_DOCS.id,
          name: DEMO_DOCS.name,
          timezone: DEMO_DOCS.timezone,
          conversionEvent: null,
        },
      ],
    };

    render(
      await TimelinePage({
        params: Promise.resolve({ projectId: DEMO_DOCS.id }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.queryByRole('link', { name: /demo person/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/^Try /)).not.toBeInTheDocument();
  });

  it('tells the story of a person with filters that keep the lookup', async () => {
    const timeline = vi.fn<ITimelineService['timeline']>((projectId, lookup, before) =>
      new MockTimelineService().timeline(projectId, lookup, before),
    );
    state.timeline = timeline;
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    render(await renderTimeline({ user: DEMO_USER_ID, show: 'errors' }));

    expect(timeline).toHaveBeenCalledWith('p-store', { kind: 'user', id: DEMO_USER_ID }, null);
    expect(screen.getByRole('heading', { name: `User ${DEMO_USER_ID}` })).toBeInTheDocument();
    expect(screen.getAllByRole('region', { name: /^Visit / })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Everything' })).toHaveAttribute(
      'href',
      `/p-store/timeline?user=${DEMO_USER_ID}`,
    );
    expect(screen.getByRole('link', { name: 'Requests' })).toHaveAttribute(
      'href',
      `/p-store/timeline?user=${DEMO_USER_ID}&show=requests`,
    );
    expect(screen.queryByText(/^Try /)).not.toBeInTheDocument();
  });

  it('carries the period of the screen it came from, for the way back', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    const { unmount } = render(await renderTimeline({ range: '7d' }));
    expect(
      screen.getByRole('link', { name: `Open the timeline of the demo person ${DEMO_USER_ID}` }),
    ).toHaveAttribute('href', `/p-store/timeline?range=7d&user=${DEMO_USER_ID}`);
    expect(document.querySelector('input[type="hidden"][name="range"]')).toHaveValue('7d');
    unmount();

    render(await renderTimeline({ user: DEMO_USER_ID, from: '2026-08-01', to: '2026-08-31' }));

    expect(screen.getByRole('link', { name: 'Errors only' })).toHaveAttribute(
      'href',
      `/p-store/timeline?from=2026-08-01&to=2026-08-31&user=${DEMO_USER_ID}&show=errors`,
    );
  });

  it('opens one visit, with nothing older to show', async () => {
    render(await renderTimeline({ visit: '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01' }));

    expect(screen.getAllByRole('region', { name: /^Visit .+ · / })).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Load older visits' })).not.toBeInTheDocument();
  });

  it('says when nothing was found, and when there are older visits', async () => {
    state.timeline = (): Promise<TimelineReport> =>
      Promise.resolve({ visits: [], nextBefore: null });

    const { unmount } = render(
      await renderTimeline({ visit: '3c07a1b2-6d4e-4f10-9a2b-5c8d7e6f1a01' }),
    );
    expect(
      screen.getByRole('heading', { name: 'No visits found for Visit 3c07a1b2' }),
    ).toBeInTheDocument();
    unmount();

    state.timeline = (projectId, lookup, before) =>
      new MockTimelineService().timeline(projectId, lookup, before);
    render(await renderTimeline({ user: DEMO_USER_ID }));
    expect(screen.getByRole('button', { name: 'Load older visits' })).toBeInTheDocument();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.timeline = () => Promise.reject(new UnauthenticatedError());

    await expect(renderTimeline({ user: DEMO_USER_ID })).rejects.toThrow(
      'redirect:/sign-in?expired=1',
    );
  });
});
