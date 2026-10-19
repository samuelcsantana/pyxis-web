import { LOCALES, type Locale } from '@/i18n/locales';
import { LANDING_ORIGIN } from './site';

export const LEGAL_DOCUMENT_KINDS = ['terms', 'privacy', 'agreement'] as const;
export const CONTRACT_LANGUAGE: Locale = 'pt-BR';

export type LegalDocumentKind = (typeof LEGAL_DOCUMENT_KINDS)[number];

export interface LegalDocument {
  readonly slug: string;
  readonly kind: LegalDocumentKind;
  readonly locale: Locale;
  readonly path: string;
  readonly file: string;
}

export const TERMS_OF_USE: LegalDocument = {
  slug: 'termos',
  kind: 'terms',
  locale: CONTRACT_LANGUAGE,
  path: '/termos',
  file: 'termos-de-uso.md',
};

export const PRIVACY_POLICY: LegalDocument = {
  slug: 'privacidade',
  kind: 'privacy',
  locale: CONTRACT_LANGUAGE,
  path: '/privacidade',
  file: 'politica-de-privacidade.md',
};

export const DATA_PROCESSING_AGREEMENT: LegalDocument = {
  slug: 'acordo-de-tratamento',
  kind: 'agreement',
  locale: CONTRACT_LANGUAGE,
  path: '/acordo-de-tratamento',
  file: 'acordo-de-tratamento-de-dados.md',
};

type LegalDocumentSet = Readonly<Record<LegalDocumentKind, LegalDocument>>;

const CONTRACT_DOCUMENTS: LegalDocumentSet = {
  terms: TERMS_OF_USE,
  privacy: PRIVACY_POLICY,
  agreement: DATA_PROCESSING_AGREEMENT,
};

const TRANSLATED_NAMES: Readonly<Record<LegalDocumentKind, string>> = {
  terms: 'terms',
  privacy: 'privacy',
  agreement: 'dpa',
};

function translationOf(kind: LegalDocumentKind, locale: Locale, folder: string): LegalDocument {
  const name = TRANSLATED_NAMES[kind];
  return {
    slug: `${folder}-${name}`,
    kind,
    locale,
    path: `/${folder}/${name}`,
    file: `${folder}/${name}.md`,
  };
}

function translationsIn(locale: Locale, folder: string): LegalDocumentSet {
  return {
    terms: translationOf('terms', locale, folder),
    privacy: translationOf('privacy', locale, folder),
    agreement: translationOf('agreement', locale, folder),
  };
}

const LEGAL_DOCUMENT_SETS: Readonly<Record<Locale, LegalDocumentSet>> = {
  'pt-BR': CONTRACT_DOCUMENTS,
  en: translationsIn('en', 'en'),
  es: translationsIn('es', 'es'),
  de: translationsIn('de', 'de'),
  fr: translationsIn('fr', 'fr'),
  it: translationsIn('it', 'it'),
  nl: translationsIn('nl', 'nl'),
};

const CONTRACT_FIRST: readonly Locale[] = [
  CONTRACT_LANGUAGE,
  ...LOCALES.filter((locale) => locale !== CONTRACT_LANGUAGE),
];

export const LEGAL_DOCUMENTS: readonly LegalDocument[] = CONTRACT_FIRST.flatMap((locale) =>
  LEGAL_DOCUMENT_KINDS.map((kind) => LEGAL_DOCUMENT_SETS[locale][kind]),
);

export function legalDocumentsIn(locale: Locale): readonly LegalDocument[] {
  return LEGAL_DOCUMENT_KINDS.map((kind) => LEGAL_DOCUMENT_SETS[locale][kind]);
}

export function legalDocumentOf(kind: LegalDocumentKind, locale: Locale): LegalDocument {
  return LEGAL_DOCUMENT_SETS[locale][kind];
}

export function versionsOf(document: LegalDocument): readonly LegalDocument[] {
  return CONTRACT_FIRST.map((locale) => LEGAL_DOCUMENT_SETS[locale][document.kind]);
}

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
