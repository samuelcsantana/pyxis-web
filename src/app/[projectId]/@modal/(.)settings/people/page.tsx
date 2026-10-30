import {
  type ProjectPageProps,
  ProjectSectionWindow,
  projectSectionMetadata,
} from '@/app/[projectId]/settings/settings-sections';
import { peopleBody } from '@/app/[projectId]/settings/sections/people-body';

export function generateMetadata(props: ProjectPageProps) {
  return projectSectionMetadata(props, 'people');
}

export default function SettingsPeopleWindow(props: ProjectPageProps) {
  return <ProjectSectionWindow {...props} section="people" body={peopleBody} />;
}
