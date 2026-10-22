import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { english } from '@/test-utils/english';
import { showcasePreview } from '@/test-utils/landing-preview';
import { portuguese } from '@/test-utils/portuguese';
import { LandingPreview } from './landing-preview';

describe('LandingPreview', () => {
  it('shows the demo project, the period and the Overview figures with their change', () => {
    render(<LandingPreview view={showcasePreview(english)} i18n={english} />);

    const preview = screen.getByRole('figure', { name: 'Preview of the Overview screen' });
    expect(preview).toHaveTextContent('MSMy site');
    expect(preview).toHaveTextContent('Last 30 days');
    expect(within(preview).getByText('Visits').nextElementSibling).toHaveTextContent('3,214');
    expect(within(preview).getByText('Write error rate')).toBeInTheDocument();
    const visits = showcasePreview(english).kpis.find((kpi) => kpi.id === 'visits');
    expect(within(preview).getByText(visits?.change ?? 'missing')).toHaveClass('text-ok');
  });

  it('draws both periods with a legend', () => {
    const { container } = render(<LandingPreview view={showcasePreview(english)} i18n={english} />);

    expect(container.querySelectorAll('polyline')).toHaveLength(2);
    expect(container.querySelector('circle')).not.toBeNull();
    expect(screen.getByText('This period')).toBeInTheDocument();
    expect(screen.getByText('Previous period')).toBeInTheDocument();
    expect(screen.getByText('Invented data, like the live demo.')).toBeInTheDocument();
  });

  it('puts the biggest drop-off of the funnel beside the write that fails most often', () => {
    render(<LandingPreview view={showcasePreview(english)} i18n={english} />);

    const facts = screen.getByRole('figure').querySelector('dl:last-of-type');
    expect(facts).not.toBeNull();
    const terms = within(facts as HTMLElement).getAllByRole('term');
    expect(terms.map((term) => term.textContent)).toEqual([
      'Biggest drop-off in the funnel',
      'Write that fails most often',
    ]);
    expect(
      within(facts as HTMLElement).getByText('signup_completed → order_created'),
    ).toBeVisible();
    expect(within(facts as HTMLElement).getByText('9.5% continued')).toHaveClass('text-bad');
    expect(within(facts as HTMLElement).getByText('POST /payouts')).toBeVisible();
    expect(within(facts as HTMLElement).getByText('10.2% failed')).toHaveClass('text-bad');
    const fills = facts?.querySelectorAll('.landing-preview-bar');
    expect(fills?.[0]).toHaveStyle({ width: `${String((4 / 42) * 100)}%` });
    expect(fills?.[1]).toHaveStyle({ width: `${String((6 / 59) * 100)}%` });
  });

  it('leaves out a fact the demo has no data for', () => {
    const view = { ...showcasePreview(english), dropOff: null, failingWrite: null };

    render(<LandingPreview view={view} i18n={english} />);

    expect(screen.queryByText('Biggest drop-off in the funnel')).not.toBeInTheDocument();
    expect(screen.queryByText('Write that fails most often')).not.toBeInTheDocument();
  });

  it('marks the parts that move as the page opens, and the figures that count up', () => {
    const { container } = render(<LandingPreview view={showcasePreview(english)} i18n={english} />);

    expect(screen.getByRole('figure')).toHaveAttribute('id', 'landing-preview');
    expect(screen.getByRole('figure')).toHaveClass('landing-preview');
    expect(container.querySelectorAll('[data-count]')).toHaveLength(4);
    expect(container.querySelector('.landing-preview-line')).toHaveAttribute('pathLength', '1');
    expect(container.querySelectorAll('.landing-preview-late')).toHaveLength(2);
    expect(container.querySelectorAll('.landing-preview-bar')).toHaveLength(2);
  });

  it('draws no end point for a period without visits', () => {
    const view = { ...showcasePreview(english), current: [], previous: [] };

    const { container } = render(<LandingPreview view={view} i18n={english} />);

    expect(container.querySelector('circle')).toBeNull();
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    render(<LandingPreview view={showcasePreview(portuguese)} i18n={portuguese} />);

    const preview = screen.getByRole('figure', { name: 'Prévia da tela Visão geral' });
    expect(preview).toHaveTextContent('MSMeu site');
    expect(preview).toHaveTextContent('Últimos 30 dias');
    expect(screen.getByText('Visitas').nextElementSibling).toHaveTextContent('3.214');
    expect(preview).toHaveTextContent('Dados fictícios, como na demonstração.');
  });
});
