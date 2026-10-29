import { describe, expect, it } from 'vitest';
import type { Locale } from '@/i18n/locales';
import type { LegalConfig } from './legal-config';
import { LEGAL_DOCUMENTS, legalDocumentsIn } from './legal-documents';
import { legalSourceOf } from './legal-source';
import { LEGAL_WORDINGS, legalHtmlOf, legalTextOf, OPEN_EFFECTIVE_DATE } from './legal-text';

const CONFIG: LegalConfig = {
  seller: {
    name: 'Ana Exemplo',
    taxId: '000.000.000-00',
    address: 'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000',
  },
  effectiveFrom: '2026-10-20',
};

const SOURCE =
  '**Versão {{terms.version}}, vigente a partir {{terms.effectiveFrom}}.**\n\n' +
  'Oferecido por **{{seller.name}}**, CPF {{seller.taxId}}, {{seller.address}}.';

const TRANSLATIONS = ['en', 'es', 'de', 'fr', 'it', 'nl'] as const satisfies readonly Locale[];

describe('legal text', () => {
  it('fills the seller, the version and the effective date into the document', () => {
    expect(legalTextOf(SOURCE, CONFIG, 'pt-BR')).toBe(
      '**Versão 1.4, vigente a partir de 20 de outubro de 2026.**\n\n' +
        'Oferecido por **Ana Exemplo**, CPF 000.000.000-00, ' +
        'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000.',
    );
  });

  it('says the terms start with the sign-up while no date is set', () => {
    expect(legalTextOf(SOURCE, { ...CONFIG, effectiveFrom: null }, 'pt-BR')).toContain(
      `vigente a partir ${OPEN_EFFECTIVE_DATE}.`,
    );
  });

  it('escapes what the configuration holds, so it can never become markup', () => {
    const text = legalTextOf(
      '{{seller.name}} {{seller.address}}',
      {
        ...CONFIG,
        seller: { ...CONFIG.seller, name: '<b>"Ana" & Cia</b>', address: "O'Brien" },
      },
      'pt-BR',
    );

    expect(text).toBe('&lt;b&gt;&quot;Ana&quot; &amp; Cia&lt;/b&gt; O&#39;Brien');
  });

  it('renders the tables, the numbered lists and the links of the documents', () => {
    const html = legalHtmlOf(
      '| Item | Limite |\n|---|---|\n| Sites | até 3 |\n\n7. sete\n8. oito\n\n[Anexo 2](/privacidade)',
      'pt-BR',
    );

    expect(html).toContain(
      '<div class="legal-table" role="region" tabindex="0" aria-label="Tabela 1"><table>',
    );
    expect(html).toContain('</table></div>');
    expect(html).toContain('<td>até 3</td>');
    expect(html).toContain('<ol start="7">');
    expect(html).toContain('<a href="/privacidade">Anexo 2</a>');
  });

  it.each([
    ['en', 'October 20, 2026', 'the opening of sign-up for hosted Pyxis', 'Table'],
    ['es', 'el 20 de octubre de 2026', 'la apertura del registro en Pyxis alojado', 'Tabla'],
    ['de', '20. Oktober 2026', 'der Öffnung der Registrierung für das gehostete Pyxis', 'Tabelle'],
    ['fr', '20 octobre 2026', 'l’ouverture des inscriptions à Pyxis hébergé', 'Tableau'],
    ['it', 'dal 20 ottobre 2026', 'dall’apertura delle iscrizioni al Pyxis ospitato', 'Tabella'],
    ['nl', '20 oktober 2026', 'de opening van de registratie voor het gehoste Pyxis', 'Tabel'],
  ] as const)(
    'writes the effective date and names the tables in %s',
    (locale, date, opening, table) => {
      const undated = { ...CONFIG, effectiveFrom: null };

      expect(legalTextOf('{{terms.effectiveFrom}}', CONFIG, locale)).toBe(date);
      expect(legalTextOf('{{terms.effectiveFrom}}', undated, locale)).toBe(opening);
      expect(LEGAL_WORDINGS[locale].openEffectiveDate).toBe(opening);
      expect(legalHtmlOf('| a |\n|---|\n| b |', locale)).toContain(`aria-label="${table} 1"`);
    },
  );

  it('reads every document, each with every token the configuration fills', async () => {
    const texts = await Promise.all(
      LEGAL_DOCUMENTS.map(async (document) =>
        legalTextOf(await legalSourceOf(document), CONFIG, document.locale),
      ),
    );

    for (const text of texts) {
      expect(text).not.toContain('{{');
      expect(text).toContain('1.4');
      expect(text).toContain('Ana Exemplo');
    }
    expect(texts.map((text) => text.split('\n', 1)[0])).toEqual([
      '# Termos de Uso do Pyxis',
      '# Política de Privacidade do Pyxis',
      '# Acordo de Tratamento de Dados Pessoais do Pyxis',
      '# Pyxis Terms of Use',
      '# Pyxis Privacy Policy',
      '# Pyxis Personal Data Processing Agreement',
      '# Términos de Uso de Pyxis',
      '# Política de Privacidad de Pyxis',
      '# Acuerdo de Tratamiento de Datos Personales de Pyxis',
      '# Nutzungsbedingungen von Pyxis',
      '# Datenschutzerklärung von Pyxis',
      '# Auftragsverarbeitungsvertrag von Pyxis',
      '# Conditions d’utilisation de Pyxis',
      '# Politique de confidentialité de Pyxis',
      '# Accord de traitement des données personnelles de Pyxis',
      '# Termini di utilizzo di Pyxis',
      '# Informativa sulla privacy di Pyxis',
      '# Accordo sul trattamento dei dati personali di Pyxis',
      '# Gebruiksvoorwaarden van Pyxis',
      '# Privacybeleid van Pyxis',
      '# Verwerkersovereenkomst van Pyxis',
    ]);
  });

  it.each(TRANSLATIONS)(
    'says in %s that the text is a courtesy translation and links the Portuguese one',
    async (locale) => {
      const [terms, privacy, agreement] = await Promise.all(
        legalDocumentsIn(locale).map(legalSourceOf),
      );

      expect(terms).toContain('](/termos)');
      expect(privacy).toContain('](/privacidade)');
      expect(agreement).toContain('](/acordo-de-tratamento)');
      expect(terms).toContain(`](/${locale}/dpa)`);
      expect(terms).toContain(`](/${locale}/privacy)`);
    },
  );
});
