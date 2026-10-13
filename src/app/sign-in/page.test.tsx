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

async function signInWithTheDemoCode() {
  await userEvent.type(screen.getByLabelText('Email'), 'owner@demo-store.example');
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
    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();
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

  it('offers the live demo to a visitor without access, in the language being read', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole('link', { name: 'No access? See the live demo, with invented data' }),
    ).toHaveAttribute('href', 'https://demo.pyxis-analytics.dev/?lang=en');
  });

  it('does not offer the live demo inside the live demo', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(screen.queryByRole('link', { name: /See the live demo/ })).not.toBeInTheDocument();
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
