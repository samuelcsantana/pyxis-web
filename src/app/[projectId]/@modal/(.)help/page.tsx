import {
  accountWindowMetadata,
  HelpSectionWindow,
  type ProjectPageProps,
} from '@/app/[projectId]/settings/settings-sections';
import { helpBody } from '@/app/[projectId]/settings/sections/help-body';
import { HELP_SECTION } from '@/components/settings-window/sections';

export function generateMetadata(props: ProjectPageProps) {
  return accountWindowMetadata(props, HELP_SECTION);
}

export default function HelpWindow(props: ProjectPageProps) {
  return <HelpSectionWindow {...props} body={helpBody} />;
}
