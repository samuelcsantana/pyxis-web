import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AccessToken } from '@/domain/access-tokens';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { AccessTokensPanel } from './access-tokens-panel';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

const USED: AccessToken = {
  id: '1a7c3e5f-2b4d-4c6e-8f1a-3b5c7d9e1f2a',
  name: 'Claude Code',
  createdAt: '2026-10-02T12:00:00.000Z',
  lastUsedAt: '2026-10-14T10:00:00.000Z',
  expiresAt: '2026-12-31T12:00:00.000Z',
};

const UNUSED: AccessToken = {
  id: '2b8d4f6a-3c5e-4d7f-9a2b-4c6d8e0f2a3b',
  name: 'Monthly report script',
  createdAt: '2026-10-11T12:00:00.000Z',
  lastUsedAt: null,
  expiresAt: '2026-11-10T12:00:00.000Z',
};

const format = english.format.dateTime('eventTime', 'UTC');

function renderPanel(tokens: readonly AccessToken[]) {
  return renderWithMessages(
    <AccessTokensPanel
      tokens={tokens}
      i18n={english}
      when={(iso) => format(new Date(iso))}
      create={() => Promise.resolve({ kind: 'tooMany' })}
      revoke={() => Promise.resolve()}
    />,
  );
}

describe('AccessTokensPanel', () => {
  it('says what a token can do and lists each one with its dates', () => {
    renderPanel([USED, UNUSED]);

    const panel = screen.getByRole('region', { name: 'Access tokens' });
    expect(panel).toHaveTextContent('A token only reads');
    const rows = within(panel).getAllByRole('listitem');
    const [usedRow, unusedRow] = rows;
    if (usedRow === undefined || unusedRow === undefined) {
      throw new Error('Two rows were expected.');
    }
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Claude Code');
    expect(rows[0]).toHaveTextContent('CreatedOct 2, 2026, 12:00');
    expect(rows[0]).toHaveTextContent('Last usedOct 14, 2026, 10:00');
    expect(rows[0]).toHaveTextContent('ExpiresDec 31, 2026, 12:00');
    expect(rows[1]).toHaveTextContent('Never used');
    expect(within(unusedRow).getByText('Last used')).toHaveClass('sr-only');
    expect(within(usedRow).getByText('Last used')).not.toHaveClass('sr-only');
    expect(within(panel).getByRole('button', { name: 'Create token' })).toBeInTheDocument();
  });

  it('says there is none yet', () => {
    renderPanel([]);

    expect(screen.getByRole('region', { name: 'Access tokens' })).toHaveTextContent(
      'No tokens yet.',
    );
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('offers no new token once ten are live', () => {
    const ten = Array.from({ length: 10 }, (_, index) => ({
      ...UNUSED,
      id: `2b8d4f6a-3c5e-4d7f-9a2b-4c6d8e0f2a${String(index).padStart(2, '0')}`,
    }));

    renderPanel(ten);

    expect(screen.queryByRole('button', { name: 'Create token' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('You have 10 tokens');
  });
});
