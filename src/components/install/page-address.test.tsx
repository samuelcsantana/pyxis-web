import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PageAddress } from './page-address';

const LABELS = { copy: 'Copy the address', copied: 'Copied', selected: 'Selected, press Ctrl+C' };

describe('PageAddress', () => {
  it('shows the address of the page it is on', () => {
    render(<PageAddress id="page-address" labels={LABELS} />);

    expect(document.getElementById('page-address')).toHaveTextContent(window.location.href);
  });

  it('copies that address', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<PageAddress id="page-address" labels={LABELS} />);

    await userEvent.click(screen.getByRole('button', { name: 'Copy the address' }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('renders no address on the server, where there is no page yet', () => {
    const html = renderToString(<PageAddress id="page-address" labels={LABELS} />);

    expect(html).toContain('<p id="page-address" class="m-0 break-all"></p>');
  });

  it('stops listening when it leaves the page', () => {
    const { unmount } = render(<PageAddress id="page-address" labels={LABELS} />);

    unmount();

    expect(document.getElementById('page-address')).toBeNull();
  });
});
