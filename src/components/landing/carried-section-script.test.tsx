import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { carriedSectionScript } from '@/lib/carried-section';
import { CarriedSectionScript } from './carried-section-script';

describe('CarriedSectionScript', () => {
  it('runs the opening on the carried section under the nonce of the response', () => {
    const { container } = render(<CarriedSectionScript nonce="dGVzdC1ub25jZQ==" />);

    const script = container.querySelector('script');
    expect(script).toHaveAttribute('nonce', 'dGVzdC1ub25jZQ==');
    expect(script?.textContent).toBe(carriedSectionScript());
  });
});
