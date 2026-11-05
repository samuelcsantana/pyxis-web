import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { REVOKE_SHARE_LINK_MIN_BUSY_MS, RevokeShareLinkButton } from './revoke-share-link-button';

const navigation = vi.hoisted(() => ({ router: { replace: vi.fn(), refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const LINK_ID = '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d';

async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(REVOKE_SHARE_LINK_MIN_BUSY_MS);
  });
}

function renderButton(revoke: (linkId: string) => Promise<void>) {
  return renderWithMessages(
    <>
      <span id="name">Monthly board report</span>
      <RevokeShareLinkButton
        linkId={LINK_ID}
        name="Monthly board report"
        describedBy="name"
        revoke={revoke}
      />
    </>,
  );
}

describe('RevokeShareLinkButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks first, then revokes the link and says so', async () => {
    const revoke = vi.fn(() => Promise.resolve());
    renderButton(revoke);

    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }));
    expect(revoke).not.toHaveBeenCalled();
    const question = screen.getByRole('group', {
      name: 'Revoke “Monthly board report”? Anyone who has it stops seeing the reports at once.',
    });
    expect(question).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Revoke the link' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Revoke the link' }));
    expect(screen.getByRole('button', { name: 'Revoking…' })).toBeDisabled();
    await settle();

    expect(revoke).toHaveBeenCalledWith(LINK_ID);
    expect(screen.getByRole('status')).toHaveTextContent('Revoked');
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('keeps the link when the owner cancels, focus back on Revoke', () => {
    const revoke = vi.fn(() => Promise.resolve());
    renderButton(revoke);

    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: 'Revoke' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Revoke' })).toHaveAccessibleDescription(
      'Monthly board report',
    );
    expect(revoke).not.toHaveBeenCalled();
  });

  it('says the link was not revoked when the call fails, and lets the owner try again', async () => {
    renderButton(() => Promise.reject(new Error('503')));

    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }));
    fireEvent.click(screen.getByRole('button', { name: 'Revoke the link' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('Could not revoke it. Try again.');
    expect(screen.getByRole('button', { name: 'Revoke the link' })).toBeEnabled();
  });

  it('stops a revoke still running when it goes away', async () => {
    const { unmount } = renderButton(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 5_000);
        }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Revoke' }));
    fireEvent.click(screen.getByRole('button', { name: 'Revoke the link' }));
    unmount();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5_000);
    });

    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });
});
