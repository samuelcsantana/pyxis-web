import { screen } from '@testing-library/react';
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
  await userEvent.click(await screen.findByRole('button', { name: 'Verify and continue' }));
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
