import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('is a group named by its label, not a landmark region', () => {
    render(<StatCard id="paid-visits" label="Paid visits" value="829" note="34.7% of 2,390" />);

    expect(screen.getByRole('group', { name: 'Paid visits' })).toHaveTextContent('829');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});
