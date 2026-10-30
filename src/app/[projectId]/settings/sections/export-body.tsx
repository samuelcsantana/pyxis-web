import { ExportPart } from '@/components/settings/project-actions-parts';
import type { ProjectBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { requestProjectExport } from '../actions';

export function exportBody({ settings, i18n }: ProjectBodyInput) {
  return (
    <ExportPart
      settings={settings}
      i18n={i18n}
      request={requestProjectExport.bind(null, settings.id)}
    />
  );
}
