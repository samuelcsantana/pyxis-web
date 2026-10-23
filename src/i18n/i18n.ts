import { displayTag } from './display-tag';
import { createFormats, type Formats } from './formats';
import type { Locale } from './locales';
import type { Messages, SourceMessages } from './messages';
import { createTranslator, type Translator } from './translate';

export interface I18n {
  readonly locale: Locale;
  readonly t: Translator<SourceMessages>;
  readonly format: Formats;
}

export function createI18n(locale: Locale, messages: Messages): I18n {
  return {
    locale,
    t: createTranslator<SourceMessages>(messages, locale),
    format: createFormats(displayTag(locale)),
  };
}
