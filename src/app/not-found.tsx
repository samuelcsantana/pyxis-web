import type { Metadata } from 'next';
import { BrandedPage } from '@/components/brand/branded-page';
import { NOT_FOUND_TITLE, NotFoundPanel } from '@/components/states/not-found-panel';

export const metadata: Metadata = { title: NOT_FOUND_TITLE };

export default function NotFound() {
  return (
    <BrandedPage>
      <NotFoundPanel
        explanation="This page does not exist, or the project is not one you may read."
        href="/"
        linkLabel="Go to your projects"
      />
    </BrandedPage>
  );
}
