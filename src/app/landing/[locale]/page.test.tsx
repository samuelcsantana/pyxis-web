import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FreePlanState } from '@/domain/sign-up';
import { carriedSectionScript } from '@/lib/carried-section';
import { landingBootScript } from '@/lib/landing-boot';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import LandingHome, { generateMetadata } from './page';

vi.mock('@/components/landing/measurement/landing-measurement-boot', () => ({
  LandingMeasurementBoot: ({
    trackingKey,
    endpoint,
  }: {
    trackingKey: string;
    endpoint: string;
  }) => <div data-testid="measurement-boot" data-key={trackingKey} data-endpoint={endpoint} />,
}));

vi.mock('@/components/landing/measurement/measurement-note', () => ({
  MeasurementNote: () => <p data-testid="measurement-note" />,
}));

const signUp = vi.hoisted<{ open: boolean; freePlan: FreePlanState }>(() => ({
  open: false,
  freePlan: 'closed',
}));

vi.mock('@/lib/landing-sign-up', () => ({
  bestEffortOpenSignUp: () =>
    Promise.resolve(
      signUp.open
        ? {
            termsVersion: '1.2',
            termsUrl: 'https://pyxis-analytics.dev/termos',
            freePlan: signUp.freePlan,
          }
        : null,
    ),
}));

const exchange = vi.hoisted(() => ({
  rates: undefined as { readonly BRL: number; readonly USD: number } | undefined,
}));

vi.mock('@/lib/landing-exchange-rates', () => ({
  bestEffortEuroRates: () => Promise.resolve(exchange.rates),
}));

vi.mock('@/lib/request-nonce', () => ({
  requestNonce: () => Promise.resolve('dGVzdC1ub25jZQ=='),
}));

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('not-found');
  },
}));

const atSlug = (locale: string) => ({ params: Promise.resolve({ locale }) });

