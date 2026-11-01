'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useId, useState } from 'react';
import type { Project } from '@/domain/admin';
import { DASHBOARD_FILTER_PARAMETERS } from '@/domain/dashboard-filter-parameters';
import { CONTROL_DISABLED, CONTROL_TRANSITION } from '@/components/ui/control-classes';
import { useT } from '@/i18n/messages-provider';
import { useArrivalNews } from './arrival-badge';
import { PhoneSheet } from './phone-sheet';
import { usePhoneBarHostSetter } from './phone-bar-slots';
import {
  hrefKeepingView,
  SCREENS_WITHOUT_FILTERS,
  SCREENS_WITHOUT_PERIOD,
  type ScreenSlug,
  settingsHref,
} from './screens';
import { isSettingsPath, reloadOnItsPage, SidebarFootNav, SidebarNav } from './sidebar-nav';
import { useScreenOnView } from './use-screen-on-view';

type Sheet = 'screens' | 'period' | 'filters';

interface OpenSheet {
  readonly sheet: Sheet;
  readonly at: string;
}

export const PHONE_ACCOUNT_ID = 'phone-bar-account';
const LAPTOP_WIDTH = '(width >= 64rem)';

const SCREENS_ICON = 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z';
const PERIOD_ICON = 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4';
const FILTERS_ICON = 'M4 5h16l-6 7v6l-4 2v-8z';
const ACCOUNT_ICON =
  'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 20c1.4-3.3 4.2-5 7.5-5s6.1 1.7 7.5 5';
const SPOKEN_SEPARATOR = ', ';
const FILTERS_OF_THEIR_OWN: ReadonlySet<ScreenSlug> = new Set(['visits']);
const MARK = 'absolute top-1.5 left-[calc(50%+0.375rem)]';

const BAR =
  'fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-nav-line bg-nav pt-3 pb-[env(safe-area-inset-bottom,0px)] lg:hidden';
const ITEM = `relative flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-micro text-nav-text outline-accent focus-visible:outline-2 focus-visible:-outline-offset-2 ${CONTROL_TRANSITION}`;
const BUTTON = `${ITEM} enabled:hover:bg-nav-hover enabled:active:bg-nav-active aria-expanded:bg-nav-active aria-expanded:font-semibold aria-expanded:text-nav-strong ${CONTROL_DISABLED}`;
const LINK = `${ITEM} hover:bg-nav-hover active:bg-nav-active aria-[current=page]:font-semibold aria-[current=page]:text-nav-strong`;

function filtersOn(search: { get(name: string): string | null }): number {
  return DASHBOARD_FILTER_PARAMETERS.filter((name) => (search.get(name) ?? '').trim() !== '')
    .length;
}

