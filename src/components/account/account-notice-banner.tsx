import Link from 'next/link';
import type { AccountNotice } from '@/domain/accounts';
import type { I18n } from '@/i18n/i18n';

export interface AccountNoticeBannerProps {
  readonly notice: AccountNotice;
  readonly i18n: I18n;
}

export const ACCOUNT_PAGE = '/account';

function noticeText(notice: AccountNotice, i18n: I18n): string {
  const day = (iso: string) => i18n.format.dayWithYear(new Date(iso));
  switch (notice.kind) {
    case 'suspended':
      return i18n.t('account.notice.suspended');
    case 'paymentFailed':
      return i18n.t('account.notice.paymentFailed');
    case 'ending':
      return i18n.t('account.notice.ending', { date: day(notice.accessEndsAt) });
    case 'ended':
      return i18n.t('account.notice.ended', { date: day(notice.deletionOn) });
    case 'endedHeld':
      return i18n.t('account.notice.endedHeld');
    case 'paused':
      return i18n.t('account.notice.paused', { date: day(notice.until) });
    case 'freePlanPaused':
      return i18n.t('account.notice.freePlanPaused', {
        date: day(notice.until),
        events: i18n.format.count(notice.events),
      });
    case 'nearQuota':
      return i18n.t('account.notice.nearQuota', { share: i18n.format.percent(notice.share) });
  }
}

function linkText(notice: AccountNotice, i18n: I18n): string {
  if (notice.kind === 'suspended') {
    return i18n.t('account.notice.why');
  }
  return notice.kind === 'freePlanPaused'
    ? i18n.t('account.notice.subscribe')
    : i18n.t('account.notice.open');
}

export function AccountNoticeBanner({ notice, i18n }: AccountNoticeBannerProps) {
  const urgent = notice.kind !== 'nearQuota';
  return (
    <aside aria-label={i18n.t('account.title')}>
      <p
        role="note"
        className={`px-4 py-1.5 text-center text-xs font-medium sm:py-2 sm:text-sm ${urgent ? 'bg-bad-soft text-bad' : 'bg-warn-soft text-ink'}`}
      >
        {noticeText(notice, i18n)}{' '}
        <Link
          href={ACCOUNT_PAGE}
          className="font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {linkText(notice, i18n)}
        </Link>
      </p>
    </aside>
  );
}
