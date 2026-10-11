import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { ErrorScreen } from './error-screen';
import { errorTexts } from './error-texts';

describe('ErrorScreen', () => {
  it('heads the page with the error, under the logo, over the brand backdrop', () => {
    render(
      <ErrorScreen texts={errorTexts(new Error('boom'), english.t)} retry={() => undefined} />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Could not load this data' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent(/^Pyxis/);
    expect(screen.getByTestId('brand-backdrop')).toBeInTheDocument();
  });

  it('retries on demand', async () => {
    const retry = vi.fn();
    render(<ErrorScreen texts={errorTexts(new Error('boom'), english.t)} retry={retry} />);

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(retry).toHaveBeenCalledOnce();
  });
});
