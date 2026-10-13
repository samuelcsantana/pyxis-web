import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import LandingHome, { generateMetadata } from './page';

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
        absolute: 'Product analytics without cookies or personal data · Pyxis',
      });
      expect(metadata.description).toContain('Open-source product analytics');
      expect(metadata.metadataBase?.toString()).toBe('https://pyxis-analytics.dev/');
      expect(metadata.alternates).toEqual({
        canonical: '/',
        languages: { en: '/', 'pt-BR': '/pt-br', 'x-default': '/' },
      });
      expect(metadata.openGraph).toMatchObject({
        type: 'website',
        siteName: 'Pyxis',
        url: '/',
        locale: 'en_US',
        alternateLocale: ['pt_BR'],
      });
      expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
    });

    it('gives the Brazilian Portuguese page its own title and address', async () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      const metadata = await generateMetadata(atSlug('pt-br'));

      expect(metadata.title).toEqual({
        absolute: 'Análise de produto sem cookie e sem dado pessoal · Pyxis',
      });
      expect(metadata.alternates?.canonical).toBe('/pt-br');
      expect(metadata.openGraph).toMatchObject({ locale: 'pt_BR', alternateLocale: ['en_US'] });
    });

    it('describes nothing for a language it does not ship, or outside demo mode', async () => {
      vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
      await expect(generateMetadata(atSlug('es'))).resolves.toEqual({});

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
        name: 'Product analytics without cookies, IP addresses or personal data.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open the live demo' })).toHaveAttribute(
      'href',
      'https://demo.pyxis-analytics.dev',
    );
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#content',
    );
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1 }));
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Made by Samuel Santana');
  });

  it('serves the Brazilian Portuguese page, marking it as the current language', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');

    renderWithMessages(await LandingHome(atSlug('pt-br')), 'pt-BR');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Análise de uso de produto sem cookie, sem IP e sem dado pessoal.',
    );
    const languages = screen.getByRole('navigation', { name: 'Idioma' });
    expect(within(languages).getByRole('link', { current: 'page' })).toHaveAttribute(
      'href',
      '/pt-br',
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

  it('does not exist for a language it does not ship, or outside demo mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    await expect(LandingHome(atSlug('es'))).rejects.toThrow('not-found');

    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    await expect(LandingHome(atSlug('en'))).rejects.toThrow('not-found');
  });
});
