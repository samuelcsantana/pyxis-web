import {
  type ProjectPageProps,
  ProjectSectionWindow,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { exportBody } from '@/app/[projectId]/settings/sections/export-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'export');
}

export default function SettingsExportWindow(props: ProjectPageProps) {
  return <ProjectSectionWindow {...props} section="export" body={exportBody} />;
}
