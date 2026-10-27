import { type Account } from '@/domain/accounts';
import { type FreePlanExcess, type FreePlanRoom, freePlanFitDue } from '@/domain/free-plan';
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
