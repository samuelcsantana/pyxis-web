import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CloseAccountOutcome } from '@/domain/accounts';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { CLOSE_ACCOUNT_MIN_BUSY_MS } from './close-account-form';
import { CloseAccountSection } from './close-account-section';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const CLOSED = {
  kind: 'closed',
  accessEndsAt: '2026-11-20T12:00:00.000Z',
  deletionOn: '2026-12-20T12:00:00.000Z',
  refundedAmount: 0,
} as const;

async function closeWith(outcome: CloseAccountOutcome, open = true) {
  const close = () => Promise.resolve(outcome);
  const view = renderWithMessages(<CloseAccountSection open={open} close={close} />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Type your e-mail address to confirm' }), {
    target: { value: 'owner@example.com' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Close the account for good' }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(CLOSE_ACCOUNT_MIN_BUSY_MS);
  });
  return { view, close };
}

describe('CloseAccountSection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('offers to close the account with what closing means', () => {
    renderWithMessages(<CloseAccountSection open close={() => Promise.resolve(CLOSED)} />);

    expect(screen.getByRole('heading', { name: 'Close the account' })).toBeInTheDocument();
    expect(screen.getByText(/refunded in full/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close the account for good' })).toBeInTheDocument();
  });

  it('shows nothing for an account that cannot be closed', () => {
    const { container } = renderWithMessages(
      <CloseAccountSection open={false} close={() => Promise.resolve(CLOSED)} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('says when everything is deleted, without a refund line when nothing was refunded', async () => {
    await closeWith(CLOSED);

    expect(screen.getByRole('status')).toHaveTextContent(
      'The account is closed. Everything is deleted on December 20, 2026.',
    );
    expect(screen.getByRole('status')).not.toHaveTextContent('refunded');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('says how much was refunded, in reais', async () => {
    await closeWith({ ...CLOSED, refundedAmount: 3900 });

    expect(screen.getByRole('status')).toHaveTextContent('R$39.00 were refunded to your card.');
  });

  it('keeps the confirmation when the refreshed account can no longer be closed', async () => {
    const { view, close } = await closeWith({ ...CLOSED, refundedAmount: 3900 });

    view.rerender(<CloseAccountSection open={false} close={close} />);

    expect(screen.getByRole('status')).toHaveTextContent('The account is closed.');
    expect(screen.getByRole('status')).toHaveTextContent('R$39.00 were refunded to your card.');
  });
});
