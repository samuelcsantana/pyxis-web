import { TEXT_LINK } from '@/components/ui/control-classes';
import { BAR_FILL, BAR_TRACK, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import {
  type Account,
  canClose,
  canSubscribeAgain,
  deletionDateOf,
  hasBillingPortal,
  isDeletionHeld,
  needsCheckout,
  quotaPauseExemptUntil,
  quotaShare,
  SUPPORT_EMAIL,
} from '@/domain/accounts';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { type OpenBillingPortal, type OpenCheckout, BillingActions } from './billing-actions';
import type { CloseAccount } from './close-account-form';
import { CloseAccountSection } from './close-account-section';

export interface AccountOverviewProps {
  readonly account: Account;
  readonly i18n: I18n;
  readonly now: Date;
  readonly openCheckout: OpenCheckout;
  readonly openPortal: OpenBillingPortal;
  readonly close: CloseAccount;
}

const NOTE = 'text-xs leading-[18px] text-muted';
const FULL_SHARE = 1;
const PERCENT = 100;
const INTERVAL_LABELS = { month: 'account.monthly', year: 'account.yearly' } as const;

function statusText(account: Account, i18n: I18n): string {
  const day = (iso: string) => i18n.format.dayWithYear(new Date(iso));
  switch (account.status) {
    case 'trialing':
      return account.trialEndsAt === null
        ? i18n.t('account.status.trialingUndated')
        : i18n.t('account.status.trialing', { date: day(account.trialEndsAt) });
    case 'active':
      return account.currentPeriodEndsAt === null
        ? i18n.t('account.status.activeUndated')
        : i18n.t('account.status.active', { date: day(account.currentPeriodEndsAt) });
    case 'past_due':
      return i18n.t('account.status.past_due');
    case 'ending':
      return account.accessEndsAt === null
        ? i18n.t('account.status.endingUndated')
        : i18n.t('account.status.ending', { date: day(account.accessEndsAt) });
    case 'ended':
      return endedText(account, i18n);
    case 'incomplete':
      return i18n.t('account.status.incomplete');
    case 'comped':
      return i18n.t('account.status.comped');
    case 'free':
      return i18n.t('account.status.free', {
        events: i18n.format.count(account.limits.eventsPerMonth),
      });
  }
}

function endedText(account: Account, i18n: I18n): string {
  const day = (iso: string) => i18n.format.dayWithYear(new Date(iso));
  if (isDeletionHeld(account)) {
    return account.accessEndsAt === null
      ? i18n.t('account.status.endedHeldUndated')
      : i18n.t('account.status.endedHeld', { date: day(account.accessEndsAt) });
  }
  return account.accessEndsAt === null
    ? i18n.t('account.status.endedUndated')
    : i18n.t('account.status.ended', {
        date: day(account.accessEndsAt),
        deletion: day(deletionDateOf(account.accessEndsAt)),
      });
}

function Suspension({ account, i18n }: Pick<AccountOverviewProps, 'account' | 'i18n'>) {
  if (account.suspendedAt === null) {
    return null;
  }
  return (
    <div className="flex flex-col gap-1 rounded-input bg-bad-soft px-3 py-2.5 text-sm text-bad">
      <p className="font-medium">
        {i18n.t('account.suspended', {
          date: i18n.format.dayWithYear(new Date(account.suspendedAt)),
        })}
      </p>
      {account.suspensionReason === null ? null : (
        <p>{i18n.t('account.suspensionReason', { reason: account.suspensionReason })}</p>
      )}
      <p>
        {rich(i18n.t('account.contest'), {
          mail: (text) => (
            <a href={`mailto:${SUPPORT_EMAIL}`} className={TEXT_LINK}>
              {text}
            </a>
          ),
        })}
      </p>
    </div>
  );
}

function resubscribeText(account: Account, i18n: I18n): string {
  return account.accessEndsAt === null || isDeletionHeld(account)
    ? i18n.t('account.resubscribeUndated')
    : i18n.t('account.resubscribe', {
        date: i18n.format.dayWithYear(new Date(deletionDateOf(account.accessEndsAt))),
      });
}

function SubscribeAgain({
  account,
  i18n,
  openCheckout,
}: Pick<AccountOverviewProps, 'account' | 'i18n' | 'openCheckout'>) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-3">
      <p className="text-sm">{resubscribeText(account, i18n)}</p>
      <BillingActions kind="resubscribe" open={openCheckout} />
    </div>
  );
}

