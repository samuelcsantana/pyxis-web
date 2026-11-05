import { renderSharedPage, sharedPageMetadata } from '@/lib/shared-page-route';

export interface SharedOverviewPageProps {
  readonly params: Promise<{ readonly token: string }>;
}

export const generateMetadata = sharedPageMetadata;

export default async function SharedOverviewPage({ params }: SharedOverviewPageProps) {
  return renderSharedPage((await params).token, 'overview');
}
