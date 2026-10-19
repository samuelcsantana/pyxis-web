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
      de: 'https://pyxis-analytics.dev/de',
      fr: 'https://pyxis-analytics.dev/fr',
      it: 'https://pyxis-analytics.dev/it',
      nl: 'https://pyxis-analytics.dev/nl',
      'x-default': 'https://pyxis-analytics.dev/',
    };

    await expect(sitemap()).resolves.toEqual([
      { url: 'https://pyxis-analytics.dev/', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/pt-br', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/es', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/de', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/fr', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/it', alternates: { languages } },
      { url: 'https://pyxis-analytics.dev/nl', alternates: { languages } },
    ]);
  });

  it('adds the contract documents once the seller is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    vi.stubEnv('SELLER_NAME', 'Ana Exemplo');
    vi.stubEnv('SELLER_TAX_ID', '000.000.000-00');
    vi.stubEnv('SELLER_ADDRESS', 'Rua das Flores, 10, Cidade/UF');
    request.host = 'pyxis-analytics.dev';

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls.slice(7)).toEqual([
      'https://pyxis-analytics.dev/termos',
      'https://pyxis-analytics.dev/privacidade',
      'https://pyxis-analytics.dev/acordo-de-tratamento',
    ]);
  });

  it('lists nothing for a dashboard with a real API, which stays out of search', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    request.host = 'pyxis-analytics.dev';

    expect(await sitemap()).toEqual([]);
  });
});
