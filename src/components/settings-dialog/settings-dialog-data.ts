import type { AccessToken } from '@/domain/access-tokens';
import type { Account } from '@/domain/accounts';
import type { ConnectedApps } from '@/domain/connections';
import type { EmailPreferences } from '@/domain/email-preferences';
import type { Goal } from '@/domain/goals';
import type { ProjectPerson } from '@/domain/project-people';
import { canManageProject, type ProjectSettings } from '@/domain/project-settings';
import type { AdminSession } from '@/domain/sessions';
import type { FreePlanState } from '@/domain/sign-up';
import { currentAdmin, projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { bestEffortFreePlanState } from '@/lib/free-plan-state';
import type { Theme } from '@/lib/theme';
import { chosenTheme } from '@/lib/theme-cookie';
import { createAccessTokensService } from '@/services/access-tokens/access-tokens-service.factory';
import { createAccountsService } from '@/services/accounts/accounts-service.factory';
import { createConnectionsService } from '@/services/connections/connections-service.factory';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createGoalsService } from '@/services/goals/goals-service.factory';
import { createProjectPeopleService } from '@/services/project-people/project-people-service.factory';
import { createProjectsService } from '@/services/projects/projects-service.factory';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';

export interface SettingsDialogData {
  readonly projectId: string;
  readonly email: string;
  readonly theme: Theme | undefined;
  readonly settings: ProjectSettings;
  readonly owner: boolean;
  readonly accounts: readonly Account[];
  readonly freePlan: FreePlanState;
  readonly emailPreferences: EmailPreferences;
  readonly sessions: readonly AdminSession[];
  readonly accessTokens: readonly AccessToken[];
  readonly connectedApps: ConnectedApps;
  readonly people: readonly ProjectPerson[];
  readonly goals: readonly Goal[];
}

export async function readSettingsDialogData(projectId: string): Promise<SettingsDialogData> {
  const [{ project }, admin, theme, accounts, freePlan] = await Promise.all([
    projectOrNotFound(projectId),
    currentAdmin(),
    chosenTheme(),
    readOrSignIn(() => createAccountsService().list()),
    bestEffortFreePlanState(),
  ]);
  const [settings, emailPreferences, sessions, accessTokens, connectedApps, people, goals] =
    await Promise.all([
      readOrSignIn(() => createProjectsService().settings(project.id)),
      readOrSignIn(() => createEmailPreferencesService().preferences(project.id)),
      readOrSignIn(() => createSessionsService().list()),
      readOrSignIn(() => createAccessTokensService().list()),
      readOrSignIn(() => createConnectionsService().list()),
      readOrSignIn(() => createProjectPeopleService().list(project.id)),
      readOrSignIn(() => createGoalsService().list(project.id)),
    ]);
  return {
    projectId: project.id,
    email: admin.email,
    theme,
    settings,
    owner: canManageProject(settings),
    accounts,
    freePlan,
    emailPreferences,
    sessions,
    accessTokens,
    connectedApps,
    people,
    goals,
  };
}
