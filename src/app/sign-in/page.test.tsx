import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SignInPage from './page';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

describe('SignInPage', () => {
  it('explains an ended session and shows the demo code in demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    render(await SignInPage({ searchParams: Promise.resolve({ expired: '1' }) }));

    expect(screen.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Your session ended');
    expect(screen.getByRole('button', { name: 'Switch theme' })).toBeInTheDocument();
  });

  it('says nothing about a session when the visitor simply arrives', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    render(await SignInPage({ searchParams: Promise.resolve({}) }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
