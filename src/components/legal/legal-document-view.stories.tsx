import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import '@/app/legal/[document]/legal.css';
import { PRIVACY_POLICY, TERMS_OF_USE } from '@/lib/legal-documents';
import { legalHtmlOf } from '@/lib/legal-text';
import { portuguese } from '@/test-utils/portuguese';
import { LegalDocumentView } from './legal-document-view';

const SAMPLE = legalHtmlOf(
  [
    '# Termos de Uso do Pyxis',
    '',
    '**Versão 1.1, vigente a partir de 20 de outubro de 2026.**',
    '',
    '## Cláusula 1 — Quem oferece o serviço',
    '',
    '1.1. O Pyxis hospedado é oferecido por **Ana Exemplo**, pessoa física, CPF 000.000.000-00.',
    '',
    '## Cláusula 7 — Plano e limites',
    '',
    '| Item | Limite |',
    '|---|---|',
    '| Eventos recebidos por mês, somando todos os projetos da conta | até 100.000 |',
    '| Sites (projetos) | até 3 |',
    '',
    '7.2. **Atenção: uso acima do limite.**',
    '',
    '1. O uso do mês é a soma dos eventos guardados.',
    '2. **Até 150%, nada é cortado.**',
    '',
    '> **Medição de uso do site** — modelo de aviso.',
  ].join('\n'),
);

const meta = {
  title: 'Legal/LegalDocumentView',
  component: LegalDocumentView,
  parameters: { layout: 'fullscreen' },
  args: { i18n: portuguese, current: TERMS_OF_USE, html: SAMPLE },
  decorators: [
    (Story) => (
      <div className="bg-bg text-ink">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LegalDocumentView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TermsOfUse: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Termos de Uso' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const PrivacyPolicyCurrent: Story = { args: { current: PRIVACY_POLICY } };

export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };

export const DarkTheme: Story = { globals: { theme: 'dark' } };
