'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { MouseEvent } from 'react';
import { Breakable } from '@/components/ui/breakable';
import { CONTROL_TRANSITION, FOCUS_RING } from '@/components/ui/control-classes';
import { DismissableDetails } from '@/components/ui/dismissable-details';
import { useT } from '@/i18n/messages-provider';
import { CurrentCheck } from './current-check';
import { useProjectChoices } from './project-choices';
import { ProjectMark } from './project-mark';
import { MENU_PANEL, MENU_ROW_NOTE, menuRowClasses } from './menu-row-classes';
import { FIRST_SCREEN, periodParameters, screenHref } from './screens';
import { useScreenOnView } from './use-screen-on-view';

export const NEW_PROJECT_PAGE = '/new-project';
const PLUS_ICON = 'M12 5v14M5 12h14';

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
      <ul className={`${MENU_PANEL} left-0 w-max max-w-[min(24rem,calc(100vw-2rem))] min-w-60`}>
        {projects.map((project) => {
          const current = project.id === currentProject.id;
          return (
            <li key={project.id}>
              <Link
                href={screenHref(project.id, screen, query)}
                aria-current={current ? 'page' : undefined}
                className={menuRowClasses(current)}
              >
                <ProjectMark project={project} />
                <span className="flex min-w-0 grow flex-col gap-0.5">
                  <span className="break-words">{project.name}</span>
                  <span className={`font-mono text-xs font-normal break-words ${MENU_ROW_NOTE}`}>
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
            <Link href={NEW_PROJECT_PAGE} className={menuRowClasses()}>
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
