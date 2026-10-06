'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { periodParameters, SCREENS, screenHref, screenOf } from './screens';

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
  const pathname = usePathname();
  const query = periodParameters(useSearchParams());
  const current = screenOf(pathname);

  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 pb-1.5 text-[11px] font-semibold tracking-[0.08em] text-nav-muted uppercase">
        Analytics
      </span>
      <ul className="flex flex-col gap-1">
        {SCREENS.map((screen) => {
          const active = screen.slug === current;
          return (
            <li key={screen.slug}>
              <Link
                href={screenHref(projectId, screen.slug, query)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-input px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? 'bg-nav-active font-semibold text-nav-strong' : 'font-medium text-nav-text hover:bg-nav-raised'}`}
              >
                <ScreenIcon path={screen.icon} active={active} />
                <span>{screen.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
