import { createFormats, type Formats } from './formats';
import type { Locale } from './locales';
import type { Messages, SourceMessages } from './messages';
import { createTranslator, type Translator } from './translate';

const DISPLAY_TAGS: Readonly<Record<Locale, string>> = { en: 'en-US' };

export interface I18n {
  readonly locale: Locale;
  readonly t: Translator<SourceMessages>;
  readonly format: Formats;
}

export function createI18n(locale: Locale, messages: Messages): I18n {
  return {
    locale,
    t: createTranslator<SourceMessages>(messages, locale),
    format: createFormats(DISPLAY_TAGS[locale]),
  };
}
