import Link from 'next/link';
import { ACCOUNT_PAGE } from '@/components/account/account-notice-banner';
import { accountSectionHref } from '@/components/settings-window/sections';
import { NAV_CONTROL, NAV_ITEM_IDLE } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { QUOTA_WARNING_RATIO } from '@/domain/accounts';
import { emailInitial } from '@/domain/admin';
import type { I18n } from '@/i18n/i18n';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { SignOutButton } from './sign-out-button';

export interface AccountMenuProps {
  readonly email: string;
  readonly i18n: I18n;
  readonly usage?: MonthUsage | null;
}

const CHEVRON = 'M6 15l6-6 6 6';
const MENU_ROW = `flex min-h-11 items-center rounded-input px-2.5 text-caption ${NAV_ITEM_IDLE} ${NAV_CONTROL}`;
const FULL_BAR = 1;

function usageTone(usage: MonthUsage): string {
  if (usage.pausedUntil !== null) {
    return 'bg-nav-bad';
  }
  return usage.share >= QUOTA_WARNING_RATIO ? 'bg-nav-warn' : 'bg-accent';
}

function eventsOfTheMonth(usage: MonthUsage, i18n: I18n): string {
  return i18n.t('nav.usage.events', {
    count: i18n.format.count(usage.events),
    limit: i18n.format.count(usage.limit),
  });
}

function spokenUsage(usage: MonthUsage, i18n: I18n): string {
  if (usage.pausedUntil === null) {
    return eventsOfTheMonth(usage, i18n);
  }
  return i18n.t('account.paused', {
    date: i18n.format.day(new Date(usage.pausedUntil)),
    events: i18n.format.count(usage.events),
  });
}

function whenTheCountResumes(usage: MonthUsage, i18n: I18n): string {
  if (usage.pausedUntil === null) {
    return i18n.t('nav.usage.resets', { date: i18n.format.day(new Date(usage.resetsOn)) });
  }
  return i18n.t('account.notice.paused', {
    date: i18n.format.day(new Date(usage.pausedUntil)),
  });
}

interface UsageProps {
  readonly usage: MonthUsage;
  readonly i18n: I18n;
}

function UsageBar({ usage, i18n }: UsageProps) {
  const filled = Math.min(usage.share, FULL_BAR) * 100;
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-[3px] flex-1 overflow-hidden rounded-pill bg-nav-border"
      >
        <span
          className={`block h-full rounded-pill ${usageTone(usage)}`}
          style={{ width: `${String(filled)}%` }}
        />
      </span>
      <span aria-hidden="true" className="shrink-0 text-micro text-nav-text tabular-nums">
        {i18n.t('nav.usage.share', { share: i18n.format.wholePercent(usage.share) })}
      </span>
      <span className="sr-only">{spokenUsage(usage, i18n)}</span>
    </span>
  );
}

function UsageLink({ usage, i18n }: UsageProps) {
  return (
    <Link
      href={ACCOUNT_PAGE}
      scroll={false}
      className={`${MENU_ROW} flex-col items-start justify-center gap-0.5 py-1.5`}
    >
      <span className="text-nav-strong">{eventsOfTheMonth(usage, i18n)}</span>
      <span className="text-micro text-nav-text">{whenTheCountResumes(usage, i18n)}</span>
    </Link>
  );
}

export function AccountMenu({ email, i18n, usage = null }: AccountMenuProps) {
  return (
    <DismissableDetails className="group relative">
      <summary
        className={`flex min-h-11 list-none items-center gap-2 rounded-input px-1 hover:bg-nav-hover active:bg-nav-active ${NAV_CONTROL} [&::-webkit-details-marker]:hidden`}
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-nav-border text-caption font-semibold text-nav-strong"
        >
          {emailInitial(email)}
        </span>
        <span className="sr-only">{i18n.t('nav.account')}</span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-xs wrap-anywhere text-nav-text">{email}</span>
          {usage === null ? null : <UsageBar usage={usage} i18n={i18n} />}
        </span>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="shrink-0 text-nav-muted transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
        >
          <path
            d={CHEVRON}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="absolute right-0 bottom-full left-0 z-10 mb-2 flex flex-col gap-2 rounded-input border border-nav-border bg-nav-raised p-3 shadow-lg lg:max-h-[calc(100dvh-5rem)] lg:scroll-py-1 lg:overflow-y-auto lg:overscroll-contain">
        {usage === null ? null : <UsageLink usage={usage} i18n={i18n} />}
        <Link href={ACCOUNT_PAGE} scroll={false} className={MENU_ROW}>
          {i18n.t('nav.billing')}
        </Link>
        <Link href={accountSectionHref('preferences')} scroll={false} className={MENU_ROW}>
          {i18n.t('preferences.heading')}
        </Link>
        <div className="border-t border-nav-line pt-2">
          <SignOutButton />
        </div>
      </div>
    </DismissableDetails>
  );
}
