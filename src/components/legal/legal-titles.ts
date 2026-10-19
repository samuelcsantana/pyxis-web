import type { SourceMessages } from '@/i18n/messages';
import type { MessageKey } from '@/i18n/translate';
import type { LegalDocumentKind } from '@/lib/legal-documents';

export const LEGAL_DOCUMENT_TITLES: Readonly<
  Record<LegalDocumentKind, MessageKey<SourceMessages>>
> = {
  terms: 'legal.terms',
  privacy: 'legal.privacy',
  agreement: 'legal.agreement',
};
