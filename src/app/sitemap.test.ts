import { describe, expect, it, vi } from 'vitest';
import { DEMO_DOCS, DEMO_STORE } from '@/services/demo/demo-projects';
import sitemap from './sitemap';

const LIVE_DEMO = 'https://demo.pyxis-analytics.dev';
const DEMO_PAGES = [
  'overview',
  'funnel',
  'features',
  'requests',
  'timeline',
  'visits',
  'devices',
  'acquisition',
  'settings',
];

describe('sitemap', () => {
  it('lists every page of every demo project on the live demo address', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual(
      [DEMO_STORE.id, DEMO_DOCS.id].flatMap((projectId) =>
        DEMO_PAGES.map((page) => `${LIVE_DEMO}/${projectId}/${page}`),
      ),
    );
  });

  it('lists nothing for a dashboard with a real API, which stays out of search', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');

    expect(await sitemap()).toEqual([]);
  });
});
