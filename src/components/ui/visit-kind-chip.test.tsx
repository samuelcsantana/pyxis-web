import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { visitKindBadge } from '@/domain/visit-kind';
import { english } from '@/test-utils/english';
import { VisitKindChip } from './visit-kind-chip';

describe('VisitKindChip', () => {
  it('names the kind and says, to the pointer and to a screen reader, that it counted', () => {
    render(<VisitKindChip kind={visitKindBadge('first_visit', english)} />);

    const chip = screen.getByText('New visitor');
    expect(chip).toHaveAttribute('title', 'Counted in the day’s unique visitors');
    expect(chip).toHaveTextContent('New visitor. Counted in the day’s unique visitors');
    expect(chip).toHaveClass('bg-soft');
  });

  it('draws a visit that did not count as an outline', () => {
    render(<VisitKindChip kind={visitKindBadge('again_today', english)} className="ml-1.5" />);

    const chip = screen.getByText('Again today');
    expect(chip).toHaveAttribute('title', 'Not counted: this browser had already come today');
    expect(chip).toHaveClass('border', 'ml-1.5');
    expect(chip).not.toHaveClass('bg-soft');
  });

  it('draws nothing for a visit without a kind', () => {
    const { container } = render(<VisitKindChip kind={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
