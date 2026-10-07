import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { isDemoMode } from '@/lib/api-config';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/site';
import { themeColorFor } from '@/lib/theme';
import { chosenTheme } from '@/lib/theme-cookie';
import { DOCUMENT_FONT_CLASSES } from './fonts';
import './globals.css';

const NOT_INDEXED: Metadata['robots'] = { index: false, follow: false };

export function generateMetadata(): Metadata {
  return {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    robots: isDemoMode() ? null : NOT_INDEXED,
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
