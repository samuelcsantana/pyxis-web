import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { END_SESSION_MIN_BUSY_MS, EndSessionButton } from './end-session-button';

const navigation = vi.hoisted(() => ({ router: { replace: vi.fn(), refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const SESSION_ID = '6e3a9d2b-7c4f-4b8a-8d1e-2f3a4b5c6d7e';

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

describe('EndSessionButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ends the session, says so and refreshes the list', async () => {
    const ended: string[] = [];
    const end = (sessionId: string) => {
      ended.push(sessionId);
      return Promise.resolve();
    };
    renderWithMessages(<EndSessionButton sessionId={SESSION_ID} end={end} />);

    fireEvent.click(screen.getByRole('button', { name: 'End' }));

    expect(screen.getByRole('button', { name: 'Ending…' })).toBeDisabled();
    await settle(END_SESSION_MIN_BUSY_MS);
    expect(ended).toEqual([SESSION_ID]);
    expect(screen.getByRole('status')).toHaveTextContent('Session ended');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('keeps the button and says so when ending fails', async () => {
    const end = () => Promise.reject(new Error('Pyxis API answered 503'));
    renderWithMessages(<EndSessionButton sessionId={SESSION_ID} end={end} />);

    fireEvent.click(screen.getByRole('button', { name: 'End' }));
    await settle(END_SESSION_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('The session was not ended');
    expect(screen.getByRole('button', { name: 'End' })).toBeEnabled();
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('does nothing once it is gone', async () => {
    const { unmount } = renderWithMessages(
      <EndSessionButton sessionId={SESSION_ID} end={() => Promise.resolve()} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'End' }));
    unmount();
    await settle(END_SESSION_MIN_BUSY_MS);

    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });
});
