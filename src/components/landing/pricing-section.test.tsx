import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { spanish } from '@/test-utils/spanish';
import { CONTACT_EMAIL_ID, PRICING_ID, PricingSection, YEARLY_OPTION_ID } from './pricing-section';

describe('PricingSection', () => {
  it('names the one plan with its monthly price chosen first', () => {
    render(<PricingSection i18n={english} signUpOpen={false} />);

    const section = screen.getByRole('region', {
      name: 'One plan, in reais, with everything the demo shows',
    });
    expect(section).toHaveAttribute('id', PRICING_ID);
    const period = within(section).getByRole('group', { name: 'Billing period' });
    expect(within(period).getByRole('radio', { name: 'Monthly, R$ 39 a month' })).toBeChecked();
    expect(
      within(period).getByRole('radio', { name: 'Yearly, R$ 390 a year, 2 months free' }),
    ).not.toBeChecked();
    expect(within(section).getByText('R$ 39')).toBeInTheDocument();
    expect(within(section).getByText('R$ 390')).toBeInTheDocument();
  });

  it('switches the period without leaving the page', async () => {
    render(<PricingSection i18n={english} signUpOpen={false} />);

    await userEvent.click(screen.getByRole('radio', { name: /^Yearly/ }));

    expect(screen.getByRole('radio', { name: /^Yearly/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /^Monthly/ })).not.toBeChecked();
  });

  it('shows the yearly saving beside the switch, and picks the yearly plan when it is clicked', async () => {
    render(<PricingSection i18n={english} signUpOpen={false} />);

    const period = screen.getByRole('group', { name: 'Billing period' });
    const saving = screen.getByText('2 months free');
    expect(within(period).queryByText('2 months free')).toBeNull();
    expect(saving).toHaveAttribute('for', YEARLY_OPTION_ID);

    await userEvent.click(saving);

    expect(within(period).getByRole('radio', { name: /^Yearly/ })).toBeChecked();
  });

  it('lists what the plan includes, the trial and where it is sold', () => {
    render(<PricingSection i18n={english} signUpOpen={false} />);

    const included = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(included).toEqual(
      expect.arrayContaining([
        'Up to 100,000 events a month',
        'Up to 3 sites',
        'Up to 3 people in the dashboard',
        '13 months of history',
        'A weekly digest by e-mail',
        'The Claude connector (MCP) and access tokens for AI agents',
      ]),
    );
    expect(screen.getByText(/14 days free/)).toBeInTheDocument();
    expect(screen.queryByText(/sold in Brazil only/)).not.toBeInTheDocument();
    expect(screen.getByText(/access is by invitation/)).toBeInTheDocument();
  });

  it('asks for access by e-mail, with what to write and a ready message', async () => {
    render(<PricingSection i18n={english} signUpOpen={false} />);

    const ask = screen.getByText('Request access');
    expect(ask).toHaveAttribute('data-track', 'access_requested');
    expect(ask).toHaveAttribute('data-track-from', PRICING_ID);
    expect(ask.closest('details')).not.toHaveAttribute('open');

    await userEvent.click(ask);

    expect(ask.closest('details')).toHaveAttribute('open');
    expect(document.getElementById(CONTACT_EMAIL_ID)).toHaveTextContent(
      'hello@pyxis-analytics.dev',
    );
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute(
      'data-track-snippet',
      CONTACT_EMAIL_ID,
    );
    expect(screen.getByText(/roughly how many visits/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open in my e-mail app' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=I%20would%20like%20to%20use%20Pyxis',
    );
  });

  it('invites whoever needs more than the plan to ask for a larger one, in their language', () => {
    const { unmount } = render(<PricingSection i18n={english} signUpOpen />);

    expect(screen.getByRole('heading', { name: 'Need more?' })).toBeVisible();
    const ask = screen.getByRole('link', { name: 'Ask about a larger plan' });
    expect(ask).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=A%20larger%20Pyxis%20plan',
    );
    expect(ask).toHaveAttribute('data-track', 'larger_plan_requested');
    expect(ask).toHaveAttribute('data-track-from', 'pricing');
    unmount();

    render(<PricingSection i18n={portuguese} signUpOpen />);
    expect(screen.getByRole('link', { name: 'Falar sobre um plano maior' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=Um%20plano%20maior%20do%20Pyxis',
    );
  });

  it('writes the subject of the message in the visitor’s language', () => {
    const { unmount } = render(<PricingSection i18n={portuguese} signUpOpen={false} />);
    expect(screen.getByRole('radio', { name: 'Mensal, R$ 39 por mês' })).toBeChecked();
    expect(screen.getByRole('link', { name: 'Abrir no meu programa de e-mail' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=Quero%20usar%20o%20Pyxis',
    );
    unmount();

    render(<PricingSection i18n={spanish} signUpOpen={false} />);
    expect(screen.getByRole('link', { name: 'Abrir en mi programa de correo' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=Quiero%20usar%20Pyxis',
    );
  });

  it('says the trial is one per customer', () => {
    render(<PricingSection i18n={english} signUpOpen={false} />);

    expect(
      screen.getByText(
        '14 days free. The card is only charged on day 15, and you can cancel any time. One free trial per customer.',
      ),
    ).toBeInTheDocument();
  });

  describe('the price in the reader’s currency', () => {
    const RATES = { BRL: 5.7197, USD: 1.1253 };

    it('adds an approximate price in dollars under each period on the English page', () => {
      render(<PricingSection i18n={english} signUpOpen={false} euroRates={RATES} />);

      expect(
        screen.getByText(
          'Priced in reais: about US$8 a month. The payment page shows the exact amount in your currency.',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Priced in reais: about US$77 a year. The payment page shows the exact amount in your currency.',
        ),
      ).toBeInTheDocument();
    });

    it('offers dollars or euros on the Spanish page', () => {
      render(<PricingSection i18n={spanish} signUpOpen={false} euroRates={RATES} />);

      expect(
        screen.getByText(/^Precio en reales: unos 8\sUS\$ o 7\s€ al mes\./),
      ).toBeInTheDocument();
    });

    it('adds nothing on the Portuguese page, already in reais', () => {
      render(<PricingSection i18n={portuguese} signUpOpen={false} euroRates={RATES} />);

      expect(screen.queryByText(/Preço em reais: cerca de/)).toBeNull();
    });

    it('adds nothing while the exchange rates are unknown', () => {
      render(<PricingSection i18n={english} signUpOpen={false} />);

      expect(screen.queryByText(/Priced in reais/)).toBeNull();
    });
  });

  describe('once sign-up is open', () => {
    it('starts the free trial on the plan of the chosen period instead of asking by e-mail', () => {
      render(<PricingSection i18n={english} signUpOpen />);

      const [monthly, yearly] = screen.getAllByRole('link', { name: 'Start your free trial' });
      expect(monthly).toHaveAttribute('href', 'https://app.pyxis-analytics.dev/sign-up');
      expect(monthly).toHaveAttribute('data-track', 'sign_up_opened');
      expect(monthly).toHaveAttribute('data-track-interval', 'month');
      expect(yearly).toHaveAttribute(
        'href',
        'https://app.pyxis-analytics.dev/sign-up?interval=year',
      );
      expect(yearly).toHaveAttribute('data-track-from', PRICING_ID);
      expect(yearly?.parentElement).toHaveClass('hidden');
      expect(screen.queryByText('Request access')).toBeNull();
    });

    it('explains how signing up works instead of the invitation', () => {
      render(<PricingSection i18n={portuguese} signUpOpen />);

      expect(screen.getAllByRole('link', { name: 'Começar o teste grátis' })).toHaveLength(2);
      expect(
        screen.getByText(
          'Cadastre-se com um e-mail e um cartão; o painel abre assim que a assinatura é confirmada.',
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/acesso é por convite/)).toBeNull();
    });
  });
});
