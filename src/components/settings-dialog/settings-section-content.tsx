import type { ReactNode } from 'react';
import {
  closeAccount,
  openBillingPortal,
  openCheckout,
  subscribeFromFreePlan,
  withdrawToFreePlan,
} from '@/app/account/actions';
import { AccountOverview } from '@/components/account/account-overview';
import { AccountSupport } from '@/components/account/account-support';
import { InstallGuide } from '@/components/install/install-guide';
import { HelpView } from '@/components/help/help-view';
import { AccessTokensPanel } from '@/components/settings/access-tokens-panel';
import { ConnectedAppsPanel } from '@/components/settings/connected-apps-panel';
import { GoalsPanel } from '@/components/settings/goals-panel';
import { PeoplePanel } from '@/components/settings/people-panel';
import {
  ActivityPanel,
  CityPanel,
  DeletePanel,
  EmailPanel,
  ExportPanel,
  KeysPanel,
  ManagedKeysPanel,
  OriginsPanel,
  type ProjectManagement,
  ProjectEditPanel,
  ProjectPanel,
  RetentionPanel,
  type SectionProps,
  VisitorsPanel,
} from '@/components/settings/project-settings-view';
import { SessionsPanel } from '@/components/settings/sessions-panel';
import { GeneralSection } from './general-section';
import type { SettingsDialogData } from './settings-dialog-data';
import { SETTINGS_SECTIONS, type SettingsSection } from './settings-sections';
import { PANEL } from '@/components/ui/panel-classes';
import { ownedAccounts } from '@/domain/accounts';
import { ownsAnotherFreeAccount } from '@/domain/free-plan';
import { timeZoneChoices } from '@/domain/project-management';
import { supportPlanOf } from '@/domain/support';
import { chooseLocale } from '@/i18n/choose-locale';
import { apiBaseUrl } from '@/lib/api-config';
import { PYXIS_INGESTION_URL } from '@/lib/landing-measurement-config';
import type { I18n } from '@/i18n/i18n';
import {
  addProjectPerson,
  chooseEmailPreferences,
  createGoal,
  createAccessToken,
  createProjectKey,
  deleteGoal,
  deleteProject,
  endSession,
  removeProjectPerson,
  requestProjectExport,
  revokeAccessToken,
  revokeConnection,
  revokeProjectKey,
  setProjectCity,
  setProjectVisitors,
  updateGoal,
  updateProject,
} from '@/app/[projectId]/settings/actions';

export interface SettingsSectionContentProps {
  readonly section: SettingsSection;
  readonly data: SettingsDialogData;
  readonly i18n: I18n;
}

const STACK = 'flex flex-col gap-3.5 sm:gap-4';

function Stack({ children }: { readonly children: ReactNode }) {
  return <div className={STACK}>{children}</div>;
}

const FIRST_PANEL_TITLED_BY_THE_SECTION = '[&>section:first-child>h2:first-child]:sr-only';

function TitledBySection({ children }: { readonly children: ReactNode }) {
  return <div className={`${STACK} ${FIRST_PANEL_TITLED_BY_THE_SECTION}`}>{children}</div>;
}

