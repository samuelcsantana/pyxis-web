import { describe, expect, it } from 'vitest';
import type { LegalConfig } from './legal-config';
import {
  DATA_PROCESSING_AGREEMENT,
  LEGAL_DOCUMENTS,
  PRIVACY_POLICY,
  TERMS_OF_USE,
} from './legal-documents';
import { legalHtmlOf, legalSourceOf, legalTextOf, OPEN_EFFECTIVE_DATE } from './legal-text';

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

describe('legal text', () => {
  it('fills the seller, the version and the effective date into the document', () => {
    expect(legalTextOf(SOURCE, CONFIG)).toBe(
      '**Versão 1.1, vigente a partir de 20 de outubro de 2026.**\n\n' +
        'Oferecido por **Ana Exemplo**, CPF 000.000.000-00, ' +
        'Rua das Flores, 10, Centro, Cidade/UF, CEP 00000-000.',
    );
  });

  it('says the terms start with the sign-up while no date is set', () => {
    expect(legalTextOf(SOURCE, { ...CONFIG, effectiveFrom: null })).toContain(
      `vigente a partir ${OPEN_EFFECTIVE_DATE}.`,
    );
  });

  it('escapes what the configuration holds, so it can never become markup', () => {
    const text = legalTextOf('{{seller.name}} {{seller.address}}', {
      ...CONFIG,
      seller: { ...CONFIG.seller, name: '<b>"Ana" & Cia</b>', address: "O'Brien" },
    });

    expect(text).toBe('&lt;b&gt;&quot;Ana&quot; &amp; Cia&lt;/b&gt; O&#39;Brien');
  });

  it('renders the tables, the numbered lists and the links of the documents', () => {
    const html = legalHtmlOf(
      '| Item | Limite |\n|---|---|\n| Sites | até 3 |\n\n7. sete\n8. oito\n\n[Anexo 2](/privacidade)',
    );

    expect(html).toContain('<table>');
    expect(html).toContain('<td>até 3</td>');
    expect(html).toContain('<ol start="7">');
    expect(html).toContain('<a href="/privacidade">Anexo 2</a>');
  });

  it('reads the three documents, each with every token the configuration fills', async () => {
    const sources = await Promise.all(LEGAL_DOCUMENTS.map(legalSourceOf));

    for (const source of sources) {
      const text = legalTextOf(source, CONFIG);
      expect(text).not.toContain('{{');
      expect(text).toContain('Versão 1.1');
      expect(text).toContain('Ana Exemplo');
    }
    expect(sources.map((source) => source.split('\n', 1)[0])).toEqual([
      '# Termos de Uso do Pyxis',
      '# Política de Privacidade do Pyxis',
      '# Acordo de Tratamento de Dados Pessoais do Pyxis',
    ]);
    expect([TERMS_OF_USE, PRIVACY_POLICY, DATA_PROCESSING_AGREEMENT]).toEqual(LEGAL_DOCUMENTS);
  });
});
