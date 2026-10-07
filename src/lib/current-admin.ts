import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { type Admin, findProject, type Project } from '@/domain/admin';
import { ApiNotFoundError, UnauthenticatedError } from '@/domain/errors';
import { createProjectsService } from '@/services/projects/projects-service.factory';
import { requestedScreenPath } from './requested-path';

export const SESSION_EXPIRED_PATH = '/sign-in?expired=1';

export function sessionExpiredPath(returnPath: string | undefined): string {
  return returnPath === undefined
    ? SESSION_EXPIRED_PATH
    : `${SESSION_EXPIRED_PATH}&${new URLSearchParams({ next: returnPath }).toString()}`;
}

export async function readOrSignIn<Value>(read: () => Promise<Value>): Promise<Value> {
  try {
    return await read();
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      redirect(sessionExpiredPath(await requestedScreenPath()));
    }
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }
}

export const currentAdmin = cache((): Promise<Admin> =>
  readOrSignIn(() => createProjectsService().currentAdmin()),
);

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