function BarIcon({ path }: { readonly path: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface BarLabelProps {
  readonly shown: string;
  readonly spoken: string;
}

function BarLabel({ shown, spoken }: BarLabelProps) {
  return (
    <>
      <span aria-hidden="true" className="max-w-full truncate">
        {shown}
      </span>
      <span className="sr-only">{spoken}</span>
    </>
  );
}

interface SheetButtonProps {
  readonly path: string;
  readonly expanded: boolean;
  readonly disabled?: boolean;
  readonly labelledBy?: string;
  readonly onToggle: () => void;
  readonly children: ReactNode;
}

function SheetButton({
  path,
  expanded,
  disabled = false,
  labelledBy,
  onToggle,
  children,
}: SheetButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={onToggle}
      className={BUTTON}
    >
      <BarIcon path={path} />
      {children}
    </button>
  );
}

function hasPeriod(screen: ScreenSlug | undefined): boolean {
  return screen !== undefined && !SCREENS_WITHOUT_PERIOD.has(screen);
}

function takesFilters(screen: ScreenSlug | undefined): boolean {
  return (
    screen !== undefined &&
    !FILTERS_OF_THEIR_OWN.has(screen) &&
    !SCREENS_WITHOUT_FILTERS.has(screen)
  );
}

export interface PhoneBarProps {
  readonly project: Project;
}

export function PhoneBar({ project }: PhoneBarProps) {
  const t = useT();
  const pathname = usePathname();
  const search = useSearchParams();
  const screen = useScreenOnView();
  const setPeriodHost = usePhoneBarHostSetter('period');
  const setFiltersHost = usePhoneBarHostSetter('filters');
  const setPeriodLabelHost = usePhoneBarHostSetter('periodLabel');
  const periodWord = useId();
  const periodShown = useId();
  const hasNews = Object.keys(useArrivalNews()).length > 0;
  const location = `${pathname}?${search.toString()}`;
  const [openSheet, setOpenSheet] = useState<OpenSheet>();
  if (openSheet !== undefined && openSheet.at !== location) {
    setOpenSheet(undefined);
  }
  const open = openSheet?.at === location ? openSheet.sheet : undefined;
  const filters = filtersOn(search);
  const accountHref = hrefKeepingView(settingsHref(project.id), search);
  const accountOnItsPage = isSettingsPath(pathname);

  const toggle = (sheet: Sheet) => () => {
    setOpenSheet(open === sheet ? undefined : { sheet, at: location });
  };
  const close = () => {
    setOpenSheet(undefined);
  };

  useEffect(() => {
    const laptop = window.matchMedia(LAPTOP_WIDTH);
    const closeOnALaptop = () => {
      if (laptop.matches) {
        setOpenSheet(undefined);
      }
    };
    laptop.addEventListener('change', closeOnALaptop);
    return () => {
      laptop.removeEventListener('change', closeOnALaptop);
    };
  }, []);

  return (
    <>
      <nav aria-label={t('nav.label')} className={BAR}>
        <SheetButton path={SCREENS_ICON} expanded={open === 'screens'} onToggle={toggle('screens')}>
          {hasNews ? (
            <span aria-hidden="true" className={`${MARK} size-2 rounded-full bg-accent`} />
          ) : null}
          <BarLabel
            shown={t('nav.screens')}
            spoken={hasNews ? t('nav.screensWithNews') : t('nav.screens')}
          />
        </SheetButton>
        <SheetButton
          path={PERIOD_ICON}
          expanded={open === 'period'}
          disabled={!hasPeriod(screen)}
          labelledBy={`${periodWord} ${periodShown}`}
          onToggle={toggle('period')}
        >
          <span id={periodWord} className="sr-only">
            {t('periodSelector.label')}
          </span>
          <span
            id={periodShown}
            ref={setPeriodLabelHost}
            className="peer max-w-full truncate empty:hidden"
          />
          <span aria-hidden="true" className="hidden max-w-full truncate peer-empty:inline">
            {t('periodSelector.label')}
          </span>
        </SheetButton>
        <SheetButton
          path={FILTERS_ICON}
          expanded={open === 'filters'}
          disabled={!takesFilters(screen)}
          onToggle={toggle('filters')}
        >
          {filters > 0 ? (
            <span
              aria-hidden="true"
              className={`${MARK} min-w-4.5 rounded-pill bg-accent px-1 text-center text-[0.625rem] leading-4.5 font-bold text-accent-ink`}
            >
              {filters}
            </span>
          ) : null}
          <BarLabel
            shown={t('nav.filters')}
            spoken={
              filters > 0
                ? `${t('nav.filters')}${SPOKEN_SEPARATOR}${String(filters)}`
                : t('nav.filters')
            }
          />
        </SheetButton>
        <Link
          id={PHONE_ACCOUNT_ID}
          href={accountHref}
          scroll={false}
          aria-current={accountOnItsPage ? 'page' : undefined}
          onClick={reloadOnItsPage(accountOnItsPage, accountHref)}
          className={LINK}
        >
          <BarIcon path={ACCOUNT_ICON} />
          <BarLabel shown={t('nav.accountTab')} spoken={t('nav.accountTab')} />
        </Link>
      </nav>
      <PhoneSheet tone="nav" title={t('nav.screens')} open={open === 'screens'} onClose={close}>
        {open === 'screens' ? (
          <>
            <SidebarNav project={project} />
            <div className="border-t border-nav-line pt-2">
              <SidebarFootNav project={project} />
            </div>
          </>
        ) : null}
      </PhoneSheet>
      <PhoneSheet
        tone="card"
        title={t('periodSelector.label')}
        open={open === 'period'}
        onClose={close}
      >
        {open === 'period' ? <div ref={setPeriodHost} className="px-1" /> : null}
      </PhoneSheet>
      <PhoneSheet tone="card" title={t('nav.filters')} open={open === 'filters'} onClose={close}>
        {filters === 0 ? (
          <p className="px-2.5 text-sm text-muted">{t('nav.filtersEmpty')}</p>
        ) : null}
        {open === 'filters' ? <div ref={setFiltersHost} className="px-1" /> : null}
      </PhoneSheet>
    </>
  );
}
