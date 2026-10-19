import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs-vite';
import type { I18n } from '@/i18n/i18n';
import { DEFAULT_LOCALE, type Locale, LOCALES, localeName, parseLocale } from '@/i18n/locales';
import { MessagesProvider } from '@/i18n/messages-provider';
import { CLIENT_NAMESPACES, type Messages, pickNamespaces } from '@/i18n/messages';
import { de } from '@/i18n/messages/de';
import { en } from '@/i18n/messages/en';
import { es } from '@/i18n/messages/es';
import { fr } from '@/i18n/messages/fr';
import { it } from '@/i18n/messages/it';
import { nl } from '@/i18n/messages/nl';
import { ptBR } from '@/i18n/messages/pt-BR';
import { dutch } from '@/test-utils/dutch';
import { english } from '@/test-utils/english';
import { french } from '@/test-utils/french';
import { german } from '@/test-utils/german';
import { italian } from '@/test-utils/italian';
import { portuguese } from '@/test-utils/portuguese';
import { spanish } from '@/test-utils/spanish';
import '../src/app/globals.css';

const DICTIONARIES: Readonly<Record<Locale, Messages>> = {
  en,
  'pt-BR': ptBR,
  es,
  de,
  fr,
  it,
  nl,
};
const SERVER_TEXTS: Readonly<Record<Locale, I18n>> = {
  en: english,
  'pt-BR': portuguese,
  es: spanish,
  de: german,
  fr: french,
  it: italian,
  nl: dutch,
};

function storyLocale(value: unknown): Locale {
  return parseLocale(typeof value === 'string' ? value : undefined) ?? DEFAULT_LOCALE;
}

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Interface language',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: LOCALES.map((locale) => ({ value: locale, title: localeName(locale) })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: DEFAULT_LOCALE },
  decorators: [
    (Story, context) => {
      const locale = storyLocale(context.globals.locale);
      const args =
        'i18n' in context.args ? { ...context.args, i18n: SERVER_TEXTS[locale] } : context.args;
      return (
        <MessagesProvider
          locale={locale}
          messages={pickNamespaces(DICTIONARIES[locale], CLIENT_NAMESPACES)}
        >
          <Story args={args} />
        </MessagesProvider>
      );
    },
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
  ],
  parameters: {
    layout: 'centered',
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
