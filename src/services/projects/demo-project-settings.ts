import type { DemoProject } from '../demo/demo-catalog';
import { DEMO_DOCS, demoProjectOf } from '../demo/demo-projects';

export const DEMO_FIRST_EVENT_AT = '2025-01-06T09:00:00.000Z';

const DEMO_CREATED_AT = '2025-01-06T08:00:00.000Z';
const DEMO_SECRET_KEY_CREATED_AT = '2025-02-03T10:00:00.000Z';
const DEMO_EVENT_RETENTION_MONTHS = 13;
const PUBLIC_KEY_PREFIX = 'pyxis_pk_';
const KEY_LENGTH = 32;
const STORE_ORIGINS = ['https://store.example.com', 'https://www.store.example.com'];
const DOCS_ORIGINS = ['https://docs.example.com'];

function demoKeyId(project: DemoProject, suffix: string): string {
  return `${project.id.slice(0, -suffix.length)}${suffix}`;
}

export function demoProjectSettingsWire(projectId: string, now: Date) {
  const project = demoProjectOf(projectId);
  return {
    id: project.id,
    name: project.name,
    timezone: project.timezone,
    conversion_event: project.conversionEvent,
    allowed_origins: project.id === DEMO_DOCS.id ? DOCS_ORIGINS : STORE_ORIGINS,
    created_at: DEMO_CREATED_AT,
    first_event_at: DEMO_FIRST_EVENT_AT,
    last_event_at: now.toISOString(),
    event_retention_months: DEMO_EVENT_RETENTION_MONTHS,
    public_keys: [
      {
        id: demoKeyId(project, 'a1'),
        key: `${PUBLIC_KEY_PREFIX}${project.id.replaceAll('-', '').slice(0, KEY_LENGTH)}`,
        created_at: DEMO_CREATED_AT,
      },
    ],
    secret_keys: [{ id: demoKeyId(project, 'b2'), created_at: DEMO_SECRET_KEY_CREATED_AT }],
  };
}
