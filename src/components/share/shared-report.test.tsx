import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { forgetSharedCards, SharedReport, type SharedReportProps } from './shared-report';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('range=7d&path=%2Fpricing'),
}));

const TOKEN = `pyxis_sh_${'Q'.repeat(32)}`;
const API = 'https://api.example.com';
const CARD = { project: { name: 'Shop' } };
const REQUESTS = [{ key: 'overview', path: `/v1/shared/${TOKEN}/overview?from=a&to=b` }];

function answering(statuses: Readonly<Record<string, number>> = {}, card: unknown = CARD) {
  return vi.fn((url: string) => {
    const status = statuses[url] ?? 200;
    const body = url.endsWith(TOKEN) ? card : { kpis: url };
    return Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    );
  });
}

function renderReport(overrides: Partial<SharedReportProps> = {}) {
  const props: SharedReportProps = {
    token: TOKEN,
    screen: 'overview',
    apiBase: API,
    requestsAction: vi.fn(() => Promise.resolve(REQUESTS)),
    renderAction: vi.fn((_input, answers) =>
      Promise.resolve(<p>Rendered {JSON.stringify(answers)}</p>),
    ),
    ...overrides,
  };
  return { props, view: renderWithMessages(<SharedReport {...props} />) };
}

describe('SharedReport', () => {
  beforeEach(() => {
    forgetSharedCards();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads the card and the reports from the API in the browser, then shows what the server drew', async () => {
    const fetch = answering();
    vi.stubGlobal('fetch', fetch);
    const { props } = renderReport();

    expect(screen.getByRole('status')).toHaveTextContent('Loading the report…');
    expect(await screen.findByText(/Rendered/)).toHaveTextContent(
      `Rendered {"overview":{"kpis":"${API}${REQUESTS[0]?.path ?? ''}"}}`,
    );
    expect(fetch).toHaveBeenCalledWith(`${API}/v1/shared/${TOKEN}`, {
      credentials: 'omit',
      cache: 'no-store',
    });
    expect(props.requestsAction).toHaveBeenCalledWith({
      token: TOKEN,
      screen: 'overview',
      card: CARD,
      search: { range: '7d', path: '/pricing' },
    });
  });

  it('reads the card of a token once, whatever screen opens next', async () => {
    const fetch = answering();
    vi.stubGlobal('fetch', fetch);

    const first = renderReport();
    await screen.findByText(/Rendered/);
    first.view.unmount();
    renderReport({ screen: 'devices' });
    await screen.findByText(/Rendered/);

    const cardReads = fetch.mock.calls.filter(([url]) => url === `${API}/v1/shared/${TOKEN}`);
    expect(cardReads).toHaveLength(1);
  });

  it.each([
    ['the card', `${API}/v1/shared/${TOKEN}`],
    ['a report', `${API}${REQUESTS[0]?.path ?? ''}`],
  ])('says the link does not open when %s answers 404', async (_, url) => {
    vi.stubGlobal('fetch', answering({ [url]: 404 }));
    renderReport();

    expect(
      await screen.findByRole('heading', { name: 'This link does not open' }),
    ).toBeInTheDocument();
  });

  it('asks to wait a minute after too many requests, then tries again on asking', async () => {
    const fetch = answering({ [`${API}/v1/shared/${TOKEN}`]: 429 });
    vi.stubGlobal('fetch', fetch);
    renderReport();

    expect(await screen.findByRole('alert')).toHaveTextContent('Wait a minute and try again.');
    vi.stubGlobal('fetch', answering());
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText(/Rendered/)).toBeInTheDocument();
  });

  it('says a link with a password cannot open here yet, and asks the server nothing', async () => {
    vi.stubGlobal('fetch', answering({}, { password_required: true }));
    const { props } = renderReport();

    expect(await screen.findByText(/asks for a password/)).toBeInTheDocument();
    expect(props.requestsAction).not.toHaveBeenCalled();
  });

  it('opens a link whose card says it needs no password', async () => {
    const card = { password_required: false, project: { name: 'Shop' } };
    vi.stubGlobal('fetch', answering({}, card));
    const { props } = renderReport();

    expect(await screen.findByText(/Rendered/)).toBeInTheDocument();
    expect(props.requestsAction).toHaveBeenCalledWith(expect.objectContaining({ card }));
  });

  it('says the report could not be loaded when anything else fails', async () => {
    vi.stubGlobal('fetch', answering());
    renderReport({ renderAction: () => Promise.reject(new Error('the server failed')) });

    expect(await screen.findByRole('alert')).toHaveTextContent('The report could not be loaded.');
  });

  it('ignores an answer that arrives after it went away', async () => {
    let finish: (value: readonly []) => void = () => undefined;
    vi.stubGlobal('fetch', answering());
    const renderAction = vi.fn(() => Promise.resolve(<p>Late</p>));
    const { view } = renderReport({
      requestsAction: () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
      renderAction,
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    view.unmount();
    finish([]);

    await waitFor(() => {
      expect(renderAction).toHaveBeenCalled();
    });
    expect(screen.queryByText('Late')).not.toBeInTheDocument();
  });
});
