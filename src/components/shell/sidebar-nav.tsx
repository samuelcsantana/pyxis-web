'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type MouseEvent, useId } from 'react';
import type { Project } from '@/domain/admin';
import { PendingMark } from '@/components/ui/pending-mark';
import { useT } from '@/i18n/messages-provider';
import { ArrivalBadge, BADGE, BADGE_TONE } from './arrival-badge';
import { IntentPrefetchLink } from './intent-prefetch-link';
import { NavItemIcon, navItemClasses } from './nav-item';
import {
  hrefKeepingView,
  INSTALL_ITEM,
  installHref,
  navigationItemOf,
  SCREENS_IN_NAVIGATION_ORDER,
  screenHref,
  screenLabelKey,
  screenParameters,
  SETTINGS_ICON,
  SETTINGS_ITEM,
  SETTINGS_SEGMENT,
  settingsHref,
} from './screens';

const SECTION_LABEL =
  'px-3 pb-1.5 text-micro font-semibold tracking-[0.08em] text-nav-muted uppercase';
const INSTALL_ICON = 'M8 8l-4 4 4 4 M16 8l4 4-4 4 M13.5 5l-3 14';
const SPOKEN_SEPARATOR = ', ';
const TAG_STAYS_WHOLE = 'shrink-0 whitespace-nowrap';
const ROOM_FOR_A_TAG_BELOW = 'flex-wrap gap-y-1 py-1.5';
const SCROLLS_ALONE_ON_A_DESKTOP =
  'lg:-mx-1 lg:min-h-28 lg:flex-1 lg:scroll-py-1 lg:overflow-y-auto lg:overscroll-contain lg:px-1 lg:pb-1';

export interface SidebarNavProps {
  readonly project: Project;
}

function InstallPending() {
  const t = useT();
  return (
    <span className={`${BADGE} ${BADGE_TONE} ${TAG_STAYS_WHOLE}`}>
      <span aria-hidden="true">{t('nav.installPending')}</span>
      <span className="sr-only">{`${SPOKEN_SEPARATOR}${t('nav.installPending')}`}</span>
    </span>
  );
}

interface SettingsItemProps {
  readonly href: string;
  readonly current: boolean;
  readonly onItsPage: boolean;
  readonly label: string;
}

export function opensElsewhere(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function isSettingsPath(pathname: string): boolean {
  const [, projectId = '', segment = ''] = pathname.split('/');
  return projectId !== '' && segment === SETTINGS_SEGMENT;
}

function SettingsItem({ href, current, onItsPage, label }: SettingsItemProps) {
  const reloadAsAPage = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onItsPage && !opensElsewhere(event)) {
      event.preventDefault();
      window.location.assign(href);
    }
  };
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={current ? 'page' : undefined}
      onClick={reloadAsAPage}
      className={navItemClasses(current)}
    >
      <NavItemIcon path={SETTINGS_ICON} current={current} />
      <span>{label}</span>
      <PendingMark />
    </Link>
  );
}

export function SidebarNav({ project }: SidebarNavProps) {
  const t = useT();
  const pathname = usePathname();
  const search = useSearchParams();
  const projectLabel = useId();
  const current = navigationItemOf(pathname);
  const installCurrent = current === INSTALL_ITEM;
  const settingsOnItsPage = isSettingsPath(pathname);
  const settingsCurrent = current === SETTINGS_ITEM || settingsOnItsPage;

  return (
    <div className={`flex flex-col gap-1 ${SCROLLS_ALONE_ON_A_DESKTOP}`}>
      <span className={SECTION_LABEL}>{t('nav.section')}</span>
      <ul className="flex flex-col gap-0.5">
        {SCREENS_IN_NAVIGATION_ORDER.map((screen) => {
          const active = screen.slug === current;
          return (
            <li key={screen.slug}>
              <IntentPrefetchLink
                href={screenHref(project.id, screen.slug, screenParameters(search, screen.slug))}
                aria-current={active ? 'page' : undefined}
                className={navItemClasses(active)}
              >
                <NavItemIcon path={screen.icon} current={active} />
                <span>{t(screenLabelKey(screen.slug))}</span>
                <ArrivalBadge screen={screen.slug} active={active} />
                <PendingMark />
              </IntentPrefetchLink>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex flex-col gap-1 border-t border-nav-line pt-2">
        <span id={projectLabel} className={`${SECTION_LABEL} pt-1`}>
          {t('nav.projectSection')}
        </span>
        <ul aria-labelledby={projectLabel} className="flex flex-col gap-0.5">
          <li>
            <Link
              href={hrefKeepingView(installHref(project.id), search)}
              aria-current={installCurrent ? 'page' : undefined}
              className={`${navItemClasses(installCurrent)} ${ROOM_FOR_A_TAG_BELOW}`}
            >
              <NavItemIcon path={INSTALL_ICON} current={installCurrent} />
              <span>{t('nav.install')}</span>
              {project.firstEventAt === null ? <InstallPending /> : null}
              <PendingMark />
            </Link>
          </li>
          <li>
            <SettingsItem
              href={hrefKeepingView(settingsHref(project.id), search)}
              current={settingsCurrent}
              onItsPage={settingsOnItsPage}
              label={t('nav.settings')}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
