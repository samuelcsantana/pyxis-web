import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidCodeError, RateLimitedError } from '@/domain/errors';
import type { IAuthService } from '@/services/auth/auth-service.interface';
import { MockAuthService } from '@/services/auth/mock-auth-service';
import { english } from '@/test-utils/english';
import {
  CODE_SENT_NOTICE_MS,
  RESEND_WAIT_MS,
  RESENT_NOTICE_MS,
  SignInForm,
  signInErrorMessage,
  SMOOTH_LOADING_MS,
} from './sign-in-form';
import { renderWithMessages } from '@/test-utils/render-with-messages';

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
    signOutEverywhere: (...args) => next('signOutEverywhere', args),
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
  renderWithMessages(<SignInForm authService={service} />);
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
    renderWithMessages(<SignInForm authService={service} />);

    typeEmail('  ana@example.com ');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(calls).toEqual([{ method: 'requestCode', args: ['ana@example.com', 'en'] }]);
    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('6-digit code')).toHaveFocus();
  });

  it('asks for the code in the language the reader sees the dashboard in', async () => {
    const { service, pending, calls } = controlledService();
    renderWithMessages(<SignInForm authService={service} />, 'pt-BR');

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar código' }));
    pending[0]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(calls).toEqual([{ method: 'requestCode', args: ['ana@example.com', 'pt-BR'] }]);
  });

  it('keeps the busy state for a minimum time even when the API answers at once', async () => {
    renderWithMessages(<SignInForm authService={new MockAuthService()} />);
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
    renderWithMessages(<SignInForm authService={service} />);
    typeEmail('ana@example.com');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    await settle(SMOOTH_LOADING_MS * 5);

    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  });

  it('announces the code was sent, then clears the notice', async () => {
    await reachCodeStep(new MockAuthService());

    expect(screen.getByText('Code sent.')).toHaveAttribute('role', 'status');

    await settle(CODE_SENT_NOTICE_MS);

    expect(screen.queryByText('Code sent.')).not.toBeInTheDocument();
  });

  it('stays on the email step and explains a refused request', async () => {
    const { service, pending } = controlledService();
    renderWithMessages(<SignInForm authService={service} />);
    typeEmail('ana@example.com');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.reject(new RateLimitedError());
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Too many attempts');
    expect(screen.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeInTheDocument();
  });

  it('ties a refused request to the email field, and unties it when it goes', async () => {
    const { service, pending } = controlledService();
    renderWithMessages(<SignInForm authService={service} />);
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

  it('explains a missing email under the field, in the page language, without asking the API', () => {
    const { service, calls } = controlledService();
    renderWithMessages(<SignInForm authService={service} />, 'pt-BR');

    fireEvent.click(screen.getByRole('button', { name: 'Enviar código' }));

    const field = screen.getByLabelText('E-mail');
    expect(screen.getByRole('alert')).toHaveTextContent('Digite o seu e-mail.');
    expect(field).toHaveAccessibleDescription('Digite o seu e-mail.');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveFocus();
    expect(calls).toEqual([]);
  });

  it('explains an email that is not a full address', () => {
    const { service, calls } = controlledService();
    renderWithMessages(<SignInForm authService={service} />);
    typeEmail('ana@example');

    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a full email address, like you@company.com.',
    );
    expect(calls).toEqual([]);
  });

  it('forgets an error as soon as the email changes', async () => {
    const { service, pending } = controlledService();
    renderWithMessages(<SignInForm authService={service} />);
    typeEmail('ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.reject(new RateLimitedError());
    await settle(SMOOTH_LOADING_MS);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    typeEmail('ana@example.org');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
  });

  it('asks for every digit when an incomplete code is submitted', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    const field = screen.getByLabelText('6-digit code');
    fireEvent.change(field, { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Verify and continue' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Enter all 6 digits of the code.');
    expect(field).toHaveAccessibleDescription('Enter all 6 digits of the code.');
    expect(field).toHaveFocus();
    expect(calls.map((call) => call.method)).toEqual(['requestCode']);
  });

  it('forgets an error as soon as the code changes', async () => {
    await reachCodeStep(new MockAuthService());
    const field = screen.getByLabelText('6-digit code');
    fireEvent.change(field, { target: { value: '12' } });
    fireEvent.submit(field);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(field, { target: { value: '123' } });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Code sent.')).toBeInTheDocument();
  });

  it('leaves the checks to itself rather than to the browser', async () => {
    renderWithMessages(<SignInForm authService={new MockAuthService()} />);
    expect(screen.getByRole('button', { name: 'Send code' }).closest('form')).toHaveAttribute(
      'novalidate',
    );

    typeEmail('ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByLabelText('6-digit code').closest('form')).toHaveAttribute('novalidate');
  });

  it('keeps only digits in the code and signs in as soon as the sixth one arrives', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '12a 3456' } });
    pending[1]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(calls[1]).toEqual({ method: 'verifyCode', args: ['ana@example.com', '123456'] });
    expect(router.replace).toHaveBeenCalledWith('/');
    expect(router.refresh).toHaveBeenCalledOnce();
  });

  it('keeps the first six digits of a code pasted with words and numbers around it', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    const field = screen.getByLabelText('6-digit code');

    fireEvent.change(field, { target: { value: 'Code 123456, valid for 10 minutes' } });

    expect(field).toHaveValue('123456');
    expect(calls[1]).toEqual({ method: 'verifyCode', args: ['ana@example.com', '123456'] });
  });

  it('waits for all six digits before verifying', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '12345' } });
    await settle(SMOOTH_LOADING_MS);

    expect(calls.map((call) => call.method)).toEqual(['requestCode']);
    expect(screen.getByRole('button', { name: 'Verify and continue' })).toBeEnabled();
  });

  it('still verifies from the button, so the same code can be tried again', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });
    pending[1]?.reject(new TypeError('Failed to fetch'));
    await settle(SMOOTH_LOADING_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Verify and continue' }));

    expect(calls.map((call) => call.method)).toEqual(['requestCode', 'verifyCode', 'verifyCode']);
    expect(calls[2]?.args).toEqual(['ana@example.com', '123456']);
  });

  it('verifies a code that arrives while the sending state is still on screen', async () => {
    const { service, pending, calls } = controlledService();
    renderWithMessages(<SignInForm authService={service} />);
    typeEmail('ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.resolve();
    await settle();
    expect(screen.getByRole('button', { name: 'Verifying…' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });

    expect(calls[1]).toEqual({ method: 'verifyCode', args: ['ana@example.com', '123456'] });
  });

  it('leaves a pending verification alone while more digits arrive', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    const field = screen.getByLabelText('6-digit code');

    fireEvent.change(field, { target: { value: '123456' } });
    await settle();
    fireEvent.change(field, { target: { value: '654321' } });

    expect(calls.map((call) => call.method)).toEqual(['requestCode', 'verifyCode']);
  });

  it('does not send a code it already verified on its own again', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    const field = screen.getByLabelText('6-digit code');
    fireEvent.change(field, { target: { value: '123456' } });
    pending[1]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    fireEvent.change(field, { target: { value: '1234567' } });

    expect(calls.map((call) => call.method)).toEqual(['requestCode', 'verifyCode']);
  });

  it('selects a refused code, so the next digits typed replace it', async () => {
    await reachCodeStep(new MockAuthService());
    const field = screen.getByLabelText<HTMLInputElement>('6-digit code');

    fireEvent.change(field, { target: { value: '123456' } });
    await settle(SMOOTH_LOADING_MS);

    expect(field).toHaveFocus();
    expect([field.selectionStart, field.selectionEnd]).toEqual([0, 6]);
  });

  it('verifies new digits typed right after a refusal, before the error settles', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    const field = screen.getByLabelText('6-digit code');
    fireEvent.change(field, { target: { value: '123456' } });
    pending[1]?.reject(new InvalidCodeError());
    await settle();

    fireEvent.change(field, { target: { value: '654321' } });

    expect(calls[2]).toEqual({ method: 'verifyCode', args: ['ana@example.com', '654321'] });
  });

  it('verifies a refused code again when it is pasted again', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    const field = screen.getByLabelText('6-digit code');
    fireEvent.change(field, { target: { value: '123456' } });
    pending[1]?.reject(new InvalidCodeError());
    await settle(SMOOTH_LOADING_MS);

    fireEvent.change(field, { target: { value: '' } });
    fireEvent.change(field, { target: { value: '123456' } });

    expect(calls.map((call) => call.method)).toEqual(['requestCode', 'verifyCode', 'verifyCode']);
  });

  it('lets a paste reach the field whole, so spaces in it cost no digit', async () => {
    await reachCodeStep(new MockAuthService());

    expect(screen.getByLabelText('6-digit code')).not.toHaveAttribute('maxlength');
  });

  it('marks the code invalid and explains why', async () => {
    await reachCodeStep(new MockAuthService());

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });
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
    expect(screen.getByText('Code sent.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });
    await settle(SMOOTH_LOADING_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid or expired code');
    expect(screen.queryByText('Code sent.')).not.toBeInTheDocument();
  });

  it('waits 30 seconds before a new code can be asked for, counting them down', async () => {
    await reachCodeStep(new MockAuthService());

    expect(screen.getByRole('button', { name: 'Send a new code in 0:30' })).toBeDisabled();

    await settle(1_000);

    expect(screen.getByRole('button', { name: 'Send a new code in 0:29' })).toBeDisabled();

    await settle(RESEND_WAIT_MS - 1_000);

    expect(screen.getByRole('button', { name: 'Send a new code' })).toBeEnabled();
  });

  it('sends a new code on demand, says only the latest one works, then waits again', async () => {
    const { service, pending, calls } = controlledService();
    await reachCodeStep(service);
    pending[0]?.resolve();
    await settle();
    await settle(RESEND_WAIT_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Send a new code' }));
    pending[1]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(calls.map((call) => call.method)).toEqual(['requestCode', 'requestCode']);
    expect(screen.getByText('New code sent. Only the latest one works.')).toHaveAttribute(
      'role',
      'status',
    );
    expect(screen.queryByText('Code sent.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send a new code in 0:/ })).toBeDisabled();

    await settle(RESENT_NOTICE_MS);

    expect(screen.queryByText('New code sent. Only the latest one works.')).not.toBeInTheDocument();
  });

  it('goes back to the email step without keeping the error', async () => {
    await reachCodeStep(new MockAuthService());
    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '111111' } });
    await settle(SMOOTH_LOADING_MS);

    fireEvent.click(screen.getByRole('button', { name: 'Use a different email' }));

    expect(screen.getByRole('heading', { name: 'Sign in to Pyxis' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue('ana@example.com');
  });

  it('puts the focus on the email field when going back to change the email', async () => {
    await reachCodeStep(new MockAuthService());
    expect(screen.getByLabelText('6-digit code')).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Use a different email' }));

    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('leaves the focus alone when the page opens', () => {
    renderWithMessages(<SignInForm authService={new MockAuthService()} />);

    expect(screen.getByLabelText('Email')).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });

  it('cancels a pending verification when it unmounts', async () => {
    const { service, pending } = controlledService();
    const { unmount } = renderWithMessages(<SignInForm authService={service} />);
    typeEmail('ana@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Send code' }));
    pending[0]?.resolve();
    await settle(SMOOTH_LOADING_MS);
    fireEvent.change(screen.getByLabelText('6-digit code'), { target: { value: '123456' } });

    unmount();
    pending[1]?.resolve();
    await settle(SMOOTH_LOADING_MS);

    expect(router.replace).not.toHaveBeenCalled();
  });

  it('tells a visitor whose session ended why they are here', () => {
    renderWithMessages(<SignInForm authService={new MockAuthService()} sessionExpired />);

    expect(screen.getByRole('status')).toHaveTextContent('Your session ended');
  });

  it('shows the demo code in demo mode, on both steps', async () => {
    renderWithMessages(<SignInForm authService={new MockAuthService()} demoCode="000000" />);
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
    renderWithMessages(<SignInForm authService={new MockAuthService()} />);

    expect(screen.queryByText(/Demo mode/)).not.toBeInTheDocument();
  });

  it('builds its own service when none is given', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    renderWithMessages(<SignInForm />);
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
    expect(signInErrorMessage(error, english.t)).toContain(text);
  });
});
