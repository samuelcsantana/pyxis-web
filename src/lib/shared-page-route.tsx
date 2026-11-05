import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SharedPage } from '@/components/share/shared-page';
import { isSharedScreen, isShareToken } from '@/domain/shared-project';
import { getI18n, getTranslator } from '@/i18n/get-messages';

export const SHARED_PAGE_ROBOTS: Metadata['robots'] = { index: false, follow: false };

export async function sharedPageMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('share.metaTitle'), robots: SHARED_PAGE_ROBOTS };
}

export async function renderSharedPage(token: string, screen: string) {
  if (!isShareToken(token) || !isSharedScreen(screen)) {
    notFound();
  }
  return <SharedPage token={token} screen={screen} i18n={await getI18n()} />;
}
