import { z } from 'zod';

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly timezone: string;
  readonly conversionEvent: string | null;
}

export interface Admin {
  readonly email: string;
  readonly projects: readonly Project[];
}

export const meResponseSchema = z
  .object({
    email: z.string(),
    projects: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        timezone: z.string(),
        conversion_event: z.string().nullable(),
      }),
    ),
  })
  .transform((body): Admin => ({
    email: body.email,
    projects: body.projects.map((project) => ({
      id: project.id,
      name: project.name,
      timezone: project.timezone,
      conversionEvent: project.conversion_event,
    })),
  }));

export function findProject(admin: Admin, projectId: string): Project | undefined {
  return admin.projects.find((project) => project.id === projectId);
}

export function projectInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  const letters =
    words.length > 1
      ? words
          .slice(0, 2)
          .map((word) => word.charAt(0))
          .join('')
      : name.trim().slice(0, 2);
  return letters.toUpperCase();
}

export function emailInitial(email: string): string {
  return email.charAt(0).toUpperCase();
}
