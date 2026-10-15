export interface ProjectKeySummary {
  readonly id: string;
  readonly createdAt: string;
}

export interface PublicKeySummary extends ProjectKeySummary {
  readonly key: string;
}

export const PROJECT_ROLES = ['owner', 'member'] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export interface ProjectSettings {
  readonly id: string;
  readonly accountId: string | null;
  readonly role: ProjectRole | null;
  readonly name: string;
  readonly timezone: string;
  readonly conversionEvent: string | null;
  readonly allowedOrigins: readonly string[];
  readonly createdAt: string;
  readonly firstEventAt: string | null;
  readonly lastEventAt: string | null;
  readonly eventRetentionMonths: number;
  readonly publicKeys: readonly PublicKeySummary[];
  readonly secretKeys: readonly ProjectKeySummary[];
  readonly deletionHeldAt: string | null;
}

export type ProjectActivity =
  | { readonly kind: 'waiting' }
  | { readonly kind: 'receiving'; readonly firstEventAt: string; readonly lastEventAt: string };

export function canManageProject(settings: ProjectSettings): boolean {
  return settings.role === 'owner';
}

export function hasLivePublicKey(settings: ProjectSettings): boolean {
  return settings.publicKeys.length > 0;
}

export function isProjectDeletionHeld(settings: ProjectSettings): boolean {
  return settings.deletionHeldAt !== null;
}

export function projectActivity(settings: ProjectSettings): ProjectActivity {
  return settings.firstEventAt === null || settings.lastEventAt === null
    ? { kind: 'waiting' }
    : {
        kind: 'receiving',
        firstEventAt: settings.firstEventAt,
        lastEventAt: settings.lastEventAt,
      };
}
