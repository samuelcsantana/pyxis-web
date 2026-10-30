import { TEXT_LINK } from '@/components/ui/control-classes';
import { SUPPORT_EMAIL } from '@/domain/accounts';
import type { EmailPreferences } from '@/domain/email-preferences';
import { EXPORT_FILE_DAYS, MAX_EXPORTS_PER_DAY } from '@/domain/exports';
import { isProjectDeletionHeld, type ProjectSettings } from '@/domain/project-settings';
import type { I18n } from '@/i18n/i18n';
import { rich } from '@/i18n/rich';
import { type DeleteProject, DeleteProjectForm } from './delete-project-form';
import { NOTE } from './part-pieces';
import { type RequestExport, RequestExportButton } from './request-export-button';
import { type ChooseEmailPreferences, WeeklyDigestSwitch } from './weekly-digest-switch';

export interface EmailPartProps {
  readonly settings: ProjectSettings;
  readonly preferences: EmailPreferences;
  readonly choose: ChooseEmailPreferences;
}

export function EmailPart({ settings, preferences, choose }: EmailPartProps) {
  return <WeeklyDigestSwitch initial={preferences} timezone={settings.timezone} choose={choose} />;
}

export interface ExportPartProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly request: RequestExport;
}

export function ExportPart({ settings, i18n, request }: ExportPartProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className={NOTE}>
        {i18n.t('exportEvents.note', {
          days: i18n.format.count(EXPORT_FILE_DAYS),
          max: i18n.format.count(MAX_EXPORTS_PER_DAY),
        })}
      </p>
      <RequestExportButton projectId={settings.id} request={request} />
    </div>
  );
}

export interface DeletePartProps {
  readonly settings: ProjectSettings;
  readonly i18n: I18n;
  readonly remove: DeleteProject;
}

export function DeletePart({ settings, i18n, remove }: DeletePartProps) {
  if (isProjectDeletionHeld(settings)) {
    return (
      <p className="text-sm">
        {rich(i18n.t('settings.deletionHeld'), {
          mail: (text) => (
            <a href={`mailto:${SUPPORT_EMAIL}`} className={TEXT_LINK}>
              {text}
            </a>
          ),
        })}
      </p>
    );
  }
  return <DeleteProjectForm projectName={settings.name} remove={remove} />;
}
