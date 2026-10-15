import { SUPPORT_EMAIL } from '@/domain/accounts';
import type { IngestionSuspension } from '@/domain/admin';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';

export interface IngestionSuspendedBannerProps {
  readonly suspension: IngestionSuspension;
  readonly i18n: I18n;
}

export function IngestionSuspendedBanner({ suspension, i18n }: IngestionSuspendedBannerProps) {
  return (
    <aside aria-label={i18n.t('projectIngestion.label')}>
      <p
        role="note"
        className="bg-bad-soft px-4 py-1.5 text-center text-xs font-medium text-bad sm:py-2 sm:text-sm"
      >
        {i18n.t('projectIngestion.suspended', {
          date: i18n.format.dayWithYear(new Date(suspension.since)),
        })}
        {suspension.reason === null ? null : (
          <> {i18n.t('projectIngestion.reason', { reason: suspension.reason })}</>
        )}{' '}
        {rich(i18n.t('projectIngestion.contest'), {
          mail: (text) => (
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {text}
            </a>
          ),
        })}
      </p>
    </aside>
  );
}
