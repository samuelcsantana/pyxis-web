import type { Locale } from '@/i18n/locales';
import { LANDING_ORIGIN } from './site';

export const LEGAL_DOCUMENT_SLUGS = ['termos', 'privacidade', 'acordo-de-tratamento'] as const;
export const CONTRACT_LANGUAGE: Locale = 'pt-BR';

export type LegalDocumentSlug = (typeof LEGAL_DOCUMENT_SLUGS)[number];

export interface LegalDocument {
  readonly slug: LegalDocumentSlug;
  readonly path: string;
  readonly file: string;
}

export const TERMS_OF_USE: LegalDocument = {
  slug: 'termos',
  path: '/termos',
  file: 'termos-de-uso.md',
};

export const PRIVACY_POLICY: LegalDocument = {
  slug: 'privacidade',
  path: '/privacidade',
  file: 'politica-de-privacidade.md',
};

export const DATA_PROCESSING_AGREEMENT: LegalDocument = {
  slug: 'acordo-de-tratamento',
  path: '/acordo-de-tratamento',
  file: 'acordo-de-tratamento-de-dados.md',
};

export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
  TERMS_OF_USE,
  PRIVACY_POLICY,
  DATA_PROCESSING_AGREEMENT,
];

const INTERNAL_PREFIX = '/legal';

export function legalDocumentAt(path: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((document) => document.path === path);
}

export function legalDocumentOfSlug(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((document) => document.slug === slug);
}

export function internalLegalPathOf(document: LegalDocument): string {
  return `${INTERNAL_PREFIX}/${document.slug}`;
}

export function legalDocumentOfInternalPath(path: string): LegalDocument | undefined {
  const prefix = `${INTERNAL_PREFIX}/`;
  return path.startsWith(prefix) ? legalDocumentOfSlug(path.slice(prefix.length)) : undefined;
}

export function legalUrlOf(document: LegalDocument): string {
  return new URL(document.path, LANDING_ORIGIN).toString();
}
