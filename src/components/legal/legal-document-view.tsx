import { LANDING_WIDTH, LINK_QUIET } from '@/components/landing/landing-classes';
import type { I18n } from '@/i18n/i18n';
import { LEGAL_DOCUMENTS, type LegalDocument } from '@/lib/legal-documents';
import { LEGAL_DOCUMENT_TITLES } from './legal-titles';

export interface LegalDocumentViewProps {
  readonly i18n: I18n;
  readonly current: LegalDocument;
  readonly html: string;
}

const CURRENT_LINK = 'rounded-control font-semibold text-ink';

export function LegalDocumentView({ i18n, current, html }: LegalDocumentViewProps) {
  const { t } = i18n;
  return (
    <div className={`${LANDING_WIDTH} py-10 lg:py-14`}>
      <nav aria-label={t('legal.documentsLabel')} className="mb-8 border-b border-line pb-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {LEGAL_DOCUMENTS.map((document) => {
            const isCurrent = document.slug === current.slug;
            return (
              <li key={document.slug}>
                <a
                  href={document.path}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={isCurrent ? CURRENT_LINK : LINK_QUIET}
                >
                  {t(LEGAL_DOCUMENT_TITLES[document.slug])}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <article className="legal-text max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
