'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { MouseEvent } from 'react';
import { type Project, projectInitials } from '@/domain/admin';
import { NAV_CONTROL, NAV_ITEM_IDLE } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { FIRST_SCREEN, periodParameters, SCREENS, screenHref, screenOf } from './screens';

export interface ProjectSwitcherProps {
  readonly projects: readonly Project[];
  readonly currentProject: Project;
}

function sameScreenIn(pathname: string) {
  const current = screenOf(pathname);
  return SCREENS.find((screen) => screen.slug === current)?.slug ?? FIRST_SCREEN;
}

export function ProjectSwitcher({ projects, currentProject }: ProjectSwitcherProps) {
  const pathname = usePathname();
  const query = periodParameters(useSearchParams());
  const screen = sameScreenIn(pathname);

  const closeAfterChoice = (event: MouseEvent<HTMLDetailsElement>) => {
    if (event.target instanceof Element && event.target.closest('a') !== null) {
      event.currentTarget.open = false;
    }
  };

  return (
    <DismissableDetails onClick={closeAfterChoice} className="group relative">
      <summary
        className={`flex w-full list-none items-center gap-2.5 rounded-input border border-nav-border bg-nav-raised p-2.5 text-left text-nav-strong hover:bg-nav-hover active:bg-nav-active ${NAV_CONTROL} [&::-webkit-details-marker]:hidden`}
      >
        <span className="sr-only">Switch project. Current project: </span>
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-control bg-accent text-[13px] font-bold text-accent-ink"
        >
          {projectInitials(currentProject.name)}
        </span>
        <span className="flex min-w-0 grow flex-col gap-0.5">
          <span className="text-sm font-semibold break-words">{currentProject.name}</span>
          <span className="font-mono text-xs break-words text-nav-muted">
            {currentProject.timezone}
          </span>
        </span>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="shrink-0 text-nav-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
        >
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <ul className="absolute inset-x-0 top-full z-10 mt-1.5 flex flex-col gap-1 rounded-input border border-nav-border bg-nav-raised p-1.5 shadow-lg">
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={screenHref(project.id, screen, query)}
              aria-current={project.id === currentProject.id ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-2.5 rounded-control px-2.5 py-1.5 text-sm ${NAV_ITEM_IDLE} ${NAV_CONTROL} aria-[current=page]:font-semibold aria-[current=page]:text-nav-strong`}
            >
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-chip bg-nav-border text-[11px] font-bold text-nav-strong"
              >
                {projectInitials(project.name)}
              </span>
              <span className="min-w-0 break-words">{project.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </DismissableDetails>
  );
}
