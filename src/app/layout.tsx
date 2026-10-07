import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { themeColorFor } from '@/lib/theme';
import { chosenTheme } from '@/lib/theme-cookie';
import { DOCUMENT_FONT_CLASSES } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pyxis',
  description:
    'Privacy-first product analytics: no cookies on your visitors, no personal data, no third parties.',
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
