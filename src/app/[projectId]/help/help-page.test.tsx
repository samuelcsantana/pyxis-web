import { screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import type { Admin } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { DEMO_STORE } from '@/services/demo/demo-projects';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import HelpPage, { generateMetadata } from './page';

const state = vi.hoisted<{
  admin: unknown;
  accounts: () => Promise<readonly Account[]>;
  search: string;
}>(() => ({
  admin: undefined,
  accounts: () => Promise.reject(new Error('accounts not set')),
  search: '',
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
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => `/${DEMO_STORE.id}/help`,
  useSearchParams: () => new URLSearchParams(state.search),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.resolve(state.admin) }),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
}));

const STORE = {
  id: DEMO_STORE.id,
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: 'signup_completed',
};
const ADMIN: Admin = { email: 'owner@example.com', projects: [STORE] };
const NOW = new Date('2026-10-06T02:30:00.000Z');

function renderHelp(projectId = DEMO_STORE.id) {
  return HelpPage({ params: Promise.resolve({ projectId }) });
}

async function demoAccountWith(status: Account['status']): Promise<readonly Account[]> {
  const [account] = await new MockAccountsService(() => NOW).list();
  return account === undefined ? [] : [{ ...account, status }];
}

beforeEach(() => {
  state.admin = ADMIN;
  state.accounts = () => demoAccountWith('active');
  state.search = '';
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('HelpPage', () => {
  it('gives the support address, who should write, the reply time of a paid plan and the links', async () => {
    renderWithMessages(await renderHelp());

    expect(screen.getByRole('heading', { level: 1, name: 'Help and support' })).toBeInTheDocument();
    const write = screen.getByRole('region', { name: 'Write to support' });
    expect(within(write).getByText('hello@pyxis-analytics.dev')).toBeInTheDocument();
    expect(within(write).getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(write).toHaveTextContent('Write from owner@example.com, so we know which account');
    expect(write).toHaveTextContent('reply within 2 business days');
    expect(write).not.toHaveTextContent('On the free plan');
    expect(screen.getByRole('link', { name: 'How to install' })).toHaveAttribute(
      'href',
      `/${DEMO_STORE.id}/install`,
    );
    expect(screen.getByRole('link', { name: 'Guide for AI agents' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/llms.txt',
    );
    expect(screen.getByRole('link', { name: 'Ask on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-sdk/issues/new?template=question.yml',
    );
    expect(screen.getByRole('link', { name: 'Report it privately' })).toHaveAttribute(
      'href',
      'https://github.com/samuelcsantana/pyxis-api/security/advisories/new',
    );
  });

  it('keeps the period and the filters it was opened with on the way to the install guide', async () => {
    state.search = 'from=2026-10-01&to=2026-10-05&path=%2Fpricing';

    renderWithMessages(await renderHelp());

    expect(screen.getByRole('link', { name: 'How to install' })).toHaveAttribute(
      'href',
      `/${DEMO_STORE.id}/install?from=2026-10-01&to=2026-10-05&path=%2Fpricing`,
    );
  });

  it('gives a free account the free plan’s reply time and sends its technical questions to GitHub', async () => {
    state.accounts = () => demoAccountWith('free');

    renderWithMessages(await renderHelp());

    const write = screen.getByRole('region', { name: 'Write to support' });
    expect(write).toHaveTextContent('On the free plan, we reply by e-mail within 5 days');
    expect(write).not.toHaveTextContent('2 business days');
  });

  it('gives both reply times to someone who owns no account', async () => {
    state.accounts = () => Promise.resolve([]);

    renderWithMessages(await renderHelp());

    const write = screen.getByRole('region', { name: 'Write to support' });
    expect(write).toHaveTextContent('2 business days');
    expect(write).toHaveTextContent('within 5 days');
  });

  it('sends a signed-out admin to sign in again', async () => {
    state.accounts = () => Promise.reject(new UnauthenticatedError());

    await expect(renderHelp()).rejects.toThrow('redirect:/sign-in?expired=1');
  });

  it('answers not found for a project the admin may not read', async () => {
    await expect(renderHelp('p-unknown')).rejects.toThrow('not-found');
  });

  it('titles the page with the screen and the project, with the demo address as canonical', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const metadata = await generateMetadata({ params: Promise.resolve({ projectId: STORE.id }) });

    expect(metadata.title).toBe('Help and support · Demo Store');
    expect(metadata.alternates?.canonical).toBe(
      `https://demo.pyxis-analytics.dev/${STORE.id}/help`,
    );
  });
});
