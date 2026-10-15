export interface Project {
  readonly id: string;
  readonly name: string;
  readonly timezone: string;
  readonly conversionEvent: string | null;
  readonly firstEventAt?: string | null;
  readonly lastEventAt?: string | null;
  readonly iconVersion?: string | null;
  readonly ingestionSuspendedAt?: string | null;
  readonly ingestionSuspensionReason?: string | null;
}

export interface IngestionSuspension {
  readonly since: string;
  readonly reason: string | null;
}

export function ingestionSuspensionOf(project: Project): IngestionSuspension | null {
  if (project.ingestionSuspendedAt === undefined || project.ingestionSuspendedAt === null) {
    return null;
  }
  return { since: project.ingestionSuspendedAt, reason: project.ingestionSuspensionReason ?? null };
}

export interface ProjectIcon {
  readonly contentType: string;
  readonly bytes: ArrayBuffer;
}

export function projectIconHref(project: Project): string | null {
  if (project.iconVersion === undefined || project.iconVersion === null) {
    return null;
  }
  return `/${encodeURIComponent(project.id)}/icon?v=${encodeURIComponent(project.iconVersion)}`;
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
