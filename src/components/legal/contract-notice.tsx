import { LINK_QUIET } from '@/components/landing/landing-classes';
import type { I18n } from '@/i18n/i18n';
import type { Seller } from '@/lib/legal-config';
import { legalDocumentsIn, legalUrlOf } from '@/lib/legal-documents';
import { LEGAL_DOCUMENT_TITLES } from './legal-titles';
import { SellerLine } from './seller-line';

export interface ContractNoticeProps {
  readonly i18n: I18n;
  readonly seller: Seller;
}

export function ContractNotice({ i18n, seller }: ContractNoticeProps) {
  const { t } = i18n;
  return (
    <aside className="flex w-full max-w-[440px] flex-col gap-2 text-center">
      <nav aria-label={t('legal.documentsLabel')}>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-caption">
          {legalDocumentsIn(i18n.locale).map((document) => (
            <li key={document.slug}>
              <a href={legalUrlOf(document)} hrefLang={document.locale} className={LINK_QUIET}>
                {t(LEGAL_DOCUMENT_TITLES[document.kind])}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <SellerLine i18n={i18n} seller={seller} />
    </aside>
  );
}
