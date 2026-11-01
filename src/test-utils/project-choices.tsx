import type { RenderResult } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ProjectChoicesProvider } from '@/components/shell/project-choices';
import type { Project } from '@/domain/admin';
import type { Locale } from '@/i18n/locales';
import { renderWithMessages } from './render-with-messages';

export const TEST_PROJECT: Project = {
  id: 'p1',
  name: 'Demo Store',
  timezone: 'America/Sao_Paulo',
  conversionEvent: null,
};

export const PROJECT_AWAITING_ITS_FIRST_EVENT: Project = { ...TEST_PROJECT, firstEventAt: null };

export function withProjectChoices(
  children: ReactNode,
  currentProject: Project = TEST_PROJECT,
  ownsCurrentProject = false,
): ReactElement {
  return (
    <ProjectChoicesProvider
      projects={[currentProject]}
      currentProject={currentProject}
      canCreateProject={false}
      ownsCurrentProject={ownsCurrentProject}
    >
      {children}
    </ProjectChoicesProvider>
  );
}

export function renderInProject(ui: ReactElement, locale?: Locale): RenderResult {
  return renderWithMessages(withProjectChoices(ui), locale);
}
