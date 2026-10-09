export interface ProjectKeySummary {
  readonly id: string;
  readonly createdAt: string;
}

export interface PublicKeySummary extends ProjectKeySummary {
  readonly key: string;
}

export interface ProjectSettings {
  readonly id: string;
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
}

export type ProjectActivity =
  | { readonly kind: 'waiting' }
  | { readonly kind: 'receiving'; readonly firstEventAt: string; readonly lastEventAt: string };

export function projectActivity(settings: ProjectSettings): ProjectActivity {
  return settings.firstEventAt === null || settings.lastEventAt === null
    ? { kind: 'waiting' }
    : {
        kind: 'receiving',
        firstEventAt: settings.firstEventAt,
        lastEventAt: settings.lastEventAt,
      };
}
