import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  REVOKE_ACCESS_TOKEN_MIN_BUSY_MS,
  RevokeAccessTokenButton,
} from './revoke-access-token-button';

const navigation = vi.hoisted(() => ({ router: { replace: vi.fn(), refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const TOKEN_ID = '1a7c3e5f-2b4d-4c6e-8f1a-3b5c7d9e1f2a';
const NAME_ID = 'token-name';

function renderButton(revoke: (tokenId: string) => Promise<void>) {
  return renderWithMessages(
    <>
      <span id={NAME_ID}>Claude Code</span>
      <RevokeAccessTokenButton tokenId={TOKEN_ID} describedBy={NAME_ID} revoke={revoke} />
    </>,
  );
}

function revokeButton() {
  return screen.getByRole('button', { description: 'Claude Code' });
}

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

describe('RevokeAccessTokenButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('names the token it revokes, revokes it, says so and refreshes the list', async () => {
    const revoked: string[] = [];
    const revoke = (tokenId: string) => {
      revoked.push(tokenId);
      return Promise.resolve();
    };
    renderButton(revoke);

    fireEvent.click(screen.getByRole('button', { name: 'Revoke', description: 'Claude Code' }));

    expect(revokeButton()).toHaveAccessibleName('Revoking…');
    expect(revokeButton()).toBeDisabled();
    await settle(REVOKE_ACCESS_TOKEN_MIN_BUSY_MS);
    expect(revoked).toEqual([TOKEN_ID]);
    expect(screen.getByRole('status')).toHaveTextContent('Token revoked');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('keeps the button and says so when revoking fails', async () => {
    const revoke = () => Promise.reject(new Error('Pyxis API answered 503'));
    renderButton(revoke);

    fireEvent.click(revokeButton());
    await settle(REVOKE_ACCESS_TOKEN_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('The token was not revoked');
    expect(
      screen.getByRole('button', { name: 'Revoke', description: 'Claude Code' }),
    ).toBeEnabled();
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('does nothing once it is gone', async () => {
    const { unmount } = renderButton(() => Promise.resolve());

    fireEvent.click(revokeButton());
    unmount();
    await settle(REVOKE_ACCESS_TOKEN_MIN_BUSY_MS);

    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });
});
