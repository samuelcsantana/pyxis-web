import type { ReactNode } from 'react';
import { SETTINGS_KEYS_PANEL } from '@/components/shell/screens';
import { Breakable } from '@/components/ui/breakable';
import { TEXT_LINK } from '@/components/ui/control-classes';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import { SUPPORT_EMAIL } from '@/domain/accounts';
import {
  canManageProject,
  hasLivePublicKey,
  isProjectDeletionHeld,
  projectActivity,
  type ProjectKeySummary,
  type ProjectSettings,
} from '@/domain/project-settings';
import type { AccessToken } from '@/domain/access-tokens';
import { EXPORT_FILE_DAYS, MAX_EXPORTS_PER_DAY } from '@/domain/exports';
import type { ProjectPerson } from '@/domain/project-people';
import type { EmailPreferences } from '@/domain/email-preferences';
import type { AdminSession } from '@/domain/sessions';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { AccessTokensPanel } from './access-tokens-panel';
import type { CreateAccessToken } from './create-access-token-form';
import { type CreateProjectKey, CreateProjectKeyButton } from './create-project-key-button';
import type { AddPerson } from './add-person-form';
import { type DeleteProject, DeleteProjectForm } from './delete-project-form';
import { NoLiveKeyNotice } from './no-live-key-notice';
import { PeoplePanel } from './people-panel';
import { type RequestExport, RequestExportButton } from './request-export-button';
import { ProjectForm, type SaveProject } from './project-form';
import type { RemovePerson } from './remove-person-button';
import { type RevokeProjectKey, RevokeProjectKeyButton } from './revoke-project-key-button';
import type { EndSession } from './end-session-button';
import type { RevokeAccessToken } from './revoke-access-token-button';
import { SessionsPanel } from './sessions-panel';
import { type ChooseEmailPreferences, WeeklyDigestSwitch } from './weekly-digest-switch';

export interface ProjectManagement {
  readonly timezones: readonly string[];
  readonly save: SaveProject;
  readonly createKey: CreateProjectKey;
  readonly revokeKey: RevokeProjectKey;
  readonly remove: DeleteProject;
  readonly addPerson: AddPerson;
  readonly removePerson: RemovePerson;
  readonly requestExport: RequestExport;
}

export interface ProjectSettingsViewProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly emailPreferences: EmailPreferences;
  readonly chooseEmailPreferences: ChooseEmailPreferences;
  readonly sessions: readonly AdminSession[];
  readonly endSession: EndSession;
  readonly accessTokens: readonly AccessToken[];
  readonly createAccessToken: CreateAccessToken;
  readonly revokeAccessToken: RevokeAccessToken;
  readonly manage: ProjectManagement;
  readonly people: readonly ProjectPerson[];
  readonly myEmail: string;
}

const TERM = 'text-xs font-medium text-muted';
const DEFINITION = 'text-sm text-ink wrap-anywhere';
const NOTE = 'text-xs leading-[18px] text-muted';
const CODE = 'font-mono text-sm';
const SUBHEADING = 'text-sm font-semibold';
const ITEM_LIST = 'flex flex-col gap-1.5';

interface SettingsPanelProps {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
}

function SettingsPanel({ id, title, children }: SettingsPanelProps) {
  return (
    <section aria-labelledby={`${id}-heading`} className={PANEL}>
      <h2 id={`${id}-heading`} className={PANEL_TITLE}>
        {title}
      </h2>
      {children}
    </section>
  );
}

interface FieldProps {
  readonly term: string;
  readonly children: ReactNode;
}

function Field({ term, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={TERM}>{term}</dt>
      <dd className={DEFINITION}>{children}</dd>
    </div>
  );
}

