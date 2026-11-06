import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateShareLinkOutcome, ShareLink } from '@/domain/share-links';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ShareLinksPanel } from './share-links-panel';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

const NOW = new Date('2026-11-05T12:00:00.000Z');
const FOREVER: ShareLink = {
  id: '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d',
  name: 'Monthly board report',
  createdAt: '2026-10-27T12:00:00.000Z',
  expiresAt: null,
  passwordProtected: false,
};
const OPEN: ShareLink = {
  id: '5e1a7c9d-6f8b-4a0c-9d5e-7f9a1b3c5d6e',
  name: 'Client review',
  createdAt: '2026-11-01T12:00:00.000Z',
  expiresAt: '2026-12-01T12:00:00.000Z',
  passwordProtected: true,
};
const EXPIRED: ShareLink = {
  id: '6f2b8d0e-7a9c-4b1d-8e6f-8a0b2c4d6e7f',
  name: 'Agency pitch',
  createdAt: '2026-09-26T12:00:00.000Z',
  expiresAt: '2026-10-26T12:00:00.000Z',
  passwordProtected: false,
};

const CREATED: CreateShareLinkOutcome = {
  kind: 'created',
  link: {
    id: '7a3c9e1f-8b0d-4c2e-9f7a-9b1c3d5e7f80',
    name: 'Investors',
    createdAt: '2026-11-05T12:00:00.000Z',
    expiresAt: null,
    passwordProtected: false,
    token: `pyxis_sh_${'Q'.repeat(32)}`,
  },
};

function renderPanel(
  links: readonly ShareLink[],
  onPro = true,
  create: () => Promise<CreateShareLinkOutcome> = () => Promise.resolve({ kind: 'limitReached' }),
) {
  return renderWithMessages(
    <ShareLinksPanel
      links={links}
      onPro={onPro}
      create={create}
      setPassword={() => Promise.resolve({ kind: 'gone' })}
      revoke={() => Promise.resolve()}
      timezone="UTC"
      i18n={english}
    />,
  );
}

describe('ShareLinksPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('says what a link opens, offers a new one and lists each with its dates', () => {
    renderPanel([FOREVER, OPEN, EXPIRED]);

    const panel = screen.getByRole('region', { name: 'Public link' });
    expect(panel).toHaveTextContent('It never shows visits, the timeline or requests');
    expect(within(panel).getByRole('textbox', { name: 'Who it is for' })).toBeInTheDocument();
    const [forever, open, expired] = within(panel).getAllByRole('listitem');
    if (expired === undefined) {
      throw new Error('Three rows were expected.');
    }
    expect(forever).toHaveTextContent(
      'Monthly board reportCreated Oct 27, 2026, 12:00 · Never expires',
    );
    expect(open).toHaveTextContent('Expires Dec 1, 2026, 12:00');
    expect(expired).toHaveTextContent('Expired Oct 26, 2026, 12:00');
    expect(within(expired).getByText(/^Expired/)).toHaveClass('text-bad');
    expect(within(panel).getAllByRole('button', { name: 'Revoke' })).toHaveLength(3);
  });

  it('marks the links that ask for a password and offers to set, change or remove one', () => {
    renderPanel([FOREVER, OPEN]);

    const [forever, open] = screen.getAllByRole('listitem');
    if (open === undefined || forever === undefined) {
      throw new Error('Two rows were expected.');
    }
    expect(within(open).getByText('Password')).toBeInTheDocument();
    expect(within(forever).queryByText('Password')).not.toBeInTheDocument();
    expect(within(forever).getByRole('button', { name: 'Set password' })).toBeInTheDocument();
    expect(within(open).getByRole('button', { name: 'Change password' })).toBeInTheDocument();
    expect(within(open).getByRole('button', { name: 'Remove password' })).toBeInTheDocument();
  });

  it('marks a link as protected as soon as its password is saved', async () => {
    renderWithMessages(
      <ShareLinksPanel
        links={[FOREVER, EXPIRED]}
        onPro
        create={() => Promise.resolve({ kind: 'limitReached' })}
        setPassword={(linkId) =>
          Promise.resolve({
            kind: 'changed',
            link: { ...FOREVER, id: linkId, passwordProtected: true },
          })
        }
        revoke={() => Promise.resolve()}
        timezone="UTC"
        i18n={english}
      />,
    );
    const [forever] = screen.getAllByRole('listitem');
    if (forever === undefined) {
      throw new Error('A row was expected.');
    }

    fireEvent.click(within(forever).getByRole('button', { name: 'Set password' }));
    fireEvent.change(within(forever).getByLabelText('New password'), {
      target: { value: 'open sesame' },
    });
    fireEvent.click(within(forever).getByRole('button', { name: 'Save password' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });

    expect(within(forever).getByText('Password')).toBeInTheDocument();
    expect(within(forever).getByRole('button', { name: 'Change password' })).toBeInTheDocument();
  });

  it('says there is none yet', () => {
    renderPanel([]);

    expect(screen.getByText('No public links yet.')).toBeInTheDocument();
  });

  it('offers Pro instead of a new link on Hobby, and still lists and revokes the old ones', () => {
    renderPanel([FOREVER], false);

    expect(screen.queryByRole('textbox', { name: 'Who it is for' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Available on Pro' })).toHaveTextContent('public');
    expect(screen.getByRole('button', { name: 'Revoke' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Set password' })).not.toBeInTheDocument();
  });

  it('adds a new link to the list as soon as it is created', async () => {
    renderPanel([FOREVER], true, () => Promise.resolve(CREATED));

    fireEvent.change(screen.getByRole('textbox', { name: 'Who it is for' }), {
      target: { value: 'Investors' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create link' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });

    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('InvestorsCreated Nov 5, 2026, 12:00 · Never expires');
    expect(rows[1]).not.toHaveTextContent('pyxis_sh_');
  });
});
