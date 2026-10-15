import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Marked } from 'marked';
import { type LegalConfig, TERMS_VERSION } from './legal-config';
import type { LegalDocument } from './legal-documents';

export const LEGAL_TEXT_FOLDER = path.join(process.cwd(), 'content', 'legal');
export const OPEN_EFFECTIVE_DATE = 'da abertura do cadastro do Pyxis hospedado';

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
  return markdown.parse(text, { async: false });
}

export async function legalSourceOf(document: LegalDocument): Promise<string> {
  return readFile(path.join(LEGAL_TEXT_FOLDER, document.file), 'utf8');
}
