import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NoCodeHelp } from './no-code-help';

const MESSAGE =
  '<strong>Nothing after a few minutes?</strong> Check your spam folder. This e-mail may not have a Pyxis account yet.';
const SUPPORT =
  'Already have an account and the code does not arrive? Write to <mail>hello@pyxis-analytics.dev</mail> from this address.';
const PLANS = { label: 'See the plans', href: 'https://pyxis-analytics.dev/#pricing' };

describe('NoCodeHelp', () => {
  it('says the e-mail may have no account, without saying whether it has one', () => {
    render(<NoCodeHelp message={MESSAGE} support={SUPPORT} plans={PLANS} />);

    expect(screen.getByText('Nothing after a few minutes?').tagName).toBe('STRONG');
    expect(screen.getByText(/may not have a Pyxis account yet/)).toBeInTheDocument();
  });

  it('gives whoever already has an account the support address, as an e-mail link', () => {
    render(<NoCodeHelp message={MESSAGE} support={SUPPORT} plans={PLANS} />);

    expect(screen.getByRole('link', { name: 'hello@pyxis-analytics.dev' })).toHaveAttribute(
      'href',
      'mailto:hello@pyxis-analytics.dev',
    );
    expect(
      screen.getByText(/Already have an account and the code does not arrive\?/),
    ).toBeInTheDocument();
  });

  it('leads to the plans, and to sign-up only when it is open', () => {
    const { rerender } = render(<NoCodeHelp message={MESSAGE} support={SUPPORT} plans={PLANS} />);

    expect(screen.getByRole('link', { name: 'See the plans' })).toHaveAttribute(
      'href',
      'https://pyxis-analytics.dev/#pricing',
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);

    rerender(
      <NoCodeHelp
        message={MESSAGE}
        support={SUPPORT}
        plans={PLANS}
        signUp={{ label: 'Try it free for 14 days', href: '/sign-up' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'Try it free for 14 days' })).toHaveAttribute(
      'href',
      '/sign-up',
    );
  });
});
