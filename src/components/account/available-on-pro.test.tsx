import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PRO_FEATURES } from '@/domain/pro-features';
import { english } from '@/test-utils/english';
import { AvailableOnPro } from './available-on-pro';

describe('AvailableOnPro', () => {
  it('names the feature and sends the owner to subscribe in Account and billing', () => {
    render(<AvailableOnPro i18n={english} feature="slack_alerts" viewer="owner" />);

    expect(screen.getByRole('region', { name: 'Available on Pro' })).toBeVisible();
    expect(
      screen.getByText(
        'Sending alerts to Slack is part of the Pro plan, from R$ 39 a month. The rest of the dashboard stays as it is.',
      ),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'See the Pro plan' })).toHaveAttribute(
      'href',
      '/account',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('tells an invited person that only the owner subscribes, with no link to billing', () => {
    render(<AvailableOnPro i18n={english} feature="public_share_link" viewer="member" />);

    expect(
      screen.getByText('Only the account owner can subscribe, in Account and billing.'),
    ).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('says out loud that the API refused the action for the plan', () => {
    render(<AvailableOnPro i18n={english} feature="ga4_import" viewer="owner" refused />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Pyxis did not do it: this needs the Pro plan.',
    );
  });

  it.each(PRO_FEATURES)('has a name for %s', (feature) => {
    const { container } = render(
      <AvailableOnPro i18n={english} feature={feature} viewer="member" />,
    );

    expect(container.textContent).not.toContain('availableOnPro.');
    expect(container.textContent).not.toContain('{feature}');
  });
});
