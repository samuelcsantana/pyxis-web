'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { MouseEvent } from 'react';
import { Breakable } from '@/components/ui/breakable';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { useT } from '@/i18n/messages-provider';
import { useProjectChoices } from './project-choices';
import { ProjectMark } from './project-mark';
import { FIRST_SCREEN, periodParameters, screenHref } from './screens';
import { useScreenOnView } from './use-screen-on-view';

export const NEW_PROJECT_PAGE = '/new-project';
const PLUS_ICON = 'M12 5v14M5 12h14';
const ROW = `flex min-h-11 items-center gap-2.5 rounded-control px-2.5 py-1.5 text-sm text-ink ${FOCUS_RING} ${CONTROL_TRANSITION}`;
const ROW_IDLE = 'group/row hover:bg-line-strong active:bg-line-strong';
const ROW_CURRENT = 'bg-soft font-semibold';

function CurrentCheck() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0 text-ink"
    >
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProjectSwitcher() {
  const t = useT();
  const { projects, currentProject, canCreateProject } = useProjectChoices();
  const query = periodParameters(useSearchParams());
  const screen = useScreenOnView() ?? FIRST_SCREEN;

  const closeAfterChoice = (event: MouseEvent<HTMLDetailsElement>) => {
    if (event.target instanceof Element && event.target.closest('a') !== null) {
      event.currentTarget.open = false;
    }
  };

  return (
    <DismissableDetails onClick={closeAfterChoice} className="group relative">
      <summary
        className={`flex min-h-11 max-w-[min(20rem,60vw)] list-none items-center gap-2 rounded-input border border-line bg-card px-2.5 text-left text-ink hover:border-muted hover:bg-soft active:border-muted active:bg-line ${FOCUS_RING} ${CONTROL_TRANSITION} [&::-webkit-details-marker]:hidden`}
      >
        <span className="sr-only">{t('nav.switchProject')} </span>
        <ProjectMark project={currentProject} />
        <span className="min-w-0 text-sm font-semibold break-words max-lg:sr-only">
          {currentProject.name}
        </span>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
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
      <ul className="absolute top-full left-0 z-30 mt-1.5 flex w-max max-w-[min(24rem,calc(100vw-2rem))] min-w-60 flex-col gap-1 rounded-input border border-line bg-card p-1.5 shadow-lg lg:max-h-[calc(100dvh-100%-3rem)] lg:scroll-py-1 lg:overflow-y-auto lg:overscroll-contain">
        {projects.map((project) => {
          const current = project.id === currentProject.id;
          return (
            <li key={project.id}>
              <Link
                href={screenHref(project.id, screen, query)}
                aria-current={current ? 'page' : undefined}
                className={`${ROW} ${current ? ROW_CURRENT : ROW_IDLE}`}
              >
                <ProjectMark project={project} />
                <span className="flex min-w-0 grow flex-col gap-0.5">
                  <span className="break-words">{project.name}</span>
                  <span className="font-mono text-xs font-normal break-words text-muted group-hover/row:text-ink group-active/row:text-ink">
                    <Breakable text={project.timezone} breakAt="slashes" />
                  </span>
                </span>
                {current ? <CurrentCheck /> : null}
              </Link>
            </li>
          );
        })}
        {canCreateProject ? (
          <li className="border-t border-line pt-1">
            <Link href={NEW_PROJECT_PAGE} className={`${ROW} ${ROW_IDLE}`}>
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="shrink-0 text-muted"
              >
                <path
                  d={PLUS_ICON}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
              <span className="min-w-0 grow">{t('nav.newProject')}</span>
            </Link>
          </li>
        ) : null}
      </ul>
    </DismissableDetails>
  );
}
