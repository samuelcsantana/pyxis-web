import Link from 'next/link';
import { NEW_PROJECT_PAGE } from '@/components/shell/project-switcher';
import { BUTTON_PRIMARY } from '@/components/ui/control-classes';
import type { AccountLimits } from '@/domain/accounts';
import type { I18n } from '@/i18n/i18n';

export interface FreePlanWelcomeProps {
  readonly limits: AccountLimits;
  readonly i18n: I18n;
}

const PRIMARY_LINK = `flex min-h-11 items-center self-start rounded-input px-4 text-sm ${BUTTON_PRIMARY}`;

export function FreePlanWelcome({ limits, i18n }: FreePlanWelcomeProps) {
  const { t } = i18n;
  return (
    <>
      <p role="status" className="text-sm font-semibold">
        {t('welcome.free')}
      </p>
      <p className="text-sm">
        {t('welcome.freeLimits', {
          events: i18n.format.count(limits.eventsPerMonth),
          projects: t('counts.project', { count: limits.projects }),
          people: t('counts.person', { count: limits.people }),
          pauseAt: i18n.format.count(limits.pauseAtEvents),
        })}
      </p>
      <p className="text-sm">{t('welcome.next')}</p>
      <Link href={NEW_PROJECT_PAGE} className={PRIMARY_LINK}>
        {t('welcome.create')}
      </Link>
    </>
  );
}
