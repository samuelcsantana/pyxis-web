import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AcquisitionReport } from '@/domain/acquisition';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { IAcquisitionService } from '@/services/acquisition/acquisition-service.interface';
import { MockAcquisitionService } from '@/services/acquisition/mock-acquisition-service';
import AcquisitionPage from './page';

const state = vi.hoisted<{ admin: unknown; acquisition: IAcquisitionService['acquisition'] }>(
  () => ({
    admin: undefined,
    acquisition: () => Promise.reject(new Error('acquisition not set')),
  }),
);

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
  usePathname: () => '/p-store/acquisition',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/acquisition/acquisition-service.factory', () => ({
  createAcquisitionService: (): IAcquisitionService => ({
    acquisition: (projectId, range) => state.acquisition(projectId, range),
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

function renderAcquisition() {
  return AcquisitionPage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve({ range: '7d' }),
  });
}

beforeEach(() => {
  state.admin = ADMIN;
  state.acquisition = (projectId, range) =>
    new MockAcquisitionService().acquisition(projectId, range);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('AcquisitionPage', () => {
  it('asks the report of the period in the project time zone', async () => {
    const acquisition = vi.fn<IAcquisitionService['acquisition']>((projectId, range) =>
      new MockAcquisitionService().acquisition(projectId, range),
    );
    state.acquisition = acquisition;

    render(await renderAcquisition());

    expect(acquisition).toHaveBeenCalledWith('p-store', { from: '2026-09-29', to: '2026-10-05' });
    expect(screen.getByRole('heading', { level: 1, name: 'Acquisition' })).toBeInTheDocument();
    expect(screen.getByText('Where visits to Demo Store come from')).toBeInTheDocument();
  });

  it('shows the paid visits, the top channel, the chart and the sources', async () => {
    render(await renderAcquisition());

    expect(screen.getByRole('group', { name: 'Paid visits' })).toHaveTextContent(
      /% of [\d,]+ visits/,
    );
    expect(screen.getByRole('group', { name: 'Top unpaid channel' })).not.toHaveTextContent('Paid');
    expect(
      screen.getByText('Every visit by the channel it came from, last 7 days'),
    ).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Sources' })).toHaveTextContent('google');
  });

  it('offers the sources and the visits by channel as CSV files of the period', async () => {
    render(await renderAcquisition());

    expect(screen.getByRole('link', { name: 'Sources as CSV' })).toHaveAttribute(
      'href',
      '/p-store/acquisition/export?range=7d&table=sources',
    );
    expect(screen.getByRole('link', { name: 'Visits by channel as CSV' })).toHaveAttribute(
      'href',
      '/p-store/acquisition/export?range=7d&table=channels',
    );
  });

  it('links the channel of each source to its visits, in the same period', async () => {
    render(await renderAcquisition());

    const [paid] = within(screen.getByRole('table', { name: 'Sources' })).getAllByRole('link', {
      name: 'Paid: see its visits',
    });
    expect(paid).toHaveAttribute('href', '/p-store/visits?range=7d&channel=paid');
  });

  it('lists the campaigns, each opening the visits it brought from its source', async () => {
    render(await renderAcquisition());

    const campaigns = screen.getByRole('table', { name: 'Campaigns' });
    expect(
      within(campaigns).getByRole('link', { name: 'spring_sale: see its visits from google' }),
    ).toHaveAttribute('href', '/p-store/visits?range=7d&campaign=spring_sale&source=google');
    expect(screen.getByRole('link', { name: 'Campaigns as CSV' })).toHaveAttribute(
      'href',
      '/p-store/acquisition/export?range=7d&table=campaigns',
    );
  });

  it('shows how to install the SDK when nobody visited in the period', async () => {
    const NONE = { paid: 0, email: 0, social: 0, campaign: 0, organic: 0, referral: 0, direct: 0 };
    state.acquisition = (): Promise<AcquisitionReport> =>
      Promise.resolve({
        days: [{ date: '2026-10-05', byChannel: NONE }],
        sources: [],
        campaigns: [],
      });

    render(await renderAcquisition());

    expect(
      screen.getByRole('heading', { name: 'No events in this period yet' }),
    ).toBeInTheDocument();
  });

  it('calls an empty period quiet once the project has received events', async () => {
    const NONE = { paid: 0, email: 0, social: 0, campaign: 0, organic: 0, referral: 0, direct: 0 };
    state.acquisition = (): Promise<AcquisitionReport> =>
      Promise.resolve({
        days: [{ date: '2026-10-05', byChannel: NONE }],
        sources: [],
        campaigns: [],
      });
    state.admin = {
      ...ADMIN,
      projects: ADMIN.projects.map((project) => ({
        ...project,
        firstEventAt: '2026-03-02T12:00:00.000Z',
        lastEventAt: '2026-09-20T01:30:00.000Z',
      })),
    };

    render(await renderAcquisition());

    expect(screen.getByRole('heading', { name: 'Nothing in this period' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the last 30 days' })).toHaveAttribute(
      'href',
      '/p-store/acquisition?range=30d',
    );
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.acquisition = () => Promise.reject(new UnauthenticatedError());

    await expect(renderAcquisition()).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
