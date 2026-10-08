import { currentLocale } from './current-locale';
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
