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
    <div className="flex min-h-full grow flex-col gap-4 bg-nav px-3.5 pt-4 pb-4 text-nav-text">
      <Link
        href="/"
        className={`hidden items-center gap-2.5 px-2 py-1 text-nav-strong ${NAV_FOCUS_RING} lg:flex`}
      >
        <LogoMark size={28} />
        <span className="text-xl font-bold tracking-tight">Pyxis</span>
      </Link>
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
          No cookies, no personal data
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-1">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-nav-border text-[13px] font-semibold text-nav-strong"
          >
            {emailInitial(admin.email)}
          </span>
          <span className="min-w-0 flex-1 text-xs wrap-anywhere text-nav-text">{admin.email}</span>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