describe('the home page on the main domain', () => {
  describe('metadata', () => {
    it('gives the English page its own title, address and language alternates', async () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const metadata = await generateMetadata(atSlug('en'));

      expect(metadata.title).toEqual({
        absolute: 'What converts and what fails on your site, without cookies · Pyxis',
      });
      expect(metadata.description).toContain('Product analytics that shows the funnel step');
      expect(metadata.metadataBase?.toString()).toBe('https://pyxis-analytics.dev/');
      expect(metadata.alternates).toEqual({
        canonical: '/',
        languages: {
          en: '/',
          'pt-BR': '/pt-br',
          es: '/es',
          de: '/de',
          fr: '/fr',
          it: '/it',
          nl: '/nl',
          'x-default': '/',
        },
      });
      expect(metadata.openGraph).toMatchObject({
        type: 'website',
        siteName: 'Pyxis',
        url: '/',
        locale: 'en_US',
        alternateLocale: ['pt_BR', 'es_ES', 'de_DE', 'fr_FR', 'it_IT', 'nl_NL'],
      });
      expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
    });

    it('gives the Brazilian Portuguese page its own title and address', async () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const metadata = await generateMetadata(atSlug('pt-br'));

      expect(metadata.title).toEqual({
        absolute: 'O que converte e o que falha no seu site, sem cookie · Pyxis',
      });
      expect(metadata.alternates?.canonical).toBe('/pt-br');
      expect(metadata.openGraph).toMatchObject({
        locale: 'pt_BR',
        alternateLocale: ['en_US', 'es_ES', 'de_DE', 'fr_FR', 'it_IT', 'nl_NL'],
      });
    });

    it('gives the Spanish page its own title and address', async () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const metadata = await generateMetadata(atSlug('es'));

      expect(metadata.title).toEqual({
        absolute: 'Qué convierte y qué falla en tu sitio, sin cookies · Pyxis',
      });
      expect(metadata.alternates?.canonical).toBe('/es');
      expect(metadata.openGraph).toMatchObject({
        locale: 'es_ES',
        alternateLocale: ['en_US', 'pt_BR', 'de_DE', 'fr_FR', 'it_IT', 'nl_NL'],
      });
    });

    it('describes the free plan once it is open, or full', async () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      signUp.open = true;

      for (const freePlan of ['open', 'full'] as const) {
        signUp.freePlan = freePlan;
        const metadata = await generateMetadata(atSlug('en'));

        expect(metadata.description).toMatch(/Free up to 10,000 events a month\.$/);
        expect(metadata.openGraph?.description).toBe(metadata.description);
      }
      signUp.freePlan = 'closed';
      expect((await generateMetadata(atSlug('en'))).description).toMatch(/14 days free\.$/);
      signUp.open = false;
    });

    it('describes nothing for a language it does not ship, or outside demo mode', async () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      await expect(generateMetadata(atSlug('ja'))).resolves.toEqual({});

      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
      await expect(generateMetadata(atSlug('en'))).resolves.toEqual({});
    });
  });

  it('opens in English on the headline, the live demo and the code', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await LandingHome(atSlug('en')));

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Find out what converts and what fails on your site, without collecting personal data.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open the live demo' })).toHaveAttribute(
      'href',
      'https://demo.pyxis-analytics.dev/?lang=en',
    );
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#content',
    );
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1 }));
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Made by Samuel Santana');
    expect(
      screen.getByRole('figure', { name: 'Preview of the Overview screen' }),
    ).toHaveTextContent('My site');
    expect(
      screen
        .getAllByRole('region')
        .map((region) => region.id)
        .filter((id) => id !== ''),
    ).toEqual([
      'for-whom',
      'dashboard',
      'ask-claude',
      'weekly-report',
      'never-stored',
      'install',
      'comparison',
      'pricing',
      'faq',
      'built-in-public',
      'architecture',
      'story',
    ]);
    expect(screen.getByText('Request access')).toBeInTheDocument();
  });

  it('offers the free trial once the API says sign-up is open', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    signUp.open = true;

    renderWithMessages(await LandingHome(atSlug('en')));

    const trials = screen.getAllByRole('link', { name: 'Start your free trial' });
    expect(trials).toHaveLength(3);
    expect(trials[0]).toHaveAttribute('data-track-from', 'hero');
    expect(screen.getByText(/Anyone in Brazil can sign up/)).toBeInTheDocument();
    signUp.open = false;
  });

  it('offers the free plan, beside the paid one, once the API says it is open', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    signUp.open = true;
    signUp.freePlan = 'open';

    renderWithMessages(await LandingHome(atSlug('en')));

    const starts = screen.getAllByRole('link', { name: 'Start free' });
    expect(starts.map((start) => start.getAttribute('data-track-from'))).toEqual([
      'hero',
      'pricing',
    ]);
    expect(
      screen.getByRole('region', {
        name: 'Two plans, in reais, with everything the demo shows on both',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Start your free trial' })).toBeNull();
    signUp.open = false;
    signUp.freePlan = 'closed';
  });

  it('shows the price in reais alone while the exchange rates are unknown', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await LandingHome(atSlug('de')), 'de');

    expect(screen.queryByText(/Preis in Real/)).not.toBeInTheDocument();
  });

  it('adds the price in euros on the German page once the exchange rates are known', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    exchange.rates = { BRL: 5.7197, USD: 1.1253 };

    renderWithMessages(await LandingHome(atSlug('de')), 'de');

    expect(screen.getByText(/^Preis in Real: etwa 7\s€ pro Monat\./)).toBeInTheDocument();
    expect(screen.getByText(/^Preis in Real: etwa 68\s€ pro Jahr\./)).toBeInTheDocument();
    exchange.rates = undefined;
  });

  it('serves the Brazilian Portuguese page, marking it as the current language', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await LandingHome(atSlug('pt-br')), 'pt-BR');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Descubra o que converte e o que falha no seu site, sem coletar dados pessoais.',
    );
    const languages = screen.getByRole('list', { name: 'Idioma' });
    expect(within(languages).getByRole('link', { current: 'page' })).toHaveAttribute(
      'href',
      '/pt-br',
    );
  });

  it('serves the Spanish page, marking it as the current language', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await LandingHome(atSlug('es')), 'es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Descubre qué convierte y qué falla en tu sitio, sin recopilar datos personales.',
    );
    const languages = screen.getByRole('list', { name: 'Idioma' });
    expect(within(languages).getByRole('link', { current: 'page' })).toHaveAttribute('href', '/es');
    expect(screen.getByRole('link', { name: /Leer el artículo/ })).toHaveAttribute(
      'href',
      'https://www.samuelsantana.dev/es/blog/pyxis-analytics-sin-cookies-sin-ip-sin-datos-personales',
    );
  });

  it('measures itself only when a public key is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    vi.stubEnv('NEXT_PUBLIC_LANDING_PYXIS_KEY', '');
    const { unmount } = renderWithMessages(await LandingHome(atSlug('en')));

    expect(screen.queryByTestId('measurement-boot')).toBeNull();
    expect(screen.queryByTestId('measurement-note')).toBeNull();
    unmount();

    vi.stubEnv('NEXT_PUBLIC_LANDING_PYXIS_KEY', 'pyxis_pk_home');
    renderWithMessages(await LandingHome(atSlug('en')));

    expect(screen.getByTestId('measurement-boot')).toHaveAttribute('data-key', 'pyxis_pk_home');
    expect(screen.getByTestId('measurement-boot')).toHaveAttribute(
      'data-endpoint',
      'https://api.pyxis-analytics.dev',
    );
    expect(screen.getByRole('contentinfo')).toContainElement(
      screen.getByTestId('measurement-note'),
    );
  });

  it('tells search engines what the page is, in a structured-data block', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const { container } = renderWithMessages(await LandingHome(atSlug('en')));
    const block = container.querySelector('script[type="application/ld+json"]');

    expect(JSON.parse(block?.textContent ?? '{}')).toMatchObject({
      '@type': 'SoftwareApplication',
      name: 'Pyxis',
      url: 'https://pyxis-analytics.dev/',
    });
  });

  it('fetches the other languages ahead of the click, under the nonce of the response', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const { container } = renderWithMessages(await LandingHome(atSlug('pt-br')));
    const rules = container.querySelector('script[type="speculationrules"]');

    expect(rules).toHaveAttribute('nonce', 'dGVzdC1ub25jZQ==');
    expect(JSON.parse(rules?.textContent ?? '{}')).toEqual({
      prefetch: [{ urls: ['/', '/es', '/de', '/fr', '/it', '/nl'], eagerness: 'immediate' }],
    });
  });

  it('applies the device preferences, then opens on the carried section, before the page is read', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    const { container } = renderWithMessages(await LandingHome(atSlug('es')));
    const [boot, opening] = container.querySelectorAll('script:not([type])');

    expect(boot).toHaveAttribute('nonce', 'dGVzdC1ub25jZQ==');
    expect(boot?.textContent).toBe(landingBootScript());
    expect(opening).toHaveAttribute('nonce', 'dGVzdC1ub25jZQ==');
    expect(opening?.textContent).toBe(carriedSectionScript());
    expect(opening?.compareDocumentPosition(container.querySelector('main') ?? container)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('does not exist for a language it does not ship, or outside demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    await expect(LandingHome(atSlug('ja'))).rejects.toThrow('not-found');

    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    await expect(LandingHome(atSlug('en'))).rejects.toThrow('not-found');
  });
});
