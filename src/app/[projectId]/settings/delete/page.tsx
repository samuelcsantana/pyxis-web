import {
  type ProjectPageProps,
  ProjectSectionPage,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { deleteBody } from '@/app/[projectId]/settings/sections/delete-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'delete');
}

export default function SettingsDeletePage(props: ProjectPageProps) {
  return <ProjectSectionPage {...props} section="delete" body={deleteBody} />;
}
