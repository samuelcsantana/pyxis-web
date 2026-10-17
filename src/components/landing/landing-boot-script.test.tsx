import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { landingBootScript } from '@/lib/landing-boot';
import { LandingBootScript } from './landing-boot-script';

describe('LandingBootScript', () => {
  it('applies the preferences kept on the device under the nonce of the response', () => {
    const { container } = render(<LandingBootScript nonce="dGVzdC1ub25jZQ==" />);

    const script = container.querySelector('script');
    expect(script).toHaveAttribute('nonce', 'dGVzdC1ub25jZQ==');
    expect(script?.textContent).toBe(landingBootScript());
  });
});
