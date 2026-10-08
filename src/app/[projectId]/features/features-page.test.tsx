import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import type { IFeaturesService } from '@/services/features/features-service.interface';
import { MockFeaturesService } from '@/services/features/mock-features-service';
import FeaturesPage from './page';
import { renderWithMessages } from '@/test-utils/render-with-messages';

const state = vi.hoisted<{ admin: unknown; features: IFeaturesService['features'] }>(() => ({
  admin: undefined,
  features: () => Promise.reject(new Error('features not set')),
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
  usePathname: () => '/p-store/features',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/features/features-service.factory', () => ({
  createFeaturesService: (): IFeaturesService => ({
    features: (projectId, range, kind) => state.features(projectId, range, kind),
    properties: (projectId, range, name) =>
      new MockFeaturesService().properties(projectId, range, name),
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

function renderFeatures(search: Record<string, string> = { range: '7d' }) {
  return FeaturesPage({
    params: Promise.resolve({ projectId: 'p-store' }),
    searchParams: Promise.resolve(search),
  });
}

beforeEach(() => {
  state.admin = ADMIN;
  state.features = (projectId, range, kind) =>
    new MockFeaturesService().features(projectId, range, kind);
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-06T02:30:00.000Z'));
});

describe('FeaturesPage', () => {
  it('ranks the events of the period by default', async () => {
    const features = vi.fn<IFeaturesService['features']>((projectId, range, kind) =>
      new MockFeaturesService().features(projectId, range, kind),
    );
    state.features = features;

    renderWithMessages(await renderFeatures());

    expect(features).toHaveBeenCalledWith(
      'p-store',
      { from: '2026-09-29', to: '2026-10-05' },
      'events',
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Features' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Most used events' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Properties of Calculator result shown' }),
    ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Screens' })).toHaveAttribute(
      'href',
      '/p-store/features?range=7d&kind=screens',
    );
    expect(screen.getByRole('link', { name: 'Today' })).toHaveAttribute(
      'href',
      '/p-store/features?range=today&kind=events',
    );
    expect(
      screen.getByRole('link', { name: 'Calculator result shown: see its visits' }),
    ).toHaveAttribute('href', '/p-store/visits?range=7d&event=calculator_result_shown');
  });

  it('ranks the screens when asked, and keeps the search across periods', async () => {
    renderWithMessages(await renderFeatures({ range: '30d', kind: 'screens', q: 'orders' }));

    expect(screen.getByRole('table', { name: 'Most visited screens' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(4);
    expect(screen.queryByRole('button', { name: /^Properties of/ })).toBeNull();
    expect(screen.getByRole('searchbox', { name: 'Search screens' })).toHaveValue('orders');
    expect(screen.getByRole('link', { name: '7 days' })).toHaveAttribute(
      'href',
      '/p-store/features?range=7d&kind=screens&q=orders',
    );
    expect(screen.getByRole('link', { name: 'Clear' })).toHaveAttribute(
      'href',
      '/p-store/features?range=30d&kind=screens',
    );
    expect(screen.getByRole('link', { name: '/orders/:id: see its visits' })).toHaveAttribute(
      'href',
      '/p-store/visits?range=30d&path=%2Forders%2F%3Aid',
    );
  });

  it('offers the ranking it shows as a CSV file, kind and search kept', async () => {
    renderWithMessages(await renderFeatures({ range: '30d', kind: 'screens', q: 'orders' }));

    expect(screen.getByRole('link', { name: 'Screens as CSV' })).toHaveAttribute(
      'href',
      '/p-store/features/export?range=30d&kind=screens&q=orders',
    );
  });

  it('offers the events as a CSV file without a search', async () => {
    renderWithMessages(await renderFeatures());

    expect(screen.getByRole('link', { name: 'Events as CSV' })).toHaveAttribute(
      'href',
      '/p-store/features/export?range=7d&kind=events',
    );
  });

  it('sends an expired session back to the sign-in page', async () => {
    state.features = () => Promise.reject(new UnauthenticatedError());

    await expect(renderFeatures()).rejects.toThrow('redirect:/sign-in?expired=1');
  });
});