function UsageMeter({
  account,
  i18n,
  now,
}: Pick<AccountOverviewProps, 'account' | 'i18n' | 'now'>) {
  const share = quotaShare(account);
  const pausedUntil =
    account.ingestionPausedUntil !== null &&
    new Date(account.ingestionPausedUntil).getTime() > now.getTime()
      ? account.ingestionPausedUntil
      : null;
  const exemptUntil = quotaPauseExemptUntil(account, now);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{i18n.t('account.usage')}</h3>
        <span className="text-sm tabular-nums">
          {i18n.t('account.usageCount', {
            count: i18n.format.count(account.eventsThisMonth ?? 0),
            limit: i18n.format.count(account.limits.eventsPerMonth),
          })}
        </span>
      </div>
      <span className={BAR_TRACK} aria-hidden="true">
        <span
          className={`${BAR_FILL} ${share !== null && share >= FULL_SHARE ? 'bg-bad' : 'bg-accent'}`}
          style={{ width: `${String(Math.min(share ?? 0, FULL_SHARE) * PERCENT)}%` }}
        />
      </span>
      <p className={NOTE}>
        {account.measuredAt === null
          ? i18n.t('account.notMeasured')
          : i18n.t('account.measured', {
              date: i18n.format.dayWithYear(new Date(account.measuredAt)),
            })}
      </p>
      {pausedUntil === null ? null : (
        <p className="text-sm font-medium text-bad">
          {i18n.t('account.paused', { date: i18n.format.dayWithYear(new Date(pausedUntil)) })}
        </p>
      )}
      {exemptUntil === null ? null : (
        <p className={NOTE}>
          {i18n.t('account.exempt', { date: i18n.format.dayWithYear(new Date(exemptUntil)) })}
        </p>
      )}
    </div>
  );
}

export function AccountOverview({
  account,
  i18n,
  now,
  openCheckout,
  openPortal,
  close,
}: AccountOverviewProps) {
  return (
    <section aria-labelledby={`account-${account.id}-heading`} className={PANEL}>
      <h2 id={`account-${account.id}-heading`} className={PANEL_TITLE}>
        {account.billingInterval === null
          ? i18n.t('account.plan')
          : i18n.t('account.planWithInterval', {
              interval: i18n.t(INTERVAL_LABELS[account.billingInterval]),
            })}
      </h2>
      <p className="text-sm">{statusText(account, i18n)}</p>
      <Suspension account={account} i18n={i18n} />
      {isDeletionHeld(account) ? (
        <p className="text-sm font-medium">{i18n.t('account.deletionHeld')}</p>
      ) : null}
      <UsageMeter account={account} i18n={i18n} now={now} />
      <p className={NOTE}>
        {i18n.t('account.limits', {
          projects: i18n.format.count(account.limits.projects),
          people: i18n.format.count(account.limits.people),
        })}
      </p>
      {needsCheckout(account) ? <BillingActions kind="checkout" open={openCheckout} /> : null}
      {canSubscribeAgain(account) ? (
        <SubscribeAgain account={account} i18n={i18n} openCheckout={openCheckout} />
      ) : null}
      {hasBillingPortal(account) ? <BillingActions kind="portal" open={openPortal} /> : null}
      <CloseAccountSection open={canClose(account)} close={close} />
    </section>
  );
}
