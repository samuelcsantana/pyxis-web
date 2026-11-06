import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SetShareLinkPasswordOutcome, ShareLink } from '@/domain/share-links';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import {
  SET_SHARE_PASSWORD_MIN_BUSY_MS,
  type SetShareLinkPassword,
  ShareLinkPasswordControl,
} from './share-link-password-control';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh }),
}));

const OPEN: ShareLink = {
  id: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
  name: 'Board',
  createdAt: '2026-11-01T12:00:00.000Z',
  expiresAt: null,
  passwordProtected: false,
};
const PROTECTED: ShareLink = { ...OPEN, passwordProtected: true };

function renderControl(link: ShareLink, setPassword: SetShareLinkPassword) {
  const onChanged = vi.fn();
  renderWithMessages(
    <>
      <span id="link-name">{link.name}</span>
      <ShareLinkPasswordControl
        link={link}
        describedBy="link-name"
        setPassword={setPassword}
        onChanged={onChanged}
      />
    </>,
  );
  return onChanged;
}

async function settle() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(SET_SHARE_PASSWORD_MIN_BUSY_MS);
  });
}

function changedTo(passwordProtected: boolean): SetShareLinkPasswordOutcome {
  return { kind: 'changed', link: { ...OPEN, passwordProtected } };
}

describe('ShareLinkPasswordControl', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    refresh.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('offers to set a password on an open link, described by the link name', () => {
    renderControl(OPEN, vi.fn());

    expect(screen.getByRole('button', { name: 'Set password' })).toHaveAccessibleDescription(
      'Board',
    );
    expect(screen.queryByRole('button', { name: 'Remove password' })).not.toBeInTheDocument();
  });

  it('sets a password exactly as typed, then says it was saved', async () => {
    const setPassword = vi.fn<SetShareLinkPassword>(() => Promise.resolve(changedTo(true)));
    const onChanged = renderControl(OPEN, setPassword);

    fireEvent.click(screen.getByRole('button', { name: 'Set password' }));
    expect(screen.getByLabelText('New password')).toHaveFocus();
    expect(screen.queryByText(/old password/)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: ' open sesame ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save password' }));
    await settle();

    expect(setPassword).toHaveBeenCalledWith(OPEN.id, ' open sesame ');
    expect(onChanged).toHaveBeenCalledWith({ ...OPEN, passwordProtected: true });
    expect(refresh).toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Password saved.');
  });

  it('names the rule before sending a password that is too short or too long', () => {
    const setPassword = vi.fn<SetShareLinkPassword>();
    renderControl(OPEN, setPassword);
    fireEvent.click(screen.getByRole('button', { name: 'Set password' }));

    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save password' }));
    expect(screen.getByRole('alert')).toHaveTextContent('A password has at least 8 characters.');
    expect(screen.getByLabelText('New password')).toHaveFocus();

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'x'.repeat(129) },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save password' }));
    expect(screen.getByRole('alert')).toHaveTextContent('A password has at most 128 characters.');
    expect(setPassword).not.toHaveBeenCalled();
  });

  it('changes the password of a protected link, warning who has to type the new one', async () => {
    const setPassword = vi.fn<SetShareLinkPassword>(() => Promise.resolve(changedTo(true)));
    renderControl(PROTECTED, setPassword);

    fireEvent.click(screen.getByRole('button', { name: 'Change password' }));
    expect(
      screen.getByText('Whoever opened the link with the old password has to type the new one.'),
    ).toBeVisible();
    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'a new secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save password' }));
    await settle();

    expect(setPassword).toHaveBeenCalledWith(PROTECTED.id, 'a new secret');
  });

  it('removes the password only after a confirmation, then says so', async () => {
    const setPassword = vi.fn<SetShareLinkPassword>(() => Promise.resolve(changedTo(false)));
    const onChanged = renderControl(PROTECTED, setPassword);

    fireEvent.click(screen.getByRole('button', { name: 'Remove password' }));
    const question = screen.getByRole('group');
    expect(question).toHaveAccessibleName(
      'Remove the password of “Board”? Anyone with the link opens the reports again without typing anything.',
    );
    const confirm = within(question).getByRole('button', { name: 'Remove password' });
    expect(confirm).toHaveFocus();
    expect(setPassword).not.toHaveBeenCalled();

    fireEvent.click(confirm);
    expect(confirm).toHaveTextContent('Removing…');
    await settle();

    expect(setPassword).toHaveBeenCalledWith(PROTECTED.id, null);
    expect(onChanged).toHaveBeenCalledWith(OPEN);
    expect(screen.getByRole('status')).toHaveTextContent('Password removed.');
  });

  it.each([
    ['Change password', 'editing'],
    ['Remove password', 'confirming'],
  ])('puts the focus back on %s when %s is cancelled', (button) => {
    renderControl(PROTECTED, vi.fn());

    fireEvent.click(screen.getByRole('button', { name: button }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: 'Change password' })).toHaveFocus();
  });

  it.each([
    [{ kind: 'planRequired' } as const, 'Public links need the Pro plan.'],
    [{ kind: 'gone' } as const, 'This link no longer exists. Reload the page.'],
  ])('says why the API refused, keeping the form open', async (outcome, text) => {
    renderControl(OPEN, () => Promise.resolve(outcome));
    fireEvent.click(screen.getByRole('button', { name: 'Set password' }));
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'open sesame' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save password' }));
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent(text);
    expect(screen.getByLabelText('New password')).toHaveValue('open sesame');
  });

  it('says the password was not changed when the request fails', async () => {
    renderControl(PROTECTED, () => Promise.reject(new Error('Pyxis API answered 503')));
    fireEvent.click(screen.getByRole('button', { name: 'Remove password' }));

    fireEvent.click(
      within(screen.getByRole('group')).getByRole('button', { name: 'Remove password' }),
    );
    await settle();

    expect(screen.getByRole('alert')).toHaveTextContent('The password was not changed. Try again.');
  });

  it('opens again without the last notice or failure', async () => {
    renderControl(OPEN, () => Promise.resolve(changedTo(true)));
    fireEvent.click(screen.getByRole('button', { name: 'Set password' }));
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'open sesame' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save password' }));
    await settle();

    fireEvent.click(screen.getByRole('button', { name: 'Set password' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toHaveValue('');
  });
});
