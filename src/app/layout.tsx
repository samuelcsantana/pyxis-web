import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/site';
import { themeColorFor } from '@/lib/theme';
import { chosenTheme } from '@/lib/theme-cookie';
import { DOCUMENT_FONT_CLASSES } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

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