function ReadOnlyNote({ text }: { readonly text: string }) {
  return (
    <div className={PANEL}>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function managementOf(projectId: string, timezone: string): ProjectManagement {
  return {
    timezones: timeZoneChoices(timezone),
    save: updateProject.bind(null, projectId),
    createKey: createProjectKey.bind(null, projectId),
    revokeKey: revokeProjectKey.bind(null, projectId),
    remove: deleteProject.bind(null, projectId),
    addPerson: addProjectPerson.bind(null, projectId),
    removePerson: removeProjectPerson.bind(null, projectId),
    requestExport: requestProjectExport.bind(null, projectId),
    setCity: setProjectCity.bind(null, projectId),
    setVisitors: setProjectVisitors.bind(null, projectId),
  };
}

function Billing({ data, i18n }: { readonly data: SettingsDialogData; readonly i18n: I18n }) {
  const { accounts, freePlan, email } = data;
  const owned = ownedAccounts(accounts);
  const now = new Date();
  return (
    <Stack>
      {owned.length === 0 ? <ReadOnlyNote text={i18n.t('account.noAccount')} /> : null}
      {owned.map((account) => (
        <AccountOverview
          key={account.id}
          account={account}
          i18n={i18n}
          now={now}
          freePlan={freePlan}
          ownsAnotherFreeAccount={ownsAnotherFreeAccount(account, owned)}
          openCheckout={openCheckout.bind(null, account.id)}
          subscribe={subscribeFromFreePlan.bind(null, account.id)}
          openPortal={openBillingPortal.bind(null, account.id)}
          withdraw={withdrawToFreePlan.bind(null, account.id)}
          close={closeAccount.bind(null, account.id)}
        />
      ))}
      <AccountSupport email={email} plan={supportPlanOf(accounts)} i18n={i18n} />
    </Stack>
  );
}

export function SettingsSectionContent({ section, data, i18n }: SettingsSectionContentProps) {
  const { projectId, settings, owner } = data;
  const format = i18n.format.dateTime('eventTime', settings.timezone);
  const when = (iso: string) => format(new Date(iso));
  const shared: SectionProps = { settings, i18n, when };
  const manage = managementOf(projectId, settings.timezone);
  switch (section) {
    case 'general':
      return (
        <GeneralSection
          email={data.email}
          theme={data.theme}
          i18n={i18n}
          chooseLocale={chooseLocale}
        />
      );
    case 'billing':
      return <Billing data={data} i18n={i18n} />;
    case 'security':
      return (
        <TitledBySection>
          <SessionsPanel
            sessions={data.sessions}
            i18n={i18n}
            when={when}
            end={endSession.bind(null, projectId)}
          />
        </TitledBySection>
      );
    case 'tokens':
      return (
        <TitledBySection>
          <AccessTokensPanel
            tokens={data.accessTokens}
            i18n={i18n}
            when={when}
            create={createAccessToken.bind(null, projectId)}
            revoke={revokeAccessToken.bind(null, projectId)}
          />
        </TitledBySection>
      );
    case 'apps':
      return (
        <TitledBySection>
          <ConnectedAppsPanel
            apps={data.connectedApps}
            i18n={i18n}
            when={when}
            revoke={revokeConnection.bind(null, projectId)}
          />
        </TitledBySection>
      );
    case 'install':
      return (
        <Stack>
          <InstallGuide
            settings={settings}
            endpoint={apiBaseUrl() ?? PYXIS_INGESTION_URL}
            i18n={i18n}
          />
        </Stack>
      );
    case 'project':
      return owner ? (
        <TitledBySection>
          <ProjectEditPanel {...shared} manage={manage} />
          <ActivityPanel {...shared} />
          <RetentionPanel {...shared} />
        </TitledBySection>
      ) : (
        <TitledBySection>
          <ProjectPanel {...shared} />
          <ActivityPanel {...shared} />
          <OriginsPanel {...shared} />
          <RetentionPanel {...shared} />
        </TitledBySection>
      );
    case 'goals':
      return (
        <TitledBySection>
          <GoalsPanel
            goals={data.goals}
            manage={
              owner
                ? {
                    create: createGoal.bind(null, projectId),
                    update: updateGoal.bind(null, projectId),
                    remove: deleteGoal.bind(null, projectId),
                  }
                : null
            }
          />
        </TitledBySection>
      );
    case 'privacy':
      return (
        <Stack>
          <CityPanel settings={settings} i18n={i18n} setCity={owner ? manage.setCity : null} />
          <VisitorsPanel
            settings={settings}
            i18n={i18n}
            setVisitors={owner ? manage.setVisitors : null}
          />
        </Stack>
      );
    case 'keys':
      return (
        <TitledBySection>
          {owner ? <ManagedKeysPanel {...shared} manage={manage} /> : <KeysPanel {...shared} />}
        </TitledBySection>
      );
    case 'people':
      return (
        <TitledBySection>
          <PeoplePanel
            people={data.people}
            myEmail={data.email}
            i18n={i18n}
            when={when}
            manage={owner ? { add: manage.addPerson, remove: manage.removePerson } : null}
          />
        </TitledBySection>
      );
    case 'email':
      return (
        <TitledBySection>
          <EmailPanel
            settings={settings}
            i18n={i18n}
            preferences={data.emailPreferences}
            choose={chooseEmailPreferences.bind(null, projectId)}
          />
        </TitledBySection>
      );
    case 'data':
      return (
        <Stack>
          <ExportPanel {...shared} manage={manage} />
          <DeletePanel {...shared} manage={manage} />
        </Stack>
      );
    case 'help':
      return (
        <HelpView
          projectId={projectId}
          email={data.email}
          plan={supportPlanOf(data.accounts)}
          i18n={i18n}
        />
      );
  }
}

const OWNER_ONLY: ReadonlySet<SettingsSection> = new Set(['data']);

export interface SettingsDialogContent {
  readonly sections: readonly SettingsSection[];
  readonly content: Partial<Readonly<Record<SettingsSection, ReactNode>>>;
}

export function settingsDialogContentOf(
  data: SettingsDialogData,
  i18n: I18n,
): SettingsDialogContent {
  const sections = SETTINGS_SECTIONS.filter((section) => data.owner || !OWNER_ONLY.has(section));
  const content = Object.fromEntries(
    sections.map((section) => [
      section,
      <SettingsSectionContent key={section} section={section} data={data} i18n={i18n} />,
    ]),
  );
  return { sections, content };
}
