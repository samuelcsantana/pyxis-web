import {
  type ProjectPageProps,
  ProjectSectionWindow,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { projectBody } from '@/app/[projectId]/settings/sections/project-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'project');
}

export default function SettingsProjectWindow(props: ProjectPageProps) {
  return <ProjectSectionWindow {...props} section="project" body={projectBody} />;
}
