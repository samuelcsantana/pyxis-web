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
