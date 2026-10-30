import { type Admin, type ProjectIcon } from '@/domain/admin';
import { meResponseSchema } from '@/domain/admin.schema';
import type { ProjectSettings } from '@/domain/project-settings';
import { projectSettingsResponseSchema } from '@/domain/project-settings.schema';
import type { SourceMessages } from '@/i18n/messages';
import type { Translator } from '@/i18n/translate';
import {
  DEMO_PROJECTS,
  type DemoTranslator,
  demoProjectNameOf,
  demoProjectOf,
} from '../demo/demo-projects';
import {
  DEMO_ACCOUNT_ID,
  DEMO_FIRST_EVENT_AT,
  demoProjectSettingsWire,
} from './demo-project-settings';
import type { IProjectsService } from './projects-service.interface';

export const DEMO_OWNER_EMAIL = 'owner@example.com';

export function demoMeResponse(t: Translator<SourceMessages>, now: Date) {
  return {
    email: DEMO_OWNER_EMAIL,
    projects: DEMO_PROJECTS.map((project) => ({
      id: project.id,
      name: demoProjectNameOf(project, t),
      timezone: project.timezone,
      conversion_event: project.conversionEvent,
      first_event_at: DEMO_FIRST_EVENT_AT,
      last_event_at: now.toISOString(),
      icon_version: null,
      account_id: DEMO_ACCOUNT_ID,
      ingestion_suspended_at: null,
      ingestion_suspension_reason: null,
    })),
  };
}

export function demoAdminOf(t: Translator<SourceMessages>, now: Date): Admin {
  return meResponseSchema.parse(demoMeResponse(t, now));
}

export class MockProjectsService implements IProjectsService {
  constructor(private readonly translator: DemoTranslator) {}

  async currentAdmin(): Promise<Admin> {
    return demoAdminOf(await this.translator(), new Date());
  }

  icon(): Promise<ProjectIcon | null> {
    return Promise.resolve(null);
  }

  async settings(projectId: string): Promise<ProjectSettings> {
    const name = demoProjectNameOf(demoProjectOf(projectId), await this.translator());
    return projectSettingsResponseSchema.parse(
      demoProjectSettingsWire(projectId, new Date(), name),
    );
  }
}
