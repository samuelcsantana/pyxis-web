import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  NavigationPendingProvider,
  NavigationRegion,
  useHoldNavigationWhile,
} from './navigation-pending';

function Holder({ pending }: { readonly pending: boolean }) {
  useHoldNavigationWhile(pending);
  return null;
}

function region() {
  return screen.getByText('screen').parentElement;
}

function Screen({ holders }: { readonly holders: readonly boolean[] }) {
  return (
    <NavigationPendingProvider>
      {holders.map((pending, index) => (
        <Holder key={index} pending={pending} />
      ))}
      <NavigationRegion className="flex">
        <p>screen</p>
      </NavigationRegion>
    </NavigationPendingProvider>
  );
}

describe('NavigationRegion', () => {
  it('keeps its own classes and is neither busy nor navigating at rest', () => {
    render(<Screen holders={[false]} />);

    expect(region()).toHaveClass('flex');
    expect(region()).not.toHaveAttribute('aria-busy');
    expect(region()).not.toHaveAttribute('data-navigating');
  });

  it('is busy while a navigation is held and at rest again once it is released', () => {
    const view = render(<Screen holders={[false]} />);

    view.rerender(<Screen holders={[true]} />);
    expect(region()).toHaveAttribute('aria-busy', 'true');
    expect(region()).toHaveAttribute('data-navigating', '');

    view.rerender(<Screen holders={[false]} />);
    expect(region()).not.toHaveAttribute('aria-busy');
  });

  it('stays busy until every held navigation is released, also by unmounting', () => {
    const view = render(<Screen holders={[true, true]} />);

    view.rerender(<Screen holders={[true]} />);
    expect(region()).toHaveAttribute('aria-busy', 'true');

    view.rerender(<Screen holders={[]} />);
    expect(region()).not.toHaveAttribute('aria-busy');
  });

  it('is never busy outside a provider, where holding a navigation changes nothing', () => {
    const view = render(
      <>
        <Holder pending />
        <NavigationRegion className="flex">
          <p>screen</p>
        </NavigationRegion>
      </>,
    );

    expect(region()).not.toHaveAttribute('aria-busy');
    view.unmount();
  });
});
