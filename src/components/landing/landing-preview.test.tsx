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
    expect(preview).toHaveTextContent('Demo Store');
    expect(preview).toHaveTextContent('Last 30 days');
    expect(within(preview).getByText('Visits').nextElementSibling).toHaveTextContent('3,214');
    expect(within(preview).getByText('Write error rate')).toBeInTheDocument();
    const visits = showcasePreview(english).kpis.find((kpi) => kpi.id === 'visits');
    expect(within(preview).getByText(visits?.change ?? 'missing')).toHaveClass('text-ok');
  });

  it('draws both periods with a legend, and the top pages sized against the first', () => {
    const { container } = render(<LandingPreview view={showcasePreview(english)} i18n={english} />);

    expect(container.querySelectorAll('polyline')).toHaveLength(2);
    expect(container.querySelector('circle')).not.toBeNull();
    expect(screen.getByText('This period')).toBeInTheDocument();
    expect(screen.getByText('Previous period')).toBeInTheDocument();
    const pricing = screen.getByText('/pricing').closest('li');
    expect(pricing?.querySelector('[aria-hidden="true"]')).toHaveStyle({ width: '100%' });
    expect(screen.getByText('Invented data, like the live demo.')).toBeInTheDocument();
  });

  it('marks the parts that move as the page opens, and the figures that count up', () => {
    const { container } = render(<LandingPreview view={showcasePreview(english)} i18n={english} />);

    expect(screen.getByRole('figure')).toHaveAttribute('id', 'landing-preview');
    expect(screen.getByRole('figure')).toHaveClass('landing-preview');
    expect(container.querySelectorAll('[data-count]')).toHaveLength(4);
    expect(container.querySelector('.landing-preview-line')).toHaveAttribute('pathLength', '1');
    expect(container.querySelectorAll('.landing-preview-late')).toHaveLength(2);
    expect(container.querySelectorAll('.landing-preview-bar')).toHaveLength(3);
  });

  it('draws no end point for a period without visits', () => {
    const view = { ...showcasePreview(english), current: [], previous: [] };

    const { container } = render(<LandingPreview view={view} i18n={english} />);

    expect(container.querySelector('circle')).toBeNull();
  });

  it('speaks Brazilian Portuguese on the Portuguese page', () => {
    render(<LandingPreview view={showcasePreview(portuguese)} i18n={portuguese} />);

    expect(screen.getByRole('figure', { name: 'Prévia da tela Visão geral' })).toHaveTextContent(
      'Últimos 30 dias',
    );
    expect(screen.getByText('Visitas').nextElementSibling).toHaveTextContent('3.214');
  });
});
