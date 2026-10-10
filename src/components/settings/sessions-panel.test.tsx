import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AdminSession } from '@/domain/sessions';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { SessionsPanel } from './sessions-panel';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

const SESSIONS: readonly AdminSession[] = [
  {
    id: '5d2f8c1a-6b3e-4a7f-9c0d-1e2f3a4b5c6d',
    browser: 'chrome',
    os: 'windows',
    deviceType: 'desktop',
    createdAt: '2026-10-10T09:00:00.000Z',
    lastUsedAt: '2026-10-10T09:30:00.000Z',
    current: true,
  },
  {
    id: '6e3a9d2b-7c4f-4b8a-8d1e-2f3a4b5c6d7e',
    browser: 'safari',
    os: 'ios',
    deviceType: 'mobile',
    createdAt: '2026-10-08T18:00:00.000Z',
    lastUsedAt: '2026-10-08T18:05:00.000Z',
    current: false,
  },
  {
    id: '7f4b0e3c-8d5a-4c9b-9e2f-3a4b5c6d7e8f',
    browser: null,
    os: null,
    deviceType: null,
    createdAt: '2026-10-04T08:00:00.000Z',
    lastUsedAt: '2026-10-04T08:00:00.000Z',
    current: false,
  },
];

const when = (iso: string) => `at ${iso}`;
const endNothing = () => Promise.resolve();

describe('SessionsPanel', () => {
  it('lists every session with its device, marks this one, and offers to end each', () => {
    renderWithMessages(
      <SessionsPanel sessions={SESSIONS} i18n={english} when={when} end={endNothing} />,
    );

    const panel = screen.getByRole('region', { name: 'Sessions' });
    const rows = within(panel).getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('Chrome on Windows');
    expect(rows[0]).toHaveTextContent('This device');
    expect(rows[0]).toHaveTextContent(/Signed in\s*at 2026-10-10T09:00:00.000Z/);
    expect(rows[0]).toHaveTextContent(/Last used\s*at 2026-10-10T09:30:00.000Z/);
    expect(rows[1]).toHaveTextContent('Safari on iOS');
    expect(rows[1]).not.toHaveTextContent('This device');
    expect(rows[2]).toHaveTextContent('Unknown browser');
    expect(within(panel).getAllByRole('button', { name: 'End' })).toHaveLength(3);
    expect(within(panel).getByRole('button', { name: 'Sign out everywhere' })).toBeInTheDocument();
    expect(panel).toHaveTextContent('Every device where you are signed in');
  });

  it('speaks Portuguese when asked', () => {
    renderWithMessages(
      <SessionsPanel sessions={SESSIONS} i18n={portuguese} when={when} end={endNothing} />,
      'pt-BR',
    );

    const panel = screen.getByRole('region', { name: 'Sessões' });
    expect(panel).toHaveTextContent('Chrome no Windows');
    expect(panel).toHaveTextContent('Este dispositivo');
    expect(panel).toHaveTextContent('Navegador desconhecido');
    expect(within(panel).getAllByRole('button', { name: 'Encerrar' })).toHaveLength(3);
    expect(
      within(panel).getByRole('button', { name: 'Sair de todos os dispositivos' }),
    ).toBeInTheDocument();
  });
});
