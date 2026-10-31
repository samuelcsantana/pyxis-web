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

const REFUND_RULE = /refunded in full/;
const CONFIRMATION = 'Type your e-mail address to confirm';

function toggle(): HTMLElement {
  return screen.getByRole('button', { name: 'Close the account' });
}

function confirmationField(): HTMLElement {
  return screen.getByRole('textbox', { name: CONFIRMATION, hidden: true });
}

async function closeWith(outcome: CloseAccountOutcome, open = true) {
  const close = () => Promise.resolve(outcome);
  const view = renderWithMessages(<CloseAccountSection open={open} close={close} />);
  fireEvent.click(toggle());
  fireEvent.change(screen.getByRole('textbox', { name: CONFIRMATION }), {
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

  it('offers to close the account in a region named by its heading, with what closing means', () => {
    renderWithMessages(<CloseAccountSection open close={() => Promise.resolve(CLOSED)} />);

    const region = screen.getByRole('region', { name: 'Close the account' });
    expect(screen.getByRole('heading', { level: 3, name: 'Close the account' })).toBeVisible();
    expect(region).toHaveTextContent(
      'Cancels the subscription now and revokes the keys of every project',
    );
    expect(region).toContainElement(toggle());
  });

  it('starts folded, with the confirmation hidden behind the toggle it names', () => {
    renderWithMessages(<CloseAccountSection open close={() => Promise.resolve(CLOSED)} />);

    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(confirmationField()).not.toBeVisible();
    expect(screen.getByText(REFUND_RULE)).not.toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Close the account for good', hidden: true }),
    ).not.toBeVisible();
    const controlled = document.getElementById(toggle().getAttribute('aria-controls') ?? '');
    expect(controlled).toContainElement(confirmationField());
  });

  it('unfolds the confirmation in place, and folds it again', () => {
    renderWithMessages(<CloseAccountSection open close={() => Promise.resolve(CLOSED)} />);

    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('textbox', { name: CONFIRMATION })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Close the account for good' })).toBeVisible();

    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');
    expect(confirmationField()).not.toBeVisible();
  });

  it('tells the refund rule on the paid plan once unfolded', () => {
    renderWithMessages(<CloseAccountSection open close={() => Promise.resolve(CLOSED)} />);

    fireEvent.click(toggle());

    expect(screen.getByText(REFUND_RULE)).toBeVisible();
  });

  it('tells a free account what closing revokes, with no refund rule even unfolded', () => {
    renderWithMessages(
      <CloseAccountSection open onFreePlan close={() => Promise.resolve(CLOSED)} />,
    );

    fireEvent.click(toggle());

    expect(screen.getByRole('region', { name: 'Close the account' })).toHaveTextContent(
      'Revokes the keys of every project, so the sites stop sending events.',
    );
    expect(screen.queryByText(/Cancels the subscription now/)).not.toBeInTheDocument();
    expect(screen.queryByText(REFUND_RULE)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: CONFIRMATION })).toBeVisible();
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
    expect(screen.queryByRole('textbox', { hidden: true })).not.toBeInTheDocument();
  });

  it('replaces the toggle and the note with the closed status, under the same heading', async () => {
    await closeWith(CLOSED);

    const region = screen.getByRole('region', { name: 'Close the account' });
    expect(screen.queryByRole('button', { name: 'Close the account' })).not.toBeInTheDocument();
    expect(region).not.toHaveTextContent('Cancels the subscription now');
    expect(region).toContainElement(screen.getByRole('status'));
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
