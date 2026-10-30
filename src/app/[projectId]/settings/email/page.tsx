import {
  type ProjectPageProps,
  ProjectSectionPage,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { emailBody } from '@/app/[projectId]/settings/sections/email-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'email');
}

export default function SettingsEmailPage(props: ProjectPageProps) {
  return <ProjectSectionPage {...props} section="email" body={emailBody} />;
}
