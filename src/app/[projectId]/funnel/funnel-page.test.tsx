import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import { serializeSteps } from '@/domain/funnel';
import { DEMO_FUNNEL_STEPS } from '@/services/funnel/demo-funnel';
import type { IFunnelService } from '@/services/funnel/funnel-service.interface';
import { MockFunnelService } from '@/services/funnel/mock-funnel-service';
import FunnelPage from './page';

const state = vi.hoisted<{ admin: unknown; funnel: IFunnelService['funnel'] }>(() => ({
  admin: undefined,
  funnel: () => Promise.reject(new Error('funnel not set')),
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
  usePathname: () => '/p-store/funnel',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/funnel/funnel-service.factory', () => ({
  createFunnelService: (): IFunnelService => ({
    funnel: (projectId, range, mode, steps) => state.funnel(projectId, range, mode, steps),
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
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('FunnelPage', () => {
  it('opens the editor with an explanation, and asks nothing, without steps', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    const funnel = vi.fn<IFunnelService['funnel']>();
    state.funnel = funnel;

    render(await renderFunnel({ range: '7d', steps: '[{"type":"page"}]' }));

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

    render(await renderFunnel({ range: '7d' }));

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

    render(await renderFunnel({ range: '30d', mode: 'user', steps: STEPS }));

    expect(funnel).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-06', to: '2026-10-05' },
      'user',
      DEMO_FUNNEL_STEPS,
    );
    expect(
      within(screen.getByRole('list', { name: 'Funnel' })).getAllByRole('listitem'),
    ).toHaveLength(6);
    expect(screen.getByRole('region', { name: 'Overall conversion' })).toHaveTextContent(
      'people reached the last step',
    );
    expect(screen.getByRole('region', { name: 'Biggest drop-off' })).toHaveTextContent(
      'Calculator result shown → Opened /sign-up',
    );
    expect(screen.getByRole('button', { name: 'Edit steps' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    const sevenDays = new URL(
      screen.getByRole('link', { name: '7 days' }).getAttribute('href') ?? '',
      'https://x',
    );
    expect(sevenDays.searchParams.get('mode')).toBe('user');
    expect(sevenDays.searchParams.get('steps')).toBe(STEPS);
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.funnel = () => Promise.reject(new UnauthenticatedError());

    await expect(renderFunnel({ steps: STEPS })).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