function ProjectPanel({ settings, i18n, when }: SectionProps) {
  return (
    <SettingsPanel id="settings-project" title={i18n.t('settings.project.heading')}>
      <dl className="flex flex-col gap-3">
        <Field term={i18n.t('settings.project.name')}>{settings.name}</Field>
        <Field term={i18n.t('settings.project.timezone')}>{settings.timezone}</Field>
        <Field term={i18n.t('settings.project.conversionEvent')}>
          {settings.conversionEvent === null ? (
            i18n.t('settings.project.noConversionEvent')
          ) : (
            <code className={CODE}>
              <Breakable text={settings.conversionEvent} />
            </code>
          )}
        </Field>
        <Field term={i18n.t('settings.project.created')}>{when(settings.createdAt)}</Field>
      </dl>
    </SettingsPanel>
  );
}

function ActivityPanel({ settings, i18n, when }: SectionProps) {
  const activity = projectActivity(settings);
  return (
    <SettingsPanel id="settings-activity" title={i18n.t('settings.activity.heading')}>
      {activity.kind === 'waiting' ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">{i18n.t('settings.activity.waiting')}</p>
          <p className={NOTE}>{i18n.t('settings.activity.install')}</p>
        </div>
      ) : (
        <dl className="flex flex-col gap-3">
          <Field term={i18n.t('settings.activity.firstEvent')}>{when(activity.firstEventAt)}</Field>
          <Field term={i18n.t('settings.activity.latestEvent')}>{when(activity.lastEventAt)}</Field>
        </dl>
      )}
    </SettingsPanel>
  );
}

function OriginsPanel({ settings, i18n }: SectionProps) {
  return (
    <SettingsPanel id="settings-origins" title={i18n.t('settings.origins.heading')}>
      {settings.allowedOrigins.length === 0 ? (
        <p className="text-sm">{i18n.t('settings.origins.none')}</p>
      ) : (
        <ul className={ITEM_LIST}>
          {settings.allowedOrigins.map((origin) => (
            <li key={origin} className={CODE}>
              <Breakable text={origin} />
            </li>
          ))}
        </ul>
      )}
      <p className={NOTE}>{i18n.t('settings.origins.note')}</p>
    </SettingsPanel>
  );
}

interface KeyListProps<Key extends ProjectKeySummary> {
  readonly keys: readonly Key[];
  readonly empty: ReactNode;
  readonly describe: (key: Key) => ReactNode;
}

function KeyList<Key extends ProjectKeySummary>({ keys, empty, describe }: KeyListProps<Key>) {
  return keys.length === 0 ? (
    empty
  ) : (
    <ul className={ITEM_LIST}>
      {keys.map((key) => (
        <li key={key.id} className="flex flex-col gap-0.5 text-sm">
          {describe(key)}
        </li>
      ))}
    </ul>
  );
}

function KeysPanel({ settings, i18n, when }: SectionProps) {
  const created = (key: ProjectKeySummary) => (
    <span className="text-xs text-muted">
      {i18n.t('settings.keys.created', { date: when(key.createdAt) })}
    </span>
  );
  return (
    <SettingsPanel id={SETTINGS_KEYS_PANEL} title={i18n.t('settings.keys.heading')}>
      <div className="flex flex-col gap-2">
        <h3 className={SUBHEADING}>{i18n.t('settings.keys.public')}</h3>
        <KeyList
          keys={settings.publicKeys}
          empty={<NoLiveKeyNotice step={{ kind: 'ownerOnly' }} i18n={i18n} />}
          describe={(key) => (
            <>
              <code className={CODE}>
                <Breakable text={key.key} />
              </code>
              {created(key)}
            </>
          )}
        />
        <p className={NOTE}>{i18n.t('settings.keys.publicNote')}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className={SUBHEADING}>{i18n.t('settings.keys.secret')}</h3>
        <KeyList
          keys={settings.secretKeys}
          empty={<p className="text-sm">{i18n.t('settings.keys.noSecretKey')}</p>}
          describe={created}
        />
        <p className={NOTE}>{i18n.t('settings.keys.secretNote')}</p>
      </div>
    </SettingsPanel>
  );
}

export function projectKeyId(keyId: string): string {
  return `project-key-${keyId}`;
}

interface ManagedSectionProps extends SectionProps {
  readonly manage: ProjectManagement;
}

