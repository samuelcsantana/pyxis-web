import {
  type ProjectPageProps,
  ProjectSectionPage,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { keysBody } from '@/app/[projectId]/settings/sections/keys-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'keys');
}

export default function SettingsKeysPage(props: ProjectPageProps) {
  return <ProjectSectionPage {...props} section="keys" body={keysBody} />;
}
