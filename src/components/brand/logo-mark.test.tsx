import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LogoMark } from './logo-mark';

describe('LogoMark', () => {
  it('is hidden from assistive technology when it is decorative', () => {
    const { container } = render(<LogoMark />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).toHaveAttribute('width', '40');
  });

  it('is announced as an image with its title when it carries meaning', () => {
    render(<LogoMark title="Pyxis" size={24} />);

    const image = screen.getByRole('img', { name: 'Pyxis' });

    expect(image).not.toHaveAttribute('aria-hidden');
    expect(image).toHaveAttribute('width', '24');
  });
});
