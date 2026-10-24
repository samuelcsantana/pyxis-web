'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { type ArrivalsReport, isCappedArrivalCount } from '@/domain/arrivals';
import { resolvePeriodOn, todayIn } from '@/domain/period';
import { useT } from '@/i18n/messages-provider';
import { arrivalsHref, SINCE_PARAMETER } from '@/lib/arrivals-href';
import { createSeenStore } from '@/lib/seen-store';
import { createShownNumbersStore } from '@/lib/shown-numbers';
import {
  type ArrivalLabel,
  type ArrivalNewsInput,
  arrivalNewsOf,
  COUNTED_SCREENS,
  oldestMark,
  openScreenNewsOf,
} from './arrival-counting';
import {
  publishActiveVisits,
  publishArrivalNews,
  publishOpenScreenNews,
  subscribeToScreenReads,
  takeScreenReads,
} from './arrival-news';
import { readArrivalsAnswer } from './arrivals-answer';
import { createFreshMarks, FreshMarksView } from './fresh-marks';
import { type ArrivalsPoller, startArrivalsPoller } from './arrivals-poller';
import { screenSearchOf } from './screen-search';
import { screenSlugOf } from './screens';
import { useProjectToday } from './use-project-today';

export interface ArrivalsWatcherProps {
  readonly projectId: string;
  readonly timeZone: string;
  readonly serverNow: number;
}

interface PeriodDays {
  readonly from: string;
  readonly to: string;
}

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'scroll'] as const;
const LISTEN_EARLY = { capture: true, passive: true } as const;

const COUNT_KEYS = {
  visits: 'nav.arrivals.visits',
  conversions: 'nav.arrivals.conversions',
  namedEvents: 'nav.arrivals.namedEvents',
  failedRequests: 'nav.arrivals.failedRequests',
} as const;

const MANY_KEYS = {
  visits: 'nav.arrivals.manyVisits',
  conversions: 'nav.arrivals.manyConversions',
  namedEvents: 'nav.arrivals.manyNamedEvents',
  failedRequests: 'nav.arrivals.manyFailedRequests',
} as const;

const NO_NEWS = {};

function tabIsVisible(): boolean {
  return document.visibilityState === 'visible';
}

function onlyInTheBrowser(): number {
  return 0;
}

export default function ArrivalsWatcher({ projectId, timeZone, serverNow }: ArrivalsWatcherProps) {
  const t = useT();
  const pathname = usePathname();
  const search = useSearchParams();
  const today = useProjectToday(timeZone, serverNow);
  const current = screenSlugOf(pathname);
  const { from, to } = resolvePeriodOn(screenSearchOf(search), today);
  const includesToday = to >= today;
  const store = useMemo(() => createSeenStore(projectId), [projectId]);
  const freshMarks = useMemo(
    () => createFreshMarks(createShownNumbersStore(projectId)),
    [projectId],
  );
  const marksVersion = useSyncExternalStore(store.subscribe, store.version, onlyInTheBrowser);
  const [report, setReport] = useState<ArrivalsReport>();
  const period = useRef<PeriodDays>({ from, to });
  const poller = useRef<ArrivalsPoller>(undefined);

  const label = useMemo<ArrivalLabel>(
    () => (kind, count) =>
      isCappedArrivalCount(count) ? t(MANY_KEYS[kind]) : t(COUNT_KEYS[kind], { count }),
    [t],
  );

  useEffect(() => {
    const record = () => {
      for (const note of takeScreenReads()) {
        const screen = screenSlugOf(note.path);
        if (screen !== undefined) {
          store.record(screen, note.readAt, Date.now());
        }
        freshMarks.read(note, todayIn(timeZone, new Date()));
      }
    };
    record();
    return subscribeToScreenReads(record);
  }, [store, freshMarks, timeZone]);

  useEffect(() => {
    period.current = { from, to };
    poller.current?.askSoon();
  }, [from, to, current]);

  useEffect(() => {
    if (!includesToday) {
      return undefined;
    }
    const ask = async () => {
      const since = oldestMark(store.marks(Date.now())) ?? Date.now();
      const query = new URLSearchParams({
        from: period.current.from,
        to: period.current.to,
        [SINCE_PARAMETER]: new Date(since).toISOString(),
      });
      const response = await fetch(arrivalsHref(projectId, query), {
        cache: 'no-store',
        redirect: 'manual',
      });
      return readArrivalsAnswer(response);
    };
    const started = startArrivalsPoller({
      ask,
      onReport: (next) => {
        store.adopt(COUNTED_SCREENS, next.asOf, Date.now());
        setReport(next);
      },
      visible: tabIsVisible(),
    });
    const followVisibility = () => {
      started.setVisible(tabIsVisible());
    };
    const noteActivity = () => {
      started.noteActivity();
    };
    poller.current = started;
    document.addEventListener('visibilitychange', followVisibility);
    for (const name of ACTIVITY_EVENTS) {
      window.addEventListener(name, noteActivity, LISTEN_EARLY);
    }
    return () => {
      started.stop();
      poller.current = undefined;
      document.removeEventListener('visibilitychange', followVisibility);
      for (const name of ACTIVITY_EVENTS) {
        window.removeEventListener(name, noteActivity, LISTEN_EARLY);
      }
    };
  }, [projectId, store, includesToday]);

  useEffect(() => {
    const counting: ArrivalNewsInput | undefined =
      includesToday && report !== undefined
        ? { report, marks: store.marks(Date.now()), current, label }
        : undefined;
    publishArrivalNews(counting === undefined ? NO_NEWS : arrivalNewsOf(counting));
    publishOpenScreenNews(counting === undefined ? undefined : openScreenNewsOf(counting));
  }, [report, marksVersion, current, includesToday, store, label]);

  useEffect(() => {
    publishActiveVisits(includesToday ? report?.activeVisits : undefined);
  }, [report, includesToday]);

  useEffect(
    () => () => {
      publishArrivalNews(NO_NEWS);
      publishOpenScreenNews(undefined);
      publishActiveVisits(undefined);
    },
    [],
  );

  return <FreshMarksView source={freshMarks} />;
}
