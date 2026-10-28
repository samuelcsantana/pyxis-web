import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import LegalDocumentPage, { generateMetadata } from './page';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('not-found');
  },
}));

const atSlug = (document: string) => ({ params: Promise.resolve({ document }) });

function configureSeller() {
  vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
  vi.stubEnv('SELLER_NAME', 'Ana Exemplo');
  vi.stubEnv('SELLER_TAX_ID', '000.000.000-00');
  vi.stubEnv('SELLER_ADDRESS', 'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000');
}

describe('a contract document on the main domain', () => {
  it('names the document and its version, on its own address', async () => {
    configureSeller();

    const metadata = await generateMetadata(atSlug('privacidade'));

    expect(metadata.title).toBe('Política de Privacidade');
    expect(metadata.description).toBe('Política de Privacidade do Pyxis hospedado, versão 1.3.');
    expect(metadata.metadataBase?.toString()).toBe('https://pyxis-analytics.dev/');
    expect(metadata.alternates).toEqual({
      canonical: '/privacidade',
      languages: {
        'pt-BR': 'https://pyxis-analytics.dev/privacidade',
        en: 'https://pyxis-analytics.dev/en/privacy',
        es: 'https://pyxis-analytics.dev/es/privacy',
        de: 'https://pyxis-analytics.dev/de/privacy',
        fr: 'https://pyxis-analytics.dev/fr/privacy',
        it: 'https://pyxis-analytics.dev/it/privacy',
        nl: 'https://pyxis-analytics.dev/nl/privacy',
      },
    });
  });

  it('names a translation in its own language, on its own address', async () => {
    configureSeller();

    const metadata = await generateMetadata(atSlug('fr-terms'));

    expect(metadata.title).toBe('Conditions d’utilisation');
    expect(metadata.alternates?.canonical).toBe('/fr/terms');
  });

  it('shows a translation in its language, deferring to the Portuguese text', async () => {
    configureSeller();
    vi.stubEnv('TERMS_EFFECTIVE_DATE', '2026-10-20');

    renderWithMessages(await LegalDocumentPage(atSlug('de-terms')), 'de');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Nutzungsbedingungen von Pyxis' }),
    ).toBeVisible();
    expect(screen.getByText('Version 1.3, gültig ab 20. Oktober 2026.')).toBeVisible();
    expect(screen.getAllByRole('link', { name: 'Português' })[0]).toHaveAttribute(
      'href',
      '/termos',
    );
    const documents = within(screen.getByRole('navigation', { name: 'Vertragsdokumente' }));
    expect(documents.getByRole('link', { name: 'Datenschutzerklärung' })).toHaveAttribute(
      'href',
      '/de/privacy',
    );
    const versions = within(
      screen.getByRole('navigation', { name: 'Dieses Dokument in anderen Sprachen' }),
    );
    expect(versions.getByRole('link', { name: 'Deutsch' })).toHaveAttribute('aria-current', 'page');
    expect(versions.getByRole('link', { name: 'Português (Brasil)' })).toHaveAttribute(
      'href',
      '/termos',
    );
    expect(versions.getByRole('link', { name: 'Português (Brasil)' })).toHaveAttribute(
      'hreflang',
      'pt-BR',
    );
    expect(screen.getByRole('link', { name: 'Pyxis' })).toHaveAttribute('href', '/de');
  });

  it('shows the terms with the seller filled in and links to the other two documents', async () => {
    configureSeller();
    vi.stubEnv('TERMS_EFFECTIVE_DATE', '2026-10-20');

    renderWithMessages(await LegalDocumentPage(atSlug('termos')), 'pt-BR');

    expect(screen.getByRole('heading', { level: 1, name: 'Termos de Uso do Pyxis' })).toBeVisible();
    expect(
      screen.getByText('Versão 1.3, vigente a partir de 20 de outubro de 2026.'),
    ).toBeVisible();
    expect(screen.getAllByText('Ana Exemplo').length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain('{{');
    const documents = within(screen.getByRole('navigation', { name: 'Documentos do contrato' }));
    expect(documents.getByRole('link', { name: 'Termos de Uso' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(documents.getByRole('link', { name: 'Política de Privacidade' })).toHaveAttribute(
      'href',
      '/privacidade',
    );
    expect(
      documents.getByRole('link', { name: 'Acordo de Tratamento de Dados' }),
    ).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Pyxis' })).toHaveAttribute('href', '/pt-br');
  });

  it('turns each table into a region that scrolls from the keyboard on a small screen', async () => {
    configureSeller();

    renderWithMessages(await LegalDocumentPage(atSlug('acordo-de-tratamento')), 'pt-BR');

    expect(screen.getByRole('region', { name: 'Tabela 1' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('region', { name: 'Tabela 2' })).toBeInTheDocument();
  });

  it('names the tables in the language of a translation', async () => {
    configureSeller();

    renderWithMessages(await LegalDocumentPage(atSlug('nl-dpa')), 'nl');

    expect(screen.getByRole('region', { name: 'Tabel 1' })).toHaveAttribute('tabindex', '0');
  });

  it('does not exist while the seller is missing, for an unknown document, or with an API', async () => {
    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', '');
    await expect(LegalDocumentPage(atSlug('termos'))).rejects.toThrow('not-found');
    await expect(generateMetadata(atSlug('termos'))).resolves.toEqual({});

    configureSeller();
    await expect(LegalDocumentPage(atSlug('cookies'))).rejects.toThrow('not-found');

    vi.stubEnv('NEXT_PUBLIC_PYXIS_API_URL', 'https://api.pyxis.example.com');
    await expect(LegalDocumentPage(atSlug('termos'))).rejects.toThrow('not-found');
  });
});
