import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEMO_DOCS, DEMO_STORE } from '@/services/demo/demo-projects';
import sitemap from './sitemap';

const request = vi.hoisted(() => ({ host: 'demo.pyxis-analytics.dev' }));

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Headers({ host: request.host })),
}));

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
  beforeEach(() => {
    request.host = 'demo.pyxis-analytics.dev';
  });

  it('lists every page of every demo project on the live demo address', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual(
      [DEMO_STORE.id, DEMO_DOCS.id].flatMap((projectId) =>
        DEMO_PAGES.map((page) => `${LIVE_DEMO}/${projectId}/${page}`),
      ),
    );
  });

  it('lists the home page in every language on the main domain, each naming the others', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    request.host = 'pyxis-analytics.dev';
    const languages = {
      en: 'https://pyxis-analytics.dev/',
      'pt-BR': 'https://pyxis-analytics.dev/pt-br',
      es: 'https://pyxis-analytics.dev/es',
      'x-default': 'https://pyxis-analytics.dev/',
    };

    await expect(sitemap()).resolves.toEqual([
      { url: 'https://pyxis-analytics.dev/', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/pt-br', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/es', alternates: { languages } },
    ]);
  });

  it('lists nothing for a dashboard with a real API, which stays out of search', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    request.host = 'pyxis-analytics.dev';

    expect(await sitemap()).toEqual([]);
  });
});
