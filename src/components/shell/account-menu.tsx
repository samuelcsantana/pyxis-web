import Link from 'next/link';
import { ACCOUNT_PAGE } from '@/components/account/account-notice-banner';
import { accountSectionHref } from '@/components/settings-window/sections';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { QUOTA_WARNING_RATIO } from '@/domain/accounts';
import { emailInitial } from '@/domain/admin';
import type { I18n } from '@/i18n/i18n';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { HelpMenuRow } from './help-menu-row';
import { MENU_PANEL, MENU_ROW_NOTE, menuRowClasses } from './menu-row-classes';
import { type SignOutLook, SignOutButton } from './sign-out-button';

export interface AccountMenuProps {
  readonly email: string;
  readonly projectId: string;
  readonly i18n: I18n;
  readonly usage?: MonthUsage | null;
}

const FULL_RING = 1;
const RING_LENGTH = 100;
const RING_RADIUS = 20.5;
const RING_CENTER = 22;
const RING_STROKE = 2.5;
const PAUSED_DASHES = '7 3';
const SHIELD = 'M12 3l7 3v5c0 4.4-2.9 8.4-7 10-4.1-1.6-7-5.6-7-10V6l7-3z';

export const ACCOUNT_MENU_SIGN_OUT_LOOK: SignOutLook = {
  frame: 'flex flex-col gap-1',
  button: `w-full gap-2.5 px-2.5 text-sm text-ink hover:bg-line-strong active:bg-line-strong ${FOCUS_RING} ${CONTROL_TRANSITION}`,
  error: 'px-2.5 text-bad',
  withIcon: false,
};

function ringTone(share: number): string {
  return share >= QUOTA_WARNING_RATIO ? 'stroke-usage-warn' : 'stroke-usage-ok';
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

const RING_CIRCLE = {
  cx: RING_CENTER,
  cy: RING_CENTER,
  r: RING_RADIUS,
  fill: 'none',
  strokeWidth: RING_STROKE,
  pathLength: RING_LENGTH,
} as const;

function UsageArc({ usage }: { readonly usage: MonthUsage }) {
  if (usage.pausedUntil !== null) {
    return (
      <circle {...RING_CIRCLE} strokeDasharray={PAUSED_DASHES} className="stroke-usage-paused" />
    );
  }
  const filled = Math.min(usage.share, FULL_RING) * RING_LENGTH;
  if (filled === 0) {
    return null;
  }
  return (
    <circle
      {...RING_CIRCLE}
      strokeLinecap="round"
      strokeDasharray={`${String(filled)} ${String(RING_LENGTH)}`}
      className={ringTone(usage.share)}
    />
  );
}

function UsageRing({ usage }: { readonly usage: MonthUsage }) {
  return (
    <svg
      viewBox="0 0 44 44"
      aria-hidden="true"
      data-usage-ring=""
      className="pointer-events-none absolute inset-0 size-full -rotate-90"
    >
      <circle {...RING_CIRCLE} className="stroke-line" />
      <UsageArc usage={usage} />
    </svg>
  );
}

function PrivacyLine({ text }: { readonly text: string }) {
  return (
    <p className="flex items-center gap-2 px-2.5 pt-1 pb-1.5 text-micro text-muted">
      <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <path
          d={SHIELD}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </svg>
      {text}
    </p>
  );
}

export function AccountMenu({ email, projectId, i18n, usage = null }: AccountMenuProps) {
  return (
    <DismissableDetails className="group relative">
      <summary
        className={`group/avatar relative flex size-11 cursor-pointer list-none items-center justify-center rounded-pill lg:size-10 ${FOCUS_RING} [&::-webkit-details-marker]:hidden`}
      >
        {usage === null ? null : <UsageRing usage={usage} />}
        <span
          aria-hidden="true"
          className={`flex size-8 items-center justify-center rounded-pill bg-ink text-caption font-semibold text-card group-hover:bg-accent group-hover:text-accent-ink group-active/avatar:bg-accent group-active/avatar:text-accent-ink group-open:bg-accent group-open:text-accent-ink ${CONTROL_TRANSITION}`}
        >
          {emailInitial(email)}
        </span>
        <span className="sr-only">{i18n.t('nav.account')}</span>
        {usage === null ? null : <span className="sr-only">{spokenUsage(usage, i18n)}</span>}
      </summary>
      <div className={`${MENU_PANEL} right-0 w-72 max-w-[calc(100vw-2rem)]`}>
        <p className="px-2.5 pt-1 pb-0.5 text-xs wrap-anywhere text-muted">{email}</p>
        <Link href={ACCOUNT_PAGE} scroll={false} className={menuRowClasses(false, 'stacked')}>
          <span>{i18n.t('nav.billing')}</span>
          {usage === null ? null : (
            <>
              <span className={`text-micro ${MENU_ROW_NOTE}`}>{eventsOfTheMonth(usage, i18n)}</span>
              <span className={`text-micro ${MENU_ROW_NOTE}`}>
                {whenTheCountResumes(usage, i18n)}
              </span>
            </>
          )}
        </Link>
        <Link href={accountSectionHref('preferences')} scroll={false} className={menuRowClasses()}>
          {i18n.t('preferences.heading')}
        </Link>
        <HelpMenuRow projectId={projectId} label={i18n.t('nav.help')} />
        <div className="border-t border-line pt-1">
          <SignOutButton variant={ACCOUNT_MENU_SIGN_OUT_LOOK} />
        </div>
        <PrivacyLine text={i18n.t('shell.privacy')} />
      </div>
    </DismissableDetails>
  );
}
