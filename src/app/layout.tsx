import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { isDemoMode } from '@/lib/api-config';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/site';
import { themeColorFor } from '@/lib/theme';
import { chosenTheme } from '@/lib/theme-cookie';
import { DOCUMENT_FONT_CLASSES } from './fonts';
import './globals.css';

const NOT_INDEXED: Metadata['robots'] = { index: false, follow: false };
const DEMO_SHARE_TITLE = `${APP_NAME} live demo`;

export function generateMetadata(): Metadata {
  const demo = isDemoMode();
  const shareTitle = demo ? DEMO_SHARE_TITLE : APP_NAME;
  return {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    robots: demo ? null : NOT_INDEXED,
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      title: shareTitle,
      description: APP_DESCRIPTION,
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description: APP_DESCRIPTION },
  };
}

export async function generateViewport(): Promise<Viewport> {
  return { themeColor: themeColorFor(await chosenTheme()) };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme={await chosenTheme()} className={DOCUMENT_FONT_CLASSES}>
      <body>{children}</body>
    </html>
  );
}
