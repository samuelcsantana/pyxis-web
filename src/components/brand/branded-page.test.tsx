import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandedPage } from './branded-page';

describe('BrandedPage', () => {
  it('draws the brand backdrop behind the page and raises its card', () => {
    render(
      <BrandedPage>
        <section>Page not found</section>
      </BrandedPage>,
    );

    expect(screen.getByTestId('brand-backdrop')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass(
      '[&>section]:border-line-strong',
      '[&>section]:shadow-raised',
    );
    expect(screen.getByRole('main')).toHaveTextContent(/^Pyxis/);
  });
});
