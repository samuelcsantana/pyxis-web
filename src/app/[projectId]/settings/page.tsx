import type { Metadata } from 'next';
import { ProjectSettingsView } from '@/components/settings/project-settings-view';
import { MainContent } from '@/components/shell/main-content';
import { Topbar } from '@/components/shell/topbar';
import { getI18n, getTranslator } from '@/i18n/get-messages';
import { projectOrNotFound, readOrSignIn } from '@/lib/current-admin';
import type { ScreenMetadataProps } from '@/lib/screen-metadata';
import { chosenTheme } from '@/lib/theme-cookie';
import { createEmailPreferencesService } from '@/services/preferences/email-preferences-service.factory';
import { createProjectsService } from '@/services/projects/projects-service.factory';
import { chooseEmailPreferences } from './actions';

export interface SettingsPageProps {
  readonly params: Promise<{ readonly projectId: string }>;
}

export async function generateMetadata({ params }: ScreenMetadataProps): Promise<Metadata> {
  const { project } = await projectOrNotFound((await params).projectId);
  const t = await getTranslator();
  return { title: t('meta.screenTitle', { screen: t('settings.title'), project: project.name }) };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { project } = await projectOrNotFound((await params).projectId);
  const [settings, emailPreferences] = await Promise.all([
    readOrSignIn(() => createProjectsService().settings(project.id)),
    readOrSignIn(() => createEmailPreferencesService().preferences(project.id)),
  ]);
  const i18n = await getI18n();
  return (
    <>
      <Topbar
        title={i18n.t('settings.title')}
        subtitle={i18n.t('settings.subtitle', { project: project.name })}
        theme={await chosenTheme()}
      />
      <MainContent className="flex w-full max-w-310 flex-col gap-3.5 p-4 sm:gap-5 sm:px-8 sm:pt-7 sm:pb-12">
        <ProjectSettingsView
          settings={settings}
          i18n={i18n}
          emailPreferences={emailPreferences}
          chooseEmailPreferences={chooseEmailPreferences.bind(null, project.id)}
        />
      </MainContent>
    </>
  );
}
