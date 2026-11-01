'use client';

import { useSearchParams } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';
import { resolvePeriodOn } from '@/domain/period';
import { createDayFormats } from '@/i18n/day-formats';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';
import { ActiveVisits } from './active-visits';
import { PeriodSelector, periodLabelOf } from './period-selector';
import { InPhoneBar, usePhoneBarHost } from './phone-bar-slots';
import { carriedParameters, screenSearchOf } from './screen-search';
import type { ScreenTopbarTexts } from './screen-topbar-texts';
import { SCREENS_WITHOUT_PERIOD, screenHref, screenLabelKey } from './screens';
import { RangeNotice, TopbarFrame } from './topbar';
import { useScreenOnView } from './use-screen-on-view';
import { useProjectToday } from './use-project-today';

export interface ScreenTopbarProps {
  readonly projectId: string;
  readonly timeZone: string;
  readonly serverNow: number;
  readonly texts: ScreenTopbarTexts;
  readonly children?: ReactNode;
}

export function ScreenTopbar({
  projectId,
  timeZone,
  serverNow,
  texts,
  children,
}: ScreenTopbarProps) {
  const screen = useScreenOnView();
  const search = screenSearchOf(useSearchParams());
  const today = useProjectToday(timeZone, serverNow);
  const t = useT();
  const locale = useLocale();
  const formats = useMemo(() => createDayFormats(displayTag(locale)), [locale]);
  const periodInSheet = usePhoneBarHost('period') !== null;
  const filtersInSheet = usePhoneBarHost('filters') !== null;
  if (screen === undefined) {
    return null;
  }
  const title = t(screenLabelKey(screen));
  if (SCREENS_WITHOUT_PERIOD.has(screen)) {
    return (
      <TopbarFrame title={title} controls={null}>
        {children}
      </TopbarFrame>
    );
  }
  const period = resolvePeriodOn(search, today);
  const showsVisitsNow = period.to >= today;
  const periodSelector = (
    <PeriodSelector
      basePath={screenHref(projectId, screen)}
      period={period}
      today={today}
      keep={carriedParameters(screen, search)}
      format={formats}
      t={t}
    />
  );
  return (
    <>
      <TopbarFrame
        title={title}
        besideTitle={showsVisitsNow ? <ActiveVisits /> : undefined}
        notice={
          period.rejected === undefined ? undefined : (
            <RangeNotice text={texts.rangeNotices[period.rejected.problem]} />
          )
        }
        controls={periodInSheet ? null : periodSelector}
      >
        {filtersInSheet ? null : children}
      </TopbarFrame>
      <InPhoneBar slot="period">{periodSelector}</InPhoneBar>
      <InPhoneBar slot="filters">{children}</InPhoneBar>
      <InPhoneBar slot="periodLabel">{periodLabelOf(period, today, formats, t)}</InPhoneBar>
    </>
  );
}
