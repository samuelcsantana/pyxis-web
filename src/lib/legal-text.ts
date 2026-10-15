import { Marked } from 'marked';
import { type LegalConfig, TERMS_VERSION } from './legal-config';

export const OPEN_EFFECTIVE_DATE = 'da abertura do cadastro do Pyxis hospedado';

const SCROLLABLE_TABLE = 'role="region" tabindex="0"';

const LONG_DATE = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const markdown = new Marked({ gfm: true, async: false });

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function effectiveFromText(effectiveFrom: string | null): string {
  return effectiveFrom === null
    ? OPEN_EFFECTIVE_DATE
    : `de ${LONG_DATE.format(new Date(`${effectiveFrom}T00:00:00Z`))}`;
}

export function legalTextOf(source: string, config: LegalConfig): string {
  const values: Readonly<Record<string, string>> = {
    '{{seller.name}}': escapeHtml(config.seller.name),
    '{{seller.taxId}}': escapeHtml(config.seller.taxId),
    '{{seller.address}}': escapeHtml(config.seller.address),
    '{{terms.version}}': TERMS_VERSION,
    '{{terms.effectiveFrom}}': effectiveFromText(config.effectiveFrom),
  };
  return Object.entries(values).reduce(
    (text, [token, value]) => text.replaceAll(token, value),
    source,
  );
}

export function legalHtmlOf(text: string): string {
  let tables = 0;
  return markdown
    .parse(text, { async: false })
    .replace(/<table>/g, () => {
      tables += 1;
      return `<div class="legal-table" ${SCROLLABLE_TABLE} aria-label="Tabela ${String(tables)}"><table>`;
    })
    .replaceAll('</table>', '</table></div>');
}