function ProjectEditPanel({ settings, i18n, when, manage }: ManagedSectionProps) {
  return (
    <SettingsPanel id="settings-project" title={i18n.t('projectForm.heading')}>
      <p className={NOTE}>
        {i18n.t('settings.project.createdOn', { date: when(settings.createdAt) })}
      </p>
      <ProjectForm
        saved={{
          name: settings.name,
          allowedOrigins: settings.allowedOrigins,
          timezone: settings.timezone,
          conversionEvent: settings.conversionEvent,
        }}
        timezones={manage.timezones}
        save={manage.save}
      />
    </SettingsPanel>
  );
}

interface ManagedKeyRowProps {
  readonly keyId: string;
  readonly children: ReactNode;
  readonly action: ReactNode;
}

function ManagedKeyRow({ keyId, children, action }: ManagedKeyRowProps) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-2.5 first:pt-0 last:pb-0">
      <div id={projectKeyId(keyId)} className="flex min-w-0 flex-col gap-0.5 text-sm">
        {children}
      </div>
      {action}
    </li>
  );
}

function ManagedKeysPanel({ settings, i18n, when, manage }: ManagedSectionProps) {
  const created = (key: ProjectKeySummary) => (
    <span className="text-xs text-muted">
      {i18n.t('settings.keys.created', { date: when(key.createdAt) })}
    </span>
  );
  const onlyPublicKey = settings.publicKeys.length === 1;
  const revoke = (keyId: string) => (
    <RevokeProjectKeyButton
      keyId={keyId}
      describedBy={projectKeyId(keyId)}
      revoke={manage.revokeKey}
    />
  );
  return (
    <SettingsPanel id={SETTINGS_KEYS_PANEL} title={i18n.t('settings.keys.heading')}>
      <div className="flex flex-col gap-2">
        <h3 className={SUBHEADING}>{i18n.t('settings.keys.public')}</h3>
        {hasLivePublicKey(settings) ? (
          <ul className="flex flex-col divide-y divide-line">
            {settings.publicKeys.map((key) => (
              <ManagedKeyRow
                key={key.id}
                keyId={key.id}
                action={
                  onlyPublicKey ? (
                    <p className="max-w-60 text-xs text-muted">
                      {i18n.t('projectKeys.onlyPublicKey')}
                    </p>
                  ) : (
                    revoke(key.id)
                  )
                }
              >
                <code className={CODE}>
                  <Breakable text={key.key} />
                </code>
                {created(key)}
              </ManagedKeyRow>
            ))}
          </ul>
        ) : (
          <NoLiveKeyNotice step={{ kind: 'createBelow' }} i18n={i18n} />
        )}
        <p className={NOTE}>{i18n.t('settings.keys.publicNote')}</p>
        <CreateProjectKeyButton kind="public" create={manage.createKey} />
      </div>
      <div className="flex flex-col gap-2 border-t border-line pt-3">
        <h3 className={SUBHEADING}>{i18n.t('settings.keys.secret')}</h3>
        {settings.secretKeys.length === 0 ? (
          <p className="text-sm">{i18n.t('settings.keys.noSecretKey')}</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {settings.secretKeys.map((key) => (
              <ManagedKeyRow key={key.id} keyId={key.id} action={revoke(key.id)}>
                {created(key)}
              </ManagedKeyRow>
            ))}
          </ul>
        )}
        <p className={NOTE}>{i18n.t('settings.keys.secretNote')}</p>
        <CreateProjectKeyButton kind="secret" create={manage.createKey} />
      </div>
    </SettingsPanel>
  );
}

function ExportPanel({ settings, i18n, manage }: ManagedSectionProps) {
  return (
    <SettingsPanel id="settings-export" title={i18n.t('exportEvents.heading')}>
      <p className={NOTE}>
        {i18n.t('exportEvents.note', {
          days: i18n.format.count(EXPORT_FILE_DAYS),
          max: i18n.format.count(MAX_EXPORTS_PER_DAY),
        })}
      </p>
      <RequestExportButton projectId={settings.id} request={manage.requestExport} />
    </SettingsPanel>
  );
}

