import {
  type ProjectPageProps,
  ProjectSectionWindow,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { emailBody } from '@/app/[projectId]/settings/sections/email-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'email');
}

export default function SettingsEmailWindow(props: ProjectPageProps) {
  return <ProjectSectionWindow {...props} section="email" body={emailBody} />;
}
