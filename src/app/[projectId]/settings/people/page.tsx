import {
  type ProjectPageProps,
  ProjectSectionPage,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { peopleBody } from '@/app/[projectId]/settings/sections/people-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'people');
}

export default function SettingsPeoplePage(props: ProjectPageProps) {
  return <ProjectSectionPage {...props} section="people" body={peopleBody} />;
}
