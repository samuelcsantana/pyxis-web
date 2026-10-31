'use client';

import { createContext, type ReactNode, useContext } from 'react';
import type { Project } from '@/domain/admin';

export interface ProjectChoices {
  readonly projects: readonly Project[];
  readonly currentProject: Project;
  readonly canCreateProject: boolean;
}

const ProjectChoicesContext = createContext<ProjectChoices | null>(null);

export interface ProjectChoicesProviderProps extends ProjectChoices {
  readonly children: ReactNode;
}

export function ProjectChoicesProvider({ children, ...choices }: ProjectChoicesProviderProps) {
  return <ProjectChoicesContext value={choices}>{children}</ProjectChoicesContext>;
}

export function useProjectChoices(): ProjectChoices {
  const choices = useContext(ProjectChoicesContext);
  if (choices === null) {
    throw new Error('useProjectChoices needs a ProjectChoicesProvider above it.');
  }
  return choices;
}
