import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SignInPage, { generateMetadata } from './page';
import { renderWithMessages } from '@/test-utils/render-with-messages';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

const signUp = vi.hoisted(() => ({ open: false }));

vi.mock('@/lib/landing-sign-up', () => ({
  bestEffortSignUpIsOpen: () => Promise.resolve(signUp.open),
}));

vi.mock('@/services/auth/auth-service.factory', async () => {
  const { MockAuthService } = await import('@/services/auth/mock-auth-service');
  return { createAuthService: () => new MockAuthService() };
});

async function askForACode() {
  await userEvent.type(screen.getByLabelText('Email'), 'someone@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Send code' }));
  await screen.findByLabelText('6-digit code');
}

async function signInWithTheDemoCode() {
  await userEvent.type(screen.getByLabelText('Email'), 'owner@example.com');
  await userEvent.click(screen.getByRole('button', { name: 'Send code' }));
  await userEvent.type(await screen.findByLabelText('6-digit code'), '000000');
}

describe('SignInPage', () => {
  it('names itself in the title', async () => {
    expect((await generateMetadata()).title).toBe('Sign in');
  });

  it('explains an ended session and shows the demo code in demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({ expired: '1' }) }));

    expect(screen.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Your session ended');
    expect(screen.getByRole('button', { name: 'Switch theme' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Language' })).toBeInTheDocument();
  });

  it('names Pyxis once, small, at the start of the header', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole('banner')).toHaveTextContent(/^Pyxis/);
    expect(screen.getByRole('main')).not.toHaveTextContent(/^Pyxis/);
  });

  it('wears the home page header, leading back to it without offering a sign-in', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/',
    );
    expect(within(banner).getByRole('link', { name: 'Live demo' })).toBeInTheDocument();
    expect(within(banner).getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/#never-stored',
    );
    expect(within(banner).queryByRole('link', { name: 'Sign in' })).toBeNull();
  });

  it('draws the brand backdrop behind the page and raises the card', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByTestId('brand-backdrop')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass('[&>section]:shadow-raised');
  });

  it('offers the plans and the live demo to a visitor without an account', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByText(/No account yet\?/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the plans' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/#pricing',
    );
    expect(screen.getByRole('link', { name: 'open the demo' })).toHaveAttribute(
      'href',
      'https://demo.pyxis-analytics.dev/?lang=en',
    );
  });

  it('while the code is awaited, says the e-mail may have no account and leads to the plans', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    signUp.open = false;
    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    await askForACode();

    expect(screen.getByText('Nothing after a few minutes?')).toBeInTheDocument();
    expect(screen.getByText(/may not have a Pyxis account yet/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See the plans' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/#pricing',
    );
    expect(screen.queryByRole('link', { name: 'Try it free for 14 days' })).toBeNull();
    expect(screen.queryByText(/No account yet\?/)).toBeNull();
  });

  it('also offers the free trial while the code is awaited, once sign-up is open', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    signUp.open = true;
    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    await askForACode();

    expect(screen.getByRole('link', { name: 'Try it free for 14 days' })).toHaveAttribute(
      'href',
      'https://app.pyxis-analytics.dev/sign-up',
    );
    signUp.open = false;
  });

  it('says nothing about accounts inside the live demo, where the code is shown', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    await askForACode();

    expect(screen.queryByText('Nothing after a few minutes?')).toBeNull();
  });

  it('does not offer the live demo inside the live demo', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(screen.queryByRole('link', { name: 'open the demo' })).not.toBeInTheDocument();
  });

  it('says nothing about a session when the visitor simply arrives', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('signs in back to the screen the visitor was sent away from', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    router.replace.mockClear();
    renderWithMessages(
      await SignInPage({
        searchParams: Promise.resolve({ next: '/p1/requests?show=failing' }),
      }),
    );

    await signInWithTheDemoCode();

    await vi.waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/p1/requests?show=failing');
    });
  });

  it('signs in to the projects when the return path is not a screen of this site', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    router.replace.mockClear();
    renderWithMessages(
      await SignInPage({ searchParams: Promise.resolve({ next: '//evil.example/p1' }) }),
    );

    await signInWithTheDemoCode();

    await vi.waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });
});
