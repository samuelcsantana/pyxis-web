import type { Metadata } from 'next';
import { BrandedPage } from '@/components/brand/branded-page';
import { NotFoundPanel } from '@/components/states/not-found-panel';
import { getTranslator } from '@/i18n/get-messages';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('notFound.title') };
}

export default async function NotFound() {
  const t = await getTranslator();
  return (
    <BrandedPage>
      <NotFoundPanel
        title={t('notFound.title')}
        explanation={t('notFound.outside')}
        href="/"
        linkLabel={t('notFound.toProjects')}
      />
    </BrandedPage>
  );
}
