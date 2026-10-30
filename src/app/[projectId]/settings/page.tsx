import {
  type ProjectPageProps,
  ProjectSectionPage,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { projectBody } from '@/app/[projectId]/settings/sections/project-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'project');
}

export default function SettingsProjectPage(props: ProjectPageProps) {
  return <ProjectSectionPage {...props} section="project" body={projectBody} />;
}
