import { BAR_FILL, BAR_TRACK, PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import {
  type Account,
  canClose,
  deletionDateOf,
  hasBillingPortal,
  needsCheckout,
  quotaShare,
} from '@/domain/accounts';
import type { I18n } from '@/i18n/i18n';
import { type OpenBillingPortal, type OpenCheckout, BillingActions } from './billing-actions';
import { type CloseAccount, CloseAccountForm } from './close-account-form';

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
      return account.accessEndsAt === null
        ? i18n.t('account.status.endedUndated')
        : i18n.t('account.status.ended', {
            date: day(account.accessEndsAt),
            deletion: day(deletionDateOf(account.accessEndsAt)),
          });
    case 'incomplete':
      return i18n.t('account.status.incomplete');
    case 'comped':
      return i18n.t('account.status.comped');
  }
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
      <UsageMeter account={account} i18n={i18n} now={now} />
      <p className={NOTE}>
        {i18n.t('account.limits', {
          projects: i18n.format.count(account.limits.projects),
          people: i18n.format.count(account.limits.people),
        })}
      </p>
      {needsCheckout(account) ? <BillingActions kind="checkout" open={openCheckout} /> : null}
      {hasBillingPortal(account) ? <BillingActions kind="portal" open={openPortal} /> : null}
      {canClose(account) ? (
        <div className="flex flex-col gap-2 border-t border-line pt-3">
          <h3 className="text-sm font-semibold">{i18n.t('closeAccount.heading')}</h3>
          <p className="text-sm">{i18n.t('closeAccount.note')}</p>
          <p className={NOTE}>{i18n.t('closeAccount.refundNote')}</p>
          <CloseAccountForm close={close} />
        </div>
      ) : null}
    </section>
  );
}
