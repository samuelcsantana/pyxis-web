import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { type Admin, findProject, type Project } from '@/domain/admin';
import { UnauthenticatedError } from '@/domain/errors';
import { createProjectsService } from '@/services/projects/projects-service.factory';

export const SESSION_EXPIRED_PATH = '/sign-in?expired=1';

export const currentAdmin = cache(async (): Promise<Admin> => {
  try {
    return await createProjectsService().currentAdmin();
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      redirect(SESSION_EXPIRED_PATH);
    }
    throw error;
  }
});

export async function projectOrNotFound(projectId: string): Promise<{
  readonly admin: Admin;
  readonly project: Project;
}> {
  const admin = await currentAdmin();
  const project = findProject(admin, projectId);
  if (project === undefined) {
    notFound();
  }
  return { admin, project };
}
