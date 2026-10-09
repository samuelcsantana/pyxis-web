import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import { serializeSteps } from '@/domain/funnel';
import { DEMO_FUNNEL_STEPS } from '@/services/funnel/demo-funnel';
import type { IFunnelService } from '@/services/funnel/funnel-service.interface';
import { MockFunnelService } from '@/services/funnel/mock-funnel-service';
import FunnelPage from './page';

const state = vi.hoisted<{
  admin: unknown;
  funnel: IFunnelService['funnel'];
  subjects: IFunnelService['subjects'];
}>(() => ({
  admin: undefined,
  funnel: () => Promise.reject(new Error('funnel not set')),
  subjects: () => Promise.reject(new Error('subjects not set')),
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
  usePathname: () => '/p-store/funnel',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/funnel/funnel-service.factory', () => ({
  createFunnelService: (): IFunnelService => ({
    funnel: (projectId, range, mode, steps) => state.funnel(projectId, range, mode, steps),
    subjects: (projectId, range, mode, steps, drill) =>
      state.subjects(projectId, range, mode, steps, drill),
    segments: (projectId, range, steps, by) =>
      new MockFunnelService().segments(projectId, range, steps, by),
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

const STEPS = serializeSteps(DEMO_FUNNEL_STEPS);

function renderFunnel(search: Record<string, string>) {
  return FunnelPage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve(search),
  });
}

beforeEach(() => {
  state.admin = ADMIN;
  state.funnel = (projectId, range, mode, steps) =>
    new MockFunnelService().funnel(projectId, range, mode, steps);
  state.subjects = (projectId, range, mode, steps, drill) =>
    new MockFunnelService().subjects(projectId, range, mode, steps, drill);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('FunnelPage', () => {
  it('opens the editor with an explanation, and asks nothing, without steps', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    const funnel = vi.fn<IFunnelService['funnel']>();
    state.funnel = funnel;

    renderWithMessages(await renderFunnel({ range: '7d', steps: '[{"type":"page"}]' }));

    expect(funnel).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Build a funnel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close the editor' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const example = screen.getByRole('link', { name: 'Start from an example funnel' });
    expect(new URL(example.getAttribute('href') ?? '', 'https://x').searchParams.get('steps')).toBe(
      STEPS,
    );
    expect(screen.getByRole('link', { name: 'Per person' })).toHaveAttribute(
      'href',
      '/p-store/funnel?range=7d&mode=user',
    );
  });

  it('opens the demo on the example funnel of the project', async () => {
    const funnel = vi.fn<IFunnelService['funnel']>((projectId, range, mode, steps) =>
      new MockFunnelService().funnel(projectId, range, mode, steps),
    );
    state.funnel = funnel;

    renderWithMessages(await renderFunnel({ range: '7d' }));

    expect(funnel).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-29', to: '2026-10-05' },
      'visit',
      DEMO_FUNNEL_STEPS,
    );
    expect(screen.queryByRole('heading', { name: 'Build a funnel' })).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Funnel' })).getAllByRole('listitem'),
    ).toHaveLength(6);
    const sevenDays = new URL(
      screen.getByRole('link', { name: '7 days' }).getAttribute('href') ?? '',
      'https://x',
    );
    expect(sevenDays.searchParams.get('steps')).toBe(STEPS);
  });

  it('counts the steps of the URL for the period and the mode', async () => {
    const funnel = vi.fn<IFunnelService['funnel']>((projectId, range, mode, steps) =>
      new MockFunnelService().funnel(projectId, range, mode, steps),
    );
    state.funnel = funnel;

    renderWithMessages(await renderFunnel({ range: '30d', mode: 'user', steps: STEPS }));

    expect(funnel).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      'user',
      DEMO_FUNNEL_STEPS,
    );
    expect(
      within(screen.getByRole('list', { name: 'Funnel' })).getAllByRole('listitem'),
    ).toHaveLength(6);
    expect(screen.getByRole('group', { name: 'Overall conversion' })).toHaveTextContent(
      'people reached the last step',
    );
    expect(screen.getByRole('group', { name: 'Biggest drop-off' })).toHaveTextContent(
      /^Biggest drop-offStep \d → \d.+ → .+ · [\d.]+% continued$/,
    );
    const editSteps = screen.getByRole('button', { name: 'Edit steps' });
    expect(editSteps).toHaveAttribute('aria-expanded', 'false');
    expect(
      editSteps.compareDocumentPosition(screen.getByRole('group', { name: 'Overall conversion' })),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    const sevenDays = new URL(
      screen.getByRole('link', { name: '7 days' }).getAttribute('href') ?? '',
      'https://x',
    );
    expect(sevenDays.searchParams.get('mode')).toBe('user');
    expect(sevenDays.searchParams.get('steps')).toBe(STEPS);
  });

  it('times each step and the whole funnel, and leaves the time out when unmeasured', async () => {
    const { unmount } = renderWithMessages(await renderFunnel({ range: '30d', steps: STEPS }));

    expect(screen.getByRole('group', { name: 'Median time to finish' })).toHaveTextContent(
      `from step 1 to step ${String(DEMO_FUNNEL_STEPS.length)}, for those who reached it`,
    );
    expect(screen.getAllByText(/^median .+ after the step before$/)).toHaveLength(
      DEMO_FUNNEL_STEPS.length - 1,
    );
    unmount();

    state.funnel = (projectId, range, mode, steps) =>
      new MockFunnelService()
        .funnel(projectId, range, mode, steps)
        .then((report) => ({ ...report, medianSecondsOverall: null }));
    renderWithMessages(await renderFunnel({ range: '30d', steps: STEPS }));

    expect(screen.queryByRole('group', { name: 'Median time to finish' })).not.toBeInTheDocument();
  });

  it('links every step to who reached it, and every later step to who left before it', async () => {
    const subjects = vi.fn<IFunnelService['subjects']>();
    state.subjects = subjects;

    renderWithMessages(await renderFunnel({ range: '7d', steps: STEPS }));

    expect(subjects).not.toHaveBeenCalled();
    const steps = within(screen.getByRole('list', { name: 'Funnel' }));
    const reached = steps.getAllByRole('link', { name: /, list who reached step \d$/ });
    const dropped = steps.getAllByRole('link', { name: /dropped, list who left before step \d$/ });
    expect(reached).toHaveLength(DEMO_FUNNEL_STEPS.length);
    expect(dropped).toHaveLength(DEMO_FUNNEL_STEPS.length - 1);
    const second = new URL(dropped[0]?.getAttribute('href') ?? '', 'https://x');
    expect(second.searchParams.get('step')).toBe('2');
    expect(second.searchParams.get('outcome')).toBe('dropped');
    expect(second.searchParams.get('steps')).toBe(STEPS);
    expect(second.hash).toBe('#funnel-subjects');
    expect(screen.queryByRole('region', { name: /reached step/ })).not.toBeInTheDocument();
  });

  it('lists who left before a step, as many as the step lost, and pages to the older ones', async () => {
    renderWithMessages(
      await renderFunnel({ range: '30d', steps: STEPS, step: '2', outcome: 'dropped' }),
    );

    const list = screen.getByRole('region', { name: /visits reached step 1 and never step 2$/ });
    const counted = Number(
      /^([\d,]+) /.exec(list.querySelector('h2')?.textContent ?? '')?.[1]?.replaceAll(',', ''),
    );
    expect(counted).toBeGreaterThan(50);
    expect(within(list).getAllByRole('row')).toHaveLength(51);
    const opened = within(list).getAllByRole('link', {
      name: /, open this visit in the timeline$/,
    });
    expect(opened[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/p-store\/timeline\?range=30d&visit=[0-9a-f-]{36}$/),
    );
    const older = new URL(
      within(list).getByRole('link', { name: 'Show older' }).getAttribute('href') ?? '',
      'https://x',
    );
    expect(older.searchParams.get('cursor')).not.toBeNull();
    expect(
      within(list).queryByRole('link', { name: 'Back to the newest' }),
    ).not.toBeInTheDocument();
    expect(within(list).getByRole('link', { name: 'Close the list' })).toHaveAttribute(
      'href',
      `/p-store/funnel?range=30d&mode=visit&steps=${encodeURIComponent(STEPS)}`,
    );
    const current = screen.getByRole('link', { name: /dropped, list who left before step 2$/ });
    expect(current).toHaveAttribute('aria-current', 'true');
    const sevenDays = new URL(
      screen.getByRole('link', { name: '7 days' }).getAttribute('href') ?? '',
      'https://x',
    );
    expect(sevenDays.searchParams.get('step')).toBe('2');
    expect(sevenDays.searchParams.get('cursor')).toBeNull();
  });

  it('lists the people of a step in person mode, back to the newest from an older page', async () => {
    const subjects = vi.fn<IFunnelService['subjects']>(() =>
      Promise.resolve({
        subjects: [{ id: 'u_7f3a', lastStepAt: '2026-10-04T12:00:00.000Z' }],
        nextCursor: null,
      }),
    );
    state.subjects = subjects;

    renderWithMessages(
      await renderFunnel({
        range: '30d',
        mode: 'user',
        steps: STEPS,
        step: '1',
        outcome: 'reached',
        cursor: 'older',
      }),
    );

    expect(subjects).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      'user',
      DEMO_FUNNEL_STEPS,
      { step: 1, outcome: 'reached', cursor: 'older' },
    );
    const list = screen.getByRole('region', { name: /people reached step 1$/ });
    expect(within(list).getByRole('columnheader', { name: 'Person' })).toBeInTheDocument();
    expect(
      within(list).getByRole('link', { name: 'u_7f3a, open the timeline of this person' }),
    ).toHaveAttribute('href', '/p-store/timeline?range=30d&user=u_7f3a');
    expect(within(list).getByRole('link', { name: 'Back to the newest' })).toHaveAttribute(
      'href',
      expect.not.stringContaining('cursor'),
    );
    expect(within(list).queryByRole('link', { name: 'Show older' })).not.toBeInTheDocument();
  });

  it('splits the per-visit funnel by device, and by channel when the address asks', async () => {
    const { unmount } = renderWithMessages(await renderFunnel({ range: '30d', steps: STEPS }));

    expect(screen.getByRole('table', { name: 'The funnel by device type' })).toBeInTheDocument();
    unmount();

    renderWithMessages(await renderFunnel({ range: '30d', steps: STEPS, by: 'channel' }));

    expect(screen.getByRole('table', { name: 'The funnel by channel' })).toBeInTheDocument();
    const tabs = screen.getByRole('navigation', { name: 'Split the funnel' });
    expect(
      within(tabs).getByRole('link', { name: 'By device' }).getAttribute('href'),
    ).not.toContain('by=');
    expect(screen.getByRole('link', { name: '7 days' }).getAttribute('href')).toContain(
      'by=channel',
    );
  });

  it('explains there is no split per person', async () => {
    renderWithMessages(await renderFunnel({ range: '30d', mode: 'user', steps: STEPS }));

    expect(screen.getByText(/Per person, a device or a channel is not defined/)).toBeVisible();
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.funnel = () => Promise.reject(new UnauthenticatedError());

    await expect(renderFunnel({ steps: STEPS })).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
