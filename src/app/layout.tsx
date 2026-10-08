import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { currentLocale } from '@/i18n/current-locale';
import { clientMessages, getTranslator } from '@/i18n/get-messages';
import { MessagesProvider } from '@/i18n/messages-provider';
import { isDemoMode } from '@/lib/api-config';
import { APP_NAME } from '@/lib/site';
import { themeColorFor } from '@/lib/theme';
import { chosenTheme } from '@/lib/theme-cookie';
import { DOCUMENT_FONT_CLASSES } from './fonts';
import './globals.css';

const NOT_INDEXED: Metadata['robots'] = { index: false, follow: false };
const DEMO_SHARE_TITLE = `${APP_NAME} live demo`;
const TITLE_TEMPLATE = `%s · ${APP_NAME}`;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  const description = t('meta.description');
  const demo = isDemoMode();
  const shareTitle = demo ? DEMO_SHARE_TITLE : APP_NAME;
  return {
    title: { template: TITLE_TEMPLATE, default: APP_NAME },
    description,
    robots: demo ? null : NOT_INDEXED,
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      title: shareTitle,
      description,
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description },
  };
}

export async function generateViewport(): Promise<Viewport> {
  return { themeColor: themeColorFor(await chosenTheme()) };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await currentLocale();
  return (
    <html lang={locale} data-theme={await chosenTheme()} className={DOCUMENT_FONT_CLASSES}>
      <body>
        <MessagesProvider locale={locale} messages={await clientMessages(locale)}>
          {children}
        </MessagesProvider>
      </body>
    </html>
  );
}
