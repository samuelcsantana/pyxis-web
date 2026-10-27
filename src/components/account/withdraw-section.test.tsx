import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WithdrawOutcome } from '@/domain/accounts';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { type Withdraw, WITHDRAW_MIN_BUSY_MS, WithdrawSection } from './withdraw-section';

const refresh = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

function section(withdraw: Withdraw, open = true) {
  return renderWithMessages(<WithdrawSection open={open} withdraw={withdraw} />);
}

async function confirmWithdrawal() {
  fireEvent.click(screen.getByRole('button', { name: 'Withdraw from the subscription' }));
  fireEvent.click(screen.getByRole('button', { name: 'Withdraw and get the refund' }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(WITHDRAW_MIN_BUSY_MS);
  });
}

describe('WithdrawSection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('states the rule and asks before withdrawing, focusing the question', () => {
    const withdraw = vi.fn<Withdraw>();
    section(withdraw);

    expect(
      screen.getByText(/^Within 7 days of the first payment you can withdraw/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Withdraw from the subscription' }));

    expect(
      screen.getByText(
        'Withdraw now? The subscription ends at once and the first payment goes back to your card.',
      ),
    ).toHaveFocus();
    expect(withdraw).not.toHaveBeenCalled();
  });

  it('keeps the subscription and gives the focus back to the first button', () => {
    section(vi.fn<Withdraw>());

    fireEvent.click(screen.getByRole('button', { name: 'Withdraw from the subscription' }));
    fireEvent.click(screen.getByRole('button', { name: 'Keep the subscription' }));

    expect(screen.getByRole('button', { name: 'Withdraw from the subscription' })).toHaveFocus();
    expect(
      screen.queryByRole('button', { name: 'Withdraw and get the refund' }),
    ).not.toBeInTheDocument();
  });

  it('withdraws, says the refund, and refreshes the page while keeping the answer', async () => {
    const view = section(() =>
      Promise.resolve<WithdrawOutcome>({ kind: 'withdrawn', refundedAmount: 3_900, fitBy: null }),
    );

    await confirmWithdrawal();
    view.rerender(<WithdrawSection open={false} withdraw={vi.fn<Withdraw>()} />);

    expect(refresh).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent(
      'You withdrew from the subscription. The account is back on the free plan.',
    );
    expect(screen.getByRole('status')).toHaveTextContent('R$39.00 were refunded to your card.');
    expect(
      screen.queryByRole('button', { name: 'Withdraw from the subscription' }),
    ).not.toBeInTheDocument();
  });

  it('says the refund is done by hand when the automatic one failed, and the day to fit by', async () => {
    section(() =>
      Promise.resolve<WithdrawOutcome>({
        kind: 'withdrawn',
        refundedAmount: 0,
        fitBy: '2026-12-20T12:00:00.000Z',
      }),
    );

    await confirmWithdrawal();

    expect(screen.getByRole('status')).toHaveTextContent(
      'The automatic refund did not go through, so Pyxis refunds the first payment by hand.',
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'The account holds more than the free plan: make it fit by December 20, 2026, or it ends that day.',
    );
  });

  it.each([
    [
      'freePlanClosed',
      'The free plan is closed right now, so there is no plan to go back to. To stop the renewal, cancel in Manage billing.',
    ],
    [
      'noPaidSubscription',
      'This account has no paid subscription to withdraw from. Reload the page.',
    ],
    [
      'windowClosed',
      'The 7 days to withdraw are over. To stop the renewal, cancel in Manage billing: the plan runs until the end of the period.',
    ],
    [
      'unavailable',
      'Stripe could not cancel the subscription, so nothing changed. Try again later.',
    ],
  ] as const)('explains the refusal %s', async (kind, text) => {
    section(() => Promise.resolve<WithdrawOutcome>({ kind }));

    await confirmWithdrawal();

    expect(screen.getByRole('alert')).toHaveTextContent(text);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('says the withdrawal did not go through when the call fails, and clears it on keeping', async () => {
    section(() => Promise.reject(new Error('network')));

    await confirmWithdrawal();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'The withdrawal did not go through. Try again.',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Keep the subscription' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows nothing when withdrawing is not offered', () => {
    const { container } = section(vi.fn<Withdraw>(), false);

    expect(container).toBeEmptyDOMElement();
  });
});
