import type { SourceMessages } from '@/i18n/messages';
import type { MessageKey } from '@/i18n/translate';
import type { LegalDocumentSlug } from '@/lib/legal-documents';

export const LEGAL_DOCUMENT_TITLES: Readonly<
  Record<LegalDocumentSlug, MessageKey<SourceMessages>>
> = {
  termos: 'legal.terms',
  privacidade: 'legal.privacy',
  'acordo-de-tratamento': 'legal.agreement',
};
