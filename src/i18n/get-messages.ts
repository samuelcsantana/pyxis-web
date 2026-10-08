import { currentLocale } from './current-locale';
import { createI18n, type I18n } from './i18n';
import type { Locale } from './locales';
import {
  CLIENT_NAMESPACES,
  type ClientMessages,
  type Messages,
  pickNamespaces,
  type SourceMessages,
} from './messages';
import { createTranslator, type Translator } from './translate';

const LOADERS: Readonly<Record<Locale, () => Promise<Messages>>> = {
  en: async () => (await import('./messages/en')).en,
  'pt-BR': async () => (await import('./messages/pt-BR')).ptBR,
};

export function loadMessages(locale: Locale): Promise<Messages> {
  return LOADERS[locale]();
}

export async function clientMessages(locale: Locale): Promise<ClientMessages> {
  return pickNamespaces(await loadMessages(locale), CLIENT_NAMESPACES);
}

export async function getTranslator(): Promise<Translator<SourceMessages>> {
  const locale = await currentLocale();
  return createTranslator<SourceMessages>(await loadMessages(locale), locale);
}

export async function getI18n(): Promise<I18n> {
  const locale = await currentLocale();
  return createI18n(locale, await loadMessages(locale));
}
