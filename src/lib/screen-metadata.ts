import type { Metadata } from 'next';
import { type ScreenSlug, screenLabelKey } from '@/components/shell/screens';
import { getTranslator } from '@/i18n/get-messages';
import { projectOrNotFound } from './current-admin';

export interface ScreenMetadataProps {
  readonly params: Promise<{ readonly projectId: string }>;
}

export function screenMetadata(
  screen: ScreenSlug,
): (props: ScreenMetadataProps) => Promise<Metadata> {
  return async ({ params }) => {
    const { project } = await projectOrNotFound((await params).projectId);
    const t = await getTranslator();
    return {
      title: t('meta.screenTitle', { screen: t(screenLabelKey(screen)), project: project.name }),
    };
  };
}
