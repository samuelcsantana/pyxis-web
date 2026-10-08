import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs-vite';
import type { I18n } from '@/i18n/i18n';
import { DEFAULT_LOCALE, type Locale, LOCALES, localeName, parseLocale } from '@/i18n/locales';
import { MessagesProvider } from '@/i18n/messages-provider';
import { CLIENT_NAMESPACES, type Messages, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { ptBR } from '@/i18n/messages/pt-BR';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import '../src/app/globals.css';

const DICTIONARIES: Readonly<Record<Locale, Messages>> = { en, 'pt-BR': ptBR };
const SERVER_TEXTS: Readonly<Record<Locale, I18n>> = { en: english, 'pt-BR': portuguese };

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
