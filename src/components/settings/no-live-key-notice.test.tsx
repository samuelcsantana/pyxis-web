import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { english } from '@/test-utils/english';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { NoLiveKeyNotice } from './no-live-key-notice';

const navigation = vi.hoisted(() => ({ search: '' }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const NO_LIVE_KEY = 'This project has no live public key, so it is not measuring.';
const REVOKED_FOR_GOOD =
  "A revoked key never works again. When an account's access ends, its keys are revoked, and they stay revoked if the account comes back.";

describe('NoLiveKeyNotice', () => {
  beforeEach(() => {
    navigation.search = '';
  });

  it('tells the owner to create a key below, with no link', () => {
    renderWithMessages(<NoLiveKeyNotice step={{ kind: 'createBelow' }} i18n={english} />);

    expect(screen.getByText(NO_LIVE_KEY)).toBeInTheDocument();
    expect(screen.getByText(REVOKED_FOR_GOOD)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Create a public key below, then put it in place of the old one on your site.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('tells a reader that only the owner can create a key', () => {
    renderWithMessages(<NoLiveKeyNotice step={{ kind: 'ownerOnly' }} i18n={english} />);

    expect(screen.getByText(NO_LIVE_KEY)).toBeInTheDocument();
    expect(screen.getByText("Only the account's owner can create one.")).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('links to the keys in Settings, keeping the period and the filters of the page', () => {
    navigation.search = 'range=today&device=mobile';
    renderWithMessages(
      <NoLiveKeyNotice
        step={{ kind: 'createInSettings', keysHref: '/p1/settings/keys' }}
        i18n={english}
      />,
    );

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/p1/settings/keys?range=today&device=mobile',
    );
    expect(screen.getByRole('link', { name: 'Settings' }).parentElement).toHaveTextContent(
      'Create a public key in Settings, then put it in place of the old one on your site.',
    );
  });
});
