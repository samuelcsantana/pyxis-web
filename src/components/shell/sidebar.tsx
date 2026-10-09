import Link from 'next/link';
import type { Admin, Project } from '@/domain/admin';
import { LogoMark } from '@/components/brand/logo-mark';
import { NAV_FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import type { Theme } from '@/lib/theme';
import { AccountMenu } from './account-menu';
import { ProjectSwitcher } from './project-switcher';
import { SidebarNav } from './sidebar-nav';

export interface SidebarProps {
  readonly admin: Admin;
  readonly project: Project;
  readonly theme?: Theme;
  readonly i18n: I18n;
  readonly chooseLocale: (form: FormData) => Promise<void>;
}

const SHIELD_ICON = 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4';

export function Sidebar({ admin, project, theme, i18n, chooseLocale }: SidebarProps) {
  return (
    <div className="flex min-h-full grow flex-col gap-4 bg-nav px-3.5 pt-4 pb-4 text-nav-text lg:gap-3">
      <div className="hidden lg:flex">
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-2 py-1 text-nav-strong ${NAV_FOCUS_RING}`}
        >
          <LogoMark size={28} />
          <span className="text-xl font-bold tracking-tight">Pyxis</span>
        </Link>
      </div>
      <ProjectSwitcher projects={admin.projects} currentProject={project} />
      <SidebarNav projectId={project.id} />
      <div className="mt-auto flex flex-col gap-3 border-t border-nav-line pt-3">
        <p className="flex items-center gap-2 rounded-input bg-nav-raised px-2.5 py-2 text-xs text-nav-text">
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
