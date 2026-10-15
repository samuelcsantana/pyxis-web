import { describe, expect, it } from 'vitest';
import {
  DATA_PROCESSING_AGREEMENT as AGREEMENT,
  internalLegalPathOf,
  LEGAL_DOCUMENTS,
  legalDocumentAt,
  legalDocumentOfInternalPath,
  legalDocumentOfSlug,
  legalUrlOf,
  PRIVACY_POLICY as PRIVACY,
  TERMS_OF_USE as TERMS,
} from './legal-documents';

describe('legal documents', () => {
  it('serves the terms, the privacy policy and the agreement under Portuguese addresses', () => {
    expect(LEGAL_DOCUMENTS.map((document) => document.path)).toEqual([
      '/termos',
      '/privacidade',
      '/acordo-de-tratamento',
    ]);
  });

  it('finds a document by its public address or its slug, and nothing else', () => {
    expect(legalDocumentAt('/privacidade')).toBe(PRIVACY);
    expect(legalDocumentAt('/terms')).toBeUndefined();
    expect(legalDocumentOfSlug('acordo-de-tratamento')).toBe(AGREEMENT);
    expect(legalDocumentOfSlug('cookies')).toBeUndefined();
  });

  it('renders each document from an internal route and maps it back', () => {
    expect(internalLegalPathOf(TERMS)).toBe('/legal/termos');
    expect(legalDocumentOfInternalPath('/legal/termos')).toBe(TERMS);
    expect(legalDocumentOfInternalPath('/legal/cookies')).toBeUndefined();
    expect(legalDocumentOfInternalPath('/legal')).toBeUndefined();
    expect(legalDocumentOfInternalPath('/termos')).toBeUndefined();
  });

  it('links each document on the main domain', () => {
    expect(legalUrlOf(AGREEMENT)).toBe('https://pyxis-analytics.dev/acordo-de-tratamento');
  });
});
