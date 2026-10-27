import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Account } from '@/domain/accounts';
import type { SignUpStatus } from '@/domain/sign-up';
import { MockAccountsService } from '@/services/accounts/mock-accounts-service';
import { DEMO_ACCOUNT_ID } from '@/services/projects/demo-project-settings';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import WelcomePage, { generateMetadata as welcomeMetadata } from '../welcome/page';
import SignUpPage, { DASHBOARD_HOME, generateMetadata } from './page';

const state = vi.hoisted<{
  token: string | undefined;
  accounts: () => Promise<readonly Account[]>;
  status: () => Promise<SignUpStatus>;
}>(() => ({
  token: undefined,
  accounts: () => Promise.resolve([]),
  status: () =>
    Promise.resolve({
      open: true,
      termsVersion: '2026-11-01',
      termsUrl: 'https://pyxis.example.com/terms',
      freePlan: 'closed',
    }),
}));

vi.mock('@/services/session-token', () => ({
  sessionToken: () => Promise.resolve(state.token),
}));

vi.mock('@/services/accounts/accounts-service.factory', () => ({
  createAccountsService: () => ({ list: () => state.accounts() }),
}));

vi.mock('@/services/sign-up/sign-up-service.factory', () => ({
  createSignUpService: () => ({ status: () => state.status() }),
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
  useRouter: () => ({ refresh: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/sign-up',
  useSearchParams: () => new URLSearchParams(),
}));

async function demoAccount(overrides: Partial<Account> = {}): Promise<readonly Account[]> {
  const [account] = await new MockAccountsService().list();
  if (account === undefined) {
    throw new Error('The demo has an account.');
  }
  return [{ ...account, ...overrides }];
}

describe('SignUpPage', () => {
  beforeEach(() => {
    state.token = undefined;
    state.accounts = () => Promise.resolve([]);
    state.status = () =>
      Promise.resolve({
        open: true,
        termsVersion: '2026-11-01',
        termsUrl: 'https://pyxis.example.com/terms',
        freePlan: 'closed',
      });
  });

  it('offers the sign-up form with the terms of the day to a visitor', async () => {
    renderWithMessages(await SignUpPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Start your free trial' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/version 2026-11-01/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('starts on the yearly plan when the home page link asks for it', async () => {
    renderWithMessages(await SignUpPage({ searchParams: Promise.resolve({ interval: 'year' }) }));

    expect(screen.getByRole('button', { name: 'Yearly' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('gives no demo code with a real API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await SignUpPage());

    expect(screen.getByRole('button', { name: 'Send code' })).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('says sign-up is not open yet, with the demo and the home page', async () => {
    state.status = () =>
      Promise.resolve({ open: false, termsVersion: null, termsUrl: null, freePlan: 'closed' });

    renderWithMessages(await SignUpPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Sign-up is not open yet' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open the live demo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the home page' })).toBeInTheDocument();
  });

  it('asks an owner who left Checkout to finish the subscription', async () => {
    state.token = 'session';
    state.accounts = () => demoAccount({ status: 'incomplete' });

    renderWithMessages(await SignUpPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'Finish your subscription' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finish subscription' })).toBeInTheDocument();
  });

  it('tells an owner who waits for a free place that the account waits, and offers to subscribe', async () => {
    state.token = 'session';
    state.accounts = () =>
      demoAccount({ status: 'incomplete', freeWaitlistedAt: '2026-11-20T10:00:00.000Z' });

    renderWithMessages(await SignUpPage());

    expect(
      screen.getByRole('heading', { level: 1, name: 'The free plan is full for now' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe now' })).toBeInTheDocument();
  });

  it('sends an owner who already has access to the dashboard', async () => {
    state.token = 'session';
    state.accounts = () => demoAccount();

    await expect(SignUpPage()).rejects.toThrow(`redirect:${DASHBOARD_HOME}`);
  });

  it('offers the form to someone signed in who owns no account', async () => {
    state.token = 'session';
    state.accounts = () => demoAccount({ role: 'member' });

    renderWithMessages(await SignUpPage());

    expect(screen.getByRole('button', { name: 'Send code' })).toBeInTheDocument();
  });

  it('links the contract and identifies the seller once configured', async () => {
    vi.stubEnv('SELLER_NAME', 'Ana Exemplo');
    vi.stubEnv('SELLER_TAX_ID', '000.000.000-00');
    vi.stubEnv('SELLER_ADDRESS', 'Rua das Flores, 10, Cidade/UF');

    renderWithMessages(await SignUpPage());

    const contract = screen.getByRole('navigation', { name: 'Contract documents' });
    expect(within(contract).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/en/privacy',
    );
    expect(
      screen.getByText(
        'Sold by Ana Exemplo · CPF 000.000.000-00 · Rua das Flores, 10, Cidade/UF · hello@pyxis-analytics.dev',
      ),
    ).toBeVisible();
  });

  it('shows neither while the seller is not configured', async () => {
    renderWithMessages(await SignUpPage());

    expect(screen.queryByRole('navigation', { name: 'Contract documents' })).toBeNull();
  });

  it('is titled after the page', async () => {
    await expect(generateMetadata()).resolves.toEqual({ title: 'Sign up' });
  });
});

describe('WelcomePage', () => {
  function welcome(account: string | undefined = DEMO_ACCOUNT_ID) {
    return WelcomePage({ searchParams: Promise.resolve({ account }) });
  }

  it('says the trial started, until when, and offers the first project', async () => {
    state.accounts = () => demoAccount({ trialEndsAt: '2026-11-29T12:00:00.000Z' });

    renderWithMessages(await welcome());

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your free trial has started. It runs until Nov 29, 2026.',
    );
    expect(screen.getByRole('link', { name: 'Create your first project' })).toHaveAttribute(
      'href',
      '/new-project',
    );
  });

  it('welcomes an owner on the free plan with its limits, and offers the first project', async () => {
    state.accounts = () =>
      demoAccount({
        status: 'free',
        billingInterval: null,
        trialEndsAt: null,
        currentPeriodEndsAt: null,
        limits: { eventsPerMonth: 10_000, projects: 1, people: 1, pauseAtEvents: 10_000 },
      });

    renderWithMessages(await welcome());

    expect(screen.getByRole('status')).toHaveTextContent('Your account is on the free plan.');
    expect(
      screen.getByText(
        'Up to 10,000 events a month, 1 project and 1 person, with every feature and no card. Measuring pauses when the month reaches 10,000 events and comes back on the 1st.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/subscription/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create your first project' })).toHaveAttribute(
      'href',
      '/new-project',
    );
    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toBeInTheDocument();
  });

  it('confirms a trial whose end it does not know yet', async () => {
    state.accounts = () => demoAccount({ status: 'trialing', trialEndsAt: null });

    renderWithMessages(await welcome());

    expect(screen.getByRole('status')).toHaveTextContent('Your subscription is confirmed.');
    expect(screen.getByRole('link', { name: 'Create your first project' })).toBeInTheDocument();
  });

  it('welcomes back an account that subscribed again, sending it to its projects', async () => {
    state.accounts = () => demoAccount({ status: 'active', trialEndsAt: null });

    renderWithMessages(await welcome());

    expect(screen.getByRole('status')).toHaveTextContent('Your subscription is active again.');
    expect(screen.getByText(/create one in each project's Settings/)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Open the dashboard' })).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Open the dashboard' })).toHaveAttribute('href', '/');
    expect(
      screen.queryByRole('link', { name: 'Create your first project' }),
    ).not.toBeInTheDocument();
  });

  it('waits for Stripe while an ended account that subscribed again is still ended', async () => {
    state.accounts = () => demoAccount({ status: 'ended', trialEndsAt: null });

    renderWithMessages(await welcome());

    expect(screen.getByRole('status')).toHaveTextContent('Confirming your subscription…');
  });

  it('waits while Stripe has not confirmed the subscription yet', async () => {
    state.accounts = () => demoAccount({ status: 'incomplete' });

    renderWithMessages(await welcome());

    expect(screen.getByRole('status')).toHaveTextContent('Confirming your subscription…');
    expect(
      screen.queryByRole('link', { name: 'Create your first project' }),
    ).not.toBeInTheDocument();
  });

  it('sends anyone else to the dashboard', async () => {
    state.accounts = () => demoAccount();

    await expect(welcome('another-account')).rejects.toThrow('redirect:/');
    state.accounts = () => demoAccount({ role: 'member' });
    await expect(welcome()).rejects.toThrow('redirect:/');
  });

  it('is titled after the page', async () => {
    await expect(welcomeMetadata()).resolves.toEqual({ title: 'Welcome to Pyxis' });
  });
});
