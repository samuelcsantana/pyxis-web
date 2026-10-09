'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  NAV_CONTROL,
  NAV_ITEM_CURRENT,
  NAV_ITEM_IDLE,
  PENDING_HOST,
} from '@/components/ui/control-classes';
import { PendingMark } from '@/components/ui/pending-mark';
import { useT } from '@/i18n/messages-provider';
import {
  periodParameters,
  SCREENS,
  screenHref,
  screenLabelKey,
  screenOf,
  SETTINGS_ICON,
  settingsHref,
} from './screens';

const SECTION_LABEL =
  'px-3 pb-1.5 text-micro font-semibold tracking-[0.08em] text-nav-muted uppercase';
const ITEM = `flex min-h-11 items-center gap-3 rounded-input px-3 text-sm lg:min-h-10 ${PENDING_HOST} ${NAV_CONTROL}`;

export interface SidebarNavProps {
  readonly projectId: string;
}

function ScreenIcon({ path, active }: { readonly path: string; readonly active: boolean }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={active ? 'text-accent' : 'text-nav-muted'}
    >
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

export function SidebarNav({ projectId }: SidebarNavProps) {
  const t = useT();
  const pathname = usePathname();
  const query = periodParameters(useSearchParams());
  const current = screenOf(pathname);
  const settingsCurrent = pathname === settingsHref(projectId);

  return (
    <div className="flex flex-col gap-1">
      <span className={SECTION_LABEL}>{t('nav.section')}</span>
      <ul className="flex flex-col gap-0.5">
        {SCREENS.map((screen) => {
          const active = screen.slug === current;
          return (
            <li key={screen.slug}>
              <Link
                href={screenHref(projectId, screen.slug, query)}
                aria-current={active ? 'page' : undefined}
                className={`${ITEM} ${active ? NAV_ITEM_CURRENT : `font-medium ${NAV_ITEM_IDLE}`}`}
              >
                <ScreenIcon path={screen.icon} active={active} />
                <span>{t(screenLabelKey(screen.slug))}</span>
                <PendingMark />
              </Link>
            </li>
          );
        })}
      </ul>
      <ul
        aria-label={t('nav.projectSection')}
        className="mt-2 flex flex-col gap-0.5 border-t border-nav-line pt-2"
      >
        <li>
          <Link
            href={settingsHref(projectId)}
            aria-current={settingsCurrent ? 'page' : undefined}
            className={`${ITEM} ${settingsCurrent ? NAV_ITEM_CURRENT : `font-medium ${NAV_ITEM_IDLE}`}`}
          >
            <ScreenIcon path={SETTINGS_ICON} active={settingsCurrent} />
            <span>{t('nav.settings')}</span>
            <PendingMark />
          </Link>
        </li>
      </ul>
    </div>
  );
}
