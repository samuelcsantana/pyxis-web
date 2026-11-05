'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { PeriodSelector } from '@/components/shell/period-selector';
import { carriedParameters, screenSearchOf } from '@/components/shell/screen-search';
import { screenLabelKey } from '@/components/shell/screens';
import { PeriodLabel, TopbarFrame } from '@/components/shell/topbar';
import { useProjectToday } from '@/components/shell/use-project-today';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { periodQuery, resolvePeriodOn } from '@/domain/period';
import { SHARED_SCREENS, type SharedScreen, sharedPageHref } from '@/domain/shared-project';
import { createDayFormats } from '@/i18n/day-formats';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';

export interface SharedTopbarProps {
  readonly token: string;
  readonly screen: SharedScreen;
  readonly projectName: string;
  readonly timeZone: string;
  readonly serverNow: number;
}

const TAB = `inline-flex min-h-9 items-center rounded-control px-3 text-sm ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const CURRENT_TAB = 'bg-soft font-semibold text-ink';
const OTHER_TAB = 'text-muted hover:bg-soft hover:text-ink';

export function SharedTopbar({
  token,
  screen,
  projectName,
  timeZone,
  serverNow,
}: SharedTopbarProps) {
  const t = useT();
  const locale = useLocale();
  const search = screenSearchOf(useSearchParams());
  const today = useProjectToday(timeZone, serverNow);
  const formats = useMemo(() => createDayFormats(displayTag(locale)), [locale]);
  const period = resolvePeriodOn(search, today);
  const kept = periodQuery(period);
  return (
    <>
      <nav
        aria-label={t('share.screensLabel')}
        className="flex gap-1 overflow-x-auto border-b border-line bg-card px-4 py-2 sm:px-8"
      >
        {SHARED_SCREENS.map((each) => (
          <Link
            key={each}
            href={`${sharedPageHref(token, each)}?${kept}`}
            aria-current={each === screen ? 'page' : undefined}
            className={`${TAB} ${each === screen ? CURRENT_TAB : OTHER_TAB}`}
          >
            {t(screenLabelKey(each))}
          </Link>
        ))}
      </nav>
      <TopbarFrame
        title={t(screenLabelKey(screen))}
        subtitle={t('share.subtitle', { project: projectName })}
        context={<PeriodLabel period={period} format={formats} />}
        controls={
          <PeriodSelector
            basePath={sharedPageHref(token, screen)}
            period={period}
            today={today}
            keep={carriedParameters(screen, search)}
            t={t}
          />
        }
      />
    </>
  );
}
