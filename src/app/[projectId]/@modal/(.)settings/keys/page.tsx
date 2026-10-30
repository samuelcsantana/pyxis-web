import {
  type ProjectPageProps,
  ProjectSectionWindow,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { keysBody } from '@/app/[projectId]/settings/sections/keys-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'keys');
}

export default function SettingsKeysWindow(props: ProjectPageProps) {
  return <ProjectSectionWindow {...props} section="keys" body={keysBody} />;
}
