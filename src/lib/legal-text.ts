import { Marked } from 'marked';
import { displayTag } from '@/i18n/display-tag';
import type { Locale } from '@/i18n/locales';
import { type LegalConfig, TERMS_VERSION } from './legal-config';

interface LegalWording {
  readonly openEffectiveDate: string;
  readonly effectiveDate: (longDate: string) => string;
  readonly table: string;
}

export const LEGAL_WORDINGS: Readonly<Record<Locale, LegalWording>> = {
  'pt-BR': {
    openEffectiveDate: 'da abertura do cadastro do Pyxis hospedado',
    effectiveDate: (longDate) => `de ${longDate}`,
    table: 'Tabela',
  },
  en: {
    openEffectiveDate: 'the opening of sign-up for hosted Pyxis',
    effectiveDate: (longDate) => longDate,
    table: 'Table',
  },
  es: {
    openEffectiveDate: 'la apertura del registro en Pyxis alojado',
    effectiveDate: (longDate) => `el ${longDate}`,
    table: 'Tabla',
  },
  de: {
    openEffectiveDate: 'der Öffnung der Registrierung für das gehostete Pyxis',
    effectiveDate: (longDate) => longDate,
    table: 'Tabelle',
  },
  fr: {
    openEffectiveDate: 'l’ouverture des inscriptions à Pyxis hébergé',
    effectiveDate: (longDate) => longDate,
    table: 'Tableau',
  },
  it: {
    openEffectiveDate: 'dall’apertura delle iscrizioni al Pyxis ospitato',
    effectiveDate: (longDate) => `dal ${longDate}`,
    table: 'Tabella',
  },
  nl: {
    openEffectiveDate: 'de opening van de registratie voor het gehoste Pyxis',
    effectiveDate: (longDate) => longDate,
    table: 'Tabel',
  },
};

export const OPEN_EFFECTIVE_DATE = LEGAL_WORDINGS['pt-BR'].openEffectiveDate;

const SCROLLABLE_TABLE = 'role="region" tabindex="0"';

function longDateOf(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(displayTag(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

const markdown = new Marked({ gfm: true, async: false });

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function effectiveFromText(effectiveFrom: string | null, locale: Locale): string {
  const wording = LEGAL_WORDINGS[locale];
  return effectiveFrom === null
    ? wording.openEffectiveDate
    : wording.effectiveDate(longDateOf(effectiveFrom, locale));
}

export function legalTextOf(source: string, config: LegalConfig, locale: Locale): string {
  const values: Readonly<Record<string, string>> = {
    '{{seller.name}}': escapeHtml(config.seller.name),
    '{{seller.taxId}}': escapeHtml(config.seller.taxId),
    '{{seller.address}}': escapeHtml(config.seller.address),
    '{{terms.version}}': TERMS_VERSION,
    '{{terms.effectiveFrom}}': effectiveFromText(config.effectiveFrom, locale),
  };
  return Object.entries(values).reduce(
    (text, [token, value]) => text.replaceAll(token, value),
    source,
  );
}

export function legalHtmlOf(text: string, locale: Locale): string {
  const tableLabel = LEGAL_WORDINGS[locale].table;
  let tables = 0;
  return markdown
    .parse(text, { async: false })
    .replace(/<table>/g, () => {
      tables += 1;
      return `<div class="legal-table" ${SCROLLABLE_TABLE} aria-label="${tableLabel} ${String(tables)}"><table>`;
    })
    .replaceAll('</table>', '</table></div>');
}
