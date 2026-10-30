'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { resolvePeriodOn } from '@/domain/period';
import { requestKindOf } from '@/domain/request-kind';
import { createDayFormats } from '@/i18n/day-formats';
import { displayTag } from '@/i18n/display-tag';
import { useLocale, useT } from '@/i18n/messages-provider';
import { ActiveVisits } from './active-visits';
import { PeriodSelector } from './period-selector';
import { carriedParameters, type ScreenSearch, screenSearchOf } from './screen-search';
import type { ScreenTopbarTexts } from './screen-topbar-texts';
import { SCREENS_WITHOUT_PERIOD, type ScreenSlug, screenHref, screenLabelKey } from './screens';
import { PeriodLabel, RangeNotice, TopbarFrame } from './topbar';
import { useScreenOnView } from './use-screen-on-view';
import { useProjectToday } from './use-project-today';

const ACTIVE_VISITS_SCREEN: ScreenSlug = 'overview';

export interface ScreenTopbarProps {
  readonly projectId: string;
  readonly timeZone: string;
  readonly serverNow: number;
  readonly texts: ScreenTopbarTexts;
}

function subtitleOf(screen: ScreenSlug, search: ScreenSearch, texts: ScreenTopbarTexts): string {
  return screen === 'requests'
    ? texts.requestsSubtitles[requestKindOf(search)]
    : texts.subtitles[screen];
}

export function ScreenTopbar({ projectId, timeZone, serverNow, texts }: ScreenTopbarProps) {
  const screen = useScreenOnView();
  const search = screenSearchOf(useSearchParams());
  const today = useProjectToday(timeZone, serverNow);
  const t = useT();
  const locale = useLocale();
  const formats = useMemo(() => createDayFormats(displayTag(locale)), [locale]);
  if (screen === undefined) {
    return null;
  }
  const title = t(screenLabelKey(screen));
  const subtitle = subtitleOf(screen, search, texts);
  if (SCREENS_WITHOUT_PERIOD.has(screen)) {
    return <TopbarFrame title={title} subtitle={subtitle} controls={null} />;
  }
  const period = resolvePeriodOn(search, today);
  const showsVisitsNow = screen === ACTIVE_VISITS_SCREEN && period.to >= today;
  return (
    <TopbarFrame
      title={title}
      besideTitle={showsVisitsNow ? <ActiveVisits /> : undefined}
      subtitle={subtitle}
      context={<PeriodLabel period={period} format={formats} />}
      notice={
        period.rejected === undefined ? undefined : (
          <RangeNotice text={texts.rangeNotices[period.rejected.problem]} />
        )
      }
      controls={
        <PeriodSelector
          basePath={screenHref(projectId, screen)}
          period={period}
          today={today}
          keep={carriedParameters(screen, search)}
          t={t}
        />
      }
    />
  );
}
