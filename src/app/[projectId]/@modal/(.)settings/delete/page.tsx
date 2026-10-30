import {
  type ProjectPageProps,
  ProjectSectionWindow,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { deleteBody } from '@/app/[projectId]/settings/sections/delete-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'delete');
}

export default function SettingsDeleteWindow(props: ProjectPageProps) {
  return <ProjectSectionWindow {...props} section="delete" body={deleteBody} />;
}
