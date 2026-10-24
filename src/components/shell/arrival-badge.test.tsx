import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { ArrivalBadge } from './arrival-badge';
import { publishArrivalNews } from './arrival-news';

function publish(news: Parameters<typeof publishArrivalNews>[0]) {
  act(() => {
    publishArrivalNews(news);
  });
}

describe('ArrivalBadge', () => {
  afterEach(() => {
    publish({});
  });

  it('shows what arrived for its screen, with the words for a screen reader', () => {
    render(<ArrivalBadge screen="visits" active={false} />);

    expect(document.body.textContent).toBe('');

    publish({ visits: { shown: '3', label: '3 new visits' } });

    expect(screen.getByText('3')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText(', 3 new visits')).toHaveClass('sr-only');
    expect(screen.getByText('3').parentElement).toHaveClass('bg-accent');
  });

  it('shows failed requests in the colour of a problem', () => {
    publish({ requests: { shown: '99+', label: 'More than 99 new failed requests' } });

    render(<ArrivalBadge screen="requests" active={false} />);

    expect(screen.getByText('99+').parentElement).toHaveClass('bg-bad');
  });

  it('shows nothing on the screen being shown', () => {
    publish({ visits: { shown: '3', label: '3 new visits' } });

    render(<ArrivalBadge screen="visits" active />);

    expect(document.body.textContent).toBe('');
  });

  it('draws nothing on the server', () => {
    publish({ visits: { shown: '3', label: '3 new visits' } });

    expect(renderToString(<ArrivalBadge screen="visits" active={false} />)).toBe('');
  });
});
