import { SUPPORT_EMAIL } from '@/domain/accounts';
import type { I18n } from '@/i18n/i18n';
import type { Seller } from '@/lib/legal-config';

export interface SellerLineProps {
  readonly i18n: I18n;
  readonly seller: Seller;
}

export function SellerLine({ i18n, seller }: SellerLineProps) {
  return (
    <p className="text-caption text-muted">
      {i18n.t('legal.seller', {
        name: seller.name,
        taxId: seller.taxId,
        address: seller.address,
        email: SUPPORT_EMAIL,
      })}
    </p>
  );
}
