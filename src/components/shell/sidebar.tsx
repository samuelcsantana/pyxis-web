import type { Admin, Project } from '@/domain/admin';
import { LogoMark } from '@/components/brand/logo-mark';
import { NAV_FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import type { Theme } from '@/lib/theme';
import { AccountMenu } from './account-menu';
import { ProjectSwitcher } from './project-switcher';
import { HelpLink } from './help-link';
import { FIRST_SCREEN, screenHref } from './screens';
import { SidebarNav } from './sidebar-nav';
import { ViewKeepingLink } from './view-keeping-link';

export interface SidebarProps {
  readonly admin: Admin;
  readonly project: Project;
  readonly theme?: Theme;
  readonly i18n: I18n;
  readonly chooseLocale: (form: FormData) => Promise<void>;
  readonly canCreateProject?: boolean;
}

const SHIELD_ICON = 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4';

export function Sidebar({
  admin,
  project,
  theme,
  i18n,
  chooseLocale,
  canCreateProject = false,
}: SidebarProps) {
  return (
    <div className="flex min-h-full grow flex-col gap-4 bg-nav px-3.5 pt-4 pb-4 text-nav-text lg:h-full lg:min-h-0 lg:gap-3">
      <div className="hidden lg:flex">
        <ViewKeepingLink
          href={screenHref(project.id, FIRST_SCREEN)}
          className={`flex items-center gap-2.5 px-2 py-1 text-nav-strong ${NAV_FOCUS_RING}`}
        >
          <LogoMark size={28} />
          <span className="text-xl font-bold tracking-tight">Pyxis</span>
        </ViewKeepingLink>
      </div>
      <ProjectSwitcher
        projects={admin.projects}
        currentProject={project}
        canCreateProject={canCreateProject}
      />
      <SidebarNav project={project} />
      <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-nav-line pt-3">
        <HelpLink projectId={project.id} />
        <p className="flex items-center gap-2 px-2.5 text-xs text-nav-muted">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="shrink-0 text-accent"
          >
            <path
              d={SHIELD_ICON}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {i18n.t('shell.privacy')}
        </p>
        <AccountMenu email={admin.email} theme={theme} i18n={i18n} chooseLocale={chooseLocale} />
      </div>
    </div>
  );
}
