import { Breakable } from '@/components/ui/breakable';
import { projectActivity, type ProjectSettings } from '@/domain/project-settings';
import type { I18n } from '@/i18n/i18n';
import { CitySwitch, type SetCity } from './city-switch';
import { CODE, Field, ITEM_LIST, NOTE, PART_STACK, SubSection, type When } from './part-pieces';
import { ProjectForm, type SaveProject } from './project-form';

export interface ProjectManagement {
  readonly timezones: readonly string[];
  readonly save: SaveProject;
  readonly setCity: SetCity;
}

export interface ProjectPartProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly when: When;
  readonly manage: ProjectManagement | null;
}

interface PieceProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly when: When;
}

function ProjectFacts({ settings, i18n, when }: PieceProps) {
  return (
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
  );
}

function Origins({ settings, i18n }: Omit<PieceProps, 'when'>) {
  return (
    <SubSection id="settings-origins-heading" title={i18n.t('settings.origins.heading')}>
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
    </SubSection>
  );
}

function Activity({ settings, i18n, when }: PieceProps) {
  const activity = projectActivity(settings);
  return (
    <SubSection id="settings-activity-heading" title={i18n.t('settings.activity.heading')}>
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
    </SubSection>
  );
}

function Retention({ settings, i18n }: Omit<PieceProps, 'when'>) {
  return (
    <SubSection id="settings-retention-heading" title={i18n.t('settings.retention.heading')}>
      <p className="text-sm">
        {i18n.t('settings.retention.body', {
          months: i18n.format.count(settings.eventRetentionMonths),
        })}
      </p>
    </SubSection>
  );
}

interface CityProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly setCity: SetCity | null;
}

function City({ settings, i18n, setCity }: CityProps) {
  return (
    <SubSection id="settings-city-heading" title={i18n.t('cityOption.heading')}>
      {setCity === null ? (
        <p className="text-sm">
          {i18n.t(settings.cityEnabled ? 'cityOption.readOnlyOn' : 'cityOption.readOnlyOff')}
        </p>
      ) : (
        <CitySwitch initial={settings.cityEnabled} setCity={setCity} />
      )}
    </SubSection>
  );
}

export function ProjectPart({ settings, i18n, when, manage }: ProjectPartProps) {
  const pieces = { settings, i18n, when };
  if (manage === null) {
    return (
      <div className={PART_STACK}>
        <ProjectFacts {...pieces} />
        <Origins settings={settings} i18n={i18n} />
        <Activity {...pieces} />
        <Retention settings={settings} i18n={i18n} />
        <City settings={settings} i18n={i18n} setCity={null} />
      </div>
    );
  }
  return (
    <div className={PART_STACK}>
      <div className="flex flex-col gap-3">
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
      </div>
      <Activity {...pieces} />
      <Retention settings={settings} i18n={i18n} />
      <City settings={settings} i18n={i18n} setCity={manage.setCity} />
    </div>
  );
}
