import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidCodeError, RateLimitedError } from '@/domain/errors';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import {
  CODE_SENT_NOTICE_MS,
  SignInForm,
  signInErrorMessage,
  SMOOTH_LOADING_MS,
} from './sign-in-form';

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => router }));

interface Pending {
  resolve: () => void;
  reject: (error: unknown) => void;
}

function controlledService() {
  const pending: Pending[] = [];
  const calls: { method: string; args: unknown[] }[] = [];
  const next = (method: string, args: unknown[]) => {
    calls.push({ method, args });
    return new Promise<void>((resolve, reject) => {
      pending.push({ resolve, reject });
    });
  };
  const service: IAuthService = {
    requestCode: (...args) => next('requestCode', args),
    verifyCode: (...args) => next('verifyCode', args),
    signOut: (...args) => next('signOut', args),
  };
  return { service, pending, calls };
}

async function settle(milliseconds = 0) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

function typeEmail(value: string) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value } });
}

async function reachCodeStep(service: IAuthService) {
  render(<SignInForm authService={service} />);
  typeEmail('ana@example.com');
  fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
  await settle(SMOOTH_LOADING_MS);
}

describe('SignInForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    router.replace.mockClear();
    router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks for a code for the trimmed email and moves to the code step', async () => {
    const { service, pending, calls } = controlledService();
    render(<SignInForm authService={service} />);

    typeEmail('  ana@example.com ');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(calls).toEqual([{ method: 'requestCode', args: ['ana@example.com'] }]);
    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('6-digit code')).toHaveFocus();
  });

  it('keeps the busy state for a minimum time even when the API answers at once', async () => {
    render(<SignInForm authService={new MockAuthService()} />);
    typeEmail('ana@example.com');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    await settle(SMOOTH_LOADING_MS - 1);
    const busyButton = screen.getByRole('button', { name: 'Verifying…' });

    expect(busyButton).toBeDisabled();
    expect(busyButton).toHaveAttribute('aria-busy', 'true');

    await settle(1);

    expect(screen.getByRole('button', { name: 'Verify and continue' })).toBeEnabled();
  });

  it('shows the sending state while a slow answer is pending', async () => {
    const { service } = controlledService();
    render(<SignInForm authService={service} />);
    typeEmail('ana@example.com');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    await settle(SMOOTH_LOADING_MS * 5);

    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  });

  it('announces the code was sent, then clears the notice', async () => {
    await reachCodeStep(new MockAuthService());

    expect(screen.getByRole('status')).toHaveTextContent('Code sent.');

    await settle(CODE_SENT_NOTICE_MS);

    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('stays on the email step and explains a refused request', async () => {
    const { service, pending } = controlledService();
    render(<SignInForm authService={service} />);
    typeEmail('ana@example.com');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.reject(new RateLimitedError());
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Too many attempts');
    expect(screen.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeInTheDocument();
  });

  it('ties a refused request to the email field, and unties it when it goes', async () => {
    const { service, pending } = controlledService();
    render(<SignInForm authService={service} />);
    typeEmail('ana@example.com');
    const field = screen.getByLabelText('Email');
    expect(field).toHaveAttribute('aria-invalid', 'false');
    expect(field).not.toHaveAttribute('aria-describedby');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.reject(new Error('network down'));
    await settle(SMOOTH_LOADING_MS);

    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('aria-describedby', 'sign-in-email-error');
    expect(field).toHaveAccessibleDescription(/Could not reach Pyxis/);

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));

    expect(field).toHaveAttribute('aria-invalid', 'false');
    expect(field).not.toHaveAttribute('aria-describedby');
  });

  it('keeps only digits in the code and signs in with it', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '12a 3456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify and continue' }));
    pending[1]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(calls[1]).toEqual({ method: 'verifyCode', args: ['ana@example.com', '123456'] });
    expect(router.replace).toHaveBeenCalledWith('/');
    expect(router.refresh).toHaveBeenCalledOnce();
  });

  it('marks the code invalid and explains why', async () => {
    await reachCodeStep(new MockAuthService());

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify and continue' }));
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid or expired code');
    expect(screen.getByLabelText('6-digit code')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('6-digit code')).toHaveAccessibleDescription(
      /Invalid or expired code/,
    );
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('drops "Code sent." as soon as an error shows', async () => {
    await reachCodeStep(new MockAuthService());
    expect(screen.getByRole('status')).toHaveTextContent('Code sent.');

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify and continue' }));
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid or expired code');
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('sends a new code on demand', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Send a new code' }));
    pending[1]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(calls.map((call) => call.method)).toEqual(['requestCode', 'requestCode']);
    expect(screen.getByRole('status')).toHaveTextContent('Code sent.');
  });

  it('goes back to the email step without keeping the error', async () => {
    await reachCodeStep(new MockAuthService());
    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '111111' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify and continue' }));
    await settle(SMOOTH_LOADING_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Use a different email' }));

    expect(screen.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('puts the focus on the email field when going back to change the email', async () => {
    await reachCodeStep(new MockAuthService());
    expect(screen.getByLabelText('6-digit code')).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Use a different email' }));

    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('leaves the focus alone when the page opens', () => {
    render(<SignInForm authService={new MockAuthService()} />);

    expect(screen.getByLabelText('Email')).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });

  it('cancels a pending verification when it unmounts', async () => {
    const { service, pending } = controlledService();
    const { unmount } = render(<SignInForm authService={service} />);
    typeEmail('ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.resolve();
    await settle(SMOOTH_LOADING_MS);
    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Verify and continue' }));

    unmount();
    pending[1]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(router.replace).not.toHaveBeenCalled();
  });

  it('tells a visitor whose session ended why they are here', () => {
    render(<SignInForm authService={new MockAuthService()} sessionExpired />);

    expect(screen.getByRole('status')).toHaveTextContent('Your session ended');
  });

  it('shows the demo code in demo mode, on both steps', async () => {
    render(<SignInForm authService={new MockAuthService()} demoCode="000000" />);
    expect(screen.getByText(/Any email works, then use the code/)).toHaveTextContent(
      'Demo mode: no email is sent. Any email works, then use the code 000000.',
    );

    typeEmail('ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByText('000000')).toBeInTheDocument();
    expect(screen.getByText(/Use the code/)).toHaveTextContent(
      'Demo mode: no email is sent. Use the code 000000.',
    );
  });

  it('shows no demo hint outside demo mode', () => {
    render(<SignInForm authService={new MockAuthService()} />);

    expect(screen.queryByText(/Demo mode/)).not.toBeInTheDocument();
  });

  it('builds its own service when none is given', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    render(<SignInForm />);
    typeEmail('ana@example.com');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
  });
});

describe('signInErrorMessage', () => {
  it.each([
    [new InvalidCodeError(), 'Invalid or expired code'],
    [new RateLimitedError(), 'Too many attempts'],
    [new TypeError('Failed to fetch'), 'Could not reach Pyxis'],
  ])('explains %s', (error, text) => {
    expect(signInErrorMessage(error)).toContain(text);
  });
});