function DeletePanel({ settings, i18n, manage }: ManagedSectionProps) {
  return (
    <SettingsPanel id="settings-delete" title={i18n.t('deleteProject.heading')}>
      {isProjectDeletionHeld(settings) ? (
        <p className="text-sm">
          {rich(i18n.t('settings.deletionHeld'), {
            mail: (text) => (
              <a href={`mailto:${SUPPORT_EMAIL}`} className={TEXT_LINK}>
                {text}
              </a>
            ),
          })}
        </p>
      ) : (
        <DeleteProjectForm projectName={settings.name} remove={manage.remove} />
      )}
    </SettingsPanel>
  );
}

function RetentionPanel({ settings, i18n }: SectionProps) {
  return (
    <SettingsPanel id="settings-retention" title={i18n.t('settings.retention.heading')}>
      <p className="text-sm">
        {i18n.t('settings.retention.body', {
          months: i18n.format.count(settings.eventRetentionMonths),
        })}
      </p>
    </SettingsPanel>
  );
}

interface SectionProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly when: (iso: string) => string;
}

interface EmailPanelProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly preferences: EmailPreferences;
  readonly choose: ChooseEmailPreferences;
}

function EmailPanel({ settings, i18n, preferences, choose }: EmailPanelProps) {
  return (
    <SettingsPanel id="settings-email" title={i18n.t('emailPreferences.heading')}>
      <WeeklyDigestSwitch initial={preferences} timezone={settings.timezone} choose={choose} />
    </SettingsPanel>
  );
}

export function ProjectSettingsView({
  settings,
  i18n,
  emailPreferences,
  chooseEmailPreferences,
  sessions,
  endSession,
  accessTokens,
  createAccessToken,
  revokeAccessToken,
  manage,
  people,
  myEmail,
}: ProjectSettingsViewProps) {
  const format = i18n.format.dateTime('eventTime', settings.timezone);
  const when = (iso: string) => format(new Date(iso));
  const section: SectionProps = { settings, i18n, when };
  const owner = canManageProject(settings);
  return (
    <div className="grid gap-3.5 sm:gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <EmailPanel
          settings={settings}
          i18n={i18n}
          preferences={emailPreferences}
          choose={chooseEmailPreferences}
        />
      </div>
      <div className="lg:col-span-2">
        <SessionsPanel sessions={sessions} i18n={i18n} when={when} end={endSession} />
      </div>
      <div className="lg:col-span-2">
        <AccessTokensPanel
          tokens={accessTokens}
          i18n={i18n}
          when={when}
          create={createAccessToken}
          revoke={revokeAccessToken}
        />
      </div>
      {owner ? (
        <>
          <div className="lg:col-span-2">
            <ProjectEditPanel {...section} manage={manage} />
          </div>
          <ActivityPanel {...section} />
          <RetentionPanel {...section} />
          <div className="lg:col-span-2">
            <ManagedKeysPanel {...section} manage={manage} />
          </div>
          <div className="lg:col-span-2">
            <PeoplePanel
              people={people}
              myEmail={myEmail}
              i18n={i18n}
              when={when}
              manage={{ add: manage.addPerson, remove: manage.removePerson }}
            />
          </div>
          <div className="lg:col-span-2">
            <ExportPanel {...section} manage={manage} />
          </div>
          <div className="lg:col-span-2">
            <DeletePanel {...section} manage={manage} />
          </div>
        </>
      ) : (
        <>
          <ProjectPanel {...section} />
          <ActivityPanel {...section} />
          <OriginsPanel {...section} />
          <RetentionPanel {...section} />
          <div className="lg:col-span-2">
            <KeysPanel {...section} />
          </div>
          <div className="lg:col-span-2">
            <PeoplePanel people={people} myEmail={myEmail} i18n={i18n} when={when} manage={null} />
          </div>
        </>
      )}
    </div>
  );
}
