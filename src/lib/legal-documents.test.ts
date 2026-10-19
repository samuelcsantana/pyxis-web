import { describe, expect, it } from 'vitest';
import {
  DATA_PROCESSING_AGREEMENT as AGREEMENT,
  internalLegalPathOf,
  LEGAL_DOCUMENTS,
  legalDocumentAt,
  legalDocumentOf,
  legalDocumentOfInternalPath,
  legalDocumentOfSlug,
  legalDocumentsIn,
  legalUrlOf,
  PRIVACY_POLICY as PRIVACY,
  TERMS_OF_USE as TERMS,
  versionsOf,
} from './legal-documents';

describe('legal documents', () => {
  it('serves the contract first, under Portuguese addresses, then a translation per language', () => {
    expect(LEGAL_DOCUMENTS.map((document) => document.path)).toEqual([
      '/termos',
      '/privacidade',
      '/acordo-de-tratamento',
      '/en/terms',
      '/en/privacy',
      '/en/dpa',
      '/es/terms',
      '/es/privacy',
      '/es/dpa',
      '/de/terms',
      '/de/privacy',
      '/de/dpa',
      '/fr/terms',
      '/fr/privacy',
      '/fr/dpa',
      '/it/terms',
      '/it/privacy',
      '/it/dpa',
      '/nl/terms',
      '/nl/privacy',
      '/nl/dpa',
    ]);
  });

  it('keeps each translation in its language folder, named by its kind', () => {
    expect(legalDocumentOf('agreement', 'de')).toEqual({
      slug: 'de-dpa',
      kind: 'agreement',
      locale: 'de',
      path: '/de/dpa',
      file: 'de/dpa.md',
    });
  });

  it('gives each language its three documents, the contract itself in Portuguese', () => {
    expect(legalDocumentsIn('pt-BR')).toEqual([TERMS, PRIVACY, AGREEMENT]);
    expect(legalDocumentsIn('fr').map((document) => document.path)).toEqual([
      '/fr/terms',
      '/fr/privacy',
      '/fr/dpa',
    ]);
    expect(legalDocumentOf('terms', 'pt-BR')).toBe(TERMS);
  });

  it('lists every language of a document, the binding Portuguese one first', () => {
    expect(versionsOf(legalDocumentOf('privacy', 'it')).map((document) => document.locale)).toEqual(
      ['pt-BR', 'en', 'es', 'de', 'fr', 'it', 'nl'],
    );
    expect(versionsOf(PRIVACY)[0]).toBe(PRIVACY);
  });

  it('finds a document by its public address or its slug, and nothing else', () => {
    expect(legalDocumentAt('/privacidade')).toBe(PRIVACY);
    expect(legalDocumentAt('/nl/terms')).toBe(legalDocumentOf('terms', 'nl'));
    expect(legalDocumentAt('/terms')).toBeUndefined();
    expect(legalDocumentAt('/pt-br/terms')).toBeUndefined();
    expect(legalDocumentOfSlug('acordo-de-tratamento')).toBe(AGREEMENT);
    expect(legalDocumentOfSlug('es-privacy')).toBe(legalDocumentOf('privacy', 'es'));
    expect(legalDocumentOfSlug('cookies')).toBeUndefined();
  });

  it('renders each document from an internal route and maps it back', () => {
    expect(internalLegalPathOf(TERMS)).toBe('/legal/termos');
    expect(internalLegalPathOf(legalDocumentOf('terms', 'en'))).toBe('/legal/en-terms');
    expect(legalDocumentOfInternalPath('/legal/termos')).toBe(TERMS);
    expect(legalDocumentOfInternalPath('/legal/en-terms')).toBe(legalDocumentOf('terms', 'en'));
    expect(legalDocumentOfInternalPath('/legal/cookies')).toBeUndefined();
    expect(legalDocumentOfInternalPath('/legal')).toBeUndefined();
    expect(legalDocumentOfInternalPath('/termos')).toBeUndefined();
  });

  it('links each document on the main domain', () => {
    expect(legalUrlOf(AGREEMENT)).toBe('https://pyxis-analytics.dev/acordo-de-tratamento');
    expect(legalUrlOf(legalDocumentOf('agreement', 'it'))).toBe(
      'https://pyxis-analytics.dev/it/dpa',
    );
  });
});
