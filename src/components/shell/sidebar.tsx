import Link from 'next/link';
import { type Admin, emailInitial, type Project } from '@/domain/admin';
import { LogoMark } from '@/components/brand/logo-mark';
import { NAV_FOCUS_RING } from '@/components/ui/control-classes';
import { ProjectSwitcher } from './project-switcher';
import { SidebarNav } from './sidebar-nav';
import { SignOutButton } from './sign-out-button';

export interface SidebarProps {
  readonly admin: Admin;
  readonly project: Project;
}

const SHIELD_ICON = 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z M9 12l2 2 4-4';

export function Sidebar({ admin, project }: SidebarProps) {
  return (
    <div className="flex min-h-full grow flex-col gap-5.5 bg-nav px-3.5 pt-5 pb-6 text-nav-text">
      <Link
        href="/"
        className={`hidden items-center gap-2.5 px-2 py-1 text-nav-strong ${NAV_FOCUS_RING} lg:flex`}
      >
        <LogoMark size={28} />
        <span className="text-xl font-bold tracking-tight">Pyxis</span>
      </Link>
      <ProjectSwitcher projects={admin.projects} currentProject={project} />
      <SidebarNav projectId={project.id} />
      <div className="mt-auto flex flex-col gap-3.5 border-t border-nav-line pt-4.5">
        <div className="flex gap-2.5 rounded-input bg-nav-raised p-3">
          <svg
            width={18}
            height={18}
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
          <span className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-nav-strong">Privacy-first</span>
            <span className="text-xs leading-[17px] text-nav-muted">
              No cookies on your visitors. No personal data in events.
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 px-1">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-nav-border text-[13px] font-semibold text-nav-strong"
          >
            {emailInitial(admin.email)}
          </span>
          <span className="min-w-0 grow truncate text-xs text-nav-text">{admin.email}</span>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
