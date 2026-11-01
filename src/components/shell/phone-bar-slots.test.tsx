import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { InPhoneBar, PhoneBarSlotsProvider, usePhoneBarHostSetter } from './phone-bar-slots';

function SetterReader({ onRender }: { readonly onRender: () => void }) {
  usePhoneBarHostSetter('period');
  onRender();
  return null;
}

function TogglingHost() {
  const setHost = usePhoneBarHostSetter('period');
  const [shown, setShown] = useState(true);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShown(!shown);
        }}
      >
        Toggle
      </button>
      {shown ? <div data-testid="host" ref={setHost} /> : null}
    </>
  );
}

describe('PhoneBarSlotsProvider', () => {
  it('keeps the same context while hosts come and go, so nothing around the page renders again', () => {
    const onRender = vi.fn();
    render(
      <PhoneBarSlotsProvider>
        <SetterReader onRender={onRender} />
        <TogglingHost />
        <InPhoneBar slot="period">Seven days</InPhoneBar>
      </PhoneBarSlotsProvider>,
    );

    expect(screen.getByTestId('host')).toHaveTextContent('Seven days');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));

    expect(screen.queryByText('Seven days')).not.toBeInTheDocument();
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  it('portals nothing in the page the server sends, which has no sheet open', () => {
    const html = renderToString(
      <PhoneBarSlotsProvider>
        <TogglingHost />
        <InPhoneBar slot="period">Seven days</InPhoneBar>
      </PhoneBarSlotsProvider>,
    );

    expect(html).not.toContain('Seven days');
  });

  it('portals nothing without a provider', () => {
    render(<InPhoneBar slot="filters">Country: Brazil</InPhoneBar>);

    expect(screen.queryByText('Country: Brazil')).not.toBeInTheDocument();
  });
});
