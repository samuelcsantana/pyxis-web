import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProjectExport, RequestExportOutcome } from '@/domain/exports';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { REQUEST_EXPORT_MIN_BUSY_MS, RequestExportButton } from '../settings/request-export-button';
import { ExportView } from './export-view';
import {
  PENDING_REFRESH_LIMIT,
  PENDING_REFRESH_MS,
  RefreshWhilePending,
} from '@/components/ui/refresh-while-pending';

const navigation = vi.hoisted(() => ({ router: { refresh: vi.fn() } }));

vi.mock('next/navigation', () => ({
  useRouter: () => navigation.router,
}));

const NOW = new Date('2026-11-20T12:00:00.000Z');
const PENDING: ProjectExport = {
  id: 'e1',
  status: 'pending',
  requestedAt: '2026-11-20T11:58:00.000Z',
  finishedAt: null,
  eventCount: null,
  availableUntil: null,
  downloadUrl: null,
};
const DONE: ProjectExport = {
  ...PENDING,
  status: 'done',
  finishedAt: '2026-11-20T11:59:00.000Z',
  eventCount: 12_480,
  availableUntil: '2026-11-27T11:59:00.000Z',
  downloadUrl: 'https://s3.example.com/x',
};

async function settle(milliseconds: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

describe('RequestExportButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    [false, 'The file is being prepared.'],
    [true, 'An export of this project is already being prepared.'],
  ])('asks for an export (already waiting: %s) and links to it', async (alreadyWaiting, text) => {
    const request = vi.fn<() => Promise<RequestExportOutcome>>(() =>
      Promise.resolve({ kind: 'requested', export: PENDING, alreadyWaiting }),
    );
    renderWithMessages(<RequestExportButton projectId="p1" request={request} />);

    fireEvent.click(screen.getByRole('button', { name: 'Export events' }));
    expect(screen.getByRole('button', { name: 'Asking…' })).toBeDisabled();
    await settle(REQUEST_EXPORT_MIN_BUSY_MS);

    expect(screen.getByRole('status')).toHaveTextContent(text);
    expect(screen.getByRole('link', { name: 'Open the export' })).toHaveAttribute(
      'href',
      '/p1/exports/e1',
    );
  });

  it.each([
    ['limitReached', 'You asked for 3 exports of this project today'],
    ['unavailable', 'Exports are not available right now.'],
  ] as const)('explains a %s answer', async (kind, text) => {
    renderWithMessages(
      <RequestExportButton projectId="p1" request={() => Promise.resolve({ kind })} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Export events' }));
    await settle(REQUEST_EXPORT_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent(text);
  });

  it('says the export was not asked for when the call fails', async () => {
    renderWithMessages(
      <RequestExportButton projectId="p1" request={() => Promise.reject(new Error('503'))} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Export events' }));
    await settle(REQUEST_EXPORT_MIN_BUSY_MS);

    expect(screen.getByRole('alert')).toHaveTextContent('The export was not asked for.');
  });
});

describe('ExportView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('says the file is being prepared and checks again on its own', async () => {
    render(<ExportView projectId="p1" found={PENDING} i18n={english} now={NOW} />);

    expect(screen.getByRole('status')).toHaveTextContent('Preparing the file…');
    expect(screen.getByText('Asked for on Nov 20, 2026')).toBeInTheDocument();
    await settle(PENDING_REFRESH_MS);
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
  });

  it('offers a fresh download of a finished file, and stops checking', async () => {
    render(<ExportView projectId="p1" found={DONE} i18n={english} now={NOW} />);

    expect(screen.getByText('12,480 events, ready until Nov 27, 2026.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download the file' })).toHaveAttribute(
      'href',
      '/p1/exports/e1/download',
    );
    await settle(PENDING_REFRESH_MS);
    expect(navigation.router.refresh).not.toHaveBeenCalled();
  });

  it('reads an unknown count as none', () => {
    render(
      <ExportView projectId="p1" found={{ ...DONE, eventCount: null }} i18n={english} now={NOW} />,
    );

    expect(screen.getByText(/^0 events/)).toBeInTheDocument();
  });

  it('says a file past its week was deleted, pointing to Settings', () => {
    render(
      <ExportView
        projectId="p1"
        found={{ ...DONE, availableUntil: '2026-11-19T12:00:00.000Z' }}
        i18n={english}
        now={NOW}
      />,
    );

    expect(screen.getByText(/The file was deleted on Nov 19, 2026/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Settings' })).toHaveAttribute(
      'href',
      '/p1/settings/export',
    );
  });

  it('says a finished file without its date is no longer available', () => {
    render(
      <ExportView
        projectId="p1"
        found={{ ...DONE, availableUntil: null }}
        i18n={english}
        now={NOW}
      />,
    );

    expect(screen.getByText(/^The file is no longer available/)).toBeInTheDocument();
  });

  it('says a failed export failed, pointing to Settings', () => {
    render(
      <ExportView
        projectId="p1"
        found={{ ...PENDING, status: 'failed' }}
        i18n={english}
        now={NOW}
      />,
    );

    expect(
      screen.getByText('The export failed. Ask for another one in Settings.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Settings' })).toBeInTheDocument();
  });
});

describe('RefreshWhilePending', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.router.refresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('gives up after its limit, and stops when it goes away', async () => {
    const { unmount } = render(<RefreshWhilePending pending />);

    await settle(PENDING_REFRESH_MS * (PENDING_REFRESH_LIMIT + 2));
    expect(navigation.router.refresh).toHaveBeenCalledTimes(PENDING_REFRESH_LIMIT);

    unmount();
    const second = render(<RefreshWhilePending pending />);
    second.unmount();
    await settle(PENDING_REFRESH_MS * 2);
    expect(navigation.router.refresh).toHaveBeenCalledTimes(PENDING_REFRESH_LIMIT);
  });

  it('waits while a window covers a page that is itself a window address, then goes on', async () => {
    const page = document.createElement('main');
    page.setAttribute('data-window-page', '');
    const window = document.createElement('dialog');
    window.setAttribute('open', '');
    document.body.append(page, window);
    render(<RefreshWhilePending pending />);

    await settle(PENDING_REFRESH_MS * 3);
    expect(navigation.router.refresh).not.toHaveBeenCalled();

    window.remove();
    await settle(PENDING_REFRESH_MS);
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
    page.remove();
  });

  it('refreshes under a window that covers a screen', async () => {
    const window = document.createElement('dialog');
    window.setAttribute('open', '');
    document.body.append(window);
    render(<RefreshWhilePending pending />);

    await settle(PENDING_REFRESH_MS);
    expect(navigation.router.refresh).toHaveBeenCalledOnce();
    window.remove();
  });
});
