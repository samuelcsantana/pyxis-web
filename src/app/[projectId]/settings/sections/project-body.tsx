import { ProjectPart } from '@/components/settings/project-part';
import { timeZoneChoices } from '@/domain/project-management';
import type { ProjectBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { setProjectCity, updateProject } from '../actions';

export function projectBody({ settings, i18n, when, owner }: ProjectBodyInput) {
  return (
    <ProjectPart
      settings={settings}
      i18n={i18n}
      when={when}
      manage={
        owner
          ? {
              timezones: timeZoneChoices(settings.timezone),
              save: updateProject.bind(null, settings.id),
              setCity: setProjectCity.bind(null, settings.id),
            }
          : null
      }
    />
  );
}
