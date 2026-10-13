export const PYXIS_INGESTION_URL = 'https://api.pyxis-analytics.dev';

function configured(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed === '' ? undefined : trimmed;
}

export function landingTrackingKey(): string | undefined {
  return configured(process.env.NEXT_PUBLIC_LANDING_PYXIS_KEY);
}

export function landingIngestionUrl(): string {
  return configured(process.env.NEXT_PUBLIC_LANDING_PYXIS_ENDPOINT) ?? PYXIS_INGESTION_URL;
}
