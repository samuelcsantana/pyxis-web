import { WINDOW_TITLE_ID } from '@/components/settings-window/frame-view';
import { projectActivity, type ProjectSettings } from '@/domain/project-settings';
import type { I18n } from '@/i18n/i18n';
import { InstallGuide } from './install-guide';

export interface InstallWindowProps {
  readonly settings: ProjectSettings;
  readonly endpoint: string;
  readonly i18n: I18n;
}

const WAITING_TAG =
  'inline-flex items-center gap-1.5 rounded-pill bg-warn-soft px-2 py-0.5 text-caption font-semibold text-ink';

export function InstallWindow({ settings, endpoint, i18n }: InstallWindowProps) {
  const { t } = i18n;
  const receiving = projectActivity(settings).kind === 'receiving';
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex shrink-0 flex-col gap-1.5 border-b border-line py-4 pr-16 pl-5">
        <h2
          id={WINDOW_TITLE_ID}
          data-section-title=""
          tabIndex={-1}
          className="text-lg font-semibold tracking-tight focus:outline-none"
        >
          {t('install.title')}
        </h2>
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">{settings.name}</span>
          {receiving ? (
            <span className="font-semibold text-ok">{t('install.received')}</span>
          ) : (
            <span className={WAITING_TAG}>
              <span
                aria-hidden="true"
                className="size-2 rounded-pill bg-warn motion-safe:animate-pulse"
              />
              {t('install.waiting')}
            </span>
          )}
        </p>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto p-4 sm:gap-5 sm:p-5">
        <InstallGuide
          settings={settings}
          endpoint={endpoint}
          i18n={i18n}
          headingLevel={3}
          idPrefix="install-window"
        />
      </div>
    </div>
  );
}
