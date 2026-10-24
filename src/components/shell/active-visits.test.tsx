import { act, cleanup, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { CLIENT_NAMESPACES, pickNamespaces } from '@/i18n/messages';
import { en } from '@/i18n/messages/en';
import { MessagesProvider } from '@/i18n/messages-provider';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { ActiveVisits } from './active-visits';
import { publishActiveVisits } from './arrival-news';

function publish(count: number | undefined) {
  act(() => {
    publishActiveVisits(count);
  });
}

describe('ActiveVisits', () => {
  afterEach(() => {
    cleanup();
    publishActiveVisits(undefined);
  });

  it('shows nothing before the first answer', () => {
    const { container } = renderWithMessages(<ActiveVisits />);

    expect(container).toBeEmptyDOMElement();
  });

  it('counts the visits on the site now with a dot that pings only when motion is welcome', () => {
    const { container } = renderWithMessages(<ActiveVisits />);

    publish(4);

    expect(screen.getByText('4 on the site now')).toBeInTheDocument();
    const ping = container.querySelector('.motion-safe\\:animate-ping');
    expect(ping).toHaveClass('bg-ok');
    expect(ping?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps a still, muted dot when nobody is on the site', () => {
    const { container } = renderWithMessages(<ActiveVisits />);

    publish(0);

    expect(screen.getByText('0 on the site now')).toBeInTheDocument();
    expect(container.querySelector('.motion-safe\\:animate-ping')).toBeNull();
    expect(container.querySelector('.bg-muted')).not.toBeNull();
  });

  it('changes with each answer and writes the number the way the language does', () => {
    renderWithMessages(<ActiveVisits />, 'pt-BR');

    publish(3);
    expect(screen.getByText('3 agora no site')).toBeInTheDocument();

    publish(1234);
    expect(screen.getByText('1.234 agora no site')).toBeInTheDocument();
  });

  it('draws nothing on the server', () => {
    publishActiveVisits(4);

    expect(
      renderToString(
        <MessagesProvider locale="en" messages={pickNamespaces(en, CLIENT_NAMESPACES)}>
          <ActiveVisits />
        </MessagesProvider>,
      ),
    ).toBe('');
  });
});
