'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react';
import { BUTTON_STRONG, CONTROL_BUSY } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import {
  noOpenScreenNews,
  type OpenScreenNews,
  openScreenNews,
  subscribeToOpenScreenNews,
} from './arrival-news';
import { CONTENT_ID } from './content-id';
import { useHoldNavigationWhile } from './navigation-pending';
import { screenSlugOf } from './screens';

const BAR = 'pointer-events-none sticky top-14 z-10 flex justify-center py-2 lg:static lg:bg-bg';
const PILL = `pointer-events-auto inline-flex h-9 items-center gap-2 rounded-pill pr-4 pl-3.5 text-caption shadow-raised motion-safe:animate-reveal ${BUTTON_STRONG} ${CONTROL_BUSY}`;
const ARROW_UP_ICON = 'M12 19V5 M5 12l7-7 7 7';
const SPOKEN_SEPARATOR = ', ';

function useOpenScreenNews(): OpenScreenNews | undefined {
  return useSyncExternalStore(subscribeToOpenScreenNews, openScreenNews, noOpenScreenNews);
}

export function NewsBar() {
  const screen = screenSlugOf(usePathname());
  const news = useOpenScreenNews();
  return news === undefined || news.screen !== screen ? null : <NewsPill news={news} />;
}

function useFocusContentWhenGone() {
  const button = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const shown = button.current;
    return () => {
      if (shown === document.activeElement) {
        document.getElementById(CONTENT_ID)?.focus();
      }
    };
  }, []);
  return button;
}

function NewsPill({ news }: { readonly news: OpenScreenNews }) {
  const t = useT();
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [refreshed, setRefreshed] = useState<OpenScreenNews>();
  const button = useFocusContentWhenGone();
  const waiting = refreshing || refreshed === news;
  useHoldNavigationWhile(waiting);

  const refresh = () => {
    if (waiting) {
      return;
    }
    setRefreshed(news);
    startRefresh(() => {
      router.refresh();
    });
  };

  return (
    <div className={BAR}>
      <button
        ref={button}
        type="button"
        aria-busy={waiting ? true : undefined}
        onClick={refresh}
        className={PILL}
      >
        <svg width={15} height={15} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={ARROW_UP_ICON}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {waiting ? (
          <span>{t('nav.arrivals.refreshing')}</span>
        ) : (
          <>
            <span className="font-medium">{news.label}</span>
            <span aria-hidden="true">·</span>
            <span className="sr-only">{SPOKEN_SEPARATOR}</span>
            <span className="underline underline-offset-3">{t('nav.arrivals.refresh')}</span>
          </>
        )}
      </button>
    </div>
  );
}
