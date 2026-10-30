import { DeletePart } from '@/components/settings/project-actions-parts';
import type { ProjectBodyInput } from '@/app/[projectId]/settings/settings-sections';
import { deleteProject } from '../actions';

export function deleteBody({ settings, i18n }: ProjectBodyInput) {
  return (
    <DeletePart settings={settings} i18n={i18n} remove={deleteProject.bind(null, settings.id)} />
  );
}
