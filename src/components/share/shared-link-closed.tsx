'use client';

import { TEXT_LINK } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { LANDING_ORIGIN } from '@/lib/site';

export function SharedLinkClosed() {
  const t = useT();
  return (
    <section
      aria-labelledby="shared-link-closed-heading"
      className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-16 text-center sm:py-24"
    >
      <h1 id="shared-link-closed-heading" className="text-title font-semibold tracking-tight">
        {t('share.closedTitle')}
      </h1>
      <p className="text-sm text-muted">{t('share.closedBody')}</p>
      <p className="text-sm">
        <a href={LANDING_ORIGIN} className={TEXT_LINK}>
          {t('share.aboutPyxis')}
        </a>
      </p>
    </section>
  );
}
