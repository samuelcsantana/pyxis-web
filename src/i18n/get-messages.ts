import { currentLocale } from './current-locale';
import { createI18n, type I18n } from './i18n';
import { loadMessages } from './load-messages';
import type { Locale } from './locales';
import {
  CLIENT_NAMESPACES,
  type ClientMessages,
  pickNamespaces,
  type SourceMessages,
} from './messages';
import { createTranslator, type Translator } from './translate';

export { loadMessages } from './load-messages';

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
