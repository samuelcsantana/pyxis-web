import type { Metadata } from 'next';
import { ProjectSettingsView } from '@/components/settings/project-settings-view';
import { MainContent } from '@/components/shell/main-content';
import { settingsHref } from '@/components/shell/screens';
import { Topbar } from '@/components/shell/topbar';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import { demoCanonical } from '@/lib/demo-canonical';
import type { ScreenMetadataProps } from '@/lib/screen-metadata';
import { timeZoneChoices } from '@/domain/project-management';
import { canManageProject, type ProjectSettings } from '@/domain/project-settings';
import { createAccessTokensService } from '@/services/access-tokens/access-tokens-service.factory';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createProjectPeopleService } from '@/services/project-people/project-people-service.factory';
import { createProjectsService } from '@/services/projects/projects-service.factory';
import { createSessionsService } from '@/services/sessions/sessions-service.factory';
import {
  addProjectPerson,
  chooseEmailPreferences,
  createAccessToken,
  createProjectKey,
  deleteProject,
  endSession,
  removeProjectPerson,
  revokeAccessToken,
  revokeProjectKey,
  updateProject,
} from './actions';

const SUBTITLES = {
  owner: 'settings.subtitleOwner',
  member: 'settings.subtitleMember',
  operator: 'settings.subtitle',
} as const;

function subtitleOf(settings: ProjectSettings) {
  if (canManageProject(settings)) {
    return SUBTITLES.owner;
  }
  return settings.role === 'member' ? SUBTITLES.member : SUBTITLES.operator;
}

export interface SettingsPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
}

export async function generateMetadata({ params }: ScreenMetadataProps): Promise<Metadata> {
  const { project } = await projectOrNotFound((await params).projectId);
  const t = await getTranslator();
  return {
    title: t('meta.screenTitle', { screen: t('settings.title'), project: project.name }),
    ...demoCanonical(settingsHref(project.id)),
  };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { admin, project } = await projectOrNotFound((await params).projectId);
  const [settings, emailPreferences, sessions, accessTokens, people] = await Promise.all([
    readOrSignIn(() => createProjectsService().settings(project.id)),
    readOrSignIn(() => createEmailPreferencesService().preferences(project.id)),
    readOrSignIn(() => createSessionsService().list()),
    readOrSignIn(() => createAccessTokensService().list()),
    readOrSignIn(() => createProjectPeopleService().list(project.id)),
  ]);
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title={i18n.t('settings.title')}
        subtitle={i18n.t(subtitleOf(settings), { project: project.name })}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <ProjectSettingsView
          settings={settings}
          i18n={i18n}
          emailPreferences={emailPreferences}
          chooseEmailPreferences={chooseEmailPreferences.bind(null, project.id)}
          sessions={sessions}
          endSession={endSession.bind(null, project.id)}
          accessTokens={accessTokens}
          createAccessToken={createAccessToken.bind(null, project.id)}
          revokeAccessToken={revokeAccessToken.bind(null, project.id)}
          manage={{
            timezones: timeZoneChoices(settings.timezone),
            save: updateProject.bind(null, project.id),
            createKey: createProjectKey.bind(null, project.id),
            revokeKey: revokeProjectKey.bind(null, project.id),
            remove: deleteProject.bind(null, project.id),
            addPerson: addProjectPerson.bind(null, project.id),
            removePerson: removeProjectPerson.bind(null, project.id),
          }}
          people={people}
          myEmail={admin.email}
        />
      </MainContent>
    </>
  );
}
