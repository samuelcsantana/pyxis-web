import { screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ScreenSearch } from '@/components/shell/screen-search';
import { DEMO_SHARE_TOKEN } from '@/services/share-links/mock-share-links-service';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { demoSharedAnswer } from './demo-shared-answers';
import { sharedScreenRequests, sharedScreenView } from './shared-screens';

const navigation = vi.hoisted(() => ({ search: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/share/x',
  useSearchParams: () => navigation.search,
}));

const NOW = new Date('2026-11-05T15:00:00.000Z');
const SHARE_PATH = `/share/${DEMO_SHARE_TOKEN}`;

function answerOf(path: string): unknown {
  const url = new URL(path, 'https://api.example.com');
  const report = url.pathname.split('/').slice(4);
  return demoSharedAnswer(DEMO_SHARE_TOKEN, report, url.searchParams, english, NOW, null).body;
}

const CARD = answerOf(`/v1/shared/${DEMO_SHARE_TOKEN}`);

const CARD_WITHOUT_GOALS = { ...(CARD as object), goals: [] };

function renderShared(
  screenName: string,
  search: ScreenSearch = { range: '30d' },
  card: unknown = CARD,
) {
  const input = { token: DEMO_SHARE_TOKEN, screen: screenName, card, search };
  const requests = sharedScreenRequests(input, english, NOW);
  const answers = Object.fromEntries(requests.map(({ key, path }) => [key, answerOf(path)]));
  const view = renderWithMessages(<>{sharedScreenView(input, answers, english, NOW)}</>);
  return { requests, view };
}

function linksLeavingTheSharedPage(container: HTMLElement): readonly string[] {
  return [...container.querySelectorAll('a')]
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => !href.startsWith(SHARE_PATH) && !href.startsWith('#'));
}

describe('the shared screens', () => {
  beforeEach(() => {
    navigation.search = new URLSearchParams('range=30d');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['overview', 'Visits', ['overview', 'timeOfDay', 'summary']],
    ['acquisition', 'Paid visits', ['acquisition']],
    ['devices', 'Reach', ['devices']],
    ['features', 'Events', ['features']],
    ['funnel', 'Overall conversion', ['funnel', 'segments']],
  ])(
    'shows the %s from the shared answers, with every link staying on the shared page',
    (name, text, keys) => {
      const { requests, view } = renderShared(name);

      expect(requests.map((request) => request.key)).toEqual(keys);
      expect(
        requests.every((request) => request.path.startsWith(`/v1/shared/${DEMO_SHARE_TOKEN}`)),
      ).toBe(true);
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
      expect(screen.getByRole('navigation', { name: 'Shared reports' })).toBeInTheDocument();
      expect(linksLeavingTheSharedPage(view.container)).toEqual([]);
      expect(screen.queryByText(/Download CSV/)).not.toBeInTheDocument();
    },
  );

  it('offers the row filters on the shared page, never a list of visits', () => {
    const { view } = renderShared('overview');

    const filters = [...view.container.querySelectorAll('a')].filter((link) =>
      (link.getAttribute('href') ?? '').includes('path='),
    );
    expect(filters.length).toBeGreaterThan(0);
    expect(view.container.querySelector('a[href*="/visits"]')).toBeNull();
  });

  it('reads the engagement only with the screens of Features', () => {
    const { requests } = renderShared('features', { range: '30d', kind: 'screens' });

    expect(requests.map((request) => request.key)).toEqual(['features', 'engagement']);
    expect(requests[0]?.path).toContain('kind=screens');
  });

  it('counts the funnel per person without its segments, and never lists who stopped', () => {
    const { requests, view } = renderShared('funnel', { range: '30d', mode: 'user' });

    expect(requests.map((request) => request.key)).toEqual(['funnel']);
    expect(view.container.querySelector('a[href*="outcome"]')).toBeNull();
  });

  it('offers to build a funnel when the address has no steps outside the demo', () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    const { requests } = renderShared('funnel');

    expect(requests).toEqual([]);
    expect(screen.getByRole('button', { name: 'Close the editor' })).toBeInTheDocument();
  });

  it.each(['overview', 'acquisition', 'devices'])(
    'says the %s period is empty, with a wider one or without the filters',
    (name) => {
      renderShared(name, { from: '2020-01-01', to: '2020-01-07' });
      expect(screen.getByRole('link', { name: 'See the last 30 days' })).toHaveAttribute(
        'href',
        expect.stringContaining(SHARE_PATH) as string,
      );
    },
  );

  it('offers to remove the filters when they leave nothing', () => {
    renderShared('acquisition', { from: '2020-01-01', to: '2020-01-07', path: '/nowhere' });

    expect(screen.getByRole('link', { name: 'Remove filters' })).toHaveAttribute(
      'href',
      `${SHARE_PATH}/acquisition?from=2020-01-01&to=2020-01-07`,
    );
  });

  it('refuses a screen that is not shared and a value that is not a share token', () => {
    const shared = { token: DEMO_SHARE_TOKEN, screen: 'visits', card: CARD, search: {} };

    expect(() => sharedScreenRequests(shared, english, NOW)).toThrow(
      'No shared screen is called visits.',
    );
    expect(() =>
      sharedScreenRequests({ ...shared, screen: 'overview', token: 'nope' }, english, NOW),
    ).toThrow('A shared screen needs a share token.');
  });

  it('reads no goals summary and counts no goal for a project without goals', () => {
    const { requests } = renderShared('overview', { range: '30d' }, CARD_WITHOUT_GOALS);
    renderShared('devices', { range: '30d' }, CARD_WITHOUT_GOALS);

    expect(requests.map((request) => request.key)).toEqual(['overview', 'timeOfDay']);
    expect(screen.queryByText('Goals')).not.toBeInTheDocument();
  });

  it('keeps the funnel the address asks for, its mode and its segment', () => {
    const example = renderShared('funnel').requests[0]?.path ?? '';
    const steps = new URL(example, 'https://api.example.com').searchParams.get('steps') ?? '';
    const { requests, view } = renderShared('funnel', {
      range: '30d',
      mode: 'visit',
      steps,
      by: 'channel',
    });

    expect(requests[1]?.path).toContain('by=channel');
    const modeLinks = [...view.container.querySelectorAll('a')]
      .map((link) => link.getAttribute('href') ?? '')
      .filter((href) => href.includes('mode=user'));
    expect(modeLinks[0]).toContain(`steps=${encodeURIComponent(steps)}`);
  });
});
