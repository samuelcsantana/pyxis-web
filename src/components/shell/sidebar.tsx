import type { Admin, Project } from '@/domain/admin';
import { LogoMark } from '@/components/brand/logo-mark';
import { NAV_FOCUS_RING } from '@/components/ui/control-classes';
import type { I18n } from '@/i18n/i18n';
import type { MonthUsage } from '@/lib/accounts-in-view';
import { AccountMenu } from './account-menu';
import { FIRST_SCREEN, screenHref } from './screens';
import { SidebarFootNav, SidebarNav } from './sidebar-nav';
import { ViewKeepingLink } from './view-keeping-link';

export interface SidebarProps {
  readonly admin: Admin;
  readonly project: Project;
  readonly i18n: I18n;
  readonly usage?: MonthUsage | null;
}

export function Sidebar({ admin, project, i18n, usage = null }: SidebarProps) {
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
      <SidebarNav project={project} />
      <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-nav-line pt-3">
        <SidebarFootNav project={project} />
        <AccountMenu email={admin.email} projectId={project.id} i18n={i18n} usage={usage} />
      </div>
    </div>
  );
}
