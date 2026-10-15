import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CloseAccountOutcome } from '@/domain/accounts';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { CLOSE_ACCOUNT_MIN_BUSY_MS, CloseAccountForm } from './close-account-form';

const navigation = vi.hoisted(() => ({ router: { refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const CLOSED = {
  kind: 'closed',
  accessEndsAt: '2026-11-20T12:00:00.000Z',
  deletionOn: '2026-12-20T12:00:00.000Z',
  refundedAmount: 0,
} as const;

async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(CLOSE_ACCOUNT_MIN_BUSY_MS);
  });
}

function confirm(email: string) {
  fireEvent.change(screen.getByRole('textbox', { name: 'Type your e-mail address to confirm' }), {
    target: { value: email },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Close the account for good' }));
}

describe('CloseAccountForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('closes with the trimmed address and says when everything is deleted', async () => {
    const close = vi.fn<(email: string) => Promise<CloseAccountOutcome>>(() =>
      Promise.resolve(CLOSED),
    );
    renderWithMessages(<CloseAccountForm close={close} />);

    confirm('  owner@example.com ');
    expect(screen.getByRole('button', { name: 'Closing…' })).toBeDisabled();
    await settle();

    expect(close).toHaveBeenCalledWith('owner@example.com');
    expect(screen.getByRole('status')).toHaveTextContent(
      'The account is closed. Everything is deleted on December 20, 2026.',
    );
    expect(screen.getByRole('status')).not.toHaveTextContent('refunded');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('says how much was refunded, in reais', async () => {
    renderWithMessages(
      <CloseAccountForm close={() => Promise.resolve({ ...CLOSED, refundedAmount: 3900 })} />,
    );

    confirm('owner@example.com');
    await settle();

    expect(screen.getByRole('status')).toHaveTextContent('R$39.00 were refunded to your card.');
  });

  it.each([
    ['confirmationMismatch', 'That is not your e-mail address, so nothing was closed.'],
    ['alreadyEnded', 'This account has already ended.'],
    ['unavailable', 'Stripe could not cancel the subscription, so nothing was closed.'],
  ] as const)('explains a %s answer under the field', async (kind, text) => {
    renderWithMessages(<CloseAccountForm close={() => Promise.resolve({ kind })} />);

    confirm('someone@example.com');
    await settle();

    expect(
      screen.getByRole('textbox', { name: 'Type your e-mail address to confirm' }),
    ).toHaveAccessibleDescription(expect.stringContaining(text) as string);
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('says the account was not closed when the call fails, and clears it as the owner types', async () => {
    renderWithMessages(<CloseAccountForm close={() => Promise.reject(new Error('503'))} />);

    confirm('owner@example.com');
    await settle();
    expect(screen.getByRole('alert')).toHaveTextContent('The account was not closed.');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'owner@example.co' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
