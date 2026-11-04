'use client';

import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { StrokeIcon } from '@/components/ui/stroke-icon';
import { useT } from '@/i18n/messages-provider';
import { openSettings } from './settings-location';
import {
  SECTION_GROUPS,
  type SettingsGroup,
  type SettingsSection,
  settingsHash,
} from './settings-sections';

export interface SectionNavProps {
  readonly current: SettingsSection | null;
  readonly available: readonly SettingsSection[] | null;
  readonly projectName: string;
}

const GROUP_ORDER: readonly SettingsGroup[] = ['account', 'project', 'support'];
const NEXT_ICON = 'M9 6l6 6-6 6';
export const SECTION_ICONS: Readonly<Record<SettingsSection, string>> = {
  general: 'M4 6h10 M18 6h2 M4 12h4 M12 12h8 M4 18h12 M20 18h0 M16 4v4 M10 10v4 M18 16v4',
  billing: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M3 10h18 M7 15h3',
  security: 'M4 5h16v11H4z M9 20h6 M12 16v4',
  tokens: 'M15 7a4 4 0 1 1-3.9 4.9L4 19v-3h2v-2h2l1.1-1.1A4 4 0 0 1 15 7z M16 10h.01',
  apps: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  install: 'M8 8l-4 4 4 4 M16 8l4 4-4 4 M13.5 5l-3 14',
  project: 'M4 7l8-4 8 4v10l-8 4-8-4z M4 7l8 4 8-4 M12 11v10',
  privacy: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4',
  keys: 'M7 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M10 11h10 M17 11v3 M20 11v2',
  people:
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14c2 .8 3 2.8 3 6',
  email: 'M4 6h16v12H4z M4 7l8 6 8-6',
  data: 'M12 4v10 M8 10l4 4 4-4 M5 19h14',
  help: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18 M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4 M12 16.8v.2',
};
const ITEM = `flex min-h-12 w-full items-center gap-3 rounded-control px-2.5 py-2 text-base sm:min-h-10 sm:gap-2.5 sm:text-sm ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const IDLE = 'text-ink sm:text-muted hover:bg-soft hover:text-ink active:bg-line';
const CURRENT = 'bg-soft font-semibold text-ink';
const GROUP_LABEL =
  'flex flex-wrap items-baseline gap-x-1.5 px-2.5 pb-1 text-micro font-semibold tracking-[0.08em] text-muted uppercase';

export function SectionNav({ current, available, projectName }: SectionNavProps) {
  const t = useT();
  return (
    <nav aria-label={t('settingsDialog.sectionsLabel')} className="flex flex-col gap-4">
      {GROUP_ORDER.map((group) => (
        <div key={group} className="flex flex-col gap-0.5">
          <span className={GROUP_LABEL}>
            <span>{t(`settingsDialog.groups.${group}`)}</span>
            {group === 'project' ? (
              <span className="font-medium tracking-normal wrap-anywhere normal-case">
                {projectName}
              </span>
            ) : null}
          </span>
          {SECTION_GROUPS[group]
            .filter((section) => available === null || available.includes(section))
            .map((section) => (
              <a
                key={section}
                href={settingsHash(section)}
                aria-current={section === current ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  openSettings(section);
                }}
                className={`${ITEM} ${section === current ? CURRENT : IDLE}`}
              >
                <StrokeIcon path={SECTION_ICONS[section]} />
                <span className="flex-1">{t(`settingsDialog.sections.${section}`)}</span>
                <StrokeIcon path={NEXT_ICON} size={16} className="text-muted sm:hidden" />
              </a>
            ))}
        </div>
      ))}
    </nav>
  );
}
