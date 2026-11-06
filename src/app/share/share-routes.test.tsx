import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { demoSharedAnswer } from '@/lib/demo-shared-answers';
import {
  DEMO_PROTECTED_SHARE_TOKEN,
  DEMO_SHARE_TOKEN,
} from '@/services/share-links/mock-share-links-service';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { forgetSharedCards } from '@/components/share/shared-report';
import SharedScreenPage from './[token]/[screen]/page';
import { renderSharedAction, sharedRequestsAction } from './[token]/actions';
import SharedLinkNotFound from './[token]/not-found';
import SharedOverviewPage, { generateMetadata } from './[token]/page';

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: () => undefined }),
  headers: () => Promise.resolve(new Headers()),
}));

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('not-found');
  },
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => `/share/${DEMO_SHARE_TOKEN}`,
  useSearchParams: () => new URLSearchParams('range=7d'),
}));

const NOW = new Date('2026-11-05T15:00:00.000Z');
const CARD = demoSharedAnswer(DEMO_SHARE_TOKEN, [], new URLSearchParams(), english, NOW, null).body;

function params<Value>(value: Value) {
  return { params: Promise.resolve(value) };
}

describe('the shared page routes', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('keeps every shared page out of search engines, under a title that names no project', async () => {
    await expect(generateMetadata()).resolves.toEqual({
      title: 'Shared report',
      robots: { index: false, follow: false },
    });
  });

  it('opens the overview of a share token, then loads it in the browser', async () => {
    renderWithMessages(await SharedOverviewPage(params({ token: DEMO_SHARE_TOKEN })));

    expect(screen.getByRole('status')).toHaveTextContent('Loading the report…');
    expect(screen.getByRole('link', { name: 'Pyxis' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev',
    );
  });

  it.each([
    ['the protected demo link in the demo', DEMO_PROTECTED_SHARE_TOKEN, '', true],
    ['the open demo link in the demo', DEMO_SHARE_TOKEN, '', false],
    [
      'the protected demo link with an API',
      DEMO_PROTECTED_SHARE_TOKEN,
      'https://api.example.com',
      false,
    ],
  ])('shows the demo password only for %s', async (_, token, api, shown) => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', api);
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json({ password_required: true }))),
    );
    forgetSharedCards();
    renderWithMessages(await SharedOverviewPage(params({ token })));

    await screen.findByRole('heading', { name: 'This report asks for a password' });
    expect(screen.queryByText(/In this demo, the password is/) !== null).toBe(shown);
  });

  it('opens another shared screen at its own address', async () => {
    renderWithMessages(
      await SharedScreenPage(params({ token: DEMO_SHARE_TOKEN, screen: 'devices' })),
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading the report…');
  });

  it.each([
    ['a value that is not a share token', { token: 'not-a-token', screen: 'devices' }],
    ['a screen the link does not share', { token: DEMO_SHARE_TOKEN, screen: 'visits' }],
    ['the overview under a second address', { token: DEMO_SHARE_TOKEN, screen: 'overview' }],
  ])('answers not found to %s, before asking the API anything', async (_, value) => {
    await expect(SharedScreenPage(params(value))).rejects.toThrow('not-found');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('says a closed link does not open, without saying why', async () => {
    renderWithMessages(await SharedLinkNotFound());

    expect(screen.getByRole('heading', { name: 'This link does not open' })).toBeInTheDocument();
    expect(screen.getByText(/revoked or may have expired/)).toBeInTheDocument();
  });
});

describe('the shared screen actions', () => {
  it('plan the reads of a screen and render it from their answers', async () => {
    const input = { token: DEMO_SHARE_TOKEN, screen: 'acquisition', card: CARD, search: {} };

    const requests = await sharedRequestsAction(input);
    const answers = Object.fromEntries(
      requests.map(({ key, path }) => {
        const url = new URL(path, 'https://api.example.com');
        const report = url.pathname.split('/').slice(4);
        return [
          key,
          demoSharedAnswer(DEMO_SHARE_TOKEN, report, url.searchParams, english, new Date(), null)
            .body,
        ];
      }),
    );
    renderWithMessages(<>{await renderSharedAction(input, answers)}</>);

    expect(requests.map((request) => request.key)).toEqual(['acquisition']);
    expect(screen.getByRole('heading', { level: 1, name: 'Acquisition' })).toBeInTheDocument();
  });
});
