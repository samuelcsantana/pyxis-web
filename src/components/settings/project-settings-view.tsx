import type { ReactNode } from 'react';
import { Breakable } from '@/components/ui/breakable';
import { PANEL, PANEL_TITLE } from '@/components/ui/panel-classes';
import {
  projectActivity,
  type ProjectKeySummary,
  type ProjectSettings,
} from '@/domain/project-settings';
import type { EmailPreferences } from '@/domain/email-preferences';
import type { I18n } from '@/i18n/i18n';
import { type ChooseEmailPreferences, WeeklyDigestSwitch } from './weekly-digest-switch';

export interface ProjectSettingsViewProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly emailPreferences: EmailPreferences;
  readonly chooseEmailPreferences: ChooseEmailPreferences;
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
  readonly empty: string;
  readonly describe: (key: Key) => ReactNode;
}

function KeyList<Key extends ProjectKeySummary>({ keys, empty, describe }: KeyListProps<Key>) {
  return keys.length === 0 ? (
    <p className="text-sm">{empty}</p>
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
    <SettingsPanel id="settings-keys" title={i18n.t('settings.keys.heading')}>
      <div className="flex flex-col gap-2">
        <h3 className={SUBHEADING}>{i18n.t('settings.keys.public')}</h3>
        <KeyList
          keys={settings.publicKeys}
          empty={i18n.t('settings.keys.noPublicKey')}
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
          empty={i18n.t('settings.keys.noSecretKey')}
          describe={created}
        />
        <p className={NOTE}>{i18n.t('settings.keys.secretNote')}</p>
      </div>
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
}: ProjectSettingsViewProps) {
  const format = i18n.format.dateTime('eventTime', settings.timezone);
  const section: SectionProps = { settings, i18n, when: (iso) => format(new Date(iso)) };
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
      <ProjectPanel {...section} />
      <ActivityPanel {...section} />
      <OriginsPanel {...section} />
      <RetentionPanel {...section} />
      <div className="lg:col-span-2">
        <KeysPanel {...section} />
      </div>
    </div>
  );
}
