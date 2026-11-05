import { notFound } from 'next/navigation';
import { renderSharedPage, sharedPageMetadata } from '@/lib/shared-page-route';

export interface SharedScreenPageProps {
  readonly params: Promise<{ readonly token: string; readonly screen: string }>;
}

const OVERVIEW = 'overview';

export const generateMetadata = sharedPageMetadata;

export default async function SharedScreenPage({ params }: SharedScreenPageProps) {
  const { token, screen } = await params;
  if (screen === OVERVIEW) {
    notFound();
  }
  return renderSharedPage(token, screen);
}
