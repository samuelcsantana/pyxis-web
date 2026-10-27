import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { portuguese } from '@/test-utils/portuguese';
import { spanish } from '@/test-utils/spanish';
import { PRICING_ID } from './landing-links';
import { CONTACT_EMAIL_ID, PricingSection, YEARLY_OPTION_ID } from './pricing-section';

describe('PricingSection', () => {
  it('names the one plan with its monthly price chosen first', () => {
    render(<PricingSection i18n={english} offer="byInvitation" />);

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
    render(<PricingSection i18n={english} offer="byInvitation" />);

    await userEvent.click(screen.getByRole('radio', { name: /^Yearly/ }));

    expect(screen.getByRole('radio', { name: /^Yearly/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /^Monthly/ })).not.toBeChecked();
  });

  it('shows the yearly saving beside the switch, and picks the yearly plan when it is clicked', async () => {
    render(<PricingSection i18n={english} offer="byInvitation" />);

    const period = screen.getByRole('group', { name: 'Billing period' });
    const saving = screen.getByText('2 months free');
    expect(within(period).queryByText('2 months free')).toBeNull();
    expect(saving).toHaveAttribute('for', YEARLY_OPTION_ID);

    await userEvent.click(saving);

    expect(within(period).getByRole('radio', { name: /^Yearly/ })).toBeChecked();
  });

  it('lists what the plan includes, the trial and where it is sold', () => {
    render(<PricingSection i18n={english} offer="byInvitation" />);

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
    render(<PricingSection i18n={english} offer="byInvitation" />);

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

  it('invites agencies to measure their clients’ sites and to ask for a plan that fits', () => {
    const { unmount } = render(<PricingSection i18n={english} offer="trial" />);

    expect(screen.getByRole('heading', { name: 'For agencies and developers' })).toBeVisible();
    expect(
      screen.getByText(/each client signs in with their own e-mail and sees only their project/),
    ).toBeVisible();
    const ask = screen.getByRole('link', { name: 'Ask about a plan for agencies' });
    expect(ask).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=A%20Pyxis%20plan%20for%20an%20agency',
    );
    expect(ask).toHaveAttribute('data-track', 'larger_plan_requested');
    expect(ask).toHaveAttribute('data-track-from', 'pricing');
    unmount();

    render(<PricingSection i18n={portuguese} offer="trial" />);
    expect(screen.getByRole('link', { name: 'Falar sobre um plano para agência' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=Um%20plano%20do%20Pyxis%20para%20ag%C3%AAncia',
    );
  });

  it('writes the subject of the message in the visitor’s language', () => {
    const { unmount } = render(<PricingSection i18n={portuguese} offer="byInvitation" />);
    expect(screen.getByRole('radio', { name: 'Mensal, R$ 39 por mês' })).toBeChecked();
    expect(screen.getByRole('link', { name: 'Abrir no meu programa de e-mail' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=Quero%20usar%20o%20Pyxis',
    );
    unmount();

    render(<PricingSection i18n={spanish} offer="byInvitation" />);
    expect(screen.getByRole('link', { name: 'Abrir en mi programa de correo' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev?subject=Quiero%20usar%20Pyxis',
    );
  });

  it('says the trial is one per customer', () => {
    render(<PricingSection i18n={english} offer="byInvitation" />);

    expect(
      screen.getByText(
        '14 days free. The card is only charged on day 15, and you can cancel any time. One free trial per customer.',
      ),
    ).toBeInTheDocument();
  });

  describe('the price in the reader’s currency', () => {
    const RATES = { BRL: 5.7197, USD: 1.1253 };

    it('adds an approximate price in dollars under each period on the English page', () => {
      render(<PricingSection i18n={english} offer="byInvitation" euroRates={RATES} />);

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
      render(<PricingSection i18n={spanish} offer="byInvitation" euroRates={RATES} />);

      expect(
        screen.getByText(/^Precio en reales: unos 8\sUS\$ o 7\s€ al mes\./),
      ).toBeInTheDocument();
    });

    it('adds nothing on the Portuguese page, already in reais', () => {
      render(<PricingSection i18n={portuguese} offer="byInvitation" euroRates={RATES} />);

      expect(screen.queryByText(/Preço em reais: cerca de/)).toBeNull();
    });

    it('adds nothing while the exchange rates are unknown', () => {
      render(<PricingSection i18n={english} offer="byInvitation" />);

      expect(screen.queryByText(/Priced in reais/)).toBeNull();
    });
  });

  describe('once sign-up is open', () => {
    it('starts the free trial on the plan of the chosen period instead of asking by e-mail', () => {
      render(<PricingSection i18n={english} offer="trial" />);

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
      render(<PricingSection i18n={portuguese} offer="trial" />);

      expect(screen.getAllByRole('link', { name: 'Começar o teste grátis' })).toHaveLength(2);
      expect(
        screen.getByText(
          'Cadastre-se com um e-mail e um cartão; o painel abre assim que a assinatura é confirmada.',
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/acesso é por convite/)).toBeNull();
    });
  });

  describe('once the free plan is open', () => {
    function plans() {
      const section = screen.getByRole('region', {
        name: 'Two plans, in reais, with everything the demo shows on both',
      });
      const [free, paid] = within(section).getAllByRole('heading', { level: 3 });
      return { section, free, paid };
    }

    it('shows the free plan and the paid plan side by side, free first', () => {
      render(<PricingSection i18n={english} offer="free" />);

      const { section, free, paid } = plans();
      expect(section).toHaveAttribute('id', PRICING_ID);
      expect(free).toHaveTextContent('Free');
      expect(paid).toHaveTextContent('Paid');
      expect(within(section).getByText('R$ 0')).toBeInTheDocument();
      expect(within(section).getByText('R$ 39')).toBeInTheDocument();
      expect(within(section).getByRole('group', { name: 'Billing period' })).toBeInTheDocument();
    });

    it('lists the free plan in the same order as the paid one, with its pause and no card', () => {
      render(<PricingSection i18n={english} offer="free" />);

      const [free, paid] = within(plans().section)
        .getAllByRole('list')
        .map((list) =>
          within(list)
            .getAllByRole('listitem')
            .map((item) => item.textContent),
        );
      expect(free).toEqual([
        'Up to 10,000 events a month',
        'One site',
        'Only you in the dashboard',
        '13 months of history',
        'A weekly digest by e-mail',
        'The Claude connector (MCP) and access tokens for AI agents',
        'Measuring pauses at 10,000 events until the 1st, with an e-mail at 80%',
        'No card',
      ]);
      expect(paid?.[0]).toBe('Up to 100,000 events a month');
    });

    it('starts free from the free card and says how to subscribe from the paid one', () => {
      render(<PricingSection i18n={english} offer="free" />);

      const start = screen.getByRole('link', { name: 'Start free' });
      expect(start).toHaveAttribute('href', 'https://app.pyxis-analytics.dev/sign-up');
      expect(start).toHaveAttribute('data-track', 'sign_up_opened');
      expect(start).toHaveAttribute('data-track-from', PRICING_ID);
      expect(start).toHaveAttribute('data-track-plan', 'free');
      expect(screen.getAllByRole('link', { name: /Start/ })).toHaveLength(1);
      expect(
        screen.getByText(/^Everyone starts on the free plan: subscribe in Account and billing/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Sign up with an e-mail and no card: the dashboard opens at once, on the free plan.',
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/free trial|day 15|Request access/)).toBeNull();
      expect(screen.getByRole('heading', { name: 'For agencies and developers' })).toBeVisible();
    });

    it('says the free plan is full for now on its card, still leading to sign-up', () => {
      render(<PricingSection i18n={english} offer="freeFull" />);

      expect(screen.getByRole('link', { name: 'Start free' })).toBeInTheDocument();
      expect(screen.getByText(/^The free plan is full for now: sign up/)).toBeInTheDocument();
    });

    it('speaks the visitor’s language, in its numbers', () => {
      render(<PricingSection i18n={portuguese} offer="free" />);

      expect(screen.getByRole('heading', { name: 'Grátis' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Pago' })).toBeInTheDocument();
      expect(screen.getByText('Até 10.000 eventos por mês')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Começar grátis' })).toBeInTheDocument();
    });
  });
});
