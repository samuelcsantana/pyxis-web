import type { Locale } from './locales';
import type { Messages } from './messages';

const LOADERS: Readonly<Record<Locale, () => Promise<Messages>>> = {
  en: async () => (await import('./messages/en')).en,
  'pt-BR': async () => (await import('./messages/pt-BR')).ptBR,
  es: async () => (await import('./messages/es')).es,
  de: async () => (await import('./messages/de')).de,
  fr: async () => (await import('./messages/fr')).fr,
  it: async () => (await import('./messages/it')).it,
  nl: async () => (await import('./messages/nl')).nl,
};

export function loadMessages(locale: Locale): Promise<Messages> {
  return LOADERS[locale]();
}
