import type { Project } from '@/domain/admin';
import { LogoMark } from '@/components/brand/logo-mark';
import { NAV_FOCUS_RING } from '@/components/ui/control-classes';
import { FIRST_SCREEN, screenHref } from './screens';
import { SidebarFootNav, SidebarNav } from './sidebar-nav';
import { ViewKeepingLink } from './view-keeping-link';

export interface SidebarProps {
  readonly project: Project;
}

export function Sidebar({ project }: SidebarProps) {
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
      <div className="mt-auto shrink-0 border-t border-nav-line pt-3">
        <SidebarFootNav project={project} />
      </div>
    </div>
  );
}
