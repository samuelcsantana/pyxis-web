import {
  type ProjectPageProps,
  ProjectSectionPage,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { exportBody } from '@/app/[projectId]/settings/sections/export-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'export');
}

export default function SettingsExportPage(props: ProjectPageProps) {
  return <ProjectSectionPage {...props} section="export" body={exportBody} />;
}
