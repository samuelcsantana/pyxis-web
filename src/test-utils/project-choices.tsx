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

export function withProjectChoices(children: ReactNode): ReactElement {
  return (
    <ProjectChoicesProvider
      projects={[TEST_PROJECT]}
      currentProject={TEST_PROJECT}
      canCreateProject={false}
    >
      {children}
    </ProjectChoicesProvider>
  );
}

export function renderInProject(ui: ReactElement, locale?: Locale): RenderResult {
  return renderWithMessages(withProjectChoices(ui), locale);
}
