import { type Account } from '@/domain/accounts';
import {
  afterCancelling,
  type FreePlanExcess,
  type FreePlanRoom,
  freePlanFitDue,
} from '@/domain/free-plan';
import { FREE_PLAN_EVENTS_PER_MONTH, type FreePlanState } from '@/domain/sign-up';
import type { I18n } from '@/i18n/i18n';

export interface WhatToRemoveProps {
  readonly excess: FreePlanExcess;
  readonly room: FreePlanRoom;
  readonly i18n: I18n;
}

const NOTE = 'text-xs leading-[18px]';

export function WhatToRemove({ excess, room, i18n }: WhatToRemoveProps) {
  const { t } = i18n;
  return (
    <>
      <ul className="flex list-disc flex-col gap-0.5 pl-5">
        {excess.projects > 0 ? (
          <li>
            {t('account.fit.projects', {
              count: t('counts.project', { count: excess.projects }),
              limit: t('counts.project', { count: room.projects }),
            })}
          </li>
        ) : null}
        {excess.people > 0 ? (
          <li>
            {t('account.fit.people', {
              count: t('counts.person', { count: excess.people }),
              limit: t('counts.person', { count: room.people }),
            })}
          </li>
        ) : null}
      </ul>
      <p className={NOTE}>{t('account.fit.where')}</p>
    </>
  );
}

export function FreePlanFit({ account, i18n }: { readonly account: Account; readonly i18n: I18n }) {
  const due = freePlanFitDue(account);
  if (due === null) {
    return null;
  }
  return (
    <div className="flex flex-col gap-1.5 rounded-input bg-warn-soft px-3 py-2.5 text-sm text-ink">
      <p className="font-medium">
        {i18n.t('account.fit.dueBy', { date: i18n.format.dayWithYear(new Date(due.dueAt)) })}
      </p>
      <WhatToRemove excess={due.excess} room={due.room} i18n={i18n} />
    </div>
  );
}

export interface AfterCancellingNoteProps {
  readonly account: Account;
  readonly i18n: I18n;
  readonly freePlan: FreePlanState;
  readonly ownsAnotherFreeAccount: boolean;
}

function backToFreePlanText(account: Account, i18n: I18n): string {
  const events = i18n.format.count(FREE_PLAN_EVENTS_PER_MONTH);
  if (account.status !== 'ending') {
    return i18n.t('account.afterCancel.backToFree', { events });
  }
  return account.accessEndsAt === null
    ? i18n.t('account.afterCancel.backToFreeAtTheEnd', { events })
    : i18n.t('account.afterCancel.backToFreeOn', {
        date: i18n.format.dayWithYear(new Date(account.accessEndsAt)),
        events,
      });
}

function endsText(account: Account, i18n: I18n): string {
  if (account.status !== 'ending') {
    return i18n.t('account.afterCancel.ends');
  }
  return account.accessEndsAt === null
    ? i18n.t('account.afterCancel.endsAtTheEnd')
    : i18n.t('account.afterCancel.endsOn', {
        date: i18n.format.dayWithYear(new Date(account.accessEndsAt)),
      });
}

export function AfterCancellingNote({
  account,
  i18n,
  freePlan,
  ownsAnotherFreeAccount,
}: AfterCancellingNoteProps) {
  const after = afterCancelling(account, freePlan, ownsAnotherFreeAccount);
  if (after === null) {
    return null;
  }
  if (after.kind === 'backToFreePlan') {
    return <p className="text-sm">{backToFreePlanText(account, i18n)}</p>;
  }
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <p>{endsText(account, i18n)}</p>
      <WhatToRemove excess={after.excess} room={after.room} i18n={i18n} />
    </div>
  );
}
